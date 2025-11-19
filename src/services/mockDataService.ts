import { Policy, PolicyStatus, ProductType, PolicyHolder, Address, Beneficiary, LoanQuote, LoanQuoteStatus } from '@/types';

// Helper function to calculate days until expiration
const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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
  },
  // HOME policies with expiration scenarios
  {
    policyNumber: 'POL010111',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-01-01',
    expirationDate: '2025-12-31', // Expiring soon (within 30 days from now)
    premium: 1850.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH006',
      firstName: 'Patricia',
      lastName: 'Martinez',
      dateOfBirth: '1978-04-12',
      ssn: '567-89-0123',
      email: 'patricia.martinez@example.com',
      phone: '(555) 567-8901',
      address: {
        street1: '890 Elm Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      }
    },
    notes: 'RENEWAL BLOCKER: Property has open claim for roof damage. Requires inspection before renewal.'
  },
  {
    policyNumber: 'POL012345',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2023-12-15',
    expirationDate: '2024-12-15', // Already expired
    premium: 2200.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH007',
      firstName: 'David',
      lastName: 'Anderson',
      dateOfBirth: '1965-09-18',
      ssn: '678-90-1234',
      email: 'david.anderson@example.com',
      phone: '(555) 678-9012',
      address: {
        street1: '234 Highland Ave',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202'
      }
    },
    notes: 'RENEWAL BLOCKER: Property located in newly designated flood zone. Requires flood insurance addendum.'
  },
  {
    policyNumber: 'POL013579',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-02-01',
    expirationDate: '2025-01-15', // Expiring in ~15 days
    premium: 1650.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH008',
      firstName: 'Linda',
      lastName: 'Thompson',
      dateOfBirth: '1972-11-25',
      ssn: '789-01-2345',
      email: 'linda.thompson@example.com',
      phone: '(555) 789-0123',
      address: {
        street1: '567 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90028'
      }
    },
    notes: 'RENEWAL BLOCKER: Property has unpaid premium balance of $825. Payment required before renewal.'
  },
  {
    policyNumber: 'POL014680',
    status: PolicyStatus.EXPIRED,
    effectiveDate: '2023-06-01',
    expirationDate: '2024-06-01', // Expired 6 months ago
    premium: 1975.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH009',
      firstName: 'James',
      lastName: 'Wilson',
      dateOfBirth: '1980-02-14',
      ssn: '890-12-3456',
      email: 'james.wilson@example.com',
      phone: '(555) 890-1234',
      address: {
        street1: '789 Riverside Dr',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101'
      }
    },
    notes: 'RENEWAL BLOCKER: Property has 3 claims in past 12 months. Requires underwriting review and possible rate adjustment.'
  },
  {
    policyNumber: 'POL015791',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-03-01',
    expirationDate: '2025-01-05', // Expiring in ~5 days
    premium: 2100.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH010',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '1985-07-30',
      ssn: '901-23-4567',
      email: 'maria.garcia@example.com',
      phone: '(555) 901-2345',
      address: {
        street1: '321 Ocean View',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101'
      }
    },
    notes: 'RENEWAL BLOCKER: Property inspection reveals outdated electrical system. Upgrade required for renewal.'
  },
  {
    policyNumber: 'POL016802',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-01-10',
    expirationDate: '2025-02-28', // Expiring in ~60 days
    premium: 1725.00,
    productType: ProductType.HOME,
    policyHolder: {
      id: 'PH011',
      firstName: 'Christopher',
      lastName: 'Lee',
      dateOfBirth: '1976-12-05',
      ssn: '012-34-5678',
      email: 'christopher.lee@example.com',
      phone: '(555) 012-3456',
      address: {
        street1: '456 Mountain View',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001'
      }
    },
    notes: 'RENEWAL BLOCKER: Property has swimming pool without required safety fence. Compliance needed for renewal.'
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

// Search for expired policies
export const getExpiredPolicies = (): Policy[] => {
  return mockPolicies.filter(policy => {
    const daysUntilExp = getDaysUntilExpiration(policy.expirationDate);
    return daysUntilExp < 0 || policy.status === PolicyStatus.EXPIRED;
  });
};

// Search for policies expiring soon (within specified days)
export const getExpiringPolicies = (daysThreshold: number = 30): Policy[] => {
  return mockPolicies.filter(policy => {
    const daysUntilExp = getDaysUntilExpiration(policy.expirationDate);
    return daysUntilExp >= 0 && daysUntilExp <= daysThreshold && policy.status === PolicyStatus.ACTIVE;
  });
};

// Get policies by product type
export const getPoliciesByType = (productType: ProductType): Policy[] => {
  return mockPolicies.filter(policy => policy.productType === productType);
};

// Get policies with renewal blockers (have notes)
export const getPoliciesWithRenewalBlockers = (): Policy[] => {
  return mockPolicies.filter(policy => policy.notes && policy.notes.includes('RENEWAL BLOCKER'));
};

// Advanced search with filters
export const searchPoliciesAdvanced = (filters: {
  searchTerm?: string;
  status?: PolicyStatus;
  productType?: ProductType;
  expiringWithinDays?: number;
  hasRenewalBlockers?: boolean;
}): Policy[] => {
  let results = mockPolicies;

  // Apply search term filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    results = results.filter(policy => 
      policy.policyNumber.toLowerCase().includes(term) ||
      policy.policyHolder.firstName.toLowerCase().includes(term) ||
      policy.policyHolder.lastName.toLowerCase().includes(term) ||
      policy.policyHolder.id.toLowerCase().includes(term)
    );
  }

  // Apply status filter
  if (filters.status) {
    results = results.filter(policy => policy.status === filters.status);
  }

  // Apply product type filter
  if (filters.productType) {
    results = results.filter(policy => policy.productType === filters.productType);
  }

  // Apply expiring soon filter
  if (filters.expiringWithinDays !== undefined) {
    const expiringDays = filters.expiringWithinDays;
    results = results.filter(policy => {
      const daysUntilExp = getDaysUntilExpiration(policy.expirationDate);
      return daysUntilExp >= 0 && daysUntilExp <= expiringDays;
    });
  }

  // Apply renewal blockers filter
  if (filters.hasRenewalBlockers) {
    results = results.filter(policy => policy.notes && policy.notes.includes('RENEWAL BLOCKER'));
  }

  return results;
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

// Policy creation function
export const createPolicy = (newPolicy: Omit<Policy, 'policyNumber'>): Policy => {
  // Generate a unique policy number
  const policyNumber = `POL${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Create the complete policy object
  const policy: Policy = {
    ...newPolicy,
    policyNumber
  };
  
  // Add to mock policies array
  mockPolicies.push(policy);
  
  return policy;
};
