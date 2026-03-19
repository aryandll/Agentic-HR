package com.hr.system.backend.controller;

import com.hr.system.backend.model.JobPosting;
import com.hr.system.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // Public endpoint to get all OPEN jobs
    @GetMapping("/public")
    public List<JobPosting> getPublicJobs() {
        return jobRepository.findByStatus("OPEN");
    }

    // Admin/Manager endpoint to get all jobs (including closed)
    @GetMapping
    public List<JobPosting> getAllJobs() {
        return jobRepository.findAll();
    }

    // Create a new job posting
    @PostMapping
    public JobPosting createJob(@RequestBody JobPosting job) {
        return jobRepository.save(job);
    }

    // Close a job posting
    @PutMapping("/{id}/close")
    public ResponseEntity<JobPosting> closeJob(@PathVariable Long id) {
        return jobRepository.findById(id).map(job -> {
            job.setStatus("CLOSED");
            return ResponseEntity.ok(jobRepository.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a job posting
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        return jobRepository.findById(id).map(job -> {
            jobRepository.delete(job);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
