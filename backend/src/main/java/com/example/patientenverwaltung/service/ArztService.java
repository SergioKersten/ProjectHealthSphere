package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Arzt;
import com.example.patientenverwaltung.repository.ArztRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ArztService {
    
    private final ArztRepository arztRepository;
    
    @Autowired
    public ArztService(ArztRepository arztRepository) {
        this.arztRepository = arztRepository;
    }
    
    public List<Arzt> alleÄrzteFinden() {
        return arztRepository.findAll();
    }
    
    public Optional<Arzt> arztFindenById(Integer id) {
        return arztRepository.findById(id);
    }
    
    public List<Arzt> ärzteByFachbereich(String fachbereich) {
        return arztRepository.findByFachbereich(fachbereich);
    }
    
    @Transactional
    public Arzt arztSpeichern(Arzt arzt) {
        return arztRepository.save(arzt);
    }
    
    @Transactional
    public void arztLöschen(Integer id) {
        arztRepository.deleteById(id);
    }
}


