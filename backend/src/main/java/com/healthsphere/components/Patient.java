package com.healthsphere.components;

import java.time.LocalDate;

public class Patient extends Person {
    private static final long serialVersionUID = 2L;

    public Patient(long personId, String name, String firstname, String phonenumber, String email, LocalDate birthdate,
            String adress) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
    }
}