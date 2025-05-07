package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Bett;
import com.example.patientenverwaltung.model.Patient;
import com.example.patientenverwaltung.repository.BettRepository;
import com.example.patientenverwaltung.repository.PatientRepository;
import com.example.patientenverwaltung.exception.ResourceNotFoundException;
import com.example.patientenverwaltung.exception.BusinessRuleViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BettService {
    
    private final BettRepository bettRepository;
    private final PatientRepository patientRepository;
    
    @Autowired
    public BettService(BettRepository bettRepository, PatientRepository patientRepository) {
        this.bettRepository = bettRepository;
        this.patientRepository = patientRepository;
    }
    
    public List<Bett> alleBettenFinden() {
        return bettRepository.findAll();
    }
    
    public List<Bett> verfügbareBettenFinden() {
        return bettRepository.findByBelegt(false);
    }
    
    @Transactional
    public Bett bettBelegen(Integer bettId, Integer patientId) {
        Bett bett = bettRepository.findById(bettId)
                .orElseThrow(() -> new ResourceNotFoundException("Bett nicht gefunden"));
                
        if (bett.isBelegt()) {
            throw new BusinessRuleViolationException("Bett ist bereits belegt");
        }
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient nicht gefunden"));
                
        bett.setBelegt(true);
        bett.setAktuellerPatient(patient);
        
        return bettRepository.save(bett);
    }
    
    @Transactional
    public Bett bettFreigeben(Integer bettId) {
        Bett bett = bettRepository.findById(bettId)
                .orElseThrow(() -> new ResourceNotFoundException("Bett nicht gefunden"));
                
        bett.setBelegt(false);
        bett.setAktuellerPatient(null);
        
        return bettRepository.save(bett);
    }
}

