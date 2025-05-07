package com.example.patientenverwaltung.dto;

import lombok.Data;
import java.util.Date;

@Data
public class PatientDTO {
    private Integer patientID;
    private String name;
    private String vorname;
    private Date geburtsdatum;
    private String adresse;
    private String telefon;
    private String versicherungsnummer;
    private Integer versicherungID;
}


