"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import { ScreenConfig, FunctionKey, Agent } from '@/types';
import { getAgents, searchAgents } from '@/services/mockDataService';

// Classic subfile paging: fixed 10 result rows per screen (rows 10-19 on a 24x80 terminal)
const PAGE_SIZE = 10;

const AgentSearchScreen: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Agent[]>(getAgents());
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [message, setMessage] = useState<string>(`${getAgents().length} agent records on file`);
  const [page, setPage] = useState<number>(0);

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
  const pagedResults = searchResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasMore = page < totalPages - 1;

  const handleKeyPress = (key: string) => {
    if (key === 'Enter') {
      if (searchTerm && searchTerm.trim().length > 0) {
        performSearch();
      } else if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        setMessage(
          `${searchResults[selectedIndex].firstName} ${searchResults[selectedIndex].lastName} — ` +
          `${searchResults[selectedIndex].hierarchyLevel} — Status: ${searchResults[selectedIndex].status}`
        );
      } else if (searchResults.length > 0) {
        setMessage('Please select an agent by typing a number');
      }
    } else if (key === 'F3') {
      router.push('/');
    } else if (key === 'F5') {
      clearSearch();
    } else if (key === 'F6') {
      router.push('/agent-onboard');
    } else if (key === 'PageDown') {
      if (hasMore) {
        setPage(page + 1);
        setMessage('');
      } else {
        setMessage('Bottom reached');
      }
    } else if (key === 'PageUp') {
      if (page > 0) {
        setPage(page - 1);
        setMessage('');
      } else {
        setMessage('Already at top');
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'searchTerm') {
      setSearchTerm(value);
    } else if (fieldName === 'selectedIndex') {
      const index = parseInt(value);
      if (!isNaN(index) && index >= 1 && index <= searchResults.length) {
        setSelectedIndex(index - 1);
        setMessage(`Selected agent ${searchResults[index - 1].agentId}`);
      } else if (value === '') {
        setSelectedIndex(-1);
        setMessage('');
      } else {
        setSelectedIndex(-1);
        setMessage('Invalid selection. Please enter a valid number.');
      }
    }
  };

  const performSearch = () => {
    const results = searchAgents(searchTerm);
    setSearchResults(results);
    setSelectedIndex(-1);
    setMessage(results.length === 0 ? 'No agents found matching your search criteria' : `Found ${results.length} agent(s)`);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(getAgents());
    setSelectedIndex(-1);
    setMessage(`${getAgents().length} agent records on file`);
    setPage(0);
  };

  const functionKeys: FunctionKey[] = [
    { key: 'F1', description: 'Help', action: () => {} },
    { key: 'F3', description: 'Exit', action: () => {} },
    { key: 'F5', description: 'Refresh', action: () => {} },
    { key: 'F6', description: 'Onboard Agent', action: () => {} },
    { key: 'Enter', description: 'Search/Select', action: () => {} }
  ];

  const selectionInputRow = 21;

  const resultFields = pagedResults.flatMap((agent, index) => {
    const rowIndex = 10 + index;
    const globalIndex = page * PAGE_SIZE + index;
    const xref = agent.pasAgentCode ? 'PAS' : agent.svgLifeAgentId ? 'SVG' : '';
    return [
      { row: rowIndex, col: 2, length: 2, value: (globalIndex + 1).toString() + '.', isHighlighted: selectedIndex === globalIndex },
      { row: rowIndex, col: 5, length: 9, value: agent.agentId, isHighlighted: selectedIndex === globalIndex },
      { row: rowIndex, col: 15, length: 22, value: `${agent.lastName}, ${agent.firstName}`, isHighlighted: selectedIndex === globalIndex },
      { row: rowIndex, col: 38, length: 24, value: agent.hierarchyLevel, isHighlighted: selectedIndex === globalIndex },
      { row: rowIndex, col: 63, length: 10, value: agent.status, isHighlighted: selectedIndex === globalIndex },
      { row: rowIndex, col: 74, length: 4, value: xref, isHighlighted: selectedIndex === globalIndex }
    ];
  });

  const screenConfig: ScreenConfig = {
    title: 'AGENT MASTER FILE INQUIRY',
    fields: [
      { row: 0, col: 0, length: 80, value: 'POLICY ADMINISTRATION SYSTEM', isHighlighted: true },
      { row: 1, col: 0, length: 80, value: 'AGENT MASTER FILE INQUIRY (AGTMST)', isHighlighted: true },
      { row: 2, col: 0, length: 80, value: new Date().toISOString().split('T')[0] },

      { row: 4, col: 2, length: 30, value: 'Search (name/level/xref):' },
      { row: 4, col: 28, length: 30, value: searchTerm, isEditable: true, fieldName: 'searchTerm' },

      { row: 6, col: 2, length: 76, value: message, isHighlighted: true },

      { row: 8, col: 2, length: 3, value: 'Sel', isHighlighted: true },
      { row: 8, col: 5, length: 9, value: 'Agent #', isHighlighted: true },
      { row: 8, col: 15, length: 22, value: 'Name', isHighlighted: true },
      { row: 8, col: 38, length: 24, value: 'Hierarchy Level', isHighlighted: true },
      { row: 8, col: 63, length: 10, value: 'Status', isHighlighted: true },
      { row: 8, col: 74, length: 4, value: 'Xref', isHighlighted: true },

      ...resultFields,

      { row: selectionInputRow, col: 2, length: 30, value: 'Type number to select:' },
      { row: selectionInputRow, col: 25, length: 2, value: selectedIndex >= 0 ? (selectedIndex + 1).toString() : '', isEditable: true, fieldName: 'selectedIndex' },

      ...(searchResults.length > 0
        ? [{
            row: selectionInputRow,
            col: 66,
            length: 14,
            value: hasMore ? `More... (${page + 1}/${totalPages})` : `Bottom (${page + 1}/${totalPages})`,
            isHighlighted: true
          }]
        : []),

      { row: selectionInputRow + 2, col: 0, length: 80, value: 'F1=Help F3=Exit F5=Refresh F6=Onboard Agent PgUp/PgDn=Roll', isHighlighted: true }
    ],
    functionKeys
  };

  return <Terminal screenConfig={screenConfig} onKeyPress={handleKeyPress} onFieldChange={handleFieldChange} />;
};

export default AgentSearchScreen;
