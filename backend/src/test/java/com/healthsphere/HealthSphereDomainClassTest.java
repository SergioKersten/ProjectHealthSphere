package com.healthsphere;

import java.time.LocalDate;
import com.healthsphere.components.*;

/**
 * Testklasse für die Fachklassen des HealthSphere-Systems
 * 
 * Diese Klasse testet alle implementierten Fachklassen:
 * - Person (abstrakte Basisklasse)
 * - Patient (erbt von Person)
 * - Employee (erbt von Person)
 * - Ward (Krankenhaus-Station)
 * - Treatment (Behandlung)
 * 
 * @author HealthSphere Team
 * @version 1.0
 */
public class HealthSphereDomainClassTest {

        public static void main(String[] args) {
                System.out.println("=".repeat(80));
                System.out.println("HEALTHSPHERE DOMAIN CLASS TEST");
                System.out.println("=".repeat(80));
                System.out.println();

                // Test 1: Patient-Klasse testen
                testPatientClass();

                // Test 2: Employee-Klasse testen
                testEmployeeClass();

                // Test 3: Ward-Klasse testen
                testWardClass();

                // Test 4: Treatment-Klasse testen
                testTreatmentClass();

                System.out.println("\n" + "=".repeat(80));
                System.out.println("ALLE TESTS ABGESCHLOSSEN");
                System.out.println("=".repeat(80));
        }

        /**
         * Test 1: Patient-Klasse Funktionalität
         */
        private static void testPatientClass() {
                System.out.println("TEST 1: PATIENT-KLASSE");
                System.out.println("-".repeat(50));

                // Erst Wards erstellen für realistische Tests
                Ward ward1 = Ward.createForTest(1, "Kardiologie", "Herzmedizin", 20);
                Ward ward2 = Ward.createForTest(2, "Chirurgie", "Allgemeine Chirurgie", 15);
                System.out.println("Test-Wards erstellt: " + ward1.getWardName() + ", " + ward2.getWardName());
                System.out.println();

                // Patient ohne Ward erstellen - GEÄNDERT
                Patient patient1 = Patient.createForTest(1L, "Müller", "Anna", "030-12345678",
                                "anna.mueller@email.de", LocalDate.of(1985, 3, 15),
                                "Berliner Str. 123, 10115 Berlin");

                System.out.println("Patient 1 erstellt (ohne Ward):");
                System.out.println(patient1.toString());
                System.out.println("Alter: " + patient1.getAge() + " Jahre");
                System.out.println("Ward-ID: " + patient1.getWardId());

                // Patient mit Ward erstellen - GEÄNDERT
                Patient patient2 = Patient.createForTest(2L, "Schmidt", "Peter", "030-87654321",
                                "peter.schmidt@email.de", LocalDate.of(1972, 8, 22),
                                "Hauptstr. 456, 10117 Berlin", 1);

                System.out.println("\nPatient 2 erstellt (mit Ward):");
                System.out.println(patient2.toString());
                System.out.println("Ward-ID: " + patient2.getWardId());

                // Ward-Zuweisung ändern
                patient1.setWardId(2);
                System.out.println("\nPatient 1 nach Ward-Zuweisung:");
                System.out.println("Ward-ID: " + patient1.getWardId());
        }

        /**
         * Test 2: Employee-Klasse Funktionalität
         */
        private static void testEmployeeClass() {
                System.out.println("\n\nTEST 2: EMPLOYEE-KLASSE");
                System.out.println("-".repeat(50));

                // Employee ohne Ward erstellen
                Employee doctor1 = Employee.createForTest(10L, "Weber", "Dr. Sarah", "030-11111111",
                                "sarah.weber@healthsphere.de", LocalDate.of(1980, 5, 10),
                                "Arztstr. 1, 10115 Berlin", "Kardiologie");

                System.out.println("Arzt 1 erstellt (ohne Ward):");
                System.out.println(doctor1.toString());
                System.out.println("Abteilung: " + doctor1.getDepartment());
                System.out.println("Ward-ID: " + doctor1.getWardId());

                // GEÄNDERT: Sichere Setter verwenden
                System.out.println("\nÄnderung der Abteilung:");
                doctor1.setDepartmentSafe("Notaufnahme"); // Statt setDepartment()
                System.out.println("Neue Abteilung: " + doctor1.getDepartment());

                doctor1.setWardId(1); // Das ist sicher, wirft keine Exception
                System.out.println("Ward-ID nach Zuweisung: " + doctor1.getWardId());
                System.out.println("\nArzt 1 nach Abteilungs- und Ward-Änderung:");
                System.out.println("Abteilung: " + doctor1.getDepartment());
                System.out.println("Ward-ID: " + doctor1.getWardId());
        }

        /**
         * Test 3: Ward-Klasse Funktionalität
         */
        private static void testWardClass() {
                System.out.println("\n\nTEST 3: WARD-KLASSE");
                System.out.println("-".repeat(50));

                // Wards erstellen
                Ward ward1 = Ward.createForTest(1, "Kardiologie", "Herzmedizin und Gefäßerkrankungen", 20);
                Ward ward2 = Ward.createForTest(2, "Chirurgie", "Allgemeine und spezielle Chirurgie", 15);
                Ward ward3 = Ward.createForTest(3, "Notaufnahme", "24h Notfallversorgung", 10);

                System.out.println("Ward 1 erstellt:");
                System.out.println(ward1.toString());
                System.out.println("Kapazität: " + ward1.getCapacity());

                System.out.println("\nWard 2 erstellt:");
                System.out.println(ward2.toString());

                System.out.println("\nWard 3 erstellt:");
                System.out.println(ward3.toString());

                // Ward-Eigenschaften ändern
                ward1.setCapacity(25);
                ward1.setDescription("Erweiterte Herzmedizin und Gefäßchirurgie");
                System.out.println("\nWard 1 nach Änderungen:");
                System.out.println("Neue Beschreibung: " + ward1.getDescription());
                System.out.println("Neue Kapazität: " + ward1.getCapacity());

                // CompareTo testen
                System.out.println("\nWard-Vergleich (compareTo):");
                System.out.println("ward1.compareTo(ward2): " + ward1.compareTo(ward2));
                System.out.println("ward2.compareTo(ward3): " + ward2.compareTo(ward3));
        }

        /**
         * Test 4: Treatment-Klasse Funktionalität
         */
        private static void testTreatmentClass() {
                System.out.println("\n\nTEST 4: TREATMENT-KLASSE");
                System.out.println("-".repeat(50));

                // Treatments erstellen
                Treatment treatment1 = new Treatment(1, LocalDate.of(2024, 1, 15), "Herzuntersuchung", 1L, 10L);
                Treatment treatment2 = new Treatment(2, LocalDate.of(2024, 1, 16), "Blutabnahme", 2L, 11L);
                Treatment treatment3 = new Treatment(3, LocalDate.of(2024, 1, 15), "EKG", 1L, 10L);

                System.out.println("Treatment 1 erstellt:");
                System.out.println(treatment1.toString());
                System.out.println("Datum: " + treatment1.getDate());
                System.out.println("Therapie: " + treatment1.getTherapy());
                System.out.println("Patient-ID: " + treatment1.getPatientPersonId());
                System.out.println("Arzt-ID: " + treatment1.getDoctorPersonId());

                System.out.println("\nTreatment 2 erstellt:");
                System.out.println(treatment2.toString());

                System.out.println("\nTreatment 3 erstellt:");
                System.out.println(treatment3.toString());

                // Treatment ändern
                treatment1.setTherapy("Erweiterte Herzuntersuchung mit Ultraschall");
                treatment1.setDate(LocalDate.of(2024, 1, 17));
                System.out.println("\nTreatment 1 nach Änderungen:");
                System.out.println("Neue Therapie: " + treatment1.getTherapy());
                System.out.println("Neues Datum: " + treatment1.getDate());
        }
}