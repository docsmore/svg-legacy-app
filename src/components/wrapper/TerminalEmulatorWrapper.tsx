"use client";

import React, { useState, useCallback, useEffect } from 'react';
import EmulatorMenuBar from './EmulatorMenuBar';
import EmulatorToolbar from './EmulatorToolbar';
import EmulatorStatusBar from './EmulatorStatusBar';
import SessionTabs from './SessionTabs';

interface TerminalEmulatorWrapperProps {
  children: React.ReactNode;
}

const TerminalEmulatorWrapper: React.FC<TerminalEmulatorWrapperProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('session-a');
  const [sessions] = useState([
    { id: 'session-a', name: 'Session A', host: 'PROD-AS400-A', isActive: true, isConnected: true, type: 'TN5250E' },
    { id: 'session-b', name: 'Session B', host: 'DEV-AS400-B', isActive: false, isConnected: true, type: 'TN5250E' },
    { id: 'session-c', name: 'Printer', host: 'PRT01', isActive: false, isConnected: false, type: 'TN5250P' },
  ]);

  // Boot sequence simulation
  useEffect(() => {
    const bootSequence = [
      'iAccess Terminal Emulator v7.2.1 Build 4851',
      'Copyright (c) 2024 Enterprise Terminal Solutions',
      '',
      'Initializing TN5250E protocol handler...',
      'Loading keyboard map: US-EN Standard (QWERTY)',
      'SSL/TLS library: OpenSSL 3.0.13',
      'Certificate store: /etc/ssl/certs/enterprise-ca.pem',
      '',
      'Connecting to host PROD-AS400-A (10.45.12.100:23)...',
      'TLS 1.2 handshake... OK',
      'Server certificate verified: CN=as400-prod.enterprise.local',
      'Cipher: ECDHE-RSA-AES256-GCM-SHA384',
      'Terminal type negotiation: IBM-3179-2 (24x80)',
      'Device name assigned: QPADEV0042',
      '',
      'Connection established.',
      'Session A ready.',
      '',
    ];

    let lineIndex = 0;
    const timer = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(timer);
        setTimeout(() => setIsBooting(false), 600);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const handleMenuAction = useCallback((action: string) => {
    switch (action) {
      case 'connect':
        setShowConnectDialog(true);
        break;
      case 'disconnect':
        setIsConnected(false);
        break;
      case 'about':
        setShowAbout(true);
        break;
    }
  }, []);

  const handleToolbarAction = useCallback((action: string) => {
    switch (action) {
      case 'connect':
        setShowConnectDialog(true);
        break;
      case 'disconnect':
        setIsConnected(false);
        break;
    }
  }, []);

  return (
    <div className="emulator-wrapper">
      {/* Title bar */}
      <div className="emulator-titlebar">
        <div className="emulator-titlebar-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="2" fill="#1a6b1a" stroke="#33cc33" strokeWidth="0.5"/>
            <text x="4" y="12" fill="#33cc33" fontSize="10" fontFamily="monospace" fontWeight="bold">&gt;_</text>
          </svg>
        </div>
        <span className="emulator-titlebar-text">
          iAccess Terminal — Session A — PROD-AS400-A (10.45.12.100) — TN5250E — 24x80 — QPADEV0042
        </span>
        <div className="emulator-titlebar-controls">
          <button className="emulator-titlebar-btn minimize" title="Minimize">─</button>
          <button className="emulator-titlebar-btn maximize" title="Maximize">□</button>
          <button className="emulator-titlebar-btn close" title="Close">✕</button>
        </div>
      </div>

      {/* Menu Bar */}
      <EmulatorMenuBar onAction={handleMenuAction} />

      {/* Toolbar */}
      <EmulatorToolbar onAction={handleToolbarAction} isConnected={isConnected} />

      {/* Session Tabs */}
      <SessionTabs
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
      />

      {/* Main terminal area */}
      <div className="emulator-terminal-area">
        {isBooting ? (
          <div className="emulator-boot-screen">
            {bootLines.map((line, idx) => (
              <div key={idx} className="emulator-boot-line">{line}</div>
            ))}
            <span className="emulator-boot-cursor">█</span>
          </div>
        ) : !isConnected ? (
          <div className="emulator-disconnected-screen">
            <div className="emulator-disconnected-icon">⚠</div>
            <div className="emulator-disconnected-title">SESSION DISCONNECTED</div>
            <div className="emulator-disconnected-text">
              Connection to PROD-AS400-A (10.45.12.100) lost.<br />
              Use Session &gt; Connect or press Ctrl+Shift+C to reconnect.
            </div>
            <button
              className="emulator-reconnect-btn"
              onClick={() => setIsConnected(true)}
            >
              Reconnect
            </button>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Status Bar */}
      <EmulatorStatusBar isConnected={isConnected} />

      {/* About Dialog */}
      {showAbout && (
        <div className="emulator-dialog-overlay" onClick={() => setShowAbout(false)}>
          <div className="emulator-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="emulator-dialog-titlebar">
              <span>About iAccess Terminal</span>
              <button onClick={() => setShowAbout(false)}>✕</button>
            </div>
            <div className="emulator-dialog-body">
              <div className="emulator-about-logo">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="2" y="2" width="60" height="60" rx="8" fill="#0a2a0a" stroke="#33cc33" strokeWidth="2"/>
                  <text x="12" y="44" fill="#33cc33" fontSize="36" fontFamily="monospace" fontWeight="bold">&gt;_</text>
                </svg>
              </div>
              <div className="emulator-about-text">
                <h3>iAccess Terminal Emulator</h3>
                <p>Version 7.2.1 (Build 4851)</p>
                <p>TN5250E / TN3270E / VT Terminal Emulator</p>
                <br />
                <p style={{ fontSize: '11px', color: '#888' }}>
                  Copyright &copy; 2024 Enterprise Terminal Solutions<br />
                  All rights reserved.<br /><br />
                  Licensed to: Solvrays Insurance Corp.<br />
                  License: ENT-5250-2024-SLV-001<br />
                  Seats: 250 / 250 active<br /><br />
                  Java Runtime: OpenJDK 17.0.10<br />
                  SSL/TLS: OpenSSL 3.0.13<br />
                  Protocol: RFC 4777 (TN5250E)
                </p>
              </div>
            </div>
            <div className="emulator-dialog-footer">
              <button className="emulator-dialog-btn" onClick={() => setShowAbout(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Dialog */}
      {showConnectDialog && (
        <div className="emulator-dialog-overlay" onClick={() => setShowConnectDialog(false)}>
          <div className="emulator-dialog emulator-dialog-wide" onClick={(e) => e.stopPropagation()}>
            <div className="emulator-dialog-titlebar">
              <span>Connect to Host</span>
              <button onClick={() => setShowConnectDialog(false)}>✕</button>
            </div>
            <div className="emulator-dialog-body">
              <div className="emulator-connect-form">
                <div className="emulator-form-row">
                  <label>Host Address:</label>
                  <input type="text" defaultValue="10.45.12.100" className="emulator-form-input" />
                </div>
                <div className="emulator-form-row">
                  <label>Port:</label>
                  <input type="text" defaultValue="23" className="emulator-form-input emulator-form-input-sm" />
                </div>
                <div className="emulator-form-row">
                  <label>Connection Type:</label>
                  <select className="emulator-form-select">
                    <option>TN5250E (AS/400 - iSeries)</option>
                    <option>TN3270E (Mainframe - zSeries)</option>
                    <option>VT220/VT320</option>
                    <option>SSH</option>
                  </select>
                </div>
                <div className="emulator-form-row">
                  <label>Device Name:</label>
                  <input type="text" defaultValue="" placeholder="Auto-assign" className="emulator-form-input" />
                </div>
                <div className="emulator-form-row">
                  <label>SSL/TLS:</label>
                  <select className="emulator-form-select">
                    <option>TLS 1.2 (Recommended)</option>
                    <option>TLS 1.3</option>
                    <option>SSL 3.0 (Legacy)</option>
                    <option>None (Insecure)</option>
                  </select>
                </div>
                <div className="emulator-form-row">
                  <label>Code Page:</label>
                  <select className="emulator-form-select">
                    <option>037 - US/Canada EBCDIC</option>
                    <option>273 - Germany</option>
                    <option>277 - Denmark/Norway</option>
                    <option>500 - International</option>
                    <option>1140 - US/Canada w/ Euro</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="emulator-dialog-footer">
              <button
                className="emulator-dialog-btn emulator-dialog-btn-primary"
                onClick={() => {
                  setIsConnected(true);
                  setShowConnectDialog(false);
                }}
              >
                Connect
              </button>
              <button className="emulator-dialog-btn" onClick={() => setShowConnectDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalEmulatorWrapper;
