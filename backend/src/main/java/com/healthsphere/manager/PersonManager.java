package com.healthsphere.manager;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.healthsphere.components.Employee;
import com.healthsphere.components.Person;
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

    public boolean addPerson(T person) {
        boolean result = personenSet.add(person);
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
    }

    public boolean deletePerson(long personId) {
        boolean result = personenSet.removeIf(p -> p.getPersonId() == personId);
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
    }

    public T findById(long personId) {
        for (T person : personenSet) {
            if (person.getPersonId() == personId) {
                return person;
            }
        }
        return null;
    }

    public Set<T> getAll() {
        return personenSet;
    }

    public boolean updatePerson(long personId, String newName, String newFirstname,
            String newPhone, String newEmail, String newAdress) {
        T person = findById(personId);
        if (person != null) {
            if (newName != null)
                person.setName(newName);
            if (newFirstname != null)
                person.setFirstname(newFirstname);
            if (newPhone != null)
                person.setPhonenumber(newPhone);
            if (newEmail != null)
                person.setEmail(newEmail);
            if (newAdress != null)
                person.setAdress(newAdress);

            autoSave(); // Speichern nach Update
            return true;
        }
        return false;
    }

    public boolean updateEmployeeDepartment(long personId, String newDepartment) {
        T person = findById(personId);
        if (person instanceof Employee) {
            ((Employee) person).setDepartment(newDepartment);
            autoSave(); // Speichern nach Update
            return true;
        }
        return false;
    }

    public Set<T> filter(Predicate<T> criteria) {
        return personenSet.stream()
                .filter(criteria)
                .collect(Collectors.toSet());
    }

    // Manuelles Speichern
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(personenSet, filename);
        }
    }

    // Laden von Datei
    public void load() {
        if (filename != null && SerializationManager.fileExists(filename)) {
            Set<T> loadedData = SerializationManager.loadFromFile(filename);
            if (loadedData != null) {
                personenSet = loadedData;
            }
        }
    }
}