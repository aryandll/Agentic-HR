package com.hr.system.backend.config;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.Employee;
import com.hr.system.backend.repository.CandidateRepository;
import com.hr.system.backend.repository.EmployeeRepository;
import com.hr.system.backend.model.PerformanceReview;
import com.hr.system.backend.repository.PerformanceReviewRepository;
import com.hr.system.backend.model.OnboardingTask;
import com.hr.system.backend.repository.OnboardingTaskRepository;
import com.hr.system.backend.model.Payslip;
import com.hr.system.backend.repository.PayslipRepository;
import com.hr.system.backend.repository.JobRepository;
import com.hr.system.backend.model.JobPosting;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.Random;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(EmployeeRepository employeeRepository, CandidateRepository candidateRepository,
                        PerformanceReviewRepository reviewRepository, OnboardingTaskRepository onboardingRepository,
                        PayslipRepository payslipRepository, JobRepository jobRepository) {
                return args -> {
                        // Seed Employees if empty
                        if (employeeRepository.count() == 0) {
                                // Jessica = ADMIN
                                // Harvey = MANAGER
                                // Others = EMPLOYEE
                                List<Employee> employees = Arrays.asList(
                                                createEmployee("Alex Johnson", "Senior Developer", "Engineering",
                                                                "alex@nexus.hr", 120000.0, "2023-01-15", "EMPLOYEE"),
                                                createEmployee("Sarah Connor", "UX Designer", "Design",
                                                                "sarah@nexus.hr", 95000.0, "2023-03-10", "EMPLOYEE"),
                                                createEmployee("Mike Ross", "Legal Consultant", "Legal",
                                                                "mike@nexus.hr", 150000.0, "2022-11-05", "EMPLOYEE"),
                                                createEmployee("Jessica Pearson", "Managing Partner", "Management",
                                                                "jessica@nexus.hr", 250000.0, "2020-01-01", "ADMIN"),
                                                createEmployee("Harvey Specter", "Senior Partner", "Legal",
                                                                "harvey@nexus.hr", 220000.0, "2020-02-15", "MANAGER"),
                                                createEmployee("Donna Paulsen", "COO", "Operations", "donna@nexus.hr",
                                                                180000.0, "2020-01-10", "MANAGER"),
                                                createEmployee("Rachel Zane", "Paralegal", "Legal", "rachel@nexus.hr",
                                                                80000.0, "2021-06-20", "EMPLOYEE"),
                                                createEmployee("Louis Litt", "Financial Partner", "Finance",
                                                                "louis@nexus.hr", 200000.0, "2019-11-12", "MANAGER"));
                                employeeRepository.saveAll(employees);

                                // Assign Managers
                                List<Employee> savedEmps = employeeRepository.findAll();
                                Employee jessica = savedEmps.stream().filter(e -> e.getName().contains("Jessica"))
                                                .findFirst().orElse(null);
                                Employee harvey = savedEmps.stream().filter(e -> e.getName().contains("Harvey"))
                                                .findFirst().orElse(null);

                                if (jessica != null && harvey != null) {
                                        for (Employee e : savedEmps) {
                                                if (e.getName().contains("Harvey") || e.getName().contains("Donna")
                                                                || e.getName().contains("Louis")) {
                                                        e.setManagerId(jessica.getId());
                                                } else if (e.getName().contains("Mike")
                                                                || e.getName().contains("Rachel")) {
                                                        e.setManagerId(harvey.getId());
                                                }
                                        }
                                        employeeRepository.saveAll(savedEmps);
                                }

                                System.out.println("Seeded " + employees.size() + " employees.");

                                // Seed Onboarding Tasks
                                if (onboardingRepository.count() == 0) {
                                        List<OnboardingTask> tasks = Arrays.asList(
                                                        createTask(savedEmps.get(0).getId(), "Setup Company Email",
                                                                        "COMPLETED"),
                                                        createTask(savedEmps.get(0).getId(), "Sign Employment Contract",
                                                                        "COMPLETED"),
                                                        createTask(savedEmps.get(0).getId(), "Complete Safety Training",
                                                                        "PENDING"),
                                                        createTask(savedEmps.get(1).getId(), "Setup Design Software",
                                                                        "COMPLETED"),
                                                        createTask(savedEmps.get(1).getId(), "Meet with Team Lead",
                                                                        "PENDING"));
                                        onboardingRepository.saveAll(tasks);
                                        System.out.println("Seeded " + tasks.size() + " onboarding tasks.");
                                }
                        }

                        // Seed Performance Reviews (moved outside employee check to always run)
                        if (reviewRepository.count() == 0) {
                                List<Employee> allEmps = employeeRepository.findAll();
                                if (!allEmps.isEmpty()) {
                                        Employee alex = allEmps.stream().filter(e -> e.getName().contains("Alex"))
                                                        .findFirst().orElse(null);
                                        Employee mike = allEmps.stream().filter(e -> e.getName().contains("Mike"))
                                                        .findFirst().orElse(null);
                                        Employee rachel = allEmps.stream().filter(e -> e.getName().contains("Rachel"))
                                                        .findFirst().orElse(null);

                                        List<PerformanceReview> reviews = new java.util.ArrayList<>();

                                        if (alex != null) {
                                                reviews.add(createReview(alex.getId(), "Jessica Pearson", 4,
                                                                "Excellent technical skills, needs to work on communication.",
                                                                9, 7, 8, 9));
                                        }

                                        if (mike != null) {
                                                reviews.add(createReview(mike.getId(), "Harvey Specter", 5,
                                                                "Outstanding performance in the merger case.", 10, 9, 8,
                                                                10));
                                        }

                                        if (rachel != null) {
                                                reviews.add(createReview(rachel.getId(), "Harvey Specter", 4,
                                                                "Great attention to detail.", 8, 8, 7, 9));
                                        }

                                        if (!reviews.isEmpty()) {
                                                reviewRepository.saveAll(reviews);
                                                System.out.println(
                                                                "Seeded " + reviews.size() + " performance reviews.");
                                        }
                                }
                        }

                        // Seed Candidates if empty
                        if (candidateRepository.count() == 0) {
                                List<Candidate> candidates = Arrays.asList(
                                                createCandidate("John Wick", "Security Specialist", "applied"),
                                                createCandidate("Tony Stark", "Engineering Lead", "interview"),
                                                createCandidate("Steve Rogers", "Team Lead", "offer"),
                                                createCandidate("Natasha Romanoff", "Security Analyst", "screening"),
                                                createCandidate("Bruce Banner", "Data Scientist", "hired"),
                                                createCandidate("Peter Parker", "Intern", "applied"),
                                                createCandidate("Wanda Maximoff", "Frontend Developer", "interview"),
                                                createCandidate("Thor Odinson", "Hardware Engineer", "offer"));
                                candidateRepository.saveAll(candidates);
                                System.out.println("Seeded " + candidates.size() + " candidates.");
                        }

                        // FIXED: Backfill passwords and roles for existing users (if added later)
                        List<Employee> allEmployees = employeeRepository.findAll();
                        boolean needsUpdate = false;
                        for (Employee emp : allEmployees) {
                                if (emp.getPassword() == null || emp.getPassword().isEmpty()) {
                                        emp.setPassword("password123");
                                        needsUpdate = true;
                                }
                                if (emp.getAccessRole() == null || emp.getAccessRole().isEmpty()) {
                                        // Check if name is not null before using contains()
                                        if (emp.getName() != null && emp.getName().contains("Jessica"))
                                                emp.setAccessRole("ADMIN");
                                        else if (emp.getName() != null && (emp.getName().contains("Harvey")
                                                        || emp.getName().contains("Donna")
                                                        || emp.getName().contains("Louis")))
                                                emp.setAccessRole("MANAGER");
                                        else
                                                emp.setAccessRole("EMPLOYEE");
                                        needsUpdate = true;
                                }
                        }
                        if (needsUpdate) {
                                employeeRepository.saveAll(allEmployees);
                                System.out.println("Updated existing employees with default password and roles.");
                        }

                        // Seed Job Postings
                        if (jobRepository.count() == 0) {
                                JobPosting job1 = new JobPosting();
                                job1.setTitle("Senior React Developer");
                                job1.setDepartment("Engineering");
                                job1.setLocation("Remote / New York");
                                job1.setType("Full-time");
                                job1.setDescription(
                                                "We are looking for an experienced React developer to join our core team. Must have 5+ years of experience with TypeScript, Taiwlind CSS, and modern frontend architecture.");
                                jobRepository.save(job1);

                                JobPosting job2 = new JobPosting();
                                job2.setTitle("Product Marketing Manager");
                                job2.setDepartment("Marketing");
                                job2.setLocation("San Francisco, CA");
                                job2.setType("Full-time");
                                job2.setDescription(
                                                "Lead our go-to-market strategy for new HR tech products. Experience in B2B SaaS is a must.");
                                jobRepository.save(job2);

                                JobPosting job3 = new JobPosting();
                                job3.setTitle("UX Designer");
                                job3.setDepartment("Design");
                                job3.setLocation("Remote");
                                job3.setType("Contract");
                                job3.setDescription(
                                                "Help us design the future of HR software. We need someone with a keen eye for detail and a passion for user-centric design.");
                                jobRepository.save(job3);
                        }
                        // Seed Payslips for January 2026
                        if (payslipRepository.count() == 0) {
                                List<Employee> employees = employeeRepository.findAll();
                                for (Employee emp : employees) {
                                        if (emp.getSalary() != null && emp.getSalary() > 0) {
                                                Payslip payslip = new Payslip();
                                                payslip.setEmployeeId(emp.getId());
                                                payslip.setPayPeriod("January 2026");
                                                payslip.setBaseSalary(emp.getSalary() / 12); // Monthly from annual

                                                // Add bonuses/allowances based on role
                                                if (emp.getRole().contains("Senior")
                                                                || emp.getRole().contains("Partner")
                                                                || emp.getRole().contains("Manager")) {
                                                        payslip.setPerformanceBonus(500.0 + new Random().nextInt(1000));
                                                        payslip.setTransportAllowance(300.0);
                                                        payslip.setHousingAllowance(800.0);
                                                } else if (emp.getRole().contains("COO")
                                                                || emp.getRole().contains("Managing")) {
                                                        payslip.setPerformanceBonus(1500.0);
                                                        payslip.setTransportAllowance(500.0);
                                                        payslip.setHousingAllowance(1200.0);
                                                } else {
                                                        payslip.setTransportAllowance(200.0);
                                                        if (new Random().nextBoolean()) {
                                                                payslip.setPerformanceBonus(250.0);
                                                        }
                                                }

                                                payslip.calculatePayslip();
                                                payslip.setStatus("PAID");
                                                payslipRepository.save(payslip);
                                        }
                                }
                                System.out.println(
                                                "✅ Seeded " + payslipRepository.count() + " payslips for January 2026");
                        }
                };
        }

        private Employee createEmployee(String name, String role, String department, String email, Double salary,
                        String joinDate, String accessRole) {
                Employee emp = new Employee();
                emp.setName(name);
                emp.setRole(role);
                emp.setDepartment(department);
                emp.setEmail(email);
                emp.setSalary(salary);
                emp.setJoinDate(joinDate);
                emp.setAccessRole(accessRole);
                emp.setPassword("password123"); // Default password
                emp.setImage("https://ui-avatars.com/api/?name=" + name.replace(" ", "+")
                                + "&background=random&color=fff");
                return emp;
        }

        private Candidate createCandidate(String name, String role, String status) {
                Candidate cand = new Candidate();
                cand.setId(UUID.randomUUID().toString());
                cand.setName(name);
                cand.setRole(role);
                cand.setStatus(status);
                return cand;
        }

        private PerformanceReview createReview(Long employeeId, String reviewer, Integer rating, String feedback,
                        int comm, int tech, int lead, int prod) {
                PerformanceReview review = new PerformanceReview();
                review.setEmployeeId(employeeId);
                review.setReviewerName(reviewer);
                review.setRating(rating);
                review.setFeedback(feedback);
                review.setReviewDate(LocalDate.now().minusDays(new Random().nextInt(30)));
                review.setCommunication(comm);
                review.setTechnicalSkill(tech);
                review.setLeadership(lead);
                review.setProductivity(prod);
                return review;
        }

        private OnboardingTask createTask(Long employeeId, String taskName, String status) {
                OnboardingTask task = new OnboardingTask();
                task.setEmployeeId(employeeId);
                task.setTaskName(taskName);
                task.setStatus(status);
                task.setDueDate(LocalDate.now().plusDays(7));
                return task;
        }
}
