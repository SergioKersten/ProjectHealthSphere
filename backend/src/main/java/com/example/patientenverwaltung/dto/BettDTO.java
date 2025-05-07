package com.example.patientenverwaltung.dto;

import lombok.Data;

@Data
public class BettDTO {
    private Integer bettID;
    private Integer nummer;
    private boolean belegt;
    private Integer aktuellerPatientID;
    private Integer zimmerID;
    private ZimmerDTO zimmer;
}


