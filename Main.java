import java.time.*;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        // Manager mit automatischem Speichern erstellen
        PersonManager<Patient> patientenManager = new PersonManager<>("patients.ser");
        PersonManager<Employee> employeeManager = new PersonManager<>("employees.ser");

        System.out.println("=== Geladene Daten ===");
        System.out.println("Patienten: " + patientenManager.getAll().size());
        System.out.println("Mitarbeiter: " + employeeManager.getAll().size());

        System.out.println("\n=== Aktuelle Daten ===");
        System.out.println("Patienten:");
        patientenManager.getAll()
                .forEach(p -> System.out.println("- " + p.getFirstname() + " " + p.getName() + " (Tel: " +
                        p.getPhonenumber() + ")"));

        // Neue Daten hinzufügen - speichert automatisch bei jeder Änderung
        Patient p1 = new Patient(1, "Meier", "Anna", "0123", "a@web.de",
                LocalDate.of(1990, 1, 1), "Musterstraße 5");
        Patient p2 = new Patient(2, "Schulz", "Ben", "0456", "b@web.de",
                LocalDate.of(1985, 6, 15), "Beispielweg 3");

        System.out.println("\n=== Patienten hinzufügen ===");
        boolean added1 = patientenManager.addPerson(p1); // Speichert automatisch!
        boolean added2 = patientenManager.addPerson(p2); // Speichert automatisch!

        System.out.println("Patient 1 hinzugefügt: " + added1);
        System.out.println("Patient 2 hinzugefügt: " + added2);

        Employee e1 = new Employee(1, "Musterfrau", "Milena", "0123456", "m@web.de",
                LocalDate.of(1990, 1, 1), "Musterstraße 6", "Urologie");
        Employee e2 = new Employee(2, "Schulze", "Benjamin", "0454534536",
                "be@web.de",
                LocalDate.of(1985, 6, 15), "Beispielweg 4", "Onkologie");

        System.out.println("\n=== Mitarbeiter hinzufügen ===");
        employeeManager.addPerson(e1); // Speichert automatisch!
        employeeManager.addPerson(e2); // Speichert automatisch!

        // Daten ändern - speichert automatisch
        System.out.println("\n=== Daten ändern ===");
        patientenManager.updatePerson(1, null, null, "0123-UPDATED", null, null);
        employeeManager.updateEmployeeDepartment(1, "Kardiologie");

        // Einen Patienten löschen - speichert automatisch
        System.out.println("\n=== Patient löschen ===");
        boolean deleted = patientenManager.deletePerson(2);
        System.out.println("Patient 2 gelöscht: " + deleted);

        // Aktuelle Daten anzeigen
        System.out.println("\n=== Aktuelle Daten ===");
        System.out.println("Patienten:");
        patientenManager.getAll()
                .forEach(p -> System.out.println("- " + p.getFirstname() + " " + p.getName() + " (Tel: " +
                        p.getPhonenumber() + ")"));

        System.out.println("\nMitarbeiter:");
        employeeManager.getAll().forEach(e -> System.out.println("- " + e.getFirstname() + " " + e.getName() + " (" +
                e.getDepartment() + ")"));

        System.out.println("\n=== Alle Änderungen wurden automatisch gespeichert! ===");

        // Test: Suche nach ID
        System.out.println("\n=== Suche ===");
        Patient gefunden = patientenManager.findById(1);
        if (gefunden != null) {
            System.out.println("Patient gefunden: " + gefunden.getFirstname() + " " +
                    gefunden.getName());
        }
        // ----- TreatmentManager TestCases without filtering
        TreatmentManager treatmentManager = new TreatmentManager();

        Treatment t = new Treatment(1, LocalDate.now(), "Physio", 1001L, 2001L);
        treatmentManager.addTreatment(t);

        // Get info
        Treatment found = treatmentManager.findById(1);
        System.out.println(found.getTherapy());

        // Update
        treatmentManager.updateTherapy(1, "Massage");

        // ------ WardManager TestCases without filtering
        WardManager wardManager = new WardManager();

        wardManager.addWard(new Ward(1, "Intensive Care", "Critical patients", 10));
        wardManager.addWard(new Ward(2, "Pediatrics", "Children", 8));

        // Update
        wardManager.updateWard(1, null, "Updated description", 12);

        // Test: Auto-Save deaktivieren/aktivieren
        System.out.println("\n=== Auto-Save Test ===");
        patientenManager.disableAutoSave();
        System.out.println("Auto-Save deaktiviert");

        patientenManager.enableAutoSave("patients_backup.ser");
        System.out.println("Auto-Save für Backup-Datei aktiviert");

    }
}