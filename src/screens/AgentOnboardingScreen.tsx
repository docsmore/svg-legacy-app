"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Agent, ScreenField } from '@/types';
import { createAgent, getAgentById } from '@/services/mockDataService';

enum OnboardingStep {
  PERSONAL_INFO = 'PERSONAL_INFO',
  LICENSE_INFO = 'LICENSE_INFO',
  HIERARCHY_INFO = 'HIERARCHY_INFO',
  REVIEW = 'REVIEW',
  COMPLETE = 'COMPLETE'
}

const HIERARCHY_LEVELS = ['Preneed Counselor', 'Funeral Director', 'Regional Director', 'Marketing Organization (IMO)'];

const AgentOnboardingScreen: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.PERSONAL_INFO);
  const [message, setMessage] = useState<string>('Enter agent personal information');

  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
    email: '',
    phone: ''
  });

  const [licenseData, setLicenseData] = useState({
    licenseNumber: '',
    licenseState: ''
  });

  const [hierarchyData, setHierarchyData] = useState({
    hierarchyLevel: 'Preneed Counselor',
    uplineAgentId: '',
    assignedLocation: '',
    commissionPercent: '35'
  });

  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      router.push('/agent-search');
    } else if (key === 'F4' && step !== OnboardingStep.COMPLETE) {
      handleSaveAndProceed();
    } else if (key === 'Enter' && step === OnboardingStep.COMPLETE) {
      router.push('/agent-search');
    }
  };

  const handleSaveAndProceed = () => {
    if (step === OnboardingStep.PERSONAL_INFO) {
      if (!validatePersonalInfo()) return;
      setStep(OnboardingStep.LICENSE_INFO);
      setMessage('Enter license information');
    } else if (step === OnboardingStep.LICENSE_INFO) {
      if (!validateLicenseInfo()) return;
      setStep(OnboardingStep.HIERARCHY_INFO);
      setMessage('Enter hierarchy / appointment information');
    } else if (step === OnboardingStep.HIERARCHY_INFO) {
      if (!validateHierarchyInfo()) return;
      setStep(OnboardingStep.REVIEW);
      setMessage('Review agent information before saving');
    } else if (step === OnboardingStep.REVIEW) {
      try {
        const newAgent = createAgent({
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          ssn: personalData.ssn,
          email: personalData.email,
          phone: personalData.phone,
          licenseNumber: licenseData.licenseNumber,
          licenseState: licenseData.licenseState,
          hierarchyLevel: hierarchyData.hierarchyLevel,
          uplineAgentId: hierarchyData.uplineAgentId || undefined,
          assignedLocation: hierarchyData.assignedLocation || undefined,
          appointmentDate: new Date().toISOString().split('T')[0],
          commissionPercent: parseFloat(hierarchyData.commissionPercent) || 0
        });

        setCreatedAgent(newAgent);
        setStep(OnboardingStep.COMPLETE);
        setMessage(`Agent ${newAgent.agentId} created — pending nightly batch sync`);
      } catch (error) {
        setMessage('Error creating agent record. Please try again.');
        console.error('Error creating agent:', error);
      }
    }
  };

  const validatePersonalInfo = (): boolean => {
    if (!personalData.firstName.trim()) { setMessage('First name is required'); return false; }
    if (!personalData.lastName.trim()) { setMessage('Last name is required'); return false; }
    if (!/^\d{3}-?\d{2}-?\d{4}$/.test(personalData.ssn.trim())) { setMessage('SSN must be in format XXX-XX-XXXX'); return false; }
    if (!/^\S+@\S+\.\S+$/.test(personalData.email.trim())) { setMessage('A valid email address is required'); return false; }
    if (!personalData.phone.trim()) { setMessage('Phone is required'); return false; }
    return true;
  };

  const validateLicenseInfo = (): boolean => {
    if (!licenseData.licenseNumber.trim()) { setMessage('License number is required'); return false; }
    if (!/^[A-Za-z]{2}$/.test(licenseData.licenseState.trim())) { setMessage('License state must be a 2-letter state code'); return false; }
    return true;
  };

  const validateHierarchyInfo = (): boolean => {
    if (!HIERARCHY_LEVELS.some(l => l.toLowerCase() === hierarchyData.hierarchyLevel.toLowerCase())) {
      setMessage(`Hierarchy level must be one of: ${HIERARCHY_LEVELS.join(' / ')}`);
      return false;
    }
    if (hierarchyData.uplineAgentId.trim() && !getAgentById(hierarchyData.uplineAgentId.trim().toUpperCase())) {
      setMessage(`Upline agent ${hierarchyData.uplineAgentId.trim().toUpperCase()} not found on Agent Master File`);
      return false;
    }
    const commission = parseFloat(hierarchyData.commissionPercent);
    if (isNaN(commission) || commission < 0 || commission > 100) {
      setMessage('Commission % must be a number between 0 and 100');
      return false;
    }
    return true;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (step === OnboardingStep.PERSONAL_INFO) {
      setPersonalData({ ...personalData, [fieldName]: value });
    } else if (step === OnboardingStep.LICENSE_INFO) {
      setLicenseData({ ...licenseData, [fieldName]: value });
    } else if (step === OnboardingStep.HIERARCHY_INFO) {
      setHierarchyData({ ...hierarchyData, [fieldName]: value });
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} }
  ];
  if (step !== OnboardingStep.COMPLETE) {
    functionKeys.push({ key: 'F4', description: 'Save & Continue', action: () => {} });
  } else {
    functionKeys.push({ key: 'Enter', description: 'Agent Master File', action: () => {} });
  }

  let fields: ScreenField[] = [
    { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
    { row: 1, col: 0, length: 80, value: 'AGENT ONBOARDING — NEW APPOINTMENT (AGTAPP)', isHighlighted: true },
    { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
    { row: 4, col: 2, length: 76, value: message, isHighlighted: true }
  ];

  if (step === OnboardingStep.PERSONAL_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'PERSONAL INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'First Name:' },
      { row: 8, col: 25, length: 25, value: personalData.firstName, isEditable: true, fieldName: 'firstName' } as ScreenField,
      { row: 9, col: 2, length: 20, value: 'Last Name:' },
      { row: 9, col: 25, length: 25, value: personalData.lastName, isEditable: true, fieldName: 'lastName' } as ScreenField,
      { row: 10, col: 2, length: 20, value: 'SSN:' },
      { row: 10, col: 25, length: 11, value: personalData.ssn, isEditable: true, fieldName: 'ssn' } as ScreenField,
      { row: 11, col: 2, length: 20, value: 'Email:' },
      { row: 11, col: 25, length: 40, value: personalData.email, isEditable: true, fieldName: 'email' } as ScreenField,
      { row: 12, col: 2, length: 20, value: 'Phone:' },
      { row: 12, col: 25, length: 15, value: personalData.phone, isEditable: true, fieldName: 'phone' } as ScreenField,
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === OnboardingStep.LICENSE_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'LICENSE INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'License Number:' },
      { row: 8, col: 25, length: 20, value: licenseData.licenseNumber, isEditable: true, fieldName: 'licenseNumber' } as ScreenField,
      { row: 9, col: 2, length: 20, value: 'License State:' },
      { row: 9, col: 25, length: 2, value: licenseData.licenseState, isEditable: true, fieldName: 'licenseState' } as ScreenField,
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === OnboardingStep.HIERARCHY_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'HIERARCHY / APPOINTMENT', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Hierarchy Level:' },
      { row: 8, col: 25, length: 30, value: hierarchyData.hierarchyLevel, isEditable: true, fieldName: 'hierarchyLevel' } as ScreenField,
      { row: 9, col: 2, length: 60, value: `  (Valid: ${HIERARCHY_LEVELS.join(' / ')})` },
      { row: 11, col: 2, length: 20, value: 'Upline Agent #:' },
      { row: 11, col: 25, length: 9, value: hierarchyData.uplineAgentId, isEditable: true, fieldName: 'uplineAgentId' } as ScreenField,
      { row: 12, col: 2, length: 60, value: '  (blank = none; F5 on Agent Search to look up agent #s)' },
      { row: 14, col: 2, length: 20, value: 'Assigned Location:' },
      { row: 14, col: 25, length: 45, value: hierarchyData.assignedLocation, isEditable: true, fieldName: 'assignedLocation' } as ScreenField,
      { row: 15, col: 2, length: 60, value: '  (e.g. funeral home / branch name — City, ST; optional)' },
      { row: 17, col: 2, length: 20, value: 'Commission %:' },
      { row: 17, col: 25, length: 6, value: hierarchyData.commissionPercent, isEditable: true, fieldName: 'commissionPercent' } as ScreenField,
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === OnboardingStep.REVIEW) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'REVIEW AGENT INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Name:' },
      { row: 8, col: 25, length: 40, value: `${personalData.firstName} ${personalData.lastName}` },
      { row: 9, col: 2, length: 20, value: 'SSN:' },
      { row: 9, col: 25, length: 15, value: personalData.ssn },
      { row: 10, col: 2, length: 20, value: 'Email:' },
      { row: 10, col: 25, length: 40, value: personalData.email },
      { row: 11, col: 2, length: 20, value: 'Phone:' },
      { row: 11, col: 25, length: 20, value: personalData.phone },
      { row: 12, col: 2, length: 20, value: 'License:' },
      { row: 12, col: 25, length: 30, value: `${licenseData.licenseNumber} (${licenseData.licenseState.toUpperCase()})` },
      { row: 13, col: 2, length: 20, value: 'Hierarchy Level:' },
      { row: 13, col: 25, length: 30, value: hierarchyData.hierarchyLevel },
      { row: 14, col: 2, length: 20, value: 'Upline Agent #:' },
      { row: 14, col: 25, length: 20, value: hierarchyData.uplineAgentId.toUpperCase() || 'NONE' },
      { row: 15, col: 2, length: 20, value: 'Assigned Location:' },
      { row: 15, col: 25, length: 45, value: hierarchyData.assignedLocation || 'NONE' },
      { row: 16, col: 2, length: 20, value: 'Commission %:' },
      { row: 16, col: 25, length: 10, value: `${hierarchyData.commissionPercent}%` },
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Create Agent', isHighlighted: true }
    ];
  } else if (step === OnboardingStep.COMPLETE) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 40, value: 'AGENT RECORD CREATED SUCCESSFULLY', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Agent Number:' },
      { row: 8, col: 25, length: 15, value: createdAgent?.agentId || '', isHighlighted: true },
      { row: 9, col: 2, length: 20, value: 'Status:' },
      { row: 9, col: 25, length: 20, value: createdAgent?.status || '' },
      { row: 10, col: 2, length: 20, value: 'Sync Status:' },
      { row: 10, col: 25, length: 30, value: createdAgent?.syncStatus || '' },
      { row: 12, col: 2, length: 76, value: 'Record queued for nightly batch replication to:' },
      { row: 13, col: 4, length: 76, value: '  - SVGLife Agent Master (svg-lifepro-simulation)' },
      { row: 14, col: 4, length: 76, value: '  - PAS Producer File (svg-pas-simulation)' },
      { row: 16, col: 2, length: 60, value: 'Press Enter to return to Agent Master File Inquiry.' },
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  Enter=Agent Master File', isHighlighted: true }
    ];
  }

  const screenConfig: ScreenConfig = {
    title: 'AGENT ONBOARDING',
    fields,
    functionKeys
  };

  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default AgentOnboardingScreen;
