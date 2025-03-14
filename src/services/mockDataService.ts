import { Policy, PolicyStatus, ProductType, PolicyHolder, Address } from '@/types';

// Mock data for the policy administration system
const mockPolicies: Policy[] = [
  {
    policyNumber: 'POL001234',
    status: PolicyStatus.ACTIVE,
    effectiveDate: '2024-01-01',
    expirationDate: '2025-01-01',
    premium: 1200.50,
    productType: ProductType.AUTO,
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
    }
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
    }
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
