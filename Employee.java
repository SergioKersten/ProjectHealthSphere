import java.time.LocalDate;

class Employee extends Person {
    private static final long serialVersionUID = 3L;
    
    String department;

    public Employee(long personId, String name, String firstname, String phonenumber, String email,
            LocalDate birthdate, String adress, String department) {
        super(personId, name, firstname, phonenumber, email, birthdate, adress);
        this.department = department;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}