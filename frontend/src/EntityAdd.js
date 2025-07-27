import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const EditContainer = styled.div`
  min-width: 500px;
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const EntitySection = styled.div`
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
  ${props => props.fullWidth && `
    grid-column: span 2;
    @media (max-width: 768px) {
      grid-column: span 1;
    }
  `}
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

// Field Types
const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  TEXTAREA: 'textarea'
};

function EntityAdd({ 
  entityType, 
  entityConfig, 
  apiService, 
  redirectPath,
  dependentData = {} // For dropdowns like patients, doctors, wards
}) {
  const navigate = useNavigate();
  
  // Initialize empty entity based on config
  const [entity, setEntity] = useState(() => {
    const initialState = {};
    if (entityConfig && entityConfig.fields) {
      entityConfig.fields.forEach(field => {
        initialState[field.name] = field.defaultValue || '';
      });
    }
    return initialState;
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dependentDataLoading, setDependentDataLoading] = useState(false);
  const [loadedDependentData, setLoadedDependentData] = useState({});

  // Load dependent data (for dropdowns)
  useEffect(() => {
    const loadDependentData = async () => {
      if (Object.keys(dependentData).length === 0) return;
      
      setDependentDataLoading(true);
      try {
        const loadedData = {};
        
        for (const [key, config] of Object.entries(dependentData)) {
          const response = await config.apiCall();
          loadedData[key] = response.data || response;
        }
        
        setLoadedDependentData(loadedData);
      } catch (err) {
        setError('Error loading form data: ' + err.message);
      } finally {
        setDependentDataLoading(false);
      }
    };

    loadDependentData();
  }, [dependentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!entityConfig || !entityConfig.fields) return null;
    
    const requiredFields = entityConfig.fields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!entity[field.name] || entity[field.name].toString().trim() === '') {
        return `${field.label} is required`;
      }
    }

    // Custom validation rules
    if (entityConfig.customValidation) {
      const customError = entityConfig.customValidation(entity);
      if (customError) return customError;
    }

    return null;
  };

  const handleSave = async () => {
    try {
      // Validation
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setSaving(true);
      setError(null);
      
      // Prepare data for API (apply transformations if needed)
      let entityData = { ...entity };
      if (entityConfig && entityConfig.dataTransform) {
        entityData = entityConfig.dataTransform(entityData);
      }
      
      // API Call
      await apiService.create(entityData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
      
    } catch (err) {
      setError('Error creating ' + entityType + ': ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(redirectPath);
  };

  const isFormValid = () => {
    if (!entityConfig || !entityConfig.fields) return false;
    
    const requiredFields = entityConfig.fields.filter(field => field.required);
    return requiredFields.every(field => 
      entity[field.name] && entity[field.name].toString().trim() !== ''
    );
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: entity[field.name] || '',
      onChange: handleInputChange,
      placeholder: field.placeholder,
      disabled: saving || dependentDataLoading,
      ...field.inputProps
    };

    switch (field.type) {
      case FIELD_TYPES.SELECT:
        return (
          <Select {...commonProps}>
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options ? field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )) : 
            loadedDependentData[field.dataSource] ? loadedDependentData[field.dataSource].map((item) => (
              <option key={item[field.valueField]} value={item[field.valueField]}>
                {field.displayFormat ? field.displayFormat(item) : item[field.displayField]}
              </option>
            )) : null}
          </Select>
        );
      
      case FIELD_TYPES.TEXTAREA:
        return <TextArea {...commonProps} />;
      
      default:
        return <Input type={field.type} {...commonProps} />;
    }
  };

  if (dependentDataLoading) {
    return <LoadingMessage>Loading form data...</LoadingMessage>;
  }

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to {entityConfig?.listTitle || 'List'}
      </BackButton>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Success Message */}
      {success && <SuccessMessage>{entityConfig?.successMessage || 'Created successfully!'}</SuccessMessage>}

      {/* Form Section */}
      <EntitySection>
        <SectionTitle>{entityConfig?.title || 'Add New Item'}</SectionTitle>
        
        <FormGrid>
          {entityConfig && entityConfig.fields ? entityConfig.fields.map((field) => (
            <FormGroup key={field.name} fullWidth={field.fullWidth}>
              <Label htmlFor={field.name}>
                {field.label} {field.required && '*'}
              </Label>
              {renderField(field)}
            </FormGroup>
          )) : <div>No configuration found</div>}
        </FormGrid>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={!isFormValid() || saving}
          >
            {saving ? 'Saving...' : (entityConfig?.saveButtonText || 'Save')}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </EntitySection>
    </EditContainer>
  );
}

// Export field types for easier usage
EntityAdd.FIELD_TYPES = FIELD_TYPES;

export default EntityAdd;