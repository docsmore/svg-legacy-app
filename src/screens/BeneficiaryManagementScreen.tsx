"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Beneficiary, ScreenField } from '@/types';
import { 
  getPolicyByNumber, 
  getBeneficiaries, 
  addBeneficiary, 
  updateBeneficiary, 
  deleteBeneficiary 
} from '@/services/mockDataService';

enum BeneficiaryMode {
  LIST = 'LIST',
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

const BeneficiaryManagementScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [mode, setMode] = useState<BeneficiaryMode>(BeneficiaryMode.LIST);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [message, setMessage] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Beneficiary>>({});
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const policyNum = searchParams.get('policyNumber');
    if (policyNum) {
      setPolicyNumber(policyNum);
      const policy = getPolicyByNumber(policyNum);
      if (policy) {
        const beneficiaryList = getBeneficiaries(policyNum);
        setBeneficiaries(beneficiaryList);
        setMessage(`Found ${beneficiaryList.length} beneficiaries for policy ${policyNum}`);
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
      router.push(`/policy-details?policyNumber=${policyNumber}`);
    } else if (key === 'F5') {
      // Refresh beneficiary list
      const beneficiaryList = getBeneficiaries(policyNumber);
      setBeneficiaries(beneficiaryList);
      setMode(BeneficiaryMode.LIST);
      setMessage(`Found ${beneficiaryList.length} beneficiaries for policy ${policyNumber}`);
    } else if (key === 'F6' && mode === BeneficiaryMode.LIST) {
      // Add new beneficiary
      setMode(BeneficiaryMode.ADD);
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        relationship: '',
        percentage: 0
      });
      setMessage('Enter new beneficiary details');
    } else if (key === 'Enter') {
      handleEnterKey();
    }
  };

  const handleEnterKey = () => {
    if (mode === BeneficiaryMode.LIST && selectedIndex >= 0 && selectedIndex < beneficiaries.length) {
      // View/edit selected beneficiary
      setSelectedBeneficiary(beneficiaries[selectedIndex]);
      setFormData({...beneficiaries[selectedIndex]});
      setMode(BeneficiaryMode.EDIT);
      setMessage(`Editing beneficiary: ${beneficiaries[selectedIndex].firstName} ${beneficiaries[selectedIndex].lastName}`);
    } else if (mode === BeneficiaryMode.ADD) {
      // Add new beneficiary
      if (validateBeneficiaryForm()) {
        const newBeneficiary = addBeneficiary(policyNumber, formData as Omit<Beneficiary, 'id'>);
        if (newBeneficiary) {
          setBeneficiaries([...beneficiaries, newBeneficiary]);
          setMode(BeneficiaryMode.LIST);
          setMessage(`Beneficiary ${newBeneficiary.firstName} ${newBeneficiary.lastName} added successfully`);
        } else {
          setMessage('Failed to add beneficiary');
        }
      }
    } else if (mode === BeneficiaryMode.EDIT) {
      // Update beneficiary
      if (validateBeneficiaryForm() && selectedBeneficiary) {
        const updatedBeneficiary = updateBeneficiary(
          policyNumber,
          selectedBeneficiary.id,
          formData
        );
        if (updatedBeneficiary) {
          const updatedList = beneficiaries.map((b: Beneficiary) => 
            b.id === updatedBeneficiary.id ? updatedBeneficiary : b
          );
          setBeneficiaries(updatedList);
          setMode(BeneficiaryMode.LIST);
          setMessage(`Beneficiary ${updatedBeneficiary.firstName} ${updatedBeneficiary.lastName} updated successfully`);
        } else {
          setMessage('Failed to update beneficiary');
        }
      }
    } else if (mode === BeneficiaryMode.DELETE && selectedBeneficiary) {
      // Confirm deletion
      const success: boolean = deleteBeneficiary(policyNumber, selectedBeneficiary.id);
      if (success) {
        const updatedList: Beneficiary[] = beneficiaries.filter((b: Beneficiary) => b.id !== selectedBeneficiary.id);
        setBeneficiaries(updatedList);
        setMode(BeneficiaryMode.LIST);
        setMessage(`Beneficiary ${selectedBeneficiary.firstName} ${selectedBeneficiary.lastName} deleted successfully`);
      } else {
        setMessage('Failed to delete beneficiary');
      }
      setSelectedBeneficiary(null);
    }
  };

  const validateBeneficiaryForm = (): boolean => {
    if (!formData.firstName || formData.firstName.trim() === '') {
      setMessage('First name is required');
      return false;
    }
    if (!formData.lastName || formData.lastName.trim() === '') {
      setMessage('Last name is required');
      return false;
    }
    if (!formData.dateOfBirth || formData.dateOfBirth.trim() === '') {
      setMessage('Date of birth is required');
      return false;
    }
    if (!formData.relationship || formData.relationship.trim() === '') {
      setMessage('Relationship is required');
      return false;
    }
    if (formData.percentage === undefined || formData.percentage < 0 || formData.percentage > 100) {
      setMessage('Percentage must be between 0 and 100');
      return false;
    }
    return true;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (mode === BeneficiaryMode.LIST && fieldName === 'selectedIndex') {
      const index = parseInt(value, 10);
      if (!isNaN(index) && index >= 0 && index < beneficiaries.length) {
        setSelectedIndex(index);
      }
    } else if (mode === BeneficiaryMode.ADD || mode === BeneficiaryMode.EDIT) {
      if (fieldName === 'percentage') {
        setFormData({
          ...formData,
          [fieldName]: parseFloat(value) || 0
        });
      } else {
        setFormData({
          ...formData,
          [fieldName]: value
        });
      }
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} }
  ];

  if (mode === BeneficiaryMode.LIST) {
    functionKeys.push({ key: 'F6', description: 'Add New', action: () => {} });
  }

  if (mode === BeneficiaryMode.EDIT) {
    functionKeys.push({ 
      key: 'F9', 
      description: 'Delete', 
      action: () => {
        setMode(BeneficiaryMode.DELETE);
        setMessage(`Are you sure you want to delete ${selectedBeneficiary?.firstName} ${selectedBeneficiary?.lastName}? Press Enter to confirm.`);
      }
    });
  }

  const getScreenConfig = (): ScreenConfig => {
    const fields = [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'BENEFICIARY MANAGEMENT', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Policy info
      { row: 3, col: 2, length: 20, value: 'Policy Number:' },
      { row: 3, col: 22, length: 15, value: policyNumber, isHighlighted: true },
      
      // Message line
      { row: 4, col: 2, length: 60, value: message, isHighlighted: true }
    ];

    if (mode === BeneficiaryMode.LIST) {
      // List view
      fields.push({ row: 6, col: 2, length: 76, value: 'ID      NAME                    RELATIONSHIP       DOB            PERCENTAGE', isHighlighted: true });
      fields.push({ row: 7, col: 2, length: 76, value: '------  ----------------------  ----------------  -------------  ----------', isHighlighted: true });
      
      beneficiaries.forEach((beneficiary: Beneficiary, index: number) => {
        const isSelected = index === selectedIndex;
        fields.push({
          row: 8 + index,
          col: 2,
          length: 76,
          value: `${beneficiary.id.padEnd(8)} ${(beneficiary.firstName + ' ' + beneficiary.lastName).padEnd(24)} ${beneficiary.relationship.padEnd(18)} ${beneficiary.dateOfBirth.padEnd(15)} ${beneficiary.percentage.toString() + '%'}`,
          isHighlighted: isSelected
        });
      });

      // Selection field
      if (beneficiaries.length > 0) {
        fields.push({ row: 19, col: 2, length: 30, value: 'Select beneficiary (0-' + (beneficiaries.length - 1) + '): ' });
        fields.push({
          row: 19,
          col: 32,
          length: 2,
          value: selectedIndex.toString(),
          isEditable: true,
          fieldName: 'selectedIndex'
        } as ScreenField);
      }
    } else if (mode === BeneficiaryMode.ADD || mode === BeneficiaryMode.EDIT) {
      // Add/Edit form
      const title = mode === BeneficiaryMode.ADD ? 'ADD NEW BENEFICIARY' : 'EDIT BENEFICIARY';
      fields.push({ row: 6, col: 2, length: 30, value: title, isHighlighted: true });
      
      fields.push({ row: 8, col: 5, length: 15, value: 'First Name:' });
      fields.push({
        row: 8,
        col: 21,
        length: 20,
        value: formData.firstName || '',
        isEditable: true,
        fieldName: 'firstName'
      } as ScreenField);
      
      fields.push({ row: 9, col: 5, length: 15, value: 'Last Name:' });
      fields.push({
        row: 9,
        col: 21,
        length: 20,
        value: formData.lastName || '',
        isEditable: true,
        fieldName: 'lastName'
      } as ScreenField);
      
      fields.push({ row: 10, col: 5, length: 15, value: 'Date of Birth:' });
      fields.push({
        row: 10,
        col: 21,
        length: 10,
        value: formData.dateOfBirth || '',
        isEditable: true,
        fieldName: 'dateOfBirth'
      } as ScreenField);
      
      fields.push({ row: 11, col: 5, length: 15, value: 'Relationship:' });
      fields.push({
        row: 11,
        col: 21,
        length: 20,
        value: formData.relationship || '',
        isEditable: true,
        fieldName: 'relationship'
      } as ScreenField);
      
      fields.push({ row: 12, col: 5, length: 15, value: 'Percentage:' });
      fields.push({
        row: 12,
        col: 21,
        length: 5,
        value: formData.percentage?.toString() || '0',
        isEditable: true,
        fieldName: 'percentage'
      } as ScreenField);
      
      fields.push({ row: 14, col: 5, length: 40, value: 'Press Enter to save, F3 to cancel' });
    } else if (mode === BeneficiaryMode.DELETE) {
      // Delete confirmation
      fields.push({ row: 6, col: 2, length: 60, value: 'DELETE BENEFICIARY', isHighlighted: true });
      fields.push({ row: 8, col: 5, length: 60, value: `Are you sure you want to delete the following beneficiary?` });
      fields.push({ row: 10, col: 5, length: 60, value: `ID: ${selectedBeneficiary?.id}` });
      fields.push({ row: 11, col: 5, length: 60, value: `Name: ${selectedBeneficiary?.firstName} ${selectedBeneficiary?.lastName}` });
      fields.push({ row: 12, col: 5, length: 60, value: `Relationship: ${selectedBeneficiary?.relationship}` });
      fields.push({ row: 14, col: 5, length: 60, value: 'Press Enter to confirm deletion, F3 to cancel' });
    }
    
    // Footer
    const footerText = mode === BeneficiaryMode.LIST 
      ? 'F1=Help  F3=Back  F5=Refresh  F6=Add New  Enter=Select'
      : mode === BeneficiaryMode.EDIT
        ? 'F1=Help  F3=Back  F9=Delete  Enter=Save'
        : 'F1=Help  F3=Back  Enter=Confirm';
    
    fields.push({ row: 22, col: 0, length: 80, value: footerText, isHighlighted: true });
    
    return {
      title: 'BENEFICIARY MANAGEMENT',
      fields,
      functionKeys
    };
  };
  
  return <Terminal screenConfig={getScreenConfig()} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default BeneficiaryManagementScreen;
