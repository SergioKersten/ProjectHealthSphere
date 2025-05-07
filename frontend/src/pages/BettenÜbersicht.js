// pages/BettenÜbersicht.js
import React, { useState, useEffect } from 'react';
import { fetchVerfügbareBetten, assignBettToPatient, fetchPatienten } from '../services/api';
import './BettenUebersicht.css';

const BettenÜbersicht = () => {
  const [stationen, setStationen] = useState([]);
  const [patienten, setPatienten] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zuweisenDialogActive, setZuweisenDialogActive] = useState(false);
  const [selectedBett, setSelectedBett] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bettenData, patientenData] = await Promise.all([
          fetchVerfügbareBetten(),
          fetchPatienten()
        ]);
        
        // Gruppieren nach Stationen
        const stationenMap = bettenData.reduce((acc, bett) => {
          const stationName = bett.zimmer.station.name;
          if (!acc[stationName]) {
            acc[stationName] = {
              id: bett.zimmer.station.stationID,
              name: stationName,
              zimmer: {}
            };
          }
          
          const zimmerNummer = bett.zimmer.nummer;
          if (!acc[stationName].zimmer[zimmerNummer]) {
            acc[stationName].zimmer[zimmerNummer] = {
              id: bett.zimmer.zimmerID,
              nummer: zimmerNummer,
              betten: []
            };
          }
          
          acc[stationName].zimmer[zimmerNummer].betten.push(bett);
          return acc;
        }, {});
        
        // Konvertiere in Array-Format für die Anzeige
        const stationenArray = Object.values(stationenMap).map(station => ({
          ...station,
          zimmer: Object.values(station.zimmer)
        }));
        
        setStationen(stationenArray);
        setPatienten(patientenData);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Daten.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleBettClick = (bett) => {
    if (!bett.belegt) {
      setSelectedBett(bett);
      setZuweisenDialogActive(true);
    }
  };
  
  const handlePatientSelect = (e) => {
    const patientId = parseInt(e.target.value);
    const patient = patienten.find(p => p.patientID === patientId);
    setSelectedPatient(patient);
  };
  
  const handleZuweisen = async () => {
    if (!selectedPatient || !selectedBett) return;
    
    try {
      setLoading(true);
      await assignBettToPatient(selectedPatient.patientID, selectedBett.bettID);
      
      // Aktualisiere die Anzeige
      const updatedStationen = [...stationen];
      // Suche das zugewiesene Bett und aktualisiere seinen Status
      updatedStationen.forEach(station => {
        station.zimmer.forEach(zimmer => {
          const bettIndex = zimmer.betten.findIndex(b => b.bettID === selectedBett.bettID);
          if (bettIndex !== -1) {
            zimmer.betten[bettIndex] = {
              ...zimmer.betten[bettIndex],
              belegt: true,
              aktuellerPatient: selectedPatient
            };
          }
        });
      });
      
      setStationen(updatedStationen);
      setZuweisenDialogActive(false);
      setSelectedPatient(null);
      setSelectedBett(null);
      setLoading(false);
    } catch (err) {
      setError('Fehler bei der Bettzuweisung.');
      setLoading(false);
    }
  };
  
  if (loading && stationen.length === 0) {
    return <div className="loading">Lade Betten...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="betten-übersicht">
      <h2>Bettenübersicht</h2>
      
      {stationen.map(station => (
        <div key={station.id} className="station-card">
          <h3>Station: {station.name}</h3>
          
          <div className="zimmer-container">
            {station.zimmer.map(zimmer => (
              <div key={zimmer.id} className="zimmer-card">
                <h4>Zimmer {zimmer.nummer}</h4>
                
                <div className="betten-container">
                  {zimmer.betten.map(bett => (
                    <div 
                      key={bett.bettID}
                      className={`bett-card ${bett.belegt ? 'belegt' : 'frei'}`}
                      onClick={() => handleBettClick(bett)}
                    >
                      <div className="bett-nummer">Bett {bett.nummer}</div>
                      {bett.belegt && bett.aktuellerPatient && (
                        <div className="patient-info">
                          {bett.aktuellerPatient.name}, {bett.aktuellerPatient.vorname}
                        </div>
                      )}
                      <div className="bett-status">
                        {bett.belegt ? 'Belegt' : 'Frei'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {zuweisenDialogActive && (
        <div className="zuweisung-dialog">
          <div className="dialog-content">
            <h3>Bett zuweisen</h3>
            <p>Bett {selectedBett.nummer} in Zimmer {selectedBett.zimmer.nummer}</p>
            
            <div className="form-group">
              <label htmlFor="patient">Patient auswählen:</label>
              <select 
                id="patient"
                value={selectedPatient ? selectedPatient.patientID : ''}
                onChange={handlePatientSelect}
              >
                <option value="">Bitte wählen</option>
                {patienten.map(patient => (
                  <option key={patient.patientID} value={patient.patientID}>
                    {patient.name}, {patient.vorname} ({patient.geburtsdatum})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="dialog-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setZuweisenDialogActive(false)}
              >
                Abbrechen
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleZuweisen}
                disabled={!selectedPatient}
              >
                Zuweisen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BettenÜbersicht;



