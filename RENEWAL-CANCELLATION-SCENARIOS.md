# Policy Renewal & Cancellation Scenarios

## Overview
This document describes the enhanced policy administration system with realistic renewal and cancellation scenarios for HOME insurance policies.

## New HOME Policies with Renewal Blockers

### 1. POL010111 - Patricia Martinez (Austin, TX)
- **Status**: ACTIVE
- **Expiration**: 2025-12-31 (Expiring within 30 days)
- **Premium**: $1,850.00
- **Renewal Blocker**: Property has open claim for roof damage. Requires inspection before renewal.
- **Scenario**: Cannot auto-renew due to pending claim. Requires manual underwriting review and property inspection.

### 2. POL012345 - David Anderson (Denver, CO)
- **Status**: ACTIVE (but past expiration date)
- **Expiration**: 2024-12-15 (Already expired)
- **Premium**: $2,200.00
- **Renewal Blocker**: Property located in newly designated flood zone. Requires flood insurance addendum.
- **Scenario**: Policy needs immediate attention. Cannot renew without adding flood coverage due to FEMA zone reclassification.

### 3. POL013579 - Linda Thompson (Los Angeles, CA)
- **Status**: ACTIVE
- **Expiration**: 2025-01-15 (Expiring in ~15 days)
- **Premium**: $1,650.00
- **Renewal Blocker**: Property has unpaid premium balance of $825. Payment required before renewal.
- **Scenario**: Financial blocker. Must collect outstanding balance before processing renewal.

### 4. POL014680 - James Wilson (Seattle, WA)
- **Status**: EXPIRED
- **Expiration**: 2024-06-01 (Expired 6 months ago)
- **Premium**: $1,975.00
- **Renewal Blocker**: Property has 3 claims in past 12 months. Requires underwriting review and possible rate adjustment.
- **Scenario**: High-risk policy. Needs complete underwriting reassessment. Likely premium increase or non-renewal.

### 5. POL015791 - Maria Garcia (Miami, FL)
- **Status**: ACTIVE
- **Expiration**: 2025-01-05 (Expiring in ~5 days)
- **Premium**: $2,100.00
- **Renewal Blocker**: Property inspection reveals outdated electrical system. Upgrade required for renewal.
- **Scenario**: Safety compliance issue. Policyholder must provide proof of electrical system upgrade or policy cannot be renewed.

### 6. POL016802 - Christopher Lee (Phoenix, AZ)
- **Status**: ACTIVE
- **Expiration**: 2025-02-28 (Expiring in ~60 days)
- **Premium**: $1,725.00
- **Renewal Blocker**: Property has swimming pool without required safety fence. Compliance needed for renewal.
- **Scenario**: Liability risk. Must install compliant pool fence and provide photos/inspection report before renewal.

## New Search Functions

### Basic Search Functions
- `getExpiredPolicies()` - Returns all expired policies
- `getExpiringPolicies(daysThreshold)` - Returns policies expiring within X days (default: 30)
- `getPoliciesByType(productType)` - Returns policies of specific type (AUTO, HOME, LIFE, etc.)
- `getPoliciesWithRenewalBlockers()` - Returns policies that have renewal blockers

### Advanced Search
`searchPoliciesAdvanced(filters)` - Accepts multiple filter criteria:
- `searchTerm` - Search by policy number, name, or ID
- `status` - Filter by ACTIVE, EXPIRED, PENDING, CANCELLED, RENEWED
- `productType` - Filter by AUTO, HOME, LIFE, HEALTH, BUSINESS
- `expiringWithinDays` - Filter by days until expiration
- `hasRenewalBlockers` - Filter policies with renewal blockers

## Usage Examples

### Find all expired HOME policies:
```typescript
const expiredHomePolicies = searchPoliciesAdvanced({
  productType: ProductType.HOME,
  status: PolicyStatus.EXPIRED
});
```

### Find HOME policies expiring in next 15 days:
```typescript
const urgentRenewals = searchPoliciesAdvanced({
  productType: ProductType.HOME,
  expiringWithinDays: 15
});
```

### Find all policies with renewal blockers:
```typescript
const blockedRenewals = getPoliciesWithRenewalBlockers();
```

### Find HOME policies expiring soon with blockers:
```typescript
const criticalCases = searchPoliciesAdvanced({
  productType: ProductType.HOME,
  expiringWithinDays: 30,
  hasRenewalBlockers: true
});
```

## Real-Life Workflow Scenarios

### Scenario 1: Urgent Renewal Review
**Policy**: POL015791 (Maria Garcia)
**Days to Expiration**: 5 days
**Action Required**:
1. Contact policyholder immediately
2. Request proof of electrical system upgrade
3. If upgrade completed: Process renewal with possible premium adjustment
4. If not completed: Issue non-renewal notice

### Scenario 2: Payment Collection
**Policy**: POL013579 (Linda Thompson)
**Days to Expiration**: 15 days
**Action Required**:
1. Send payment reminder notice
2. Offer payment plan options
3. Hold renewal until payment received
4. If payment not received by expiration: Cancel policy

### Scenario 3: Underwriting Review
**Policy**: POL014680 (James Wilson)
**Status**: Already expired
**Action Required**:
1. Review all 3 claims from past year
2. Conduct risk assessment
3. Determine if renewal is acceptable
4. If yes: Calculate new premium (likely 25-40% increase)
5. If no: Issue formal non-renewal letter

### Scenario 4: Compliance Issue
**Policy**: POL016802 (Christopher Lee)
**Days to Expiration**: 60 days
**Action Required**:
1. Send compliance notice regarding pool fence
2. Provide 45-day deadline for compliance
3. Request photo documentation or inspection report
4. If compliant: Process normal renewal
5. If non-compliant: Non-renew or exclude pool coverage

### Scenario 5: Coverage Change Required
**Policy**: POL012345 (David Anderson)
**Status**: Past expiration
**Action Required**:
1. Notify policyholder of flood zone designation
2. Obtain flood insurance quote
3. Prepare endorsement adding flood coverage
4. Recalculate premium with flood coverage
5. Obtain policyholder acceptance of new terms

## Testing the System

### Test Case 1: Search for Urgent Renewals
```
1. Navigate to Policy Search
2. Use advanced search with expiringWithinDays: 15
3. Verify results show POL015791 and POL013579
4. Select each policy to view renewal blocker details
```

### Test Case 2: Expired Policy Management
```
1. Search for expired policies
2. Verify POL014680 appears in results
3. Review claim history and notes
4. Initiate underwriting review workflow
```

### Test Case 3: Renewal Blocker Report
```
1. Run getPoliciesWithRenewalBlockers()
2. Verify all 6 new HOME policies appear
3. Group by urgency (days to expiration)
4. Prioritize policies expiring within 15 days
```

## Integration with Renewal/Cancellation Forms

The policies with renewal blockers should:
1. Display warning message when attempting auto-renewal
2. Show specific blocker reason from `notes` field
3. Require manual review and approval
4. Provide workflow to resolve blocker (payment, inspection, etc.)
5. Track blocker resolution status

## Cancellation Scenarios

Policies may need cancellation for:
- **Non-payment**: POL013579 if payment not received
- **Non-compliance**: POL015791, POL016802 if safety issues not resolved
- **High risk**: POL014680 if underwriting denies renewal
- **Coverage unavailable**: POL012345 if flood insurance not obtained
- **Policyholder request**: Any policy can be cancelled by request

Each cancellation should:
1. Generate confirmation number
2. Calculate pro-rated refund if applicable
3. Send cancellation notice to policyholder
4. Update policy status to CANCELLED
5. Record cancellation reason and date
