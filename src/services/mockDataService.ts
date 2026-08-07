import { 
  Policy, 
  PolicyStatus, 
  ProductType, 
  PolicyHolder, 
  Address, 
  Beneficiary, 
  LoanQuote, 
  LoanQuoteStatus,
  CashValueDetails,
  SurrenderRequest,
  SurrenderType,
  SurrenderRequestStatus,
  PaymentMethod
} from '@/types';

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
  // LIFE policy with paid plan for testing F8 Loan Quotes and F10 Cash Value
  {
    policyNumber: 'POL999001',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2020-01-01',
    expirationDate: '2050-01-01',
    premium: 2500.00,
    productType: ProductType.LIFE,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH099',
      firstName: 'William',
      lastName: 'Turner',
      dateOfBirth: '1975-06-15',
      ssn: '111-22-3333',
      email: 'william.turner@example.com',
      phone: '(555) 111-2222',
      address: {
        street1: '100 Life Insurance Way',
        city: 'Hartford',
        state: 'CT',
        zipCode: '06103'
      }
    },
    beneficiaries: [
      {
        id: 'BEN099',
        firstName: 'Mary',
        lastName: 'Turner',
        dateOfBirth: '1978-03-20',
        relationship: 'Spouse',
        percentage: 100,
        ssn: '222-33-4444',
        email: 'mary.turner@example.com',
        phone: '(555) 222-3333'
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
  },
  // LIFE policies that have already been fully surrendered (policy no longer ACTIVE)
  {
    policyNumber: 'POL020001',
    status: PolicyStatus.SURRENDERED,
    effectiveDate: '2015-06-01',
    expirationDate: '2045-06-01',
    premium: 1800.00,
    productType: ProductType.LIFE,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH020',
      firstName: 'Barbara',
      lastName: 'Coleman',
      dateOfBirth: '1962-02-10',
      ssn: '111-33-5555',
      email: 'barbara.coleman@example.com',
      phone: '(555) 111-3355',
      address: {
        street1: '78 Willow Creek Rd',
        city: 'Nashville',
        state: 'TN',
        zipCode: '37201'
      }
    },
    beneficiaries: [
      {
        id: 'BEN020',
        firstName: 'Robert',
        lastName: 'Coleman',
        dateOfBirth: '1960-05-22',
        relationship: 'Spouse',
        percentage: 100,
        ssn: '222-44-6666',
        email: 'robert.coleman@example.com',
        phone: '(555) 222-4466'
      }
    ],
    notes: 'SURRENDERED: Full surrender processed 2025-06-15. Confirmation #CONF002001. Net payout $22,845.00 disbursed via CHECK.'
  },
  {
    policyNumber: 'POL020002',
    status: PolicyStatus.SURRENDERED,
    effectiveDate: '2012-09-15',
    expirationDate: '2042-09-15',
    premium: 3200.00,
    productType: ProductType.LIFE,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH021',
      firstName: 'Harold',
      lastName: 'Whitfield',
      dateOfBirth: '1958-12-01',
      ssn: '333-55-7777',
      email: 'harold.whitfield@example.com',
      phone: '(555) 333-5577',
      address: {
        street1: '910 Cedar Ridge Ln',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28202'
      }
    },
    beneficiaries: [
      {
        id: 'BEN021',
        firstName: 'Diane',
        lastName: 'Whitfield',
        dateOfBirth: '1959-04-18',
        relationship: 'Spouse',
        percentage: 60,
        ssn: '444-66-8888',
        email: 'diane.whitfield@example.com',
        phone: '(555) 444-6688'
      },
      {
        id: 'BEN022',
        firstName: 'Kevin',
        lastName: 'Whitfield',
        dateOfBirth: '1985-08-09',
        relationship: 'Child',
        percentage: 40
      }
    ],
    notes: 'SURRENDERED: Full surrender processed 2025-02-28. Confirmation #CONF002002. Net payout $67,032.00 disbursed via WIRE. Reason: Replacing with different policy.'
  },
  // LIFE policy for the Beneficiary Change Request demo: spouse's last
  // name changed to "Doe" after marriage (still shows "Smith" here until
  // a DeskGene-driven Beneficiary Maintenance update is applied), matching
  // the scenario prefilled in svg-pas-simulation's
  // beneficiary-change-request-form.html.
  {
    policyNumber: 'POL020003',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2023-02-01',
    expirationDate: '2053-02-01',
    premium: 250.00,
    productType: ProductType.LIFE,
    isPaidPlan: true,
    policyHolder: {
      id: 'PH022',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1975-05-15',
      ssn: '123-45-6789',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: {
        street1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210'
      }
    },
    beneficiaries: [
      {
        id: 'BEN023',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1987-06-22',
        relationship: 'Spouse',
        percentage: 100,
        ssn: '987-65-4321',
        email: 'jane.smith@example.com',
        phone: '(555) 234-5678'
      }
    ],
    notes: 'BENEFICIARY UPDATE PENDING: Spouse legal name change from Smith to Doe following marriage. Update via F7 Beneficiary Maintenance.'
  }
];

// ────────────────────────────────────────────────────────────────────────────
// Generated bulk data for realistic list/pagination behavior.
// Deterministic (no RNG) so every run renders the same screens. Common
// surnames repeat on purpose so searches like "smith" or "pol" span
// multiple subfile pages.
// ────────────────────────────────────────────────────────────────────────────
const GENERATED_FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Karen', 'Charles', 'Nancy', 'Christopher', 'Lisa', 'Daniel', 'Betty',
  'Matthew', 'Margaret', 'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Kimberly',
  'Steven', 'Emily', 'Paul', 'Dorothy', 'Andrew', 'Michelle', 'Joshua', 'Carol'
];
const GENERATED_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Smith', 'Johnson', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Smith', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Johnson',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright'
];
const GENERATED_STREETS = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm St',
  'Park Blvd', 'Lakeview Dr', 'Riverside Rd', 'Highland Ave', 'Walnut St', 'Chestnut Ct'
];
const GENERATED_CITIES: Array<[string, string, string]> = [
  ['Springfield', 'IL', '62701'], ['Columbus', 'OH', '43215'], ['Austin', 'TX', '78701'],
  ['Phoenix', 'AZ', '85001'], ['Denver', 'CO', '80202'], ['Nashville', 'TN', '37201'],
  ['Portland', 'OR', '97205'], ['Atlanta', 'GA', '30303'], ['Madison', 'WI', '53703'],
  ['Richmond', 'VA', '23219'], ['Boise', 'ID', '83702'], ['Des Moines', 'IA', '50309']
];
const GENERATED_PRODUCTS = [
  ProductType.AUTO, ProductType.HOME, ProductType.LIFE, ProductType.AUTO,
  ProductType.HOME, ProductType.HEALTH, ProductType.AUTO, ProductType.BUSINESS,
  ProductType.LIFE, ProductType.HOME
];
const GENERATED_STATUSES = [
  PolicyStatus.ACTIVE, PolicyStatus.ACTIVE, PolicyStatus.ACTIVE, PolicyStatus.PENDING,
  PolicyStatus.ACTIVE, PolicyStatus.EXPIRED, PolicyStatus.ACTIVE, PolicyStatus.CANCELLED,
  PolicyStatus.ACTIVE, PolicyStatus.ACTIVE
];

const buildGeneratedPolicies = (): Policy[] => {
  const policies: Policy[] = [];
  for (let i = 0; i < 45; i++) {
    const firstName = GENERATED_FIRST_NAMES[i % GENERATED_FIRST_NAMES.length];
    const lastName = GENERATED_LAST_NAMES[(i * 7 + 3) % GENERATED_LAST_NAMES.length];
    const [city, state, zipCode] = GENERATED_CITIES[(i * 5 + 1) % GENERATED_CITIES.length];
    const street = GENERATED_STREETS[(i * 3 + 2) % GENERATED_STREETS.length];
    const productType = GENERATED_PRODUCTS[(i * 3 + 1) % GENERATED_PRODUCTS.length];
    const status = GENERATED_STATUSES[(i * 7 + 2) % GENERATED_STATUSES.length];
    const effectiveYear = 2022 + (i % 3);
    const effectiveMonth = String((i % 12) + 1).padStart(2, '0');
    const seq = String(i + 1).padStart(4, '0');
    const ssnArea = 100 + ((i * 37) % 800);

    policies.push({
      policyNumber: `POL1${String(10000 + i * 137).slice(-5)}`,
      status,
      effectiveDate: `${effectiveYear}-${effectiveMonth}-01`,
      expirationDate: `${effectiveYear + 1}-${effectiveMonth}-01`,
      premium: Math.round((450 + ((i * 173) % 3200) + (i % 100) / 100) * 100) / 100,
      productType,
      isPaidPlan: productType === ProductType.LIFE && i % 4 === 0,
      policyHolder: {
        id: `PHG${seq}`,
        firstName,
        lastName,
        dateOfBirth: `${1945 + (i * 3) % 55}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        ssn: `${ssnArea}-${String(10 + (i % 89))}-${String(1000 + ((i * 613) % 9000))}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `(555) ${String(200 + (i % 799))}-${String(1000 + ((i * 389) % 9000))}`,
        address: {
          street1: `${100 + ((i * 91) % 8900)} ${street}`,
          ...(i % 5 === 0 ? { street2: `Unit ${(i % 40) + 1}` } : {}),
          city,
          state,
          zipCode
        }
      }
    });
  }
  return policies;
};

mockPolicies.push(...buildGeneratedPolicies());

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

// Mock cash value data for life insurance policies
const mockCashValues: Map<string, CashValueDetails> = new Map([
  ['POL001234', {
    policyNumber: 'POL001234',
    currentCashValue: 15750.00,
    surrenderValue: 14875.50,
    surrenderCharges: 874.50,
    loanBalance: 0,
    netSurrenderValue: 14875.50,
    accumulatedDividends: 1250.00,
    paidUpAdditions: 3500.00,
    guaranteedCashValue: 12000.00,
    nonGuaranteedCashValue: 3750.00,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  }],
  ['POL007890', {
    policyNumber: 'POL007890',
    currentCashValue: 45000.00,
    surrenderValue: 42750.00,
    surrenderCharges: 2250.00,
    loanBalance: 5000.00,
    netSurrenderValue: 37750.00,
    accumulatedDividends: 4500.00,
    paidUpAdditions: 8750.00,
    guaranteedCashValue: 35000.00,
    nonGuaranteedCashValue: 10000.00,
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  }],
  // Fully surrendered policies retain a zeroed-out cash value record post-payout
  ['POL020001', {
    policyNumber: 'POL020001',
    currentCashValue: 0.00,
    surrenderValue: 0.00,
    surrenderCharges: 0.00,
    loanBalance: 0,
    netSurrenderValue: 0.00,
    accumulatedDividends: 0.00,
    paidUpAdditions: 0.00,
    guaranteedCashValue: 0.00,
    nonGuaranteedCashValue: 0.00,
    lastCalculatedDate: '2025-06-15'
  }],
  ['POL020002', {
    policyNumber: 'POL020002',
    currentCashValue: 0.00,
    surrenderValue: 0.00,
    surrenderCharges: 0.00,
    loanBalance: 0,
    netSurrenderValue: 0.00,
    accumulatedDividends: 0.00,
    paidUpAdditions: 0.00,
    guaranteedCashValue: 0.00,
    nonGuaranteedCashValue: 0.00,
    lastCalculatedDate: '2025-02-28'
  }]
]);

// Mock surrender requests (seeded with historical completed requests for already-surrendered policies)
const mockSurrenderRequests: SurrenderRequest[] = [
  {
    requestId: 'SR002001',
    policyNumber: 'POL020001',
    requestDate: '2025-06-10',
    surrenderType: SurrenderType.FULL,
    requestedAmount: 24045.00,
    netPayoutAmount: 22845.00,
    surrenderCharges: 1202.25,
    taxWithholding: 2404.50,
    status: SurrenderRequestStatus.COMPLETED,
    reason: 'Financial hardship',
    paymentMethod: PaymentMethod.CHECK,
    processedDate: '2025-06-15',
    confirmationNumber: 'CONF002001'
  },
  {
    requestId: 'SR002002',
    policyNumber: 'POL020002',
    requestDate: '2025-02-22',
    surrenderType: SurrenderType.FULL,
    requestedAmount: 70560.00,
    netPayoutAmount: 67032.00,
    surrenderCharges: 3528.00,
    taxWithholding: 7056.00,
    status: SurrenderRequestStatus.COMPLETED,
    reason: 'Replacing with different policy',
    paymentMethod: PaymentMethod.WIRE,
    processedDate: '2025-02-28',
    confirmationNumber: 'CONF002002'
  }
];

// Cash value functions
export const getCashValueDetails = (policyNumber: string): CashValueDetails | undefined => {
  const policy = getPolicyByNumber(policyNumber);
  
  // Only life insurance policies with paid plans have cash value
  if (!policy || policy.productType !== ProductType.LIFE || !policy.isPaidPlan) {
    return undefined;
  }
  
  // Return existing cash value or generate mock data
  if (mockCashValues.has(policyNumber)) {
    return mockCashValues.get(policyNumber);
  }
  
  // Generate mock cash value for eligible policies
  const yearsActive = Math.max(1, Math.floor((new Date().getTime() - new Date(policy.effectiveDate).getTime()) / (365 * 24 * 60 * 60 * 1000)));
  const baseCashValue = policy.premium * yearsActive * 0.6;
  const surrenderCharges = baseCashValue * 0.05;
  
  const cashValue: CashValueDetails = {
    policyNumber,
    currentCashValue: parseFloat(baseCashValue.toFixed(2)),
    surrenderValue: parseFloat((baseCashValue - surrenderCharges).toFixed(2)),
    surrenderCharges: parseFloat(surrenderCharges.toFixed(2)),
    loanBalance: 0,
    netSurrenderValue: parseFloat((baseCashValue - surrenderCharges).toFixed(2)),
    accumulatedDividends: parseFloat((baseCashValue * 0.08).toFixed(2)),
    paidUpAdditions: parseFloat((baseCashValue * 0.15).toFixed(2)),
    guaranteedCashValue: parseFloat((baseCashValue * 0.75).toFixed(2)),
    nonGuaranteedCashValue: parseFloat((baseCashValue * 0.25).toFixed(2)),
    lastCalculatedDate: new Date().toISOString().split('T')[0]
  };
  
  mockCashValues.set(policyNumber, cashValue);
  return cashValue;
};

export const calculateSurrenderValue = (
  policyNumber: string,
  surrenderType: SurrenderType,
  partialAmount?: number
): { grossAmount: number; surrenderCharges: number; taxWithholding: number; netAmount: number } | undefined => {
  const cashValue = getCashValueDetails(policyNumber);
  
  if (!cashValue) {
    return undefined;
  }
  
  let grossAmount: number;
  
  if (surrenderType === SurrenderType.FULL) {
    grossAmount = cashValue.currentCashValue;
  } else {
    // Partial surrender - use requested amount or 50% of cash value
    grossAmount = Math.min(partialAmount || cashValue.currentCashValue * 0.5, cashValue.currentCashValue * 0.9);
  }
  
  // Calculate charges (5% for full, 3% for partial)
  const chargeRate = surrenderType === SurrenderType.FULL ? 0.05 : 0.03;
  const surrenderCharges = grossAmount * chargeRate;
  
  // Calculate tax withholding (10% federal)
  const taxWithholding = grossAmount * 0.10;
  
  const netAmount = grossAmount - surrenderCharges - taxWithholding;
  
  return {
    grossAmount: parseFloat(grossAmount.toFixed(2)),
    surrenderCharges: parseFloat(surrenderCharges.toFixed(2)),
    taxWithholding: parseFloat(taxWithholding.toFixed(2)),
    netAmount: parseFloat(netAmount.toFixed(2))
  };
};

export const createSurrenderRequest = (
  policyNumber: string,
  surrenderType: SurrenderType,
  requestedAmount: number,
  reason: string,
  paymentMethod: PaymentMethod,
  bankAccountLast4?: string
): SurrenderRequest | undefined => {
  const calculation = calculateSurrenderValue(policyNumber, surrenderType, requestedAmount);
  
  if (!calculation) {
    return undefined;
  }
  
  const request: SurrenderRequest = {
    requestId: `SR${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    policyNumber,
    requestDate: new Date().toISOString().split('T')[0],
    surrenderType,
    requestedAmount: calculation.grossAmount,
    netPayoutAmount: calculation.netAmount,
    surrenderCharges: calculation.surrenderCharges,
    taxWithholding: calculation.taxWithholding,
    status: SurrenderRequestStatus.PENDING,
    reason,
    paymentMethod,
    bankAccountLast4
  };
  
  mockSurrenderRequests.push(request);
  return request;
};

export const getSurrenderRequests = (policyNumber: string): SurrenderRequest[] => {
  return mockSurrenderRequests.filter(req => req.policyNumber === policyNumber);
};

export const getSurrenderRequestById = (requestId: string): SurrenderRequest | undefined => {
  return mockSurrenderRequests.find(req => req.requestId === requestId);
};

export const processSurrenderRequest = (
  requestId: string,
  approve: boolean
): SurrenderRequest | undefined => {
  const requestIndex = mockSurrenderRequests.findIndex(req => req.requestId === requestId);
  
  if (requestIndex === -1) {
    return undefined;
  }
  
  const request = mockSurrenderRequests[requestIndex];
  
  if (approve) {
    request.status = SurrenderRequestStatus.APPROVED;
    request.processedDate = new Date().toISOString().split('T')[0];
    request.confirmationNumber = `CONF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    // If full surrender, update policy status
    if (request.surrenderType === SurrenderType.FULL) {
      updatePolicyStatus(request.policyNumber, PolicyStatus.SURRENDERED);
    }
  } else {
    request.status = SurrenderRequestStatus.REJECTED;
    request.processedDate = new Date().toISOString().split('T')[0];
  }
  
  mockSurrenderRequests[requestIndex] = request;
  return request;
};

// Check if policy is eligible for surrender
export const isPolicyEligibleForSurrender = (policyNumber: string): { eligible: boolean; reason?: string } => {
  const policy = getPolicyByNumber(policyNumber);
  
  if (!policy) {
    return { eligible: false, reason: 'Policy not found' };
  }
  
  if (policy.productType !== ProductType.LIFE) {
    return { eligible: false, reason: 'Only life insurance policies can be surrendered' };
  }
  
  if (!policy.isPaidPlan) {
    return { eligible: false, reason: 'Policy must be a paid plan to have cash value' };
  }
  
  if (policy.status === PolicyStatus.SURRENDERED) {
    return { eligible: false, reason: 'Policy has already been surrendered' };
  }
  
  if (policy.status === PolicyStatus.CANCELLED) {
    return { eligible: false, reason: 'Policy has been cancelled' };
  }
  
  const cashValue = getCashValueDetails(policyNumber);
  if (!cashValue || cashValue.currentCashValue <= 0) {
    return { eligible: false, reason: 'Policy has no cash value' };
  }
  
  return { eligible: true };
};
