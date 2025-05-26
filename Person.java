import java.time.LocalDate;
import java.util.*;

class Person {
    private long personId;
    protected String name;
    protected String firstname;
    protected String phonenumber;
    protected String email;
    protected String adress;
    protected LocalDate birthdate;

    public Person(long personId, String name, String firstname, String phonenumber, String email, LocalDate birthdate,
            String adress) {
        this.personId = personId;
        this.name = name;
        this.firstname = firstname;
        this.phonenumber = phonenumber;
        this.email = email;
        this.birthdate = birthdate;
        this.adress = adress;
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

    public long getPersonId() {
        return personId;
    }
}
