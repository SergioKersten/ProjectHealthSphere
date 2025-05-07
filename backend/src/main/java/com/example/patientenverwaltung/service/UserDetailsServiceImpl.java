package com.example.patientenverwaltung.service;

import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.repository.BenutzerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private BenutzerRepository benutzerRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Benutzer benutzer = benutzerRepository.findByBenutzername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer nicht gefunden: " + username));
        
        return new User(
            benutzer.getBenutzername(), 
            benutzer.getPasswortHash(), 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + benutzer.getRolle()))
        );
    }
}




