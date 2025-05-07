package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Patient;
import com.example.patientenverwaltung.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }
    
    public List<Patient> allePatientenFinden() {
        return patientRepository.findAll();
    }
    
    public Optional<Patient> patientFindenById(Integer id) {
        return patientRepository.findById(id);
    }
    
    public List<Patient> patientenSuchen(String suchbegriff) {
        return patientRepository.suchePatienten(suchbegriff);
    }
    
    @Transactional
    public Patient patientSpeichern(Patient patient) {
        return patientRepository.save(patient);
    }
    
    @Transactional
    public void patientLöschen(Integer id) {
        patientRepository.deleteById(id);
    }
}

