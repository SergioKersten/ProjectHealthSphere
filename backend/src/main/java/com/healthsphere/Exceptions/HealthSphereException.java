package com.healthsphere.Exceptions;

/**
 * Basisklasse für alle HealthSphere-spezifischen Exceptions.
 * Bietet gemeinsame Funktionalität für alle fachlichen Ausnahmen.
 */
public abstract class HealthSphereException extends Exception {
    private final String errorCode;
    private final long timestamp;

    /**
     * Konstruktor für HealthSphere-Exceptions
     * 
     * @param message   Fehlermeldung
     * @param errorCode Eindeutiger Fehlercode
     */
    public HealthSphereException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * Konstruktor mit Ursache
     * 
     * @param message   Fehlermeldung
     * @param errorCode Eindeutiger Fehlercode
     * @param cause     Ursprüngliche Exception
     */
    public HealthSphereException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.timestamp = System.currentTimeMillis();
    }

    public String getErrorCode() {
        return errorCode;
    }

    public long getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s (Code: %s, Zeit: %d)",
                getClass().getSimpleName(), getMessage(), errorCode, timestamp);
    }
}
