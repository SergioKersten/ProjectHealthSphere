package com.healthsphere.manager;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Patient;
import com.healthsphere.components.Person;
import com.healthsphere.serialization.SerializationManager;
import com.healthsphere.manager.WardManager;
import com.healthsphere.components.Ward;

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

    // ===== KAPAZITÄTSPRÜFUNG =====
    @SuppressWarnings("unchecked")
    private boolean checkWardCapacity(Integer wardId) {
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

            // Cast zu PersonManager<Patient> für Ward-Kapazitätsprüfung
            return ward.hasCapacity((PersonManager<Patient>) this);

        } catch (Exception e) {
            System.err.println("Fehler bei Kapazitätsprüfung: " + e.getMessage());
            return false;
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

    // ===== CREATE METHODEN =====
    public boolean addPatientWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress, Integer wardId) {
        long newId = generateUniquePersonId();

        @SuppressWarnings("unchecked")
        T person = (T) new Patient(newId, name, firstname, phonenumber, email, birthdate, adress, wardId);
        return addPerson(person);
    }

    public boolean addPersonWithAutoId(String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String adress,
            String department, Integer wardId) {
        long newId = generateUniquePersonId();

        @SuppressWarnings("unchecked")
        T person = (T) new Employee(newId, name, firstname, phonenumber, email, birthdate, adress, department, wardId);
        return addPerson(person);
    }

    public boolean addPerson(T person) {
        // Kapazitätsprüfung für Patienten
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

        // Kapazitätsprüfung für Patienten
        if (updatedPerson instanceof Patient) {
            Patient updatedPatient = (Patient) updatedPerson;
            if (updatedPatient.getWardId() != null) {
                if (!checkWardCapacity(updatedPatient.getWardId())) {
                    System.err.println("FEHLER: Ward " + updatedPatient.getWardId() + " hat keine freien Plätze!");
                    return false;
                }
            }
        }

        // Person ersetzen
        personenSet.remove(existingPerson);
        personenSet.add(updatedPerson);
        autoSave();
        return true;
    }

    // KOMPATIBILITÄTS-METHODEN für Controller
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
    }

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
    }

    // ===== DELETE METHODEN =====
    public boolean deletePerson(long personId) {
        boolean result = personenSet.removeIf(p -> p.getPersonId() == personId);
        if (result) {
            autoSave();
        }
        return result;
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
}