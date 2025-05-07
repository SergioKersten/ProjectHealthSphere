// pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  fetchPatienten,
  fetchTermine,
  fetchVerfügbareBetten
} from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    patientenGesamt: 0,
    aktuelleAufnahmen: 0,
    heutigeTermine: 0,
    freieBetten: 0
  });
  const [termine, setTermine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Datum für heutige Termine
        const heute = new Date().toISOString().split('T')[0];
        
        // Parallele API-Aufrufe
        const [patientenData, termineData, bettenData] = await Promise.all([
          fetchPatienten(),
          fetchTermine(user.role === 'ARZT' ? user.arztID : null, heute),
          fetchVerfügbareBetten()
        ]);
        
        // Statistiken berechnen
        const aktuelleAufnahmen = patientenData.filter(p => p.bett !== null).length;
        const freieBetten = bettenData.filter(b => !b.belegt).length;
        
        setStats({
          patientenGesamt: patientenData.length,
          aktuelleAufnahmen,
          heutigeTermine: termineData.length,
          freieBetten
        });
        
        setTermine(termineData);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Dashboard-Daten.');
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  if (loading) {
    return <div className="loading">Lade Dashboard...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Patienten</h3>
          <div className="stat-value">{stats.patientenGesamt}</div>
          <div className="stat-description">Patienten insgesamt</div>
          <Link to="/patienten" className="card-link">
            Alle Patienten anzeigen
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Aufnahmen</h3>
          <div className="stat-value">{stats.aktuelleAufnahmen}</div>
          <div className="stat-description">Aktuelle Aufnahmen</div>
          <Link to="/betten" className="card-link">
            Bettenbelegung anzeigen
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Termine</h3>
          <div className="stat-value">{stats.heutigeTermine}</div>
          <div className="stat-description">Termine heute</div>
          <Link to="/termine" className="card-link">
            Terminkalender öffnen
          </Link>
        </div>
        
        <div className="stat-card">
          <h3>Betten</h3>
          <div className="stat-value">{stats.freieBetten}</div>
          <div className="stat-description">Freie Betten</div>
          <Link to="/betten" className="card-link">
            Bettenverwaltung öffnen
          </Link>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="todays-appointments">
          <h3>Heutige Termine</h3>
          
          {termine.length === 0 ? (
            <p>Keine Termine für heute.</p>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Uhrzeit</th>
                  <th>Patient</th>
                  <th>Notizen</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {termine.map(termin => (
                  <tr key={termin.terminID}>
                    <td>{termin.uhrzeit}</td>
                    <td>
                      {termin.patient.name}, {termin.patient.vorname}
                    </td>
                    <td>{termin.notizen}</td>
                    <td>
                      <Link to={`/behandlung/${termin.patient.patientID}`} className="btn btn-small">
                        Behandlung dokumentieren
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="section-actions">
            <Link to="/termine" className="btn btn-secondary">
              Alle Termine anzeigen
            </Link>
          </div>
        </div>
        
        <div className="quick-actions">
          <h3>Schnellaktionen</h3>
          
          <div className="action-buttons">
            <Link to="/patienten/neu" className="btn btn-primary">
              Neuen Patienten aufnehmen
            </Link>
            
            <Link to="/termine/neu" className="btn btn-primary">
              Neuen Termin vereinbaren
            </Link>
            
            <Link to="/betten" className="btn btn-primary">
              Bett zuweisen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;