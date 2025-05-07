package com.example.patientenverwaltung.model;

import jakarta.persistence.*;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "Arzt")
public class Arzt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer arztID;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String vorname;
    
    private String fachbereich;
    private String telefon;
    private String email;
    
    @OneToMany(mappedBy = "behandelnderArzt")
    private List<Behandlung> behandlungen;
    
    @OneToMany(mappedBy = "diagnostizierenderArzt")
    private List<Diagnose> diagnosen;
    
    @OneToMany(mappedBy = "arzt")
    private List<Termin> termine;
    
    @OneToMany(mappedBy = "stationsleiter")
    private List<Station> geleiteteStationen;
    
    @OneToOne(mappedBy = "arzt")
    private Benutzer benutzer;
}

