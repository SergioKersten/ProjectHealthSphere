package com.healthsphere.Exceptions;

public class PersonExceptions {
    /**
     * Exception für ungültige Personendaten bei der Erstellung oder Aktualisierung
     */
    public static class InvalidPersonDataException extends HealthSphereException {
        private final String fieldName;
        private final Object invalidValue;

        public InvalidPersonDataException(String fieldName, Object invalidValue, String reason) {
            super(String.format("Ungültige Daten für Feld '%s': %s. Grund: %s",
                    fieldName, invalidValue, reason), "PERSON_DATA_001");
            this.fieldName = fieldName;
            this.invalidValue = invalidValue;
        }

        public String getFieldName() {
            return fieldName;
        }

        public Object getInvalidValue() {
            return invalidValue;
        }
    }

    /**
     * Exception für nicht gefundene Personen (Patient/Employee)
     */
    public static class PersonNotFoundException extends HealthSphereException {
        private final long personId;
        private final String personType;

        public PersonNotFoundException(long personId, String personType) {
            super(String.format("%s mit ID %d wurde nicht gefunden", personType, personId),
                    "PERSON_NOT_FOUND_002");
            this.personId = personId;
            this.personType = personType;
        }

        public long getPersonId() {
            return personId;
        }

        public String getPersonType() {
            return personType;
        }
    }

    /**
     * Exception für doppelte Person-IDs
     */
    public static class DuplicatePersonException extends HealthSphereException {
        private final long duplicateId;

        public DuplicatePersonException(long duplicateId) {
            super(String.format("Person mit ID %d existiert bereits im System", duplicateId),
                    "PERSON_DUPLICATE_003");
            this.duplicateId = duplicateId;
        }

        public long getDuplicateId() {
            return duplicateId;
        }
    }
}
