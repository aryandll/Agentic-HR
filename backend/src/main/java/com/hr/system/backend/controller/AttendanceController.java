package com.hr.system.backend.controller;

import com.hr.system.backend.model.Attendance;
import com.hr.system.backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Attendance> getTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    @PostMapping("/clock-in/{employeeId}")
    public Attendance clockIn(@PathVariable("employeeId") Long employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        
        if (existing.isPresent()) {
            return existing.get(); // Already clocked in
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(today);
        attendance.setClockInTime(LocalDateTime.now());
        attendance.setStatus("PRESENT");
        return attendanceRepository.save(attendance);
    }

    @PostMapping("/clock-out/{employeeId}")
    public Attendance clockOut(@PathVariable("employeeId") Long employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

        if (existing.isPresent()) {
            Attendance att = existing.get();
            att.setClockOutTime(LocalDateTime.now());
            return attendanceRepository.save(att);
        }
        return null; // Should clock in first
    }
}
