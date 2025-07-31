import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { patientAPI, employeeAPI, treatmentAPI, wardAPI } from './services/api';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
`;

const HeaderSection = styled.div`
  background-color: #28a745;
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

const TabsContainer = styled.div`
  display: flex;
  background-color: #f8f9fa;
  border-radius: 6px 6px 0 0;
  border: 1px solid #ddd;
  margin-bottom: 0;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  background-color: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#007bff' : '#6c757d'};
  border-bottom: ${props => props.$active ? '3px solid #007bff' : '3px solid transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
    background-color: ${props => props.$active ? 'white' : '#e9ecef'};
  }

  &:first-child {
    border-radius: 6px 0 0 0;
  }

  &:last-child {
    border-radius: 0 6px 0 0;
  }
`;

const ContentArea = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 6px 6px;
  padding: 2rem;
  min-height: 600px;
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
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FilterButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

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
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #545b62;
  }
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
                              props.$variant === 'danger' ? '#dc3545' : '#007bff'};
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

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TableHeader = styled.th`
  background-color: #343a40;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #28a745;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.3s;

  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e3f2fd;
  }

  &.selected {
    background-color: #cce5ff;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.$status === 'active' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$status === 'active' ? '#155724' : '#721c24'};
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
  color: #28a745;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #343a40;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

function SecretaryDashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data States
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [wards, setWards] = useState([]);
  
  // Selected Items
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [modalType, setModalType] = useState('patient'); // 'patient', 'doctor', 'treatment'
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter States
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: '',
    ward: '',
    treatmentType: '',
    dateFrom: '',
    dateTo: ''
  });

  // Form State
  const [formData, setFormData] = useState({
    // Patient fields
    firstname: '',
    name: '',
    phonenumber: '',
    email: '',
    birthdate: '',
    adress: '',
    wardId: '',
    // Doctor fields
    department: '',
    salary: '',
    // Treatment fields
    date: '',
    therapy: '',
    patientPersonId: '',
    doctorPersonId: '',
    treatmentId: ''
  });

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

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

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [patientsRes, doctorsRes, treatmentsRes, wardsRes] = await Promise.all([
        patientAPI.getAll(),
        employeeAPI.getAll(),
        treatmentAPI.getAll(),
        wardAPI.getAll()
      ]);
      
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
      setTreatments(treatmentsRes.data || []);
      setWards(wardsRes.data || []);
    } catch (err) {
      setError('Fehler beim Laden der Daten: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      department: '',
      ward: '',
      treatmentType: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstname: '',
      name: '',
      phonenumber: '',
      email: '',
      birthdate: '',
      adress: '',
      wardId: '',
      department: '',
      salary: '',
      date: '',
      therapy: '',
      patientPersonId: '',
      doctorPersonId: '',
      treatmentId: ''
    });
  };

  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setEditingItem(item);
    
    if (mode === 'edit' && item) {
      setFormData({
        ...formData,
        ...item,
        wardId: item.wardId || '',
        patientPersonId: item.patientPersonId || '',
        doctorPersonId: item.doctorPersonId || ''
      });
    } else {
      resetForm();
      if (type === 'treatment') {
        setFormData(prev => ({
          ...prev,
          date: new Date().toISOString().split('T')[0]
        }));
      }
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      const data = { ...formData };
      
      // Data transformation based on type
      if (modalType === 'patient') {
        data.wardId = data.wardId ? parseInt(data.wardId) : null;
      } else if (modalType === 'doctor') {
        data.salary = data.salary ? parseFloat(data.salary) : null;
        data.wardId = data.wardId ? parseInt(data.wardId) : null;
      } else if (modalType === 'treatment') {
        data.treatmentId = data.treatmentId ? parseInt(data.treatmentId) : undefined;
        data.patientPersonId = parseInt(data.patientPersonId);
        data.doctorPersonId = parseInt(data.doctorPersonId);
      }
      
      if (modalMode === 'add') {
        if (modalType === 'patient') {
          response = await patientAPI.create(data);
        } else if (modalType === 'doctor') {
          response = await employeeAPI.create(data);
        } else if (modalType === 'treatment') {
          response = await treatmentAPI.create(data);
        }
        setSuccess(`${modalType === 'patient' ? 'Patient' : modalType === 'doctor' ? 'Arzt' : 'Behandlung'} erfolgreich hinzugefügt!`);
      } else if (modalMode === 'edit') {
        const id = editingItem.personId || editingItem.treatmentId;
        if (modalType === 'patient') {
          response = await patientAPI.update(id, data);
        } else if (modalType === 'doctor') {
          response = await employeeAPI.update(id, data);
        } else if (modalType === 'treatment') {
          response = await treatmentAPI.update(id, data);
        }
        setSuccess(`${modalType === 'patient' ? 'Patient' : modalType === 'doctor' ? 'Arzt' : 'Behandlung'} erfolgreich aktualisiert!`);
      }
      
      await loadAllData();
      closeModal();
    } catch (err) {
      setError('Fehler beim Speichern: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Sind Sie sicher, dass Sie diesen ${type === 'patient' ? 'Patienten' : type === 'doctor' ? 'Arzt' : 'Behandlung'} löschen möchten?`)) {
      return;
    }
    
    setLoading(true);
    try {
      if (type === 'patient') {
        await patientAPI.delete(id);
      } else if (type === 'doctor') {
        await employeeAPI.delete(id);
      } else if (type === 'treatment') {
        await treatmentAPI.delete(id);
      }
      
      setSuccess(`${type === 'patient' ? 'Patient' : type === 'doctor' ? 'Arzt' : 'Behandlung'} erfolgreich gelöscht!`);
      await loadAllData();
    } catch (err) {
      setError('Fehler beim Löschen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on current filters
  const getFilteredData = (data, type) => {
    return data.filter(item => {
      const searchTerm = filters.searchTerm.toLowerCase();
      
      // Search in names
      const matchesSearch = !searchTerm || 
        (item.firstname && item.firstname.toLowerCase().includes(searchTerm)) ||
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.therapy && item.therapy.toLowerCase().includes(searchTerm));
      
      // Department filter (for doctors)
      const matchesDepartment = !filters.department || 
        (item.department && item.department === filters.department);
      
      // Ward filter
      const matchesWard = !filters.ward || 
        (item.wardId && item.wardId.toString() === filters.ward);
      
      // Treatment type filter
      const matchesTreatmentType = !filters.treatmentType || 
        (item.therapy && item.therapy.toLowerCase().includes(filters.treatmentType.toLowerCase()));
      
      // Date filters
      const matchesDateFrom = !filters.dateFrom || !item.date ||
        new Date(item.date) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || !item.date ||
        new Date(item.date) <= new Date(filters.dateTo);
      
      return matchesSearch && matchesDepartment && matchesWard && 
             matchesTreatmentType && matchesDateFrom && matchesDateTo;
    });
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.personId === patientId);
    return patient ? `${patient.firstname} ${patient.name}` : 'Unbekannt';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.personId === doctorId);
    return doctor ? `${doctor.firstname} ${doctor.name}` : 'Unbekannt';
  };

  const getWardName = (wardId) => {
    const ward = wards.find(w => w.wardId === wardId);
    return ward ? ward.wardName : 'Keine Station';
  };

  const renderOverview = () => (
    <div>
      <StatsGrid>
        <StatCard>
          <StatNumber>{patients.length}</StatNumber>
          <StatLabel>Patienten gesamt</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{doctors.length}</StatNumber>
          <StatLabel>Ärzte gesamt</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{treatments.length}</StatNumber>
          <StatLabel>Behandlungen gesamt</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{wards.length}</StatNumber>
          <StatLabel>Stationen gesamt</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <FilterSection>
        <h4>Schnellfilter</h4>
        <FilterRow>
          <FilterInput
            type="text"
            placeholder="Suche nach Namen..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          <FilterSelect
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">Alle Fachbereiche</option>
            {[...new Set(doctors.map(d => d.department).filter(Boolean))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filters.ward}
            onChange={(e) => handleFilterChange('ward', e.target.value)}
          >
            <option value="">Alle Stationen</option>
            {wards.map(ward => (
              <option key={ward.wardId} value={ward.wardId}>{ward.wardName}</option>
            ))}
          </FilterSelect>
          <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
        </FilterRow>
      </FilterSection>

      <ActionButtonsRow>
        <ActionButton $variant="success" onClick={() => openModal('patient', 'add')}>
          Neuen Patienten hinzufügen
        </ActionButton>
        <ActionButton $variant="success" onClick={() => openModal('doctor', 'add')}>
          Neuen Arzt hinzufügen
        </ActionButton>
        <ActionButton $variant="success" onClick={() => openModal('treatment', 'add')}>
          Neue Behandlung hinzufügen
        </ActionButton>
        <ActionButton onClick={loadAllData} disabled={loading}>
          Daten aktualisieren
        </ActionButton>
      </ActionButtonsRow>
    </div>
  );

  const renderPatients = () => {
    const filteredPatients = getFilteredData(patients, 'patient');
    
    return (
      <div>
        <ActionButtonsRow>
          <ActionButton $variant="success" onClick={() => openModal('patient', 'add')}>
            Neuen Patienten hinzufügen
          </ActionButton>
        </ActionButtonsRow>
        
        <FilterSection>
          <FilterRow>
            <FilterInput
              type="text"
              placeholder="Suche nach Patientenname..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
            <FilterSelect
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
            >
              <option value="">Alle Stationen</option>
              {wards.map(ward => (
                <option key={ward.wardId} value={ward.wardId}>{ward.wardName}</option>
              ))}
            </FilterSelect>
            <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
          </FilterRow>
        </FilterSection>

        <DataTable>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Telefon</TableHeader>
              <TableHeader>E-Mail</TableHeader>
              <TableHeader>Geburtsdatum</TableHeader>
              <TableHeader>Station</TableHeader>
              <TableHeader>Aktionen</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <TableRow key={patient.personId}>
                <TableCell>{patient.firstname} {patient.name}</TableCell>
                <TableCell>{patient.phonenumber || '-'}</TableCell>
                <TableCell>{patient.email || '-'}</TableCell>
                <TableCell>
                  {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{getWardName(patient.wardId)}</TableCell>
                <TableCell>
                  <ActionButton 
                    $variant="warning"
                    onClick={() => openModal('patient', 'edit', patient)}
                    style={{marginRight: '0.5rem'}}
                  >
                    Bearbeiten
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={() => handleDelete(patient.personId, 'patient')}
                  >
                    Löschen
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </DataTable>
      </div>
    );
  };

  const renderDoctors = () => {
    const filteredDoctors = getFilteredData(doctors, 'doctor');
    
    return (
      <div>
        <ActionButtonsRow>
          <ActionButton $variant="success" onClick={() => openModal('doctor', 'add')}>
            Neuen Arzt hinzufügen
          </ActionButton>
        </ActionButtonsRow>
        
        <FilterSection>
          <FilterRow>
            <FilterInput
              type="text"
              placeholder="Suche nach Arztname..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
            <FilterSelect
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">Alle Fachbereiche</option>
              {[...new Set(doctors.map(d => d.department).filter(Boolean))].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </FilterSelect>
            <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
          </FilterRow>
        </FilterSection>

        <DataTable>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Fachbereich</TableHeader>
              <TableHeader>Telefon</TableHeader>
              <TableHeader>E-Mail</TableHeader>
              <TableHeader>Station</TableHeader>
              <TableHeader>Aktionen</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(doctor => (
              <TableRow key={doctor.personId}>
                <TableCell>{doctor.firstname} {doctor.name}</TableCell>
                <TableCell>{doctor.department || '-'}</TableCell>
                <TableCell>{doctor.phonenumber || '-'}</TableCell>
                <TableCell>{doctor.email || '-'}</TableCell>
                <TableCell>{getWardName(doctor.wardId)}</TableCell>
                <TableCell>
                  <ActionButton 
                    $variant="warning"
                    onClick={() => openModal('doctor', 'edit', doctor)}
                    style={{marginRight: '0.5rem'}}
                  >
                    Bearbeiten
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={() => handleDelete(doctor.personId, 'doctor')}
                  >
                    Löschen
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </DataTable>
      </div>
    );
  };

  const renderTreatments = () => {
    const filteredTreatments = getFilteredData(treatments, 'treatment');
    
    return (
      <div>
        <ActionButtonsRow>
          <ActionButton $variant="success" onClick={() => openModal('treatment', 'add')}>
            Neue Behandlung hinzufügen
          </ActionButton>
        </ActionButtonsRow>
        
        <FilterSection>
          <FilterRow>
            <FilterInput
              type="text"
              placeholder="Suche nach Behandlung..."
              value={filters.treatmentType}
              onChange={(e) => handleFilterChange('treatmentType', e.target.value)}
            />
            <FilterInput
              type="date"
              placeholder="Von Datum"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
            <FilterInput
              type="date"
              placeholder="Bis Datum"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
            <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
          </FilterRow>
        </FilterSection>

        <DataTable>
          <thead>
            <tr>
              <TableHeader>Behandlungs-ID</TableHeader>
              <TableHeader>Datum</TableHeader>
              <TableHeader>Patient</TableHeader>
              <TableHeader>Arzt</TableHeader>
              <TableHeader>Therapie</TableHeader>
              <TableHeader>Aktionen</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map(treatment => (
              <TableRow key={treatment.treatmentId}>
                <TableCell>{treatment.treatmentId}</TableCell>
                <TableCell>
                  {treatment.date ? new Date(treatment.date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{getPatientName(treatment.patientPersonId)}</TableCell>
                <TableCell>{getDoctorName(treatment.doctorPersonId)}</TableCell>
                <TableCell>{treatment.therapy || '-'}</TableCell>
                <TableCell>
                  <ActionButton 
                    $variant="warning"
                    onClick={() => openModal('treatment', 'edit', treatment)}
                    style={{marginRight: '0.5rem'}}
                  >
                    Bearbeiten
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={() => handleDelete(treatment.treatmentId, 'treatment')}
                  >
                    Löschen
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </DataTable>
      </div>
    );
  };

  const renderModal = () => {
    if (!modalOpen) return null;

    return (
      <ModalOverlay onClick={closeModal}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            {modalMode === 'add' ? 'Hinzufügen' : 'Bearbeiten'} - {
              modalType === 'patient' ? 'Patient' :
              modalType === 'doctor' ? 'Arzt' : 'Behandlung'
            }
          </ModalHeader>
          
          <form onSubmit={handleSubmit}>
            {modalType === 'patient' && (
              <>
                <FormGroup>
                  <FormLabel>Vorname *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleFormChange('firstname', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Nachname *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormInput
                    type="tel"
                    value={formData.phonenumber}
                    onChange={(e) => handleFormChange('phonenumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>E-Mail</FormLabel>
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Geburtsdatum</FormLabel>
                  <FormInput
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => handleFormChange('birthdate', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Adresse</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.adress}
                    onChange={(e) => handleFormChange('adress', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Station</FormLabel>
                  <FormSelect
                    value={formData.wardId}
                    onChange={(e) => handleFormChange('wardId', e.target.value)}
                  >
                    <option value="">Station auswählen</option>
                    {wards.map(ward => (
                      <option key={ward.wardId} value={ward.wardId}>
                        {ward.wardName} (Kapazität: {ward.capacity})
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </>
            )}

            {modalType === 'doctor' && (
              <>
                <FormGroup>
                  <FormLabel>Vorname *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleFormChange('firstname', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Nachname *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Fachbereich *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleFormChange('department', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormInput
                    type="tel"
                    value={formData.phonenumber}
                    onChange={(e) => handleFormChange('phonenumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>E-Mail</FormLabel>
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Gehalt</FormLabel>
                  <FormInput
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => handleFormChange('salary', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Station</FormLabel>
                  <FormSelect
                    value={formData.wardId}
                    onChange={(e) => handleFormChange('wardId', e.target.value)}
                  >
                    <option value="">Station auswählen</option>
                    {wards.map(ward => (
                      <option key={ward.wardId} value={ward.wardId}>
                        {ward.wardName}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </>
            )}

            {modalType === 'treatment' && (
              <>
                {modalMode === 'edit' && (
                  <FormGroup>
                    <FormLabel>Behandlungs-ID</FormLabel>
                    <FormInput
                      type="number"
                      value={formData.treatmentId}
                      onChange={(e) => handleFormChange('treatmentId', e.target.value)}
                      disabled
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <FormLabel>Datum *</FormLabel>
                  <FormInput
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Patient *</FormLabel>
                  <FormSelect
                    value={formData.patientPersonId}
                    onChange={(e) => handleFormChange('patientPersonId', e.target.value)}
                    required
                  >
                    <option value="">Patient auswählen</option>
                    {patients.map(patient => (
                      <option key={patient.personId} value={patient.personId}>
                        {patient.firstname} {patient.name}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Arzt *</FormLabel>
                  <FormSelect
                    value={formData.doctorPersonId}
                    onChange={(e) => handleFormChange('doctorPersonId', e.target.value)}
                    required
                  >
                    <option value="">Arzt auswählen</option>
                    {doctors.map(doctor => (
                      <option key={doctor.personId} value={doctor.personId}>
                        {doctor.firstname} {doctor.name} - {doctor.department}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Therapiebeschreibung</FormLabel>
                  <FormTextarea
                    value={formData.therapy}
                    onChange={(e) => handleFormChange('therapy', e.target.value)}
                    placeholder="Beschreibung der Therapie eingeben..."
                  />
                </FormGroup>
              </>
            )}

            <ModalActions>
              <ActionButton type="button" onClick={closeModal}>
                Abbrechen
              </ActionButton>
              <ActionButton type="submit" $variant="success" disabled={loading}>
                {loading ? 'Speichere...' : 'Speichern'}
              </ActionButton>
            </ModalActions>
          </form>
        </Modal>
      </ModalOverlay>
    );
  };

  if (loading && !modalOpen) {
    return (
      <DashboardContainer>
        <LoadingSpinner>Lade Daten...</LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <HeaderSection>
        <DashboardTitle>Sekretariat Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Vollständige Verwaltung von Patienten, Ärzten und Behandlungen
        </DashboardSubtitle>
      </HeaderSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <TabsContainer>
        <Tab 
          $active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Übersicht
        </Tab>
        <Tab 
          $active={activeTab === 'patients'} 
          onClick={() => setActiveTab('patients')}
        >
          Patienten
        </Tab>
        <Tab 
          $active={activeTab === 'doctors'} 
          onClick={() => setActiveTab('doctors')}
        >
          Ärzte
        </Tab>
        <Tab 
          $active={activeTab === 'treatments'} 
          onClick={() => setActiveTab('treatments')}
        >
          Behandlungen
        </Tab>
      </TabsContainer>

      <ContentArea>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'doctors' && renderDoctors()}
        {activeTab === 'treatments' && renderTreatments()}
      </ContentArea>

      {renderModal()}
    </DashboardContainer>
  );
}

export default SecretaryDashboard;