package com.hr.system.backend.repository;

import com.hr.system.backend.model.OnboardingTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OnboardingTaskRepository extends JpaRepository<OnboardingTask, Long> {
    List<OnboardingTask> findByEmployeeId(Long employeeId);
}
