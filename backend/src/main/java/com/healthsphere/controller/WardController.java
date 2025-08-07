package com.healthsphere.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.components.Ward;
import com.healthsphere.manager.WardManager;

/**
 * REST-Controller für die Stationsverwaltung im HealthSphere-System.
 * 
 * Stellt HTTP-Endpunkte für Ward-Management bereit mit erweiterten
 * Funktionen für Kapazitätsmanagement und Echtzeit-Belegungsüberwachung.
 * Integriert eng mit dem WardManager für spezialisierte Stationsoperationen.
 * 
 * Erweiterte Funktionen:
 * - Kapazitätsbasierte Filterung (GET /capacity/{minCapacity})
 * - Echtzeit-Belegungsdaten (GET /{id}/capacity)
 * - Automatische Ward-ID-Generierung
 * - Integration mit PatientManager für Belegungsberechnungen
 * 
 * API-Endpunkte:
 * - GET /api/wards - Alle Stationen abrufen
 * - GET /api/wards/{id} - Spezifische Station abrufen
 * - GET /api/wards/capacity/{minCapacity} - Stationen nach Mindestkapazität
 * - GET /api/wards/{id}/capacity - Detaillierte Kapazitätsdaten
 * - POST /api/wards - Neue Station erstellen
 * - PUT /api/wards/{id} - Station aktualisieren
 * - DELETE /api/wards/{id} - Station löschen
 * 
 */
@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "*")
public class WardController {

    private final WardManager wardManager;

    public WardController() {
        // WardManager mit Auto-Save initialisieren (.ser Datei wie andere Entitäten)
        this.wardManager = new WardManager("wards.ser");
    }

    @GetMapping
    public ResponseEntity<Set<Ward>> getAllWards() {
        return ResponseEntity.ok(wardManager.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ward> getWardById(@PathVariable int id) {
        Ward ward = wardManager.findById(id);
        if (ward != null) {
            return ResponseEntity.ok(ward);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<Set<Ward>> getWardsByMinCapacity(@PathVariable int minCapacity) {
        Set<Ward> wards = wardManager.filter(ward -> ward.getCapacity() >= minCapacity);
        return ResponseEntity.ok(wards);
    }

    @PostMapping
    public ResponseEntity<String> createWard(@RequestBody WardRequest request) {
        try {
            boolean added = wardManager.addWardWithAutoId(
                    request.getWardName(),
                    request.getDescription(),
                    request.getCapacity());

            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Station erfolgreich erstellt");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Station konnte nicht erstellt werden");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fehler beim Erstellen der Station: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateWard(
            @PathVariable int id,
            @RequestBody WardUpdateRequest request) {

        boolean updated = wardManager.updateWard(
                id,
                request.getWardName(),
                request.getDescription(),
                request.getCapacity());

        if (updated) {
            return ResponseEntity.ok("Station erfolgreich aktualisiert");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWard(@PathVariable int id) {
        boolean deleted = wardManager.deleteWard(id);
        if (deleted) {
            return ResponseEntity.ok("Station erfolgreich gelöscht");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/capacity")
    public ResponseEntity<Map<String, Object>> getWardCapacity(@PathVariable int id) {
        Map<String, Object> capacityData = wardManager.getWardCapacityData(id);
        if (capacityData != null) {
            return ResponseEntity.ok(capacityData);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/capacity/all")
    public ResponseEntity<List<Map<String, Object>>> getAllWardCapacities() {
        List<Map<String, Object>> allCapacities = wardManager.getAllWardCapacityData();
        return ResponseEntity.ok(allCapacities);
    }

    // DTO Classes
    public static class WardRequest {
        private int wardId;
        private String wardName;
        private String description;
        private int capacity;

        // Getters and Setters
        public int getWardId() {
            return wardId;
        }

        public void setWardId(int wardId) {
            this.wardId = wardId;
        }

        public String getWardName() {
            return wardName;
        }

        public void setWardName(String wardName) {
            this.wardName = wardName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }
    }

    public static class WardUpdateRequest {
        private String wardName;
        private String description;
        private Integer capacity;

        // Getters and Setters
        public String getWardName() {
            return wardName;
        }

        public void setWardName(String wardName) {
            this.wardName = wardName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getCapacity() {
            return capacity;
        }

        public void setCapacity(Integer capacity) {
            this.capacity = capacity;
        }
    }
}