import java.time.*;

public class Main {
    public static void main(String[] args) {
        PersonManager<Patient> patientenManager = new PersonManager<>();
        PersonManager<Employee> employeeManager = new PersonManager<>();

        Patient p1 = new Patient(1, "Meier", "Anna", "0123", "a@web.de", LocalDate.of(1990, 1, 1), "Musterstraße 5");
        Patient p2 = new Patient(2, "Schulz", "Ben", "0456", "b@web.de", LocalDate.of(1985, 6, 15), "Beispielweg 3");

        Employee e1 = new Employee(1, "Musterfrau", "Milena", "0123456", "m@web.de", LocalDate.of(1990, 1, 1),
                "Musterstraße 6", "Urologie");
        Employee e2 = new Employee(2, "Schulze", "Benjamin", "0454534536", "be@web.de", LocalDate.of(1985, 6, 15),
                "Beispielweg 4", "Onkologie");

        patientenManager.addPerson(p1);
        patientenManager.addPerson(p2);

        employeeManager.addPerson(e1);
        employeeManager.addPerson(e2);

        patientenManager.deletePerson(1); // entfernt Anna

        Patient gefunden1 = patientenManager.findById(2);
        if (gefunden1 != null) {
            System.out.println("Gefunden: " + gefunden1.getFirstname() + " " + gefunden1.getName());
        }

        Patient gefunden2 = patientenManager.findById(1);
        if (gefunden2 != null) {
            System.out.println("Gefunden: " + gefunden2.getFirstname() + " " + gefunden2.getName());
        }

        Employee gefunden3 = employeeManager.findById(1);
        if (gefunden3 != null) {
            System.out.println("Gefunden: " + gefunden3.getFirstname() + " " + gefunden3.getName());
        }
    }
}