package com.example.patientenverwaltung.controller;


import com.example.patientenverwaltung.config.JwtTokenProvider;
import com.example.patientenverwaltung.dto.BenutzerDTO;
import com.example.patientenverwaltung.model.Benutzer;
import com.example.patientenverwaltung.service.BenutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private BenutzerService benutzerService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        try {
            // Log für Debug
            System.out.println("Login-Versuch für: " + request.getBenutzername());


            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getBenutzername(), request.getPasswort()));
                    
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Log für Debug
            System.out.println("Authentifizierung erfolgreich für: " + userDetails.getUsername());
            
            String jwt = jwtTokenProvider.generateToken(userDetails);
            
            Benutzer benutzer = benutzerService.benutzerFindenByBenutzername(request.getBenutzername())
                    .orElseThrow(() -> new RuntimeException("Benutzer nicht gefunden"));
                    
            BenutzerDTO benutzerDTO = convertToDTO(benutzer);
            
            return ResponseEntity.ok(new AuthResponseDTO(jwt, benutzerDTO));
        } catch (Exception e) {
            // Log für Debug
            System.out.println("Fehler beim Login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
    
    private BenutzerDTO convertToDTO(Benutzer benutzer) {
        BenutzerDTO benutzerDTO = new BenutzerDTO();
        benutzerDTO.setBenutzerID(benutzer.getBenutzerID());
        benutzerDTO.setBenutzername(benutzer.getBenutzername());
        benutzerDTO.setRolle(benutzer.getRolle());
        
        if (benutzer.getArzt() != null) {
            benutzerDTO.setArztID(benutzer.getArzt().getArztID());
        }
        
        return benutzerDTO;
    }
    
    public static class AuthRequestDTO {
        private String benutzername;
        private String passwort;
        
        public String getBenutzername() {
            return benutzername;
        }
        
        public void setBenutzername(String benutzername) {
            this.benutzername = benutzername;
        }
        
        public String getPasswort() {
            return passwort;
        }
        
        public void setPasswort(String passwort) {
            this.passwort = passwort;
        }
    }
    
    public static class AuthResponseDTO {
        private String token;
        private BenutzerDTO user;
        
        public AuthResponseDTO(String token, BenutzerDTO user) {
            this.token = token;
            this.user = user;
        }
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
        
        public BenutzerDTO getUser() {
            return user;
        }
        
        public void setUser(BenutzerDTO user) {
            this.user = user;
        }
    }
}




