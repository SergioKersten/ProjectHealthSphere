package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Diagnose;
import com.example.patientenverwaltung.model.Behandlung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnoseRepository extends JpaRepository<Diagnose, Integer> {
    List<Diagnose> findByBehandlung(Behandlung behandlung);
    List<Diagnose> findByIcdCode(String icdCode);
}

