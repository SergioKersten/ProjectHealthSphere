package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;
import java.sql.Time;

import lombok.Data;

@Data
@Entity
@Table(name = "Termin")
public class Termin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer terminID;
    
    @Column(nullable = false)
    private Date datum;
    
    @Column(nullable = false)
    private Time uhrzeit;
    
    private Integer dauer = 30; // in Minuten
    
    private String notizen;
    
    @ManyToOne
    @JoinColumn(name = "patientID", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "arztID", nullable = false)
    private Arzt arzt;
}

