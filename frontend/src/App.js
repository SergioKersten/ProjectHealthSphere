// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import PatientenListe from './pages/PatientenListe';
import PatientenDetails from './pages/PatientenDetails';
import PatientenFormular from './pages/PatientenFormular';
import BettenÜbersicht from './pages/BettenÜbersicht';
import ArztTermine from './pages/ArztTermine';
import BehandlungsDokumentation from './pages/BehandlungsDokumentation';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="content">
            <Routes>
              {/*<Route path="/login" element={<Login />} />*/}
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="patienten" element={<PatientenListe />} />
                <Route path="patienten/neu" element={<PatientenFormular />} />
                <Route path="patienten/:id" element={<PatientenDetails />} />
                <Route path="patienten/:id/bearbeiten" element={<PatientenFormular />} />
                <Route path="betten" element={<BettenÜbersicht />} />
                <Route path="termine" element={<ArztTermine />} />
                <Route path="behandlung/:patientId" element={<BehandlungsDokumentation />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



