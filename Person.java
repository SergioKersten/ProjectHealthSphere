import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    
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

    public void setName(String name) {
        this.name = name;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public void setEmail(String email) {
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