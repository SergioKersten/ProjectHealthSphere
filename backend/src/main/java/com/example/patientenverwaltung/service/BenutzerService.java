package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.repository.BenutzerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BenutzerService {
    
    private final BenutzerRepository benutzerRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public BenutzerService(BenutzerRepository benutzerRepository, PasswordEncoder passwordEncoder) {
        this.benutzerRepository = benutzerRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<Benutzer> alleBenutzerFinden() {
        return benutzerRepository.findAll();
    }
    
    public Optional<Benutzer> benutzerFindenById(Integer id) {
        return benutzerRepository.findById(id);
    }
    
    public Optional<Benutzer> benutzerFindenByBenutzername(String benutzername) {
        return benutzerRepository.findByBenutzername(benutzername);
    }
    
    @Transactional
    public Benutzer benutzerErstellen(Benutzer benutzer) {
        // Passwort hashen vor dem Speichern
        benutzer.setPasswortHash(passwordEncoder.encode(benutzer.getPasswortHash()));
        return benutzerRepository.save(benutzer);
    }
    
    @Transactional
    public Benutzer benutzerAktualisieren(Benutzer benutzer) {
        // Wenn das Passwort geändert wurde, neu hashen
        if (benutzer.getPasswortHash() != null && !benutzer.getPasswortHash().startsWith("$2a$")) {
            benutzer.setPasswortHash(passwordEncoder.encode(benutzer.getPasswortHash()));
        }
        return benutzerRepository.save(benutzer);
    }
    
    @Transactional
    public void benutzerLöschen(Integer id) {
        benutzerRepository.deleteById(id);
    }
}



