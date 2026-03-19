package com.hr.system.backend.repository;

import com.hr.system.backend.model.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    List<Payslip> findByEmployeeId(Long employeeId);

    List<Payslip> findByPayPeriod(String payPeriod);

    List<Payslip> findByStatus(String status);
}
