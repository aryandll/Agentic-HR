package com.hr.system.backend.controller;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.service.CandidateService;
import com.hr.system.backend.dto.HireRequest;
import com.hr.system.backend.dto.HireResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @PostMapping
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        return candidateService.createCandidate(candidate);
    }

    /**
     * Public application endpoint: submit name, email, role, and optionally a resume file.
     */
    @PostMapping("/apply")
    public ResponseEntity<Candidate> applyWithResume(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "department", defaultValue = "General") String department,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Candidate candidate = new Candidate();
            candidate.setName(name);
            candidate.setEmail(email);
            candidate.setRole(role);
            candidate.setDepartment(department);
            candidate.setStatus("Applied");

            if (file != null && !file.isEmpty()) {
                // Store the original filename as a reference (not saved to disk in this demo)
                candidate.setResumeUrl(file.getOriginalFilename());

                // Extract and store the text from the resume
                try {
                    org.apache.tika.Tika tika = new org.apache.tika.Tika();
                    String resumeText = tika.parseToString(file.getInputStream());
                    candidate.setResumeText(resumeText);
                } catch (Exception tikaException) {
                    System.err.println("Failed to extract text from resume: " + tikaException.getMessage());
                }
            }

            Candidate saved = candidateService.createCandidate(candidate);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/status")
    public Candidate updateStatus(@PathVariable("id") String id, @RequestParam("status") String status) {
        return candidateService.updateCandidateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteCandidate(@PathVariable("id") String id) {
        candidateService.deleteCandidate(id);
    }

    // Comprehensive hire endpoint - creates employee, payslip, and onboarding tasks
    @PostMapping("/{id}/hire")
    public ResponseEntity<HireResponse> hireCandidate(
            @PathVariable("id") String id,
            @RequestBody HireRequest request) {
        try {
            HireResponse response = candidateService.hireCandidate(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
