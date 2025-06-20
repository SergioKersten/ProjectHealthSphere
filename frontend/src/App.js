import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';


const Wrapper = styled.div`
display: flex;
flex-direction: column;
padding: 20px;
`
const Header1 = styled.div`
display: flex;
padding-bottom: 10px;

`
const SideBar = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
`
const Content1 = styled.div`
display: flex;
flex-direction: column;
`

const Dashboard = styled.div``

const ImageWrapper = styled.div`

`

export const Container = styled.div`
  display: flex;
  font-family: Arial, sans-serif;
`;

export const Sidebar = styled.div`
  width: 200px;
  background-color: #f1f1f1;
  padding: 1rem;
  min-height: 100vh;
`;

export const SidebarItem = styled.div`
  margin-bottom: 1rem;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ active }) => (active ? '#007bff' : '#000')};
  cursor: pointer;
`;

export const Content = styled.div`
  flex: 1;
  padding: 0 2rem 0 2rem;
  max-width: 800px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3399ff;
  color: white;
  padding-left: 1rem;
  border-radius: 6px 6px 0 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
`;

export const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #ccc;
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

export const ActionButton = styled.button`
  background-color: ${({ type }) => (type === 'edit' ? '#007bff' : '#dc3545')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  margin-left: 5px;
  cursor: pointer;
`;

export const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const patients = [
  { id: 1, name: 'John Doe', dob: '01.01.1980', doctor: 'Dr. Williams' },
  { id: 2, name: 'Jane Smith', dob: '05.12.1975', doctor: 'Dr. Johnson' },
  { id: 3, name: 'Michael Johnson', dob: '23.07.1988', doctor: 'Dr. Davis' },
  { id: 4, name: 'Emily Brown', dob: '10.04.1992', doctor: 'Dr. Wilson' },
];

function App() {
  return (
    <Wrapper>
    <Header1>
        <ImageWrapper>
          <img src={logo} height={100}></img>
          </ImageWrapper>
      </Header1>
    <Container>
      <Sidebar>
        <SidebarItem active>Patients</SidebarItem>
        <SidebarItem>Doctors</SidebarItem>
        <SidebarItem>Treatments</SidebarItem>
      </Sidebar>

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
              <Th>Doctor</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <Td>{patient.name}</Td>
                <Td>{patient.dob}</Td>
                <Td>{patient.doctor}</Td>
                <Td>
                  <ActionButton type="edit">✎</ActionButton>
                  <ActionButton type="delete">Delete</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
    </Wrapper>
  );
}

export default App;
