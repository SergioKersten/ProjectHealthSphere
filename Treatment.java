import java.time.LocalDate;

public class Treatment {
    private int treatmentId;
    private LocalDate date;
    private String therapy;
    private Patient patient;
    private Employee doctor;

    public Treatment(int treatmentId, LocalDate date, String therapy, Patient patient, Employee doctor) {
        this.treatmentId = treatmentId;
        this.date = date;
        this.therapy = therapy;
        this.patient = patient;
        this.doctor = doctor;
    }

    public void getTreatmentDetails() {
        System.out.println("Behandlung ID: " + treatmentId);
        System.out.println("Datum: " + date);
        System.out.println("Therapie: " + therapy);
        System.out.println("Patient: " + patient.getFirstname() + " " + patient.getName());
        System.out.println("Behandelnder Arzt: " + doctor.getFirstname() + " " + doctor.getName());
    }

    public int getTreatmentId() {
        return treatmentId;
    }

    /*
     * ------ brauchen wir eig gar nicht, wenn wir noch eine Verwaltungsklasse
     * hinzufügen?!
     * public void setTreatmentId(int treatmentId) {
     * this.treatmentId = treatmentId;
     * }
     */

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTherapy() {
        return therapy;
    }

    public void setTherapy(String therapy) {
        this.therapy = therapy;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Employee getDoctor() {
        return doctor;
    }

    public void setDoctor(Employee doctor) {
        this.doctor = doctor;
    }
}
