package com.healthsphere.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.healthsphere.components.Patient;
import com.healthsphere.components.Ward;
import com.healthsphere.serialization.SerializationManager;

public class WardManager {
    private Set<Ward> wardSet = new HashSet<>();
    private String filename; // Dateiname für automatisches Speichern
    private boolean autoSaveEnabled = true;

    // Konstruktor ohne Auto-Save
    public WardManager() {
    }

    // Konstruktor mit Auto-Save
    public WardManager(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
        load(); // Automatisch laden beim Start
    }

    // Auto-Save nachträglich aktivieren
    public void enableAutoSave(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
    }

    public void disableAutoSave() {
        this.autoSaveEnabled = false;
    }

    private void autoSave() {
        if (autoSaveEnabled && filename != null) {
            SerializationManager.saveToFile(wardSet, filename);
        }
    }

    // Add a new ward
    public boolean addWard(Ward ward) {
        boolean result = wardSet.add(ward); // returns false if Ward with same ID already exists
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
    }

    // Remove a ward by ID
    public boolean deleteWard(int wardId) {
        boolean result = wardSet.removeIf(w -> w.getWardId() == wardId);
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
    }

    // Find a ward by ID
    public Ward findById(int wardId) {
        for (Ward ward : wardSet) {
            if (ward.getWardId() == wardId) {
                return ward;
            }
        }
        return null;
    }

    // Return all wards
    public Set<Ward> getAll() {
        return wardSet;
    }

    // Filter wards by given predicate (e.g. capacity, name, etc.)
    public Set<Ward> filter(Predicate<Ward> predicate) {
        return wardSet.stream().filter(predicate).collect(Collectors.toSet());
    }

    // Update a ward by ID
    public boolean updateWard(int wardId, String newName, String newDescription, Integer newCapacity) {
        Ward ward = findById(wardId);
        if (ward != null) {
            if (newName != null)
                ward.setWardName(newName);
            if (newDescription != null)
                ward.setDescription(newDescription);
            if (newCapacity != null)
                ward.setCapacity(newCapacity);

            autoSave();
            return true;
        }
        return false;
    }

    // === KAPAZITÄTS-METHODEN ===

    /**
     * Gibt verfügbare Wards zurück (für Frontend und Console)
     */
    public Set<Ward> getAvailableWards() {
        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
            return wardSet.stream()
                    .filter(ward -> ward.hasCapacity(patientManager))
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            System.err.println("Fehler beim Abrufen verfügbarer Wards: " + e.getMessage());
            return new HashSet<>();
        }
    }

    // Neue Methode ohne ID-Parameter
    public boolean addWardWithAutoId(String wardName, String description, int capacity) {
        int newId = generateUniqueWardId();
        Ward ward = new Ward(newId, wardName, description, capacity);
        return addWard(ward);
    }

    private int generateUniqueWardId() {
        if (wardSet.isEmpty()) {
            return 1;
        }
        return wardSet.stream()
                .mapToInt(Ward::getWardId)
                .max()
                .orElse(0) + 1;
    }

    /**
     * Console-Ausgabe: Alle Ward-Kapazitäten anzeigen
     */
    public void showAllWardCapacities() {
        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");

            System.out.println("\n===== WARD-KAPAZITÄTS-ÜBERSICHT =====");
            System.out.printf("%-20s %-8s %-12s %-8s %-10s%n",
                    "Ward Name", "ID", "Belegung", "Frei", "Status");
            System.out.println("------------------------------------------------------------");

            for (Ward ward : wardSet) {
                long currentOccupancy = ward.getCurrentOccupancy(patientManager);
                long availableCapacity = ward.getAvailableCapacity(patientManager);
                String status = ward.hasCapacity(patientManager) ? "Verfügbar" : "Voll";

                System.out.printf("%-20s %-8d %-12s %-8d %-10s%n",
                        truncate(ward.getWardName(), 20),
                        ward.getWardId(),
                        currentOccupancy + "/" + ward.getCapacity(),
                        availableCapacity,
                        status);
            }
            System.out.println("=====================================\n");

        } catch (Exception e) {
            System.err.println("Fehler beim Anzeigen der Ward-Kapazitäten: " + e.getMessage());
        }
    }

    /**
     * Console-Ausgabe: Details für eine spezifische Ward
     */
    public void showWardDetails(int wardId) {
        Ward ward = findById(wardId);
        if (ward == null) {
            System.err.println("Ward mit ID " + wardId + " nicht gefunden.");
            return;
        }

        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");

            long currentOccupancy = ward.getCurrentOccupancy(patientManager);
            long availableCapacity = ward.getAvailableCapacity(patientManager);
            boolean hasCapacity = ward.hasCapacity(patientManager);

            System.out.println("\n=== WARD-DETAILS ===");
            System.out.println("Name: " + ward.getWardName());
            System.out.println("ID: " + ward.getWardId());
            System.out.println("Beschreibung: " + ward.getDescription());
            System.out.println("Gesamtkapazität: " + ward.getCapacity() + " Plätze");
            System.out.println("Aktuelle Belegung: " + currentOccupancy + " Patient(en)");
            System.out.println("Freie Plätze: " + availableCapacity);
            System.out.println("Status: " + (hasCapacity ? "Verfügbar" : "Vollständig belegt"));

            // Zugewiesene Patienten auflisten
            if (currentOccupancy > 0) {
                System.out.println("\nZugewiesene Patienten:");
                patientManager.getAll().stream()
                        .filter(patient -> patient.getWardId() != null)
                        .filter(patient -> patient.getWardId().equals(ward.getWardId()))
                        .forEach(patient -> System.out.println("  - " + patient.getFirstname() + " " +
                                patient.getName() + " (ID: " + patient.getPersonId() + ")"));
            } else {
                System.out.println("\nKeine Patienten zugewiesen.");
            }
            System.out.println("==================\n");

        } catch (Exception e) {
            System.err.println("Fehler beim Anzeigen der Ward-Details: " + e.getMessage());
        }
    }

    /**
     * Console-Ausgabe: Nur verfügbare Wards anzeigen
     */
    public void showAvailableWards() {
        Set<Ward> availableWards = getAvailableWards();

        System.out.println("\n===== VERFÜGBARE WARDS =====");
        if (availableWards.isEmpty()) {
            System.out.println("Keine Wards mit freien Plätzen verfügbar!");
        } else {
            for (Ward ward : availableWards) {
                try {
                    PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
                    long availableCapacity = ward.getAvailableCapacity(patientManager);
                    System.out.println("- " + ward.getWardName() + " (ID: " + ward.getWardId() +
                            ") - " + availableCapacity + " freie Plätze");
                } catch (Exception e) {
                    System.err.println("Fehler bei Ward " + ward.getWardId());
                }
            }
        }
        System.out.println("============================\n");
    }

    // === FRONTEND-DATEN-METHODEN ===

    /**
     * Gibt Ward-Kapazitätsdaten für Frontend zurück
     */
    public Map<String, Object> getWardCapacityData(int wardId) {
        Ward ward = findById(wardId);
        if (ward == null) {
            return null;
        }

        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");

            Map<String, Object> data = new HashMap<>();
            data.put("wardId", ward.getWardId());
            data.put("wardName", ward.getWardName());
            data.put("description", ward.getDescription());
            data.put("totalCapacity", ward.getCapacity());
            data.put("currentOccupancy", ward.getCurrentOccupancy(patientManager));
            data.put("availableCapacity", ward.getAvailableCapacity(patientManager));
            data.put("hasCapacity", ward.hasCapacity(patientManager));

            // Zugewiesene Patienten
            List<Map<String, Object>> assignedPatients = patientManager.getAll().stream()
                    .filter(patient -> patient.getWardId() != null && patient.getWardId().equals(ward.getWardId()))
                    .map(patient -> {
                        Map<String, Object> patientInfo = new HashMap<>();
                        patientInfo.put("personId", patient.getPersonId());
                        patientInfo.put("name", patient.getName());
                        patientInfo.put("firstname", patient.getFirstname());
                        patientInfo.put("email", patient.getEmail());
                        return patientInfo;
                    })
                    .collect(Collectors.toList());

            data.put("assignedPatients", assignedPatients);

            return data;

        } catch (Exception e) {
            System.err.println("Fehler beim Abrufen der Ward-Kapazitätsdaten: " + e.getMessage());
            return null;
        }
    }

    /**
     * Gibt alle Ward-Kapazitätsdaten für Frontend zurück
     */
    public List<Map<String, Object>> getAllWardCapacityData() {
        try {
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");

            return wardSet.stream()
                    .map(ward -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("wardId", ward.getWardId());
                        data.put("wardName", ward.getWardName());
                        data.put("description", ward.getDescription());
                        data.put("totalCapacity", ward.getCapacity());
                        data.put("currentOccupancy", ward.getCurrentOccupancy(patientManager));
                        data.put("availableCapacity", ward.getAvailableCapacity(patientManager));
                        data.put("hasCapacity", ward.hasCapacity(patientManager));

                        // Zugewiesene Patienten
                        List<Map<String, Object>> assignedPatients = patientManager.getAll().stream()
                                .filter(patient -> patient.getWardId() != null
                                        && patient.getWardId().equals(ward.getWardId()))
                                .map(patient -> {
                                    Map<String, Object> patientInfo = new HashMap<>();
                                    patientInfo.put("personId", patient.getPersonId());
                                    patientInfo.put("name", patient.getName());
                                    patientInfo.put("firstname", patient.getFirstname());
                                    patientInfo.put("email", patient.getEmail());
                                    return patientInfo;
                                })
                                .collect(Collectors.toList());

                        data.put("assignedPatients", assignedPatients);

                        return data;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("Fehler beim Abrufen aller Ward-Kapazitätsdaten: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Helper-Methode für Textkürzung
    private String truncate(String text, int maxLength) {
        if (text == null)
            return "";
        return text.length() > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
    }

    // Save current state to file
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(wardSet, filename);
        }
    }

    // Load state from file
    @SuppressWarnings("unchecked")
    public void load() {
        if (filename != null) {
            Set<Ward> loadedSet = SerializationManager.loadFromFile(filename);
            if (loadedSet != null) {
                this.wardSet = loadedSet;
            }
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("WardManager{\n");
        sb.append("  filename='").append(filename != null ? filename : "none").append("'\n");
        sb.append("  autoSaveEnabled=").append(autoSaveEnabled).append("\n");
        sb.append("  totalWards=").append(wardSet.size()).append("\n");

        if (!wardSet.isEmpty()) {
            sb.append("  wards=[\n");

            // Sortiere Wards nach ID für bessere Übersicht
            wardSet.stream()
                    .sorted((w1, w2) -> Integer.compare(w1.getWardId(), w2.getWardId()))
                    .forEach(ward -> {
                        try {
                            // Versuche Kapazitätsinformationen zu laden
                            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
                            long currentOccupancy = ward.getCurrentOccupancy(patientManager);
                            long availableCapacity = ward.getAvailableCapacity(patientManager);
                            boolean hasCapacity = ward.hasCapacity(patientManager);

                            sb.append("    Ward{")
                                    .append("id=").append(ward.getWardId())
                                    .append(", name='").append(ward.getWardName()).append("'")
                                    .append(", capacity=").append(ward.getCapacity())
                                    .append(", occupied=").append(currentOccupancy)
                                    .append(", available=").append(availableCapacity)
                                    .append(", hasCapacity=").append(hasCapacity)
                                    .append("}\n");
                        } catch (Exception e) {
                            // Fallback wenn PatientManager nicht verfügbar
                            sb.append("    Ward{")
                                    .append("id=").append(ward.getWardId())
                                    .append(", name='").append(ward.getWardName()).append("'")
                                    .append(", capacity=").append(ward.getCapacity())
                                    .append(", status=unknown")
                                    .append("}\n");
                        }
                    });

            sb.append("  ]\n");
        } else {
            sb.append("  wards=[]\n");
        }

        sb.append("}");
        return sb.toString();
    }
}