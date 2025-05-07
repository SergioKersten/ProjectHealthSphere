package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Behandlung")
public class Behandlung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer behandlungID;
    
    @Column(nullable = false)
    private Date datum;
    
    private String therapie;
    
    @ManyToOne
    @JoinColumn(name = "patientID", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "behandelnderArztID", nullable = false)
    private Arzt behandelnderArzt;
    
    @OneToMany(mappedBy = "behandlung")
    private List<Diagnose> diagnosen;
    
    @OneToMany(mappedBy = "behandlung")
    private List<Medikation> medikationen;
}

