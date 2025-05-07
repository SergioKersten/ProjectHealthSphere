package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Zimmer;
import com.example.patientenverwaltung.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZimmerRepository extends JpaRepository<Zimmer, Integer> {
    List<Zimmer> findByStation(Station station);
    Zimmer findByNummer(Integer nummer);
}

