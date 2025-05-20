import java.time.LocalDate;

class Person {
     private long personId;
    protected String name;
    protected String firstname;
    protected String phonenumber;
    protected String email;
    protected String adress;
    protected LocalDate birthdate;

    public Person(long personId, String name, String firstname, String phonenumber, String email, LocalDate brithdate,
            String adress) {
        this.personId = personId;
        this.name = name;
        this.firstname = firstname;
        this.phonenumber = phonenumber;
        this.email = email;
        this.birthdate = birthdate;
        this.adress = adress;
    }
}
