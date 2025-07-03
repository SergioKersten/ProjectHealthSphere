import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';
import { patientAPI, employeeAPI, treatmentAPI } from './services/api';

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
`;

// Sample Data
const patients = [
  { id: 1, name: 'John Doe', dob: '01.01.1980', doctor: 'Dr. Williams' },
  { id: 2, name: 'Jane Smith', dob: '05.12.1975', doctor: 'Dr. Johnson' },
  { id: 3, name: 'Michael Johnson', dob: '23.07.1988', doctor: 'Dr. Davis' },
  { id: 4, name: 'Emily Brown', dob: '10.04.1992', doctor: 'Dr. Wilson' },
];

const doctors = [
  { id: 1, name: 'Dr. Williams', specialty: 'Kardiologie', phone: '+49 30 12345678' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Neurologie', phone: '+49 30 87654321' },
  { id: 3, name: 'Dr. Davis', specialty: 'Orthopädie', phone: '+49 30 11223344' },
  { id: 4, name: 'Dr. Wilson', specialty: 'Dermatologie', phone: '+49 30 55667788' },
];

const treatments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Williams', date: '15.06.2025', therapy: 'EKG Untersuchung' },
  { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', date: '16.06.2025', therapy: 'MRT Kopf' },
  { id: 3, patient: 'Michael Johnson', doctor: 'Dr. Davis', date: '17.06.2025', therapy: 'Röntgen Knie' },
  { id: 4, patient: 'Emily Brown', doctor: 'Dr. Wilson', date: '18.06.2025', therapy: 'Hautuntersuchung' },
];

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

// Handler functions
const handleEdit = (type, id) => {
  console.log(`Edit ${type} with ID: ${id}`);
  // Hier würdest du normalerweise ein Modal öffnen oder zur Edit-Seite navigieren
};

const handleDelete = (type, id) => {
  if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
    console.log(`Delete ${type} with ID: ${id}`);
    // Hier würdest du normalerweise den API-Call zum Löschen machen
  }
};


function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
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
        <AddButton>Add Patient</AddButton>
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
            <TableRow key={patient.personId}>
              <Td>{`${patient.firstname} ${patient.name}`}</Td>
              <Td>{patient.birthdate}</Td>
              <Td>{patient.phonenumber}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit('patient', patient.personId)}>
                  Edit
                </ActionButton>
                <ActionButton onClick={() => handleDelete(patient.personId)}>
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
  return (
    <Content>
      <Header>
        <h3>Doctors List</h3>
        <AddButton>Add Doctor</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Specialty</Th>
            <Th>Phone</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <TableRow 
              key={doctor.id}
              onClick={() => handleEdit('doctor', doctor.id)}
            >
              <Td>{doctor.name}</Td>
              <Td>{doctor.specialty}</Td>
              <Td>{doctor.phone}</Td>
              <Td>
                <ActionButton 
                  type="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete('doctor', doctor.id);
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
  return (
    <Content>
      <Header>
        <h3>Treatments List</h3>
        <AddButton>Add Treatment</AddButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Patient</Th>
            <Th>Doctor</Th>
            <Th>Date</Th>
            <Th>Therapy</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment) => (
            <TableRow 
              key={treatment.id}
              onClick={() => handleEdit('treatment', treatment.id)}
            >
              <Td>{treatment.patient}</Td>
              <Td>{treatment.doctor}</Td>
              <Td>{treatment.date}</Td>
              <Td>{treatment.therapy}</Td>
              <Td>
                <ActionButton 
                  type="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete('treatment', treatment.id);
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
            <img src={logo} height={100} alt="HealthSphere Logo" />
          </ImageWrapper>
        </Header1>
        <Container>
          <SidebarNav />
          <Routes>
            <Route path="/" element={<PatientsList />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/treatments" element={<TreatmentsList />} />
          </Routes>
        </Container>
      </Wrapper>
    </Router>
  );
}

export default App;