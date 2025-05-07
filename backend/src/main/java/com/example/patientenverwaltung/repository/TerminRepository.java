package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Termin;
import com.example.patientenverwaltung.model.Arzt;
import com.example.patientenverwaltung.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface TerminRepository extends JpaRepository<Termin, Integer> {
    List<Termin> findByDatum(Date datum);
    List<Termin> findByArztAndDatum(Arzt arzt, Date datum);
    List<Termin> findByPatient(Patient patient);
    boolean existsByArztAndDatumAndUhrzeit(Arzt arzt, Date datum, Time uhrzeit);
}

