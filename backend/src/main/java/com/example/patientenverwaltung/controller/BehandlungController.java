package com.example.patientenverwaltung.controller;

import com.example.patientenverwaltung.dto.BehandlungDTO;
import com.example.patientenverwaltung.dto.DiagnoseDTO;
import com.example.patientenverwaltung.dto.MedikationDTO;
import com.example.patientenverwaltung.model.Behandlung;
import com.example.patientenverwaltung.model.Diagnose;
import com.example.patientenverwaltung.model.Medikation;
import com.example.patientenverwaltung.service.BehandlungService;
import com.example.patientenverwaltung.service.DiagnoseService;
import com.example.patientenverwaltung.service.MedikationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/behandlungen")
public class BehandlungController {
    
    private final BehandlungService behandlungService;
    private final DiagnoseService diagnoseService;
    private final MedikationService medikationService;
    
    @Autowired
    public BehandlungController(BehandlungService behandlungService,
                              DiagnoseService diagnoseService,
                              MedikationService medikationService) {
        this.behandlungService = behandlungService;
        this.diagnoseService = diagnoseService;
        this.medikationService = medikationService;
    }
    
    @GetMapping
    public ResponseEntity<List<BehandlungDTO>> alleBehandlungenFinden() {
        List<Behandlung> behandlungen = behandlungService.alleBehandlungenFinden();
        List<BehandlungDTO> behandlungDTOs = behandlungen.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(behandlungDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BehandlungDTO> behandlungFindenById(@PathVariable Integer id) {
        return behandlungService.behandlungFindenById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<BehandlungDTO> behandlungErstellen(@RequestBody BehandlungDTO behandlungDTO) {
        Behandlung behandlung = convertToEntity(behandlungDTO);
        Behandlung gespeicherteBehandlung = behandlungService.behandlungErstellen(behandlung);
        return new ResponseEntity<>(convertToDTO(gespeicherteBehandlung), HttpStatus.CREATED);
    }
    
    @GetMapping("/{behandlungId}/diagnosen")
    public ResponseEntity<List<DiagnoseDTO>> diagnosenByBehandlung(@PathVariable Integer behandlungId) {
        List<Diagnose> diagnosen = diagnoseService.diagnoseByBehandlung(behandlungId);
        List<DiagnoseDTO> diagnoseDTOs = diagnosen.stream()
                .map(this::convertDiagnoseToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(diagnoseDTOs);
    }
    
    @PostMapping("/{behandlungId}/diagnosen")
    public ResponseEntity<DiagnoseDTO> diagnoseErstellen(
            @PathVariable Integer behandlungId,
            @RequestBody DiagnoseDTO diagnoseDTO) {
        
        Diagnose diagnose = convertDiagnoseToEntity(diagnoseDTO);
        Diagnose gespeicherteDiagnose = diagnoseService.diagnoseErstellen(diagnose, behandlungId);
        return new ResponseEntity<>(convertDiagnoseToDTO(gespeicherteDiagnose), HttpStatus.CREATED);
    }
    
    @GetMapping("/{behandlungId}/medikationen")
    public ResponseEntity<List<MedikationDTO>> medikationenByBehandlung(@PathVariable Integer behandlungId) {
        List<Medikation> medikationen = medikationService.medikationByBehandlung(behandlungId);
        List<MedikationDTO> medikationDTOs = medikationen.stream()
                .map(this::convertMedikationToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medikationDTOs);
    }
    
    @PostMapping("/{behandlungId}/medikationen")
    public ResponseEntity<MedikationDTO> medikationErstellen(
            @PathVariable Integer behandlungId,
            @RequestBody MedikationDTO medikationDTO,
            @RequestHeader("X-Arzt-ID") Integer arztId) {
        
        Medikation medikation = convertMedikationToEntity(medikationDTO);
        Medikation gespeicherteMedikation = medikationService.medikationErstellen(medikation, behandlungId, arztId);
        return new ResponseEntity<>(convertMedikationToDTO(gespeicherteMedikation), HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> behandlungLöschen(@PathVariable Integer id) {
        if (!behandlungService.behandlungFindenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        behandlungService.behandlungLöschen(id);
        return ResponseEntity.noContent().build();
    }
    
    // DTO-Konvertierungsmethoden
    private BehandlungDTO convertToDTO(Behandlung behandlung) {
        BehandlungDTO behandlungDTO = new BehandlungDTO();
        behandlungDTO.setBehandlungID(behandlung.getBehandlungID());
        behandlungDTO.setDatum(behandlung.getDatum());
        behandlungDTO.setTherapie(behandlung.getTherapie());
        
        if (behandlung.getPatient() != null) {
            behandlungDTO.setPatientID(behandlung.getPatient().getPatientID());
        }
        
        if (behandlung.getBehandelnderArzt() != null) {
            behandlungDTO.setBehandelnderArztID(behandlung.getBehandelnderArzt().getArztID());
        }
        
        return behandlungDTO;
    }
    
    private Behandlung convertToEntity(BehandlungDTO behandlungDTO) {
        Behandlung behandlung = new Behandlung();
        behandlung.setBehandlungID(behandlungDTO.getBehandlungID());
        behandlung.setDatum(behandlungDTO.getDatum());
        behandlung.setTherapie(behandlungDTO.getTherapie());
        
        // Patient und Arzt müssen im Service gesetzt werden
        
        return behandlung;
    }
    
    private DiagnoseDTO convertDiagnoseToDTO(Diagnose diagnose) {
        DiagnoseDTO diagnoseDTO = new DiagnoseDTO();
        diagnoseDTO.setDiagnoseID(diagnose.getDiagnoseID());
        diagnoseDTO.setBezeichnung(diagnose.getBezeichnung());
        diagnoseDTO.setBeschreibung(diagnose.getBeschreibung());
        diagnoseDTO.setIcdCode(diagnose.getIcdCode());
        diagnoseDTO.setDiagnoseDatum(diagnose.getDiagnoseDatum());
        
        if (diagnose.getBehandlung() != null) {
            diagnoseDTO.setBehandlungID(diagnose.getBehandlung().getBehandlungID());
        }
        
        if (diagnose.getDiagnostizierenderArzt() != null) {
            diagnoseDTO.setDiagnostizierenderArztID(diagnose.getDiagnostizierenderArzt().getArztID());
        }
        
        return diagnoseDTO;
    }
    
    private Diagnose convertDiagnoseToEntity(DiagnoseDTO diagnoseDTO) {
        Diagnose diagnose = new Diagnose();
        diagnose.setDiagnoseID(diagnoseDTO.getDiagnoseID());
        diagnose.setBezeichnung(diagnoseDTO.getBezeichnung());
        diagnose.setBeschreibung(diagnoseDTO.getBeschreibung());
        diagnose.setIcdCode(diagnoseDTO.getIcdCode());
        diagnose.setDiagnoseDatum(diagnoseDTO.getDiagnoseDatum());
        
        // Behandlung und Arzt müssen im Service gesetzt werden
        
        return diagnose;
    }
    
    private MedikationDTO convertMedikationToDTO(Medikation medikation) {
        MedikationDTO medikationDTO = new MedikationDTO();
        medikationDTO.setMedikationID(medikation.getMedikationID());
        medikationDTO.setMedikamentenName(medikation.getMedikamentenName());
        medikationDTO.setDosierung(medikation.getDosierung());
        medikationDTO.setHäufigkeit(medikation.getHäufigkeit());
        medikationDTO.setStartDatum(medikation.getStartDatum());
        medikationDTO.setEndDatum(medikation.getEndDatum());
        
        if (medikation.getBehandlung() != null) {
            medikationDTO.setBehandlungID(medikation.getBehandlung().getBehandlungID());
        }
        
        return medikationDTO;
    }
    
    private Medikation convertMedikationToEntity(MedikationDTO medikationDTO) {
        Medikation medikation = new Medikation();
        medikation.setMedikationID(medikationDTO.getMedikationID());
        medikation.setMedikamentenName(medikationDTO.getMedikamentenName());
        medikation.setDosierung(medikationDTO.getDosierung());
        medikation.setHäufigkeit(medikationDTO.getHäufigkeit());
        medikation.setStartDatum(medikationDTO.getStartDatum());
        medikation.setEndDatum(medikationDTO.getEndDatum());
        
        // Behandlung muss im Service gesetzt werden
        
        return medikation;
    }
}


