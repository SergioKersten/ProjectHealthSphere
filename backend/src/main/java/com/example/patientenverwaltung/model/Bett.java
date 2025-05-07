package com.example.patientenverwaltung.model;

import jakarta.persistence.*;

import lombok.Data;

@Data
@Entity
@Table(name = "Bett")
public class Bett {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bettID;
    
    @Column(nullable = false)
    private Integer nummer;
    
    private boolean belegt = false;
    
    @OneToOne
    @JoinColumn(name = "aktuellerPatientID")
    private Patient aktuellerPatient;
    
    @ManyToOne
    @JoinColumn(name = "zimmerID", nullable = false)
    private Zimmer zimmer;
}

