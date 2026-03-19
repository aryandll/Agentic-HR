package com.hr.system.backend.service;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.JobPosting;
import com.hr.system.backend.repository.CandidateRepository;
import com.hr.system.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AutoScreeningService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private AiService aiService;

    // Run every 30 seconds for demo purposes
    @Scheduled(fixedRate = 30000)
    public void autoScreenCandidates() {
        System.out.println("🤖 Nexus Auto-Recruiter: Scanning for new candidates...");
        
        List<Candidate> appliedCandidates = candidateRepository.findByStatus("Applied");
        List<JobPosting> jobs = jobRepository.findAll();

        if (appliedCandidates.isEmpty()) {
             System.out.println("🤖 Nexus Auto-Recruiter: No new candidates found.");
             return;
        }

        for (Candidate candidate : appliedCandidates) {
            // Simple logic to find a relevant job
            JobPosting relevantJob = jobs.stream()
                .filter(job -> job.getTitle().toLowerCase().contains(candidate.getRole().toLowerCase()) ||
                               candidate.getRole().toLowerCase().contains(job.getTitle().toLowerCase()))
                .findFirst()
                .orElse(null);

            if (relevantJob != null) {
                System.out.println("🤖 Analyzing " + candidate.getName() + " for position " + relevantJob.getTitle() + "...");
                
                Candidate screened;
                if (candidate.getResumeText() != null && !candidate.getResumeText().isEmpty()) {
                    screened = ((GeminiService) aiService).screenCandidateWithText(candidate, relevantJob, candidate.getResumeText());
                } else {
                    screened = aiService.screenCandidate(candidate, relevantJob);
                }

                
                // Autonomous Decision Making
                if (screened.getAiScore() != null && screened.getAiScore() >= 80) {
                    screened.setStatus("Screening"); // Auto-promote
                    screened.setAiFeedback(screened.getAiFeedback() + "\n\n[AUTO-PROMOTED BY NEXUS AI AGENT]");
                    System.out.println("✨ HIGH POTENTIAL: Auto-promoting " + candidate.getName());
                } else if (screened.getAiScore() < 40) {
                     // screened.setStatus("Rejected"); // Optional: Auto-reject
                     System.out.println("⚠️ LOW MATCH: Flagging " + candidate.getName() + " for review.");
                }

                candidateRepository.save(screened);
            }
        }
    }
}
