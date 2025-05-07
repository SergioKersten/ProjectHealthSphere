package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Benutzer")
public class Benutzer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer benutzerID;
    
    @Column(nullable = false, unique = true)
    private String benutzername;
    
    @Column(nullable = false)
    private String passwortHash;
    
    @Column(nullable = false)
    private String rolle; // 'Arzt', 'Verwaltung', 'Admin', etc.
    
    @OneToOne
    @JoinColumn(name = "arztID")
    private Arzt arzt;
    
    @OneToMany(mappedBy = "benutzer")
    private List<Protokoll> protokolle;
}

