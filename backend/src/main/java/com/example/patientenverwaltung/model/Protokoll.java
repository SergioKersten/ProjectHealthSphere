package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;

import lombok.Data;

@Data
@Entity
@Table(name = "Protokoll")
public class Protokoll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer protokollID;
    
    @ManyToOne
    @JoinColumn(name = "benutzerID", nullable = false)
    private Benutzer benutzer;
    
    @Column(nullable = false)
    private String aktion;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date zeitstempel = new Date();
    
    private String beschreibung;
}

