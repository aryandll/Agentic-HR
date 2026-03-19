package com.hr.system.backend.controller;

import com.hr.system.backend.model.Payslip;
import com.hr.system.backend.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @GetMapping("/payslips")
    public List<Payslip> getAllPayslips() {
        return payrollService.getAllPayslips();
    }

    @GetMapping("/payslips/employee/{employeeId}")
    public List<Payslip> getPayslipsByEmployee(@PathVariable("employeeId") Long employeeId) {
        return payrollService.getPayslipsByEmployee(employeeId);
    }

    @GetMapping("/payslips/period/{payPeriod}")
    public List<Payslip> getPayslipsByPeriod(@PathVariable("payPeriod") String payPeriod) {
        return payrollService.getPayslipsByPeriod(payPeriod);
    }

    @PostMapping("/payslips")
    public Payslip createPayslip(@RequestBody Payslip payslip) {
        return payrollService.createPayslip(payslip);
    }

    @PutMapping("/payslips/{id}")
    public Payslip updatePayslip(@PathVariable("id") Long id, @RequestBody Payslip payslip) {
        payslip.setId(id);
        return payrollService.updatePayslip(payslip);
    }

    @PostMapping("/generate/{payPeriod}")
    public ResponseEntity<List<Payslip>> generatePayroll(@PathVariable("payPeriod") String payPeriod) {
        List<Payslip> payslips = payrollService.generatePayrollForPeriod(payPeriod);
        return ResponseEntity.ok(payslips);
    }

    @GetMapping("/summary")
    public Map<String, Object> getPayrollSummary() {
        return payrollService.getPayrollSummary();
    }

    @PostMapping("/bonus")
    public ResponseEntity<Payslip> addBonus(@RequestBody Map<String, Object> request) {
        Long employeeId = Long.valueOf(request.get("employeeId").toString());
        Double bonusAmount = Double.valueOf(request.get("amount").toString());
        Payslip updated = payrollService.addBonus(employeeId, bonusAmount);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/payslips/{id}")
    public ResponseEntity<?> deletePayslip(@PathVariable("id") Long id) {
        payrollService.deletePayslip(id);
        return ResponseEntity.ok("Payslip deleted");
    }

    @DeleteMapping("/cleanup-duplicates/{payPeriod}")
    public ResponseEntity<?> cleanupDuplicates(@PathVariable("payPeriod") String payPeriod) {
        int removed = payrollService.removeDuplicatePayslips(payPeriod);
        return ResponseEntity.ok("Removed " + removed + " duplicate payslips for " + payPeriod);
    }
}
