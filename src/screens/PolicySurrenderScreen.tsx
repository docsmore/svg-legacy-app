"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { 
  ScreenConfig, 
  FunctionKey, 
  Policy, 
  CashValueDetails, 
  ScreenField,
  SurrenderType,
  PaymentMethod
} from '@/types';
import { 
  getPolicyByNumber, 
  getCashValueDetails, 
  isPolicyEligibleForSurrender,
  calculateSurrenderValue,
  createSurrenderRequest,
  processSurrenderRequest
} from '@/services/mockDataService';

const PolicySurrenderScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const policyNumber = searchParams.get('policyNumber');

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [cashValue, setCashValue] = useState<CashValueDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [surrenderStep, setSurrenderStep] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  
  // Surrender form data
  const [surrenderData, setSurrenderData] = useState({
    surrenderType: 'FULL' as SurrenderType,
    partialAmount: '',
    reason: '',
    paymentMethod: 'CHECK' as PaymentMethod,
    bankAccountLast4: '',
    confirmationChecked: false
  });

  // Calculated values
  const [calculation, setCalculation] = useState<{
    grossAmount: number;
    surrenderCharges: number;
    taxWithholding: number;
    netAmount: number;
  } | null>(null);

  useEffect(() => {
    if (policyNumber) {
      const foundPolicy = getPolicyByNumber(policyNumber);
      if (foundPolicy) {
        setPolicy(foundPolicy);
        const cashValueData = getCashValueDetails(policyNumber);
        if (cashValueData) {
          setCashValue(cashValueData);
          // Calculate initial surrender value
          const calc = calculateSurrenderValue(policyNumber, SurrenderType.FULL);
          if (calc) {
            setCalculation(calc);
          }
        }
        
        const eligibility = isPolicyEligibleForSurrender(policyNumber);
        if (!eligibility.eligible) {
          setMessage(eligibility.reason || 'Policy not eligible for surrender');
        }
      } else {
        setMessage('Policy not found');
      }
      setLoading(false);
    }
  }, [policyNumber]);

  const handleKeyPress = (key: string) => {
    if (key === 'F3') {
      if (surrenderStep > 1 && surrenderStep < 5) {
        setSurrenderStep(surrenderStep - 1);
        setMessage('');
      } else {
        router.push(`/cash-value?policyNumber=${policyNumber}`);
      }
    } else if (key === 'F5') {
      window.location.reload();
    } else if (key === 'F8') {
      processStep();
    } else if (key === 'F9') {
      // Cancel surrender request
      if (surrenderStep < 5) {
        router.push(`/policy-details?policyNumber=${policyNumber}`);
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setSurrenderData(prev => {
      const updated = { ...prev, [fieldName]: value };
      
      // Recalculate when surrender type or amount changes
      if (fieldName === 'surrenderType' || fieldName === 'partialAmount') {
        const type = fieldName === 'surrenderType' ? value as SurrenderType : prev.surrenderType;
        const amount = fieldName === 'partialAmount' ? parseFloat(value) || 0 : parseFloat(prev.partialAmount) || 0;
        
        if (policyNumber) {
          const calc = calculateSurrenderValue(policyNumber, type, amount);
          if (calc) {
            setCalculation(calc);
          }
        }
      }
      
      return updated;
    });
  };

  const processStep = () => {
    if (surrenderStep === 1) {
      // Validate surrender type selection
      if (surrenderData.surrenderType === SurrenderType.PARTIAL) {
        const amount = parseFloat(surrenderData.partialAmount);
        if (!amount || amount <= 0) {
          setMessage('Please enter a valid partial surrender amount');
          return;
        }
        if (cashValue && amount > cashValue.currentCashValue * 0.9) {
          setMessage('Partial surrender cannot exceed 90% of cash value');
          return;
        }
      }
      setSurrenderStep(2);
      setMessage('Select payment method');
    } else if (surrenderStep === 2) {
      // Validate payment method
      if (surrenderData.paymentMethod === PaymentMethod.ACH && !surrenderData.bankAccountLast4) {
        setMessage('Please enter last 4 digits of bank account for ACH');
        return;
      }
      setSurrenderStep(3);
      setMessage('Enter reason for surrender');
    } else if (surrenderStep === 3) {
      // Validate reason
      if (!surrenderData.reason.trim()) {
        setMessage('Please provide a reason for surrender');
        return;
      }
      setSurrenderStep(4);
      setMessage('Review and confirm surrender request');
    } else if (surrenderStep === 4) {
      // Process surrender
      processSurrender();
    }
  };

  const processSurrender = () => {
    if (!policy || !policyNumber) return;

    const request = createSurrenderRequest(
      policyNumber,
      surrenderData.surrenderType,
      parseFloat(surrenderData.partialAmount) || 0,
      surrenderData.reason,
      surrenderData.paymentMethod,
      surrenderData.bankAccountLast4
    );

    if (request) {
      // Auto-approve for demo purposes
      const processed = processSurrenderRequest(request.requestId, true);
      
      if (processed) {
        setMessage(`✓ Surrender processed! Confirmation: ${processed.confirmationNumber}`);
        setSurrenderStep(5);
        
        // Redirect after 5 seconds
        setTimeout(() => {
          router.push(`/policy-details?policyNumber=${policyNumber}`);
        }, 5000);
      } else {
        setMessage('Error processing surrender request');
      }
    } else {
      setMessage('Error creating surrender request');
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: surrenderStep > 1 ? 'Back' : 'Exit', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} },
    { key: 'F8', description: surrenderStep === 4 ? 'Confirm' : 'Continue', action: () => {} },
    { key: 'F9', description: 'Cancel', action: () => {} }
  ];

  if (loading) {
    const loadingConfig: ScreenConfig = {
      title: 'POLICY SURRENDER - LOADING',
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

  if (!policy || !cashValue) {
    const errorConfig: ScreenConfig = {
      title: 'POLICY SURRENDER - ERROR',
      fields: [
        { row: 10, col: 20, length: 40, value: message || 'Policy not eligible for surrender', isEditable: false, isHighlighted: true }
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

  // Build screen based on surrender step
  let screenTitle = 'POLICY SURRENDER';
  const fields: ScreenField[] = [];
  let currentRow = 3;

  // Header information (always shown)
  fields.push(
    { row: currentRow++, col: 2, length: 20, value: 'Policy Number:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: policy.policyNumber, isEditable: false, isHighlighted: true },
    { row: currentRow++, col: 2, length: 20, value: 'Policyholder:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 30, value: `${policy.policyHolder.firstName} ${policy.policyHolder.lastName}`, isEditable: false },
    { row: currentRow++, col: 2, length: 20, value: 'Current Cash Value:', isEditable: false },
    { row: currentRow - 1, col: 25, length: 15, value: `$${cashValue.currentCashValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true }
  );

  currentRow++;

  // Step-specific content
  if (surrenderStep === 1) {
    screenTitle = 'POLICY SURRENDER - STEP 1: SELECT TYPE';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ SELECT SURRENDER TYPE ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 50, value: 'Surrender Type (FULL/PARTIAL):', isEditable: false },
      { row: currentRow - 1, col: 40, length: 10, value: surrenderData.surrenderType, isEditable: true, fieldName: 'surrenderType' }
    );

    if (surrenderData.surrenderType === SurrenderType.PARTIAL) {
      fields.push(
        { row: currentRow++, col: 4, length: 50, value: 'Partial Amount (max 90% of cash value):', isEditable: false },
        { row: currentRow - 1, col: 45, length: 15, value: surrenderData.partialAmount, isEditable: true, fieldName: 'partialAmount' }
      );
    }

    currentRow++;
    if (calculation) {
      fields.push(
        { row: currentRow++, col: 2, length: 60, value: '═══ ESTIMATED PAYOUT ═══', isEditable: false, isHighlighted: true },
        { row: currentRow++, col: 4, length: 30, value: 'Gross Amount:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `$${calculation.grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
        { row: currentRow++, col: 4, length: 30, value: 'Surrender Charges:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `-$${calculation.surrenderCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
        { row: currentRow++, col: 4, length: 30, value: 'Tax Withholding (10%):', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `-$${calculation.taxWithholding.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
        { row: currentRow++, col: 4, length: 30, value: 'Net Payout:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `$${calculation.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true }
      );
    }

  } else if (surrenderStep === 2) {
    screenTitle = 'POLICY SURRENDER - STEP 2: PAYMENT METHOD';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ SELECT PAYMENT METHOD ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 50, value: 'Payment Method (CHECK/ACH/WIRE):', isEditable: false },
      { row: currentRow - 1, col: 40, length: 10, value: surrenderData.paymentMethod, isEditable: true, fieldName: 'paymentMethod' }
    );

    if (surrenderData.paymentMethod === PaymentMethod.ACH) {
      fields.push(
        { row: currentRow++, col: 4, length: 50, value: 'Bank Account (Last 4 digits):', isEditable: false },
        { row: currentRow - 1, col: 40, length: 4, value: surrenderData.bankAccountLast4, isEditable: true, fieldName: 'bankAccountLast4' }
      );
    }

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 60, value: 'Payment Options:', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: 'CHECK - Mailed to address on file (5-7 business days)', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: 'ACH   - Direct deposit (2-3 business days)', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: 'WIRE  - Wire transfer (1-2 business days, $25 fee)', isEditable: false }
    );

  } else if (surrenderStep === 3) {
    screenTitle = 'POLICY SURRENDER - STEP 3: REASON';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ SURRENDER REASON ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 50, value: 'Reason for Surrender (Required):', isEditable: false },
      { row: currentRow++, col: 4, length: 70, value: surrenderData.reason, isEditable: true, fieldName: 'reason' }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 60, value: 'Common Reasons:', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: '- Financial hardship', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: '- No longer need coverage', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: '- Replacing with different policy', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: '- Estate planning changes', isEditable: false }
    );

  } else if (surrenderStep === 4) {
    screenTitle = 'POLICY SURRENDER - STEP 4: CONFIRM';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══ CONFIRM SURRENDER REQUEST ═══', isEditable: false, isHighlighted: true }
    );

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 30, value: 'Surrender Type:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: surrenderData.surrenderType, isEditable: false },
      { row: currentRow++, col: 4, length: 30, value: 'Payment Method:', isEditable: false },
      { row: currentRow - 1, col: 35, length: 15, value: surrenderData.paymentMethod, isEditable: false }
    );

    if (calculation) {
      fields.push(
        { row: currentRow++, col: 4, length: 30, value: 'Gross Amount:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `$${calculation.grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
        { row: currentRow++, col: 4, length: 30, value: 'Total Deductions:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `-$${(calculation.surrenderCharges + calculation.taxWithholding).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false },
        { row: currentRow++, col: 4, length: 30, value: 'NET PAYOUT:', isEditable: false },
        { row: currentRow - 1, col: 35, length: 15, value: `$${calculation.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true }
      );
    }

    currentRow++;
    fields.push(
      { row: currentRow++, col: 4, length: 60, value: 'Reason:', isEditable: false },
      { row: currentRow++, col: 6, length: 60, value: surrenderData.reason, isEditable: false }
    );

    currentRow++;
    if (surrenderData.surrenderType === SurrenderType.FULL) {
      fields.push(
        { row: currentRow++, col: 2, length: 70, value: '*** WARNING: Full surrender will terminate this policy ***', isEditable: false, isHighlighted: true }
      );
    }

    fields.push(
      { row: currentRow++, col: 2, length: 60, value: 'Press F8 to CONFIRM surrender', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: 'Press F3 to go BACK, F9 to CANCEL', isEditable: false }
    );

  } else if (surrenderStep === 5) {
    screenTitle = 'POLICY SURRENDER - SUCCESS';
    
    fields.push(
      { row: currentRow++, col: 2, length: 60, value: '═══════════════════════════════', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '    ✓ SURRENDER REQUEST PROCESSED', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '═══════════════════════════════', isEditable: false, isHighlighted: true },
      { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
      { row: currentRow++, col: 2, length: 60, value: `Policy ${policy.policyNumber} surrender has been processed.`, isEditable: false }
    );

    if (calculation) {
      fields.push(
        { row: currentRow++, col: 2, length: 60, value: '', isEditable: false },
        { row: currentRow++, col: 4, length: 50, value: `Net Payout: $${calculation.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, isEditable: false, isHighlighted: true },
        { row: currentRow++, col: 4, length: 50, value: `Payment Method: ${surrenderData.paymentMethod}`, isEditable: false }
      );
    }

    fields.push(
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

export default PolicySurrenderScreen;
