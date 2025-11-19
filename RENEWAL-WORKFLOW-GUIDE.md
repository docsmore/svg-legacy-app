# Policy Renewal Workflow Guide

## Overview
The Policy Renewal Screen provides a step-by-step workflow for operators to process policy renewals in the legacy terminal system.

## Accessing the Renewal Screen

### From Policy Details:
1. Navigate to Policy Details (F3 from search, or direct link)
2. Press **F6** to initiate renewal process

### Direct Access:
Navigate to `/policy-renewal?policyNumber=POL######`

## Renewal Workflow Steps

### Step 1: Review Policy & Proposed Terms
**Screen**: POLICY RENEWAL - STEP 1: REVIEW

**Information Displayed:**
- Policy Number
- Policyholder Name
- Product Type
- Current Premium
- Expiration Date
- Expiration Status (Expired/Expiring Soon warning)
- **Renewal Blocker** (if present) - highlighted in red

**Editable Fields:**
- New Premium (pre-filled with current premium)
- New Effective Date (pre-filled with current expiration date)
- New Expiration Date (pre-filled with +1 year)

**Actions:**
- **F8 (Continue)**: Proceed to next step
  - If renewal blocker exists → Go to Step 2
  - If no blocker → Go to Step 3
- **F3 (Exit)**: Return to Policy Details
- **F9 (Deny Renewal)**: Jump to denial workflow

---

### Step 2: Resolve Renewal Blocker
**Screen**: POLICY RENEWAL - STEP 2: RESOLVE BLOCKER

**Only appears if policy has renewal blocker**

**Information Displayed:**
- Renewal blocker description (from policy notes)
- Examples of acceptable resolutions

**Required Field:**
- **Blocker Resolution Notes** (multi-line text field)
  - Must document how the blocker was resolved
  - Examples provided on screen

**Actions:**
- **F8 (Continue)**: Validate resolution notes and proceed to Step 3
  - Notes must not be empty
  - System marks blocker as resolved
- **F3 (Exit)**: Return to Policy Details without processing

**Example Resolution Notes:**
```
Payment of $825 received on 11/19/2025 via check #1234
Outstanding balance cleared. Account current.
```

```
Property inspection completed on 11/18/2025
Electrical system upgraded to code
Certificate of compliance received
```

---

### Step 3: Review & Confirm Details
**Screen**: POLICY RENEWAL - STEP 3: REVIEW & CONFIRM

**Information Displayed:**
- Blocker resolution confirmation (if applicable)
- Renewal Summary:
  - Policy Number
  - Old Premium vs New Premium
  - Premium Change (highlighted)
  - New Term Dates (Effective → Expiration)

**Editable Field:**
- **Underwriter Notes** (optional)
  - Document any special conditions
  - Rate adjustments
  - Coverage changes

**Actions:**
- **F8 (Continue)**: Proceed to final confirmation
- **F3 (Exit)**: Return to Policy Details
- **F9 (Deny Renewal)**: Jump to denial workflow

---

### Step 4: Final Confirmation
**Screen**: POLICY RENEWAL - STEP 4: FINAL CONFIRMATION

**Information Displayed:**
- Confirmation prompt
- Summary of renewal terms
- Policy number
- New premium
- New term dates

**Actions:**
- **F8 (CONFIRM)**: Process the renewal
  - Updates policy status to RENEWED
  - Creates new policy term
  - Displays success message
  - Auto-redirects to Policy Details after 3 seconds
- **F3 (CANCEL)**: Return to Policy Details without processing

---

### Step 5: Renewal Denial (Optional Path)
**Screen**: POLICY RENEWAL - DENIAL

**Accessed by pressing F9 at any step**

**Required Field:**
- **Reason for Denial**
  - Must document why renewal is being denied
  - Will be stored in policy notes

**Actions:**
- **F8 (Confirm Denial)**: Process denial
  - Updates policy status
  - Records denial reason
  - Sends non-renewal notice (in production)
- **F3 (Cancel)**: Return to previous step

---

### Step 6: Success
**Screen**: POLICY RENEWAL - SUCCESS

**Information Displayed:**
- Success confirmation message
- Policy number
- "Redirecting..." message

**Behavior:**
- Automatically redirects to Policy Details after 3 seconds
- Policy status updated to RENEWED

---

## Function Key Reference

| Key | Description | Available In |
|-----|-------------|--------------|
| F1  | Help | All steps |
| F3  | Exit/Cancel | All steps |
| F5  | Refresh | Step 1 only |
| F8  | Continue/Confirm | All steps (action varies) |
| F9  | Deny Renewal | Steps 1-3 |

---

## Testing the Renewal Workflow

### Test Case 1: Simple Renewal (No Blockers)
**Policy**: POL001234 (John Smith - Auto)
**Steps:**
1. Navigate to policy details
2. Press F6 to start renewal
3. Review terms in Step 1
4. Press F8 to continue (skips Step 2 - no blocker)
5. Add underwriter notes in Step 3 (optional)
6. Press F8 to continue
7. Press F8 to confirm in Step 4
8. View success message

**Expected Result**: Policy renewed successfully

---

### Test Case 2: Renewal with Blocker Resolution
**Policy**: POL013579 (Linda Thompson - Home)
**Blocker**: Unpaid premium balance of $825

**Steps:**
1. Navigate to policy details
2. Press F6 to start renewal
3. Review terms in Step 1 - see blocker warning
4. Press F8 to continue → Goes to Step 2
5. Enter resolution notes:
   ```
   Payment received 11/19/2025
   Check #5678 for $825.00
   Balance cleared
   ```
6. Press F8 to continue → Goes to Step 3
7. Review summary showing "✓ Blocker Resolved"
8. Press F8 to continue
9. Press F8 to confirm
10. View success message

**Expected Result**: Policy renewed with blocker resolution documented

---

### Test Case 3: Renewal Denial
**Policy**: POL014680 (James Wilson - Home)
**Reason**: Too many claims

**Steps:**
1. Navigate to policy details
2. Press F6 to start renewal
3. Review terms in Step 1
4. Press F9 to deny renewal
5. Enter denial reason:
   ```
   3 claims in past 12 months
   Risk assessment: High
   Underwriting decision: Non-renewal
   ```
6. Press F8 to confirm denial

**Expected Result**: Policy marked for non-renewal with reason documented

---

### Test Case 4: Premium Adjustment
**Policy**: POL010111 (Patricia Martinez - Home)
**Scenario**: Increase premium due to claim

**Steps:**
1. Navigate to policy details
2. Press F6 to start renewal
3. In Step 1, edit New Premium from $1,850 to $2,100
4. Resolve blocker in Step 2
5. In Step 3, add underwriter notes:
   ```
   Premium increased 13.5% due to roof claim
   Inspection completed, repairs verified
   New rate reflects increased risk
   ```
6. Continue through confirmation
7. Confirm renewal

**Expected Result**: Policy renewed with new premium of $2,100

---

## Policies Ready for Renewal Testing

### Urgent (Expiring within 15 days):
- **POL015791** - Maria Garcia (5 days) - Electrical upgrade blocker
- **POL013579** - Linda Thompson (15 days) - Payment blocker

### Soon (Expiring within 30 days):
- **POL010111** - Patricia Martinez (30 days) - Roof damage blocker

### Already Expired:
- **POL012345** - David Anderson (expired) - Flood zone blocker
- **POL014680** - James Wilson (expired 6 months) - Multiple claims blocker

### Normal Timeline:
- **POL016802** - Christopher Lee (60 days) - Pool fence blocker

---

## Integration Points

### Policy Status Updates
When renewal is processed:
- Current policy status → RENEWED
- New policy record created (in production)
- Expiration date extended
- Premium updated

### Notifications (Production)
- Renewal confirmation sent to policyholder
- Invoice generated for new premium
- Calendar reminder set for next renewal

### Audit Trail
- All renewal actions logged
- Blocker resolutions documented
- Underwriter notes preserved
- Denial reasons recorded

---

## Operator Best Practices

### Before Starting Renewal:
1. Review policy history
2. Check for open claims
3. Verify payment status
4. Review any previous notes

### During Blocker Resolution:
1. Be specific in resolution notes
2. Include dates and amounts
3. Reference supporting documents
4. Get supervisor approval if needed

### Premium Adjustments:
1. Document reason for change
2. Follow underwriting guidelines
3. Explain to policyholder if significant
4. Get approval for increases >20%

### Denial Process:
1. Provide clear, specific reason
2. Follow regulatory requirements
3. Ensure proper notice period
4. Document alternative options offered

---

## Common Scenarios

### Scenario: Payment Plan Setup
**Blocker**: Unpaid balance
**Resolution**:
```
Payment plan established: 3 monthly installments
First payment: $275 received 11/19/2025
Remaining: $275 on 12/19/2025, $275 on 01/19/2026
Renewal approved pending completion of payment plan
```

### Scenario: Inspection Required
**Blocker**: Property condition issue
**Resolution**:
```
Property inspection completed 11/18/2025 by ABC Inspections
Report #12345 reviewed
Required repairs completed and verified
Photos on file
Renewal approved
```

### Scenario: Coverage Modification
**Blocker**: New risk factor (flood zone)
**Resolution**:
```
Flood insurance policy added
Policy #FL-789456 with XYZ Insurance
Coverage: $250,000
Effective: 12/01/2025
Renewal approved with flood endorsement
```

### Scenario: Rate Increase Communication
**No Blocker**: Premium adjustment
**Underwriter Notes**:
```
Premium increased from $1,850 to $2,100 (13.5%)
Reason: One roof claim in past year ($15,000)
Policyholder notified via phone 11/18/2025
Accepted new rate
Renewal processed
```

---

## Troubleshooting

### Issue: Cannot proceed past Step 1
**Cause**: Renewal blocker present
**Solution**: Must go through Step 2 to resolve blocker

### Issue: Blocker resolution notes rejected
**Cause**: Empty or insufficient notes
**Solution**: Provide detailed resolution documentation

### Issue: Premium change seems incorrect
**Cause**: Manual entry error
**Solution**: Re-enter correct amount in Step 1, use F5 to refresh

### Issue: Accidentally denied renewal
**Cause**: Pressed F9 instead of F8
**Solution**: Press F3 to exit, start renewal process again

---

## Future Enhancements

### Planned Features:
- Automatic premium calculation based on risk factors
- Integration with claims system for automatic blocker detection
- Email/SMS notification to policyholder
- Electronic signature for renewal acceptance
- Batch renewal processing for multiple policies
- Renewal reminder dashboard
- Historical renewal comparison

### API Integration Points:
- Payment gateway for immediate payment collection
- Inspection scheduling system
- Underwriting rules engine
- Document management system
- CRM for policyholder communication
