// pages/ArztTermine.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchTermine, createTermin } from '../services/api';
import './ArztTermine.css';

const ArztTermine = () => {
  const { user } = useContext(AuthContext);
  const [termine, setTermine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewTerminForm, setShowNewTerminForm] = useState(false);
  const [newTermin, setNewTermin] = useState({
    datum: new Date().toISOString().split('T')[0],
    uhrzeit: '09:00',
    dauer: 30,
    notizen: '',
    patientID: '',
    arztID: user && user.role === 'ARZT' ? user.arztID : ''
  });
  
  useEffect(() => {
    loadTermine();
  }, [selectedDate]);
  
  const loadTermine = async () => {
    try {
      setLoading(true);
      const arztID = user && user.role === 'ARZT' ? user.arztID : null;
      const data = await fetchTermine(arztID, selectedDate);
      
      // Gruppieren nach Uhrzeit
      const sortedTermine = data.sort((a, b) => {
        return a.uhrzeit.localeCompare(b.uhrzeit);
      });
      
      setTermine(sortedTermine);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden der Termine.');
      setLoading(false);
    }
  };
  
  const handleNewTerminChange = (e) => {
    const { name, value } = e.target;
    setNewTermin(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTermin(newTermin);
      setShowNewTerminForm(false);
      setNewTermin({
        datum: selectedDate,
        uhrzeit: '09:00',
        dauer: 30,
        notizen: '',
        patientID: '',
        arztID: user && user.role === 'ARZT' ? user.arztID : ''
      });
      loadTermine();
    } catch (err) {
      setError('Fehler beim Erstellen des Termins.');
      setLoading(false);
    }
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  if (loading && termine.length === 0) {
    return <div className="loading">Lade Termine...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="arzt-termine">
      <h2>Terminkalender</h2>
      
      <div className="termin-controls">
        <div className="date-selector">
          <label htmlFor="date">Datum:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setShowNewTerminForm(true)}
        >
          Neuen Termin erstellen
        </button>
      </div>
      
      {termine.length === 0 ? (
        <p>Keine Termine für diesen Tag gefunden.</p>
      ) : (
        <div className="termin-list">
          {termine.map(termin => (
            <div key={termin.terminID} className="termin-card">
              <div className="termin-time">{termin.uhrzeit} Uhr</div>
              <div className="termin-details">
                <h3>{termin.patient.name}, {termin.patient.vorname}</h3>
                <p className="termin-duration">Dauer: {termin.dauer} Minuten</p>
                <p className="termin-notes">{termin.notizen || 'Keine Notizen'}</p>
                <div className="termin-actions">
                  <Link to={`/behandlung/${termin.patient.patientID}`} className="btn btn-small">
                    Behandlung dokumentieren
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showNewTerminForm && (
        <div className="termin-dialog">
          <div className="dialog-content">
            <h3>Neuen Termin erstellen</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="datum">Datum</label>
                <input
                  type="date"
                  id="datum"
                  name="datum"
                  value={newTermin.datum}
                  onChange={handleNewTerminChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="uhrzeit">Uhrzeit</label>
                <input
                  type="time"
                  id="uhrzeit"
                  name="uhrzeit"
                  value={newTermin.uhrzeit}
                  onChange={handleNewTerminChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dauer">Dauer (Minuten)</label>
                <input
                  type="number"
                  id="dauer"
                  name="dauer"
                  value={newTermin.dauer}
                  onChange={handleNewTerminChange}
                  required
                  min="5"
                  step="5"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="patientID">Patient</label>
                <select
                  id="patientID"
                  name="patientID"
                  value={newTermin.patientID}
                  onChange={handleNewTerminChange}
                  required
                >
                  <option value="">Patient auswählen</option>
                  {/* Diese würden dynamisch aus der API geladen */}
                  <option value="1">Mustermann, Max</option>
                  <option value="2">Schmidt, Anna</option>
                  <option value="3">Meier, Thomas</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="arztID">Arzt</label>
                <select
                  id="arztID"
                  name="arztID"
                  value={newTermin.arztID}
                  onChange={handleNewTerminChange}
                  required
                >
                  <option value="">Arzt auswählen</option>
                  {/* Diese würden dynamisch aus der API geladen */}
                  <option value="1">Dr. Müller</option>
                  <option value="2">Dr. Weber</option>
                  <option value="3">Dr. Schneider</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notizen">Notizen</label>
                <textarea
                  id="notizen"
                  name="notizen"
                  value={newTermin.notizen}
                  onChange={handleNewTerminChange}
                />
              </div>
              
              <div className="dialog-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewTerminForm(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArztTermine;