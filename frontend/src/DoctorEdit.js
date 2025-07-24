import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { employeeAPI } from './services/api';

// Styled Components
const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  background-color: #3399ff;
  color: white;
  padding: 1rem;
  margin: -2rem -2rem 2rem -2rem;
  border-radius: 8px 8px 0 0;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SaveButton = styled(Button)`
  background-color: #28a745;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #6c757d;
`;

function DoctorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [doctor, setDoctor] = useState({
    personId: '',
    name: '',
    firstname: '',
    phonenumber: '',
    email: '',
    birthdate: '',
    adress: '',
    department: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchDoctor();
    }
  }, [id, isEdit]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await employeeAPI.getById(id);
      setDoctor({
        personId: response.data.personId || '',
        name: response.data.name || '',
        firstname: response.data.firstname || '',
        phonenumber: response.data.phonenumber || '',
        email: response.data.email || '',
        birthdate: response.data.birthdate || '',
        adress: response.data.adress || '',
        department: response.data.department || ''
      });
    } catch (err) {
      setError('Fehler beim Laden der Arztdaten: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      if (isEdit) {
        await employeeAPI.update(id, doctor);
        alert('Arzt erfolgreich aktualisiert!');
      } else {
        await employeeAPI.create(doctor);
        alert('Arzt erfolgreich erstellt!');
      }
      navigate('/doctors');
    } catch (err) {
      setError('Fehler beim Speichern: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Arzt löschen möchten?')) {
      try {
        setLoading(true);
        await employeeAPI.delete(id);
        alert('Arzt erfolgreich gelöscht!');
        navigate('/doctors');
      } catch (err) {
        setError('Fehler beim Löschen: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/doctors');
  };

  if (loading && isEdit && !doctor.personId) {
    return <LoadingMessage>Lade Arztdaten...</LoadingMessage>;
  }

  return (
    <FormContainer>
      <FormHeader>
        <h2>{isEdit ? 'Arzt bearbeiten' : 'Neuen Arzt hinzufügen'}</h2>
      </FormHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="personId">Personal-ID *</Label>
          <Input
            type="number"
            id="personId"
            name="personId"
            value={doctor.personId}
            onChange={handleInputChange}
            required
            disabled={isEdit}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="firstname">Vorname *</Label>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            value={doctor.firstname}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="name">Nachname *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={doctor.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="department">Fachbereich *</Label>
          <Select
            id="department"
            name="department"
            value={doctor.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="Kardiologie">Kardiologie</option>
            <option value="Neurologie">Neurologie</option>
            <option value="Orthopädie">Orthopädie</option>
            <option value="Dermatologie">Dermatologie</option>
            <option value="Pädiatrie">Pädiatrie</option>
            <option value="Chirurgie">Chirurgie</option>
            <option value="Innere Medizin">Innere Medizin</option>
            <option value="Radiologie">Radiologie</option>
            <option value="Anästhesie">Anästhesie</option>
            <option value="Gynäkologie">Gynäkologie</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phonenumber">Telefonnummer</Label>
          <Input
            type="tel"
            id="phonenumber"
            name="phonenumber"
            value={doctor.phonenumber}
            onChange={handleInputChange}
            placeholder="+49 30 12345678"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">E-Mail</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={doctor.email}
            onChange={handleInputChange}
            placeholder="arzt@healthsphere.com"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="birthdate">Geburtsdatum</Label>
          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            value={doctor.birthdate}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="adress">Adresse</Label>
          <Input
            type="text"
            id="adress"
            name="adress"
            value={doctor.adress}
            onChange={handleInputChange}
            placeholder="Musterstraße 123, 12345 Berlin"
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            Abbrechen
          </CancelButton>
          
          {isEdit && (
            <DeleteButton type="button" onClick={handleDelete}>
              Löschen
            </DeleteButton>
          )}
          
          <SaveButton type="submit" disabled={loading}>
            {loading ? 'Speichere...' : (isEdit ? 'Aktualisieren' : 'Erstellen')}
          </SaveButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
}

export default DoctorEdit;