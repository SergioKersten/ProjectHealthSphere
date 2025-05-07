package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.dto.PatientDTO;
import com.example.patientenverwaltung.model.Patient;
import com.example.patientenverwaltung.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patienten")
public class PatientController {
    
    private final PatientService patientService;
    
    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }
    
    @GetMapping
    public ResponseEntity<List<PatientDTO>> allePatientenFinden() {
        List<Patient> patienten = patientService.allePatientenFinden();
        List<PatientDTO> patientenDTOs = patienten.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(patientenDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> patientFindenById(@PathVariable Integer id) {
        return patientService.patientFindenById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/suche")
    public ResponseEntity<List<PatientDTO>> patientenSuchen(@RequestParam String suchbegriff) {
        List<Patient> patienten = patientService.patientenSuchen(suchbegriff);
        List<PatientDTO> patientenDTOs = patienten.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(patientenDTOs);
    }
    
    @PostMapping
    public ResponseEntity<PatientDTO> patientErstellen(@RequestBody PatientDTO patientDTO) {
        Patient patient = convertToEntity(patientDTO);
        Patient gespeicherterPatient = patientService.patientSpeichern(patient);
        return new ResponseEntity<>(convertToDTO(gespeicherterPatient), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> patientAktualisieren(@PathVariable Integer id, @RequestBody PatientDTO patientDTO) {
        if (!patientService.patientFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Patient patient = convertToEntity(patientDTO);
        patient.setPatientID(id);
        Patient aktualisierterPatient = patientService.patientSpeichern(patient);
        return ResponseEntity.ok(convertToDTO(aktualisierterPatient));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> patientLöschen(@PathVariable Integer id) {
        if (!patientService.patientFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        patientService.patientLöschen(id);
        return ResponseEntity.noContent().build();
    }
    
    // DTO-Konvertierungsmethoden
    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientID(patient.getPatientID());
        patientDTO.setName(patient.getName());
        patientDTO.setVorname(patient.getVorname());
        patientDTO.setGeburtsdatum(patient.getGeburtsdatum());
        patientDTO.setAdresse(patient.getAdresse());
        patientDTO.setTelefon(patient.getTelefon());
        patientDTO.setVersicherungsnummer(patient.getVersicherungsnummer());
        
        if (patient.getVersicherung() != null) {
            patientDTO.setVersicherungID(patient.getVersicherung().getVersicherungID());
        }
        
        return patientDTO;
    }
    
    private Patient convertToEntity(PatientDTO patientDTO) {
        Patient patient = new Patient();
        patient.setPatientID(patientDTO.getPatientID());
        patient.setName(patientDTO.getName());
        patient.setVorname(patientDTO.getVorname());
        patient.setGeburtsdatum(patientDTO.getGeburtsdatum());
        patient.setAdresse(patientDTO.getAdresse());
        patient.setTelefon(patientDTO.getTelefon());
        patient.setVersicherungsnummer(patientDTO.getVersicherungsnummer());
        
        // Versicherung wird im Service später gesetzt, wenn nötig
        
        return patient;
    }
}


