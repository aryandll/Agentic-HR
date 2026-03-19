package com.hr.system.backend.controller;

import com.hr.system.backend.model.PerformanceReview;
import com.hr.system.backend.model.Employee;
import com.hr.system.backend.repository.PerformanceReviewRepository;
import com.hr.system.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private PerformanceReviewRepository performanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/seed-all")
    public ResponseEntity<?> seedAllData() {
        StringBuilder result = new StringBuilder();

        // Seed Performance Reviews
        if (performanceRepository.count() == 0) {
            List<Employee> employees = employeeRepository.findAll();
            if (employees.isEmpty()) {
                return ResponseEntity.badRequest().body("No employees found");
            }

            try {
                Employee alex = employees.stream().filter(e -> e.getName().contains("Alex")).findFirst().orElse(null);
                Employee mike = employees.stream().filter(e -> e.getName().contains("Mike")).findFirst().orElse(null);
                Employee rachel = employees.stream().filter(e -> e.getName().contains("Rachel")).findFirst()
                        .orElse(null);

                int count = 0;
                if (alex != null) {
                    PerformanceReview r1 = new PerformanceReview();
                    r1.setEmployeeId(alex.getId());
                    r1.setReviewerName("Jessica Pearson");
                    r1.setRating(4);
                    r1.setFeedback(
                            "Excellent technical skills and problem-solving abilities. Shows great initiative in tackling complex challenges.");
                    r1.setReviewDate(LocalDate.now().minusDays(10));
                    r1.setCommunication(9);
                    r1.setTechnicalSkill(9);
                    r1.setLeadership(7);
                    r1.setProductivity(9);
                    performanceRepository.save(r1);
                    count++;
                }

                if (mike != null) {
                    PerformanceReview r2 = new PerformanceReview();
                    r2.setEmployeeId(mike.getId());
                    r2.setReviewerName("Harvey Specter");
                    r2.setRating(5);
                    r2.setFeedback(
                            "Outstanding performance in the merger case. Exceptional legal research and client communication.");
                    r2.setReviewDate(LocalDate.now().minusDays(15));
                    r2.setCommunication(10);
                    r2.setTechnicalSkill(9);
                    r2.setLeadership(8);
                    r2.setProductivity(10);
                    performanceRepository.save(r2);
                    count++;
                }

                if (rachel != null) {
                    PerformanceReview r3 = new PerformanceReview();
                    r3.setEmployeeId(rachel.getId());
                    r3.setReviewerName("Harvey Specter");
                    r3.setRating(4);
                    r3.setFeedback(
                            "Great attention to detail and dedication to quality work. Consistently meets deadlines.");
                    r3.setReviewDate(LocalDate.now().minusDays(20));
                    r3.setCommunication(8);
                    r3.setTechnicalSkill(8);
                    r3.setLeadership(7);
                    r3.setProductivity(9);
                    performanceRepository.save(r3);
                    count++;
                }

                result.append("Seeded ").append(count).append(" performance reviews. ");
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error seeding reviews: " + e.getMessage());
            }
        } else {
            result.append("Performance reviews already exist (").append(performanceRepository.count()).append("). ");
        }

        return ResponseEntity.ok(result.toString() + "Done!");
    }
}
