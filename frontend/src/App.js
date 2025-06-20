import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';


const Header = styled.h1`
text-align: center;
`

function App() {
  return (
    <div className="App">
      <Header >
        <img src={logo} className="App-logo" alt="logo" />
        <p>
test test test        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </Header>
    </div>
  );
}

export default App;
