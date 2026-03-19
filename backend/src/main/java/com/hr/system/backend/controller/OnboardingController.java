package com.hr.system.backend.controller;

import com.hr.system.backend.model.OnboardingTask;
import com.hr.system.backend.repository.OnboardingTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = "*")
public class OnboardingController {

    @Autowired
    private OnboardingTaskRepository onboardingRepository;

    @GetMapping("/{employeeId}")
    public List<OnboardingTask> getEmployeeTasks(@PathVariable("employeeId") Long employeeId) {
        return onboardingRepository.findByEmployeeId(employeeId);
    }

    @PostMapping
    public OnboardingTask addTask(@RequestBody OnboardingTask task) {
        task.setStatus("PENDING");
        return onboardingRepository.save(task);
    }

    @PutMapping("/{taskId}/toggle")
    public OnboardingTask toggleTask(@PathVariable("taskId") Long taskId) {
        OnboardingTask task = onboardingRepository.findById(taskId).orElseThrow();
        if ("COMPLETED".equals(task.getStatus())) {
            task.setStatus("PENDING");
        } else {
            task.setStatus("COMPLETED");
        }
        return onboardingRepository.save(task);
    }
}
