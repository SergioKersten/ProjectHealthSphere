import java.time.LocalDate;

public class Patient extends Person {
    public Patient(long personId, String name, String firstname, String phonenumber, String email, LocalDate birthdate,
            String adress) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
    }

    public long getPersonId() {
        return super.getPersonId();
    }

    public String getFirstname() {
        return firstname;
    }

    public String getName() {
        return name;
    }
}
