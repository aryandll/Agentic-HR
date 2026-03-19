package com.hr.system.backend.dto;

import com.hr.system.backend.model.Employee;
import com.hr.system.backend.model.Payslip;
import com.hr.system.backend.model.OnboardingTask;
import java.util.List;

public class HireResponse {
    private Employee employee;
    private Payslip payslip;
    private List<OnboardingTask> onboardingTasks;
    private String message;

    public HireResponse() {
    }

    public HireResponse(Employee employee, Payslip payslip, List<OnboardingTask> tasks, String message) {
        this.employee = employee;
        this.payslip = payslip;
        this.onboardingTasks = tasks;
        this.message = message;
    }

    // Getters and Setters
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Payslip getPayslip() {
        return payslip;
    }

    public void setPayslip(Payslip payslip) {
        this.payslip = payslip;
    }

    public List<OnboardingTask> getOnboardingTasks() {
        return onboardingTasks;
    }

    public void setOnboardingTasks(List<OnboardingTask> onboardingTasks) {
        this.onboardingTasks = onboardingTasks;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
