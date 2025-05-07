// pages/BehandlungsDokumentation.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientById, createBehandlung, addDiagnoseToBehandlung, addMedikationToBehandlung } from '../services/api';
import './BehandlungsDokumentation.css';

const BehandlungsDokumentation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [behandlung, setBehandlung] = useState({
    datum: new Date().toISOString().split('T')[0],
    therapie: '',
    patientID: parseInt(patientId),
    behandelnderArztID: 1  // Hier normalerweise den eingeloggten Arzt verwenden
  });
  const [diagnose, setDiagnose] = useState({
    bezeichnung: '',
    beschreibung: '',
    icdCode: '',
    diagnoseDatum: new Date().toISOString().split('T')[0],
    diagnostizierenderArztID: 1
  });
  const [medikation, setMedikation] = useState({
    medikamentenName: '',
    dosierung: '',
    häufigkeit: '',
    startDatum: new Date().toISOString().split('T')[0],
    endDatum: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [createdBehandlungId, setCreatedBehandlungId] = useState(null);
  
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const data = await fetchPatientById(patientId);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError('Patient konnte nicht geladen werden.');
        setLoading(false);
      }
    };
    
    loadPatient();
  }, [patientId]);
  
  const handleBehandlungChange = (e) => {
    const { name, value } = e.target;
    setBehandlung(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDiagnoseChange = (e) => {
    const { name, value } = e.target;
    setDiagnose(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMedikationChange = (e) => {
    const { name, value } = e.target;
    setMedikation(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBehandlungSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createBehandlung(behandlung);
      setCreatedBehandlungId(response.behandlungID);
      setStep(2);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Speichern der Behandlung.');
      setLoading(false);
    }
  };
  
  const handleDiagnoseSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      await addDiagnoseToBehandlung(createdBehandlungId, {
        ...diagnose,
        behandlungID: createdBehandlungId
      });
      setStep(3);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Speichern der Diagnose.');
      setLoading(false);
    }
  };
  
  const handleMedikationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addMedikationToBehandlung(createdBehandlungId, {
        ...medikation,
        behandlungID: createdBehandlungId
      });
      navigate(`/patienten/${patientId}`);
    } catch (err) {
      setError('Fehler beim Speichern der Medikation.');
      setLoading(false);
    }
  };
  
  if (loading && !patient) {
    return <div className="loading">Lade Patientendaten...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="behandlungs-dokumentation">
      <h2>Behandlung dokumentieren</h2>
      
      {patient && (
        <div className="patient-info">
          <h3>Patient: {patient.name}, {patient.vorname}</h3>
          <p>Geburtsdatum: {new Date(patient.geburtsdatum).toLocaleDateString()}</p>
        </div>
      )}
      
      <div className="progress-steps">
        <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>1. Behandlung</div>
        <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>2. Diagnose</div>
        <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>3. Medikation</div>
      </div>
      
      {step === 1 && (
        <form className="behandlung-form" onSubmit={handleBehandlungSubmit}>
          <h3>Behandlungsdetails</h3>
          
          <div className="form-group">
            <label htmlFor="datum">Datum</label>
            <input 
              type="date"
              id="datum"
              name="datum"
              value={behandlung.datum}
              onChange={handleBehandlungChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="therapie">Therapie</label>
            <textarea 
              id="therapie"
              name="therapie"
              value={behandlung.therapie}
              onChange={handleBehandlungChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate(-1)}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Speichern...' : 'Weiter zur Diagnose'}
            </button>
          </div>
        </form>
      )}
      
      {step === 2 && (
        <form className="diagnose-form" onSubmit={handleDiagnoseSubmit}>
          <h3>Diagnose</h3>
          
          <div className="form-group">
            <label htmlFor="bezeichnung">Bezeichnung</label>
            <input 
              type="text"
              id="bezeichnung"
              name="bezeichnung"
              value={diagnose.bezeichnung}
              onChange={handleDiagnoseChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="icdCode">ICD-Code</label>
            <input 
              type="text"
              id="icdCode"
              name="icdCode"
              value={diagnose.icdCode}
              onChange={handleDiagnoseChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="beschreibung">Beschreibung</label>
            <textarea 
              id="beschreibung"
              name="beschreibung"
              value={diagnose.beschreibung}
              onChange={handleDiagnoseChange}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setStep(1)}
            >
              Zurück
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Speichern...' : 'Weiter zur Medikation'}
            </button>
          </div>
        </form>
      )}
      
      {step === 3 && (
        <form className="medikation-form" onSubmit={handleMedikationSubmit}>
          <h3>Medikation</h3>
          
          <div className="form-group">
            <label htmlFor="medikamentenName">Medikament</label>
            <input 
              type="text"
              id="medikamentenName"
              name="medikamentenName"
              value={medikation.medikamentenName}
              onChange={handleMedikationChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dosierung">Dosierung</label>
            <input 
              type="text"
              id="dosierung"
              name="dosierung"
              value={medikation.dosierung}
              onChange={handleMedikationChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="häufigkeit">Häufigkeit</label>
            <input 
              type="text"
              id="häufigkeit"
              name="häufigkeit"
              value={medikation.häufigkeit}
              onChange={handleMedikationChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDatum">Beginn</label>
              <input 
                type="date"
                id="startDatum"
                name="startDatum"
                value={medikation.startDatum}
                onChange={handleMedikationChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDatum">Ende</label>
              <input 
                type="date"
                id="endDatum"
                name="endDatum"
                value={medikation.endDatum}
                onChange={handleMedikationChange}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setStep(2)}
            >
              Zurück
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Speichern...' : 'Behandlung abschließen'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BehandlungsDokumentation;



