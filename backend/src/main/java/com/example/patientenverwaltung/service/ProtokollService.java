package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Protokoll;
import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.repository.ProtokollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ProtokollService {
    
    private final ProtokollRepository protokollRepository;
    
    @Autowired
    public ProtokollService(ProtokollRepository protokollRepository) {
        this.protokollRepository = protokollRepository;
    }
    
    public List<Protokoll> alleProtokolleFindenByBenutzer(Benutzer benutzer) {
        return protokollRepository.findByBenutzer(benutzer);
    }
    
    public List<Protokoll> alleProtokolleFindenByZeitspanne(Date von, Date bis) {
        return protokollRepository.findByZeitstempelBetween(von, bis);
    }
    
    @Transactional
    public Protokoll protokollieren(Benutzer benutzer, String aktion, String beschreibung) {
        Protokoll protokoll = new Protokoll();
        protokoll.setBenutzer(benutzer);
        protokoll.setAktion(aktion);
        protokoll.setBeschreibung(beschreibung);
        protokoll.setZeitstempel(new Date());
        
        return protokollRepository.save(protokoll);
    }
}


