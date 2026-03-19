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
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    @Autowired
    private PerformanceReviewRepository performanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<PerformanceReview> getAllReviews() {
        return performanceRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<PerformanceReview> getEmployeeReviews(@PathVariable("employeeId") Long employeeId) {
        return performanceRepository.findByEmployeeId(employeeId);
    }

    @PostMapping
    public PerformanceReview createReview(@RequestBody PerformanceReview review) {
        return performanceRepository.save(review);
    }

    @GetMapping("/seed-reviews")
    public ResponseEntity<?> seedReviews() {
        if (performanceRepository.count() > 0) {
            return ResponseEntity.ok("Reviews already exist. Count: " + performanceRepository.count());
        }

        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            return ResponseEntity.badRequest().body("No employees found to create reviews for");
        }

        // Create reviews for several employees
        try {
            Employee alex = employees.stream().filter(e -> e.getName().contains("Alex")).findFirst().orElse(null);
            Employee mike = employees.stream().filter(e -> e.getName().contains("Mike")).findFirst().orElse(null);
            Employee rachel = employees.stream().filter(e -> e.getName().contains("Rachel")).findFirst().orElse(null);
            Employee sarah = employees.stream().filter(e -> e.getName().contains("Sarah")).findFirst().orElse(null);
            Employee donna = employees.stream().filter(e -> e.getName().contains("Donna")).findFirst().orElse(null);

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
            }

            if (sarah != null) {
                PerformanceReview r4 = new PerformanceReview();
                r4.setEmployeeId(sarah.getId());
                r4.setReviewerName("Jessica Pearson");
                r4.setRating(5);
                r4.setFeedback(
                        "Innovative design thinking and excellent collaboration with the development team. A true asset.");
                r4.setReviewDate(LocalDate.now().minusDays(5));
                r4.setCommunication(10);
                r4.setTechnicalSkill(9);
                r4.setLeadership(9);
                r4.setProductivity(9);
                performanceRepository.save(r4);
            }

            if (donna != null) {
                PerformanceReview r5 = new PerformanceReview();
                r5.setEmployeeId(donna.getId());
                r5.setReviewerName("Jessica Pearson");
                r5.setRating(5);
                r5.setFeedback(
                        "Exceptional leadership and operational excellence. Drives the company forward with strategic vision.");
                r5.setReviewDate(LocalDate.now().minusDays(7));
                r5.setCommunication(10);
                r5.setTechnicalSkill(8);
                r5.setLeadership(10);
                r5.setProductivity(10);
                performanceRepository.save(r5);
            }

            long count = performanceRepository.count();
            return ResponseEntity.ok("Successfully seeded " + count + " performance reviews!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error seeding reviews: " + e.getMessage());
        }
    }
}
