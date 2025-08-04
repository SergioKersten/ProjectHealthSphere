package com.healthsphere.components;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Period;
import java.util.Objects;

import com.healthsphere.Exceptions.DateExceptions.InvalidDateTimeException;
import com.healthsphere.Exceptions.PersonExceptions.InvalidPersonDataException;

public class Person implements Serializable, Comparable<Person> {
    private static final long serialVersionUID = 1L;

    private long personId;
    protected String name;
    protected String firstname;
    protected String phonenumber;
    protected String email;
    protected String adress;
    protected LocalDate birthdate;

    // Konstruktor mit Validierung
    public Person(long personId, String name, String firstname, String phonenumber,
            String email, LocalDate birthdate, String address)
            throws InvalidPersonDataException, InvalidDateTimeException {

        validatePersonData(personId, name, firstname, phonenumber, email, birthdate, address);

        this.personId = personId;
        this.name = name;
        this.firstname = firstname;
        this.phonenumber = phonenumber;
        this.email = email;
        this.birthdate = birthdate;
        this.adress = address;
    }

    /**
     * Validiert Personendaten und wirft entsprechende Exceptions
     */
    private void validatePersonData(long personId, String name, String firstname,
            String phonenumber, String email, LocalDate birthdate,
            String address)
            throws InvalidPersonDataException, InvalidDateTimeException {

        // Person-ID Validierung
        if (personId <= 0) {
            throw new InvalidPersonDataException("personId", personId,
                    "Person-ID muss größer als 0 sein");
        }

        // Name Validierung
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidPersonDataException("name", name,
                    "Name darf nicht leer sein");
        }
        if (name.length() > 50) {
            throw new InvalidPersonDataException("name", name,
                    "Name darf maximal 50 Zeichen lang sein");
        }

        // Vorname Validierung
        if (firstname == null || firstname.trim().isEmpty()) {
            throw new InvalidPersonDataException("firstname", firstname,
                    "Vorname darf nicht leer sein");
        }

        // Email Validierung (einfach)
        if (email != null && !email.contains("@")) {
            throw new InvalidPersonDataException("email", email,
                    "Ungültiges E-Mail-Format");
        }

        // Geburtsdatum Validierung
        if (birthdate == null) {
            throw new InvalidDateTimeException("birthdate", null,
                    "Geburtsdatum darf nicht null sein");
        }
        if (birthdate.isAfter(LocalDate.now())) {
            throw new InvalidDateTimeException("birthdate", birthdate,
                    "Geburtsdatum darf nicht in der Zukunft liegen");
        }
        if (birthdate.isBefore(LocalDate.of(1900, 1, 1))) {
            throw new InvalidDateTimeException("birthdate", birthdate,
                    "Geburtsdatum vor 1900 nicht erlaubt");
        }
    }

    @Override
    public int compareTo(Person other) {
        if (other == null)
            return 1;

        // 1. Primär nach Nachname
        int nameComparison = this.name.compareToIgnoreCase(other.name);
        if (nameComparison != 0) {
            return nameComparison;
        }

        // 2. Sekundär nach Vorname
        int firstnameComparison = this.firstname.compareToIgnoreCase(other.firstname);
        if (firstnameComparison != 0) {
            return firstnameComparison;
        }

        // 3. Tertiär nach Alter (jüngste zuerst)
        int thisAge = Period.between(this.birthdate, LocalDate.now()).getYears();
        int otherAge = Period.between(other.birthdate, LocalDate.now()).getYears();
        int ageComparison = Integer.compare(thisAge, otherAge);
        if (ageComparison != 0) {
            return ageComparison;
        }

        // 4. Quaternär nach PersonId (für eindeutige Sortierung)
        return Long.compare(this.personId, other.personId);
    }

    /**
     * Hilfsmethode: Berechnet das Alter der Person
     */
    public int getAge() {
        return Period.between(this.birthdate, LocalDate.now()).getYears();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Person))
            return false;
        Person person = (Person) o;
        return personId == person.personId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(personId);
    }

    @Override
    public String toString() {
        return String.format("Person{personId=%d, name='%s', firstname='%s', age=%d, email='%s'}",
                personId, name, firstname, getAge(), email);
    }

    public long getPersonId() {
        return personId;
    }

    // Setter mit Validierung
    public void setName(String name) throws InvalidPersonDataException {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidPersonDataException("name", name, "Name darf nicht leer sein");
        }
        if (name.length() > 50) {
            throw new InvalidPersonDataException("name", name,
                    "Name darf maximal 50 Zeichen lang sein");
        }
        this.name = name;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public void setEmail(String email) throws InvalidPersonDataException {
        if (email != null && !email.contains("@")) {
            throw new InvalidPersonDataException("email", email, "Ungültiges E-Mail-Format");
        }
        this.email = email;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getName() {
        return name;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public String getEmail() {
        return email;
    }

    public String getAdress() {
        return adress;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }
}