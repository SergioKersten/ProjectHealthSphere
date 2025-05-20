import java.time.LocalDate;

class Employee extends Person {
    String fachbereich;

    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate,
            String adress) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
    }
}