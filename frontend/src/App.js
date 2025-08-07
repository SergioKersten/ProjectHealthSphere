import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';

import DoctorDashboard from './DoctorDashboard';
import SecretaryDashboard from './SecretaryDashboard'; // Neuer Import


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
          Sekretariat Dashboard
        </SidebarItem>
        <SidebarItem 
          to="/doctor-dashboard" 
          $active={location.pathname === '/doctor-dashboard'}
        >
          Arzt Dashboard
        </SidebarItem>
      </SidebarSection>
      </SidebarContainer>

      
  );
}


/**
 * React-Hauptkomponente der HealthSphere Frontend-Anwendung.
 * 
 * Diese Komponente orchestriert die gesamte Benutzeroberfläche und
 * implementiert das Routing-System sowie die Navigationsstruktur
 * für das Krankenhaus-Verwaltungssystem.
 * 
 * Architektur-Komponenten:
 * - Router-Konfiguration für alle Dashboard-Ansichten
 * - Sidebar-Navigation mit rollenbasierten Links
 * - Header mit HealthSphere-Branding
 * - Layout-Management für responsive Darstellung
 * 
 * Implementierte Dashboards:
 * - Secretary Dashboard: Vollständige Systemverwaltung
 * - Doctor Dashboard: Arztspezifische Behandlungsansicht
 * - Verschiedene Listen-Komponenten (Patients, Employees, Wards)
 * 
 * Technische Features:
 * - React Router für Single-Page-Application
 * - Styled Components für konsistente UI
 * - API-Integration über zentrale Service-Layer
 * - Responsive Design für verschiedene Bildschirmgrößen
 * 
 */
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
          </Routes>
        </Container>
      </Wrapper>
    </Router>
  );
}

export default App;