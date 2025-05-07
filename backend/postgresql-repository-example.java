package com.krankenhaus.patientenverwaltung.repository;

import com.krankenhaus.patientenverwaltung.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByNameAndVorname(String name, String vorname);
    
    // MSSQL-Syntax: LIKE LOWER(CONCAT('%', :suchbegriff, '%'))
    // PostgreSQL-Syntax: LIKE LOWER('%' || :suchbegriff || '%')
    @Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER('%' || :suchbegriff || '%') OR LOWER(p.vorname) LIKE LOWER('%' || :suchbegriff || '%')")
    List<Patient> suchePatienten(String suchbegriff);
}
