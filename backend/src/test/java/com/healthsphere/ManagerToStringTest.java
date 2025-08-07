package com.healthsphere;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.manager.PersonManager;
import com.healthsphere.manager.TreatmentManager;
import com.healthsphere.manager.WardManager;

/**
 * Testklasse für die toString() Methoden aller Manager-Klassen
 * 
 * Diese Klasse verwendet die ECHTEN Daten aus dem System,
 * anstatt künstliche Testdaten zu erstellen.
 */
public class ManagerToStringTest {

    // Manager für die echten Systemdaten
    private PersonManager<Patient> patientManager;
    private PersonManager<Employee> employeeManager;
    private WardManager wardManager;
    private TreatmentManager treatmentManager;

    @BeforeEach
    @DisplayName("Setup: Lade echte Systemdaten")
    public void setUp() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("SETUP: Lade echte Daten aus dem HealthSphere System");
        System.out.println("=".repeat(60));

        // Manager mit den echten Datendateien initialisieren
        patientManager = new PersonManager<>("patients.ser");
        employeeManager = new PersonManager<>("employees.ser");
        wardManager = new WardManager("wards.ser"); // Falls WardManager Persistierung hat
        treatmentManager = new TreatmentManager("treatments.ser");

        // Status der geladenen Daten anzeigen
        System.out.println("✅ Patienten geladen: " + patientManager.getAll().size());
        System.out.println("✅ Mitarbeiter geladen: " + employeeManager.getAll().size());
        System.out.println("✅ Stationen geladen: " + wardManager.getAll().size());
        System.out.println("✅ Behandlungen geladen: " + treatmentManager.getAll().size());

        if (patientManager.getAll().isEmpty() && employeeManager.getAll().isEmpty() &&
                wardManager.getAll().isEmpty() && treatmentManager.getAll().isEmpty()) {
            System.out.println(
                    "⚠️  WARNUNG: Alle Manager sind leer. Stellen Sie sicher, dass Daten im System vorhanden sind!");
        }
    }

    @Test
    @DisplayName("Test: Echte Patienten-Daten toString()")
    public void testRealPatientData() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 1: Echte Patienten-Daten aus patients.ser");
        System.out.println("=".repeat(60));

        if (patientManager.getAll().isEmpty()) {
            System.out.println("❌ Keine Patienten-Daten gefunden!");
            System.out.println("💡 Tipp: Fügen Sie erst Patienten über Ihre Anwendung hinzu.");
        } else {
            System.out.println("PATIENTEN-DATEN:");
            System.out.println(patientManager.toString());

        }
    }

    @Test
    @DisplayName("Test: Echte Mitarbeiter-Daten toString()")
    public void testRealEmployeeData() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 2: Echte Mitarbeiter-Daten aus employees.ser");
        System.out.println("=".repeat(60));

        if (employeeManager.getAll().isEmpty()) {
            System.out.println("❌ Keine Mitarbeiter-Daten gefunden!");
            System.out.println("💡 Tipp: Fügen Sie erst Ärzte/Pflegepersonal über Ihre Anwendung hinzu.");
        } else {
            System.out.println("📊 DETAILLIERTE MITARBEITER-DATEN:");
            System.out.println(employeeManager.toString());

        }
    }

    @Test
    @DisplayName("Test: Echte Stations-Daten toString()")
    public void testRealWardData() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 3: Echte Stations-Daten aus dem System");
        System.out.println("=".repeat(60));

        if (wardManager.getAll().isEmpty()) {
            System.out.println("❌ Keine Stations-Daten gefunden!");
            System.out.println("💡 Tipp: Fügen Sie erst Stationen über Ihre Anwendung hinzu.");
        } else {
            System.out.println("📊 DETAILLIERTE STATIONS-DATEN:");
            System.out.println(wardManager.toString());

        }
    }

    @Test
    @DisplayName("Test: Echte Behandlungs-Daten toString()")
    public void testRealTreatmentData() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 4: Echte Behandlungs-Daten aus treatments.ser");
        System.out.println("=".repeat(60));

        if (treatmentManager.getAll().isEmpty()) {
            System.out.println("❌ Keine Behandlungs-Daten gefunden!");
            System.out.println("💡 Tipp: Erstellen Sie erst Behandlungen über Ihre Anwendung.");
        } else {
            System.out.println("📊 DETAILLIERTE BEHANDLUNGS-DATEN:");
            System.out.println(treatmentManager.toString());

        }
    }

    @Test
    @DisplayName("Test: Vollständige System-Übersicht mit echten Daten")
    public void testCompleteSystemOverview() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 5: VOLLSTÄNDIGE SYSTEM-ÜBERSICHT MIT ECHTEN DATEN");
        System.out.println("=".repeat(60));

        System.out.println("🏥 HEALTHSPHERE SYSTEM STATUS (LIVE-DATEN)");
        System.out.println("-".repeat(50));

        System.out.println("-".repeat(50));

        // Detaillierte Kapazitätsanalyse mit echten Daten
        if (!wardManager.getAll().isEmpty()) {
            System.out.println("\n📈 LIVE KAPAZITÄTSANALYSE:");
            System.out.println("-".repeat(50));

            wardManager.getAll().forEach(ward -> {
                long currentOccupancy = ward.getCurrentOccupancy(patientManager);
                long availableCapacity = ward.getAvailableCapacity(patientManager);
                double occupancyRate = ward.getCapacity() > 0 ? (double) currentOccupancy / ward.getCapacity() * 100
                        : 0;

                System.out.printf("🏥 %-15s | Kapazität: %2d | Belegt: %2d | Frei: %2d | Auslastung: %.1f%%\n",
                        ward.getWardName(), ward.getCapacity(), currentOccupancy,
                        availableCapacity, occupancyRate);
            });
        }

        // Behandlungsstatistiken mit echten Daten
        if (!treatmentManager.getAll().isEmpty()) {
            System.out.println("\n📊 BEHANDLUNGSSTATISTIKEN (LIVE):");
            System.out.println("-".repeat(50));

            long todayTreatments = treatmentManager.getAll().stream()
                    .filter(t -> t.getDate().equals(java.time.LocalDate.now()))
                    .count();

            long thisWeekTreatments = treatmentManager.getAll().stream()
                    .filter(t -> t.getDate().isAfter(java.time.LocalDate.now().minusWeeks(1)))
                    .count();

            System.out.println("📅 Behandlungen heute: " + todayTreatments);
            System.out.println("📅 Behandlungen diese Woche: " + thisWeekTreatments);
            System.out.println("📅 Behandlungen gesamt: " + treatmentManager.getAll().size());
        }
    }

    @Test
    @DisplayName("Test: Datenqualität und Konsistenz")
    public void testDataQuality() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST 6: DATENQUALITÄT UND KONSISTENZ-PRÜFUNG");
        System.out.println("=".repeat(60));

        // Prüfe Referenz-Integrität zwischen Behandlungen und Personen
        if (!treatmentManager.getAll().isEmpty()) {
            System.out.println("🔍 REFERENZ-INTEGRITÄT PRÜFUNG:");
            System.out.println("-".repeat(40));

            treatmentManager.getAll().forEach(treatment -> {
                Patient patient = patientManager.findById(treatment.getPatientPersonId());
                Employee doctor = employeeManager.findById(treatment.getDoctorPersonId());

                System.out.printf("Behandlung %d: Patient %s | Arzt %s\n",
                        treatment.getTreatmentId(),
                        patient != null ? "✅ gefunden"
                                : "❌ nicht gefunden (ID: " + treatment.getPatientPersonId() + ")",
                        doctor != null ? "✅ gefunden" : "❌ nicht gefunden (ID: " + treatment.getDoctorPersonId() + ")");
            });
        }

        // Prüfe Ward-Zuweisungen
        if (!patientManager.getAll().isEmpty() && !wardManager.getAll().isEmpty()) {
            System.out.println("\n🏥 STATIONS-ZUWEISUNGEN PRÜFUNG:");
            System.out.println("-".repeat(40));

            patientManager.getAll().forEach(patient -> {
                if (patient.getWardId() != null) {
                    boolean wardExists = wardManager.getAll().stream()
                            .anyMatch(ward -> ward.getWardId() == patient.getWardId());

                    System.out.printf("Patient %s: Station %d %s\n",
                            patient.getName(),
                            patient.getWardId(),
                            wardExists ? "✅ existiert" : "❌ nicht gefunden");
                }
            });
        }
    }

    /**
     * Hauptmethode zum direkten Ausführen der Tests mit echten Daten
     */
    public static void main(String[] args) {
        System.out.println("🏥 HEALTHSPHERE MANAGER TOSTRING() TESTS - MIT ECHTEN DATEN");
        System.out.println("=".repeat(70));

        ManagerToStringTest test = new ManagerToStringTest();

        try {
            test.setUp();
            test.testRealPatientData();
            test.testRealEmployeeData();
            test.testRealWardData();
            test.testRealTreatmentData();
            test.testCompleteSystemOverview();
            test.testDataQuality();

            System.out.println("\n🎉 ALLE TESTS MIT ECHTEN DATEN ABGESCHLOSSEN!");

        } catch (Exception e) {
            System.err.println("❌ Fehler beim Ausführen der Tests: " + e.getMessage());
            e.printStackTrace();
        }
    }
}