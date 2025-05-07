package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Medikation;
import com.example.patientenverwaltung.model.Behandlung;
import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.repository.MedikationRepository;
import com.example.patientenverwaltung.repository.BehandlungRepository;
import com.example.patientenverwaltung.repository.BenutzerRepository;
import com.example.patientenverwaltung.exception.ResourceNotFoundException;
import com.example.patientenverwaltung.exception.AccessDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MedikationService {
    
    private final MedikationRepository medikationRepository;
    private final BehandlungRepository behandlungRepository;
    private final BenutzerRepository benutzerRepository;
    
    @Autowired
    public MedikationService(MedikationRepository medikationRepository, 
                            BehandlungRepository behandlungRepository,
                            BenutzerRepository benutzerRepository) {
        this.medikationRepository = medikationRepository;
        this.behandlungRepository = behandlungRepository;
        this.benutzerRepository = benutzerRepository;
    }
    
    public List<Medikation> alleMedikationenFinden() {
        return medikationRepository.findAll();
    }
    
    public List<Medikation> medikationByBehandlung(Integer behandlungId) {
        Behandlung behandlung = behandlungRepository.findById(behandlungId)
                .orElseThrow(() -> new ResourceNotFoundException("Behandlung nicht gefunden"));
        return medikationRepository.findByBehandlung(behandlung);
    }
    
    public Optional<Medikation> medikationFindenById(Integer id) {
        return medikationRepository.findById(id);
    }
    
    @Transactional
    public Medikation medikationErstellen(Medikation medikation, Integer behandlungId, Integer arztId) {
        // Prüfen, ob der User die Rolle "ARZT" hat
        Benutzer benutzer = benutzerRepository.findByArztArztID(arztId)
                .orElseThrow(() -> new ResourceNotFoundException("Arzt nicht gefunden"));
                
        if (!benutzer.getRolle().equals("ARZT")) {
            throw new AccessDeniedException("Nur Ärzte dürfen Medikationen verordnen");
        }
        
        Behandlung behandlung = behandlungRepository.findById(behandlungId)
                .orElseThrow(() -> new ResourceNotFoundException("Behandlung nicht gefunden"));
                
        medikation.setBehandlung(behandlung);
        return medikationRepository.save(medikation);
    }
    
    @Transactional
    public void medikationLöschen(Integer id) {
        medikationRepository.deleteById(id);
    }
}

