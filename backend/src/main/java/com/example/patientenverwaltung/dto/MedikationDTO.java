package com.example.patientenverwaltung.dto;

import lombok.Data;
import java.util.Date;

@Data
public class MedikationDTO {
    private Integer medikationID;
    private String medikamentenName;
    private String dosierung;
    private String häufigkeit;
    private Date startDatum;
    private Date endDatum;
    private Integer behandlungID;
}


