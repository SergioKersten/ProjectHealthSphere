package com.healthsphere;

import java.time.LocalDate;
import com.healthsphere.components.*;
import com.healthsphere.Exceptions.PersonExceptions.*;
import com.healthsphere.Exceptions.DateExceptions.*;

/**
 * Exception Edge-Case Tests für die Fachklassen des HealthSphere-Systems
 * 
 * Testet kritische Ausnahmesituationen und Randcases gemäß Aufgabe 3.4:
 * "Testen Sie den erweiterten Code besonders auch in Bezug auf mögliche
 * Ausnahmesituationen."
 * 
 * @author HealthSphere Team
 * @version 1.0
 */
public class HealthSphereExceptionEdgeCaseTest {

    public static void main(String[] args) {
        System.out.println("=".repeat(80));
        System.out.println("HEALTHSPHERE EXCEPTION EDGE-CASE TESTS");
        System.out.println("=".repeat(80));
        System.out.println();

        // Test 1: Patient Exception Edge-Cases
        testPatientExceptionEdgeCases();

        // Test 2: Employee Exception Edge-Cases
        testEmployeeExceptionEdgeCases();

        // Test 3: Ward Exception Edge-Cases
        testWardExceptionEdgeCases();

        // Test 4: Treatment Exception Edge-Cases
        testTreatmentExceptionEdgeCases();

        System.out.println("\n" + "=".repeat(80));
        System.out.println("ALLE EDGE-CASE TESTS ABGESCHLOSSEN");
        System.out.println("=".repeat(80));
    }

    /**
     * Test 1: Patient Exception Edge-Cases
     */
    private static void testPatientExceptionEdgeCases() {
        System.out.println("TEST 1: PATIENT EXCEPTION EDGE-CASES");
        System.out.println("-".repeat(50));

        // Test 1.1: Grenzwert 1. Januar 1900
        System.out.println("\n1.1 Geburtsdatum Grenzwert 1900-01-01:");
        try {
            Patient boundaryPatient = new Patient(2L, "Boundary", "Test", "123", "test@test.de",
                    LocalDate.of(1900, 1, 1), "TestStr");
            System.out.println("ERFOLG: 1900-01-01 wurde akzeptiert");
        } catch (Exception e) {
            System.out.println("WARNUNG: 1900-01-01 wurde abgelehnt: " + e.getMessage());
        }

        // Test 1.2: Ein Tag vor Grenzwert (31.12.1899)
        System.out.println("\n1.2 Geburtsdatum vor Grenzwert 1899-12-31:");
        try {
            Patient tooOldPatient = new Patient(3L, "TooOld", "Person", "123", "old@test.de",
                    LocalDate.of(1899, 12, 31), "OldStr");
            System.out.println("FEHLER: 1899-12-31 wurde akzeptiert");
        } catch (InvalidDateTimeException e) {
            System.out.println("ERFOLG: 1899-12-31 korrekt abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }

        // Test 1.3: Name mit exakt 50 Zeichen (Grenzwert)
        System.out.println("\n1.3 Name mit 50 Zeichen (Grenzwert):");
        String exactly50Chars = "A".repeat(50);
        try {
            Patient boundaryNamePatient = new Patient(4L, exactly50Chars, "Test", "123",
                    "test@test.de", LocalDate.of(1990, 1, 1), "TestStr");
            System.out.println("ERFOLG: 50-Zeichen Name akzeptiert");
        } catch (Exception e) {
            System.out.println("FEHLER: 50-Zeichen Name abgelehnt: " + e.getMessage());
        }

        // Test 1.4: Name mit 51 Zeichen (über Grenzwert)
        System.out.println("\n1.4 Name mit 51 Zeichen (über Grenzwert):");
        String exactly51Chars = "A".repeat(51);
        try {
            Patient tooLongNamePatient = new Patient(5L, exactly51Chars, "Test", "123",
                    "test@test.de", LocalDate.of(1990, 1, 1), "TestStr");
            System.out.println("FEHLER: 51-Zeichen Name wurde akzeptiert");
        } catch (InvalidPersonDataException e) {
            System.out.println("ERFOLG: 51-Zeichen Name korrekt abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }

        // Test 1.5: Null-Werte
        System.out.println("\n1.5 Null-Name:");
        try {
            Patient nullPatient = new Patient(6L, null, "Test", "123",
                    "test@test.de", LocalDate.of(1990, 1, 1), "TestStr");
            System.out.println("FEHLER: Null-Name akzeptiert");
        } catch (InvalidPersonDataException e) {
            System.out.println("ERFOLG: Null-Name abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }
    }

    /**
     * Test 2: Employee Exception Edge-Cases
     */
    private static void testEmployeeExceptionEdgeCases() {
        System.out.println("\n\nTEST 2: EMPLOYEE EXCEPTION EDGE-CASES");
        System.out.println("-".repeat(50));

        // Test 2.1: Abteilung mit exakt 100 Zeichen (Grenzwert)
        System.out.println("2.1 Abteilung mit 100 Zeichen (Grenzwert):");
        String exactly100Chars = "A".repeat(100);
        try {
            Employee boundaryEmployee = new Employee(10L, "Test", "Employee", "123", "test@test.de",
                    LocalDate.of(1980, 1, 1), "TestStr", exactly100Chars);
            System.out.println("ERFOLG: 100-Zeichen Abteilung akzeptiert");
        } catch (Exception e) {
            System.out.println("FEHLER: 100-Zeichen Abteilung abgelehnt: " + e.getMessage());
        }

        // Test 2.2: Abteilung mit 101 Zeichen (über Grenzwert)
        System.out.println("\n2.2 Abteilung mit 101 Zeichen (über Grenzwert):");
        String exactly101Chars = "A".repeat(101);
        try {
            Employee tooLongDeptEmployee = new Employee(11L, "Test", "Employee", "123", "test@test.de",
                    LocalDate.of(1980, 1, 1), "TestStr", exactly101Chars);
            System.out.println("FEHLER: 101-Zeichen Abteilung wurde akzeptiert");
        } catch (InvalidPersonDataException e) {
            System.out.println("ERFOLG: 101-Zeichen Abteilung korrekt abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }

        // Test 2.3: Leere Abteilung
        System.out.println("\n2.3 Leere Abteilung:");
        try {
            Employee emptyDeptEmployee = new Employee(12L, "Test", "Employee", "123", "test@test.de",
                    LocalDate.of(1980, 1, 1), "TestStr", "");
            System.out.println("FEHLER: Leere Abteilung akzeptiert");
        } catch (InvalidPersonDataException e) {
            System.out.println("ERFOLG: Leere Abteilung abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }

        // Test 2.4: Null-Abteilung
        System.out.println("\n2.4 Null-Abteilung:");
        try {
            Employee nullDeptEmployee = new Employee(13L, "Test", "Employee", "123", "test@test.de",
                    LocalDate.of(1980, 1, 1), "TestStr", null);
            System.out.println("FEHLER: Null-Abteilung akzeptiert");
        } catch (InvalidPersonDataException e) {
            System.out.println("ERFOLG: Null-Abteilung abgelehnt");
        } catch (Exception e) {
            System.out.println("Unerwartete Exception: " + e.getClass().getSimpleName());
        }
    }

    /**
     * Test 3: Ward Exception Edge-Cases
     */
    private static void testWardExceptionEdgeCases() {
        System.out.println("\n\nTEST 3: WARD EXCEPTION EDGE-CASES");
        System.out.println("-".repeat(50));

        // Test 3.1: Kapazität = 1 (Minimum)
        System.out.println("3.1 Minimale Kapazität (1):");
        try {
            Ward minCapacityWard = new Ward(100, "MinWard", "Minimum Capacity", 1);
            System.out.println("ERFOLG: Kapazität 1 akzeptiert");
        } catch (Exception e) {
            System.out.println("FEHLER: Kapazität 1 abgelehnt: " + e.getMessage());
        }

        // Test 3.2: Kapazität = 0 (sollte ungültig sein)
        System.out.println("\n3.2 Kapazität 0 (ungültig):");
        try {
            Ward zeroCapacityWard = new Ward(101, "ZeroWard", "Zero Capacity", 0);
            System.out.println("FEHLER: Kapazität 0 akzeptiert");
        } catch (Exception e) {
            System.out.println("ERFOLG: Kapazität 0 abgelehnt");
        }

        // Test 3.3: Negative Kapazität
        System.out.println("\n3.3 Negative Kapazität (-5):");
        try {
            Ward negativeCapacityWard = new Ward(102, "NegWard", "Negative Capacity", -5);
            System.out.println("FEHLER: Negative Kapazität akzeptiert");
        } catch (Exception e) {
            System.out.println("ERFOLG: Negative Kapazität abgelehnt");
        }

        // Test 3.4: Leerer Ward-Name
        System.out.println("\n3.4 Leerer Ward-Name:");
        try {
            Ward emptyNameWard = new Ward(103, "", "Test Description", 10);
            System.out.println("FEHLER: Leerer Ward-Name akzeptiert");
        } catch (Exception e) {
            System.out.println("ERFOLG: Leerer Ward-Name abgelehnt");
        }
    }

    /**
     * Test 4: Treatment Exception Edge-Cases
     */
    private static void testTreatmentExceptionEdgeCases() {
        System.out.println("\n\nTEST 4: TREATMENT EXCEPTION EDGE-CASES");
        System.out.println("-".repeat(50));

        // Test 4.1: Treatment mit Datum in der Zukunft
        System.out.println("4.1 Treatment-Datum in der Zukunft:");
        try {
            Treatment futureTreatment = new Treatment(200, LocalDate.of(2030, 1, 1),
                    "Future Treatment", 1L, 10L);
            System.out.println("WARNUNG: Zukünftiges Treatment-Datum akzeptiert (möglicherweise geplant)");
        } catch (Exception e) {
            System.out.println("INFO: Zukünftiges Treatment-Datum abgelehnt: " + e.getMessage());
        }

        // Test 4.2: Treatment mit sehr altem Datum
        System.out.println("\n4.2 Treatment mit sehr altem Datum:");
        try {
            Treatment oldTreatment = new Treatment(201, LocalDate.of(1800, 1, 1),
                    "Very Old Treatment", 1L, 10L);
            System.out.println("WARNUNG: Sehr altes Treatment-Datum akzeptiert");
        } catch (Exception e) {
            System.out.println("INFO: Sehr altes Treatment-Datum abgelehnt: " + e.getMessage());
        }

        // Test 4.3: Treatment mit Person-ID = 0
        System.out.println("\n4.3 Treatment mit Patient-ID = 0:");
        try {
            Treatment zeroPatientTreatment = new Treatment(202, LocalDate.of(2024, 1, 1),
                    "Zero Patient", 0L, 10L);
            System.out.println("WARNUNG: Patient-ID 0 akzeptiert (möglicherweise problematisch)");
        } catch (Exception e) {
            System.out.println("INFO: Patient-ID 0 abgelehnt: " + e.getMessage());
        }

        // Test 4.4: Treatment mit negativen Person-IDs
        System.out.println("\n4.4 Treatment mit negativen Person-IDs:");
        try {
            Treatment negativeTreatment = new Treatment(203, LocalDate.of(2024, 1, 1),
                    "Negative IDs", -1L, -10L);
            System.out.println("WARNUNG: Negative Person-IDs akzeptiert");
        } catch (Exception e) {
            System.out.println("INFO: Negative Person-IDs abgelehnt: " + e.getMessage());
        }

        System.out.println("\nHinweis: Treatment-Klasse hat möglicherweise weniger Validierung implementiert.");
        System.out.println("Erweiterte Validierung sollte in zukünftigen Versionen hinzugefügt werden.");
    }
}