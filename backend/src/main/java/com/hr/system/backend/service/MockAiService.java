package com.hr.system.backend.service;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "gemini.api-key", matchIfMissing = true, havingValue = "false")
public class MockAiService implements AiService {

    @Override
    public Candidate screenCandidate(Candidate candidate, JobPosting job) {
        // Mock logic: Simple keyword matching or random scoring for demo
        int score = calculateMockScore(candidate, job);
        String feedback = generateMockFeedback(score, candidate, job);

        candidate.setAiScore(score);
        candidate.setAiFeedback(feedback);

        return candidate;
    }

    private int calculateMockScore(Candidate candidate, JobPosting job) {
        // logic based on role matching
        if (candidate.getRole() != null && job.getTitle() != null && 
            job.getTitle().toLowerCase().contains(candidate.getRole().toLowerCase())) {
            return 85 + new Random().nextInt(15); // 85-99
        }
        return 40 + new Random().nextInt(40); // 40-79
    }

    private String generateMockFeedback(int score, Candidate candidate, JobPosting job) {
        if (score >= 85) {
            return "Strong Match: Candidate's role aligns well with the job title. Recommended for interview.";
        } else if (score >= 60) {
            return "Potential Match: Some skills overlap, but experience level might differ. Review resume.";
        } else {
            return "Low Match: Role mismatch detected. Candidate might not have required expertise.";
        }
    }
    @Override
    public java.util.List<String> generateInterviewQuestions(Candidate candidate, JobPosting job) {
        // Mock logic: return questions based on role
        if (job.getTitle().toLowerCase().contains("designer")) {
             return java.util.Arrays.asList(
                "Can you walk us through your portfolio piece '" + candidate.getRole() + "'?",
                "How do you handle feedback from non-designers?",
                "What tools do you use for prototyping?"
             );
        } else if (job.getTitle().toLowerCase().contains("developer") || job.getTitle().toLowerCase().contains("engineer")) {
             return java.util.Arrays.asList(
                "Explain a complex technical challenge you solved recently.",
                "How do you approach testing in your development workflow?",
                "What is your experience with our tech stack?"
             );
        }
        return java.util.Arrays.asList(
            "Tell me about your experience as a " + candidate.getRole(),
            "What are your greatest strengths?",
            "Where do you see yourself in 5 years?"
        );
    }

    @Override
    public String compareCandidates(java.util.List<Candidate> candidates, JobPosting job) {
        if (candidates.size() < 2) return "Need at least 2 candidates to compare.";
        
        Candidate c1 = candidates.get(0);
        Candidate c2 = candidates.get(1);
        
        int s1 = c1.getAiScore() != null ? c1.getAiScore() : calculateMockScore(c1, job);
        int s2 = c2.getAiScore() != null ? c2.getAiScore() : calculateMockScore(c2, job);

        StringBuilder sb = new StringBuilder();
        sb.append("**Comparison Analysis**\n\n");
        sb.append("- **").append(c1.getName()).append("**: Score ").append(s1).append("/100\n");
        sb.append("- **").append(c2.getName()).append("**: Score ").append(s2).append("/100\n\n");
        
        if (s1 > s2) {
            sb.append("👉 **Recommendation**: ").append(c1.getName()).append(" matches the job requirements better.");
        } else if (s2 > s1) {
            sb.append("👉 **Recommendation**: ").append(c2.getName()).append(" seems to be the stronger candidate.");
        } else {
             sb.append("👉 **Result**: Both candidates are equally qualified.");
        }
        return sb.toString();
    }

    @Override
    public String handleCopilotChat(String userMessage) {
        return "Mock Copilot: Please add a valid Gemini API key to your properties file to enable agentic copilot capabilities.";
    }
}
