package com.healthsphere.components;

import java.time.LocalDate;

public class Employee extends Person {
    private static final long serialVersionUID = 3L;

    private String department;
    private Integer wardId; // Ward-Zuweisung für Mitarbeiter/Ärzte

    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, String department) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.department = department;
        this.wardId = null; // Standardmäßig keine Ward zugewiesen
    }

    // Konstruktor mit Ward-ID
    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, String department, Integer wardId) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.department = department;
        this.wardId = wardId;
    }

    // Nur Getter und Setter für Employee-spezifische Felder
    // (Alle anderen Getter/Setter sind in der Parent-Klasse Person.java)
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }
}