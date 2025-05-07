package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer patientID;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String vorname;
    
    @Column(nullable = false)
    private Date geburtsdatum;
    
    private String adresse;
    private String telefon;
    private String versicherungsnummer;
    
    @ManyToOne
    @JoinColumn(name = "versicherungID")
    private Versicherung versicherung;
    
    @OneToMany(mappedBy = "patient")
    private List<Termin> termine;
    
    @OneToMany(mappedBy = "patient")
    private List<Behandlung> behandlungen;
    
    @OneToOne(mappedBy = "aktuellerPatient")
    private Bett bett;
    
    public String getPatientDetails() {
        return name + " " + vorname + " (ID: " + patientID + ")";
    }
}

