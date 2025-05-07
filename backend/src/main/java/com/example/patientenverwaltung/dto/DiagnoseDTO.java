package com.example.patientenverwaltung.dto;

import lombok.Data;
import java.util.Date;

@Data
public class DiagnoseDTO {
    private Integer diagnoseID;
    private String bezeichnung;
    private String beschreibung;
    private String icdCode;
    private Date diagnoseDatum;
    private Integer behandlungID;
    private Integer diagnostizierenderArztID;
}


