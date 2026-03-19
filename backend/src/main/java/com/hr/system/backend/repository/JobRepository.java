package com.hr.system.backend.repository;

import com.hr.system.backend.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByStatus(String status);
}
