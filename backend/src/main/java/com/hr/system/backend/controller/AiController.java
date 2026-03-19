package com.hr.system.backend.controller;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.JobPosting;
import com.hr.system.backend.repository.CandidateRepository;
import com.hr.system.backend.repository.JobRepository;
import com.hr.system.backend.service.AiService;
import com.hr.system.backend.service.GeminiService;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.hr.system.backend.dto.CopilotRequest;
import com.hr.system.backend.dto.CopilotResponse;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired(required = false)
    private GeminiService geminiService;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    /**
     * Screen existing candidate profile against a job (uses URL/role info).
     */
    @PostMapping("/screen-candidate/{candidateId}")
    public ResponseEntity<Candidate> screenCandidate(@PathVariable String candidateId, @RequestParam Long jobId) {
        Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
        JobPosting job = jobRepository.findById(jobId).orElse(null);

        if (candidate == null || job == null) {
            return ResponseEntity.notFound().build();
        }

        Candidate screenedCandidate = aiService.screenCandidate(candidate, job);
        candidateRepository.save(screenedCandidate);

        return ResponseEntity.ok(screenedCandidate);
    }

    /**
     * Upload a PDF or DOCX resume, extract text, and run AI analysis.
     */
    @PostMapping("/analyze-resume/{candidateId}")
    public ResponseEntity<Candidate> analyzeResume(
            @PathVariable String candidateId,
            @RequestParam Long jobId,
            @RequestParam("file") MultipartFile file) {
        try {
            Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
            JobPosting job = jobRepository.findById(jobId).orElse(null);

            if (candidate == null || job == null) {
                return ResponseEntity.notFound().build();
            }

            // Extract text from the uploaded file (PDF, DOCX, TXT, etc.)
            Tika tika = new Tika();
            String resumeText = tika.parseToString(file.getInputStream());

            if (resumeText == null || resumeText.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            Candidate screenedCandidate;
            if (geminiService != null) {
                // Use the rich resume-text-aware method
                screenedCandidate = geminiService.screenCandidateWithText(candidate, job, resumeText);
            } else {
                // Fallback to basic AI service
                screenedCandidate = aiService.screenCandidate(candidate, job);
            }

            candidateRepository.save(screenedCandidate);
            return ResponseEntity.ok(screenedCandidate);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/interview-questions/{candidateId}")
    public ResponseEntity<java.util.List<String>> getInterviewQuestions(@PathVariable String candidateId, @RequestParam Long jobId) {
        Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
        JobPosting job = jobRepository.findById(jobId).orElse(null);

        if (candidate == null || job == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(aiService.generateInterviewQuestions(candidate, job));
    }

    @GetMapping("/compare-candidates")
    public ResponseEntity<String> compareCandidates(@RequestParam java.util.List<String> ids, @RequestParam Long jobId) {
        JobPosting job = jobRepository.findById(jobId).orElse(null);
        java.util.List<Candidate> candidates = candidateRepository.findAllById(ids);

        if (job == null || candidates.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(aiService.compareCandidates(candidates, job));
    }

    @PostMapping("/copilot")
    public ResponseEntity<CopilotResponse> copilotChat(@RequestBody CopilotRequest request) {
        String responseText;
        if (geminiService != null) {
            responseText = geminiService.handleCopilotChat(request.getMessage());
        } else {
            responseText = aiService.handleCopilotChat(request.getMessage());
        }
        return ResponseEntity.ok(new CopilotResponse(responseText));
    }
}
