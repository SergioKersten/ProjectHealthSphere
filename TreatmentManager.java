import java.util.*;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class TreatmentManager {
    private Set<Treatment> treatmentSet = new HashSet<>();
    private String filename; // Dateiname für automatisches Speichern
    private boolean autoSaveEnabled = true;

    // Konstruktor ohne Auto-Save
    public TreatmentManager() {
    }
    
    // Konstruktor mit Auto-Save
    public TreatmentManager(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
        load(); // Automatisch laden beim Start
    }
    
    // Auto-Save nachträglich aktivieren
    public void enableAutoSave(String filename) {
        this.filename = filename;
        this.autoSaveEnabled = true;
    }
    
    public void disableAutoSave() {
        this.autoSaveEnabled = false;
    }

    private void autoSave() {
        if (autoSaveEnabled && filename != null) {
            SerializationManager.saveToFile(treatmentSet, filename);
        }
    }

    public boolean addTreatment(Treatment treatment) {
        boolean result = treatmentSet.add(treatment);
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
    }

    public boolean deleteTreatment(long treatmentId) {
        boolean result = treatmentSet.removeIf(t -> t.getTreatmentId() == treatmentId);
        if (result) {
            autoSave(); // Speichern nur bei erfolgreicher Änderung
        }
        return result;
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
            autoSave(); // Speichern nach Update
            return true;
        }
        return false;
    }

    public boolean updateTreatment(long treatmentId, String newTherapy, long newPatientId, long newDoctorId) {
        Treatment treatment = findById(treatmentId);
        if (treatment != null) {
            if (newTherapy != null)
                treatment.setTherapy(newTherapy);
            if (newPatientId > 0)
                treatment.setPatientPersonId(newPatientId);
            if (newDoctorId > 0)
                treatment.setDoctorPersonId(newDoctorId);
            
            autoSave(); // Speichern nach Update
            return true;
        }
        return false;
    }
    
    // Manuelles Speichern
    public void save() {
        if (filename != null) {
            SerializationManager.saveToFile(treatmentSet, filename);
        }
    }
    
    // Laden von Datei
    public void load() {
        if (filename != null && SerializationManager.fileExists(filename)) {
            Set<Treatment> loadedData = SerializationManager.loadFromFile(filename);
            if (loadedData != null) {
                treatmentSet = loadedData;
            }
        }
    }
}