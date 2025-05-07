package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Versicherung")
public class Versicherung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer versicherungID;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String typ;
    
    private String kontaktdaten;
    
    @OneToMany(mappedBy = "versicherung")
    private List<Patient> patienten;
}

