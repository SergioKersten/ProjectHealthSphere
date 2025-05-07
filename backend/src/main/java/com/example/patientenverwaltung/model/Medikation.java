package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.Date;

import lombok.Data;

@Data
@Entity
@Table(name = "Medikation")
public class Medikation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer medikationID;
    
    @Column(nullable = false)
    private String medikamentenName;
    
    @Column(nullable = false)
    private String dosierung;
    
    @Column(nullable = false)
    private String häufigkeit;
    
    @Column(nullable = false)
    private Date startDatum;
    
    private Date endDatum;
    
    @ManyToOne
    @JoinColumn(name = "behandlungID", nullable = false)
    private Behandlung behandlung;
}

