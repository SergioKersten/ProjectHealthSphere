package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Diagnose;
import com.example.patientenverwaltung.model.Behandlung;
import com.example.patientenverwaltung.repository.DiagnoseRepository;
import com.example.patientenverwaltung.repository.BehandlungRepository;
import com.example.patientenverwaltung.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DiagnoseService {
    
    private final DiagnoseRepository diagnoseRepository;
    private final BehandlungRepository behandlungRepository;
    
    @Autowired
    public DiagnoseService(DiagnoseRepository diagnoseRepository, BehandlungRepository behandlungRepository) {
        this.diagnoseRepository = diagnoseRepository;
        this.behandlungRepository = behandlungRepository;
    }
    
    public List<Diagnose> alleDiagnosenFinden() {
        return diagnoseRepository.findAll();
    }
    
    public List<Diagnose> diagnoseByBehandlung(Integer behandlungId) {
        Behandlung behandlung = behandlungRepository.findById(behandlungId)
                .orElseThrow(() -> new ResourceNotFoundException("Behandlung nicht gefunden"));
        return diagnoseRepository.findByBehandlung(behandlung);
    }
    
    public Optional<Diagnose> diagnoseFindenById(Integer id) {
        return diagnoseRepository.findById(id);
    }
    
    @Transactional
    public Diagnose diagnoseErstellen(Diagnose diagnose, Integer behandlungId) {
        Behandlung behandlung = behandlungRepository.findById(behandlungId)
                .orElseThrow(() -> new ResourceNotFoundException("Behandlung nicht gefunden"));
        diagnose.setBehandlung(behandlung);
        return diagnoseRepository.save(diagnose);
    }
    
    @Transactional
    public void diagnoseLöschen(Integer id) {
        diagnoseRepository.deleteById(id);
    }
}

