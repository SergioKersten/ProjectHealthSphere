package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Termin;
import com.example.patientenverwaltung.model.Arzt;
import com.example.patientenverwaltung.repository.TerminRepository;
import com.example.patientenverwaltung.exception.BusinessRuleViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TerminService {
    
    private final TerminRepository terminRepository;
    
    @Autowired
    public TerminService(TerminRepository terminRepository) {
        this.terminRepository = terminRepository;
    }
    
    public List<Termin> alleTermineFinden() {
        return terminRepository.findAll();
    }
    
    public List<Termin> termineByDatum(Date datum) {
        return terminRepository.findByDatum(datum);
    }
    
    public List<Termin> termineByArztAndDatum(Arzt arzt, Date datum) {
        return terminRepository.findByArztAndDatum(arzt, datum);
    }

@Transactional
    public Termin terminErstellen(Termin termin) {
        // Prüfen, ob der Arzt zu diesem Zeitpunkt bereits einen Termin hat
        boolean arztVerfügbar = !terminRepository.existsByArztAndDatumAndUhrzeit(
                termin.getArzt(), termin.getDatum(), termin.getUhrzeit());
                
        if (!arztVerfügbar) {
            throw new BusinessRuleViolationException("Der Arzt hat zu diesem Zeitpunkt bereits einen Termin");
        }
        
        return terminRepository.save(termin);
    }
    
    @Transactional
    public void terminLöschen(Integer id) {
        terminRepository.deleteById(id);
    }
    
    public Optional<Termin> terminFindenById(Integer id) {
        return terminRepository.findById(id);
    }
}

