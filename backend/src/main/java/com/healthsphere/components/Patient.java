package com.healthsphere.components;

import java.time.LocalDate;
import java.util.Comparator;

public class Patient extends Person {
    private static final long serialVersionUID = 2L;

    private Integer wardId; // Ward-Zuweisung für Patienten

    public Patient(long personId, String name, String firstname, String phonenumber, String email, LocalDate birthdate,
            String adress) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.wardId = null; // Standardmäßig keine Ward zugewiesen
    }

    // Konstruktor mit Ward-ID
    public Patient(long personId, String name, String firstname, String phonenumber, String email, LocalDate birthdate,
            String adress, Integer wardId) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.wardId = wardId;
    }

    /**
     * Patient-spezifische Sortierung:
     * 1. Primär: Nach Ward-ID (Patienten ohne Ward kommen zuletzt)
     * 2. Sekundär: Nach Person-Sortierung (Name, Vorname, Alter, ID)
     */
    @Override
    public int compareTo(Person other) {
        if (!(other instanceof Patient)) {
            // Wenn andere Person kein Patient ist, verwende Person-Sortierung
            return super.compareTo(other);
        }

        Patient otherPatient = (Patient) other;

        // 1. Primär nach Ward-ID (null-Werte kommen zuletzt)
        if (this.wardId == null && otherPatient.wardId == null) {
            return super.compareTo(other);
        }
        if (this.wardId == null)
            return 1; // this kommt nach other
        if (otherPatient.wardId == null)
            return -1; // this kommt vor other

        int wardComparison = this.wardId.compareTo(otherPatient.wardId);
        if (wardComparison != 0) {
            return wardComparison;
        }

        // 2. Sekundär nach Person-Sortierung
        return super.compareTo(other);
    }

    // Zusätzliche Comparatoren für verschiedene Sortierungen
    public static final Comparator<Patient> BY_WARD_THEN_NAME = Comparator
            .comparing(Patient::getWardId, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(Patient::getName, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Patient::getFirstname, String.CASE_INSENSITIVE_ORDER);

    public static final Comparator<Patient> BY_AGE_DESC = Comparator
            .comparing(Patient::getAge, Comparator.reverseOrder())
            .thenComparing(Patient::getName, String.CASE_INSENSITIVE_ORDER);

    public static final Comparator<Patient> BY_NAME_ONLY = Comparator
            .comparing(Patient::getName, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Patient::getFirstname, String.CASE_INSENSITIVE_ORDER);

    @Override
    public String toString() {
        return String.format(
                "Patient{id=%d, name='%s, %s', age=%d, email='%s', ward=%s}",
                getPersonId(),
                getName(),
                getFirstname(),
                getAge(),
                getEmail(),
                getWardId() != null ? "Ward-" + getWardId() : "No Ward");
    }

    // Nur Getter und Setter für das spezifische Ward-Feld
    // (Alle anderen Getter/Setter sind in der Parent-Klasse Person.java)
    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }

}