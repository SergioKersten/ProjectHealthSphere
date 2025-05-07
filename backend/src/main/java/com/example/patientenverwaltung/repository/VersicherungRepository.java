package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Versicherung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersicherungRepository extends JpaRepository<Versicherung, Integer> {
    Versicherung findByName(String name);
}

