import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { employeeAPI } from './services/api';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const DoctorSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const SectionTitle = styled.h2`
  color: #3399ff;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 2px solid #3399ff;
  padding-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #495057;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3399ff;
    box-shadow: 0 0 0 2px rgba(51, 153, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  
  ${props => props.primary ? `
    background-color: #3399ff;
    color: white;
    &:hover { background-color: #2980d9; }
  ` : `
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #5a6268; }
  `}
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3399ff;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

function DoctorAdd() {
  const navigate = useNavigate();
  
  // Doctor State for new doctor
  const [doctor, setDoctor] = useState({
    firstname: '',
    name: '',
    phonenumber: '',
    email: '',
    birthdate: '',
    adress: '',
    department: '',
    salary: ''
  });
  
  // Loading and Error States
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Department options
  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery',
    'Radiology',
    'Anesthesiology'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!doctor.firstname || !doctor.name || !doctor.department) {
        setError('First name, last name, and department are required fields!');
        return;
      }

      setSaving(true);
      setError(null);
      
      // Prepare data for API
      const doctorData = {
        ...doctor,
        salary: doctor.salary ? parseFloat(doctor.salary) : 0
      };
      
      // API Call to create doctor
      await employeeAPI.create(doctorData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/doctors');
      }, 1500); // Navigate back to doctor list after 1.5 seconds
      
    } catch (err) {
      setError('Error creating doctor: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/doctors');
  };

  const isFormValid = doctor.firstname.trim() && doctor.name.trim() && doctor.department;

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to Doctor List
      </BackButton>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Success Message */}
      {success && <SuccessMessage>Doctor created successfully!</SuccessMessage>}

      {/* Doctor Information Section */}
      <DoctorSection>
        <SectionTitle>Add New Doctor</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="firstname">First Name *</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={doctor.firstname}
              onChange={handleInputChange}
              placeholder="Enter first name"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">Last Name *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={doctor.name}
              onChange={handleInputChange}
              placeholder="Enter last name"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={doctor.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phonenumber">Phone Number</Label>
            <Input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={doctor.phonenumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              type="date"
              id="birthdate"
              name="birthdate"
              value={doctor.birthdate}
              onChange={handleInputChange}
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="department">Department *</Label>
            <Select
              id="department"
              name="department"
              value={doctor.department}
              onChange={handleInputChange}
              disabled={saving}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="salary">Salary</Label>
            <Input
              type="number"
              id="salary"
              name="salary"
              value={doctor.salary}
              onChange={handleInputChange}
              placeholder="Enter salary"
              min="0"
              step="0.01"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="adress">Address</Label>
            <Input
              type="text"
              id="adress"
              name="adress"
              value={doctor.adress}
              onChange={handleInputChange}
              placeholder="Enter address"
              disabled={saving}
            />
          </FormGroup>
        </FormGrid>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={!isFormValid || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </DoctorSection>
    </EditContainer>
  );
}

export default DoctorAdd;