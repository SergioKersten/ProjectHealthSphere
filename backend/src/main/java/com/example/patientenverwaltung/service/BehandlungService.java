package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Behandlung;
import com.example.patientenverwaltung.model.Diagnose;
import com.example.patientenverwaltung.repository.BehandlungRepository;
import com.example.patientenverwaltung.repository.DiagnoseRepository;
import com.example.patientenverwaltung.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BehandlungService {
    
    private final BehandlungRepository behandlungRepository;
    private final DiagnoseRepository diagnoseRepository;
    
    @Autowired
    public BehandlungService(BehandlungRepository behandlungRepository, DiagnoseRepository diagnoseRepository) {
        this.behandlungRepository = behandlungRepository;
        this.diagnoseRepository = diagnoseRepository;
    }
    
    public List<Behandlung> alleBehandlungenFinden() {
        return behandlungRepository.findAll();
    }
    
    public Optional<Behandlung> behandlungFindenById(Integer id) {
        return behandlungRepository.findById(id);
    }
    
    @Transactional
    public Behandlung behandlungErstellen(Behandlung behandlung) {
        return behandlungRepository.save(behandlung);
    }
    
    @Transactional
    public Behandlung behandlungMitDiagnoseErstellen(Behandlung behandlung, Diagnose diagnose) {
        Behandlung gespeicherteBehandlung = behandlungRepository.save(behandlung);
        diagnose.setBehandlung(gespeicherteBehandlung);
        diagnoseRepository.save(diagnose);
        return gespeicherteBehandlung;
    }
    
    @Transactional
    public void behandlungLöschen(Integer id) {
        behandlungRepository.deleteById(id);
    }
}

