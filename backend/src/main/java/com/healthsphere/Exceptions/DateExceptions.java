package com.healthsphere.Exceptions;

public class DateExceptions {
    /**
     * Exception für ungültige Datums- und Zeitangaben
     */
    public static class InvalidDateTimeException extends HealthSphereException {
        private final String dateTimeField;
        private final Object invalidDateTime;
        private final String validationRule;

        public InvalidDateTimeException(String dateTimeField, Object invalidDateTime,
                String validationRule) {
            super(String.format("Ungültige Datums-/Zeitangabe für '%s': %s. Regel: %s",
                    dateTimeField, invalidDateTime, validationRule),
                    "DATETIME_INVALID_010");
            this.dateTimeField = dateTimeField;
            this.invalidDateTime = invalidDateTime;
            this.validationRule = validationRule;
        }

        public String getDateTimeField() {
            return dateTimeField;
        }

        public Object getInvalidDateTime() {
            return invalidDateTime;
        }

        public String getValidationRule() {
            return validationRule;
        }
    }

}
