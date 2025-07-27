import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';
import { patientAPI, employeeAPI, treatmentAPI } from './services/api';
import PatientEdit from './PatientEdit';
import PatientAdd from './PatientAdd';
import TreatmentEdit from './TreatmentEdit';
import TreatmentAdd from './TreatmentAdd';
import DoctorEdit from './DoctorEdit';
import DoctorAdd from './DoctorAdd';

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

const ImageWrapper = styled.div``;

const Container = styled.div`
  display: flex;
  font-family: Arial, sans-serif;
`;

const SidebarContainer = styled.div`
  width: 200px;
  background-color: #f1f1f1;
  padding: 1rem;
  min-height: 100vh;
`;

const SidebarItem = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ $active }) => ($active ? '#007bff' : '#000')};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #007bff;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0 2rem 0 2rem;
  max-width: 800px;
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
  background-color: ${({ type }) => (type === 'edit' ? '#007bff' : '#dc3545')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  margin-left: 5px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 0.5rem 0.9rem;
  margin-right: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

// Components
function SidebarNav() {
  const location = useLocation();
  
  return (
    <SidebarContainer>
      <SidebarItem 
        to="/patients" 
        $active={location.pathname === '/patients' || location.pathname === '/'}
      >
        Patients
      </SidebarItem>
      <SidebarItem 
        to="/doctors" 
        $active={location.pathname === '/doctors'}
      >
        Doctors
      </SidebarItem>
      <SidebarItem 
        to="/treatments" 
        $active={location.pathname === '/treatments'}
      >
        Treatments
      </SidebarItem>
    </SidebarContainer>
  );
}

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
        fetchPatients(); // Refresh list
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
            <Th>Name</Th>
            <Th>Date of Birth</Th>
            <Th>Phone</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.personId}
              onClick={() => handlePatientEdit(patient.personId)}
            >
              <Td>{`${patient.firstname} ${patient.name}`}</Td>
              <Td>{patient.birthdate}</Td>
              <Td>{patient.phonenumber}</Td>
              <Td>
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
        fetchDoctors(); // Refresh list
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
            <Th>Name</Th>
            <Th>Department</Th>
            <Th>Phone</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <TableRow 
              key={doctor.personId}
              onClick={() => handleDoctorEdit(doctor.personId)}
            >
              <Td>{`${doctor.firstname} ${doctor.name}`}</Td>
              <Td>{doctor.department}</Td>
              <Td>{doctor.phonenumber}</Td>
              <Td>
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
        fetchTreatments(); // Refresh list
      } catch (err) {
        alert('Error deleting treatment: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
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
            <Th>Therapy</Th>
            <Th>Patient ID</Th>
            <Th>Doctor ID</Th>
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
              <Td>{formatDate(treatment.date)}</Td>
              <Td>{treatment.therapy}</Td>
              <Td>{treatment.patientPersonId}</Td>
              <Td>{treatment.doctorPersonId}</Td>
              <Td>
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

function App() {
  return (
    <Router>
      <Wrapper>
        <Header1>
          <ImageWrapper>
            <img src={logo} className="App-logo" alt="logo" />
          </ImageWrapper>
        </Header1>
        <Container>
          <SidebarNav />
          <Routes>
            <Route path="/" element={<PatientsList />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/add" element={<PatientAdd />} />
            <Route path="/patients/edit/:id" element={<PatientEdit />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/add" element={<DoctorAdd />} />
            <Route path="/doctors/edit/:id" element={<DoctorEdit />} />
            <Route path="/treatments" element={<TreatmentsList />} />
            <Route path="/treatments/add" element={<TreatmentAdd />} />
            <Route path="/treatments/edit/:id" element={<TreatmentEdit />} />
          </Routes>
        </Container>
      </Wrapper>
    </Router>
  );
}

export default App;