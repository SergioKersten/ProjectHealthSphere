package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.dto.TerminDTO;
import com.example.patientenverwaltung.model.Termin;
import com.example.patientenverwaltung.model.Arzt;
import com.example.patientenverwaltung.service.TerminService;
import com.example.patientenverwaltung.service.ArztService;
import com.example.patientenverwaltung.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/termine")
public class TerminController {
    
    private final TerminService terminService;
    private final ArztService arztService;
    
    @Autowired
    public TerminController(TerminService terminService, ArztService arztService) {
        this.terminService = terminService;
        this.arztService = arztService;
    }
    
    @GetMapping
    public ResponseEntity<List<TerminDTO>> termineFinden(
            @RequestParam(required = false) Integer arztId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date datum) {
        
        List<Termin> termine;
        
        if (arztId != null && datum != null) {
            Arzt arzt = arztService.arztFindenById(arztId)
                    .orElseThrow(() -> new ResourceNotFoundException("Arzt nicht gefunden"));
            termine = terminService.termineByArztAndDatum(arzt, datum);
        } else if (datum != null) {
            termine = terminService.termineByDatum(datum);
        } else {
            termine = terminService.alleTermineFinden();
        }
        
        List<TerminDTO> terminDTOs = termine.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(terminDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TerminDTO> terminFindenById(@PathVariable Integer id) {
        return terminService.terminFindenById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<TerminDTO> terminErstellen(@RequestBody TerminDTO terminDTO) {
        Termin termin = convertToEntity(terminDTO);
        Termin gespeicherterTermin = terminService.terminErstellen(termin);
        return new ResponseEntity<>(convertToDTO(gespeicherterTermin), HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> terminLöschen(@PathVariable Integer id) {
        if (!terminService.terminFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        terminService.terminLöschen(id);
        return ResponseEntity.noContent().build();
    }
    
// DTO-Konvertierungsmethoden
    private TerminDTO convertToDTO(Termin termin) {
        TerminDTO terminDTO = new TerminDTO();
        terminDTO.setTerminID(termin.getTerminID());
        terminDTO.setDatum(termin.getDatum());
        terminDTO.setUhrzeit(termin.getUhrzeit());
        terminDTO.setDauer(termin.getDauer());
        terminDTO.setNotizen(termin.getNotizen());
        
        if (termin.getPatient() != null) {
            terminDTO.setPatientID(termin.getPatient().getPatientID());
        }
        
        if (termin.getArzt() != null) {
            terminDTO.setArztID(termin.getArzt().getArztID());
        }
        
        return terminDTO;
    }
    
    private Termin convertToEntity(TerminDTO terminDTO) {
        Termin termin = new Termin();
        termin.setTerminID(terminDTO.getTerminID());
        termin.setDatum(terminDTO.getDatum());
        termin.setUhrzeit(terminDTO.getUhrzeit());
        termin.setDauer(terminDTO.getDauer());
        termin.setNotizen(terminDTO.getNotizen());
        
        // Patient und Arzt müssen im Service gesetzt werden
        
        return termin;
    }
}



