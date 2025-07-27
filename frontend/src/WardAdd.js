import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { wardAPI } from './services/api';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const WardSection = styled.div`
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

const FullWidthFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
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

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  
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

function WardAdd() {
  const navigate = useNavigate();
  
  // Ward State for new ward
  const [ward, setWard] = useState({
    wardId: '',
    wardName: '',
    description: '',
    capacity: ''
  });
  
  // Loading and Error States
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!ward.wardId || !ward.wardName || !ward.capacity) {
        setError('Ward ID, Ward Name, and Capacity are required fields!');
        return;
      }

      if (parseInt(ward.capacity) <= 0) {
        setError('Capacity must be greater than 0!');
        return;
      }

      setSaving(true);
      setError(null);
      
      // Prepare data for API
      const wardData = {
        wardId: parseInt(ward.wardId),
        wardName: ward.wardName,
        description: ward.description,
        capacity: parseInt(ward.capacity)
      };
      
      // API Call to create ward
      await wardAPI.create(wardData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/wards');
      }, 1500); // Navigate back to ward list after 1.5 seconds
      
    } catch (err) {
      setError('Error creating ward: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/wards');
  };

  const isFormValid = ward.wardId && ward.wardName.trim() && ward.capacity && 
                     parseInt(ward.capacity) > 0;

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to Ward List
      </BackButton>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Success Message */}
      {success && <SuccessMessage>Ward created successfully!</SuccessMessage>}

      {/* Ward Information Section */}
      <WardSection>
        <SectionTitle>Add New Ward</SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label htmlFor="wardId">Ward ID *</Label>
            <Input
              type="number"
              id="wardId"
              name="wardId"
              value={ward.wardId}
              onChange={handleInputChange}
              placeholder="Enter Ward ID"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="wardName">Ward Name *</Label>
            <Input
              type="text"
              id="wardName"
              name="wardName"
              value={ward.wardName}
              onChange={handleInputChange}
              placeholder="Enter ward name"
              disabled={saving}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              type="number"
              id="capacity"
              name="capacity"
              value={ward.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              min="1"
              disabled={saving}
            />
          </FormGroup>

          <FullWidthFormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={ward.description}
              onChange={handleInputChange}
              placeholder="Enter ward description..."
              disabled={saving}
            />
          </FullWidthFormGroup>
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
      </WardSection>
    </EditContainer>
  );
}

export default WardAdd;