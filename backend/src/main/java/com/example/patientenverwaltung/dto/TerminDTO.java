package com.example.patientenverwaltung.dto;

import lombok.Data;
import java.util.Date;
import java.sql.Time;

@Data
public class TerminDTO {
    private Integer terminID;
    private Date datum;
    private Time uhrzeit;
    private Integer dauer;
    private String notizen;
    private Integer patientID;
    private Integer arztID;
    private PatientDTO patient;
    private ArztDTO arzt;
}


