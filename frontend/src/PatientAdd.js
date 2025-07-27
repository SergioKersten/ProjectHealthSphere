import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { patientAPI } from './services/api';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PatientSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const SectionTitle = styled.h2`
  color: #3399ff;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 2px solid #3399ff;
  padding-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #495057;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  
  ${props => props.primary ?`
    background-color: #3399ff;
    color: white;
    &:hover { background-color: #2980d9; }
  ` : `
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #5a6268; }
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3399ff;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

function PatientAdd() {
  const navigate = useNavigate();
  
  // Patient State für neuen Patienten
  const [patient, setPatient] = useState({
    firstname: '',
    name: '',
    phonenumber: '',
    email: '',
    birthdate: '',
    adress: ''
  });
  
  // Loading und Error States
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!patient.firstname || !patient.name) {
        setError('Vorname und Nachname sind Pflichtfelder!');
        return;
      }

      setSaving(true);
      setError(null);
      
      // API Call zum Erstellen des Patienten
      const response = await patientAPI.create(patient);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/patients');
      }, 1500); // Nach 1.5 Sekunden zurück zur Patientenliste
      
    } catch (err) {
      setError('Fehler beim Erstellen des Patienten: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  const isFormValid = patient.firstname.trim() && patient.name.trim();

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Zurück zur Patientenliste
      </BackButton>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Success Message */}
      {success && <SuccessMessage>Patient erfolgreich erstellt! Weiterleitung zur Patientenliste...</SuccessMessage>}

      {/* Patient Information Section */}
      <PatientSection>
        <SectionTitle>Neuen Patienten hinzufügen</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="firstname">Vorname *</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={patient.firstname}
              onChange={handleInputChange}
              placeholder="Vorname eingeben"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="name">Nachname *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={patient.name}
              onChange={handleInputChange}
              placeholder="Nachname eingeben"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phonenumber">Telefonnummer</Label>
            <Input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={patient.phonenumber}
              onChange={handleInputChange}
              placeholder="Telefonnummer eingeben"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">E-Mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={patient.email}
              onChange={handleInputChange}
              placeholder="E-Mail eingeben"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="birthdate">Geburtsdatum</Label>
            <Input
              type="date"
              id="birthdate"
              name="birthdate"
              value={patient.birthdate}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="adress">Adresse</Label>
            <Input
              type="text"
              id="adress"
              name="adress"
              value={patient.adress}
              onChange={handleInputChange}
              placeholder="Adresse eingeben"
            />
          </FormGroup>
        </FormGrid>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={saving || !isFormValid}
          >
            {saving ? 'Speichern...' : 'Patient erstellen'}
          </Button>
          <Button onClick={handleCancel} disabled={saving}>
            Abbrechen
          </Button>
        </ButtonGroup>
      </PatientSection>
    </EditContainer>
  );
}

export default PatientAdd;