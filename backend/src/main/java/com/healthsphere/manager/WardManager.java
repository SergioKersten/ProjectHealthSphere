package com.healthsphere.manager;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

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
    public Set<Ward> filter(Predicate<Ward> criteria) {
        return wardSet.stream()
                .filter(criteria)
                .collect(Collectors.toSet());
    }

    // Update ward info by ID
    public boolean updateWard(int wardId, String newName, String newDescription, Integer newCapacity) {
        Ward ward = findById(wardId);
        if (ward != null) {
            if (newName != null)
                ward.setWardName(newName);
            if (newDescription != null)
                ward.setDescription(newDescription);
            if (newCapacity != null)
                ward.setCapacity(newCapacity);

            autoSave(); // Speichern nach Update
            return true;
        }
        return false;
    }

    // Manuelles Speichern
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(wardSet, filename);
        }
    }

    // Laden von Datei
    public void load() {
        if (filename != null && SerializationManager.fileExists(filename)) {
            Set<Ward> loadedData = SerializationManager.loadFromFile(filename);
            if (loadedData != null) {
                wardSet = loadedData;
            }
        }
    }
}