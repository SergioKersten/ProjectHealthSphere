package com.healthsphere.components;

import java.io.Serializable;
import java.util.Comparator;
import java.util.Objects;

import com.healthsphere.Exceptions.WardExceptions.InvalidWardDataException;
import com.healthsphere.manager.PersonManager;

public class Ward implements Serializable, Comparable<Ward> {
    private static final long serialVersionUID = 1L;

    private int WardId;
    private String WardName;
    private String description;
    private int capacity;

    public Ward(int WardId, String WardName, String description, int capacity)
            throws InvalidWardDataException {
        validateWardData(WardId, WardName, capacity);

        this.WardId = WardId;
        this.WardName = WardName;
        this.description = description;
        this.capacity = capacity;
    }

    /**
     * TEST-KONSTRUKTOR: Fängt Exceptions ab für normale Tests
     */
    public static Ward createForTest(int wardId, String wardName, String description, int capacity) {
        try {
            return new Ward(wardId, wardName, description, capacity);
        } catch (Exception e) {
            System.err.println("TEST-WARNUNG Ward-Erstellung: " + e.getMessage());
            try {
                return new Ward(wardId, "TestWard" + wardId, "Test Description", 10);
            } catch (Exception e2) {
                throw new RuntimeException("Kritischer Fehler bei Test-Ward-Erstellung", e2);
            }
        }
    }

    private void validateWardData(int WardId, String WardName, int capacity)
            throws InvalidWardDataException {
        if (WardId <= 0) {
            throw new InvalidWardDataException("WardId", WardId,
                    "Ward-ID muss größer als 0 sein");
        }
        if (WardName == null || WardName.trim().isEmpty()) {
            throw new InvalidWardDataException("WardName", WardName,
                    "Ward-Name darf nicht leer sein");
        }
        if (capacity <= 0) {
            throw new InvalidWardDataException("capacity", capacity,
                    "Kapazität muss größer als 0 sein");
        }
        if (capacity > 100) {
            throw new InvalidWardDataException("capacity", capacity,
                    "Kapazität darf nicht größer als 100 sein");
        }
    }

    public double getOccupancyRate(PersonManager<Patient> patientManager) {
        if (capacity == 0)
            return 0.0; // Schutz vor Division durch 0
        return (double) getCurrentOccupancy(patientManager) / capacity * 100.0;
    }

    /**
     * Ward-Sortierung:
     * 1. Primär: Nach Name (alphabetisch, alle Stationen gleichwertig)
     * 2. Sekundär: Nach Kapazität (größere zuerst)
     * 3. Tertiär: Nach ID (für eindeutige Sortierung)
     */
    @Override
    public int compareTo(Ward other) {
        if (other == null)
            return 1;

        // 1. Primär nach Name (alphabetisch)
        int nameComparison = this.WardName.compareToIgnoreCase(other.WardName);
        if (nameComparison != 0) {
            return nameComparison;
        }

        // 2. Sekundär nach Kapazität (größere zuerst)
        int capacityComparison = Integer.compare(other.capacity, this.capacity);
        if (capacityComparison != 0) {
            return capacityComparison;
        }

        // 3. Tertiär nach ID
        return Integer.compare(this.WardId, other.WardId);
    }

    // Zusätzliche Comparatoren
    public static final Comparator<Ward> BY_CAPACITY_DESC = Comparator
            .comparing(Ward::getCapacity, Comparator.reverseOrder())
            .thenComparing(Ward::getWardName, String.CASE_INSENSITIVE_ORDER);

    public static final Comparator<Ward> BY_NAME_ONLY = Comparator
            .comparing(Ward::getWardName, String.CASE_INSENSITIVE_ORDER);

    public static Comparator<Ward> byOccupancyRate(PersonManager<Patient> patientManager) {
        return Comparator.<Ward, Double>comparing(
                w -> w.getOccupancyRate(patientManager),
                Comparator.reverseOrder());
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

            return String.format("Ward{wardId=%d, WardName='%s', description='%s', capacity=%d, " +
                    "currentOccupancy=%d, availableCapacity=%d, hasCapacity=%s}",
                    WardId, WardName, description, capacity,
                    currentOccupancy, availableCapacity, hasCapacity);
        } catch (Exception e) {
            // Fallback wenn PatientManager nicht verfügbar
            return String.format("Ward{wardId=%d, WardName='%s', description='%s', capacity=%d}",
                    WardId, WardName, description, capacity);
        }
    }
}