// pages/PatientenDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchPatientById, deletePatient } from '../services/api';
import './PatientenDetails.css';

const PatientenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const data = await fetchPatientById(id);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError('Patient konnte nicht geladen werden.');
        setLoading(false);
      }
    };
    
    loadPatient();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm('Möchten Sie diesen Patienten wirklich löschen?')) {
      try {
        await deletePatient(id);
        navigate('/patienten');
      } catch (err) {
        setError('Fehler beim Löschen des Patienten.');
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Lade Patientendaten...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!patient) {
    return <div className="error-message">Patient nicht gefunden.</div>;
  }
  
  return (
    <div className="patienten-details">
      <h2>Patientendetails</h2>
      
      <div className="patient-card">
        <h3>{patient.name}, {patient.vorname}</h3>
        
        <div className="patient-info-grid">
          <div className="info-row">
            <span className="info-label">Geburtsdatum:</span>
            <span className="info-value">{new Date(patient.geburtsdatum).toLocaleDateString()}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Adresse:</span>
            <span className="info-value">{patient.adresse || '-'}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Telefon:</span>
            <span className="info-value">{patient.telefon || '-'}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Versicherungsnummer:</span>
            <span className="info-value">{patient.versicherungsnummer || '-'}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Versicherung:</span>
            <span className="info-value">{patient.versicherung ? patient.versicherung.name : '-'}</span>
          </div>
        </div>
        
        <div className="details-actions">
          <Link to={`/patienten/${id}/bearbeiten`} className="btn btn-primary">
            Bearbeiten
          </Link>
          <button onClick={handleDelete} className="btn btn-secondary">
            Löschen
          </button>
          <Link to={`/behandlung/${id}`} className="btn btn-primary">
            Neue Behandlung
          </Link>
        </div>
      </div>
      
      {patient.behandlungen && patient.behandlungen.length > 0 && (
        <div className="behandlungen-section">
          <h3>Behandlungen</h3>
          
          <table className="behandlung-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Arzt</th>
                <th>Diagnose</th>
                <th>Therapie</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {patient.behandlungen.map(behandlung => (
                <tr key={behandlung.behandlungID}>
                  <td>{new Date(behandlung.datum).toLocaleDateString()}</td>
                  <td>{behandlung.behandelnderArzt.name}</td>
                  <td>
                    {behandlung.diagnosen.map(diagnose => (
                      <div key={diagnose.diagnoseID}>
                        {diagnose.icdCode} - {diagnose.bezeichnung}
                      </div>
                    ))}
                  </td>
                  <td>{behandlung.therapie}</td>
                  <td>
                    <Link to={`/behandlung/${id}/details/${behandlung.behandlungID}`} className="btn btn-small">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="nav-buttons">
        <Link to="/patienten" className="btn btn-secondary">
          Zurück zur Patientenliste
        </Link>
      </div>
    </div>
  );
};

export default PatientenDetails;



