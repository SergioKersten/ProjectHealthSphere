package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;

import lombok.Data;

@Data
@Entity
@Table(name = "Diagnose")
public class Diagnose {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer diagnoseID;
    
    @Column(nullable = false)
    private String bezeichnung;
    
    private String beschreibung;
    
    @Column(nullable = false)
    private String icdCode;
    
    @Column(nullable = false)
    private Date diagnoseDatum;
    
    @ManyToOne
    @JoinColumn(name = "behandlungID", nullable = false)
    private Behandlung behandlung;
    
    @ManyToOne
    @JoinColumn(name = "diagnostizierenderArztID", nullable = false)
    private Arzt diagnostizierenderArzt;
}

