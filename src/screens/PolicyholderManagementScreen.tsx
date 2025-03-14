"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy, PolicyHolder, Address } from '@/types';
import { getPolicyByNumber, updatePolicyHolder, updatePolicyHolderAddress } from '@/services/mockDataService';

const PolicyholderManagementScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState<Policy | undefined>(undefined);
  const [editMode, setEditMode] = useState<'personal' | 'address' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [policyHolder, setPolicyHolder] = useState<PolicyHolder | undefined>(undefined);
  const [address, setAddress] = useState<Address | undefined>(undefined);
  
  useEffect(() => {
    const policyNumber = searchParams.get('policyNumber');
    if (policyNumber) {
      const foundPolicy = getPolicyByNumber(policyNumber);
      if (foundPolicy) {
        setPolicy(foundPolicy);
        setPolicyHolder(foundPolicy.policyHolder);
        setAddress(foundPolicy.policyHolder.address);
      } else {
        setMessage('Policy not found');
      }
    } else {
      setMessage('No policy number provided');
    }
  }, [searchParams]);
  
  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      // Return to policy details
      if (policy) {
        router.push(`/policy-details?policyNumber=${policy.policyNumber}`);
      } else {
        router.push('/policy-search');
      }
    } else if (key === 'F4') {
      // Toggle edit mode
      if (editMode === null) {
        setEditMode('personal');
        setMessage('Editing personal information. Press Enter to save.');
      } else if (editMode === 'personal') {
        setEditMode('address');
        setMessage('Editing address information. Press Enter to save.');
      } else {
        setEditMode(null);
        setMessage('View mode. Press F4 to edit.');
      }
    } else if (key === 'Enter') {
      // Save changes
      if (editMode === 'personal' && policy && policyHolder) {
        const updatedPolicy = updatePolicyHolder(policy.policyNumber, policyHolder);
        if (updatedPolicy) {
          setPolicy(updatedPolicy);
          setPolicyHolder(updatedPolicy.policyHolder);
          setAddress(updatedPolicy.policyHolder.address);
          setMessage('Personal information updated successfully');
        } else {
          setMessage('Failed to update personal information');
        }
      } else if (editMode === 'address' && policy && address) {
        const updatedPolicy = updatePolicyHolderAddress(policy.policyNumber, address);
        if (updatedPolicy) {
          setPolicy(updatedPolicy);
          setPolicyHolder(updatedPolicy.policyHolder);
          setAddress(updatedPolicy.policyHolder.address);
          setMessage('Address updated successfully');
        } else {
          setMessage('Failed to update address');
        }
      }
    }
  };
  
  const handleFieldChange = (fieldName: string, value: string) => {
    if (!policyHolder || !address) return;
    
    // Handle personal information fields
    if (fieldName === 'firstName') {
      setPolicyHolder({ ...policyHolder, firstName: value });
    } else if (fieldName === 'lastName') {
      setPolicyHolder({ ...policyHolder, lastName: value });
    } else if (fieldName === 'email') {
      setPolicyHolder({ ...policyHolder, email: value });
    } else if (fieldName === 'phone') {
      setPolicyHolder({ ...policyHolder, phone: value });
    } 
    // Handle address fields
    else if (fieldName === 'street1') {
      setAddress({ ...address, street1: value });
    } else if (fieldName === 'street2') {
      setAddress({ ...address, street2: value });
    } else if (fieldName === 'city') {
      setAddress({ ...address, city: value });
    } else if (fieldName === 'state') {
      setAddress({ ...address, state: value });
    } else if (fieldName === 'zipCode') {
      setAddress({ ...address, zipCode: value });
    }
  };
  
  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} },
    { key: 'F4', description: 'Edit', action: () => {} },
    { key: 'Enter', description: 'Save', action: () => {} }
  ];
  
  const screenConfig: ScreenConfig = {
    title: 'POLICYHOLDER MANAGEMENT',
    fields: [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'POLICYHOLDER MANAGEMENT', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Message line
      { row: 3, col: 2, length: 60, value: message, isHighlighted: true },
      
      // Policy info
      { row: 5, col: 2, length: 20, value: 'Policy Number:' },
      { row: 5, col: 20, length: 15, value: policy?.policyNumber || '', isHighlighted: true },
      
      // Policyholder personal information
      { row: 7, col: 2, length: 30, value: '--- PERSONAL INFORMATION ---', isHighlighted: true },
      
      { row: 8, col: 2, length: 20, value: 'First Name:' },
      { 
        row: 8, 
        col: 20, 
        length: 20, 
        value: policyHolder?.firstName || '', 
        isEditable: editMode === 'personal',
        isHighlighted: editMode === 'personal',
        fieldName: 'firstName'
      },
      
      { row: 9, col: 2, length: 20, value: 'Last Name:' },
      { 
        row: 9, 
        col: 20, 
        length: 20, 
        value: policyHolder?.lastName || '', 
        isEditable: editMode === 'personal',
        isHighlighted: editMode === 'personal',
        fieldName: 'lastName'
      },
      
      { row: 10, col: 2, length: 20, value: 'Date of Birth:' },
      { row: 10, col: 20, length: 15, value: policyHolder?.dateOfBirth || '', isHighlighted: true },
      
      { row: 11, col: 2, length: 20, value: 'SSN:' },
      { row: 11, col: 20, length: 15, value: policyHolder?.ssn || '', isHighlighted: true },
      
      { row: 12, col: 2, length: 20, value: 'Email:' },
      { 
        row: 12, 
        col: 20, 
        length: 30, 
        value: policyHolder?.email || '', 
        isEditable: editMode === 'personal',
        isHighlighted: editMode === 'personal',
        fieldName: 'email'
      },
      
      { row: 13, col: 2, length: 20, value: 'Phone:' },
      { 
        row: 13, 
        col: 20, 
        length: 15, 
        value: policyHolder?.phone || '', 
        isEditable: editMode === 'personal',
        isHighlighted: editMode === 'personal',
        fieldName: 'phone'
      },
      
      // Address information
      { row: 15, col: 2, length: 30, value: '--- ADDRESS INFORMATION ---', isHighlighted: true },
      
      { row: 16, col: 2, length: 20, value: 'Street 1:' },
      { 
        row: 16, 
        col: 20, 
        length: 40, 
        value: address?.street1 || '', 
        isEditable: editMode === 'address',
        isHighlighted: editMode === 'address',
        fieldName: 'street1'
      },
      
      { row: 17, col: 2, length: 20, value: 'Street 2:' },
      { 
        row: 17, 
        col: 20, 
        length: 40, 
        value: address?.street2 || '', 
        isEditable: editMode === 'address',
        isHighlighted: editMode === 'address',
        fieldName: 'street2'
      },
      
      { row: 18, col: 2, length: 20, value: 'City:' },
      { 
        row: 18, 
        col: 20, 
        length: 20, 
        value: address?.city || '', 
        isEditable: editMode === 'address',
        isHighlighted: editMode === 'address',
        fieldName: 'city'
      },
      
      { row: 19, col: 2, length: 20, value: 'State:' },
      { 
        row: 19, 
        col: 20, 
        length: 2, 
        value: address?.state || '', 
        isEditable: editMode === 'address',
        isHighlighted: editMode === 'address',
        fieldName: 'state'
      },
      
      { row: 20, col: 2, length: 20, value: 'Zip Code:' },
      { 
        row: 20, 
        col: 20, 
        length: 10, 
        value: address?.zipCode || '', 
        isEditable: editMode === 'address',
        isHighlighted: editMode === 'address',
        fieldName: 'zipCode'
      },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Edit  Enter=Save', isHighlighted: true }
    ],
    functionKeys
  };
  
  return (
    <Terminal 
      screenConfig={screenConfig} 
      onKeyPress={handleKeyPress} 
      onFieldChange={handleFieldChange} 
    />
  );
};

export default PolicyholderManagementScreen;
