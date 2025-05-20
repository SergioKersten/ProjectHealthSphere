import java.time.LocalDate;

public class PatientList {
    private Patient[] ListOfPatients;
    private int max = 200;
    private int anzahl;

    public PatientList() {
        ListOfPatients = new Patient[max];
    };

    public boolean addPatient(long personId, String name, String firstname, String phoneNumber, String email,
            LocalDate birthDate, String adress) {
        if (anzahl >= max) {
            return false;
        }
        ListOfPatients[anzahl] = new Patient(personId, name, firstname, phoneNumber, email, birthDate, adress);
        anzahl++;
        return true;
    };

    public boolean deletPatient(long personId) {
        j  = 
        i = (ListOfPatients.findIndex(per))
        for(int i = )
        return false;
    };

}
