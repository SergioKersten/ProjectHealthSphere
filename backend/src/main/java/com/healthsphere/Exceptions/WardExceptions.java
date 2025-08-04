package com.healthsphere.Exceptions;

public class WardExceptions {
    /**
     * Exception für Kapazitätsüberschreitungen in Stationen
     */
    public static class WardCapacityExceededException extends HealthSphereException {
        private final int wardId;
        private final int currentCapacity;
        private final int maxCapacity;
        private final int requestedAddition;

        public WardCapacityExceededException(int wardId, int currentCapacity,
                int maxCapacity, int requestedAddition) {
            super(String.format("Kapazität von Station %d überschritten: %d/%d Plätze belegt, " +
                    "%d weitere angefragt", wardId, currentCapacity, maxCapacity, requestedAddition),
                    "WARD_CAPACITY_004");
            this.wardId = wardId;
            this.currentCapacity = currentCapacity;
            this.maxCapacity = maxCapacity;
            this.requestedAddition = requestedAddition;
        }

        public int getWardId() {
            return wardId;
        }

        public int getCurrentCapacity() {
            return currentCapacity;
        }

        public int getMaxCapacity() {
            return maxCapacity;
        }

        public int getRequestedAddition() {
            return requestedAddition;
        }
    }

    /**
     * Exception für nicht existierende Stationen
     */
    public static class WardNotFoundException extends HealthSphereException {
        private final int wardId;

        public WardNotFoundException(int wardId) {
            super(String.format("Station mit ID %d wurde nicht gefunden", wardId),
                    "WARD_NOT_FOUND_005");
            this.wardId = wardId;
        }

        public int getWardId() {
            return wardId;
        }
    }

    /**
     * Exception für ungültige Ward-Daten
     */
    public static class InvalidWardDataException extends HealthSphereException {
        private final String parameter;
        private final Object value;

        public InvalidWardDataException(String parameter, Object value, String reason) {
            super(String.format("Ungültiger Ward-Parameter '%s' mit Wert '%s': %s",
                    parameter, value, reason), "WARD_DATA_006");
            this.parameter = parameter;
            this.value = value;
        }

        public String getParameter() {
            return parameter;
        }

        public Object getValue() {
            return value;
        }
    }

}
