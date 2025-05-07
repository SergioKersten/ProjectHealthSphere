package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Protokoll;
import com.example.patientenverwaltung.model.Benutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Date;

@Repository
public interface ProtokollRepository extends JpaRepository<Protokoll, Integer> {
    List<Protokoll> findByBenutzer(Benutzer benutzer);
    List<Protokoll> findByZeitstempelBetween(Date von, Date bis);
    List<Protokoll> findByAktion(String aktion);
}

