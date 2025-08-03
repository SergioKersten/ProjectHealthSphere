package com.healthsphere.manager;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.components.Person;
import com.healthsphere.components.Ward;
import com.healthsphere.serialization.SerializationManager;

public class PersonManager<T extends Person> {
    private Set<T> personenSet = new HashSet<>();
    private String filename; // Dateiname für automatisches Speichern
    private boolean autoSaveEnabled = true;

    // Konstruktor ohne Auto-Save
    public PersonManager() {
    }

    // Konstruktor mit Auto-Save
    public PersonManager(String filename) {
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
            SerializationManager.saveToFile(personenSet, filename);
        }
    }

    public boolean addPersonWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress,
            String department, Integer wardId) {
        long newId = generateUniquePersonId();

        @SuppressWarnings("unchecked")
        T person = (T) new Employee(newId, name, firstname, phonenumber, email, birthdate, adress, department, wardId);
        return addPerson(person);
    }

    public boolean addPatientWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress, Integer wardId) {
        long newId = generateUniquePersonId();

        @SuppressWarnings("unchecked")
        T person = (T) new Patient(newId, name, firstname, phonenumber, email, birthdate, adress, wardId);
        return addPerson(person);
    }

    private long generateUniquePersonId() {
        if (personenSet.isEmpty()) {
            return 1;
        }
        return personenSet.stream()
                .mapToLong(Person::getPersonId)
                .max()
                .orElse(0) + 1;
    }

    // Add a new person - MIT Kapazitätsprüfung für Patienten
    public boolean addPerson(T person) {
        // Kapazitätsprüfung nur für Patienten mit Ward-Zuweisung
        if (person instanceof Patient) {
            Patient patient = (Patient) person;
            if (patient.getWardId() != null) {
                if (!checkWardCapacity(patient.getWardId())) {
                    System.err.println("FEHLER: Ward " + patient.getWardId() + " hat keine freien Plätze!");
                    return false;
                }
            }
        }

        boolean result = personenSet.add(person);
        if (result) {
            autoSave();
        }
        return result;
    }

    // Delete a person by ID
    public boolean deletePerson(long personId) {
        boolean result = personenSet.removeIf(p -> p.getPersonId() == personId);
        if (result) {
            autoSave();
        }
        return result;
    }

    // Find a person by ID
    public T findById(long personId) {
        for (T person : personenSet) {
            if (person.getPersonId() == personId) {
                return person;
            }
        }
        return null;
    }

    // Return all persons
    public Set<T> getAll() {
        return personenSet;
    }

    // Update basic person info by ID
    public boolean updatePerson(long personId, String newName, String newFirstname, String newPhonenumber,
            String newEmail, String newAdress) {
        T person = findById(personId);
        if (person != null) {
            if (newName != null)
                person.setName(newName);
            if (newFirstname != null)
                person.setFirstname(newFirstname);
            if (newPhonenumber != null)
                person.setPhonenumber(newPhonenumber);
            if (newEmail != null)
                person.setEmail(newEmail);
            if (newAdress != null)
                person.setAdress(newAdress);

            autoSave();
            return true;
        }
        return false;
    }

    public boolean updateEmployeeDepartment(long personId, String newDepartment) {
        T person = findById(personId);
        if (person instanceof Employee) {
            ((Employee) person).setDepartment(newDepartment);
            autoSave();
            return true;
        }
        return false;
    }

    // Ward-Zuweisung für Patienten - MIT Kapazitätsprüfung
    public boolean updatePatientWard(long personId, Integer wardId) {
        T person = findById(personId);
        if (person instanceof Patient) {
            Patient patient = (Patient) person;

            // Kapazitätsprüfung nur wenn neue Ward zugewiesen wird
            if (wardId != null && !wardId.equals(patient.getWardId())) {
                if (!checkWardCapacity(wardId)) {
                    System.err.println("FEHLER: Ward " + wardId + " hat keine freien Plätze!");
                    return false;
                }
            }

            patient.setWardId(wardId);
            autoSave();
            return true;
        }
        return false;
    }

    // Ward-Zuweisung für Mitarbeiter/Ärzte updaten
    public boolean updateEmployeeWard(long personId, Integer wardId) {
        T person = findById(personId);
        if (person instanceof Employee) {
            ((Employee) person).setWardId(wardId);
            autoSave();
            return true;
        }
        return false;
    }

    // Kombiniertes Update für Employee (Department + Ward)
    public boolean updateEmployee(long personId, String newName, String newFirstname, String newPhonenumber,
            String newEmail, String newAdress, String newDepartment, Integer newWardId) {
        T person = findById(personId);
        if (person instanceof Employee) {
            // Update basic person fields
            if (newName != null)
                person.setName(newName);
            if (newFirstname != null)
                person.setFirstname(newFirstname);
            if (newPhonenumber != null)
                person.setPhonenumber(newPhonenumber);
            if (newEmail != null)
                person.setEmail(newEmail);
            if (newAdress != null)
                person.setAdress(newAdress);

            // Update employee-specific fields
            Employee employee = (Employee) person;
            if (newDepartment != null)
                employee.setDepartment(newDepartment);
            if (newWardId != null)
                employee.setWardId(newWardId);

            autoSave();
            return true;
        }
        return false;
    }

    // Kombiniertes Update für Patient - MIT Kapazitätsprüfung
    public boolean updatePatient(long personId, String newName, String newFirstname, String newPhonenumber,
            String newEmail, String newAdress, Integer newWardId) {
        T person = findById(personId);
        if (person instanceof Patient) {
            Patient patient = (Patient) person;

            // Kapazitätsprüfung bei Ward-Änderung
            if (newWardId != null && !newWardId.equals(patient.getWardId())) {
                if (!checkWardCapacity(newWardId)) {
                    System.err.println("FEHLER: Ward " + newWardId + " hat keine freien Plätze!");
                    return false;
                }
            }

            // Update basic person fields
            if (newName != null)
                person.setName(newName);
            if (newFirstname != null)
                person.setFirstname(newFirstname);
            if (newPhonenumber != null)
                person.setPhonenumber(newPhonenumber);
            if (newEmail != null)
                person.setEmail(newEmail);
            if (newAdress != null)
                person.setAdress(newAdress);

            // Update ward assignment
            if (newWardId != null)
                patient.setWardId(newWardId);

            autoSave();
            return true;
        }
        return false;
    }

    // Filter persons by given predicate
    public Set<T> filter(Predicate<T> predicate) {
        return personenSet.stream().filter(predicate).collect(Collectors.toSet());
    }

    // Kapazitätsprüfung - Die wichtigste neue Methode!
    @SuppressWarnings("unchecked")
    private boolean checkWardCapacity(Integer wardId) {
        if (wardId == null)
            return true;

        try {
            WardManager wardManager = new WardManager("wards.ser");
            Ward ward = wardManager.findById(wardId);

            if (ward == null) {
                System.err.println("Ward mit ID " + wardId + " nicht gefunden!");
                return false;
            }

            // Cast von PersonManager<T> zu PersonManager<Patient>
            return ward.hasCapacity((PersonManager<Patient>) this);

        } catch (Exception e) {
            System.err.println("Fehler bei Kapazitätsprüfung: " + e.getMessage());
            return false;
        }
    }

    // Save current state to file
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(personenSet, filename);
        }
    }

    // Load state from file
    @SuppressWarnings("unchecked")
    public void load() {
        if (filename != null) {
            Set<T> loadedSet = SerializationManager.loadFromFile(filename);
            if (loadedSet != null) {
                this.personenSet = loadedSet;
            }
        }
    }
}