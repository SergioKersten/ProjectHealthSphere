package com.healthsphere.components;

import java.time.LocalDate;
import java.util.Comparator;

import com.healthsphere.Exceptions.DateExceptions.InvalidDateTimeException;
import com.healthsphere.Exceptions.PersonExceptions.InvalidPersonDataException;

public class Patient extends Person {
    private static final long serialVersionUID = 2L;

    private Integer wardId; // Ward-Zuweisung für Patienten

    // Konstruktor ohne Ward
    public Patient(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress)
            throws InvalidPersonDataException, InvalidDateTimeException {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.wardId = null;
    }

    // Konstruktor mit Ward
    public Patient(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, Integer wardId)
            throws InvalidPersonDataException, InvalidDateTimeException {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.wardId = wardId;
    }

    /**
     * TEST-KONSTRUKTOR: Fängt Exceptions ab für normale Tests
     * Nur für Testzwecke - im echten Code Manager-Methoden verwenden!
     */
    public static Patient createForTest(long personId, String name, String firstname,
            String phonenumber, String email, LocalDate birthdate,
            String address, Integer wardId) {
        try {
            return new Patient(personId, name, firstname, phonenumber, email, birthdate, address, wardId);
        } catch (Exception e) {
            System.err.println("TEST-WARNUNG: " + e.getMessage());
            // Erstelle "sicheren" Patient mit Minimal-Daten
            try {
                return new Patient(personId, "TestName", "TestFirst", "000",
                        "test@test.de", LocalDate.of(1990, 1, 1), "TestAddr", wardId);
            } catch (Exception e2) {
                throw new RuntimeException("Kritischer Fehler bei Test-Patient-Erstellung", e2);
            }
        }
    }

    public static Patient createForTest(long personId, String name, String firstname,
            String phonenumber, String email, LocalDate birthdate,
            String address) {
        return createForTest(personId, name, firstname, phonenumber, email, birthdate, address, null);
    }

    /**
     * Patient-spezifische Sortierung:
     * 1. Primär: Nach Ward-ID (null = zuletzt)
     * 2. Sekundär: Nach Person-Sortierung
     */
    @Override
    public int compareTo(Person other) {
        if (!(other instanceof Patient)) {
            return super.compareTo(other);
        }

        Patient otherPatient = (Patient) other;

        if (this.wardId == null && otherPatient.wardId == null) {
            return super.compareTo(other);
        }
        if (this.wardId == null)
            return 1;
        if (otherPatient.wardId == null)
            return -1;

        int wardComparison = this.wardId.compareTo(otherPatient.wardId);
        if (wardComparison != 0)
            return wardComparison;

        return super.compareTo(other);
    }

    // Comparatoren
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

    // Getter & Setter für wardId
    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }
}
