import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components (same as EntityAdd)
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
  background-color: ${props => props.disabled ? '#e9ecef' : 'white'};
  
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const RelatedDataSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  margin-top: 1rem;
`;

const SubsectionTitle = styled.h3`
  color: #3399ff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  padding: 0.7rem;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.7rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
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

function EntityEdit({ 
  entityType, 
  entityConfig, 
  apiService, 
  redirectPath,
  dependentData = {},
  relatedDataConfig = null // For showing related data like treatments for patients
}) {
  const { id } = useParams();
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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dependentDataLoading, setDependentDataLoading] = useState(false);
  const [loadedDependentData, setLoadedDependentData] = useState({});
  const [relatedData, setRelatedData] = useState({});
  const [relatedDataLoading, setRelatedDataLoading] = useState(false);
  const [relatedDataError, setRelatedDataError] = useState(null);

  // Load entity data
  useEffect(() => {
    const loadEntityData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getById(id);
        setEntity(response.data || response);
      } catch (err) {
        setError('Error loading ' + entityType + ' data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEntityData();
  }, [id, apiService, entityType]);

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

  // Load related data
  useEffect(() => {
    const loadRelatedData = async () => {
      if (!relatedDataConfig || loading) return;
      
      setRelatedDataLoading(true);
      try {
        const loadedData = {};
        
        for (const [key, config] of Object.entries(relatedDataConfig)) {
          const response = await config.apiCall(id);
          loadedData[key] = response.data || response;
        }
        
        setRelatedData(loadedData);
      } catch (err) {
        setRelatedDataError('Error loading related data: ' + err.message);
      } finally {
        setRelatedDataLoading(false);
      }
    };

    loadRelatedData();
  }, [relatedDataConfig, id, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare data for API (apply transformations if needed)
      let entityData = { ...entity };
      if (entityConfig && entityConfig.dataTransform) {
        entityData = entityConfig.dataTransform(entityData);
      }
      
      await apiService.update(id, entityData);
      alert(entityConfig?.updateSuccessMessage || `${entityType} updated successfully!`);
      navigate(redirectPath);
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(redirectPath);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: entity[field.name] || '',
      onChange: handleInputChange,
      placeholder: field.placeholder,
      disabled: saving || dependentDataLoading || field.disabled,
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

  const renderRelatedData = (key, config) => {
    const data = relatedData[key] || [];
    
    return (
      <div key={key}>
        <SubsectionTitle>{config.title}</SubsectionTitle>
        {data.length === 0 ? (
          <NoDataMessage>{config.emptyMessage}</NoDataMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <Th key={column.key}>{column.title}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, config.maxRows || 5).map((item, index) => (
                <TableRow key={item[config.keyField] || index}>
                  {config.columns.map((column) => (
                    <Td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </Td>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingMessage>Loading {entityType} data...</LoadingMessage>;
  }

  if (error) {
    return (
      <EditContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate(redirectPath)}>Back to {entityConfig?.listTitle || 'List'}</Button>
      </EditContainer>
    );
  }

  return (
    <EditContainer>
      <BackButton onClick={handleCancel}>
        ← Back to {entityConfig?.listTitle || 'List'}
      </BackButton>

      {/* Entity Information Section */}
      <EntitySection>
        <SectionTitle>{entityConfig?.title || 'Edit Item'}</SectionTitle>
        
        <FormGrid>
          {entityConfig && entityConfig.fields ? entityConfig.fields.map((field) => (
            <FormGroup key={field.name} fullWidth={field.fullWidth}>
              <Label htmlFor={field.name}>
                {field.label}
              </Label>
              {renderField(field)}
            </FormGroup>
          )) : <div>No configuration found</div>}
        </FormGrid>

        <ButtonGroup>
          <Button 
            primary 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? 'Saving...' : (entityConfig?.saveButtonText || 'Save')}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </EntitySection>

      {/* Related Data Section */}
      {relatedDataConfig && (
        <RelatedDataSection>
          <SectionTitle>{entityConfig?.relatedDataTitle || 'Related Information'}</SectionTitle>
          
          {relatedDataLoading && (
            <LoadingMessage>Loading related data...</LoadingMessage>
          )}
          
          {relatedDataError && (
            <ErrorMessage>{relatedDataError}</ErrorMessage>
          )}
          
          {!relatedDataLoading && !relatedDataError && (
            Object.entries(relatedDataConfig).map(([key, config]) => 
              renderRelatedData(key, config)
            )
          )}
        </RelatedDataSection>
      )}
    </EditContainer>
  );
}

// Export field types for easier usage
EntityEdit.FIELD_TYPES = FIELD_TYPES;

export default EntityEdit;