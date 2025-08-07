package com.healthsphere;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.components.Treatment;
import com.healthsphere.components.Ward;
import com.healthsphere.serialization.SerializationManager;

import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;

/**
 * Testet SerializationManager mit allen Fachklassen
 */
public class PersistierungTest {

    public static void main(String[] args) {
        System.out.println("=== PERSISTIERUNG TEST (5.5.1) ===\n");

        // S5.1-S5.2: Patient
        testPatientSerialization();

        // S5.3: Employee
        testEmployeeSerialization();

        // S5.4: Ward
        testWardSerialization();

        // S5.5: Treatment
        testTreatmentSerialization();

        // S5.7: Fehlerbehandlung
        testErrorHandling();

        // S5.8: fileExists()
        testFileExists();

        System.out.println("\n=== TEST ABGESCHLOSSEN ===");
    }

    private static void testPatientSerialization() {
        try {
            Set<Patient> patients = new HashSet<>();
            patients.add(new Patient(1L, "Mustermann", "Max", "030123", "max@test.de", LocalDate.of(1985, 5, 15),
                    "Str. 123"));
            patients.add(new Patient(2L, "Schmidt", "Anna", "030456", "anna@test.de", LocalDate.of(1990, 3, 20),
                    "Str. 456"));

            SerializationManager.saveToFile(patients, "patients.ser");
            Set<Patient> loaded = SerializationManager.loadFromFile("patients.ser");
            System.out.println("Patient speichern/laden: " + (loaded != null && loaded.size() == 2 ? "OK" : "FEHLER"));
        } catch (Exception e) {
            System.out.println("Patient speichern/laden: FEHLER - " + e.getMessage());
        }
    }

    private static void testEmployeeSerialization() {
        try {
            Set<Employee> employees = new HashSet<>();
            employees.add(new Employee(10L, "Weber", "Dr. Sarah", "030789", "sarah@test.de",
                    LocalDate.of(1980, 3, 20), "Arztstr. 1", "Kardiologie"));

            SerializationManager.saveToFile(employees, "employees.ser");
            System.out.println("Employee speichern: OK");
        } catch (Exception e) {
            System.out.println("Employee speichern: FEHLER - " + e.getMessage());
        }
    }

    private static void testWardSerialization() {
        try {
            Set<Ward> wards = new HashSet<>();
            wards.add(new Ward(1, "Kardiologie", "Herzmedizin", 20));
            wards.add(new Ward(2, "Chirurgie", "Allgemeine Chirurgie", 25));

            SerializationManager.saveToFile(wards, "wards.ser");
            System.out.println("Ward speichern: OK");
        } catch (Exception e) {
            System.out.println("Ward speichern: FEHLER - " + e.getMessage());
        }
    }

    private static void testTreatmentSerialization() {
        try {
            Set<Treatment> treatments = new HashSet<>();
            treatments.add(new Treatment(1, LocalDate.of(2024, 1, 15), "Herzuntersuchung", 1L, 10L));
            treatments.add(new Treatment(2, LocalDate.of(2024, 1, 20), "Nachkontrolle", 2L, 10L));

            SerializationManager.saveToFile(treatments, "treatments.ser");
            Set<Treatment> loaded = SerializationManager.loadFromFile("treatments.ser");

            // Referenzen prüfen
            boolean refsOk = loaded != null
                    && loaded.stream().anyMatch(t -> t.getPatientPersonId() == 1L && t.getDoctorPersonId() == 10L);

            System.out.println("Treatment speichern/Referenzen: " + (refsOk ? "OK" : "FEHLER"));
        } catch (Exception e) {
            System.out.println("Treatment speichern/Referenzen: FEHLER - " + e.getMessage());
        }
    }

    private static void testErrorHandling() {
        try {
            Set<Patient> missing = SerializationManager.loadFromFile("nicht_vorhanden.ser");
            System.out.println("Fehlerbehandlung: " + (missing == null || missing.isEmpty() ? "OK" : "FEHLER"));
        } catch (Exception e) {
            System.out.println("Fehlerbehandlung: OK (Exception erwartet)");
        }
    }

    private static void testFileExists() {
        boolean exists = SerializationManager.fileExists("patients.ser");
        boolean notExists = !SerializationManager.fileExists("gibts_nicht.ser");
        System.out.println("fileExists(): " + (exists && notExists ? "OK" : "FEHLER"));
    }
}