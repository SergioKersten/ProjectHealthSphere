import java.time.LocalDate;

class Employee extends Person {
    String department;

    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate,
            String adress, String department) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.department = department;
    }

    public long getPersonId() {
     return super.getPersonId();
    }

}