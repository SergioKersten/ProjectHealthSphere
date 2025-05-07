// pages/PatientenFormular.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, fetchPatientById, updatePatient } from '../services/api';
import { useForm } from 'react-hook-form';
import './PatientenFormular.css';

const PatientenFormular = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      const loadPatient = async () => {
        try {
          setLoading(true);
          const patientData = await fetchPatientById(id);
          reset(patientData);
          setLoading(false);
        } catch (err) {
          setError('Patient konnte nicht geladen werden.');
          setLoading(false);
        }
      };
      
      loadPatient();
    }
  }, [id, isEditMode, reset]);
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditMode) {
        await updatePatient(id, data);
        navigate(`/patienten/${id}`);
      } else {
        const newPatient = await createPatient(data);
        navigate(`/patienten/${newPatient.patientID}`);
      }
    } catch (err) {
      setError('Es ist ein Fehler aufgetreten.');
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div>Lade Patientendaten...</div>;
  }
  
  return (
    <div className="patienten-formular">
      <h2>{isEditMode ? 'Patient bearbeiten' : 'Neuen Patienten aufnehmen'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Nachname</label>
          <input 
            id="name"
            type="text"
            {...register('name', { required: 'Nachname ist erforderlich' })}
            className={errors.name ? 'has-error' : ''}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="vorname">Vorname</label>
          <input 
            id="vorname"
            type="text"
            {...register('vorname', { required: 'Vorname ist erforderlich' })}
            className={errors.vorname ? 'has-error' : ''}
          />
          {errors.vorname && <span className="error">{errors.vorname.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="geburtsdatum">Geburtsdatum</label>
          <input 
            id="geburtsdatum"
            type="date"
            {...register('geburtsdatum', { required: 'Geburtsdatum ist erforderlich' })}
            className={errors.geburtsdatum ? 'has-error' : ''}
          />
          {errors.geburtsdatum && <span className="error">{errors.geburtsdatum.message}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <textarea 
            id="adresse"
            {...register('adresse')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="telefon">Telefon</label>
          <input 
            id="telefon"
            type="tel"
            {...register('telefon')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="versicherungsnummer">Versicherungsnummer</label>
          <input 
            id="versicherungsnummer"
            type="text"
            {...register('versicherungsnummer')}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="versicherungID">Versicherung</label>
          <select 
            id="versicherungID"
            {...register('versicherungID')}
          >
            <option value="">Bitte wählen</option>
            <option value="1">AOK</option>
            <option value="2">TK</option>
            <option value="3">Barmer</option>
            <option value="4">DAK</option>
            {/* Diese würden dynamisch aus der API geladen */}
          </select>
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
            {loading ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientenFormular;



