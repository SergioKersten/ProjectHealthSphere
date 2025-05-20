import java.time.LocalDate;

class Person {
    static long personId;
    String name;
    String firstname;
    String phonenumber;
    String email;
    String adress;
    LocalDate birthdate;

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
