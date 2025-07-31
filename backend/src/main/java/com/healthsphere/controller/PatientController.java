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

import com.healthsphere.components.Patient;
import com.healthsphere.manager.PersonManager;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PersonManager<Patient> patientManager;

    public PatientController() {
        this.patientManager = new PersonManager<>("patients.ser");
    }

    @GetMapping
    public ResponseEntity<Set<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientManager.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable long id) {
        Patient patient = patientManager.findById(id);
        if (patient != null) {
            return ResponseEntity.ok(patient);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<String> createPatient(@RequestBody PatientRequest request) {
        try {
            long newId = generateUniqueId();
            Patient patient = new Patient(
                    newId, // Automatisch generierte ID
                    request.getName(),
                    request.getFirstname(),
                    request.getPhonenumber(),
                    request.getEmail(),
                    request.getBirthdate(),
                    request.getAdress(),
                    request.getWardId());

            boolean added = patientManager.addPerson(patient);
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Patient erfolgreich erstellt");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Patient mit dieser ID existiert bereits");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fehler beim Erstellen des Patienten: " + e.getMessage());
        }
    }

    private long generateUniqueId() {
        Set<Patient> allPatients = patientManager.getAll();
        if (allPatients.isEmpty()) {
            return 1;
        }

        // Finde die höchste existierende ID und füge 1 hinzu
        long maxId = allPatients.stream()
                .mapToLong(Patient::getPersonId)
                .max()
                .orElse(0);

        return maxId + 1;
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePatient(
            @PathVariable long id,
            @RequestBody PatientUpdateRequest request) {

        // Verwende die neue kombinierte Update-Methode die Ward-Updates unterstützt
        boolean updated = patientManager.updatePatient(
                id,
                request.getName(),
                request.getFirstname(),
                request.getPhonenumber(),
                request.getEmail(),
                request.getAdress(),
                request.getWardId() // Ward-ID Update hinzugefügt
        );

        if (updated) {
            return ResponseEntity.ok("Patient erfolgreich aktualisiert");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable long id) {
        boolean deleted = patientManager.deletePerson(id);
        if (deleted) {
            return ResponseEntity.ok("Patient erfolgreich gelöscht");
        }
        return ResponseEntity.notFound().build();
    }

    // DTO Classes - erweitert um Ward-Unterstützung
    public static class PatientRequest {
        private String name;
        private String firstname;
        private String phonenumber;
        private String email;
        private LocalDate birthdate;
        private String adress;
        private Integer wardId; // Ward-ID hinzugefügt

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFirstname() {
            return firstname;
        }

        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }

        public String getPhonenumber() {
            return phonenumber;
        }

        public void setPhonenumber(String phonenumber) {
            this.phonenumber = phonenumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public LocalDate getBirthdate() {
            return birthdate;
        }

        public void setBirthdate(LocalDate birthdate) {
            this.birthdate = birthdate;
        }

        public String getAdress() {
            return adress;
        }

        public void setAdress(String adress) {
            this.adress = adress;
        }

        public Integer getWardId() {
            return wardId;
        }

        public void setWardId(Integer wardId) {
            this.wardId = wardId;
        }
    }

    public static class PatientUpdateRequest {
        private String name;
        private String firstname;
        private String phonenumber;
        private String email;
        private String adress;
        private Integer wardId; // Ward-ID hinzugefügt

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFirstname() {
            return firstname;
        }

        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }

        public String getPhonenumber() {
            return phonenumber;
        }

        public void setPhonenumber(String phonenumber) {
            this.phonenumber = phonenumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAdress() {
            return adress;
        }

        public void setAdress(String adress) {
            this.adress = adress;
        }

        public Integer getWardId() {
            return wardId;
        }

        public void setWardId(Integer wardId) {
            this.wardId = wardId;
        }
    }
}