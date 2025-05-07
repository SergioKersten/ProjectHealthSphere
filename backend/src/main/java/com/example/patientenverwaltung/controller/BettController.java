package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.dto.BettDTO;
import com.example.patientenverwaltung.model.Bett;
import com.example.patientenverwaltung.service.BettService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/betten")
public class BettController {
    
    private final BettService bettService;
    
    @Autowired
    public BettController(BettService bettService) {
        this.bettService = bettService;
    }
    
    @GetMapping
    public ResponseEntity<List<BettDTO>> alleBettenFinden() {
        List<Bett> betten = bettService.alleBettenFinden();
        List<BettDTO> bettenDTOs = betten.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bettenDTOs);
    }
    
    @GetMapping("/verfügbar")
    public ResponseEntity<List<BettDTO>> verfügbareBettenFinden() {
        List<Bett> betten = bettService.verfügbareBettenFinden();
        List<BettDTO> bettenDTOs = betten.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bettenDTOs);
    }
    
    @PostMapping("/{bettId}/zuweisen/{patientId}")
    public ResponseEntity<BettDTO> bettZuweisen(@PathVariable Integer bettId, @PathVariable Integer patientId) {
        Bett bett = bettService.bettBelegen(bettId, patientId);
        return ResponseEntity.ok(convertToDTO(bett));
    }
    
    @PostMapping("/{bettId}/freigeben")
    public ResponseEntity<BettDTO> bettFreigeben(@PathVariable Integer bettId) {
        Bett bett = bettService.bettFreigeben(bettId);
        return ResponseEntity.ok(convertToDTO(bett));
    }
    
    // DTO-Konvertierungsmethode
    private BettDTO convertToDTO(Bett bett) {
        BettDTO bettDTO = new BettDTO();
        bettDTO.setBettID(bett.getBettID());
        bettDTO.setNummer(bett.getNummer());
        bettDTO.setBelegt(bett.isBelegt());
        
        if (bett.getAktuellerPatient() != null) {
            bettDTO.setAktuellerPatientID(bett.getAktuellerPatient().getPatientID());
        }
        
        if (bett.getZimmer() != null) {
            bettDTO.setZimmerID(bett.getZimmer().getZimmerID());
        }
        
        return bettDTO;
    }
}


