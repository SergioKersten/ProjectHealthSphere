package com.healthsphere;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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

                // Test 5: Vererbung und Polymorphie testen
                testInheritanceAndPolymorphism();

                // Test 6: Sortierung (compareTo) testen
                testSortingMethods();

                // Test 7: Fachspezifische Transaktionen testen
                testDomainSpecificMethods();

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
                Ward ward1 = new Ward(1, "Kardiologie", "Herzmedizin", 20);
                Ward ward2 = new Ward(2, "Chirurgie", "Allgemeine Chirurgie", 15);
                System.out.println("Test-Wards erstellt: " + ward1.getWardName() + ", " + ward2.getWardName());
                System.out.println();

                // Patient ohne Ward erstellen
                Patient patient1 = new Patient(1L, "Müller", "Anna", "030-12345678",
                                "anna.mueller@email.de", LocalDate.of(1985, 3, 15),
                                "Berliner Str. 123, 10115 Berlin");

                System.out.println("Patient 1 erstellt (ohne Ward):");
                System.out.println(patient1.toString());
                System.out.println("Alter: " + patient1.getAge() + " Jahre");
                System.out.println("Ward-ID: " + patient1.getWardId());

                // Patient mit Ward erstellen
                Patient patient2 = new Patient(2L, "Schmidt", "Peter", "030-87654321",
                                "peter.schmidt@email.de", LocalDate.of(1972, 8, 22),
                                "Hauptstr. 456, 10117 Berlin", 1);

                System.out.println("\nPatient 2 erstellt (mit Ward):");
                System.out.println(patient2.toString());
                System.out.println("Ward-ID: " + patient2.getWardId());

                // Ward-Zuweisung ändern
                patient1.setWardId(2);
                System.out.println("\nPatient 1 nach Ward-Zuweisung:");
                System.out.println("Ward-ID: " + patient1.getWardId());

                // Equals und HashCode testen
                Patient patient3 = new Patient(1L, "Anderer", "Name", "000-000000",
                                "test@test.de", LocalDate.of(2000, 1, 1), "Test Adresse");
                System.out.println("\nEquals-Test (gleiche ID):");
                System.out.println("patient1.equals(patient3): " + patient1.equals(patient3));
                System.out.println("patient1.hashCode() == patient3.hashCode(): " +
                                (patient1.hashCode() == patient3.hashCode()));
        }

        /**
         * Test 2: Employee-Klasse Funktionalität
         */
        private static void testEmployeeClass() {
                System.out.println("\n\nTEST 2: EMPLOYEE-KLASSE");
                System.out.println("-".repeat(50));

                // Employee ohne Ward erstellen
                Employee doctor1 = new Employee(10L, "Weber", "Dr. Sarah", "030-11111111",
                                "sarah.weber@healthsphere.de", LocalDate.of(1980, 5, 10),
                                "Arztstr. 1, 10115 Berlin", "Kardiologie");

                System.out.println("Arzt 1 erstellt (ohne Ward):");
                System.out.println(doctor1.toString());
                System.out.println("Abteilung: " + doctor1.getDepartment());
                System.out.println("Ward-ID: " + doctor1.getWardId());

                // Employee mit Ward erstellen
                Employee nurse1 = new Employee(11L, "Klein", "Thomas", "030-22222222",
                                "thomas.klein@healthsphere.de", LocalDate.of(1990, 12, 3),
                                "Pflegestr. 2, 10117 Berlin", "Chirurgie", 1);

                System.out.println("\nPflegekraft 1 erstellt (mit Ward):");
                System.out.println(nurse1.toString());
                System.out.println("Abteilung: " + nurse1.getDepartment());
                System.out.println("Ward-ID: " + nurse1.getWardId());

                // Abteilung ändern
                doctor1.setDepartment("Notaufnahme");
                doctor1.setWardId(3);
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
                Ward ward1 = new Ward(1, "Kardiologie", "Herzmedizin und Gefäßerkrankungen", 20);
                Ward ward2 = new Ward(2, "Chirurgie", "Allgemeine und spezielle Chirurgie", 15);
                Ward ward3 = new Ward(3, "Notaufnahme", "24h Notfallversorgung", 10);

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

        /**
         * Test 5: Vererbung und Polymorphie
         */
        private static void testInheritanceAndPolymorphism() {
                System.out.println("\n\nTEST 5: VERERBUNG UND POLYMORPHIE");
                System.out.println("-".repeat(50));

                // Polymorphe Liste erstellen
                List<Person> persons = new ArrayList<>();

                persons.add(new Patient(20L, "Hansen", "Lisa", "030-33333333",
                                "lisa.hansen@email.de", LocalDate.of(1995, 7, 8),
                                "Patientenstr. 10", 1));

                persons.add(new Employee(21L, "Fischer", "Dr. Mark", "030-44444444",
                                "mark.fischer@healthsphere.de", LocalDate.of(1975, 2, 20),
                                "Arztweg 5", "Orthopädie", 2));

                persons.add(new Patient(22L, "Wagner", "Klaus", "030-55555555",
                                "klaus.wagner@email.de", LocalDate.of(1960, 11, 30),
                                "Rentnerstr. 20", 3));

                System.out.println("Polymorphe Liste erstellt mit " + persons.size() + " Personen:");

                for (int i = 0; i < persons.size(); i++) {
                        Person person = persons.get(i);
                        System.out.println("\nPerson " + (i + 1) + ":");
                        System.out.println("Typ: " + person.getClass().getSimpleName());
                        System.out.println("Name: " + person.getFirstname() + " " + person.getName());
                        System.out.println("Alter: " + person.getAge() + " Jahre");
                        System.out.println("toString(): " + person.toString());

                        // Instanceof-Tests
                        if (person instanceof Patient) {
                                Patient patient = (Patient) person;
                                System.out.println("→ Patient mit Ward-ID: " + patient.getWardId());
                        } else if (person instanceof Employee) {
                                Employee employee = (Employee) person;
                                System.out.println("→ Employee, Abteilung: " + employee.getDepartment());
                                System.out.println("→ Employee, Ward-ID: " + employee.getWardId());
                        }
                }
        }

        /**
         * Test 6: Sortierungsmethoden (compareTo)
         */
        private static void testSortingMethods() {
                System.out.println("\n\nTEST 6: SORTIERUNGSMETHODEN (ERWEITERT)");
                System.out.println("-".repeat(50));

                // === PATIENTEN-SORTIERUNG (Standard compareTo) ===
                System.out.println("📋 PATIENTEN-SORTIERUNG (Standard compareTo):");
                System.out.println("Sortierkriterien: 1.Ward-ID → 2.Name → 3.Vorname → 4.Alter → 5.ID");

                List<Patient> patients = Arrays.asList(
                                new Patient(36L, "Zahn", "Anna", "030-111", "test1@test.de", LocalDate.of(1990, 1, 1),
                                                "Addr1", 3),
                                new Patient(35L, "Abel", "Bernd", "030-222", "test2@test.de", LocalDate.of(1985, 5, 15),
                                                "Addr2", 1),
                                new Patient(34L, "Zahn", "Anna", "030-333", "test3@test.de", LocalDate.of(1995, 3, 10),
                                                "Addr3", 2),
                                new Patient(33L, "Müller", "Carl", "030-444", "test4@test.de",
                                                LocalDate.of(1980, 8, 20), "Addr4", null),
                                new Patient(32L, "Zahn", "Bernd", "030-555", "test5@test.de", LocalDate.of(1988, 6, 12),
                                                "Addr5", 2),
                                new Patient(31L, "Weber", "Lisa", "030-666", "test6@test.de", LocalDate.of(1992, 9, 5),
                                                "Addr6", 1),
                                new Patient(30L, "Zahn", "Anna", "030-777", "test7@test.de", LocalDate.of(1987, 11, 3),
                                                "Addr7", 3));

                System.out.println("Vor Sortierung:");
                for (int i = 0; i < patients.size(); i++) {
                        System.out.println((i + 1) + ". " + patients.get(i).toString());
                }

                Collections.sort(patients);
                System.out.println("\nNach Standard-Sortierung:");
                for (int i = 0; i < patients.size(); i++) {
                        System.out.println((i + 1) + ". " + patients.get(i).toString());
                }

                // === ALTERNATIVE PATIENT-SORTIERUNGEN (nur Manager-Klassen-Methoden) ===
                System.out.println("\n ALTERNATIVE PATIENTEN-SORTIERUNGEN (Manager-Klassen-Comparatoren):");

                // Nach Ward, dann Name
                List<Patient> patientsByWardName = new ArrayList<>(patients);
                patientsByWardName.sort(Patient.BY_WARD_THEN_NAME);
                System.out.println("\nSortiert mit BY_WARD_THEN_NAME:");
                for (int i = 0; i < patientsByWardName.size(); i++) {
                        Patient p = patientsByWardName.get(i);
                        System.out.println((i + 1) + ". " + p.getFirstname() + " " + p.getName() +
                                        " (Ward: " + (p.getWardId() != null ? p.getWardId() : "null") + ")");
                }

                // Nur nach Name
                List<Patient> patientsByNameOnly = new ArrayList<>(patients);
                patientsByNameOnly.sort(Patient.BY_NAME_ONLY);
                System.out.println("\nSortiert mit BY_NAME_ONLY:");
                for (int i = 0; i < patientsByNameOnly.size(); i++) {
                        Patient p = patientsByNameOnly.get(i);
                        System.out.println((i + 1) + ". " + p.getName() + ", " + p.getFirstname());
                }

                // === EMPLOYEE-SORTIERUNG (Standard compareTo) ===
                System.out.println("\n\n EMPLOYEE-SORTIERUNG (Standard compareTo):");
                System.out.println("Sortierkriterien: 1.Abteilung → 2.Ward-ID → 3.Name → 4.Vorname → 5.Alter → 6.ID");

                List<Employee> employees = Arrays.asList(
                                new Employee(43L, "Schmidt", "Dr. Eva", "030-555", "eva@test.de",
                                                LocalDate.of(1975, 6, 12), "Addr5", "Radiologie", 1),
                                new Employee(42L, "Weber", "Frank", "030-666", "frank@test.de",
                                                LocalDate.of(1980, 9, 5), "Addr6", "Anästhesie", 2),
                                new Employee(41L, "Klein", "Gabi", "030-777", "gabi@test.de", LocalDate.of(1985, 12, 8),
                                                "Addr7", "Anästhesie", null),
                                new Employee(40L, "Gross", "Hans", "030-888", "hans@test.de", LocalDate.of(1970, 4, 25),
                                                "Addr8", "Chirurgie", 1),
                                new Employee(44L, "Weber", "Anna", "030-999", "anna@test.de", LocalDate.of(1982, 11, 3),
                                                "Addr9", "Anästhesie", 2),
                                new Employee(45L, "Schmidt", "Dr. Tom", "030-000", "tom@test.de",
                                                LocalDate.of(1978, 7, 18), "Addr10", "Radiologie", 2));

                System.out.println("Vor Sortierung:");
                for (int i = 0; i < employees.size(); i++) {
                        System.out.println((i + 1) + ". " + employees.get(i).toString());
                }

                Collections.sort(employees);
                System.out.println("\nNach Standard-Sortierung:");
                for (int i = 0; i < employees.size(); i++) {
                        System.out.println((i + 1) + ". " + employees.get(i).toString());
                }

                // === ALTERNATIVE EMPLOYEE-SORTIERUNGEN ===
                System.out.println("\n ALTERNATIVE EMPLOYEE-SORTIERUNGEN:");

                // Nur nach Abteilung
                List<Employee> employeesByDept = new ArrayList<>(employees);
                employeesByDept.sort(Employee.BY_DEPARTMENT_ONLY);
                System.out.println("\nSortiert nur nach Abteilung, dann Name:");
                for (int i = 0; i < employeesByDept.size(); i++) {
                        Employee e = employeesByDept.get(i);
                        System.out.println((i + 1) + ". " + e.getFirstname() + " " + e.getName() +
                                        " (" + e.getDepartment() + ")");
                }

                // Nach Ward, dann Abteilung
                List<Employee> employeesByWardDept = new ArrayList<>(employees);
                employeesByWardDept.sort(Employee.BY_WARD_THEN_DEPARTMENT);
                System.out.println("\nSortiert nach Ward-ID, dann Abteilung:");
                for (int i = 0; i < employeesByWardDept.size(); i++) {
                        Employee e = employeesByWardDept.get(i);
                        System.out.println((i + 1) + ". " + e.getFirstname() + " " + e.getName() +
                                        " (Ward: " + (e.getWardId() != null ? e.getWardId() : "null") +
                                        ", Dept: " + e.getDepartment() + ")");
                }

                // === TREATMENT-SORTIERUNG (Standard compareTo) ===
                System.out.println("\n\n TREATMENT-SORTIERUNG (Standard compareTo):");
                System.out.println("Sortierkriterien: 1.Datum (neueste zuerst) → 2.Therapie → 3.Treatment-ID");

                List<Treatment> treatments = Arrays.asList(
                                new Treatment(55, LocalDate.of(2024, 1, 18), "Röntgen", 1L, 10L),
                                new Treatment(54, LocalDate.of(2024, 1, 22), "Blutabnahme", 2L, 11L),
                                new Treatment(53, LocalDate.of(2024, 1, 18), "EKG", 1L, 10L),
                                new Treatment(52, LocalDate.of(2024, 1, 21), "Ultraschall", 3L, 12L),
                                new Treatment(51, LocalDate.of(2024, 1, 18), "Blutabnahme", 2L, 11L),
                                new Treatment(50, LocalDate.of(2024, 1, 20), "Röntgen", 1L, 10L));

                System.out.println("Vor Sortierung:");
                for (int i = 0; i < treatments.size(); i++) {
                        System.out.println((i + 1) + ". " + treatments.get(i).toString());
                }

                Collections.sort(treatments);
                System.out.println("\nNach Standard-Sortierung (neueste zuerst):");
                for (int i = 0; i < treatments.size(); i++) {
                        System.out.println((i + 1) + ". " + treatments.get(i).toString());
                }

                // === ALTERNATIVE TREATMENT-SORTIERUNGEN (nur Manager-Klassen-Methoden) ===
                System.out.println("\n ALTERNATIVE TREATMENT-SORTIERUNGEN (Manager-Klassen-Comparatoren):");

                // Nach Datum aufsteigend
                List<Treatment> treatmentsByDateAsc = new ArrayList<>(treatments);
                treatmentsByDateAsc.sort(Treatment.BY_DATE_ASC);
                System.out.println("\nSortiert mit BY_DATE_ASC (älteste zuerst):");
                for (int i = 0; i < treatmentsByDateAsc.size(); i++) {
                        Treatment t = treatmentsByDateAsc.get(i);
                        System.out.println((i + 1) + ". " + t.getDate() + " - " + t.getTherapy());
                }

                // Nach Datum absteigend
                List<Treatment> treatmentsByDateDesc = new ArrayList<>(treatments);
                treatmentsByDateDesc.sort(Treatment.BY_DATE_DESC);
                System.out.println("\nSortiert mit BY_DATE_DESC (neueste zuerst):");
                for (int i = 0; i < treatmentsByDateDesc.size(); i++) {
                        Treatment t = treatmentsByDateDesc.get(i);
                        System.out.println((i + 1) + ". " + t.getDate() + " - " + t.getTherapy());
                }

                // Nach Therapie-Art
                List<Treatment> treatmentsByTherapy = new ArrayList<>(treatments);
                treatmentsByTherapy.sort(Treatment.BY_THERAPY_TYPE);
                System.out.println("\nSortiert mit BY_THERAPY_TYPE (alphabetisch):");
                for (int i = 0; i < treatmentsByTherapy.size(); i++) {
                        Treatment t = treatmentsByTherapy.get(i);
                        System.out.println((i + 1) + ". " + t.getTherapy() + " (" + t.getDate() + ")");
                }

                // Nach Patient, dann Datum
                List<Treatment> treatmentsByPatient = new ArrayList<>(treatments);
                treatmentsByPatient.sort(Treatment.BY_PATIENT_THEN_DATE);
                System.out.println("\nSortiert mit BY_PATIENT_THEN_DATE:");
                for (int i = 0; i < treatmentsByPatient.size(); i++) {
                        Treatment t = treatmentsByPatient.get(i);
                        System.out.println((i + 1) + ". Patient-" + t.getPatientPersonId() +
                                        ": " + t.getTherapy() + " (" + t.getDate() + ")");
                }

                // === SORTIERUNGS-VERGLEICHSTESTS ===
                System.out.println("\n\n SORTIERUNGS-VERGLEICHSTESTS (compareTo-Aufrufe):");

                Patient p1 = new Patient(1L, "Müller", "Anna", "030-111", "test@test.de", LocalDate.of(1990, 1, 1),
                                "Addr", 1);
                Patient p2 = new Patient(2L, "Schmidt", "Peter", "030-222", "test@test.de", LocalDate.of(1985, 5, 15),
                                "Addr", 1);
                Patient p3 = new Patient(3L, "Müller", "Anna", "030-333", "test@test.de", LocalDate.of(1992, 3, 10),
                                "Addr", 2);

                System.out.println("Patient-Vergleiche:");
                System.out.println("p1 (Müller Anna, Ward 1) vs p2 (Schmidt Peter, Ward 1): " + p1.compareTo(p2));
                System.out.println("p1 (Müller Anna, Ward 1) vs p3 (Müller Anna, Ward 2): " + p1.compareTo(p3));
                System.out.println("p2 (Schmidt Peter, Ward 1) vs p3 (Müller Anna, Ward 2): " + p2.compareTo(p3));

                Employee e1 = new Employee(1L, "Weber", "Dr. Sarah", "030-111", "test@test.de",
                                LocalDate.of(1980, 1, 1), "Addr", "Kardiologie", 1);
                Employee e2 = new Employee(2L, "Klein", "Thomas", "030-222", "test@test.de", LocalDate.of(1985, 5, 15),
                                "Addr", "Anästhesie", 1);

                System.out.println("\nEmployee-Vergleiche:");
                System.out.println("e1 (Kardiologie) vs e2 (Anästhesie): " + e1.compareTo(e2));
                System.out.println("e2 (Anästhesie) vs e1 (Kardiologie): " + e2.compareTo(e1));

                Treatment t1 = new Treatment(1, LocalDate.of(2024, 1, 20), "EKG", 1L, 10L);
                Treatment t2 = new Treatment(2, LocalDate.of(2024, 1, 22), "Röntgen", 2L, 11L);

                System.out.println("\nTreatment-Vergleiche:");
                System.out.println("t1 (2024-01-20, EKG) vs t2 (2024-01-22, Röntgen): " + t1.compareTo(t2));
                System.out.println("t2 (2024-01-22, Röntgen) vs t1 (2024-01-20, EKG): " + t2.compareTo(t1));
        }

        /**
         * Test 7: Fachspezifische Transaktionen und Methoden
         */
        private static void testDomainSpecificMethods() {
                System.out.println("\n\nTEST 7: FACHSPEZIFISCHE TRANSAKTIONEN");
                System.out.println("-".repeat(50));

                // Person-Altersberechnung testen
                System.out.println("ALTERSBERECHNUNG:");
                Patient youngPatient = new Patient(100L, "Jung", "Max", "030-999", "max@test.de",
                                LocalDate.now().minusYears(25), "Jugendstr. 1");
                Patient oldPatient = new Patient(101L, "Alt", "Erna", "030-888", "erna@test.de",
                                LocalDate.now().minusYears(75), "Seniorenweg 2");

                System.out.println("Junger Patient - Geburtsdatum: " + youngPatient.getBirthdate() +
                                ", Alter: " + youngPatient.getAge() + " Jahre");
                System.out.println("Alter Patient - Geburtsdatum: " + oldPatient.getBirthdate() +
                                ", Alter: " + oldPatient.getAge() + " Jahre");

                // Ward-Kapazitätsprüfung testen (einfache Simulation)
                System.out.println("\nWARD-KAPAZITÄTSSIMULATION:");
                Ward testWard = new Ward(99, "Teststation", "Für Testzwecke", 5);

                System.out.println("Ward erstellt: " + testWard.getWardName());
                System.out.println("Kapazität: " + testWard.getCapacity());
                System.out.println("Status: " + testWard.toString());

                // Getter/Setter Tests für alle Klassen
                System.out.println("\nGETTER/SETTER FUNKTIONALITÄT:");

                // Patient Getter/Setter Test
                Patient testPatient = new Patient(200L, "Test", "Patient", "000-000", "test@test.de",
                                LocalDate.of(1990, 1, 1), "Teststr. 1");
                System.out.println("Patient vor Änderung: " + testPatient.getEmail());
                testPatient.setEmail("neue.email@test.de");
                testPatient.setPhonenumber("030-NEUNEU");
                System.out.println("Patient nach Email-Änderung: " + testPatient.getEmail());
                System.out.println("Patient nach Telefon-Änderung: " + testPatient.getPhonenumber());

                // Employee Getter/Setter Test
                Employee testEmployee = new Employee(201L, "Test", "Arzt", "111-111", "arzt@test.de",
                                LocalDate.of(1980, 6, 15), "Arztstr. 1", "Testmedizin");
                System.out.println("Employee vor Änderung: " + testEmployee.getDepartment());
                testEmployee.setDepartment("Neue Abteilung");
                testEmployee.setWardId(99);
                System.out.println("Employee nach Abteilungs-Änderung: " + testEmployee.getDepartment());
                System.out.println("Employee nach Ward-Zuweisung: " + testEmployee.getWardId());

                // Treatment Getter/Setter Test
                Treatment testTreatment = new Treatment(300, LocalDate.of(2024, 2, 1), "Erstbehandlung", 200L, 201L);
                System.out.println("Treatment vor Änderung: " + testTreatment.getTherapy());
                testTreatment.setTherapy("Nachbehandlung");
                testTreatment.setDate(LocalDate.of(2024, 2, 15));
                System.out.println("Treatment nach Therapie-Änderung: " + testTreatment.getTherapy());
                System.out.println("Treatment nach Datum-Änderung: " + testTreatment.getDate());
        }
}