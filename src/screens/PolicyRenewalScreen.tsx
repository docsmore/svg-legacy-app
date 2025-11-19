"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy, PolicyStatus, ScreenField } from '@/types';
import { getPolicyByNumber, updatePolicyStatus } from '@/services/mockDataService';

const PolicyRenewalScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const policyNumber = searchParams.get('policyNumber');

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [renewalStep, setRenewalStep] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  
  // Renewal form data
  const [renewalData, setRenewalData] = useState({
    newPremium: '',
    newEffectiveDate: '',
    newExpirationDate: '',
    underwriterNotes: '',
    renewalApproved: false,
    blockerResolved: false,
    blockerResolutionNotes: ''
  });

  useEffect(() => {
    if (policyNumber) {
      const foundPolicy = getPolicyByNumber(policyNumber);
      if (foundPolicy) {
        setPolicy(foundPolicy);
        // Pre-fill with current values
        setRenewalData(prev => ({
          ...prev,
          newPremium: foundPolicy.premium.toString(),
          newEffectiveDate: foundPolicy.expirationDate,
          newExpirationDate: calculateNewExpirationDate(foundPolicy.expirationDate)
        }));
      } else {
        setMessage('Policy not found');
      }
      setLoading(false);
    }
  }, [policyNumber]);

  const calculateNewExpirationDate = (currentExpDate: string): string => {
    const date = new Date(currentExpDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  const calculateDaysUntilExpiration = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hasRenewalBlocker = (): boolean => {
    return !!(policy?.notes && policy.notes.includes('RENEWAL BLOCKER'));
  };

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key, 'Current step:', renewalStep);
    
    if (key === 'F3') {
      router.push(`/policy-details?policyNumber=${policyNumber}`);
    } else if (key === 'F5') {
      // Refresh
      window.location.reload();
    } else if (key === 'F8') {
      // Process renewal
      if (renewalStep === 1) {
        // Move to step 2 (blocker resolution if needed)
        if (hasRenewalBlocker() && !renewalData.blockerResolved) {
          setRenewalStep(2);
          setMessage('Please resolve renewal blocker before proceeding');
        } else {
          setRenewalStep(3);
          setMessage('Review renewal details');
        }
      } else if (renewalStep === 2) {
        // Validate blocker resolution
        console.log('Step 2 - Resolution notes:', renewalData.blockerResolutionNotes);
        if (!renewalData.blockerResolutionNotes.trim()) {
          setMessage('Please provide blocker resolution notes');
        } else {
          setRenewalData(prev => ({ ...prev, blockerResolved: true }));
          setRenewalStep(3);
          setMessage('Blocker resolved. Review renewal details');
        }
      } else if (renewalStep === 3) {
        // Final confirmation
        setRenewalStep(4);
        setMessage('Confirm renewal? Press F8 to confirm, F3 to cancel');
      } else if (renewalStep === 4) {
        // Process the renewal
        processRenewal();
      }
    } else if (key === 'F9') {
      // Deny renewal
      setRenewalStep(5);
      setMessage('Renewal denied. Press F8 to confirm denial');
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setRenewalData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const processRenewal = () => {
    if (!policy) return;

    // In a real system, this would update the database
    const updatedPolicy = updatePolicyStatus(policy.policyNumber, PolicyStatus.RENEWED);
    
    if (updatedPolicy) {
      setMessage(`✓ Policy ${policy.policyNumber} renewed successfully!`);
      setRenewalStep(6); // Success screen
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/policy-details?policyNumber=${policyNumber}`);
      }, 3000);
    } else {
      setMessage('Error processing renewal');
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Exit', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} },
    { key: 'F8', description: renewalStep === 4 ? 'Confirm' : 'Continue', action: () => {} },
    { key: 'F9', description: 'Deny Renewal', action: () => {} }
  ];

  if (loading) {
    const loadingConfig: ScreenConfig = {
      title: 'POLICY RENEWAL - LOADING',
      fields: [
        { row: 10, col: 30, length: 20, value: 'Loading policy data...', isEditable: false }
      ],
      functionKeys
    };

    return (
      <Terminal
        screenConfig={loadingConfig}
        onKeyPress={handleKeyPress}
        onFieldChange={handleFieldChange}
      />
    );
  }

  if (!policy) {
    const errorConfig: ScreenConfig = {
      title: 'POLICY RENEWAL - ERROR',
      fields: [
        { row: 10, col: 20, length: 40, value: 'Policy not found', isEditable: false, isHighlighted: true }
      ],
      functionKeys
    };

    return (
      <Terminal
        screenConfig={errorConfig}
        onKeyPress={handleKeyPress}
        onFieldChange={handleFieldChange}
      />
    );
  }

  // Calculate expiration status
  const daysUntilExp = calculateDaysUntilExpiration(policy.expirationDate);
  const isExpired = daysUntilExp < 0;
  const isExpiringSoon = daysUntilExp >= 0 && daysUntilExp <= 30;
  const hasBlocker = hasRenewalBlocker();

  // Build screen based on renewal step
  let screenTitle = 'POLICY RENEWAL';
  const fields: ScreenField[] = [];
  let currentRow = 3;

  // Header information (always shown)
  fields.push(
    { row: currentRow++, col: 2, length: 20, value: 'Policy Number:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.policyNumber, isEditable: false, isHighlighted: true },
    { row: currentRow++, col: 2, length: 20, value: 'Policyholder:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 30, value: `${policy.policyHolder.firstName} ${policy.policyHolder.lastName}`, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Product Type:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.productType, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Current Premium:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: `$${policy.premium.toFixed(2)}`, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Expiration Date:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.expirationDate, isEditable: false, isHighlighted: isExpired || isExpiringSoon }
  );

  // Expiration status warning
  if (isExpired) {
    fields.push(
      { row: currentRow++, col: 2, length: 50, value: '*** POLICY EXPIRED ***', isEditable: false, isHighlighted: true }
    );
  } else if (isExpiringSoon) {
    fields.push(
      { row: currentRow++, col: 2, length: 50, value: `*** EXPIRES IN ${daysUntilExp} DAYS ***`, isEditable: false, isHighlighted: true }
    );
  }

  currentRow++;

  // Step-specific content
  if (renewalStep === 1) {
    screenTitle = 'POLICY RENEWAL - STEP 1: REVIEW';
    
    if (hasBlocker) {
      fields.push(
        { row: currentRow++, col: 2, length: 60, value: '═══ RENEWAL BLOCKER DETECTED ═══', isEditable: false, isHighlighted: true },
        { row: currentRow++, col: 2, length: 70, value: policy.notes || '', isEditable: false, isHighlighted: true },
        { row: currentRow++, col: 2, length: 60, value: '═══════════════════════════════', isEditable: false, isHighlighted: true }
      );
      currentRow++;
    }

    fields.push(
      { row: currentRow++, col: 2, length: 40, value: 'Current Policy Details:', isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'Effective Date:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: policy.effectiveDate, isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'Status:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: policy.status, isEditable: false }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 40, value: 'Proposed Renewal Terms:', isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'New Premium:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: renewalData.newPremium, isEditable: true, fieldName: 'newPremium' },
      { row: currentRow++, col: 4, length: 20, value: 'Effective Date:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: renewalData.newEffectiveDate, isEditable: true, fieldName: 'newEffectiveDate' },
      { row: currentRow++, col: 4, length: 20, value: 'Expiration Date:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: renewalData.newExpirationDate, isEditable: true, fieldName: 'newExpirationDate' }
    );

  } else if (renewalStep === 2) {
    screenTitle = 'POLICY RENEWAL - STEP 2: RESOLVE BLOCKER';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ BLOCKER RESOLUTION REQUIRED ═══', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 70, value: policy.notes || '', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '════════════════════════════════════', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 50, value: 'Resolution Notes (Required):', isEditable: false },
      { row: currentRow++, col: 2, length: 70, value: renewalData.blockerResolutionNotes || '', isEditable: true, fieldName: 'blockerResolutionNotes' }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: 'Examples of resolution:', isEditable: false },
      { row: currentRow++, col: 4, length: 60, value: '- Payment received on [date]', isEditable: false },
      { row: currentRow++, col: 4, length: 60, value: '- Inspection completed, repairs verified', isEditable: false },
      { row: currentRow++, col: 4, length: 60, value: '- Flood insurance policy added', isEditable: false },
      { row: currentRow++, col: 4, length: 60, value: '- Underwriting approved with rate adjustment', isEditable: false }
    );

  } else if (renewalStep === 3) {
    screenTitle = 'POLICY RENEWAL - STEP 3: REVIEW & CONFIRM';
    
    if (hasBlocker && renewalData.blockerResolved) {
      fields.push(
        { row: currentRow++, col: 2, length: 50, value: '✓ Blocker Resolved', isEditable: false, isHighlighted: true },
        { row: currentRow++, col: 4, length: 70, value: renewalData.blockerResolutionNotes, isEditable: false }
      );
      currentRow++;
    }

    fields.push(
      { row: currentRow++, col: 2, length: 40, value: 'Renewal Summary:', isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'Policy Number:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: policy.policyNumber, isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'Old Premium:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: `$${policy.premium.toFixed(2)}`, isEditable: false },
      { row: currentRow++, col: 4, length: 20, value: 'New Premium:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: `$${parseFloat(renewalData.newPremium).toFixed(2)}`, isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 4, length: 20, value: 'Premium Change:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: `$${(parseFloat(renewalData.newPremium) - policy.premium).toFixed(2)}`, isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 20, value: 'New Term:', isEditable: false },
      { row: currentRow++, col: 6, length: 20, value: 'Effective:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: renewalData.newEffectiveDate, isEditable: false },
      { row: currentRow++, col: 6, length: 20, value: 'Expiration:', isEditable: false },
      { row: currentRow - 1, col: 25, length: 15, value: renewalData.newExpirationDate, isEditable: false }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 50, value: 'Underwriter Notes:', isEditable: false },
      { row: currentRow++, col: 2, length: 70, value: renewalData.underwriterNotes, isEditable: true, fieldName: 'underwriterNotes' }
    );

  } else if (renewalStep === 4) {
    screenTitle = 'POLICY RENEWAL - STEP 4: FINAL CONFIRMATION';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ CONFIRM RENEWAL ═══', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'You are about to renew this policy with the', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'following terms:', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 4, length: 50, value: `Policy: ${policy.policyNumber}`, isEditable: false },
      { row: currentRow++, col: 4, length: 50, value: `New Premium: $${parseFloat(renewalData.newPremium).toFixed(2)}`, isEditable: false },
      { row: currentRow++, col: 4, length: 50, value: `Term: ${renewalData.newEffectiveDate} to ${renewalData.newExpirationDate}`, isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'Press F8 to CONFIRM renewal', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: 'Press F3 to CANCEL and return', isEditable: false }
    );

  } else if (renewalStep === 5) {
    screenTitle = 'POLICY RENEWAL - DENIAL';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ RENEWAL DENIAL ═══', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'Reason for Denial:', isEditable: false },
      { row: currentRow++, col: 2, length: 70, value: renewalData.underwriterNotes, isEditable: true, fieldName: 'underwriterNotes' },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'Press F8 to confirm denial', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'Press F3 to cancel', isEditable: false }
    );

  } else if (renewalStep === 6) {
    screenTitle = 'POLICY RENEWAL - SUCCESS';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══════════════════════════════', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '    ✓ RENEWAL SUCCESSFUL', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '═══════════════════════════════', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: `Policy ${policy.policyNumber} has been renewed`, isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: 'Redirecting to policy details...', isEditable: false }
    );
  }

  // Message line
  if (message) {
    fields.push(
      { row: 22, col: 2, length: 70, value: message, isEditable: false, isHighlighted: true }
    );
  }

  const screenConfig: ScreenConfig = {
    title: screenTitle,
    fields,
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

export default PolicyRenewalScreen;
