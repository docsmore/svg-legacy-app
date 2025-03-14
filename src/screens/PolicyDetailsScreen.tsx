"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy } from '@/types';
import { getPolicyByNumber } from '@/services/mockDataService';

const PolicyDetailsScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState<Policy | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    const policyNumber = searchParams.get('policyNumber');
    if (policyNumber) {
      const foundPolicy = getPolicyByNumber(policyNumber);
      if (foundPolicy) {
        setPolicy(foundPolicy);
      } else {
        setMessage('Policy not found');
      }
    } else {
      setMessage('No policy number provided');
    }
  }, [searchParams]);
  
  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      // Return to policy search
      router.push('/policy-search');
    } else if (key === 'F4') {
      // Edit policyholder
      if (policy) {
        router.push(`/policyholder-management?policyNumber=${policy.policyNumber}`);
      }
    } else if (key === 'F5') {
      // Refresh policy details
      if (policy) {
        const refreshedPolicy = getPolicyByNumber(policy.policyNumber);
        if (refreshedPolicy) {
          setPolicy(refreshedPolicy);
          setMessage('Policy details refreshed');
        }
      }
    }
  };
  
  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} },
    { key: 'F4', description: 'Edit Policyholder', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} }
  ];
  
  const screenConfig: ScreenConfig = {
    title: 'POLICY DETAILS',
    fields: [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'POLICY DETAILS', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Message line
      { row: 3, col: 2, length: 60, value: message, isHighlighted: true },
      
      // Policy details
      { row: 5, col: 2, length: 20, value: 'Policy Number:' },
      { row: 5, col: 20, length: 15, value: policy?.policyNumber || '', isHighlighted: true },
      
      { row: 6, col: 2, length: 20, value: 'Status:' },
      { row: 6, col: 20, length: 15, value: policy?.status || '', isHighlighted: true },
      
      { row: 7, col: 2, length: 20, value: 'Product Type:' },
      { row: 7, col: 20, length: 15, value: policy?.productType || '', isHighlighted: true },
      
      { row: 8, col: 2, length: 20, value: 'Effective Date:' },
      { row: 8, col: 20, length: 15, value: policy?.effectiveDate || '', isHighlighted: true },
      
      { row: 9, col: 2, length: 20, value: 'Expiration Date:' },
      { row: 9, col: 20, length: 15, value: policy?.expirationDate || '', isHighlighted: true },
      
      { row: 10, col: 2, length: 20, value: 'Premium:' },
      { row: 10, col: 20, length: 15, value: policy ? `$${policy.premium.toFixed(2)}` : '', isHighlighted: true },
      
      // Policyholder details
      { row: 12, col: 2, length: 30, value: '--- POLICYHOLDER INFORMATION ---', isHighlighted: true },
      
      { row: 13, col: 2, length: 20, value: 'ID:' },
      { row: 13, col: 20, length: 15, value: policy?.policyHolder.id || '', isHighlighted: true },
      
      { row: 14, col: 2, length: 20, value: 'Name:' },
      { row: 14, col: 20, length: 30, value: policy ? `${policy.policyHolder.firstName} ${policy.policyHolder.lastName}` : '', isHighlighted: true },
      
      { row: 15, col: 2, length: 20, value: 'Date of Birth:' },
      { row: 15, col: 20, length: 15, value: policy?.policyHolder.dateOfBirth || '', isHighlighted: true },
      
      { row: 16, col: 2, length: 20, value: 'SSN:' },
      { row: 16, col: 20, length: 15, value: policy?.policyHolder.ssn || '', isHighlighted: true },
      
      { row: 17, col: 2, length: 20, value: 'Email:' },
      { row: 17, col: 20, length: 30, value: policy?.policyHolder.email || '', isHighlighted: true },
      
      { row: 18, col: 2, length: 20, value: 'Phone:' },
      { row: 18, col: 20, length: 15, value: policy?.policyHolder.phone || '', isHighlighted: true },
      
      // Address
      { row: 19, col: 2, length: 20, value: 'Address:' },
      { row: 19, col: 20, length: 40, value: policy?.policyHolder.address.street1 || '', isHighlighted: true },
      
      { row: 20, col: 20, length: 40, value: policy?.policyHolder.address.street2 || '', isHighlighted: true },
      
      { row: 21, col: 20, length: 40, value: policy ? 
        `${policy.policyHolder.address.city}, ${policy.policyHolder.address.state} ${policy.policyHolder.address.zipCode}` : 
        '', 
        isHighlighted: true 
      },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Edit Policyholder  F5=Refresh', isHighlighted: true }
    ],
    functionKeys
  };
  
  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} />;
};

export default PolicyDetailsScreen;
