package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Medikation;
import com.example.patientenverwaltung.model.Behandlung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedikationRepository extends JpaRepository<Medikation, Integer> {
    List<Medikation> findByBehandlung(Behandlung behandlung);
    List<Medikation> findByMedikamentenName(String medikamentenName);
}

