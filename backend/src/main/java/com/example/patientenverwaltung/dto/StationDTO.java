package com.example.patientenverwaltung.dto;

import lombok.Data;

@Data
public class StationDTO {
    private Integer stationID;
    private String name;
    private Integer etage;
    private Integer bettenAnzahl;
    private Integer stationsleiterID;
}


