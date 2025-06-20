import logo from '../src/images/HealthSphereNew.png';
import './App.css';
import styled from 'styled-components';


const Wrapper = styled.div`
display: flex;
flex-direction: column;
padding: 20px;
`
const Header = styled.div`
display: flex;
padding-bottom: 10px;

`
const SideBar = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
`
const Content = styled.div`
display: flex;
flex-direction: column;
`

const Dashboard = styled.div``

const ImageWrapper = styled.div`

`



function App() {
  return (
    <Wrapper>
      <Header>
        <ImageWrapper>
          <img src={logo} height={100}></img>
          </ImageWrapper>
      </Header>
      <SideBar>
        <Dashboard>Patients</Dashboard>
        <Dashboard>Doctors</Dashboard>
        <Dashboard>Treatments</Dashboard>
      </SideBar>
      <Content></Content>
    </Wrapper>
  );
}

export default App;
