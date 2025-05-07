package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Station")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stationID;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer etage;
    
    @Column(nullable = false)
    private Integer bettenAnzahl;
    
    @ManyToOne
    @JoinColumn(name = "stationsleiterID")
    private Arzt stationsleiter;
    
    @OneToMany(mappedBy = "station")
    private List<Zimmer> zimmer;
}

