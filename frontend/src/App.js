import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';
import { patientAPI, employeeAPI, treatmentAPI, wardAPI } from './services/api';

import EntityAdd from './EntityAdd';
import EntityEdit from './EntityEdit';
import DoctorDashboard from './DoctorDashboard';
import SecretaryDashboard from './SecretaryDashboard'; // Neuer Import

// Import configurations
import { 
  patientConfig, 
  doctorConfig, 
  treatmentConfig, 
  wardConfig,
  dependentDataConfigs,
  relatedDataConfigs
} from './entityConfigs';

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header1 = styled.div`
  display: flex;
  padding-bottom: 10px;
`;

const ImageWrapper = styled.div`
  height: 200px;
  width: auto;
`;

const StyledImg = styled.img`
  height: 200px;
  width: auto;
`;

const Container = styled.div`
  display: flex;
  font-family: Arial, sans-serif;
`;

const SidebarContainer = styled.div`
  width: 250px; /* Erweitert für längere Labels */
  background-color: #f1f1f1;
  padding: 1rem;
  min-height: 100vh;
  border-right: 2px solid #e9ecef;
`;

const SidebarItem = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ $active }) => ($active ? '#007bff' : '#000')};
  background-color: ${({ $active }) => ($active ? '#e3f2fd' : 'transparent')};
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
  border-left: ${({ $active }) => ($active ? '4px solid #007bff' : '4px solid transparent')};
  transition: all 0.3s ease;
  
  &:hover {
    color: #007bff;
    background-color: #f8f9fa;
    transform: translateX(2px);
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SidebarSectionTitle = styled.h4`
  color: #6c757d;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
`;

const Content = styled.div`
  flex: 1;
  padding: 0 2rem 0 2rem;
  max-width: ${({ $fullWidth }) => ($fullWidth ? 'none' : '800px')};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3399ff;
  color: white;
  padding-left: 1rem;
  border-radius: 6px 6px 0 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #ccc;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ActionButton = styled.button`
  background-color: ${({ type }) => (type === 'edit' ? '#ffc107' : '#dc3545')};
  color: ${({ type }) => (type === 'edit' ? '#212529' : 'white')};
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

// Component Functions
function PatientAdd() {
  return (
    <EntityAdd
      entityType="patient"
      entityConfig={patientConfig}
      apiService={patientAPI}
      redirectPath="/patients"
      dependentData={{ wards: dependentDataConfigs.wards }}
      relatedDataConfig={relatedDataConfigs.patientTreatments}
    />
  );
}

function PatientEdit() {
  return (
    <EntityEdit
      entityType="patient"
      entityConfig={{
        ...patientConfig,
        title: 'Edit Patient'
      }}
      apiService={patientAPI}
      redirectPath="/patients"
      dependentData={{ wards: dependentDataConfigs.wards }}
      relatedDataConfig={relatedDataConfigs.patientTreatments}
    />
  );
}

function DoctorAdd() {
  return (
    <EntityAdd
      entityType="doctor"
      entityConfig={doctorConfig}
      apiService={employeeAPI}
      redirectPath="/doctors"
      dependentData={{ wards: dependentDataConfigs.wards }}
      relatedDataConfig={relatedDataConfigs.doctorTreatments}
    />
  );
}

function DoctorEdit() {
  return (
    <EntityEdit
      entityType="doctor"
      entityConfig={{
        ...doctorConfig,
        title: 'Edit Doctor'
      }}
      apiService={employeeAPI}
      redirectPath="/doctors"
      dependentData={{ wards: dependentDataConfigs.wards }}
      relatedDataConfig={relatedDataConfigs.doctorTreatments}
    />
  );
}

function TreatmentAdd() {
  return (
    <EntityAdd
      entityType="treatment"
      entityConfig={treatmentConfig}
      apiService={treatmentAPI}
      redirectPath="/treatments"
      dependentData={{ 
        patients: dependentDataConfigs.patients,
        doctors: dependentDataConfigs.doctors
      }}
    />
  );
}

function TreatmentEdit() {
  return (
    <EntityEdit
      entityType="treatment"
      entityConfig={{
        ...treatmentConfig,
        title: 'Edit Treatment'
      }}
      apiService={treatmentAPI}
      redirectPath="/treatments"
      dependentData={{ 
        patients: dependentDataConfigs.patients,
        doctors: dependentDataConfigs.doctors
      }}
    />
  );
}

function WardAdd() {
  return (
    <EntityAdd
      entityType="ward"
      entityConfig={wardConfig}
      apiService={wardAPI}
      redirectPath="/wards"
    />
  );
}

function WardEdit() {
  return (
    <EntityEdit
      entityType="ward"
      entityConfig={{
        ...wardConfig,
        title: 'Edit Ward'
      }}
      apiService={wardAPI}
      redirectPath="/wards"
    />
  );
}

// Sidebar Navigation Component
function SidebarNav() {
  const location = useLocation();
  
  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarSectionTitle>Dashboards</SidebarSectionTitle>
        <SidebarItem 
          to="/secretary-dashboard" 
          $active={location.pathname === '/secretary-dashboard'}
        >
          🏥 Sekretariat Dashboard
        </SidebarItem>
        <SidebarItem 
          to="/doctor-dashboard" 
          $active={location.pathname === '/doctor-dashboard'}
        >
          👨‍⚕️ Arzt Dashboard
        </SidebarItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarSectionTitle>Entitäten verwalten</SidebarSectionTitle>
        <SidebarItem 
          to="/patients" 
          $active={location.pathname === '/patients' || location.pathname === '/' || 
                   location.pathname.startsWith('/patients/')}
        >
          👥 Patienten
        </SidebarItem>
        <SidebarItem 
          to="/doctors" 
          $active={location.pathname === '/doctors' || location.pathname.startsWith('/doctors/')}
        >
          👨‍⚕️ Ärzte
        </SidebarItem>
        <SidebarItem 
          to="/treatments" 
          $active={location.pathname === '/treatments' || location.pathname.startsWith('/treatments/')}
        >
          💊 Behandlungen
        </SidebarItem>
        <SidebarItem 
          to="/wards" 
          $active={location.pathname === '/wards' || location.pathname.startsWith('/wards/')}
        >
          🏥 Stationen
        </SidebarItem>
      </SidebarSection>
    </SidebarContainer>
  );
}

// List Components
function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientEdit = (personId) => {
    navigate(`/patients/edit/${personId}`);
  };

  const handlePatientAdd = () => {
    navigate('/patients/add');
  };

  const handlePatientDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        fetchPatients();
      } catch (err) {
        alert('Error deleting patient: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Content>
      <Header>
        <h3>Patient List</h3>
        <AddButton onClick={handlePatientAdd}>Add Patient</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.personId}
              onClick={() => handlePatientEdit(patient.personId)}
            >
              <Td>{patient.personId}</Td>
              <Td>{patient.firstname}</Td>
              <Td>{patient.name}</Td>
              <Td>{patient.phonenumber}</Td>
              <Td>{patient.email}</Td>
              <Td>
                <ActionButton 
                  type="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePatientEdit(patient.personId);
                  }}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePatientDelete(patient.personId);
                  }}
                >
                  Delete
                </ActionButton>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Content>
  );
}

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setDoctors(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorEdit = (personId) => {
    navigate(`/doctors/edit/${personId}`);
  };

  const handleDoctorAdd = () => {
    navigate('/doctors/add');
  };

  const handleDoctorDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await employeeAPI.delete(id);
        fetchDoctors();
      } catch (err) {
        alert('Error deleting doctor: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Content>
      <Header>
        <h3>Doctor List</h3>
        <AddButton onClick={handleDoctorAdd}>Add Doctor</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Department</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <TableRow 
              key={doctor.personId}
              onClick={() => handleDoctorEdit(doctor.personId)}
            >
              <Td>{doctor.personId}</Td>
              <Td>{doctor.firstname}</Td>
              <Td>{doctor.name}</Td>
              <Td>{doctor.department}</Td>
              <Td>{doctor.phonenumber}</Td>
              <Td>{doctor.email}</Td>
              <Td>
                <ActionButton 
                  type="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorEdit(doctor.personId);
                  }}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorDelete(doctor.personId);
                  }}
                >
                  Delete
                </ActionButton>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Content>
  );
}

function TreatmentsList() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const response = await treatmentAPI.getAll();
      setTreatments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTreatmentEdit = (treatmentId) => {
    navigate(`/treatments/edit/${treatmentId}`);
  };

  const handleTreatmentAdd = () => {
    navigate('/treatments/add');
  };

  const handleTreatmentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        await treatmentAPI.delete(id);
        fetchTreatments();
      } catch (err) {
        alert('Error deleting treatment: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Content>
      <Header>
        <h3>Treatment List</h3>
        <AddButton onClick={handleTreatmentAdd}>Add Treatment</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Treatment ID</Th>
            <Th>Date</Th>
            <Th>Patient ID</Th>
            <Th>Doctor ID</Th>
            <Th>Therapy</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment) => (
            <TableRow 
              key={treatment.treatmentId}
              onClick={() => handleTreatmentEdit(treatment.treatmentId)}
            >
              <Td>{treatment.treatmentId}</Td>
              <Td>{treatment.date ? new Date(treatment.date).toLocaleDateString() : '-'}</Td>
              <Td>{treatment.patientPersonId}</Td>
              <Td>{treatment.doctorPersonId}</Td>
              <Td>{treatment.therapy}</Td>
              <Td>
                <ActionButton 
                  type="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTreatmentEdit(treatment.treatmentId);
                  }}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTreatmentDelete(treatment.treatmentId);
                  }}
                >
                  Delete
                </ActionButton>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Content>
  );
}

function WardsList() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await wardAPI.getAll();
      setWards(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWardEdit = (wardId) => {
    navigate(`/wards/edit/${wardId}`);
  };

  const handleWardAdd = () => {
    navigate('/wards/add');
  };

  const handleWardDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ward?')) {
      try {
        await wardAPI.delete(id);
        fetchWards();
      } catch (err) {
        alert('Error deleting ward: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Content>
      <Header>
        <h3>Ward List</h3>
        <AddButton onClick={handleWardAdd}>Add Ward</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Ward ID</Th>
            <Th>Ward Name</Th>
            <Th>Capacity</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => (
            <TableRow 
              key={ward.wardId}
              onClick={() => handleWardEdit(ward.wardId)}
            >
              <Td>{ward.wardId}</Td>
              <Td>{ward.wardName}</Td>
              <Td>{ward.capacity}</Td>
              <Td>{ward.description}</Td>
              <Td>
                <ActionButton 
                  type="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWardEdit(ward.wardId);
                  }}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWardDelete(ward.wardId);
                  }}
                >
                  Delete
                </ActionButton>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Content>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Wrapper>
        <Header1>
          <ImageWrapper>
            <StyledImg src={logo} alt="logo" />
          </ImageWrapper>
        </Header1>
        <Container>
          <SidebarNav />
          <Routes>
            {/* Default route - redirect to Secretary Dashboard */}
            <Route path="/" element={<SecretaryDashboard />} />
            
            {/* Dashboard Routes */}
            <Route path="/secretary-dashboard" element={
              <Content $fullWidth={true}>
                <SecretaryDashboard />
              </Content>
            } />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

            {/* Patient Routes */}
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/add" element={<PatientAdd />} />
            <Route path="/patients/edit/:id" element={<PatientEdit />} />

            {/* Doctor Routes */}
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/add" element={<DoctorAdd />} />
            <Route path="/doctors/edit/:id" element={<DoctorEdit />} />

            {/* Treatment Routes */}
            <Route path="/treatments" element={<TreatmentsList />} />
            <Route path="/treatments/add" element={<TreatmentAdd />} />
            <Route path="/treatments/edit/:id" element={<TreatmentEdit />} />

            {/* Ward Routes */}
            <Route path="/wards" element={<WardsList />} />
            <Route path="/wards/add" element={<WardAdd />} />
            <Route path="/wards/edit/:id" element={<WardEdit />} />
          </Routes>
        </Container>
      </Wrapper>
    </Router>
  );
}

export default App;