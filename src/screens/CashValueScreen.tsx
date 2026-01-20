"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Policy, CashValueDetails, ScreenField } from '@/types';
import { getPolicyByNumber, getCashValueDetails, isPolicyEligibleForSurrender } from '@/services/mockDataService';

const CashValueScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const policyNumber = searchParams.get('policyNumber');

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [cashValue, setCashValue] = useState<CashValueDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [eligibility, setEligibility] = useState<{ eligible: boolean; reason?: string }>({ eligible: false });

  useEffect(() => {
    if (policyNumber) {
      const foundPolicy = getPolicyByNumber(policyNumber);
      if (foundPolicy) {
        setPolicy(foundPolicy);
        const cashValueData = getCashValueDetails(policyNumber);
        if (cashValueData) {
          setCashValue(cashValueData);
        } else {
          setMessage('Cash value not available for this policy');
        }
        setEligibility(isPolicyEligibleForSurrender(policyNumber));
      } else {
        setMessage('Policy not found');
      }
      setLoading(false);
    }
  }, [policyNumber]);

  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      router.push(`/policy-details?policyNumber=${policyNumber}`);
    } else if (key === 'F5') {
      window.location.reload();
    } else if (key === 'F8') {
      // Navigate to surrender screen
      if (eligibility.eligible) {
        router.push(`/policy-surrender?policyNumber=${policyNumber}`);
      } else {
        setMessage(eligibility.reason || 'Policy not eligible for surrender');
      }
    } else if (key === 'F9') {
      // Navigate to loan quote screen
      if (policy?.isPaidPlan) {
        router.push(`/loan-quote?policyNumber=${policyNumber}`);
      } else {
        setMessage('Only paid plans are eligible for loans');
      }
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Exit', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} },
    { key: 'F8', description: 'Surrender', action: () => {} },
    { key: 'F9', description: 'Policy Loan', action: () => {} }
  ];

  if (loading) {
    const loadingConfig: ScreenConfig = {
      title: 'CASH VALUE INQUIRY - LOADING',
      fields: [
        { row: 10, col: 30, length: 20, value: 'Loading cash value data...', isEditable: false }
      ],
      functionKeys
    };

    return (
      <Terminal
        screenConfig={loadingConfig}
        onKeyPress={handleKeyPress}
      />
    );
  }

  if (!policy) {
    const errorConfig: ScreenConfig = {
      title: 'CASH VALUE INQUIRY - ERROR',
      fields: [
        { row: 10, col: 20, length: 40, value: 'Policy not found', isEditable: false, isHighlighted: true }
      ],
      functionKeys
    };

    return (
      <Terminal
        screenConfig={errorConfig}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const fields: ScreenField[] = [];
  let currentRow = 3;

  // Header information
  fields.push(
    { row: currentRow++, col: 2, length: 20, value: 'Policy Number:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.policyNumber, isEditable: false, isHighlighted: true },
    { row: currentRow++, col: 2, length: 20, value: 'Policyholder:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 30, value: `${policy.policyHolder.firstName} ${policy.policyHolder.lastName}`, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Product Type:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.productType, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Policy Status:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.status, isEditable: false }
  );

  currentRow++;

  if (cashValue) {
    // Cash Value Details Section
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ CASH VALUE SUMMARY ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 30, value: 'Current Cash Value:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.currentCashValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true },
      
      { row: currentRow++, col: 4, length: 30, value: 'Guaranteed Cash Value:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.guaranteedCashValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
      
      { row: currentRow++, col: 4, length: 30, value: 'Non-Guaranteed Cash Value:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.nonGuaranteedCashValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ ADDITIONAL VALUES ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 30, value: 'Accumulated Dividends:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.accumulatedDividends.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
      
      { row: currentRow++, col: 4, length: 30, value: 'Paid-Up Additions:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.paidUpAdditions.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
      
      { row: currentRow++, col: 4, length: 30, value: 'Outstanding Loan Balance:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.loanBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: cashValue.loanBalance > 0 }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ SURRENDER VALUES ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 30, value: 'Gross Surrender Value:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.surrenderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
      
      { row: currentRow++, col: 4, length: 30, value: 'Surrender Charges:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `-$${cashValue.surrenderCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
      
      { row: currentRow++, col: 4, length: 30, value: 'Net Surrender Value:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: `$${cashValue.netSurrenderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 50, value: `Last Calculated: ${cashValue.lastCalculatedDate}`, isEditable: false }
    );
  } else {
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ CASH VALUE NOT AVAILABLE ═══', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 4, length: 60, value: 'This policy does not have cash value.', isEditable: false },
      { row: currentRow++, col: 4, length: 60, value: 'Cash value is only available for paid life insurance plans.', isEditable: false }
    );
  }

  // Message line
  if (message) {
    fields.push(
      { row: 22, col: 2, length: 70, value: message, isEditable: false, isHighlighted: true }
    );
  }

  const screenConfig: ScreenConfig = {
    title: 'CASH VALUE INQUIRY',
    fields,
    functionKeys
  };

  return (
    <Terminal
      screenConfig={screenConfig}
      onKeyPress={handleKeyPress}
    />
  );
};

export default CashValueScreen;
