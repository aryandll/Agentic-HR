package com.hr.system.backend.service;

import com.hr.system.backend.model.Employee;
import com.hr.system.backend.model.Payslip;
import com.hr.system.backend.repository.EmployeeRepository;
import com.hr.system.backend.repository.PayslipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PayrollService {

    @Autowired
    private PayslipRepository payslipRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Payslip> getAllPayslips() {
        return payslipRepository.findAll();
    }

    public List<Payslip> getPayslipsByEmployee(Long employeeId) {
        return payslipRepository.findByEmployeeId(employeeId);
    }

    public List<Payslip> getPayslipsByPeriod(String payPeriod) {
        return payslipRepository.findByPayPeriod(payPeriod);
    }

    public Payslip createPayslip(Payslip payslip) {
        payslip.calculatePayslip();
        return payslipRepository.save(payslip);
    }

    public Payslip updatePayslip(Payslip payslip) {
        payslip.calculatePayslip();
        return payslipRepository.save(payslip);
    }

    // Generate payslips for all employees for a given period
    public List<Payslip> generatePayrollForPeriod(String payPeriod) {
        // Check if payslips already exist for this period
        List<Payslip> existingPayslips = payslipRepository.findByPayPeriod(payPeriod);
        if (!existingPayslips.isEmpty()) {
            System.out.println("Payslips already exist for period: " + payPeriod);
            return existingPayslips; // Return existing payslips instead of creating duplicates
        }

        List<Employee> employees = employeeRepository.findAll();

        for (Employee emp : employees) {
            if (emp.getSalary() != null && emp.getSalary() > 0) {
                Payslip payslip = new Payslip();
                payslip.setEmployeeId(emp.getId());
                payslip.setPayPeriod(payPeriod);
                payslip.setBaseSalary(emp.getSalary() / 12); // Monthly from annual

                // Add some random bonuses/allowances for demo
                if (emp.getRole().contains("Senior") || emp.getRole().contains("Manager")) {
                    payslip.setPerformanceBonus(500.0);
                    payslip.setTransportAllowance(300.0);
                    payslip.setHousingAllowance(800.0);
                } else {
                    payslip.setTransportAllowance(200.0);
                }

                payslip.calculatePayslip();
                payslipRepository.save(payslip);
            }
        }

        return payslipRepository.findByPayPeriod(payPeriod);
    }

    // Get payroll summary statistics
    public Map<String, Object> getPayrollSummary() {
        List<Payslip> allPayslips = payslipRepository.findAll();

        double totalGross = allPayslips.stream().mapToDouble(Payslip::getGrossPay).sum();
        double totalNet = allPayslips.stream().mapToDouble(Payslip::getNetPay).sum();
        double totalTax = allPayslips.stream().mapToDouble(Payslip::getIncomeTax).sum();
        double totalDeductions = allPayslips.stream().mapToDouble(Payslip::getTotalDeductions).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalGrossPay", totalGross);
        summary.put("totalNetPay", totalNet);
        summary.put("totalTax", totalTax);
        summary.put("totalDeductions", totalDeductions);
        summary.put("payslipCount", allPayslips.size());
        summary.put("averageNetPay", allPayslips.isEmpty() ? 0 : totalNet / allPayslips.size());

        return summary;
    }

    // Add bonus to employee's latest payslip
    public Payslip addBonus(Long employeeId, Double bonusAmount) {
        List<Payslip> payslips = payslipRepository.findByEmployeeId(employeeId);
        if (!payslips.isEmpty()) {
            Payslip latest = payslips.get(payslips.size() - 1);
            latest.setPerformanceBonus(latest.getPerformanceBonus() + bonusAmount);
            latest.calculatePayslip();
            return payslipRepository.save(latest);
        }
        return null;
    }

    // Delete a payslip by ID
    public void deletePayslip(Long id) {
        payslipRepository.deleteById(id);
    }

    // Remove duplicate payslips for a given period (keep only the first one for
    // each employee)
    public int removeDuplicatePayslips(String payPeriod) {
        List<Payslip> payslips = payslipRepository.findByPayPeriod(payPeriod);
        Map<Long, Payslip> uniquePayslips = new HashMap<>();
        int removedCount = 0;

        for (Payslip payslip : payslips) {
            Long employeeId = payslip.getEmployeeId();
            if (uniquePayslips.containsKey(employeeId)) {
                // Duplicate found - delete it
                payslipRepository.deleteById(payslip.getId());
                removedCount++;
                System.out.println("Removed duplicate payslip ID: " + payslip.getId() + " for employee: " + employeeId);
            } else {
                // First occurrence - keep it
                uniquePayslips.put(employeeId, payslip);
            }
        }

        return removedCount;
    }
}
