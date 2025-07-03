package com.healthsphere.controller;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.components.Treatment;
import com.healthsphere.manager.TreatmentManager;

@RestController
@RequestMapping("/api/treatments")
@CrossOrigin(origins = "*")
public class TreatmentController1 {

    private final TreatmentManager treatmentManager;

    public TreatmentController1() {
        this.treatmentManager = new TreatmentManager("treatments.ser");
    }

    @GetMapping
    public ResponseEntity<Set<Treatment>> getAllTreatments() {
        return ResponseEntity.ok(treatmentManager.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treatment> getTreatmentById(@PathVariable int id) {
        Treatment treatment = treatmentManager.findById(id);
        if (treatment != null) {
            return ResponseEntity.ok(treatment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Set<Treatment>> getTreatmentsByPatientId(@PathVariable long patientId) {
        Set<Treatment> treatments = treatmentManager.filter(t -> 
            t.getPatientPersonId() == patientId);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Set<Treatment>> getTreatmentsByDoctorId(@PathVariable long doctorId) {
        Set<Treatment> treatments = treatmentManager.filter(t -> 
            t.getDoctorPersonId() == doctorId);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<Set<Treatment>> getTreatmentsByDate(@PathVariable String date) {
        try {
            LocalDate searchDate = LocalDate.parse(date);
            Set<Treatment> treatments = treatmentManager.filter(t -> 
                t.getDate().equals(searchDate));
            return ResponseEntity.ok(treatments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> createTreatment(@RequestBody TreatmentRequest request) {
        try {
            Treatment treatment = new Treatment(
                request.getTreatmentId(),
                request.getDate(),
                request.getTherapy(),
                request.getPatientPersonId(),
                request.getDoctorPersonId()
            );
            
            boolean added = treatmentManager.addTreatment(treatment);
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Behandlung erfolgreich erstellt");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Behandlung mit dieser ID existiert bereits");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Fehler beim Erstellen der Behandlung: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTreatment(
            @PathVariable int id,
            @RequestBody TreatmentUpdateRequest request) {
        
        boolean updated = treatmentManager.updateTreatment(
            id,
            request.getTherapy(),
            request.getPatientPersonId(),
            request.getDoctorPersonId()
        );
        
        if (updated) {
            return ResponseEntity.ok("Behandlung erfolgreich aktualisiert");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/therapy")
    public ResponseEntity<String> updateTherapy(
            @PathVariable int id,
            @RequestBody String newTherapy) {
        
        boolean updated = treatmentManager.updateTherapy(id, newTherapy);
        if (updated) {
            return ResponseEntity.ok("Therapie erfolgreich aktualisiert");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTreatment(@PathVariable int id) {
        boolean deleted = treatmentManager.deleteTreatment(id);
        if (deleted) {
            return ResponseEntity.ok("Behandlung erfolgreich gelöscht");
        }
        return ResponseEntity.notFound().build();
    }

    // DTO Classes
    public static class TreatmentRequest {
        private int treatmentId;
        private LocalDate date;
        private String therapy;
        private long patientPersonId;
        private long doctorPersonId;

        // Getters and Setters
        public int getTreatmentId() { return treatmentId; }
        public void setTreatmentId(int treatmentId) { this.treatmentId = treatmentId; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public String getTherapy() { return therapy; }
        public void setTherapy(String therapy) { this.therapy = therapy; }
        public long getPatientPersonId() { return patientPersonId; }
        public void setPatientPersonId(long patientPersonId) { this.patientPersonId = patientPersonId; }
        public long getDoctorPersonId() { return doctorPersonId; }
        public void setDoctorPersonId(long doctorPersonId) { this.doctorPersonId = doctorPersonId; }
    }

    public static class TreatmentUpdateRequest {
        private String therapy;
        private long patientPersonId;
        private long doctorPersonId;

        // Getters and Setters
        public String getTherapy() { return therapy; }
        public void setTherapy(String therapy) { this.therapy = therapy; }
        public long getPatientPersonId() { return patientPersonId; }
        public void setPatientPersonId(long patientPersonId) { this.patientPersonId = patientPersonId; }
        public long getDoctorPersonId() { return doctorPersonId; }
        public void setDoctorPersonId(long doctorPersonId) { this.doctorPersonId = doctorPersonId; }
    }
}
