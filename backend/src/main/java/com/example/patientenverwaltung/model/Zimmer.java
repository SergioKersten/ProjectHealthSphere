package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Zimmer")
public class Zimmer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer zimmerID;
    
    @Column(nullable = false)
    private Integer nummer;
    
    @Column(nullable = false)
    private Integer etage;
    
    @Column(nullable = false)
    private Integer bettenAnzahl;
    
    @ManyToOne
    @JoinColumn(name = "stationID", nullable = false)
    private Station station;
    
    @OneToMany(mappedBy = "zimmer")
    private List<Bett> betten;
}

