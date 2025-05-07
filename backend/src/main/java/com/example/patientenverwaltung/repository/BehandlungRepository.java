package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Behandlung;
import com.example.patientenverwaltung.model.Patient;
import com.example.patientenverwaltung.model.Arzt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BehandlungRepository extends JpaRepository<Behandlung, Integer> {
    List<Behandlung> findByPatient(Patient patient);
    List<Behandlung> findByBehandelnderArzt(Arzt arzt);
    List<Behandlung> findByDatum(Date datum);
}

