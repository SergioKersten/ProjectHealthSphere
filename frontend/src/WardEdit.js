import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { wardAPI, patientAPI, employeeAPI, treatmentAPI } from './services/api';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const WardSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const RelatedDataSection = styled.div`
  background-color: white;
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

const SubsectionTitle = styled.h3`
  color: #495057;
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
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

const FullWidthFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  padding: 0.7rem;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.7rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
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

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
`;

const InfoNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3399ff;
`;

const InfoLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

function WardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Ward State
  const [ward, setWard] = useState({
    wardId: '',
    wardName: '',
    description: '',
    capacity: ''
  });
  
  // Related data states - Note: Since there are no direct ward associations in the backend,
  // we'll show all data but could be filtered by ward in future
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [relatedDataLoading, setRelatedDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Error States
  const [error, setError] = useState(null);
  const [relatedDataError, setRelatedDataError] = useState(null);

  // Load ward data on component mount
  useEffect(() => {
    loadWardData();
    loadRelatedData();
  }, [id]);

  const loadWardData = async () => {
    try {
      setLoading(true);
      const response = await wardAPI.getById(id);
      setWard(response.data);
    } catch (err) {
      setError('Error loading ward data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedData = async () => {
    try {
      setRelatedDataLoading(true);
      setRelatedDataError(null);
      
      // Load all related data
      // Note: In a real application, you might want to filter by ward
      const [patientsResponse, doctorsResponse, treatmentsResponse] = await Promise.all([
        patientAPI.getAll(),
        employeeAPI.getAll(),
        treatmentAPI.getAll()
      ]);
      
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
      setTreatments(treatmentsResponse.data);
    } catch (err) {
      setRelatedDataError('Error loading related data: ' + err.message);
    } finally {
      setRelatedDataLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare data for API - only send updatable fields
      const updateData = {
        wardName: ward.wardName,
        description: ward.description,
        capacity: parseInt(ward.capacity)
      };
      
      await wardAPI.update(id, updateData);
      alert('Ward updated successfully!');
      navigate('/wards');
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/wards');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  if (loading) {
    return <LoadingMessage>Loading ward data...</LoadingMessage>;
  }

  if (error) {
    return (
      <EditContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate('/wards')}>Back to Ward List</Button>
      </EditContainer>
    );
  }

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to Ward List
      </BackButton>

      {/* Ward Information Section */}
      <WardSection>
        <SectionTitle>Edit Ward</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="wardId">Ward ID</Label>
            <Input
              type="number"
              id="wardId"
              name="wardId"
              value={ward.wardId}
              disabled={true}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wardName">Ward Name</Label>
            <Input
              type="text"
              id="wardName"
              name="wardName"
              value={ward.wardName}
              onChange={handleInputChange}
              placeholder="Enter ward name"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              type="number"
              id="capacity"
              name="capacity"
              value={ward.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              min="1"
              disabled={saving}
            />
          </FormGroup>

          <FullWidthFormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={ward.description}
              onChange={handleInputChange}
              placeholder="Enter ward description..."
              disabled={saving}
            />
          </FullWidthFormGroup>
        </FormGrid>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </WardSection>

      {/* Related Data Overview Section */}
      <RelatedDataSection>
        <SectionTitle>Ward Overview</SectionTitle>
        
        {relatedDataLoading && (
          <LoadingMessage>Loading ward overview data...</LoadingMessage>
        )}
        
        {relatedDataError && (
          <ErrorMessage>{relatedDataError}</ErrorMessage>
        )}
        
        {!relatedDataLoading && !relatedDataError && (
          <>
            {/* Statistics Cards */}
            <InfoGrid>
              <InfoCard>
                <InfoNumber>{patients.length}</InfoNumber>
                <InfoLabel>Total Patients</InfoLabel>
              </InfoCard>
              <InfoCard>
                <InfoNumber>{doctors.length}</InfoNumber>
                <InfoLabel>Total Doctors</InfoLabel>
              </InfoCard>
              <InfoCard>
                <InfoNumber>{treatments.length}</InfoNumber>
                <InfoLabel>Total Treatments</InfoLabel>
              </InfoCard>
              <InfoCard>
                <InfoNumber>{ward.capacity}</InfoNumber>
                <InfoLabel>Ward Capacity</InfoLabel>
              </InfoCard>
            </InfoGrid>

            {/* Patients Section */}
            <SubsectionTitle>Patients</SubsectionTitle>
            {patients.length === 0 ? (
              <NoDataMessage>No patients found.</NoDataMessage>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Patient ID</Th>
                    <Th>Name</Th>
                    <Th>Date of Birth</Th>
                    <Th>Phone</Th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 5).map((patient) => (
                    <TableRow key={patient.personId}>
                      <Td>{patient.personId}</Td>
                      <Td>{`${patient.firstname} ${patient.name}`}</Td>
                      <Td>{formatDate(patient.birthdate)}</Td>
                      <Td>{patient.phonenumber}</Td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Doctors Section */}
            <SubsectionTitle>Doctors</SubsectionTitle>
            {doctors.length === 0 ? (
              <NoDataMessage>No doctors found.</NoDataMessage>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Doctor ID</Th>
                    <Th>Name</Th>
                    <Th>Department</Th>
                    <Th>Phone</Th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.slice(0, 5).map((doctor) => (
                    <TableRow key={doctor.personId}>
                      <Td>{doctor.personId}</Td>
                      <Td>{`${doctor.firstname} ${doctor.name}`}</Td>
                      <Td>{doctor.department}</Td>
                      <Td>{doctor.phonenumber}</Td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Treatments Section */}
            <SubsectionTitle>Treatments</SubsectionTitle>
            {treatments.length === 0 ? (
              <NoDataMessage>No treatments found.</NoDataMessage>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Treatment ID</Th>
                    <Th>Date</Th>
                    <Th>Therapy</Th>
                    <Th>Patient ID</Th>
                    <Th>Doctor ID</Th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.slice(0, 5).map((treatment) => (
                    <TableRow key={treatment.treatmentId}>
                      <Td>{treatment.treatmentId}</Td>
                      <Td>{formatDate(treatment.date)}</Td>
                      <Td>{treatment.therapy}</Td>
                      <Td>{treatment.patientPersonId}</Td>
                      <Td>{treatment.doctorPersonId}</Td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
      </RelatedDataSection>
    </EditContainer>
  );
}

export default WardEdit;