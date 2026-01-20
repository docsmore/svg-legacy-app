"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy } from '@/types';
import { searchPolicies } from '@/services/mockDataService';

interface PolicySearchScreenProps {
  onSelectPolicy?: (policyNumber: string) => void;
}

const PolicySearchScreen: React.FC<PolicySearchScreenProps> = ({ onSelectPolicy }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Policy[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [message, setMessage] = useState<string>('');

  const handleKeyPress = (key: string) => {
    if (key === 'Enter') {
      if (searchTerm && searchResults.length === 0) {
        // If we have a search term but no results yet, perform the search
        performSearch();
      } else if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        // If we have a selected policy, navigate to it
        selectPolicy(searchResults[selectedIndex].policyNumber);
      } else if (searchResults.length > 0) {
        // If we have results but no selection, prompt user to make a selection
        setMessage('Please select a policy by typing a number');
      }
    } else if (key === 'F3') {
      // Return to main menu
      router.push('/');
    } else if (key === 'F5') {
      // Refresh/clear search
      clearSearch();
    } else if (key === 'F7') {
      // Create a new policy
      router.push('/policy-create');
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'searchTerm') {
      setSearchTerm(value);
    } else if (fieldName === 'selectedIndex') {
      const index = parseInt(value);
      if (!isNaN(index) && index >= 1 && index <= searchResults.length) {
        setSelectedIndex(index - 1);
        setMessage(`Selected policy ${searchResults[index - 1].policyNumber}`);
      } else if (value === '') {
        // Clear selection if field is empty
        setSelectedIndex(-1);
        setMessage('');
      } else {
        setSelectedIndex(-1);
        setMessage('Invalid selection. Please enter a valid number.');
      }
    }
  };

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setMessage('Please enter a search term');
      return;
    }

    const results = searchPolicies(searchTerm);
    setSearchResults(results);

    if (results.length === 0) {
      setMessage('No policies found matching your search criteria');
    } else {
      setMessage(`Found ${results.length} policies`);
      setSelectedIndex(-1);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedIndex(-1);
    setMessage('');
  };

  const selectPolicy = (policyNumber: string) => {
    if (onSelectPolicy) {
      onSelectPolicy(policyNumber);
    } else {
      router.push(`/policy-details?policyNumber=${policyNumber}`);
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Exit', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} },
    { key: 'F7', description: 'New Policy', action: () => {} },
    { key: 'Enter', description: 'Search/Select', action: () => {} }
  ];

  // Calculate the row for selection input (after results, with some spacing)
  const selectionInputRow = Math.max(12, 10 + searchResults.length + 1);

  // Dynamically generate search result fields
  const resultFields = searchResults.flatMap((policy, index) => {
    const rowIndex = 10 + index;
    return [
      { 
        row: rowIndex, 
        col: 2, 
        length: 2, 
        value: (index + 1).toString() + '.', 
        isHighlighted: selectedIndex === index 
      },
      { 
        row: rowIndex, 
        col: 5, 
        length: 10, 
        value: policy.policyNumber, 
        isHighlighted: selectedIndex === index 
      },
      { 
        row: rowIndex, 
        col: 16, 
        length: 20, 
        value: `${policy.policyHolder.firstName} ${policy.policyHolder.lastName}`, 
        isHighlighted: selectedIndex === index 
      },
      { 
        row: rowIndex, 
        col: 37, 
        length: 10, 
        value: policy.productType, 
        isHighlighted: selectedIndex === index 
      },
      { 
        row: rowIndex, 
        col: 48, 
        length: 10, 
        value: policy.status, 
        isHighlighted: selectedIndex === index 
      },
      { 
        row: rowIndex, 
        col: 59, 
        length: 10, 
        value: `$${policy.premium.toFixed(2)}`, 
        isHighlighted: selectedIndex === index 
      }
    ];
  });

  const screenConfig: ScreenConfig = {
    title: 'POLICY SEARCH',
    fields: [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'POLICY SEARCH', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Search input
      { row: 4, col: 2, length: 30, value: 'Search Term:' },
      { 
        row: 4, 
        col: 15, 
        length: 30, 
        value: searchTerm, 
        isEditable: true, 
        fieldName: 'searchTerm' 
      },
      
      // Message line
      { row: 6, col: 2, length: 60, value: message, isHighlighted: true },
      
      // Column headers for results
      { row: 8, col: 2, length: 3, value: 'Sel', isHighlighted: true },
      { row: 8, col: 5, length: 10, value: 'Policy #', isHighlighted: true },
      { row: 8, col: 16, length: 20, value: 'Policyholder', isHighlighted: true },
      { row: 8, col: 37, length: 10, value: 'Product', isHighlighted: true },
      { row: 8, col: 48, length: 10, value: 'Status', isHighlighted: true },
      { row: 8, col: 59, length: 10, value: 'Premium', isHighlighted: true },
      
      // Results will be dynamically added here
      ...resultFields,
      
      // Selection input (dynamically positioned below results)
      { row: selectionInputRow, col: 2, length: 30, value: 'Type number to select:' },
      { 
        row: selectionInputRow, 
        col: 25, 
        length: 2, 
        value: selectedIndex >= 0 ? (selectedIndex + 1).toString() : '', 
        isEditable: true, 
        fieldName: 'selectedIndex' 
      },
      
      // Footer (dynamically positioned below selection input)
      { row: selectionInputRow + 2, col: 0, length: 80, value: 'F1=Help  F3=Exit  F5=Refresh  F7=New Policy  Enter=Search/Select', isHighlighted: true }
    ],
    functionKeys
  };

  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default PolicySearchScreen;
