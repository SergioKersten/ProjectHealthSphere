package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByNameAndVorname(String name, String vorname);
    
    // PostgreSQL-Syntax für LIKE mit String-Concatenation
    @Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER('%' || :suchbegriff || '%') OR LOWER(p.vorname) LIKE LOWER('%' || :suchbegriff || '%')")
    List<Patient> suchePatienten(String suchbegriff);
}

