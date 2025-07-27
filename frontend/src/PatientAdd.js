import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { patientAPI, treatmentAPI } from './services/api';

// Styled Components für komprimierte Darstellung
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

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  
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
  
  ${props => props.primary ? `
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
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Patient States
  const [patient, setPatient] = useState({
    firstname: '',
    name: '',
    phonenumber: '',
    email: '',
    birthdate: '',
    adress: ''
  });
  
  // Treatment States
  const [treatments, setTreatments] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Error States
  const [error, setError] = useState(null);
  const [treatmentsError, setTreatmentsError] = useState(null);

  // Load patient data on component mount
  useEffect(() => {
    loadPatientData();
    loadTreatments();
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getById(id);
      setPatient(response.data);
    } catch (err) {
      setError('Fehler beim Laden der Patientendaten: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientAPI.update(id, patient);
      alert('Patient erfolgreich aktualisiert!');
      navigate('/patients');
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  if (loading) {
    return <LoadingMessage>Loading Patientendata...</LoadingMessage>;
  }

  if (error) {
    return (
      <EditContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate('/patients')}>Back to Patientenlist</Button>
      </EditContainer>
    );
  }

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to Patientenlist
      </BackButton>

      {/* Patient Information Section */}
      <PatientSection>
        <SectionTitle>Add Patient</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="firstname">Firstname</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={patient.firstname}
              onChange={handleInputChange}
              placeholder="Vorname"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="name">Lastname</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={patient.name}
              onChange={handleInputChange}
              placeholder="Nachname"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phonenumber">Phonenumber</Label>
            <Input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={patient.phonenumber}
              onChange={handleInputChange}
              placeholder="Telefonnummer"
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
              placeholder="E-Mail"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="birthdate">	Date of Birth</Label>
            <Input
              type="date"
              id="birthdate"
              name="birthdate"
              value={patient.birthdate}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormGrid>
        
        <FormGroup>
          <Label htmlFor="adress">Adress</Label>
          <TextArea
            id="adress"
            name="adress"
            value={patient.adress}
            onChange={handleInputChange}
            placeholder="Adresse"
          />
        </FormGroup>

        <ButtonGroup>
          <Button primary onClick={handleSave} disabled={saving}>
            {saving ? 'Speichere...' : 'Save'}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </PatientSection>

      {/* Treatments Section */}
      <TreatmentsSection>
        <SectionTitle>Treatments of {patient.firstname} {patient.name}</SectionTitle>
        
        {treatmentsLoading && (
          <LoadingMessage>Loading Treatments...</LoadingMessage>
        )}
        
        {treatmentsError && (
          <ErrorMessage>{treatmentsError}</ErrorMessage>
        )}
        
        {!treatmentsLoading && !treatmentsError && treatments.length === 0 && (
          <NoTreatments>No Treatments found.</NoTreatments>
        )}
        
        {!treatmentsLoading && !treatmentsError && treatments.length > 0 && (
          <TreatmentTable>
            <thead>
              <tr>
                <TreatmentTh>Treatment-ID</TreatmentTh>
                <TreatmentTh>Data</TreatmentTh>
                <TreatmentTh>Therapie</TreatmentTh>
                <TreatmentTh>Doctors-ID</TreatmentTh>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treatment) => (
                <TreatmentRow key={treatment.treatmentId}>
                  <TreatmentTd>{treatment.treatmentId}</TreatmentTd>
                  <TreatmentTd>{formatDate(treatment.date)}</TreatmentTd>
                  <TreatmentTd>{treatment.therapy}</TreatmentTd>
                  <TreatmentTd>{treatment.doctorPersonId}</TreatmentTd>
                </TreatmentRow>
              ))}
            </tbody>
          </TreatmentTable>
        )}
      </TreatmentsSection>
    </EditContainer>
  );
}

export default PatientEdit;