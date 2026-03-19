package com.hr.system.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payslips")
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private String payPeriod; // e.g., "January 2026", "2026-01"

    @Column(nullable = false)
    private Double baseSalary;

    private Double overtime = 0.0;
    private Double performanceBonus = 0.0;
    private Double transportAllowance = 0.0;
    private Double housingAllowance = 0.0;

    // Deductions
    private Double incomeTax = 0.0;
    private Double socialSecurity = 0.0;
    private Double healthInsurance = 0.0;
    private Double otherDeductions = 0.0;

    // Calculated fields
    private Double grossPay = 0.0;
    private Double totalDeductions = 0.0;
    private Double netPay = 0.0;

    @Column(nullable = false)
    private LocalDate generatedDate;

    @Column(nullable = false)
    private String status = "PROCESSED"; // DRAFT, PROCESSED, PAID

    // Constructors
    public Payslip() {
        this.generatedDate = LocalDate.now();
    }

    public Payslip(Long employeeId, String payPeriod, Double baseSalary) {
        this.employeeId = employeeId;
        this.payPeriod = payPeriod;
        this.baseSalary = baseSalary;
        this.generatedDate = LocalDate.now();
        calculatePayslip();
    }

    // Calculate all payslip values
    public void calculatePayslip() {
        // Calculate gross pay
        this.grossPay = this.baseSalary + this.overtime + this.performanceBonus
                + this.transportAllowance + this.housingAllowance;

        // Calculate income tax (progressive)
        this.incomeTax = calculateIncomeTax(this.baseSalary * 12); // Annual for tax calculation

        // Social security (6.2% of base salary)
        this.socialSecurity = this.baseSalary * 0.062;

        // Health insurance (1.45% of base salary)
        this.healthInsurance = this.baseSalary * 0.0145;

        // Total deductions
        this.totalDeductions = this.incomeTax + this.socialSecurity
                + this.healthInsurance + this.otherDeductions;

        // Net pay
        this.netPay = this.grossPay - this.totalDeductions;
    }

    // Progressive tax calculation
    private Double calculateIncomeTax(Double annualSalary) {
        double monthlyTax = 0.0;

        if (annualSalary <= 50000) {
            monthlyTax = (annualSalary * 0.10) / 12;
        } else if (annualSalary <= 100000) {
            monthlyTax = ((50000 * 0.10) + ((annualSalary - 50000) * 0.15)) / 12;
        } else if (annualSalary <= 150000) {
            monthlyTax = ((50000 * 0.10) + (50000 * 0.15) + ((annualSalary - 100000) * 0.20)) / 12;
        } else {
            monthlyTax = ((50000 * 0.10) + (50000 * 0.15) + (50000 * 0.20) + ((annualSalary - 150000) * 0.25)) / 12;
        }

        return monthlyTax;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(String payPeriod) {
        this.payPeriod = payPeriod;
    }

    public Double getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(Double baseSalary) {
        this.baseSalary = baseSalary;
        calculatePayslip();
    }

    public Double getOvertime() {
        return overtime;
    }

    public void setOvertime(Double overtime) {
        this.overtime = overtime;
        calculatePayslip();
    }

    public Double getPerformanceBonus() {
        return performanceBonus;
    }

    public void setPerformanceBonus(Double performanceBonus) {
        this.performanceBonus = performanceBonus;
        calculatePayslip();
    }

    public Double getTransportAllowance() {
        return transportAllowance;
    }

    public void setTransportAllowance(Double transportAllowance) {
        this.transportAllowance = transportAllowance;
        calculatePayslip();
    }

    public Double getHousingAllowance() {
        return housingAllowance;
    }

    public void setHousingAllowance(Double housingAllowance) {
        this.housingAllowance = housingAllowance;
        calculatePayslip();
    }

    public Double getIncomeTax() {
        return incomeTax;
    }

    public void setIncomeTax(Double incomeTax) {
        this.incomeTax = incomeTax;
    }

    public Double getSocialSecurity() {
        return socialSecurity;
    }

    public void setSocialSecurity(Double socialSecurity) {
        this.socialSecurity = socialSecurity;
    }

    public Double getHealthInsurance() {
        return healthInsurance;
    }

    public void setHealthInsurance(Double healthInsurance) {
        this.healthInsurance = healthInsurance;
    }

    public Double getOtherDeductions() {
        return otherDeductions;
    }

    public void setOtherDeductions(Double otherDeductions) {
        this.otherDeductions = otherDeductions;
        calculatePayslip();
    }

    public Double getGrossPay() {
        return grossPay;
    }

    public void setGrossPay(Double grossPay) {
        this.grossPay = grossPay;
    }

    public Double getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(Double totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public Double getNetPay() {
        return netPay;
    }

    public void setNetPay(Double netPay) {
        this.netPay = netPay;
    }

    public LocalDate getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDate generatedDate) {
        this.generatedDate = generatedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
