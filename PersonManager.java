import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
}