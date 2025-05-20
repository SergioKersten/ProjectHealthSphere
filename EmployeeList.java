import java.time.LocalDate;

public class EmployeeList {
    private Employee[] ListOfEmployees;
    private int max = 500;
    private int anzahl;

    public EmployeeList() {
        ListOfEmployees = new Employee[max];
    };

    public boolean addEmployee(long personId, String name, String firstname, String phoneNumber, String email,
            LocalDate birthDate, String adress) {
        if (anzahl >= max) {
            return false;
        }
        ListOfEmployees[anzahl] = new Employee(personId, name, firstname, phoneNumber, email, birthDate, adress);
        return false;
    };

}
