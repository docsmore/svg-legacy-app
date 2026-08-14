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
  notes?: string; // For renewal blockers and special conditions
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  RENEWED = 'RENEWED',
  SURRENDERED = 'SURRENDERED'
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

// Cash Value related types
export interface CashValueDetails {
  policyNumber: string;
  currentCashValue: number;
  surrenderValue: number;
  surrenderCharges: number;
  loanBalance: number;
  netSurrenderValue: number;
  accumulatedDividends: number;
  paidUpAdditions: number;
  guaranteedCashValue: number;
  nonGuaranteedCashValue: number;
  lastCalculatedDate: string;
}

export interface SurrenderRequest {
  requestId: string;
  policyNumber: string;
  requestDate: string;
  surrenderType: SurrenderType;
  requestedAmount: number;
  netPayoutAmount: number;
  surrenderCharges: number;
  taxWithholding: number;
  status: SurrenderRequestStatus;
  reason: string;
  paymentMethod: PaymentMethod;
  bankAccountLast4?: string;
  processedDate?: string;
  confirmationNumber?: string;
}

export enum SurrenderType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL'
}

export enum SurrenderRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  CHECK = 'CHECK',
  ACH = 'ACH',
  WIRE = 'WIRE'
}

// Agent Master File — agent/producer records maintained on the AS/400.
// Shares a common cast of demo personas with the other Solvrays demo
// environments (svg-pas-simulation and svg-lifepro-simulation), linked via
// pasAgentCode / svgLifeAgentId cross-reference fields.
export interface Agent {
  agentId: string;
  firstName: string;
  lastName: string;
  ssn: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  status: AgentStatus;
  hierarchyLevel: string;
  uplineAgentId?: string;
  appointmentDate: string;
  commissionPercent: number;
  /** Cross-reference to the matching producer record in svg-pas-simulation, if any. */
  pasAgentCode?: string;
  /** Cross-reference to the matching agent record in svg-lifepro-simulation (SVGLife), if any. */
  svgLifeAgentId?: string;
  /** Batch sync status to downstream systems (SVGLife / PAS producer file). */
  syncStatus?: AgentSyncStatus;
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

export enum AgentSyncStatus {
  SYNCED = 'SYNCED',
  PENDING_BATCH = 'PENDING_BATCH',
  NOT_APPLICABLE = 'N/A'
}
