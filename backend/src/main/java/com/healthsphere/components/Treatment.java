package com.healthsphere.components;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Objects;

import com.healthsphere.manager.PersonManager;

/**
 * Repräsentiert eine medizinische Behandlung im HealthSphere-System.
 * 
 * Die Treatment-Klasse verknüpft Patienten mit behandelnden Ärzten
 * und dokumentiert medizinische Maßnahmen mit Datum und Therapiebeschreibung.
 * 
 * Kernfunktionalitäten:
 * 
 * Verknüpfung von Patient und behandelndem Arzt über IDs
 * Dokumentation von Behandlungsdatum und Therapiemaßnahmen
 * Eindeutige Identifikation für Nachverfolgung und Abrechnung
 * Vergleichsoperationen für chronologische Sortierung
 * 
 * 
 * Sortierung:
 * 
 * Primär: Behandlungsdatum (neueste zuerst)
 * Sekundär: Behandlungs-ID (bei gleichem Datum)
 * 
 * 
 * Attribute:
 * 
 * treatmentId - Eindeutige Behandlungs-ID
 * date - Behandlungsdatum
 * therapy - Beschreibung der durchgeführten Therapie
 * patientPersonId - Referenz auf behandelten Patienten
 * doctorPersonId - Referenz auf behandelnden Arzt
 * 
 */

public class Treatment implements Serializable, Comparable<Treatment> {
    private static final long serialVersionUID = 4L;

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

    /**
     * Treatment-Sortierung:
     * 1. Primär: Nach Datum (neueste zuerst)
     * 2. Sekundär: Nach Behandlungsart (alphabetisch)
     * 3. Tertiär: Nach Treatment-ID
     */
    @Override
    public int compareTo(Treatment other) {
        if (other == null)
            return 1;

        // 1. Primär nach Datum (neueste zuerst)
        int dateComparison = other.date.compareTo(this.date);
        if (dateComparison != 0) {
            return dateComparison;
        }

        // 2. Sekundär nach Behandlungsart (alphabetisch)
        int therapyComparison = this.therapy.compareToIgnoreCase(other.therapy);
        if (therapyComparison != 0) {
            return therapyComparison;
        }

        // 3. Tertiär nach Treatment ID (bei gleichem Datum und Therapie)
        return Integer.compare(this.treatmentId, other.treatmentId);
    }

    // Zusätzliche Comparatoren für verschiedene Sortierungen
    public static final Comparator<Treatment> BY_DATE_DESC = Comparator
            .comparing(Treatment::getDate, Comparator.reverseOrder())
            .thenComparing(Treatment::getTreatmentId);

    public static final Comparator<Treatment> BY_DATE_ASC = Comparator
            .comparing(Treatment::getDate)
            .thenComparing(Treatment::getTreatmentId);

    public static final Comparator<Treatment> BY_THERAPY_TYPE = Comparator
            .comparing(Treatment::getTherapy, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Treatment::getDate, Comparator.reverseOrder());

    public static final Comparator<Treatment> BY_PATIENT_THEN_DATE = Comparator
            .comparing(Treatment::getPatientPersonId)
            .thenComparing(Treatment::getDate, Comparator.reverseOrder());

    @Override
    public String toString() {
        return String.format(
                "Treatment{id=%d, date=%s, therapy='%s', patient=%d, doctor=%d}",
                treatmentId,
                date,
                therapy,
                patientPersonId,
                doctorPersonId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Treatment))
            return false;
        Treatment treatment = (Treatment) o;
        return treatmentId == treatment.treatmentId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(treatmentId);
    }

    public int getTreatmentId() {
        return treatmentId;
    }

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