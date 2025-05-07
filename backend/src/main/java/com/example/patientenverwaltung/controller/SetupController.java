package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.service.BenutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/setup")
public class SetupController {
    
    @Autowired
    private BenutzerService benutzerService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/create-admin")
    public ResponseEntity<String> createAdmin() {
        Benutzer benutzer = new Benutzer();
        benutzer.setBenutzername("testadmin");
        benutzer.setPasswortHash(passwordEncoder.encode("password"));
        benutzer.setRolle("ADMIN");
        
        benutzerService.benutzerErstellen(benutzer);
        return ResponseEntity.ok("Admin-Benutzer erstellt: testadmin / password");
    }
}



