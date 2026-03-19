package com.hr.system.backend.controller;

import com.hr.system.backend.model.Employee;
import com.hr.system.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*") // Allow requests from any origin for dev
public class EmployeeController {

  @Autowired
  private EmployeeService employeeService;

  @GetMapping
  public List<Employee> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeService.createEmployee(employee);
  }

  @PutMapping("/{id}")
  public Employee updateEmployee(@PathVariable("id") Long id, @RequestBody Employee employee) {
    employee.setId(id);
    return employeeService.updateEmployee(employee);
  }

  @DeleteMapping("/{id}")
  public void deleteEmployee(@PathVariable("id") Long id) {
    employeeService.deleteEmployee(id);
  }

}
