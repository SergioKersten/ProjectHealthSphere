import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { employeeAPI, treatmentAPI, patientAPI } from './services/api';

// Styled Components - Adapted from SecretaryDashboard
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
`;

const HeaderSection = styled.div`
  background-color: #28a745; /* Changed to green */
  color: white;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
  text-align: center;
`;

const DashboardTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
`;

const DashboardSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const DoctorSelectorSection = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const DoctorSelector = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }
`;

const FilterSection = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
  font-size: 0.9rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }
`;

const FilterButton = styled.button`
  background-color: #28a745; /* Changed to green */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const ClearButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #545b62;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #28a745; /* Changed to green */
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TreatmentGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`;

const TreatmentCard = styled.div`
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const PatientName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
`;

const TreatmentDate = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const TreatmentType = styled.div`
  background-color: #e8f5e8;
  color: #28a745;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TherapyDescription = styled.div`
  color: #495057;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #28a745;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6c757d;
  grid-column: 1 / -1;
  background-color: white;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #adb5bd;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #6c757d;
`;

const EmptyStateText = styled.p`
  margin: 0;
  color: #adb5bd;
  font-size: 1.1rem;
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
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: ${props => props.$variant === 'success' ? '#28a745' : 
                              props.$variant === 'warning' ? '#ffc107' : 
                              props.$variant === 'danger' ? '#dc3545' : '#28a745'};
  color: ${props => props.$variant === 'warning' ? '#212529' : 'white'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
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
  const [success, setSuccess] = useState(null);

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

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setDoctors(response.data || []);
    } catch (err) {
      setError('Fehler beim Laden der Ärzte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data || []);
    } catch (err) {
      setError('Fehler beim Laden der Patienten: ' + err.message);
    }
  };

  const loadTreatments = async () => {
    if (!selectedDoctorId) return;
    
    try {
      setLoading(true);
      const response = await treatmentAPI.getByDoctorId(selectedDoctorId);
      setTreatments(response.data || []);
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
    return doctor ? `${doctor.firstname} ${doctor.name}` : 'Unbekannter Arzt';
  };

  const getDoctorInfo = (doctorId) => {
    const doctor = doctors.find(d => d.personId === parseInt(doctorId));
    return doctor ? {
      name: `${doctor.firstname} ${doctor.name}`,
      department: doctor.department || 'Kein Fachbereich',
      email: doctor.email || 'Keine E-Mail',
      phone: doctor.phonenumber || 'Keine Telefonnummer'
    } : null;
  };

  const getTodaysTreatments = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return treatments.filter(treatment => {
      if (!treatment.date) return false;
      const treatmentDate = new Date(treatment.date).toISOString().split('T')[0];
      return treatmentDate === todayString;
    });
  };

  const refreshData = async () => {
    await loadDoctors();
    await loadPatients();
    if (selectedDoctorId) {
      await loadTreatments();
    }
    setSuccess('Daten erfolgreich aktualisiert!');
  };

  if (loading && !selectedDoctorId) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Lade Daten...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  const selectedDoctor = getDoctorInfo(selectedDoctorId);

  return (
    <DashboardContainer>
      <HeaderSection>
        <DashboardTitle>👨‍⚕️ Arzt Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Persönliche Behandlungsübersicht und Patientenverwaltung
        </DashboardSubtitle>
      </HeaderSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <DoctorSelectorSection>
        <h4 style={{margin: '0 0 1rem 0', color: '#495057'}}>🔍 Arzt auswählen</h4>
        <DoctorSelector
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
        >
          <option value="">Bitte einen Arzt auswählen...</option>
          {doctors.map(doctor => (
            <option key={doctor.personId} value={doctor.personId}>
              {doctor.firstname} {doctor.name} - {doctor.department || 'Kein Fachbereich'}
            </option>
          ))}
        </DoctorSelector>
      </DoctorSelectorSection>

      {selectedDoctorId && selectedDoctor && (
        <>
          <StatsGrid>
            <StatCard>
              <StatNumber>{getTodaysTreatments().length}</StatNumber>
              <StatLabel>Behandlungen heute</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{treatments.length}</StatNumber>
              <StatLabel>Behandlungen gesamt</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{new Set(treatments.map(t => t.patientPersonId)).size}</StatNumber>
              <StatLabel>Verschiedene Patienten</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{selectedDoctor.department}</StatNumber>
              <StatLabel>Fachbereich</StatLabel>
            </StatCard>
          </StatsGrid>

          

          <FilterSection>
            <h4 style={{margin: '0 0 1rem 0', color: '#495057'}}>🔍 Behandlungen filtern</h4>
            <FilterRow>
              <FilterInput
                type="date"
                placeholder="Von Datum"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <FilterInput
                type="date"
                placeholder="Bis Datum"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
              <FilterInput
                type="text"
                placeholder="Behandlungstyp suchen..."
                value={filters.treatmentType}
                onChange={(e) => handleFilterChange('treatmentType', e.target.value)}
              />
              <FilterInput
                type="text"
                placeholder="Patientenname suchen..."
                value={filters.patientName}
                onChange={(e) => handleFilterChange('patientName', e.target.value)}
              />
              <ClearButton onClick={clearFilters}>
                Filter zurücksetzen
              </ClearButton>
            </FilterRow>
          </FilterSection>

          {loading ? (
            <LoadingSpinner>Lade Behandlungen...</LoadingSpinner>
          ) : filteredTreatments.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <EmptyStateTitle>Keine Behandlungen gefunden</EmptyStateTitle>
              <EmptyStateText>
                {treatments.length === 0 
                  ? `Dr. ${selectedDoctor.name} hat noch keine Behandlungen.`
                  : 'Keine Behandlungen entsprechen den aktuellen Filterkriterien.'
                }
              </EmptyStateText>
            </EmptyState>
          ) : (
            <TreatmentGrid>
              {filteredTreatments.map(treatment => {
                const patient = patients.find(p => p.personId === treatment.patientPersonId);
                
                return (
                  <TreatmentCard key={treatment.treatmentId}>
                    <PatientName>
                      👤 {patient ? `${patient.firstname} ${patient.name}` : 'Unbekannter Patient'}
                    </PatientName>
                    
                    <TreatmentDate>
                      📅 {treatment.date ? new Date(treatment.date).toLocaleDateString('de-DE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Kein Datum'}
                    </TreatmentDate>
                    
                    
                    
                    {treatment.therapy && (
                      <TherapyDescription>
                        <strong>Therapiebeschreibung:</strong><br />
                        {treatment.therapy}
                      </TherapyDescription>
                    )}
                    
                    {patient && (
                      <div style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                        <div style={{fontSize: '0.9rem', color: '#6c757d'}}>
                          <strong>📞 Kontakt:</strong> {patient.phonenumber || 'Nicht verfügbar'}<br />
                          <strong>📧 E-Mail:</strong> {patient.email || 'Nicht verfügbar'}
                        </div>
                      </div>
                    )}
                  </TreatmentCard>
                );
              })}
            </TreatmentGrid>
          )}
        </>
      )}
    </DashboardContainer>
  );
}

export default DoctorDashboard;