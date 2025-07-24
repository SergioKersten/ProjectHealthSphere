// frontend/src/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Basis-API-Funktion
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// Patient API
export const patientAPI = {
  // Alle Patienten abrufen
  getAll: () => apiCall('/patients'),
  
  // Einzelnen Patient abrufen
  getById: (id) => apiCall(`/patients/${id}`),
  
  // Neuen Patient erstellen
  create: (patientData) => apiCall('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData)
  }),
  
  // Patient aktualisieren
  update: (id, patientData) => apiCall(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patientData)
  }),
  
  // Patient löschen
  delete: (id) => apiCall(`/patients/${id}`, {
    method: 'DELETE'
  })
};

// Employee/Doctor API
export const employeeAPI = {
  getAll: () => apiCall('/employees'),
  getById: (id) => apiCall(`/employees/${id}`),
  create: (employeeData) => apiCall('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData)
  }),
  update: (id, employeeData) => apiCall(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData)
  }),
  delete: (id) => apiCall(`/employees/${id}`, {
    method: 'DELETE'
  })
};

// Treatment API
export const treatmentAPI = {
  getAll: () => apiCall('/treatments'),
  getById: (id) => apiCall(`/treatments/${id}`),
  create: (treatmentData) => apiCall('/treatments', {
    method: 'POST',
    body: JSON.stringify(treatmentData)
  }),
  update: (id, treatmentData) => apiCall(`/treatments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(treatmentData)
  }),
  delete: (id) => apiCall(`/treatments/${id}`, {
    method: 'DELETE'
  })
};

// Ward API
export const wardAPI = {
  getAll: () => apiCall('/wards'),
  getById: (id) => apiCall(`/wards/${id}`),
  create: (wardData) => apiCall('/wards', {
    method: 'POST',
    body: JSON.stringify(wardData)
  }),
  update: (id, wardData) => apiCall(`/wards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(wardData)
  }),
  delete: (id) => apiCall(`/wards/${id}`, {
    method: 'DELETE'
  })
};

// Health Check
export const healthAPI = {
  check: () => apiCall('/health')
};