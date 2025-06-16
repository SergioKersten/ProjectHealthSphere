package com.healthsphere.controller;

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

import com.healthsphere.components.Ward;
import com.healthsphere.manager.WardManager;

@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "*")
public class WardController {

    private final WardManager wardManager;

    public WardController() {
        this.wardManager = new WardManager();
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
        Set<Ward> wards = wardManager.filter(ward -> 
            ward.getCapacity() >= minCapacity);
        return ResponseEntity.ok(wards);
    }

    @PostMapping
    public ResponseEntity<String> createWard(@RequestBody WardRequest request) {
        try {
            Ward ward = new Ward(
                request.getWardId(),
                request.getWardName(),
                request.getDescription(),
                request.getCapacity()
            );
            
            boolean added = wardManager.addWard(ward);
            if (added) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Station erfolgreich erstellt");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Station mit dieser ID existiert bereits");
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
            request.getCapacity()
        );
        
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

    // DTO Classes
    public static class WardRequest {
        private int wardId;
        private String wardName;
        private String description;
        private int capacity;

        // Getters and Setters
        public int getWardId() { return wardId; }
        public void setWardId(int wardId) { this.wardId = wardId; }
        public String getWardName() { return wardName; }
        public void setWardName(String wardName) { this.wardName = wardName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
    }

    public static class WardUpdateRequest {
        private String wardName;
        private String description;
        private Integer capacity;

        // Getters and Setters
        public String getWardName() { return wardName; }
        public void setWardName(String wardName) { this.wardName = wardName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Integer getCapacity() { return capacity; }
        public void setCapacity(Integer capacity) { this.capacity = capacity; }
    }
}
