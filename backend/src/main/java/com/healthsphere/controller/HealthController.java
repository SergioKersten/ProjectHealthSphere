

package com.healthsphere.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.manager.PersonManager;
import com.healthsphere.manager.TreatmentManager;
import com.healthsphere.manager.WardManager;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "OK");
        status.put("timestamp", LocalDateTime.now());
        status.put("application", "HealthSphere Backend");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Initialize managers to get counts
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
            PersonManager<Employee> employeeManager = new PersonManager<>("employees.ser");
            TreatmentManager treatmentManager = new TreatmentManager("treatments.ser");
            WardManager wardManager = new WardManager();
            
            stats.put("totalPatients", patientManager.getAll().size());
            stats.put("totalEmployees", employeeManager.getAll().size());
            stats.put("totalTreatments", treatmentManager.getAll().size());
            stats.put("totalWards", wardManager.getAll().size());
            stats.put("lastUpdated", LocalDateTime.now());
            
        } catch (Exception e) {
            stats.put("error", "Fehler beim Laden der Statistiken: " + e.getMessage());
        }
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}