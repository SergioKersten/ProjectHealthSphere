package com.healthsphere.components;

import java.time.LocalDate;
import java.util.Comparator;

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

    /**
     * Employee-spezifische Sortierung:
     * 1. Primär: Nach Abteilung (alphabetisch, keine Hierarchie)
     * 2. Sekundär: Nach Ward-ID (falls vorhanden)
     * 3. Tertiär: Nach Person-Sortierung (Name, Vorname, Alter, ID)
     */
    @Override
    public int compareTo(Person other) {
        if (!(other instanceof Employee)) {
            return super.compareTo(other);
        }

        Employee otherEmployee = (Employee) other;

        // 1. Primär nach Abteilung (alphabetisch, alle gleichwertig)
        int deptComparison = this.department.compareToIgnoreCase(otherEmployee.department);
        if (deptComparison != 0) {
            return deptComparison;
        }

        // 2. Sekundär nach Ward-ID
        if (this.wardId != null && otherEmployee.wardId != null) {
            int wardComparison = this.wardId.compareTo(otherEmployee.wardId);
            if (wardComparison != 0) {
                return wardComparison;
            }
        } else if (this.wardId == null && otherEmployee.wardId != null) {
            return 1; // this kommt nach other
        } else if (this.wardId != null && otherEmployee.wardId == null) {
            return -1; // this kommt vor other
        }

        // 3. Tertiär nach Person-Sortierung
        return super.compareTo(other);
    }

    // Zusätzliche Comparatoren
    public static final Comparator<Employee> BY_DEPARTMENT_ONLY = Comparator
            .comparing(Employee::getDepartment, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Employee::getName, String.CASE_INSENSITIVE_ORDER);

    public static final Comparator<Employee> BY_WARD_THEN_DEPARTMENT = Comparator
            .comparing(Employee::getWardId, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(Employee::getDepartment, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Employee::getName, String.CASE_INSENSITIVE_ORDER);

    @Override
    public String toString() {
        return String.format(
                "Employee{id=%d, name='%s, %s', dept='%s', age=%d, email='%s', ward=%s}",
                getPersonId(),
                getName(),
                getFirstname(),
                getDepartment(),
                getAge(),
                getEmail(),
                getWardId() != null ? "Ward-" + getWardId() : "No Ward");
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