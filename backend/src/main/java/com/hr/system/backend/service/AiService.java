package com.hr.system.backend.service;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.JobPosting;

import java.util.List;

public interface AiService {
    Candidate screenCandidate(Candidate candidate, JobPosting job);

    List<String> generateInterviewQuestions(Candidate candidate, JobPosting job);

    String compareCandidates(List<Candidate> candidates, JobPosting job);

    String handleCopilotChat(String userMessage);
}
