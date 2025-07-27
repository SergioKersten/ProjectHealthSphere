package com.healthsphere.components;

import java.time.LocalDate;

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

    // Nur Getter und Setter für das spezifische Ward-Feld
    // (Alle anderen Getter/Setter sind in der Parent-Klasse Person.java)
    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }
}