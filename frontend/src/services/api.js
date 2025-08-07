import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Erweiterte Error Handling Funktion
const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Strukturiere die Error-Response für das Frontend
  if (error.response) {
    const { status, data } = error.response;
    
    // Erstelle strukturierte Error-Objekte
    const errorInfo = {
      status,
      message: typeof data === 'string' ? data : data.message || 'Unbekannter Fehler',
      type: getErrorType(status),
      details: data.details || null
    };
    
    return Promise.reject(errorInfo);
  }
  
  return Promise.reject({
    status: 0,
    message: 'Netzwerkfehler - Server nicht erreichbar',
    type: 'NETWORK_ERROR'
  });
};

// Error-Type Mapping basierend auf HTTP Status Codes
const getErrorType = (status) => {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 500:
      return 'SERVER_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};

// Interceptor für Error-Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Gib den Error einfach weiter - kein fancy handling
    return Promise.reject(error);
  }
);

// Patient API calls mit Error Handling
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (patient) => api.post('/patients', patient),
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Employee/Doctor API calls
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employee) => api.post('/employees', employee),
  update: (id, employee) => api.put(`/employees/${id}`, employee),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Treatment API calls
export const treatmentAPI = {
  getAll: () => api.get('/treatments'),
  getById: (id) => api.get(`/treatments/${id}`),
  getByPatientId: (patientId) => api.get(`/treatments/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/treatments/doctor/${doctorId}`),
  getByDate: (date) => api.get(`/treatments/date/${date}`),
  create: (treatment) => api.post('/treatments', treatment),
  update: (id, treatment) => api.put(`/treatments/${id}`, treatment),
  updateTherapy: (id, therapy) => api.put(`/treatments/${id}/therapy`, therapy),
  delete: (id) => api.delete(`/treatments/${id}`),
};

// Ward API calls
export const wardAPI = {
  getAll: () => api.get('/wards'),
  getById: (id) => api.get(`/wards/${id}`),
  getByMinCapacity: (minCapacity) => api.get(`/wards/capacity/${minCapacity}`),
  create: (ward) => api.post('/wards', ward),
  update: (id, ward) => api.put(`/wards/${id}`, ward),
  delete: (id) => api.delete(`/wards/${id}`),
  getCapacity: (id) => api.get(`/wards/${id}/capacity`),
  getAllCapacities: () => api.get('/wards/capacity/all'),
};

export default api;