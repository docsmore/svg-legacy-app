import { Policy, PolicyStatus, ProductType, PolicyHolder, Address, Beneficiary, LoanQuote, LoanQuoteStatus } from '@/types';

// Mock data for the policy administration system
const mockPolicies: Policy[] = [
  {
    policyNumber: 'POL001234',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-01-01',
    expirationDate: '2025-01-01',
    premium: 1200.50,
    productType: ProductType.AUTO,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH001',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-05-15',
      ssn: '123-45-6789',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: {
        street1: '123 Main St',
        street2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      }
    },
    beneficiaries: [
      {
        id: 'BEN001',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1982-08-20',
        relationship: 'Spouse',
        percentage: 75,
        ssn: '234-56-7890',
        email: 'jane.smith@example.com',
        phone: '(555) 234-5678'
      },
      {
        id: 'BEN002',
        firstName: 'Michael',
        lastName: 'Smith',
        dateOfBirth: '2010-03-12',
        relationship: 'Child',
        percentage: 25
      }
    ]
  },
  {
    policyNumber: 'POL005678',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-02-15',
    expirationDate: '2025-02-15',
    premium: 950.75,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1975-09-22',
      ssn: '987-65-4321',
      email: 'sarah.johnson@example.com',
      phone: '(555) 987-6543',
      address: {
        street1: '456 Oak Ave',
        city: 'Riverdale',
        state: 'NY',
        zipCode: '10471'
      }
    }
  },
  {
    policyNumber: 'POL009012',
    status: PolicyStatus.PENDING,
    effectiveDate: '2024-04-01',
    expirationDate: '2025-04-01',
    premium: 2100.00,
    productType: ProductType.BUSINESS,
    policyHolder: {
      id: 'PH003',
      firstName: 'Robert',
      lastName: 'Williams',
      dateOfBirth: '1968-11-30',
      ssn: '456-78-9012',
      email: 'robert.williams@example.com',
      phone: '(555) 456-7890',
      address: {
        street1: '789 Business Park',
        street2: 'Suite 300',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      }
    }
  },
  {
    policyNumber: 'POL003456',
    status: PolicyStatus.EXPIRED,
    effectiveDate: '2023-01-15',
    expirationDate: '2024-01-15',
    premium: 875.25,
    productType: ProductType.AUTO,
    policyHolder: {
      id: 'PH004',
      firstName: 'Jennifer',
      lastName: 'Davis',
      dateOfBirth: '1982-07-08',
      ssn: '234-56-7890',
      email: 'jennifer.davis@example.com',
      phone: '(555) 234-5678',
      address: {
        street1: '321 Pine St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205'
      }
    }
  },
  {
    policyNumber: 'POL007890',
    status: PolicyStatus.CANCELLED,
    effectiveDate: '2023-05-10',
    expirationDate: '2024-05-10',
    premium: 1500.00,
    productType: ProductType.LIFE,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH005',
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: '1970-03-25',
      ssn: '345-67-8901',
      email: 'michael.brown@example.com',
      phone: '(555) 345-6789',
      address: {
        street1: '567 Maple Dr',
        street2: 'Unit 12',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108'
      }
    },
    beneficiaries: [
      {
        id: 'BEN003',
        firstName: 'Elizabeth',
        lastName: 'Brown',
        dateOfBirth: '1972-11-18',
        relationship: 'Spouse',
        percentage: 50,
        ssn: '456-78-9012',
        email: 'elizabeth.brown@example.com',
        phone: '(555) 456-7890'
      },
      {
        id: 'BEN004',
        firstName: 'Thomas',
        lastName: 'Brown',
        dateOfBirth: '2000-07-22',
        relationship: 'Child',
        percentage: 25
      },
      {
        id: 'BEN005',
        firstName: 'Emily',
        lastName: 'Brown',
        dateOfBirth: '2002-09-15',
        relationship: 'Child',
        percentage: 25
      }
    ]
  }
];

// Service functions
export const getPolicies = (): Policy[] => {
  return mockPolicies;
};

export const getPolicyByNumber = (policyNumber: string): Policy | undefined => {
  return mockPolicies.find(policy => policy.policyNumber === policyNumber);
};

export const searchPolicies = (searchTerm: string): Policy[] => {
  const term = searchTerm.toLowerCase();
  return mockPolicies.filter(policy => 
    policy.policyNumber.toLowerCase().includes(term) ||
    policy.policyHolder.firstName.toLowerCase().includes(term) ||
    policy.policyHolder.lastName.toLowerCase().includes(term) ||
    policy.policyHolder.id.toLowerCase().includes(term)
  );
};

export const updatePolicyHolder = (policyNumber: string, policyHolder: PolicyHolder): Policy | undefined => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1) {
    return undefined;
  }
  
  // Create a new policy object with the updated policyholder
  const updatedPolicy = {
    ...mockPolicies[policyIndex],
    policyHolder: {
      ...policyHolder
    }
  };
  
  // In a real application, this would update a database
  // For our mock, we'll update the array
  mockPolicies[policyIndex] = updatedPolicy;
  
  return updatedPolicy;
};

export const updatePolicyHolderAddress = (
  policyNumber: string, 
  address: Address
): Policy | undefined => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1) {
    return undefined;
  }
  
  // Create a new policy object with the updated address
  const updatedPolicy = {
    ...mockPolicies[policyIndex],
    policyHolder: {
      ...mockPolicies[policyIndex].policyHolder,
      address: {
        ...address
      }
    }
  };
  
  // In a real application, this would update a database
  // For our mock, we'll update the array
  mockPolicies[policyIndex] = updatedPolicy;
  
  return updatedPolicy;
};

export const updatePolicyStatus = (
  policyNumber: string,
  status: PolicyStatus
): Policy | undefined => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1) {
    return undefined;
  }
  
  // Create a new policy object with the updated status
  const updatedPolicy = {
    ...mockPolicies[policyIndex],
    status
  };
  
  // In a real application, this would update a database
  // For our mock, we'll update the array
  mockPolicies[policyIndex] = updatedPolicy;
  
  return updatedPolicy;
};

// Mock loan quotes
const mockLoanQuotes: LoanQuote[] = [
  {
    quoteId: 'LQ001',
    policyNumber: 'POL001234',
    requestDate: '2024-05-10',
    loanAmount: 5000,
    interestRate: 4.5,
    monthlyPayment: 93.22,
    term: 60, // 5 years
    totalInterest: 591.20,
    status: LoanQuoteStatus.APPROVED
  },
  {
    quoteId: 'LQ002',
    policyNumber: 'POL007890',
    requestDate: '2024-05-15',
    loanAmount: 10000,
    interestRate: 5.2,
    monthlyPayment: 189.99,
    term: 60,
    totalInterest: 1399.40,
    status: LoanQuoteStatus.PENDING
  }
];

// Beneficiary management functions
export const getBeneficiaries = (policyNumber: string): Beneficiary[] => {
  const policy = getPolicyByNumber(policyNumber);
  return policy?.beneficiaries || [];
};

export const addBeneficiary = (policyNumber: string, beneficiary: Omit<Beneficiary, 'id'>): Beneficiary | undefined => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1) {
    return undefined;
  }
  
  const newBeneficiary: Beneficiary = {
    ...beneficiary,
    id: `BEN${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}` // Generate a random ID
  };
  
  const updatedPolicy = {
    ...mockPolicies[policyIndex],
    beneficiaries: [...(mockPolicies[policyIndex].beneficiaries || []), newBeneficiary]
  };
  
  mockPolicies[policyIndex] = updatedPolicy;
  
  return newBeneficiary;
};

export const updateBeneficiary = (
  policyNumber: string,
  beneficiaryId: string,
  updatedBeneficiary: Partial<Beneficiary>
): Beneficiary | undefined => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1 || !mockPolicies[policyIndex].beneficiaries) {
    return undefined;
  }
  
  const beneficiaryIndex = mockPolicies[policyIndex].beneficiaries!.findIndex(
    beneficiary => beneficiary.id === beneficiaryId
  );
  
  if (beneficiaryIndex === -1) {
    return undefined;
  }
  
  const updatedBeneficiaryObj = {
    ...mockPolicies[policyIndex].beneficiaries![beneficiaryIndex],
    ...updatedBeneficiary
  };
  
  const updatedBeneficiaries = [...mockPolicies[policyIndex].beneficiaries!];
  updatedBeneficiaries[beneficiaryIndex] = updatedBeneficiaryObj;
  
  mockPolicies[policyIndex] = {
    ...mockPolicies[policyIndex],
    beneficiaries: updatedBeneficiaries
  };
  
  return updatedBeneficiaryObj;
};

export const deleteBeneficiary = (policyNumber: string, beneficiaryId: string): boolean => {
  const policyIndex = mockPolicies.findIndex(policy => policy.policyNumber === policyNumber);
  
  if (policyIndex === -1 || !mockPolicies[policyIndex].beneficiaries) {
    return false;
  }
  
  const beneficiaryIndex = mockPolicies[policyIndex].beneficiaries!.findIndex(
    beneficiary => beneficiary.id === beneficiaryId
  );
  
  if (beneficiaryIndex === -1) {
    return false;
  }
  
  const updatedBeneficiaries = mockPolicies[policyIndex].beneficiaries!.filter(
    beneficiary => beneficiary.id !== beneficiaryId
  );
  
  mockPolicies[policyIndex] = {
    ...mockPolicies[policyIndex],
    beneficiaries: updatedBeneficiaries
  };
  
  return true;
};

// Loan quote functions
export const getLoanQuotes = (policyNumber: string): LoanQuote[] => {
  return mockLoanQuotes.filter(quote => quote.policyNumber === policyNumber);
};

export const getLoanQuoteById = (quoteId: string): LoanQuote | undefined => {
  return mockLoanQuotes.find(quote => quote.quoteId === quoteId);
};

export const generateLoanQuote = (policyNumber: string, loanAmount: number, term: number): LoanQuote | undefined => {
  const policy = getPolicyByNumber(policyNumber);
  
  if (!policy || !policy.isPaidPlan) {
    return undefined; // Only paid plans are eligible for loans
  }
  
  // Generate a random interest rate between 3.5% and 6.5%
  const interestRate = 3.5 + Math.random() * 3;
  
  // Calculate monthly payment using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
  // Where P is principal, r is monthly interest rate, n is number of months
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term) / 
                        (Math.pow(1 + monthlyInterestRate, term) - 1);
  
  // Calculate total interest
  const totalInterest = (monthlyPayment * term) - loanAmount;
  
  const newQuote: LoanQuote = {
    quoteId: `LQ${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    policyNumber,
    requestDate: new Date().toISOString().split('T')[0],
    loanAmount,
    interestRate: parseFloat(interestRate.toFixed(2)),
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    term,
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    status: LoanQuoteStatus.PENDING
  };
  
  mockLoanQuotes.push(newQuote);
  
  return newQuote;
};

export const updateLoanQuoteStatus = (quoteId: string, status: LoanQuoteStatus): LoanQuote | undefined => {
  const quoteIndex = mockLoanQuotes.findIndex(quote => quote.quoteId === quoteId);
  
  if (quoteIndex === -1) {
    return undefined;
  }
  
  mockLoanQuotes[quoteIndex] = {
    ...mockLoanQuotes[quoteIndex],
    status
  };
  
  return mockLoanQuotes[quoteIndex];
};
