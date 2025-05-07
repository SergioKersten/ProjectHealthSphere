package com.example.patientenverwaltung.dto;

import lombok.Data;

@Data
public class ZimmerDTO {
    private Integer zimmerID;
    private Integer nummer;
    private Integer etage;
    private Integer bettenAnzahl;
    private Integer stationID;
    private StationDTO station;
}


