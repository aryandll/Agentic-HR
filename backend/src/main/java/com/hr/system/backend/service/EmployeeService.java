package com.hr.system.backend.service;

import com.hr.system.backend.model.Employee;
import com.hr.system.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
  }

  public Employee createEmployee(Employee employee) {
    return employeeRepository.save(employee);
  }

  public Employee updateEmployee(Employee employee) {
    return employeeRepository.save(employee);
  }

  public void deleteEmployee(Long id) {
    employeeRepository.deleteById(id);
  }

}
