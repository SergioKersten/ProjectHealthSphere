package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.dto.ArztDTO;
import com.example.patientenverwaltung.model.Arzt;
import com.example.patientenverwaltung.service.ArztService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ärzte")
public class ArztController {
    
    private final ArztService arztService;
    
    @Autowired
    public ArztController(ArztService arztService) {
        this.arztService = arztService;
    }
    
    @GetMapping
    public ResponseEntity<List<ArztDTO>> alleÄrzteFinden() {
        List<Arzt> ärzte = arztService.alleÄrzteFinden();
        List<ArztDTO> arztDTOs = ärzte.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(arztDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ArztDTO> arztFindenById(@PathVariable Integer id) {
        return arztService.arztFindenById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/fachbereich/{fachbereich}")
    public ResponseEntity<List<ArztDTO>> ärzteByFachbereich(@PathVariable String fachbereich) {
        List<Arzt> ärzte = arztService.ärzteByFachbereich(fachbereich);
        List<ArztDTO> arztDTOs = ärzte.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(arztDTOs);
    }
    
    @PostMapping
    public ResponseEntity<ArztDTO> arztErstellen(@RequestBody ArztDTO arztDTO) {
        Arzt arzt = convertToEntity(arztDTO);
        Arzt gespeicherterArzt = arztService.arztSpeichern(arzt);
        return new ResponseEntity<>(convertToDTO(gespeicherterArzt), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ArztDTO> arztAktualisieren(@PathVariable Integer id, @RequestBody ArztDTO arztDTO) {
        if (!arztService.arztFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Arzt arzt = convertToEntity(arztDTO);
        arzt.setArztID(id);
        Arzt aktualisierterArzt = arztService.arztSpeichern(arzt);
        return ResponseEntity.ok(convertToDTO(aktualisierterArzt));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> arztLöschen(@PathVariable Integer id) {
        if (!arztService.arztFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        arztService.arztLöschen(id);
        return ResponseEntity.noContent().build();
    }
    
    // DTO-Konvertierungsmethoden
    private ArztDTO convertToDTO(Arzt arzt) {
        ArztDTO arztDTO = new ArztDTO();
        arztDTO.setArztID(arzt.getArztID());
        arztDTO.setName(arzt.getName());
        arztDTO.setVorname(arzt.getVorname());
        arztDTO.setFachbereich(arzt.getFachbereich());
        arztDTO.setTelefon(arzt.getTelefon());
        arztDTO.setEmail(arzt.getEmail());
        
        return arztDTO;
    }
    
    private Arzt convertToEntity(ArztDTO arztDTO) {
        Arzt arzt = new Arzt();
        arzt.setArztID(arztDTO.getArztID());
        arzt.setName(arztDTO.getName());
        arzt.setVorname(arztDTO.getVorname());
        arzt.setFachbereich(arztDTO.getFachbereich());
        arzt.setTelefon(arztDTO.getTelefon());
        arzt.setEmail(arztDTO.getEmail());
        
        return arzt;
    }
}


