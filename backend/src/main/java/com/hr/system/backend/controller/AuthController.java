package com.hr.system.backend.controller;

import com.hr.system.backend.dto.LoginRequest;
import com.hr.system.backend.model.Employee;
import com.hr.system.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Employee> emp = employeeRepository.findAll().stream()
                .filter(e -> e.getEmail().equalsIgnoreCase(loginRequest.getEmail()))
                .findFirst();

        if (emp.isPresent()) {
            Employee employee = emp.get();
            // Simple plain-text password check for demo purposes
            if (loginRequest.getPassword().equals(employee.getPassword())) {
                return ResponseEntity.ok(employee);
            } else {
                System.out.println("Login Failed for: " + loginRequest.getEmail());
                System.out.println("Received Password: '" + loginRequest.getPassword() + "'");
                System.out.println("Stored Password:   '" + employee.getPassword() + "'");
            }
        } else {
            System.out.println("User not found: " + loginRequest.getEmail());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/fix-data")
    public ResponseEntity<?> fixData() {
        try {
            java.util.List<Employee> allEmployees = employeeRepository.findAll();
            boolean changed = false;

            // Check if default users exist, if not add them
            if (allEmployees.stream().noneMatch(e -> e.getEmail().equalsIgnoreCase("jessica@nexus.hr"))) {
                Employee admin = new Employee();
                admin.setName("Jessica Pearson");
                admin.setRole("Managing Partner");
                admin.setDepartment("Management");
                admin.setEmail("jessica@nexus.hr");
                admin.setSalary(250000.0);
                admin.setJoinDate("2020-01-01");
                admin.setAccessRole("ADMIN");
                admin.setPassword("password123");
                admin.setImage("https://ui-avatars.com/api/?name=Jessica+Pearson&background=random&color=fff");
                employeeRepository.save(admin);
                changed = true;
            }

            if (allEmployees.stream().noneMatch(e -> e.getEmail().equalsIgnoreCase("harvey@nexus.hr"))) {
                Employee manager = new Employee();
                manager.setName("Harvey Specter");
                manager.setRole("Senior Partner");
                manager.setDepartment("Legal");
                manager.setEmail("harvey@nexus.hr");
                manager.setSalary(220000.0);
                manager.setJoinDate("2020-02-15");
                manager.setAccessRole("MANAGER");
                manager.setPassword("password123");
                manager.setImage("https://ui-avatars.com/api/?name=Harvey+Specter&background=random&color=fff");
                employeeRepository.save(manager);
                changed = true;
            }

            if (allEmployees.stream().noneMatch(e -> e.getEmail().equalsIgnoreCase("alex@nexus.hr"))) {
                Employee employee = new Employee();
                employee.setName("Alex Johnson");
                employee.setRole("Senior Developer");
                employee.setDepartment("Engineering");
                employee.setEmail("alex@nexus.hr");
                employee.setSalary(120000.0);
                employee.setJoinDate("2023-01-15");
                employee.setAccessRole("EMPLOYEE");
                employee.setPassword("password123");
                employee.setImage("https://ui-avatars.com/api/?name=Alex+Johnson&background=random&color=fff");
                employeeRepository.save(employee);
                changed = true;
            }

            // Force existing Jessica to have proper role if missing
            for (Employee emp : allEmployees) {
                if (emp.getName().contains("Jessica") && !"ADMIN".equals(emp.getAccessRole())) {
                    emp.setAccessRole("ADMIN");
                    emp.setEmail("jessica@nexus.hr"); // Standardize on .hr
                    changed = true;
                }

                if (emp.getPassword() == null || emp.getPassword().isEmpty()) {
                    emp.setPassword("password123");
                    changed = true;
                }
                if (emp.getAccessRole() == null || emp.getAccessRole().isEmpty()) {
                    emp.setAccessRole("EMPLOYEE");
                    changed = true;
                }
            }

            employeeRepository.saveAll(allEmployees);

            if (changed) {
                return ResponseEntity.ok("Fixed! Updated roles for Jessica/others.");
            }
            return ResponseEntity.ok("No changes needed.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
