package com.healthsphere.components;

import java.time.LocalDate;
import java.util.Comparator;

import com.healthsphere.Exceptions.DateExceptions.InvalidDateTimeException;
import com.healthsphere.Exceptions.PersonExceptions.InvalidPersonDataException;

public class Employee extends Person {
    private static final long serialVersionUID = 3L;

    private String department;
    private Integer wardId; // Ward-Zuweisung für Mitarbeiter/Ärzte

    // Konstruktor ohne Ward-Zuweisung
    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, String department)
            throws InvalidPersonDataException, InvalidDateTimeException {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        validateEmployeeData(department);
        this.department = department;
        this.wardId = null;
    }

    // Konstruktor mit Ward-Zuweisung
    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, String department, Integer wardId)
            throws InvalidPersonDataException, InvalidDateTimeException {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        validateEmployeeData(department);
        this.department = department;
        this.wardId = wardId;
    }

    /**
     * Validierung der Employee-spezifischen Felder
     */
    private void validateEmployeeData(String department) throws InvalidPersonDataException {
        if (department == null || department.trim().isEmpty()) {
            throw new InvalidPersonDataException("department", department, "Abteilung darf nicht leer sein");
        }
        if (department.length() > 100) {
            throw new InvalidPersonDataException("department", department, "Abteilung darf max. 100 Zeichen lang sein");
        }
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

        int deptComparison = this.department.compareToIgnoreCase(otherEmployee.department);
        if (deptComparison != 0) {
            return deptComparison;
        }

        if (this.wardId != null && otherEmployee.wardId != null) {
            int wardComparison = this.wardId.compareTo(otherEmployee.wardId);
            if (wardComparison != 0) {
                return wardComparison;
            }
        } else if (this.wardId == null && otherEmployee.wardId != null) {
            return 1;
        } else if (this.wardId != null && otherEmployee.wardId == null) {
            return -1;
        }

        return super.compareTo(other);
    }

    // Comparatoren
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

    // Getter und Setter
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) throws InvalidPersonDataException {
        validateEmployeeData(department);
        this.department = department;
    }

    public Integer getWardId() {
        return wardId;
    }

    public void setWardId(Integer wardId) {
        this.wardId = wardId;
    }
}
