// pages/PatientenListe.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPatienten, deletePatient } from '../services/api';
import './PatientenListe.css';

const PatientenListe = () => {
  const [patienten, setPatienten] = useState([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadPatienten();
  }, []);
  
  const loadPatienten = async (suche = '') => {
    try {
      setLoading(true);
      const data = await fetchPatienten(suche);
      setPatienten(data);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden der Patientendaten.');
      setLoading(false);
    }
  };
  
  const handleSuche = (e) => {
    e.preventDefault();
    loadPatienten(suchbegriff);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Patienten wirklich löschen?')) {
      try {
        await deletePatient(id);
        setPatienten(patienten.filter(patient => patient.patientID !== id));
      } catch (err) {
        setError('Fehler beim Löschen des Patienten.');
      }
    }
  };

  if (loading && patienten.length === 0) {
    return <div className="loading">Lade Patientendaten...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="patienten-liste">
      <h2>Patienten</h2>
      
      <div className="actions-bar">
        <form className="search-bar" onSubmit={handleSuche}>
          <input
            type="text"
            placeholder="Suche nach Name oder Vorname"
            value={suchbegriff}
            onChange={(e) => setSuchbegriff(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Suchen</button>
        </form>
        
        <Link to="/patienten/neu" className="btn btn-primary">
          Neuen Patienten aufnehmen
        </Link>
      </div>
      
      {patienten.length === 0 ? (
        <p>Keine Patienten gefunden.</p>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vorname</th>
              <th>Geburtsdatum</th>
              <th>Telefon</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {patienten.map(patient => (
              <tr key={patient.patientID}>
                <td>{patient.patientID}</td>
                <td>{patient.name}</td>
                <td>{patient.vorname}</td>
                <td>{new Date(patient.geburtsdatum).toLocaleDateString()}</td>
                <td>{patient.telefon || '-'}</td>
                <td className="patient-actions">
                  <Link to={`/patienten/${patient.patientID}`} className="btn btn-small">
                    Details
                  </Link>
                  <Link to={`/patienten/${patient.patientID}/bearbeiten`} className="btn btn-small">
                    Bearbeiten
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.patientID)}
                    className="btn btn-small"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientenListe;