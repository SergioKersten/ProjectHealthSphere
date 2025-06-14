import java.util.*;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class TreatmentManager {
    private Set<Treatment> treatmentSet = new HashSet<>();

    public boolean addTreatment(Treatment treatment) {
        return treatmentSet.add(treatment); // false if already exists (same ID)
    }

    public boolean deleteTreatment(long treatmentId) {
        return treatmentSet.removeIf(t -> t.getTreatmentId() == treatmentId);
    }

    public Treatment findById(long treatmentId) {
        for (Treatment t : treatmentSet) {
            if (t.getTreatmentId() == treatmentId)
                return t;
        }
        return null;
    }

    public Set<Treatment> getAll() {
        return treatmentSet;
    }

    public Set<Treatment> filter(Predicate<Treatment> criteria) {
        return treatmentSet.stream()
                .filter(criteria)
                .collect(Collectors.toSet());
    }

    public boolean updateTherapy(long treatmentId, String newTherapy) {
        Treatment t = findById(treatmentId);
        if (t != null) {
            t.setTherapy(newTherapy);
            return true;
        }
        return false;
    }
}