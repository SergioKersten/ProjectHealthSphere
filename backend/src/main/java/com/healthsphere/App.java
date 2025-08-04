
/* 
package com.healthsphere;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
*/

package com.healthsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hauptklasse der HealthSphere Spring Boot Anwendung.
 * 
 * Diese Klasse dient als Entry-Point für das gesamte HealthSphere-Backend
 * und konfiguriert die Spring Boot Anwendung mit allen notwendigen
 * Komponenten für das Krankenhaus-Verwaltungssystem.
 * 
 * Konfigurierte Funktionen:
 * - Spring Boot Auto-Configuration für REST-API
 * - Component Scanning für alle Controller und Services
 * - Embedded Tomcat Server für HTTP-Requests
 * - CORS-Konfiguration für Frontend-Integration
 * - JSON-Serialisierung für API-Responses
 * 
 * Systemarchitektur:
 * - Backend: Spring Boot REST-API
 * - Frontend: React-basierte Benutzeroberfläche
 * - Persistierung: Java-Serialisierung über SerializationManager
 * - Datenmanagement: Manager-Pattern mit PersonManager, WardManager, etc.
 * 
 * Startup:
 * - Entwicklung: mvn spring-boot:run
 * - Produktion: java -jar healthsphere-backend.jar
 * - Standard-Port: 8080
 * 
 */
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
