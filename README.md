# Solvrays Legacy App Simulation - AS/400 Style Policy Administration System

This is a modern web application that emulates the look and feel of a legacy AS/400 green screen terminal interface for a comprehensive policy administration system.

## Features

- **Authentic AS/400 Green Screen Interface**: Complete with function keys, field navigation, and classic green-on-black styling
- **Policy Search**: Search for policies by policy number or policyholder information
- **Policy Details**: View comprehensive policy information
- **Policyholder Management**: Update policyholder personal and address information
- **Product Management**: View and manage different insurance product types
- **Agent Master File Inquiry (AGTMST)**: Subfile search/list of appointed agents by name, hierarchy level, or cross-system reference code
- **Agent Onboarding (AGTAPP)**: Multi-step new-appointment wizard (personal info → license → hierarchy → review → complete) that creates a new Agent Master File record

## Connected Demo Narrative

This system shares a common cast of named demo agents with the other Solvrays
simulated environments so a demo can move between systems with a consistent
story:

- `svg-pas-simulation` — P&C Policy Admin (producer records)
- `svg-lifepro-simulation` — SVGLife preneed/final expense Policy Admin (agent hierarchy)
- `svg-legacy-app` (this app) — AS/400 Agent Master File (AGTMST)

Agents created here start out `PENDING` with `syncStatus: PENDING_BATCH` —
modeling the classic mainframe pattern where new appointments are held for a
nightly batch job before they replicate to the downstream PAS producer file
and SVGLife agent hierarchy. Existing seeded agents show `SYNCED` and carry
`pasAgentCode` / `svgLifeAgentId` cross-reference fields, visible in the
Agent Master File Inquiry screen's `Xref` column.

## Technology Stack

- **Next.js**: Modern React framework with server-side rendering
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling the application

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

The application emulates an AS/400 terminal interface. Here's how to navigate:

- Use the **Tab** key to move between fields
- Use **Enter** to submit forms or select options
- Use **Function keys** (F1, F3, etc.) for various actions as indicated at the bottom of each screen
- Use **Arrow keys** to navigate within the terminal

## Screens

1. **Main Menu**: Entry point to access all system functions
2. **Policy Search**: Search for policies by various criteria
3. **Policy Details**: View comprehensive information about a policy
4. **Policyholder Management**: Update policyholder information
5. **Product Management**: View and manage product types
6. **Agent Master File Inquiry**: Search/list appointed agents (option 5 from Main Menu)
7. **Agent Onboarding**: New agent appointment wizard (option 6 from Main Menu, or F6 from Agent Master File Inquiry)

## Development

This application is built with TypeScript and follows best practices for type safety and code organization.

- Types and interfaces are centralized in the `/src/types` directory
- Screen components are in the `/src/screens` directory
- Core terminal emulation is handled by the Terminal component in `/src/components/terminal`
- Mock data services are in the `/src/services` directory
