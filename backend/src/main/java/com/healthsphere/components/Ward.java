package com.healthsphere.components;

import java.io.Serializable;
import java.util.Objects;

import com.healthsphere.manager.PersonManager;

public class Ward implements Serializable {
    private static final long serialVersionUID = 1L;

    private int WardId;
    private String WardName;
    private String description;
    private int capacity;

    public Ward(int WardId, String WardName, String description, int capacity) {
        this.WardId = WardId;
        this.WardName = WardName;
        this.description = description;
        this.capacity = capacity;
    }

    /**
     * Prüft ob Ward noch Platz hat
     */
    public boolean hasCapacity(PersonManager<Patient> patientManager) {
        if (patientManager == null) {
            return false;
        }

        // Zähle Patienten in dieser Ward
        long currentPatients = getCurrentOccupancy(patientManager);
        return currentPatients < capacity;
    }

    /**
     * Gibt die aktuelle Belegung zurück
     */
    public long getCurrentOccupancy(PersonManager<Patient> patientManager) {
        if (patientManager == null) {
            return 0;
        }

        return patientManager.getAll().stream()
                .filter(patient -> patient.getWardId() != null)
                .filter(patient -> patient.getWardId().equals(this.WardId))
                .count();
    }

    /**
     * Gibt die Anzahl freier Plätze zurück
     */
    public long getAvailableCapacity(PersonManager<Patient> patientManager) {
        long currentOccupancy = getCurrentOccupancy(patientManager);
        return Math.max(0, capacity - currentOccupancy);
    }

    /**
     * Gibt detaillierte Kapazitätsinformationen als String zurück
     */
    public String getCapacityStatus(PersonManager<Patient> patientManager) {
        if (patientManager == null) {
            return "Kapazitätsstatus nicht verfügbar";
        }

        long currentOccupancy = getCurrentOccupancy(patientManager);
        long availableCapacity = getAvailableCapacity(patientManager);
        boolean hasCapacity = hasCapacity(patientManager);

        return String.format("Belegung: %d/%d | Frei: %d | Status: %s",
                currentOccupancy, capacity, availableCapacity,
                hasCapacity ? "Verfügbar" : "Voll");
    }

    // Standard Getter und Setter
    public int getWardId() {
        return WardId;
    }

    public void setWardId(int WardId) {
        this.WardId = WardId;
    }

    public String getWardName() {
        return WardName;
    }

    public void setWardName(String name) {
        this.WardName = name;
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Ward))
            return false;
        Ward ward = (Ward) o;
        return WardId == ward.WardId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(WardId);
    }

    @Override
    public String toString() {
        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
            long currentOccupancy = getCurrentOccupancy(patientManager);
            long availableCapacity = getAvailableCapacity(patientManager);
            boolean hasCapacity = hasCapacity(patientManager);

            return String.format("Ward{wardId=%d, wardName='%s', description='%s', capacity=%d, " +
                    "currentOccupancy=%d, availableCapacity=%d, hasCapacity=%s}",
                    WardId, WardName, description, capacity,
                    currentOccupancy, availableCapacity, hasCapacity);
        } catch (Exception e) {
            // Fallback wenn PatientManager nicht verfügbar
            return String.format("Ward{wardId=%d, wardName='%s', description='%s', capacity=%d}",
                    WardId, WardName, description, capacity);
        }
    }
}