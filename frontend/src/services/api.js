// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authenticate = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const fetchPatienten = async (suchbegriff = '') => {
  const url = suchbegriff ? `/patienten/suche?suchbegriff=${suchbegriff}` : '/patienten';
  const response = await api.get(url);
  return response.data;
};

export const fetchPatientById = async (id) => {
  const response = await api.get(`/patienten/${id}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patienten', patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/patienten/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/patienten/${id}`);
  return response.data;
};

export const fetchVerfügbareBetten = async () => {
  const response = await api.get('/betten/verfügbar');
  return response.data;
};

export const assignBettToPatient = async (patientId, bettId) => {
  const response = await api.post(`/betten/${bettId}/zuweisen/${patientId}`);
  return response.data;
};

export const fetchTermine = async (arztId, datum) => {
  const response = await api.get(`/termine`, { params: { arztId, datum } });
  return response.data;
};

export const createTermin = async (terminData) => {
  const response = await api.post('/termine', terminData);
  return response.data;
};

export const createBehandlung = async (behandlungData) => {
  const response = await api.post('/behandlungen', behandlungData);
  return response.data;
};

export const addDiagnoseToBehandlung = async (behandlungId, diagnoseData) => {
  const response = await api.post(`/behandlungen/${behandlungId}/diagnosen`, diagnoseData);
  return response.data;
};

export const addMedikationToBehandlung = async (behandlungId, medikationData) => {
  const response = await api.post(`/behandlungen/${behandlungId}/medikationen`, medikationData);
  return response.data;
};


