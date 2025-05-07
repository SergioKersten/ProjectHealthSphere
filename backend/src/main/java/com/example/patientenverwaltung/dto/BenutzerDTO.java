package com.example.patientenverwaltung.dto;

import lombok.Data;

@Data
public class BenutzerDTO {
    private Integer benutzerID;
    private String benutzername;
    private String passwort;
    private String rolle;
    private Integer arztID;
}


