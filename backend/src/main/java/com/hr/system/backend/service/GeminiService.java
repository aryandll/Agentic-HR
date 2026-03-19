package com.hr.system.backend.service;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.JobPosting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "gemini.api-key")
public class GeminiService implements AiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    private final RestClient restClient;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public GeminiService(com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }

    @Override
    public Candidate screenCandidate(Candidate candidate, JobPosting job) {
        String prompt = String.format(
                "You are an expert HR recruiter. Analyze this candidate for the job posting and respond ONLY with a valid JSON object (no markdown, no code blocks, just raw JSON).\n"
                        +
                        "Job Title: %s\nJob Description: %s\n" +
                        "Candidate Name: %s\nCandidate Role: %s\nResume/Portfolio URL: %s\n" +
                        "Respond with ONLY this JSON: {\"score\": <integer 0-100>, \"feedback\": \"<2-3 sentence analysis citing specific requirements from the Job Description and how the candidate matches or misses them>\"}",
                job.getTitle(), job.getDescription(),
                candidate.getName(), candidate.getRole(), candidate.getResumeUrl());

        String rawResponse = callGemini(prompt);
        String cleanJson = cleanMarkdown(rawResponse);

        try {
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(cleanJson);
            if (root.has("score"))
                candidate.setAiScore(root.get("score").asInt());
            if (root.has("feedback"))
                candidate.setAiFeedback(root.get("feedback").asText());
        } catch (Exception e) {
            candidate.setAiFeedback(cleanJson.isEmpty() ? "Analysis unavailable." : cleanJson);
            candidate.setAiScore(50);
        }
        return candidate;
    }

    /**
     * Screen a candidate using the actual extracted text from their uploaded
     * resume.
     */
    public Candidate screenCandidateWithText(Candidate candidate, JobPosting job, String resumeText) {
        String prompt = String.format(
                "You are an expert HR recruiter. Analyze this candidate's resume content for the job posting and respond ONLY with a valid JSON object (no markdown, no code blocks, just raw JSON).\n"
                        +
                        "Job Title: %s\nJob Description: %s\n" +
                        "Candidate Name: %s\nCandidate Role: %s\n" +
                        "--- RESUME CONTENT ---\n%s\n--- END RESUME ---\n" +
                        "Respond with ONLY this JSON: {\"score\": <integer 0-100>, \"feedback\": \"<3-4 sentence analysis citing specific requirements from the Job Description and how they appear in the resume text>\"}",
                job.getTitle(), job.getDescription(),
                candidate.getName(), candidate.getRole(),
                resumeText.length() > 3000 ? resumeText.substring(0, 3000) : resumeText);

        String rawResponse = callGemini(prompt);
        String cleanJson = cleanMarkdown(rawResponse);

        try {
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(cleanJson);
            if (root.has("score"))
                candidate.setAiScore(root.get("score").asInt());
            if (root.has("feedback"))
                candidate.setAiFeedback(root.get("feedback").asText());
        } catch (Exception e) {
            candidate.setAiFeedback(cleanJson.isEmpty() ? "Analysis unavailable." : cleanJson);
            candidate.setAiScore(50);
        }
        return candidate;
    }

    @Override
    public List<String> generateInterviewQuestions(Candidate candidate, JobPosting job) {
        String prompt = String.format(
                "Generate 3 hard, specific interview questions for %s applying for %s. JSON array of strings.",
                candidate.getName(), job.getTitle());
        String rawResponse = callGemini(prompt);
        String cleanJson = cleanMarkdown(rawResponse);
        try {
            return objectMapper.readValue(cleanJson, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return List.of(cleanJson.split("\n"));
        }
    }

    @Override
    public String compareCandidates(List<Candidate> candidates, JobPosting job) {
        StringBuilder sb = new StringBuilder("Compare these candidates for " + job.getTitle() + ":\n");
        for (Candidate c : candidates) {
            sb.append("- ").append(c.getName()).append(" (").append(c.getRole()).append(")\n");
        }
        sb.append("Which one is better and why? Keep it concise.");
        return callGemini(sb.toString());
    }

    private String cleanMarkdown(String text) {
        if (text == null)
            return "";
        String clean = text.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        return clean.trim();
    }

    private String callGemini(String prompt) {
        try {
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            String response = restClient.post()
                    .uri("/" + model + ":generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return extractContent(response);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Gemini: " + e.getMessage();
        }
    }

    private String extractContent(String jsonResponse) {
        try {
            // Parse the full Gemini API response envelope with Jackson
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(jsonResponse);
            // Navigate: candidates[0] -> content -> parts[0] -> text
            com.fasterxml.jackson.databind.JsonNode text = root
                    .path("candidates").path(0)
                    .path("content").path("parts").path(0)
                    .path("text");
            if (!text.isMissingNode() && !text.isNull()) {
                return text.asText(); // Jackson automatically unescapes the string
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Analysis unavailable.";
    }

    @Override
    public String handleCopilotChat(String userMessage) {
        try {
            // Construct the tool declarations
            Map<String, Object> toolDeclarations = new HashMap<>();

            // 1. findCandidates
            Map<String, Object> findCandidatesParams = new HashMap<>();
            findCandidatesParams.put("type", "OBJECT");
            findCandidatesParams.put("properties", Map.of(
                    "name", Map.of("type", "STRING", "description", "The exact or partial name of a candidate to search for."),
                    "role", Map.of("type", "STRING", "description", "The role to filter by, e.g. Frontend, Backend, Designer"),
                    "status", Map.of("type", "STRING", "description", "The status to filter by, e.g. Applied, Interview")
            ));
            Map<String, Object> findCandidatesFunc = new HashMap<>();
            findCandidatesFunc.put("name", "findCandidates");
            findCandidatesFunc.put("description", "Finds currently active candidates based on name, role or status. Returns candidate details including their parsed resume text, which you should use to answer specific questions about their experience or skills. You can search for a specific person by providing their name.");
            findCandidatesFunc.put("parameters", findCandidatesParams);

            // 2. updateStatus
            Map<String, Object> updateStatusParams = new HashMap<>();
            updateStatusParams.put("type", "OBJECT");
            updateStatusParams.put("properties", Map.of(
                    "candidateId", Map.of("type", "STRING", "description", "The ID of the candidate"),
                    "status", Map.of("type", "STRING", "description", "The new status: Applied, Screening, Interview, Offer, Hired, Rejected")
            ));
            updateStatusParams.put("required", List.of("candidateId", "status"));
            Map<String, Object> updateStatusFunc = new HashMap<>();
            updateStatusFunc.put("name", "updateCandidateStatus");
            updateStatusFunc.put("description", "Updates the recruitment stage/status of a specific candidate.");
            updateStatusFunc.put("parameters", updateStatusParams);

            // 3. sendEmail
            Map<String, Object> sendEmailParams = new HashMap<>();
            sendEmailParams.put("type", "OBJECT");
            sendEmailParams.put("properties", Map.of(
                    "candidateId", Map.of("type", "STRING", "description", "The ID of the candidate to email"),
                    "subject", Map.of("type", "STRING", "description", "The email subject"),
                    "body", Map.of("type", "STRING", "description", "The email body/draft")
            ));
            sendEmailParams.put("required", List.of("candidateId", "subject", "body"));
            Map<String, Object> sendEmailFunc = new HashMap<>();
            sendEmailFunc.put("name", "sendEmail");
            sendEmailFunc.put("description", "Drafts and sends an email to a candidate (use this for rejections or invitations).");
            sendEmailFunc.put("parameters", sendEmailParams);

            toolDeclarations.put("functionDeclarations", List.of(findCandidatesFunc, updateStatusFunc, sendEmailFunc));

            // Tool config to auto-call
            Map<String, Object> systemInstruction = new HashMap<>();
            systemInstruction.put("parts", List.of(Map.of("text", "You are an autonomous HR Copilot. You can find candidates, read their parsed resumes, update their statuses, and draft emails for them. Use your tools to fulfill the recruiter's command. If a recruiter asks you questions about a candidate's experience or resume, use the findCandidates tool to retrieve their profile and resume text, then answer the question based on that text.")));

            // Initial Chat Message
            List<Map<String, Object>> contents = new java.util.ArrayList<>();
            contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", userMessage))));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("systemInstruction", systemInstruction);
            requestBody.put("tools", List.of(toolDeclarations));

            int maxTurns = 5;
            for (int i = 0; i < maxTurns; i++) {
                requestBody.put("contents", contents);

                String response = restClient.post()
                        .uri("/" + model + ":generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(String.class);

                com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(response);
                com.fasterxml.jackson.databind.JsonNode candidateNode = root.path("candidates").path(0);
                com.fasterxml.jackson.databind.JsonNode partsNode = candidateNode.path("content").path("parts");
                
                if (partsNode.isMissingNode() || partsNode.isEmpty()) {
                    return "Sorry, I am unable to process that request.";
                }

                com.fasterxml.jackson.databind.JsonNode part = partsNode.get(0);

                if (part.has("functionCall")) {
                    com.fasterxml.jackson.databind.JsonNode functionCall = part.get("functionCall");
                    String functionName = functionCall.get("name").asText();
                    com.fasterxml.jackson.databind.JsonNode args = functionCall.get("args");

                    // Add assistant's tool call to history
                    Map<String, Object> modelPart = new HashMap<>();
                    modelPart.put("functionCall", objectMapper.convertValue(functionCall, Map.class));
                    contents.add(Map.of("role", "model", "parts", List.of(modelPart)));

                    // Execute local tool mapping
                    Object functionResult = executeTool(functionName, args);

                    // Add tool response to history
                    Map<String, Object> toolResponsePart = new HashMap<>();
                    Map<String, Object> funcResp = new HashMap<>();
                    funcResp.put("name", functionName);
                    Map<String, Object> resObj = new HashMap<>();
                    resObj.put("result", functionResult);
                    funcResp.put("response", resObj);
                    toolResponsePart.put("functionResponse", funcResp);

                    contents.add(Map.of("role", "user", "parts", List.of(toolResponsePart)));

                } else if (part.has("text")) {
                    return part.get("text").asText();
                } else {
                    return "Unexpected response format from AI.";
                }
            }
            
            return "AI thought for too long without returning an answer.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Gemini Copilot: " + e.getMessage();
        }
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.hr.system.backend.repository.CandidateRepository candidateRepository;

    private Object executeTool(String name, com.fasterxml.jackson.databind.JsonNode args) {
        System.out.println("Executing Tool: " + name + " with args: " + args.toString());
        try {
            if ("findCandidates".equals(name)) {
                String searchedName = args.has("name") ? args.get("name").asText() : null;
                String role = args.has("role") ? args.get("role").asText() : null;
                String status = args.has("status") ? args.get("status").asText() : null;
                
                List<Candidate> all = candidateRepository.findAll();
                return all.stream()
                        .filter(c -> searchedName == null || c.getName().toLowerCase().contains(searchedName.toLowerCase()))
                        .filter(c -> role == null || role.equalsIgnoreCase(c.getRole()))
                        .filter(c -> status == null || status.equalsIgnoreCase(c.getStatus()))
                        .map(c -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("id", c.getId());
                            map.put("name", c.getName());
                            map.put("role", c.getRole());
                            map.put("status", c.getStatus());
                            map.put("aiScore", c.getAiScore());
                            map.put("aiFeedback", c.getAiFeedback());
                            if (c.getResumeText() != null) {
                                String text = c.getResumeText();
                                map.put("resumeContent", text.length() > 1000 ? text.substring(0, 1000) + "..." : text);
                            }
                            return map;
                        })
                        .toList();
            } else if ("updateCandidateStatus".equals(name)) {
                String id = args.get("candidateId").asText();
                String status = args.get("status").asText();
                Candidate c = candidateRepository.findById(id).orElse(null);
                if (c != null) {
                    c.setStatus(status);
                    candidateRepository.save(c);
                    return "Successfully updated candidate " + id + " to " + status;
                }
                return "Candidate not found";
            } else if ("sendEmail".equals(name)) {
                String id = args.get("candidateId").asText();
                String subject = args.get("subject").asText();
                String body = args.get("body").asText();
                Candidate c = candidateRepository.findById(id).orElse(null);
                if (c != null) {
                    // Mock sending email by adding an AI feedback note
                    String existing = c.getAiFeedback() != null ? c.getAiFeedback() + "\n" : "";
                    c.setAiFeedback(existing + "EMAIL SENT: [" + subject + "] " + body);
                    candidateRepository.save(c);
                    return "Email mock-sent successfully to " + c.getName();
                }
                return "Candidate not found to send email.";
            }
        } catch (Exception e) {
            return "Error executing tool: " + e.getMessage();
        }
        return "Unknown tool";
    }
}
