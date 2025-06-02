// Policy Administration System Types

export interface Policy {
  policyNumber: string;
  status: PolicyStatus;
  effectiveDate: string;
  expirationDate: string;
  premium: number;
  productType: ProductType;
  policyHolder: PolicyHolder;
  beneficiaries?: Beneficiary[];
  isPaidPlan?: boolean;
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  RENEWED = 'RENEWED'
}

export enum ProductType {
  AUTO = 'AUTO',
  HOME = 'HOME',
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
  BUSINESS = 'BUSINESS'
}

export interface PolicyHolder {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export type ScreenField = {
  row: number;
  col: number;
  length: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | any; // Using any for compatibility with existing code
  isEditable?: boolean;
  isHighlighted?: boolean;
  fieldName?: string;
}

export interface ScreenConfig {
  title: string;
  fields: ScreenField[];
  functionKeys: FunctionKey[];
}

export interface FunctionKey {
  key: string;
  description: string;
  action: () => void;
}

export interface NavigationState {
  currentScreen: string;
  previousScreen?: string;
  screenStack: string[];
}

export interface Beneficiary {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  percentage: number;
  ssn?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface LoanQuote {
  quoteId: string;
  policyNumber: string;
  requestDate: string;
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number; // in months
  totalInterest: number;
  status: LoanQuoteStatus;
}

export enum LoanQuoteStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
