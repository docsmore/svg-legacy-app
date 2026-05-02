"use client";

import React from 'react';

interface Session {
  id: string;
  name: string;
  host: string;
  isActive: boolean;
  isConnected: boolean;
  type: string;
}

interface SessionTabsProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession?: (sessionId: string) => void;
  onCloseSession?: (sessionId: string) => void;
  onNewSession?: () => void;
}

const SessionTabs: React.FC<SessionTabsProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCloseSession,
  onNewSession,
}) => {
  return (
    <div className="emulator-session-tabs">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`emulator-session-tab ${session.id === activeSessionId ? 'active' : ''}`}
          onClick={() => onSelectSession?.(session.id)}
        >
          <span className={`emulator-session-dot ${session.isConnected ? 'connected' : 'disconnected'}`} />
          <span className="emulator-session-tab-name">{session.name}</span>
          <span className="emulator-session-tab-host">({session.host})</span>
          <button
            className="emulator-session-tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onCloseSession?.(session.id);
            }}
            title="Close Session"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        className="emulator-session-tab-new"
        onClick={onNewSession}
        title="New Session"
      >
        +
      </button>
    </div>
  );
};

export default SessionTabs;
