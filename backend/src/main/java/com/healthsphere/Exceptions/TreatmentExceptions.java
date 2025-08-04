package com.healthsphere.Exceptions;

public class TreatmentExceptions {
    /**
     * Exception für ungültige Behandlungsdaten
     */
    public static class InvalidTreatmentDataException extends HealthSphereException {
        private final String violationType;
        private final String details;

        public InvalidTreatmentDataException(String violationType, String details) {
            super(String.format("Ungültige Behandlungsdaten - %s: %s", violationType, details),
                    "TREATMENT_DATA_007");
            this.violationType = violationType;
            this.details = details;
        }

        public String getViolationType() {
            return violationType;
        }

        public String getDetails() {
            return details;
        }
    }

    /**
     * Exception für zeitliche Konflikte bei Behandlungen
     */
    public static class TreatmentTimeConflictException extends HealthSphereException {
        private final long doctorId;
        private final String conflictingTimeSlot;
        private final long existingTreatmentId;

        public TreatmentTimeConflictException(long doctorId, String conflictingTimeSlot,
                long existingTreatmentId) {
            super(String.format("Zeitkonflikt: Arzt %d ist bereits im Zeitraum %s " +
                    "für Behandlung %d eingeplant", doctorId, conflictingTimeSlot, existingTreatmentId),
                    "TREATMENT_CONFLICT_008");
            this.doctorId = doctorId;
            this.conflictingTimeSlot = conflictingTimeSlot;
            this.existingTreatmentId = existingTreatmentId;
        }

        public long getDoctorId() {
            return doctorId;
        }

        public String getConflictingTimeSlot() {
            return conflictingTimeSlot;
        }

        public long getExistingTreatmentId() {
            return existingTreatmentId;
        }
    }

    /**
     * Exception für nicht gefundene Behandlungen
     */
    public static class TreatmentNotFoundException extends HealthSphereException {
        private final long treatmentId;

        public TreatmentNotFoundException(long treatmentId) {
            super(String.format("Behandlung mit ID %d wurde nicht gefunden", treatmentId),
                    "TREATMENT_NOT_FOUND_009");
            this.treatmentId = treatmentId;
        }

        public long getTreatmentId() {
            return treatmentId;
        }
    }

}
