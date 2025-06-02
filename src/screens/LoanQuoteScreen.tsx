"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, LoanQuote, LoanQuoteStatus, ScreenField } from '@/types';
import { 
  getPolicyByNumber, 
  getLoanQuotes, 
  getLoanQuoteById,
  generateLoanQuote,
  updateLoanQuoteStatus
} from '@/services/mockDataService';

enum LoanQuoteMode {
  LIST = 'LIST',
  GENERATE = 'GENERATE',
  VIEW = 'VIEW'
}

const LoanQuoteScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [loanQuotes, setLoanQuotes] = useState<LoanQuote[]>([]);
  const [mode, setMode] = useState<LoanQuoteMode>(LoanQuoteMode.LIST);
  const [selectedQuote, setSelectedQuote] = useState<LoanQuote | null>(null);
  const [message, setMessage] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanTerm, setLoanTerm] = useState<number>(60); // Default to 5 years (60 months)

  useEffect(() => {
    const policyNum = searchParams.get('policyNumber');
    if (policyNum) {
      setPolicyNumber(policyNum);
      const policy = getPolicyByNumber(policyNum);
      if (policy) {
        if (policy.isPaidPlan) {
          const quotesList = getLoanQuotes(policyNum);
          setLoanQuotes(quotesList);
          setMessage(`Found ${quotesList.length} loan quotes for policy ${policyNum}`);
        } else {
          setMessage('This policy is not eligible for loans. Only paid plans are eligible.');
        }
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
      // Refresh loan quotes
      const quotesList = getLoanQuotes(policyNumber);
      setLoanQuotes(quotesList);
      setMode(LoanQuoteMode.LIST);
      setMessage(`Found ${quotesList.length} loan quotes for policy ${policyNumber}`);
    } else if (key === 'F6' && mode === LoanQuoteMode.LIST) {
      // Generate new loan quote
      setMode(LoanQuoteMode.GENERATE);
      setLoanAmount(5000);
      setLoanTerm(60);
      setMessage('Enter loan details');
    } else if (key === 'Enter') {
      handleEnterKey();
    }
  };

  const handleEnterKey = () => {
    if (mode === LoanQuoteMode.LIST && selectedIndex >= 0 && selectedIndex < loanQuotes.length) {
      // View selected loan quote
      setSelectedQuote(loanQuotes[selectedIndex]);
      setMode(LoanQuoteMode.VIEW);
      setMessage(`Viewing loan quote: ${loanQuotes[selectedIndex].quoteId}`);
    } else if (mode === LoanQuoteMode.GENERATE) {
      // Generate new loan quote
      if (validateLoanForm()) {
        const newQuote = generateLoanQuote(policyNumber, loanAmount, loanTerm);
        if (newQuote) {
          setLoanQuotes([...loanQuotes, newQuote]);
          setSelectedQuote(newQuote);
          setMode(LoanQuoteMode.VIEW);
          setMessage(`Loan quote generated successfully: ${newQuote.quoteId}`);
        } else {
          setMessage('Failed to generate loan quote. Policy may not be eligible.');
        }
      }
    }
  };

  const validateLoanForm = (): boolean => {
    if (loanAmount <= 0) {
      setMessage('Loan amount must be greater than 0');
      return false;
    }
    if (loanTerm <= 0) {
      setMessage('Loan term must be greater than 0');
      return false;
    }
    return true;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (mode === LoanQuoteMode.LIST && fieldName === 'selectedIndex') {
      const index = parseInt(value, 10);
      if (!isNaN(index) && index >= 0 && index < loanQuotes.length) {
        setSelectedIndex(index);
      }
    } else if (mode === LoanQuoteMode.GENERATE) {
      if (fieldName === 'loanAmount') {
        const amount = parseFloat(value);
        if (!isNaN(amount)) {
          setLoanAmount(amount);
        }
      } else if (fieldName === 'loanTerm') {
        const term = parseInt(value, 10);
        if (!isNaN(term)) {
          setLoanTerm(term);
        }
      }
    }
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Back', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} }
  ];

  if (mode === LoanQuoteMode.LIST) {
    functionKeys.push({ key: 'F6', description: 'New Quote', action: () => {} });
  }

  const getScreenConfig = (): ScreenConfig => {
    const fields = [
      // Header
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'LOAN QUOTE MANAGEMENT', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },
      
      // Policy info
      { row: 3, col: 2, length: 20, value: 'Policy Number:' },
      { row: 3, col: 22, length: 15, value: policyNumber, isHighlighted: true },
      
      // Message line
      { row: 4, col: 2, length: 60, value: message, isHighlighted: true }
    ];

    if (mode === LoanQuoteMode.LIST) {
      // List view
      fields.push({ row: 6, col: 2, length: 76, value: 'QUOTE ID  REQUEST DATE  AMOUNT     RATE   TERM    STATUS', isHighlighted: true });
      fields.push({ row: 7, col: 2, length: 76, value: '--------  ------------  ---------  -----  ------  -------', isHighlighted: true });
      
      loanQuotes.forEach((quote: LoanQuote, index: number) => {
        const isSelected = index === selectedIndex;
        fields.push({
          row: 8 + index,
          col: 2,
          length: 76,
          value: `${quote.quoteId.padEnd(10)} ${quote.requestDate.padEnd(14)} $${quote.loanAmount.toFixed(2).padStart(9)} ${quote.interestRate.toFixed(2).padStart(5)}%  ${quote.term.toString().padEnd(6)} ${quote.status.padEnd(7)}`,
          isHighlighted: isSelected
        });
      });

      // Selection field
      if (loanQuotes.length > 0) {
        fields.push({ row: 19, col: 2, length: 30, value: 'Select quote (0-' + (loanQuotes.length - 1) + '): ' });
        fields.push({
          row: 19,
          col: 32,
          length: 2,
          value: selectedIndex.toString(),
          isEditable: true,
          fieldName: 'selectedIndex'
        } as ScreenField);
      }
    } else if (mode === LoanQuoteMode.GENERATE) {
      // Generate form
      fields.push({ row: 6, col: 2, length: 30, value: 'GENERATE NEW LOAN QUOTE', isHighlighted: true });
      
      fields.push({ row: 8, col: 5, length: 20, value: 'Loan Amount ($):' });
      fields.push({
        row: 8,
        col: 26,
        length: 10,
        value: loanAmount.toString(),
        isEditable: true,
        fieldName: 'loanAmount'
      } as ScreenField);
      
      fields.push({ row: 10, col: 5, length: 20, value: 'Loan Term (months):' });
      fields.push({
        row: 10,
        col: 26,
        length: 5,
        value: loanTerm.toString(),
        isEditable: true,
        fieldName: 'loanTerm'
      } as ScreenField);
      
      fields.push({ row: 12, col: 5, length: 40, value: 'Common terms: 12 (1 year), 60 (5 years), 120 (10 years)' });
      fields.push({ row: 14, col: 5, length: 40, value: 'Press Enter to generate quote, F3 to cancel' });
    } else if (mode === LoanQuoteMode.VIEW && selectedQuote) {
      // View quote details
      fields.push({ row: 6, col: 2, length: 30, value: 'LOAN QUOTE DETAILS', isHighlighted: true });
      
      fields.push({ row: 8, col: 5, length: 20, value: 'Quote ID:' });
      fields.push({ row: 8, col: 26, length: 15, value: selectedQuote.quoteId, isHighlighted: true });
      
      fields.push({ row: 9, col: 5, length: 20, value: 'Request Date:' });
      fields.push({ row: 9, col: 26, length: 15, value: selectedQuote.requestDate, isHighlighted: true });
      
      fields.push({ row: 10, col: 5, length: 20, value: 'Loan Amount:' });
      fields.push({ row: 10, col: 26, length: 15, value: `$${selectedQuote.loanAmount.toFixed(2)}`, isHighlighted: true });
      
      fields.push({ row: 11, col: 5, length: 20, value: 'Interest Rate:' });
      fields.push({ row: 11, col: 26, length: 15, value: `${selectedQuote.interestRate.toFixed(2)}%`, isHighlighted: true });
      
      fields.push({ row: 12, col: 5, length: 20, value: 'Term (months):' });
      fields.push({ row: 12, col: 26, length: 15, value: selectedQuote.term.toString(), isHighlighted: true });
      
      fields.push({ row: 13, col: 5, length: 20, value: 'Monthly Payment:' });
      fields.push({ row: 13, col: 26, length: 15, value: `$${selectedQuote.monthlyPayment.toFixed(2)}`, isHighlighted: true });
      
      fields.push({ row: 14, col: 5, length: 20, value: 'Total Interest:' });
      fields.push({ row: 14, col: 26, length: 15, value: `$${selectedQuote.totalInterest.toFixed(2)}`, isHighlighted: true });
      
      fields.push({ row: 15, col: 5, length: 20, value: 'Status:' });
      fields.push({ row: 15, col: 26, length: 15, value: selectedQuote.status, isHighlighted: true });
    }
    
    // Footer
    const footerText = mode === LoanQuoteMode.LIST 
      ? 'F1=Help  F3=Back  F5=Refresh  F6=New Quote  Enter=Select'
      : mode === LoanQuoteMode.GENERATE
        ? 'F1=Help  F3=Back  Enter=Generate'
        : 'F1=Help  F3=Back';
    
    fields.push({ row: 22, col: 0, length: 80, value: footerText, isHighlighted: true });
    
    return {
      title: 'LOAN QUOTE MANAGEMENT',
      fields,
      functionKeys
    };
  };
  
  return <Terminal screenConfig={getScreenConfig()} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default LoanQuoteScreen;
