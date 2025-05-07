package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Arzt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArztRepository extends JpaRepository<Arzt, Integer> {
    List<Arzt> findByFachbereich(String fachbereich);
}

