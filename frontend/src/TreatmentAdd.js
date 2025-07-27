import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { treatmentAPI, patientAPI, employeeAPI } from './services/api';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TreatmentSection = styled.div`
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

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  
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
  min-height: 80px;
  
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

function TreatmentAdd() {
  const navigate = useNavigate();
  
  // Treatment State for new treatment
  const [treatment, setTreatment] = useState({
    treatmentId: '',
    date: '',
    therapy: '',
    patientPersonId: '',
    doctorPersonId: ''
  });
  
  // Dropdown data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Loading and Error States
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load patients and doctors on component mount
  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      const [patientsResponse, doctorsResponse] = await Promise.all([
        patientAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (err) {
      setError('Error loading dropdown data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTreatment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!treatment.treatmentId || !treatment.date || !treatment.therapy || 
          !treatment.patientPersonId || !treatment.doctorPersonId) {
        setError('All fields are required!');
        return;
      }

      setSaving(true);
      setError(null);
      
      // Prepare data for API
      const treatmentData = {
        ...treatment,
        treatmentId: parseInt(treatment.treatmentId),
        patientPersonId: parseInt(treatment.patientPersonId),
        doctorPersonId: parseInt(treatment.doctorPersonId)
      };
      
      // API Call to create treatment
      await treatmentAPI.create(treatmentData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/treatments');
      }, 1500); // Navigate back to treatment list after 1.5 seconds
      
    } catch (err) {
      setError('Error creating treatment: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/treatments');
  };

  const isFormValid = treatment.treatmentId && treatment.date && treatment.therapy && 
                     treatment.patientPersonId && treatment.doctorPersonId;

  if (loading) {
    return <LoadingMessage>Loading form data...</LoadingMessage>;
  }

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to Treatment List
      </BackButton>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Success Message */}
      {success && <SuccessMessage>Treatment created successfully!</SuccessMessage>}

      {/* Treatment Information Section */}
      <TreatmentSection>
        <SectionTitle>Add New Treatment</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="treatmentId">Treatment ID</Label>
            <Input
              type="number"
              id="treatmentId"
              name="treatmentId"
              value={treatment.treatmentId}
              onChange={handleInputChange}
              placeholder="Enter Treatment ID"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={treatment.date}
              onChange={handleInputChange}
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="patientPersonId">Patient</Label>
            <Select
              id="patientPersonId"
              name="patientPersonId"
              value={treatment.patientPersonId}
              onChange={handleInputChange}
              disabled={saving}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.personId} value={patient.personId}>
                  {patient.firstname} {patient.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="doctorPersonId">Doctor</Label>
            <Select
              id="doctorPersonId"
              name="doctorPersonId"
              value={treatment.doctorPersonId}
              onChange={handleInputChange}
              disabled={saving}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.personId} value={doctor.personId}>
                  {doctor.firstname} {doctor.name} - {doctor.department}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormGrid>

        <FormGroup>
          <Label htmlFor="therapy">Therapy Description</Label>
          <TextArea
            id="therapy"
            name="therapy"
            value={treatment.therapy}
            onChange={handleInputChange}
            placeholder="Enter therapy details..."
            disabled={saving}
          />
        </FormGroup>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={!isFormValid || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </TreatmentSection>
    </EditContainer>
  );
}

export default TreatmentAdd;