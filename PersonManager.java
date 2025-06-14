import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class PersonManager<T extends Person> {
    private Set<T> personenSet = new HashSet<>();

    public boolean addPerson(T person) {
        return personenSet.add(person); // false wenn ID bereits vorhanden
    }

    public boolean deletePerson(long personId) {
        return personenSet.removeIf(p -> p.getPersonId() == personId);
    }

    public T findById(long personId) {
        for (T person : personenSet) {
            if (person.getPersonId() == personId) {
                return person;
            }
        }
        return null;
    }

    public Set<T> getAll() {
        return personenSet;
    }

    public boolean updatePerson(long personId, String newName, String newFirstname,
            String newPhone, String newEmail, String newAdress) {
        T person = findById(personId);
        if (person != null) {
            if (newName != null)
                person.setName(newName);
            if (newFirstname != null)
                person.setFirstname(newFirstname);
            if (newPhone != null)
                person.setPhonenumber(newPhone);
            if (newEmail != null)
                person.setEmail(newEmail);
            if (newAdress != null)
                person.setAdress(newAdress);
            return true;
        }
        return false;
    }

    public boolean updateEmployeeDepartment(long personId, String newDepartment) {
        T person = findById(personId);
        if (person instanceof Employee) {
            ((Employee) person).setDepartment(newDepartment);
            return true;
        }
        return false;
    }

    public Set<T> filter(Predicate<T> criteria) {
        return personenSet.stream()
                .filter(criteria)
                .collect(Collectors.toSet());
    }
}