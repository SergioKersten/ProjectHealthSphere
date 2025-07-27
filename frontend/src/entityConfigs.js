// entityConfigs.js - Konfigurationen für alle Entitäten

import { patientAPI, employeeAPI, treatmentAPI, wardAPI } from './services/api';

const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  TEXTAREA: 'textarea'
};

// Patient Configuration
export const patientConfig = {
  fields: [
    {
      name: 'firstname',
      label: 'First Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'name',
      label: 'Last Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'phonenumber',
      label: 'Phone Number',
      type: FIELD_TYPES.TEL,
      placeholder: 'Enter phone number'
    },
    {
      name: 'email',
      label: 'Email',
      type: FIELD_TYPES.EMAIL,
      placeholder: 'Enter email address'
    },
    {
      name: 'birthdate',
      label: 'Date of Birth',
      type: FIELD_TYPES.DATE
    },
    {
      name: 'adress',
      label: 'Address',
      type: FIELD_TYPES.TEXT,
      placeholder: 'Enter address'
    },
    {
      name: 'wardId',
      label: 'Ward',
      type: FIELD_TYPES.SELECT,
      dataSource: 'wards',
      valueField: 'wardId',
      displayField: 'wardName',
      displayFormat: (ward) => `${ward.wardName} (Capacity: ${ward.capacity})`,
      placeholder: 'Select Ward'
    }
  ],
  title: 'Add New Patient',
  listTitle: 'Patient List',
  saveButtonText: 'Create Patient',
  successMessage: 'Patient created successfully!',
  updateSuccessMessage: 'Patient updated successfully!',
  dataTransform: (data) => ({
    ...data,
    wardId: data.wardId ? parseInt(data.wardId) : null
  }),
  relatedDataTitle: 'Patient Treatments'
};

// Doctor Configuration
export const doctorConfig = {
  fields: [
    {
      name: 'firstname',
      label: 'First Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'name',
      label: 'Last Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'email',
      label: 'Email',
      type: FIELD_TYPES.EMAIL,
      placeholder: 'Enter email address'
    },
    {
      name: 'phonenumber',
      label: 'Phone Number',
      type: FIELD_TYPES.TEL,
      placeholder: 'Enter phone number'
    },
    {
      name: 'birthdate',
      label: 'Date of Birth',
      type: FIELD_TYPES.DATE
    },
    {
      name: 'department',
      label: 'Department',
      type: FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Dermatology', label: 'Dermatology' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'Emergency Medicine', label: 'Emergency Medicine' },
        { value: 'Internal Medicine', label: 'Internal Medicine' },
        { value: 'Surgery', label: 'Surgery' },
        { value: 'Radiology', label: 'Radiology' },
        { value: 'Anesthesiology', label: 'Anesthesiology' }
      ],
      placeholder: 'Select Department'
    },
    {
      name: 'salary',
      label: 'Salary',
      type: FIELD_TYPES.NUMBER,
      placeholder: 'Enter salary',
      inputProps: { min: '0', step: '0.01' }
    },
    {
      name: 'adress',
      label: 'Address',
      type: FIELD_TYPES.TEXT,
      placeholder: 'Enter address'
    },
    {
      name: 'wardId',
      label: 'Ward',
      type: FIELD_TYPES.SELECT,
      dataSource: 'wards',
      valueField: 'wardId',
      displayField: 'wardName',
      displayFormat: (ward) => `${ward.wardName} (Capacity: ${ward.capacity})`,
      placeholder: 'Select Ward'
    }
  ],
  title: 'Add New Doctor',
  listTitle: 'Doctor List',
  saveButtonText: 'Create Doctor',
  successMessage: 'Doctor created successfully!',
  updateSuccessMessage: 'Doctor updated successfully!',
  dataTransform: (data) => ({
    ...data,
    salary: data.salary ? parseFloat(data.salary) : null,
    wardId: data.wardId ? parseInt(data.wardId) : null
  }),
  relatedDataTitle: 'Doctor Information'
};

// Treatment Configuration
export const treatmentConfig = {
  fields: [
    {
      name: 'treatmentId',
      label: 'Treatment ID',
      type: FIELD_TYPES.NUMBER,
      required: true,
      placeholder: 'Enter Treatment ID',
      disabled: true // Only for edit mode
    },
    {
      name: 'date',
      label: 'Date',
      type: FIELD_TYPES.DATE,
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      name: 'patientPersonId',
      label: 'Patient',
      type: FIELD_TYPES.SELECT,
      required: true,
      dataSource: 'patients',
      valueField: 'personId',
      displayField: 'firstname',
      displayFormat: (patient) => `${patient.firstname} ${patient.name}`,
      placeholder: 'Select Patient'
    },
    {
      name: 'doctorPersonId',
      label: 'Doctor',
      type: FIELD_TYPES.SELECT,
      required: true,
      dataSource: 'doctors',
      valueField: 'personId',
      displayField: 'firstname',
      displayFormat: (doctor) => `${doctor.firstname} ${doctor.name} - ${doctor.department}`,
      placeholder: 'Select Doctor'
    },
    {
      name: 'therapy',
      label: 'Therapy Description',
      type: FIELD_TYPES.TEXTAREA,
      fullWidth: true,
      placeholder: 'Enter therapy details...'
    }
  ],
  title: 'Add New Treatment',
  listTitle: 'Treatment List',
  saveButtonText: 'Save Treatment',
  successMessage: 'Treatment created successfully!',
  updateSuccessMessage: 'Treatment updated successfully!',
  dataTransform: (data) => ({
    ...data,
    treatmentId: data.treatmentId ? parseInt(data.treatmentId) : undefined,
    patientPersonId: parseInt(data.patientPersonId),
    doctorPersonId: parseInt(data.doctorPersonId)
  })
};

// Ward Configuration
export const wardConfig = {
  fields: [
    {
      name: 'wardId',
      label: 'Ward ID',
      type: FIELD_TYPES.NUMBER,
      required: true,
      placeholder: 'Enter Ward ID'
    },
    {
      name: 'wardName',
      label: 'Ward Name',
      type: FIELD_TYPES.TEXT,
      required: true,
      placeholder: 'Enter ward name'
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: FIELD_TYPES.NUMBER,
      required: true,
      placeholder: 'Enter capacity',
      inputProps: { min: '1' }
    },
    {
      name: 'description',
      label: 'Description',
      type: FIELD_TYPES.TEXTAREA,
      fullWidth: true,
      placeholder: 'Enter ward description...'
    }
  ],
  title: 'Add New Ward',
  listTitle: 'Ward List',
  saveButtonText: 'Save Ward',
  successMessage: 'Ward created successfully!',
  updateSuccessMessage: 'Ward updated successfully!',
  dataTransform: (data) => ({
    ...data,
    wardId: data.wardId ? parseInt(data.wardId) : undefined,
    capacity: parseInt(data.capacity)
  }),
  customValidation: (data) => {
    if (parseInt(data.capacity) <= 0) {
      return 'Capacity must be greater than 0';
    }
    return null;
  }
};

// Dependent data configurations
export const dependentDataConfigs = {
  wards: {
    apiCall: () => wardAPI.getAll()
  },
  patients: {
    apiCall: () => patientAPI.getAll()
  },
  doctors: {
    apiCall: () => employeeAPI.getAll()
  }
};

// Related data configurations
export const relatedDataConfigs = {
  patientTreatments: {
    treatments: {
      title: 'Patient Treatments',
      apiCall: (patientId) => fetch(`http://localhost:8080/api/treatments/patient/${patientId}`).then(res => res.json()),
      keyField: 'treatmentId',
      maxRows: 5,
      emptyMessage: 'No treatments found for this patient.',
      columns: [
        { key: 'treatmentId', title: 'Treatment ID' },
        { key: 'date', title: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        { key: 'therapy', title: 'Therapy' }
      ]
    }
  },
  doctorTreatments: {
    treatments: {
      title: 'Doctor Treatments',
      apiCall: (doctorId) => fetch(`http://localhost:8080/api/treatments/doctor/${doctorId}`).then(res => res.json()),
      keyField: 'treatmentId',
      maxRows: 5,
      emptyMessage: 'No treatments found for this doctor.',
      columns: [
        { key: 'treatmentId', title: 'Treatment ID' },
        { key: 'date', title: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        { key: 'therapy', title: 'Therapy' }
      ]
    }
  }
};