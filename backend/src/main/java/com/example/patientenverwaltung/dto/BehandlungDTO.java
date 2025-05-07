package com.example.patientenverwaltung.dto;

import lombok.Data;
import java.util.Date;

@Data
public class BehandlungDTO {
    private Integer behandlungID;
    private Date datum;
    private String therapie;
    private Integer patientID;
    private Integer behandelnderArztID;
}


