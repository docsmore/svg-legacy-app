"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey } from '@/types';

const ProductManagementScreen: React.FC = () => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      // Return to main menu
      router.push('/');
    } else if (key === 'Enter') {
      if (selectedProduct) {
        setMessage(`Selected product: ${selectedProduct}`);
      }
    }
  };
  
  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'selectedProduct') {
      setSelectedProduct(value);
    }
  };
  
  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} },
    { key: 'Enter', description: 'Select', action: () => {} }
  ];
  
  const screenConfig: ScreenConfig = {
    title: 'PRODUCT MANAGEMENT',
    fields: [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'PRODUCT MANAGEMENT', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Message line
      { row: 3, col: 2, length: 60, value: message, isHighlighted: true },
      
      // Product selection
      { row: 5, col: 2, length: 40, value: 'Select a product type to manage:' },
      
      { row: 7, col: 5, length: 40, value: '1. AUTO - Automobile Insurance' },
      { row: 8, col: 5, length: 40, value: '2. HOME - Homeowners Insurance' },
      { row: 9, col: 5, length: 40, value: '3. LIFE - Life Insurance' },
      { row: 10, col: 5, length: 40, value: '4. HEALTH - Health Insurance' },
      { row: 11, col: 5, length: 40, value: '5. BUSINESS - Business Insurance' },
      
      // Input field
      { row: 13, col: 2, length: 20, value: 'Option ===> ' },
      { 
        row: 13, 
        col: 13, 
        length: 2, 
        value: selectedProduct, 
        isEditable: true, 
        fieldName: 'selectedProduct' 
      },
      
      // Product information
      { row: 15, col: 2, length: 60, value: 'Product information will be displayed here.' },
      
      // Footer
      { row: 22, col: 0, length: 80, value: 'F1=Help  F3=Back  Enter=Select', isHighlighted: true }
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

export default ProductManagementScreen;
