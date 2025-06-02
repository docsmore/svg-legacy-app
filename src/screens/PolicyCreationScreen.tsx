"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy, PolicyStatus, ProductType, PolicyHolder, Address, ScreenField } from '@/types';
import { createPolicy } from '@/services/mockDataService';

enum CreationStep {
  POLICY_INFO = 'POLICY_INFO',
  POLICYHOLDER_INFO = 'POLICYHOLDER_INFO',
  ADDRESS_INFO = 'ADDRESS_INFO',
  REVIEW = 'REVIEW',
  COMPLETE = 'COMPLETE'
}

const PolicyCreationScreen: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<CreationStep>(CreationStep.POLICY_INFO);
  const [message, setMessage] = useState<string>('Enter policy information');
  
  // Policy form data
  const [policyData, setPolicyData] = useState<Partial<Policy>>({
    status: PolicyStatus.PENDING,
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    premium: 0,
    productType: ProductType.AUTO,
    isPaidPlan: false
  });
  
  // Policyholder form data
  const [policyHolderData, setPolicyHolderData] = useState<Partial<PolicyHolder>>({
    id: `PH${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: ''
  });
  
  // Address form data
  const [addressData, setAddressData] = useState<Partial<Address>>({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      // Return to policy search
      router.push('/policy-search');
    } else if (key === 'F4' && step !== CreationStep.COMPLETE) {
      // Save and proceed to next step
      handleSaveAndProceed();
    } else if (key === 'Enter' && step === CreationStep.COMPLETE) {
      // Navigate to the newly created policy
      router.push(`/policy-details?policyNumber=${(policyData as Policy).policyNumber}`);
    }
  };
  
  const handleSaveAndProceed = () => {
    if (step === CreationStep.POLICY_INFO) {
      // Validate policy info
      if (!validatePolicyInfo()) {
        return;
      }
      setStep(CreationStep.POLICYHOLDER_INFO);
      setMessage('Enter policyholder information');
    } else if (step === CreationStep.POLICYHOLDER_INFO) {
      // Validate policyholder info
      if (!validatePolicyholderInfo()) {
        return;
      }
      setStep(CreationStep.ADDRESS_INFO);
      setMessage('Enter address information');
    } else if (step === CreationStep.ADDRESS_INFO) {
      // Validate address info
      if (!validateAddressInfo()) {
        return;
      }
      setStep(CreationStep.REVIEW);
      setMessage('Review policy information before saving');
    } else if (step === CreationStep.REVIEW) {
      // Create the policy
      try {
        const newPolicy = createPolicy({
          ...policyData as Omit<Policy, 'policyNumber'>,
          policyHolder: {
            ...policyHolderData as PolicyHolder,
            address: addressData as Address
          }
        });
        
        // Update policy data with the generated policy number
        setPolicyData(newPolicy);
        
        setStep(CreationStep.COMPLETE);
        setMessage(`Policy ${newPolicy.policyNumber} created successfully!`);
      } catch (error) {
        setMessage('Error creating policy. Please try again.');
        console.error('Error creating policy:', error);
      }
    }
  };
  
  const validatePolicyInfo = (): boolean => {
    if (!policyData.effectiveDate) {
      setMessage('Effective date is required');
      return false;
    }
    if (!policyData.expirationDate) {
      setMessage('Expiration date is required');
      return false;
    }
    if (policyData.premium === undefined || policyData.premium < 0) {
      setMessage('Premium must be a positive number');
      return false;
    }
    if (!policyData.productType) {
      setMessage('Product type is required');
      return false;
    }
    return true;
  };
  
  const validatePolicyholderInfo = (): boolean => {
    if (!policyHolderData.firstName) {
      setMessage('First name is required');
      return false;
    }
    if (!policyHolderData.lastName) {
      setMessage('Last name is required');
      return false;
    }
    if (!policyHolderData.dateOfBirth) {
      setMessage('Date of birth is required');
      return false;
    }
    if (!policyHolderData.ssn) {
      setMessage('SSN is required');
      return false;
    }
    if (!policyHolderData.email) {
      setMessage('Email is required');
      return false;
    }
    if (!policyHolderData.phone) {
      setMessage('Phone is required');
      return false;
    }
    return true;
  };
  
  const validateAddressInfo = (): boolean => {
    if (!addressData.street1) {
      setMessage('Street address is required');
      return false;
    }
    if (!addressData.city) {
      setMessage('City is required');
      return false;
    }
    if (!addressData.state) {
      setMessage('State is required');
      return false;
    }
    if (!addressData.zipCode) {
      setMessage('Zip code is required');
      return false;
    }
    return true;
  };
  
  const handleFieldChange = (fieldName: string, value: string) => {
    if (step === CreationStep.POLICY_INFO) {
      if (fieldName === 'premium') {
        setPolicyData({
          ...policyData,
          premium: parseFloat(value) || 0
        });
      } else if (fieldName === 'isPaidPlan') {
        setPolicyData({
          ...policyData,
          isPaidPlan: value.toLowerCase() === 'y' || value.toLowerCase() === 'yes' || value === '1'
        });
      } else if (fieldName === 'productType') {
        // Convert string to ProductType enum
        const productType = Object.values(ProductType).find(
          type => type.toLowerCase() === value.toLowerCase()
        );
        if (productType) {
          setPolicyData({
            ...policyData,
            productType
          });
        }
      } else if (fieldName === 'status') {
        // Convert string to PolicyStatus enum
        const status = Object.values(PolicyStatus).find(
          status => status.toLowerCase() === value.toLowerCase()
        );
        if (status) {
          setPolicyData({
            ...policyData,
            status
          });
        }
      } else {
        setPolicyData({
          ...policyData,
          [fieldName]: value
        });
      }
    } else if (step === CreationStep.POLICYHOLDER_INFO) {
      setPolicyHolderData({
        ...policyHolderData,
        [fieldName]: value
      });
    } else if (step === CreationStep.ADDRESS_INFO) {
      setAddressData({
        ...addressData,
        [fieldName]: value
      });
    }
  };
  
  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} }
  ];
  
  if (step !== CreationStep.COMPLETE) {
    functionKeys.push({ key: 'F4', description: 'Save & Continue', action: () => {} });
  } else {
    functionKeys.push({ key: 'Enter', description: 'View Policy', action: () => {} });
  }
  
  // Dynamic fields based on the current step
  let fields: ScreenField[] = [
    // Header - common for all steps
    { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
    { row: 1, col: 0, length: 80, value: 'CREATE NEW POLICY', isHighlighted: true },
    { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
    
    // Message line
    { row: 4, col: 2, length: 76, value: message, isHighlighted: true }
  ];
  
  // Step-specific fields
  if (step === CreationStep.POLICY_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'POLICY INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Status:' },
      { row: 8, col: 25, length: 15, value: policyData.status || '', isEditable: true, fieldName: 'status' } as ScreenField,
      { row: 9, col: 2, length: 20, value: 'Effective Date:' },
      { row: 9, col: 25, length: 10, value: policyData.effectiveDate || '', isEditable: true, fieldName: 'effectiveDate' } as ScreenField,
      { row: 10, col: 2, length: 20, value: 'Expiration Date:' },
      { row: 10, col: 25, length: 10, value: policyData.expirationDate || '', isEditable: true, fieldName: 'expirationDate' } as ScreenField,
      { row: 11, col: 2, length: 20, value: 'Premium:' },
      { row: 11, col: 25, length: 10, value: policyData.premium?.toString() || '0', isEditable: true, fieldName: 'premium' } as ScreenField,
      { row: 12, col: 2, length: 20, value: 'Product Type:' },
      { row: 12, col: 25, length: 15, value: policyData.productType || '', isEditable: true, fieldName: 'productType' } as ScreenField,
      { row: 13, col: 2, length: 20, value: 'Paid Plan (Y/N):' },
      { row: 13, col: 25, length: 1, value: policyData.isPaidPlan ? 'Y' : 'N', isEditable: true, fieldName: 'isPaidPlan' } as ScreenField,
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === CreationStep.POLICYHOLDER_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'POLICYHOLDER INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'First Name:' },
      { row: 8, col: 25, length: 30, value: policyHolderData.firstName || '', isEditable: true, fieldName: 'firstName' } as ScreenField,
      { row: 9, col: 2, length: 20, value: 'Last Name:' },
      { row: 9, col: 25, length: 30, value: policyHolderData.lastName || '', isEditable: true, fieldName: 'lastName' } as ScreenField,
      { row: 10, col: 2, length: 20, value: 'Date of Birth:' },
      { row: 10, col: 25, length: 10, value: policyHolderData.dateOfBirth || '', isEditable: true, fieldName: 'dateOfBirth' } as ScreenField,
      { row: 11, col: 2, length: 20, value: 'SSN:' },
      { row: 11, col: 25, length: 11, value: policyHolderData.ssn || '', isEditable: true, fieldName: 'ssn' } as ScreenField,
      { row: 12, col: 2, length: 20, value: 'Email:' },
      { row: 12, col: 25, length: 40, value: policyHolderData.email || '', isEditable: true, fieldName: 'email' } as ScreenField,
      { row: 13, col: 2, length: 20, value: 'Phone:' },
      { row: 13, col: 25, length: 15, value: policyHolderData.phone || '', isEditable: true, fieldName: 'phone' } as ScreenField,
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === CreationStep.ADDRESS_INFO) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'ADDRESS INFORMATION', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Street 1:' },
      { row: 8, col: 25, length: 40, value: addressData.street1 || '', isEditable: true, fieldName: 'street1' } as ScreenField,
      { row: 9, col: 2, length: 20, value: 'Street 2:' },
      { row: 9, col: 25, length: 40, value: addressData.street2 || '', isEditable: true, fieldName: 'street2' } as ScreenField,
      { row: 10, col: 2, length: 20, value: 'City:' },
      { row: 10, col: 25, length: 30, value: addressData.city || '', isEditable: true, fieldName: 'city' } as ScreenField,
      { row: 11, col: 2, length: 20, value: 'State:' },
      { row: 11, col: 25, length: 2, value: addressData.state || '', isEditable: true, fieldName: 'state' } as ScreenField,
      { row: 12, col: 2, length: 20, value: 'Zip Code:' },
      { row: 12, col: 25, length: 10, value: addressData.zipCode || '', isEditable: true, fieldName: 'zipCode' } as ScreenField,
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Continue', isHighlighted: true }
    ];
  } else if (step === CreationStep.REVIEW) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'REVIEW POLICY INFORMATION', isHighlighted: true },
      
      // Policy Info
      { row: 8, col: 2, length: 20, value: 'Product Type:' },
      { row: 8, col: 25, length: 15, value: policyData.productType || '' },
      { row: 9, col: 2, length: 20, value: 'Premium:' },
      { row: 9, col: 25, length: 10, value: `$${policyData.premium?.toFixed(2)}` },
      { row: 10, col: 2, length: 20, value: 'Effective Date:' },
      { row: 10, col: 25, length: 10, value: policyData.effectiveDate || '' },
      
      // Policyholder Info
      { row: 12, col: 2, length: 30, value: 'Policyholder:', isHighlighted: true },
      { row: 13, col: 2, length: 40, value: `${policyHolderData.firstName} ${policyHolderData.lastName}` },
      { row: 14, col: 2, length: 40, value: addressData.street1 },
      { row: 15, col: 2, length: 40, value: addressData.street2 },
      { row: 16, col: 2, length: 40, value: `${addressData.city}, ${addressData.state} ${addressData.zipCode}` },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  F4=Save & Create Policy', isHighlighted: true }
    ];
  } else if (step === CreationStep.COMPLETE) {
    fields = [
      ...fields,
      { row: 6, col: 2, length: 30, value: 'POLICY CREATED SUCCESSFULLY', isHighlighted: true },
      { row: 8, col: 2, length: 20, value: 'Policy Number:' },
      { row: 8, col: 25, length: 15, value: (policyData as Policy).policyNumber || '', isHighlighted: true },
      { row: 10, col: 2, length: 60, value: 'Press Enter to view the policy details.' },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  Enter=View Policy', isHighlighted: true }
    ];
  }
  
  const screenConfig: ScreenConfig = {
    title: 'CREATE NEW POLICY',
    fields,
    functionKeys
  };
  
  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default PolicyCreationScreen;
