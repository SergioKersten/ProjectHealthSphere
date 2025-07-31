import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { employeeAPI, treatmentAPI, patientAPI } from './services/api';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #3399ff;
  color: white;
  padding: 1rem;
  border-radius: 6px;
`;

const DoctorSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 250px;
  background-color: white;
  color: #333;
`;

const FilterSection = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
`;

const FilterButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ClearButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #545b62;
  }
`;

const TreatmentGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`;

const TreatmentCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.$isUpdated ? '#28a745' : '#007bff'};
  
  ${props => props.$isUpdated && `
    animation: highlight 2s ease-in-out;
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  `}
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
  
  @keyframes highlight {
    0% { background-color: #d4edda; }
    100% { background-color: white; }
  }
`;

const PatientName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const TreatmentDate = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TreatmentType = styled.div`
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const TherapyDescription = styled.div`
  color: #495057;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const UpdateIndicator = styled.div`
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  display: inline-block;
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  grid-column: 1 / -1;
`;

const StatsSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  flex: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

function DoctorDashboard() {
  // State Management
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedTreatments, setUpdatedTreatments] = useState(new Set());

  // Filter States
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    treatmentType: '',
    patientName: ''
  });

  // Load initial data
  useEffect(() => {
    loadDoctors();
    loadPatients();
  }, []);

  // Load treatments when doctor is selected
  useEffect(() => {
    if (selectedDoctorId) {
      loadTreatments();
    } else {
      setTreatments([]);
      setFilteredTreatments([]);
    }
  }, [selectedDoctorId]);

  // Apply filters when treatments or filters change
  useEffect(() => {
    applyFilters();
  }, [treatments, filters]);

  // Simulate real-time updates (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate treatment updates
      if (Math.random() < 0.1 && filteredTreatments.length > 0) { // 10% chance every 5 seconds
        const randomTreatment = filteredTreatments[Math.floor(Math.random() * filteredTreatments.length)];
        setUpdatedTreatments(prev => new Set([...prev, randomTreatment.treatmentId]));
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setUpdatedTreatments(prev => {
            const newSet = new Set(prev);
            newSet.delete(randomTreatment.treatmentId);
            return newSet;
          });
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredTreatments]);

  const loadDoctors = async () => {
    try {
      const response = await employeeAPI.getAll();
      setDoctors(response.data);
    } catch (err) {
      setError('Fehler beim Laden der Ärzte: ' + err.message);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (err) {
      setError('Fehler beim Laden der Patienten: ' + err.message);
    }
  };

  const loadTreatments = async () => {
    if (!selectedDoctorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await treatmentAPI.getByDoctorId(selectedDoctorId);
      setTreatments(response.data);
    } catch (err) {
      setError('Fehler beim Laden der Behandlungen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...treatments];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(treatment => 
        new Date(treatment.date) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(treatment => 
        new Date(treatment.date) <= new Date(filters.endDate)
      );
    }

    // Filter by treatment type (therapy content)
    if (filters.treatmentType) {
      filtered = filtered.filter(treatment =>
        treatment.therapy && 
        treatment.therapy.toLowerCase().includes(filters.treatmentType.toLowerCase())
      );
    }

    // Filter by patient name
    if (filters.patientName) {
      filtered = filtered.filter(treatment => {
        const patient = patients.find(p => p.personId === treatment.patientPersonId);
        if (!patient) return false;
        const fullName = `${patient.firstname} ${patient.name}`.toLowerCase();
        return fullName.includes(filters.patientName.toLowerCase());
      });
    }

    setFilteredTreatments(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      treatmentType: '',
      patientName: ''
    });
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.personId === patientId);
    return patient ? `${patient.firstname} ${patient.name}` : 'Unbekannter Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.personId === parseInt(doctorId));
    return doctor ? `${doctor.firstname} ${doctor.name}` : 'Arzt auswählen';
  };

  const getTreatmentTypeFromTherapy = (therapy) => {
    if (!therapy) return 'Allgemein';
    const therapyLower = therapy.toLowerCase();
    if (therapyLower.includes('physiotherapie') || therapyLower.includes('physio')) return 'Physiotherapie';
    if (therapyLower.includes('operation') || therapyLower.includes('chirurg')) return 'Chirurgie';
    if (therapyLower.includes('medikament') || therapyLower.includes('arzne')) return 'Medikamentös';
    if (therapyLower.includes('diagnostik') || therapyLower.includes('untersuchung')) return 'Diagnostik';
    return 'Allgemein';
  };

  // Calculate statistics
  const todayTreatments = filteredTreatments.filter(t => 
    new Date(t.date).toDateString() === new Date().toDateString()
  ).length;
  
  const upcomingTreatments = filteredTreatments.filter(t => 
    new Date(t.date) > new Date()
  ).length;

  return (
    <DashboardContainer>
      <HeaderSection>
        <h2>Arzt Dashboard</h2>
        <DoctorSelector 
          value={selectedDoctorId} 
          onChange={(e) => setSelectedDoctorId(e.target.value)}
        >
          <option value="">Arzt auswählen...</option>
          {doctors.map(doctor => (
            <option key={doctor.personId} value={doctor.personId}>
              {doctor.firstname} {doctor.name} - {doctor.department}
            </option>
          ))}
        </DoctorSelector>
      </HeaderSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {selectedDoctorId && (
        <>
          <StatsSection>
            <StatCard>
              <StatNumber>{filteredTreatments.length}</StatNumber>
              <StatLabel>Gesamt Behandlungen</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{todayTreatments}</StatNumber>
              <StatLabel>Heute</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{upcomingTreatments}</StatNumber>
              <StatLabel>Anstehend</StatLabel>
            </StatCard>
          </StatsSection>

          <FilterSection>
            <h4>Filter</h4>
            <FilterRow>
              <div>
                <label>Von Datum:</label>
                <FilterInput
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label>Bis Datum:</label>
                <FilterInput
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div>
                <label>Behandlungstyp:</label>
                <FilterInput
                  type="text"
                  placeholder="z.B. Physiotherapie, Operation..."
                  value={filters.treatmentType}
                  onChange={(e) => handleFilterChange('treatmentType', e.target.value)}
                />
              </div>
            </FilterRow>
            <FilterRow>
              <div>
                <label>Patientenname:</label>
                <FilterInput
                  type="text"
                  placeholder="Vor- oder Nachname eingeben..."
                  value={filters.patientName}
                  onChange={(e) => handleFilterChange('patientName', e.target.value)}
                />
              </div>
              <FilterButton onClick={applyFilters}>Filter anwenden</FilterButton>
              <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
            </FilterRow>
          </FilterSection>

          {loading ? (
            <LoadingSpinner>Lade Behandlungen...</LoadingSpinner>
          ) : (
            <TreatmentGrid>
              {filteredTreatments.length === 0 ? (
                <EmptyState>
                  <h3>Keine Behandlungen gefunden</h3>
                  <p>Für den ausgewählten Arzt und die gesetzten Filter wurden keine Behandlungen gefunden.</p>
                </EmptyState>
              ) : (
                filteredTreatments.map(treatment => (
                  <TreatmentCard 
                    key={treatment.treatmentId}
                    $isUpdated={updatedTreatments.has(treatment.treatmentId)}
                  >
                    <PatientName>{getPatientName(treatment.patientPersonId)}</PatientName>
                    <TreatmentDate>
                      {new Date(treatment.date).toLocaleDateString('de-DE')} - 
                      ID: {treatment.treatmentId}
                    </TreatmentDate>
                    <TreatmentType>
                      {getTreatmentTypeFromTherapy(treatment.therapy)}
                    </TreatmentType>
                    <TherapyDescription>
                      {treatment.therapy || 'Keine Therapiebeschreibung verfügbar'}
                    </TherapyDescription>
                    {updatedTreatments.has(treatment.treatmentId) && (
                      <UpdateIndicator>Kürzlich aktualisiert</UpdateIndicator>
                    )}
                  </TreatmentCard>
                ))
              )}
            </TreatmentGrid>
          )}
        </>
      )}

      {!selectedDoctorId && (
        <EmptyState>
          <h3>Willkommen im Arzt Dashboard</h3>
          <p>Bitte wählen Sie einen Arzt aus dem Dropdown-Menü aus, um die zugewiesenen Behandlungen anzuzeigen.</p>
        </EmptyState>
      )}
    </DashboardContainer>
  );
}

export default DoctorDashboard;