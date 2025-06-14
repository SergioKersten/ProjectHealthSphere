import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class WardManager {
    private Set<Ward> wardSet = new HashSet<>();

    // Add a new ward
    public boolean addWard(Ward ward) {
        return wardSet.add(ward); // returns false if Ward with same ID already exists
    }

    // Remove a ward by ID
    public boolean deleteWard(int wardId) {
        return wardSet.removeIf(w -> w.getWardId() == wardId);
    }

    // Find a ward by ID
    public Ward findById(int wardId) {
        for (Ward ward : wardSet) {
            if (ward.getWardId() == wardId) {
                return ward;
            }
        }
        return null;
    }

    // Return all wards
    public Set<Ward> getAll() {
        return wardSet;
    }

    // Filter wards by given predicate (e.g. capacity, name, etc.)
    public Set<Ward> filter(Predicate<Ward> criteria) {
        return wardSet.stream()
                .filter(criteria)
                .collect(Collectors.toSet());
    }

    // Update ward info by ID
    public boolean updateWard(int wardId, String newName, String newDescription, Integer newCapacity) {
        Ward ward = findById(wardId);
        if (ward != null) {
            if (newName != null)
                ward.setWardName(newName);
            if (newDescription != null)
                ward.setDescription(newDescription);
            if (newCapacity != null)
                ward.setCapacity(newCapacity);
            return true;
        }
        return false;
    }
}
