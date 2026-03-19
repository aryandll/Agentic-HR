package com.hr.system.backend.dto;

public class HireRequest {
    private Double salary;
    private String department;
    private Long managerId;
    private String startDate;
    private String accessRole;

    // Constructors
    public HireRequest() {
    }

    public HireRequest(Double salary, String department, Long managerId, String startDate, String accessRole) {
        this.salary = salary;
        this.department = department;
        this.managerId = managerId;
        this.startDate = startDate;
        this.accessRole = accessRole;
    }

    // Getters and Setters
    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getAccessRole() {
        return accessRole;
    }

    public void setAccessRole(String accessRole) {
        this.accessRole = accessRole;
    }
}
