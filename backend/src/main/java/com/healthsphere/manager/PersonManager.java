package com.healthsphere.manager;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.healthsphere.Exceptions.PersonExceptions.DuplicatePersonException;
import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.components.Person;
import com.healthsphere.serialization.SerializationManager;
import com.healthsphere.manager.WardManager;
import com.healthsphere.components.Ward;

/**
 * Generische Verwaltungsklasse für alle Personentypen im HealthSphere-System.
 * 
 * Der PersonManager implementiert das CRUD-Pattern (Create, Read, Update,
 * Delete)
 * für Personen-Objekte und bietet erweiterte Funktionalitäten wie Suche,
 * Sortierung und automatische Persistierung.
 * 
 * Kernfunktionalitäten:
 * 
 * Generische Verwaltung von Patient- und Employee-Objekten
 * Automatische ID-Generierung für neue Personen
 * Erweiterte Such- und Filterfunktionen
 * Automatische Serialisierung für Datenpersistenz
 * Type-Safe Operations mit Generics
 * 
 * 
 * @param <T> Der Personentyp (Patient oder Employee) der verwaltet wird
 * 
 */

public class PersonManager<T extends Person> {
    private Set<T> personenSet = new HashSet<>();
    private String filename;
    private boolean autoSaveEnabled = true;

    // ===== KONSTRUKTOREN =====
    public PersonManager() {
    }

    public PersonManager(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
        load();
    }

    // ===== AUTO-SAVE KONFIGURATION =====
    public void enableAutoSave(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
    }

    public void disableAutoSave() {
        this.autoSaveEnabled = false;
    }

    private void autoSave() {
        if (autoSaveEnabled && filename != null) {
            SerializationManager.saveToFile(personenSet, filename);
        }
    }

    // ===== ID-GENERIERUNG =====
    private long generateUniquePersonId() {
        if (personenSet.isEmpty()) {
            return 1;
        }
        return personenSet.stream()
                .mapToLong(Person::getPersonId)
                .max()
                .orElse(0) + 1;
    }

    /**
     * Erstellt einen neuen Patienten mit automatischer ID-Generierung.
     * 
     * Diese Methode führt Type-Safety-Checks durch und prüft automatisch
     * die Ward-Kapazität vor der Zuweisung.
     * 
     * @param name        Nachname des Patienten
     * @param firstname   Vorname des Patienten
     * @param phonenumber Telefonnummer
     * @param email       E-Mail-Adresse
     * @param birthdate   Geburtsdatum
     * @param adress      Wohnadresse
     * @param wardId      Station für Zuweisung (kann null sein)
     * 
     * @return true wenn Patient erfolgreich erstellt und hinzugefügt wurde
     */
    public boolean addPatientWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress, Integer wardId) {

        try {
            long newId = generateUniquePersonId();

            // Sichere Patient-Erstellung
            Patient patient = new Patient(newId, name, firstname, phonenumber,
                    email, birthdate, adress, wardId);

            // Type-Safety Check: Stelle sicher, dass T tatsächlich Patient ist
            if (this.getClass().getSimpleName().contains("Patient") ||
                    this.filename != null && this.filename.contains("patient")) {
                @SuppressWarnings("unchecked")
                T person = (T) patient;
                return addPerson(person);
            } else {
                System.err.println("FEHLER: Versuche Patient zu EmployeeManager hinzuzufügen!");
                return false;
            }

        } catch (ClassCastException e) {
            System.err.println("FEHLER: Cast-Problem bei Patient-Erstellung: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("FEHLER: Unerwarteter Fehler bei Patient-Erstellung: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Erstellt einen neuen Mitarbeiter mit automatischer ID-Generierung.
     * 
     * Analog zur Patient-Erstellung mit Type-Safety-Checks für Employee-Manager.
     * 
     * @param name        Nachname des Mitarbeiters
     * @param firstname   Vorname des Mitarbeiters
     * @param phonenumber Dienstliche Telefonnummer
     * @param email       Dienstliche E-Mail
     * @param birthdate   Geburtsdatum
     * @param adress      Wohnadresse
     * @param department  Abteilungszugehörigkeit
     * @param wardId      Arbeitsplatz-Station (kann null sein)
     * 
     * @return true wenn Mitarbeiter erfolgreich erstellt wurde
     */
    public boolean addPersonWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress,
            String department, Integer wardId) {

        try {
            long newId = generateUniquePersonId();

            // Sichere Employee-Erstellung ohne problematischen Cast
            Employee employee = new Employee(newId, name, firstname, phonenumber,
                    email, birthdate, adress, department, wardId);

            // Type-Safety Check: Stelle sicher, dass T tatsächlich Employee ist
            if (this.getClass().getSimpleName().contains("Employee") ||
                    this.filename != null && this.filename.contains("employee")) {
                @SuppressWarnings("unchecked")
                T person = (T) employee;
                return addPerson(person);
            } else {
                System.err.println("FEHLER: Versuche Employee zu PatientManager hinzuzufügen!");
                return false;
            }

        } catch (ClassCastException e) {
            System.err.println("FEHLER: Cast-Problem bei Employee-Erstellung: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("FEHLER: Unerwarteter Fehler bei Employee-Erstellung: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Fügt eine Person zum Manager hinzu mit Duplikats- und Kapazitätsprüfung.
     * 
     * Überprüft auf Duplikate basierend auf der Personen-ID und führt für Patienten
     * automatisch eine Ward-Kapazitätsprüfung durch.
     * 
     * @param person Die hinzuzufügende Person
     * @return true wenn Person erfolgreich hinzugefügt wurde
     * @throws DuplicatePersonException wenn Person bereits existiert
     */
    public boolean addPerson(T person) throws DuplicatePersonException {
        // Duplikatsprüfung
        if (personenSet.stream().anyMatch(p -> p.getPersonId() == person.getPersonId())) {
            throw new DuplicatePersonException(person.getPersonId());
        }

        // Kapazitätsprüfung NUR für Patienten
        if (person instanceof Patient) {
            Patient patient = (Patient) person;
            if (patient.getWardId() != null && !checkWardCapacityForPatient(patient.getWardId())) {
                System.err.println("FEHLER: Ward " + patient.getWardId() + " hat keine freien Plätze!");
                return false;
            }
        }

        boolean added = personenSet.add(person);
        if (added) {
            autoSave(); // deine eigene Speichermethode, vermutlich Serialisierung
        }
        return added;
    }

    public boolean deletePerson(long personId) {
        try {
            T person = findById(personId);
            if (person == null) {
                return false; // Person nicht gefunden
            }

            boolean result = personenSet.remove(person);
            if (result) {
                autoSave();
            }
            return result;

        } catch (Exception e) {
            System.err.println("Fehler beim Löschen der Person: " + e.getMessage());
            return false;
        }
    }

    // ===== separate Kapazitätsprüfung für Patienten =====
    /***
     * 
     * Überprüft die
     * Kapazität einer
     * Ward für Patientenzuweisungen.**
     * Diese interne
     * Methode erstellt
     * einen separaten
     * PatientManager für*
     * die Kapazitätsprüfung
     * und verhindert Cast-Probleme.**
     * 
     * @param
     * wardId        ID
     *               der zu
     *               prüfenden Station*@return true
     *               wenn Ward
     *               verfügbare Kapazität hat
     */

    private boolean checkWardCapacityForPatient(Integer wardId) {
        if (wardId == null) {
            return true; // Keine Ward-Zuweisung = immer ok
        }

        try {
            WardManager wardManager = new WardManager("wards.ser");
            Ward ward = wardManager.findById(wardId);

            if (ward == null) {
                System.err.println("Ward mit ID " + wardId + " nicht gefunden!");
                return false;
            }

            // Erstelle IMMER einen separaten PatientManager für die Kapazitätsprüfung
            // Das verhindert alle Cast-Probleme!
            PersonManager<Patient> patientManager = new PersonManager<>("patients.ser");
            return ward.hasCapacity(patientManager);

        } catch (Exception e) {
            System.err.println("Fehler bei Kapazitätsprüfung: " + e.getMessage());
            e.printStackTrace(); // Für Debugging
            return false;
        }
    }

    // ===== READ METHODEN =====
    public T findById(long personId) {
        return personenSet.stream()
                .filter(p -> p.getPersonId() == personId)
                .findFirst()
                .orElse(null);
    }

    public Set<T> getAll() {
        return new HashSet<>(personenSet); // Defensive Kopie
    }

    public Set<T> filter(Predicate<T> predicate) {
        return personenSet.stream()
                .filter(predicate)
                .collect(Collectors.toSet());
    }

    // ===== UPDATE METHODEN =====
    public boolean updatePerson(long personId, T updatedPerson) {
        T existingPerson = findById(personId);
        if (existingPerson == null) {
            return false;
        }

        // Kapazitätsprüfung NUR für Patienten!
        if (updatedPerson instanceof Patient) {
            Patient updatedPatient = (Patient) updatedPerson;
            if (updatedPatient.getWardId() != null) {
                // Prüfe nur bei Ward-Wechsel oder bei neuer Ward-Zuweisung
                Patient existingPatient = (Patient) existingPerson;
                Integer oldWardId = existingPatient.getWardId();
                Integer newWardId = updatedPatient.getWardId();

                boolean wardChanged = (oldWardId == null && newWardId != null) ||
                        (oldWardId != null && !oldWardId.equals(newWardId));

                // HIER WAR DER FEHLER: checkWardCapacity() -> checkWardCapacityForPatient()
                if (wardChanged && !checkWardCapacityForPatient(newWardId)) {
                    System.err.println("FEHLER: Ward " + newWardId + " hat keine freien Plätze!");
                    return false;
                }
            }
        }
        // Für Employee-Updates wird KEINE Kapazitätsprüfung durchgeführt!

        // Person ersetzen
        personenSet.remove(existingPerson);
        personenSet.add(updatedPerson);
        autoSave();
        return true;
    }

    /**
     * Aktualisiert spezifische Patient-Daten.
     * 
     * Kompatibilitätsmethode für Controller-Integration mit selektiver
     * Aktualisierung einzelner Attribute.
     * 
     * @param personId       ID des zu aktualisierenden Patienten
     * @param newName        Neuer Nachname (null = keine Änderung)
     * @param newFirstname   Neuer Vorname (null = keine Änderung)
     * @param newPhonenumber Neue Telefonnummer (null = keine Änderung)
     * @param newEmail       Neue E-Mail (null = keine Änderung)
     * @param newAdress      Neue Adresse (null = keine Änderung)
     * @param newWardId      Neue Ward-ID (null = keine Änderung)
     * 
     * @return true wenn Update erfolgreich war
     */
    public boolean updatePatient(long personId, String newName, String newFirstname,
            String newPhonenumber, String newEmail, String newAdress, Integer newWardId) {
        if (!(this instanceof PersonManager))
            return false;

        @SuppressWarnings("unchecked")
        PersonManager<Patient> patientManager = (PersonManager<Patient>) this;
        Patient existingPatient = patientManager.findById(personId);
        if (existingPatient == null) {
            return false;
        }

        try {
            // Exception-handling hier im Backend!
            Patient updatedPatient = new Patient(
                    personId,
                    newName != null ? newName : existingPatient.getName(),
                    newFirstname != null ? newFirstname : existingPatient.getFirstname(),
                    newPhonenumber != null ? newPhonenumber : existingPatient.getPhonenumber(),
                    newEmail != null ? newEmail : existingPatient.getEmail(),
                    existingPatient.getBirthdate(),
                    newAdress != null ? newAdress : existingPatient.getAdress(),
                    newWardId != null ? newWardId : existingPatient.getWardId());

            @SuppressWarnings("unchecked")
            T typedPatient = (T) updatedPatient;
            return updatePerson(personId, typedPatient);

        } catch (Exception e) {
            // Alle Exceptions im Backend abfangen - keine Weiterleitung!
            System.err.println("Fehler beim Patient-Update: " + e.getMessage());
            return false;
        }
    }

    /**
     * Aktualisiert spezifische Employee-Daten.
     * 
     * Kompatibilitätsmethode für Controller-Integration mit selektiver
     * Aktualisierung einzelner Mitarbeiter-Attribute.
     * 
     * @param personId       ID des zu aktualisierenden Mitarbeiters
     * @param newName        Neuer Nachname (null = keine Änderung)
     * @param newFirstname   Neuer Vorname (null = keine Änderung)
     * @param newPhonenumber Neue Telefonnummer (null = keine Änderung)
     * @param newEmail       Neue E-Mail (null = keine Änderung)
     * @param newAdress      Neue Adresse (null = keine Änderung)
     * @param newDepartment  Neue Abteilung (null = keine Änderung)
     * @param newWardId      Neue Ward-ID (null = keine Änderung)
     * 
     * @return true wenn Update erfolgreich war
     */
    public boolean updateEmployee(long personId, String newName, String newFirstname,
            String newPhonenumber, String newEmail, String newAdress,
            String newDepartment, Integer newWardId) {
        if (!(this instanceof PersonManager))
            return false;

        @SuppressWarnings("unchecked")
        PersonManager<Employee> employeeManager = (PersonManager<Employee>) this;
        Employee existingEmployee = employeeManager.findById(personId);
        if (existingEmployee == null) {
            return false;
        }

        try {
            // Exception-handling hier im Backend!
            Employee updatedEmployee = new Employee(
                    personId,
                    newName != null ? newName : existingEmployee.getName(),
                    newFirstname != null ? newFirstname : existingEmployee.getFirstname(),
                    newPhonenumber != null ? newPhonenumber : existingEmployee.getPhonenumber(),
                    newEmail != null ? newEmail : existingEmployee.getEmail(),
                    existingEmployee.getBirthdate(),
                    newAdress != null ? newAdress : existingEmployee.getAdress(),
                    newDepartment != null ? newDepartment : existingEmployee.getDepartment(),
                    newWardId != null ? newWardId : existingEmployee.getWardId());

            @SuppressWarnings("unchecked")
            T typedEmployee = (T) updatedEmployee;
            return updatePerson(personId, typedEmployee);

        } catch (Exception e) {
            // Alle Exceptions im Backend abfangen - keine Weiterleitung!
            System.err.println("Fehler beim Employee-Update: " + e.getMessage());
            return false;
        }
    }

    // ===== PERSISTIERUNG =====
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(personenSet, filename);
        }
    }

    @SuppressWarnings("unchecked")
    public void load() {
        if (filename != null) {
            Set<T> loadedSet = SerializationManager.loadFromFile(filename);
            if (loadedSet != null) {
                this.personenSet = loadedSet;
            }
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("PersonManager{\n");
        sb.append("  filename='").append(filename != null ? filename : "none").append("'\n");
        sb.append("  autoSaveEnabled=").append(autoSaveEnabled).append("\n");
        sb.append("  totalPersons=").append(personenSet.size()).append("\n");

        if (!personenSet.isEmpty()) {
            // Bestimme den Typ der ersten Person für die Anzeige
            T firstPerson = personenSet.iterator().next();
            String personType = firstPerson.getClass().getSimpleName();
            sb.append("  personType='").append(personType).append("'\n");

            sb.append("  persons=[\n");
            for (T person : personenSet) {
                sb.append("    ").append(person.toString()).append("\n");
            }
            sb.append("  ]\n");
        } else {
            sb.append("  persons=[]\n");
        }

        sb.append("}");
        return sb.toString();
    }
}