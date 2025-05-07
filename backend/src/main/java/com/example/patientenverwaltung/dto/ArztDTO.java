package com.example.patientenverwaltung.dto;

import lombok.Data;

@Data
public class ArztDTO {
    private Integer arztID;
    private String name;
    private String vorname;
    private String fachbereich;
    private String telefon;
    private String email;
}


