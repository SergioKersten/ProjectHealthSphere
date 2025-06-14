package backend.controller;

import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.components.Treatment;
import backend.manager.TreatmentManager;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentController {

    private final TreatmentManager treatmentManager;

    public TreatmentController() {
        this.treatmentManager = new TreatmentManager("treatments.ser");
    }

    @GetMapping
    public Set<Treatment> getAllTreatments() {
        return treatmentManager.getAll();
    }
}