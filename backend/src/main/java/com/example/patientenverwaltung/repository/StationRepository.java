package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StationRepository extends JpaRepository<Station, Integer> {
    Station findByName(String name);
}

