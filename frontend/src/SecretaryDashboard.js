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
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
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
  max-width: 300px;
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

// Calendar Styles
const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CalendarHeader = styled.div`
  background-color: #28a745;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarNavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CalendarTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e9ecef;
`;

const CalendarDayHeader = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  color: #495057;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-right: none;
  }
`;

const CalendarDay = styled.div`
  min-height: 120px;
  padding: 0.5rem;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  background-color: ${props => 
    props.$isToday ? '#e3f2fd' : 
    props.$isOtherMonth ? '#f8f9fa' : 'white'};
  position: relative;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: ${props => props.$isOtherMonth ? '#f8f9fa' : '#f0f8ff'};
  }
`;

const CalendarDayNumber = styled.div`
  font-weight: ${props => props.$isToday ? 'bold' : 'normal'};
  color: ${props => 
    props.$isToday ? '#007bff' : 
    props.$isOtherMonth ? '#6c757d' : '#495057'};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const CalendarTreatment = styled.div`
  background-color: ${props => {
    const colors = [
      '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
      '#17a2b8', '#6c757d', '#343a40', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
      '#6610f2', '#e21e7e', '#fd7e14', '#20c997', '#0dcaf0', '#198754', '#ffc107', '#fd7e14'
    ];
    return colors[props.$colorIndex % colors.length];
  }};
  color: ${props => {
    // Für helle Farben dunklen Text verwenden
    const lightColors = ['#ffc107', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'];
    const colors = [
      '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
      '#17a2b8', '#6c757d', '#343a40', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
      '#6610f2', '#e21e7e', '#fd7e14', '#20c997', '#0dcaf0', '#198754', '#ffc107', '#fd7e14'
    ];
    const currentColor = colors[props.$colorIndex % colors.length];
    return lightColors.includes(currentColor) ? '#212529' : 'white';
  }};
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  border-radius: 3px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: opacity 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

const CalendarLegend = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const CalendarLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CalendarLegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${props => props.$color};
`;

const CalendarControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const CalendarViewSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const TreatmentTooltip = styled.div`
  position: absolute;
  background-color: #343a40;
  color: white;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 1000;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  pointer-events: none;
`;

const CapacityBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin: 0.25rem 0;
`;

const CapacityFill = styled.div`
  height: 100%;
  background-color: ${props => {
    if (props.$percentage >= 100) return '#dc3545'; // Rot
    if (props.$percentage >= 80) return '#ffc107';   // Gelb
    return '#28a745';                                // Grün
  }};
  width: ${props => Math.min(props.$percentage, 100)}%;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$percentage > 50 ? 'white' : 'black'};
  font-size: 0.75rem;
  font-weight: bold;
`;

const StatusBadgeWardCapacity = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch (props.$status) {
      case 'available': return '#28a745';
      case 'nearly-full': return '#ffc107';
      case 'full': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

function SecretaryDashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week'
  const [hoveredTreatment, setHoveredTreatment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Calendar Filter State
  const [calendarFilters, setCalendarFilters] = useState({
    doctor: '',
    patient: '',
    ward: ''
  });
  
  // Data States
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardCapacities, setWardCapacities] = useState([]);

  
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
    // Treatment fields
    date: '',
    therapy: '',
    patientPersonId: '',
    doctorPersonId: '',
    wardId: '',
    wardName: '',
    capacity: '',
    description: ''
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
  try {
    setLoading(true);
    setError(null);

    const [patientsRes, doctorsRes, treatmentsRes, wardsRes] = await Promise.all([
      patientAPI.getAll(),
      employeeAPI.getAll(),
      treatmentAPI.getAll(),
      wardAPI.getAll()
    ]);

    setPatients(patientsRes.data || patientsRes);
    setDoctors(doctorsRes.data || doctorsRes);
    setTreatments(treatmentsRes.data || treatmentsRes);
    setWards(wardsRes.data || wardsRes);
    
    // Ward-Kapazitäten laden
    await loadWardCapacities();
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
      date: '',
      therapy: '',
      patientPersonId: '',
      doctorPersonId: '',
      treatmentId: '',
      wardName: '',
      capacity: '',
      description: ''
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
    
    // DEBUG: Log what we're sending
    console.log('Modal Type:', modalType);
    console.log('Modal Mode:', modalMode);
    console.log('Form Data before transformation:', formData);
    
    // Data transformation
    if (modalType === 'patient') {
      data.wardId = data.wardId ? parseInt(data.wardId) : null;
    } else if (modalType === 'doctor') {
      data.wardId = data.wardId ? parseInt(data.wardId) : null;
    } else if (modalType === 'treatment') {
      data.treatmentId = data.treatmentId ? parseInt(data.treatmentId) : undefined;
      data.patientPersonId = parseInt(data.patientPersonId);
      data.doctorPersonId = parseInt(data.doctorPersonId);
    } else if (modalType === 'ward') {
      data.wardId = data.wardId ? parseInt(data.wardId) : undefined;
      data.capacity = parseInt(data.capacity);
    }
    
    // DEBUG: Log transformed data
    console.log('Data after transformation:', data);
    
    if (modalMode === 'add') {
      if (modalType === 'patient') {
        console.log('Creating patient with patientAPI');
        response = await patientAPI.create(data);
      } else if (modalType === 'doctor') {
        console.log('Creating doctor with employeeAPI');
        response = await employeeAPI.create(data);
      } else if (modalType === 'treatment') {
        console.log('Creating treatment with treatmentAPI');
        response = await treatmentAPI.create(data);
      } else if (modalType === 'ward') {
        console.log('Creating ward with wardAPI');
        response = await wardAPI.create(data);
      }
      alert(`${modalType} erfolgreich erstellt!`);
    } else if (modalMode === 'edit' && editingItem) {
      const id = editingItem.personId || editingItem.treatmentId || editingItem.wardId;
      console.log('Editing item with ID:', id);
      
      if (modalType === 'patient') {
        response = await patientAPI.update(id, data);
      } else if (modalType === 'doctor') {
        response = await employeeAPI.update(id, data);
      } else if (modalType === 'treatment') {
        response = await treatmentAPI.update(id, data);
      } else if (modalType === 'ward') {
        response = await wardAPI.update(id, data);
      }
      alert(`${modalType} erfolgreich aktualisiert!`);
    }
    
    console.log('API Response:', response);
    
    // Schließe Modal und lade Seite neu (quick & dirty)
    closeModal();
    window.location.reload();
    
  } catch (err) {
    // Enhanced error handling
    console.error('Full error object:', err);
    console.error('Error response:', err.response);
    console.error('Error message:', err.message);
    
    let errorMessage = 'Unbekannter Fehler';
    
    if (err.response) {
      // Backend error
      console.log('Backend error details:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      });
      errorMessage = err.response.data || `HTTP ${err.response.status}`;
    } else if (err.message) {
      // Network error
      errorMessage = err.message;
    }
    
    alert(`FEHLER: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Sind Sie sicher, dass Sie diese ${type === 'patient' ? 'Patient' : type === 'doctor' ? 'Arzt' : type === 'treatment' ? 'Behandlung' : 'Station'} löschen möchten?`)) {
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
      } else if (type === 'ward') {
        await wardAPI.delete(id);
      }
      
      setSuccess(`${type === 'patient' ? 'Patient' : type === 'doctor' ? 'Arzt' : type === 'treatment' ? 'Behandlung' : 'Station'} erfolgreich gelöscht!`);
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

const loadWardCapacities = async () => {
  try {
    const response = await wardAPI.getAllCapacities();
    setWardCapacities(response.data);
  } catch (err) {
    console.error('Fehler beim Laden der Ward-Kapazitäten:', err);
  }
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
        <ActionButton $variant="success" onClick={() => openModal('ward', 'add')}>
          Neue Station hinzufügen
        </ActionButton>
        
      </ActionButtonsRow>

      {/* Kalender Integration */}
      {renderCalendar()}
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

  const renderWards = () => {
  const filteredWards = getFilteredData(wards, 'ward');

  const getCapacityInfo = (wardId) => {
    return wardCapacities.find(cap => cap.wardId === wardId);
  };

  return (
    <div>
      <ActionButtonsRow>
        <ActionButton $variant="success" onClick={() => openModal('ward', 'add')}>
          Neue Station hinzufügen
        </ActionButton>
        
      </ActionButtonsRow>
      
      <FilterSection>
        <FilterRow>
          <FilterInput
            type="text"
            placeholder="Suche nach Stationsname..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          <ClearButton onClick={clearFilters}>Filter zurücksetzen</ClearButton>
        </FilterRow>
      </FilterSection>

      <DataTable>
        <thead>
          <tr>
            <TableHeader>Station</TableHeader>
            <TableHeader>Kapazität</TableHeader>
            <TableHeader>Zugewiesene Patienten</TableHeader>
            <TableHeader>Aktionen</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredWards.map(ward => {
            const capacityInfo = getCapacityInfo(ward.wardId);

            return (
              <TableRow key={ward.wardId}>
                <TableCell>
                  <strong>{ward.wardName}</strong>
                  <br />
                  <small style={{color: '#6c757d'}}>{ward.description || '-'}</small>
                </TableCell>
                
                <TableCell>
                  {capacityInfo ? (
                    <div>
                      <strong>{capacityInfo.availableCapacity} freie Plätze</strong>
                      <br />
                      <small style={{color: '#6c757d'}}>
                        von {capacityInfo.totalCapacity} Plätzen insgesamt
                      </small>
                    </div>
                  ) : (
                    <span style={{color: '#6c757d'}}>Wird geladen...</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {capacityInfo && capacityInfo.assignedPatients ? (
                    capacityInfo.assignedPatients.length > 0 ? (
                      <div>
                        {capacityInfo.assignedPatients.map(patient => (
                          <div key={patient.personId} style={{
                            fontSize: '0.85rem', 
                            color: '#495057',
                            padding: '0.1rem 0',
                            borderBottom: '1px solid #f8f9fa'
                          }}>
                            📋 {patient.firstname} {patient.name}
                            {patient.email && (
                              <small style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                                ({patient.email})
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <small style={{color: '#6c757d', fontStyle: 'italic'}}>
                        Keine Patienten zugewiesen
                      </small>
                    )
                  ) : null}
                </TableCell>
                
                <TableCell>
                  <ActionButton 
                    $variant="warning"
                    onClick={() => openModal('ward', 'edit', ward)}
                    style={{marginRight: '0.5rem', marginBottom: '0.25rem'}}
                  >
                    Bearbeiten
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={() => handleDelete(ward.wardId, 'ward')}
                  >
                    Löschen
                  </ActionButton>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </DataTable>
      
      {filteredWards.length === 0 && (
        <div style={{textAlign: 'center', padding: '2rem', color: '#6c757d'}}>
          Keine Stationen gefunden.
        </div>
      )}
    </div>
  );
};

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
  };

  const handleCalendarFilterChange = (field, value) => {
    setCalendarFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearCalendarFilters = () => {
    setCalendarFilters({
      doctor: '',
      patient: '',
      ward: ''
    });
  };

  const getFilteredTreatmentsForCalendar = () => {
    return treatments.filter(treatment => {
      // Doctor filter
      if (calendarFilters.doctor && treatment.doctorPersonId.toString() !== calendarFilters.doctor) {
        return false;
      }
      
      // Patient filter
      if (calendarFilters.patient && treatment.patientPersonId.toString() !== calendarFilters.patient) {
        return false;
      }
      
      // Ward filter - check if doctor or patient belongs to selected ward
      if (calendarFilters.ward) {
        const doctor = doctors.find(d => d.personId === treatment.doctorPersonId);
        const patient = patients.find(p => p.personId === treatment.patientPersonId);
        const doctorInWard = doctor && doctor.wardId && doctor.wardId.toString() === calendarFilters.ward;
        const patientInWard = patient && patient.wardId && patient.wardId.toString() === calendarFilters.ward;
        
        if (!doctorInWard && !patientInWard) {
          return false;
        }
      }
      
      return true;
    });
  };

  const getTreatmentsForDate = (date) => {
    const filteredTreatments = getFilteredTreatmentsForCalendar();
    return filteredTreatments.filter(treatment => {
      if (!treatment.date) return false;
      const treatmentDate = new Date(treatment.date);
      return treatmentDate.toDateString() === date.toDateString();
    });
  };

  const getDoctorColor = (doctorId) => {
    const colors = [
      '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
      '#17a2b8', '#6c757d', '#343a40', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
      '#6610f2', '#e21e7e', '#fd7e14', '#20c997', '#0dcaf0', '#198754', '#ffc107', '#fd7e14'
    ];
    // Sortiere Ärzte nach ID für konsistente Reihenfolge und verwende Index
    const sortedDoctors = [...doctors].sort((a, b) => a.personId - b.personId);
    const doctorIndex = sortedDoctors.findIndex(d => d.personId === doctorId);
    return doctorIndex >= 0 ? colors[doctorIndex % colors.length] : colors[0];
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const handleTreatmentHover = (treatment, event) => {
    setHoveredTreatment(treatment);
    setTooltipPosition({
      x: event.clientX + 10,
      y: event.clientY - 10
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    // Generate calendar days
    const calendarDays = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      calendarDays.push({
        date,
        day,
        isOtherMonth: true,
        treatments: getTreatmentsForDate(date)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({
        date,
        day,
        isOtherMonth: false,
        treatments: getTreatmentsForDate(date)
      });
    }
    
    // Next month days
    const totalCells = Math.ceil(calendarDays.length / 7) * 7;
    const remainingCells = totalCells - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      calendarDays.push({
        date,
        day,
        isOtherMonth: true,
        treatments: getTreatmentsForDate(date)
      });
    }

    // Create legend for doctors (based on filtered treatments)
    const filteredTreatments = getFilteredTreatmentsForCalendar();
    const activeDoctors = [...new Set(filteredTreatments.map(t => t.doctorPersonId))]
      .map(id => doctors.find(d => d.personId === id))
      .filter(Boolean);

    return (
      <div>
        {/* Calendar Filters */}
        <FilterSection>
          <h4>📅 Kalender Filter</h4>
          <FilterRow>
            <FilterSelect
              value={calendarFilters.doctor}
              onChange={(e) => handleCalendarFilterChange('doctor', e.target.value)}
            >
              <option value="">Alle Ärzte</option>
              {doctors.map(doctor => (
                <option key={doctor.personId} value={doctor.personId}>
                  {doctor.firstname} {doctor.name} - {doctor.department || 'Kein Fachbereich'}
                </option>
              ))}
            </FilterSelect>
            
            <FilterSelect
              value={calendarFilters.patient}
              onChange={(e) => handleCalendarFilterChange('patient', e.target.value)}
            >
              <option value="">Alle Patienten</option>
              {patients.map(patient => (
                <option key={patient.personId} value={patient.personId}>
                  {patient.firstname} {patient.name}
                </option>
              ))}
            </FilterSelect>
            
            <FilterSelect
              value={calendarFilters.ward}
              onChange={(e) => handleCalendarFilterChange('ward', e.target.value)}
            >
              <option value="">Alle Stationen</option>
              {wards.map(ward => (
                <option key={ward.wardId} value={ward.wardId}>
                  {ward.wardName}
                </option>
              ))}
            </FilterSelect>
            
            <ClearButton onClick={clearCalendarFilters}>
              Filter zurücksetzen
            </ClearButton>
          </FilterRow>
        </FilterSection>

        <CalendarControls>
          <span style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#495057'}}>
            📅 Behandlungskalender
          </span>
        </CalendarControls>

        {activeDoctors.length > 0 && (
          <CalendarLegend>
            <strong>Ärzte:</strong>
            {activeDoctors.map((doctor) => (
              <CalendarLegendItem key={doctor.personId}>
                <CalendarLegendColor $color={getDoctorColor(doctor.personId)} />
                <span>{doctor.firstname} {doctor.name}</span>
              </CalendarLegendItem>
            ))}
          </CalendarLegend>
        )}

        <CalendarContainer>
          <CalendarHeader>
            <CalendarNavButton onClick={() => navigateCalendar(-1)}>
              ‹
            </CalendarNavButton>
            <CalendarTitle>
              {monthNames[month]} {year}
            </CalendarTitle>
            <CalendarNavButton onClick={() => navigateCalendar(1)}>
              ›
            </CalendarNavButton>
          </CalendarHeader>

          <CalendarGrid>
            {dayNames.map(day => (
              <CalendarDayHeader key={day}>{day}</CalendarDayHeader>
            ))}
            
            {calendarDays.map((calendarDay, index) => (
              <CalendarDay
                key={index}
                $isToday={isToday(calendarDay.date)}
                $isOtherMonth={calendarDay.isOtherMonth}
              >
                <CalendarDayNumber
                  $isToday={isToday(calendarDay.date)}
                  $isOtherMonth={calendarDay.isOtherMonth}
                >
                  {calendarDay.day}
                </CalendarDayNumber>
                
                {calendarDay.treatments.map((treatment, treatmentIndex) => {
                  const doctor = doctors.find(d => d.personId === treatment.doctorPersonId);
                  const patient = patients.find(p => p.personId === treatment.patientPersonId);
                  
                  const doctorIndex = [...doctors].sort((a, b) => a.personId - b.personId).findIndex(d => d.personId === treatment.doctorPersonId);
                  
                  return (
                    <CalendarTreatment
                      key={treatment.treatmentId}
                      $colorIndex={doctorIndex >= 0 ? doctorIndex : 0}
                      onClick={() => openModal('treatment', 'edit', treatment)}
                      onMouseEnter={(e) => handleTreatmentHover(treatment, e)}
                      onMouseLeave={() => setHoveredTreatment(null)}
                      title={`${patient ? `${patient.firstname} ${patient.name}` : 'Unbekannt'} - ${doctor ? `Dr. ${doctor.name}` : 'Unbekannt'}`}
                    >
                      {patient ? `${patient.firstname} ${patient.name.charAt(0)}.` : 'N/A'}
                    </CalendarTreatment>
                  );
                })}
              </CalendarDay>
            ))}
          </CalendarGrid>
        </CalendarContainer>

        {hoveredTreatment && (
          <TreatmentTooltip
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y
            }}
          >
            <div><strong>Patient:</strong> {getPatientName(hoveredTreatment.patientPersonId)}</div>
            <div><strong>Arzt:</strong> {getDoctorName(hoveredTreatment.doctorPersonId)}</div>
            <div><strong>Datum:</strong> {new Date(hoveredTreatment.date).toLocaleDateString()}</div>
            {hoveredTreatment.therapy && (
              <div><strong>Therapie:</strong> {hoveredTreatment.therapy}</div>
            )}
          </TreatmentTooltip>
        )}
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
              modalType === 'doctor' ? 'Arzt' : 
              modalType === 'treatment' ? 'Behandlung' : 'Station'
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

            {modalType === 'ward' && (
              <>
                {modalMode === 'edit' && (
                  <FormGroup>
                    <FormLabel>Stations-ID</FormLabel>
                    <FormInput
                      type="number"
                      value={formData.wardId}
                      onChange={(e) => handleFormChange('wardId', e.target.value)}
                      disabled
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <FormLabel>Stationsname *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.wardName}
                    onChange={(e) => handleFormChange('wardName', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Kapazität *</FormLabel>
                  <FormInput
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleFormChange('capacity', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormTextarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Beschreibung der Station eingeben..."
                  />
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
        <Tab 
          $active={activeTab === 'wards'} 
          onClick={() => setActiveTab('wards')}
        >
          Stationen
        </Tab>
      </TabsContainer>

      <ContentArea>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'doctors' && renderDoctors()}
        {activeTab === 'treatments' && renderTreatments()}
        {activeTab === 'wards' && renderWards()}
      </ContentArea>

      {renderModal()}
    </DashboardContainer>
  );
}

export default SecretaryDashboard;