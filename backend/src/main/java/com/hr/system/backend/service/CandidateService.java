package com.hr.system.backend.service;

import com.hr.system.backend.model.Candidate;
import com.hr.system.backend.model.Employee;
import com.hr.system.backend.model.Payslip;
import com.hr.system.backend.model.OnboardingTask;
import com.hr.system.backend.repository.CandidateRepository;
import com.hr.system.backend.repository.EmployeeRepository;
import com.hr.system.backend.repository.PayslipRepository;
import com.hr.system.backend.repository.OnboardingTaskRepository;
import com.hr.system.backend.dto.HireRequest;
import com.hr.system.backend.dto.HireResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayslipRepository payslipRepository;

    @Autowired
    private OnboardingTaskRepository onboardingRepository;

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate createCandidate(Candidate candidate) {
        if (candidate.getId() == null) {
            candidate.setId("c" + UUID.randomUUID().toString().substring(0, 8));
        }
        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidateStatus(String id, String status) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setStatus(status);
        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(String id) {
        candidateRepository.deleteById(id);
    }

    // Comprehensive hire method - creates employee, payslip, and onboarding tasks
    public HireResponse hireCandidate(String candidateId, HireRequest request) {
        // 1. Get and validate candidate
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // 2. Create Employee from candidate
        Employee employee = new Employee();
        employee.setName(candidate.getName());
        employee.setRole(request.getDepartment() != null ? candidate.getRole() : "Employee");
        employee.setDepartment(request.getDepartment());
        employee.setEmail(candidate.getName().toLowerCase().replace(" ", ".") + "@nexus.hr");
        employee.setSalary(request.getSalary());
        employee.setJoinDate(request.getStartDate());
        employee.setAccessRole(request.getAccessRole() != null ? request.getAccessRole() : "EMPLOYEE");
        employee.setPassword("password123"); // Default password
        employee.setImage("https://ui-avatars.com/api/?name=" + candidate.getName().replace(" ", "+")
                + "&background=random&color=fff");
        employee.setManagerId(request.getManagerId());

        Employee savedEmployee = employeeRepository.save(employee);

        // 3. Generate Payslip for current month
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
        Payslip payslip = new Payslip();
        payslip.setEmployeeId(savedEmployee.getId());
        payslip.setPayPeriod(currentMonth);
        payslip.setBaseSalary(request.getSalary() / 12); // Monthly from annual

        // Add standard allowances based on role
        if (candidate.getRole().contains("Senior") || candidate.getRole().contains("Manager")) {
            payslip.setPerformanceBonus(500.0);
            payslip.setTransportAllowance(300.0);
            payslip.setHousingAllowance(800.0);
        } else {
            payslip.setTransportAllowance(200.0);
        }

        payslip.calculatePayslip();
        payslip.setStatus("PROCESSED");
        Payslip savedPayslip = payslipRepository.save(payslip);

        // 4. Create Onboarding Tasks
        List<OnboardingTask> tasks = new ArrayList<>();
        String[] taskNames = {
                "Complete HR Paperwork",
                "Setup Email & Accounts",
                "IT Equipment Assignment",
                "Department Introduction",
                "Review Company Policies"
        };

        for (int i = 0; i < taskNames.length; i++) {
            OnboardingTask task = new OnboardingTask();
            task.setEmployeeId(savedEmployee.getId());
            task.setTaskName(taskNames[i]);
            task.setStatus("Pending");
            task.setDueDate(LocalDate.now().plusDays(7 + (i * 2)));
            tasks.add(onboardingRepository.save(task));
        }

        // 5. Update Candidate status to "Hired"
        candidate.setStatus("Hired");
        candidateRepository.save(candidate);

        // 6. Return comprehensive response
        String message = "Successfully hired " + candidate.getName() + " as " + candidate.getRole();
        return new HireResponse(savedEmployee, savedPayslip, tasks, message);
    }
}
