package com.example.patientenverwaltung.repository;

import com.example.patientenverwaltung.model.Bett;
import com.example.patientenverwaltung.model.Zimmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BettRepository extends JpaRepository<Bett, Integer> {
    List<Bett> findByBelegt(boolean belegt);
    List<Bett> findByZimmer(Zimmer zimmer);
}

