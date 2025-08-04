package com.healthsphere.serialization;

import java.io.*;
import java.util.Set;

/**
 * Zentrale Klasse für die Serialisierung und Deserialisierung von Objekten.
 * 
 * Der SerializationManager implementiert das gewählte Persistierungskonzept
 * (Java-Serialisierung) aus Phase 3 und bietet generische Methoden zum
 * Speichern und Laden von Objektsammlungen.
 * 
 */
public class SerializationManager {

    /**
     * Generische Methode zum Speichern von Objektsammlungen in eine Datei.
     * 
     * @param <T>      Der Typ der zu speichernden Objekte
     * @param objects  Set der zu speichernden Objekte
     * @param filename Dateiname für Serialisierung
     * @return true wenn Speichern erfolgreich war
     */
    public static <T extends Serializable> void saveToFile(Set<T> data, String filename) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(data);
            System.out.println("Daten erfolgreich in " + filename + " gespeichert.");
        } catch (IOException e) {
            System.err.println("Fehler beim Speichern: " + e.getMessage());
        }
    }

    /**
     * Generische Methode zum Laden von Objektsammlungen aus einer Datei.
     * 
     * @param <T>      Der erwartete Typ der zu ladenden Objekte
     * @param filename Dateiname für Deserialisierung
     * @return Set der geladenen Objekte oder null bei Fehlern
     */
    @SuppressWarnings("unchecked")
    public static <T extends Serializable> Set<T> loadFromFile(String filename) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename))) {
            Set<T> data = (Set<T>) ois.readObject();
            System.out.println("Daten erfolgreich aus " + filename + " geladen.");
            return data;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Fehler beim Laden: " + e.getMessage());
            return null;
        }
    }

    // Methode zum Prüfen ob eine Datei existiert
    public static boolean fileExists(String filename) {
        File file = new File(filename);
        return file.exists() && file.isFile();
    }
}