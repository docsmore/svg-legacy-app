"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey } from '@/types';

const MainMenuScreen: React.FC = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  const handleKeyPress = (key: string) => {
    if (key === 'Enter') {
      handleOptionSelect();
    } else if (key === 'F3') {
      // Exit application (in a real AS/400, this would log out)
      // For our web app, we'll just reset to the main menu
      setSelectedOption('');
    } else if (key === 'F1') {
      // Help
      alert('Help: This is the main menu for the Policy Administration System');
    }
  };
  
  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'option') {
      setSelectedOption(value);
    }
  };
  
  const handleOptionSelect = () => {
    switch (selectedOption.trim()) {
      case '1':
        router.push('/policy-search');
        break;
      case '2':
        router.push('/policy-details');
        break;
      case '3':
        router.push('/policyholder-management');
        break;
      case '4':
        router.push('/product-management');
        break;
      case '90':
        alert('Signing off...');
        break;
      default:
        // Invalid option
        break;
    }
  };
  
  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Exit', action: () => {} },
    { key: 'Enter', description: 'Select', action: () => {} }
  ];
  
  const screenConfig: ScreenConfig = {
    title: 'POLICY ADMINISTRATION SYSTEM - SOLVRAYS',
    fields: [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'MAIN MENU', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Menu options
      { row: 4, col: 2, length: 50, value: 'Select one of the following options:' },
      { row: 6, col: 5, length: 40, value: '1. Policy Search' },
      { row: 7, col: 5, length: 40, value: '2. Policy Details' },
      { row: 8, col: 5, length: 40, value: '3. Policyholder Management' },
      { row: 9, col: 5, length: 40, value: '4. Product Management' },
      { row: 11, col: 5, length: 40, value: '90. Sign Off' },
      
      // Input field
      { row: 13, col: 2, length: 20, value: 'Option ===> ' },
      { 
        row: 13, 
        col: 13, 
        length: 2, 
        value: selectedOption, 
        isEditable: true, 
        fieldName: 'option' 
      },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Exit  Enter=Select', isHighlighted: true }
    ],
    functionKeys
  };
  
  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default MainMenuScreen;
