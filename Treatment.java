import java.time.LocalDate;

public class Treatment {
    private int treatmentId;
    private LocalDate date;
    private String therapy;
    private long patientPersonId;
    private long doctorPersonId;

    public Treatment(int treatmentId, LocalDate date, String therapy, long patientPersonId, long doctorPersonId) {
        this.treatmentId = treatmentId;
        this.date = date;
        this.therapy = therapy;
        this.patientPersonId = patientPersonId;
        this.doctorPersonId = doctorPersonId;
    }

    public void printTreatmentDetails(PersonManager<Patient> patientManager, PersonManager<Employee> employeeManager) {
        Patient patient = patientManager.findById(patientPersonId);
        Employee doctor = employeeManager.findById(doctorPersonId);

        System.out.println("Treatment ID: " + treatmentId);
        System.out.println("Date: " + date);
        System.out.println("Therapy: " + therapy);

        if (patient != null) {
            System.out.println("Patient: " + patient.getFirstname() + " " + patient.getName());
        } else {
            System.out.println("Patient: Not found (ID = " + patientPersonId + ")");
        }

        if (doctor != null) {
            System.out.println("Doctor: " + doctor.getFirstname() + " " + doctor.getName());
        } else {
            System.out.println("Doctor: Not found (ID = " + doctorPersonId + ")");
        }
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

    public long getPatientPersonId() {
        return patientPersonId;
    }

    public void setPatientPersonId(long patientPersonId) {
        this.patientPersonId = patientPersonId;
    }

    public long getDoctorPersonId() {
        return doctorPersonId;
    }

    public void setDoctorPersonId(long doctorPersonId) {
        this.doctorPersonId = doctorPersonId;
    }
}
