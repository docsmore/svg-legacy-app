"use client";

import React, { useState, useEffect } from 'react';

interface EmulatorStatusBarProps {
  isConnected?: boolean;
  sessionName?: string;
  hostAddress?: string;
  cursorRow?: number;
  cursorCol?: number;
  isKeyboardLocked?: boolean;
}

const EmulatorStatusBar: React.FC<EmulatorStatusBarProps> = ({
  isConnected = true,
  sessionName = 'Session A',
  hostAddress = '10.45.12.100',
  cursorRow = 1,
  cursorCol = 1,
  isKeyboardLocked = false,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour12: false })
      );

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      setElapsedTime(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="emulator-statusbar">
      {/* Connection indicator */}
      <div className="emulator-status-section emulator-status-connection">
        <span className={`emulator-status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
        <span className="emulator-status-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Session info */}
      <div className="emulator-status-section">
        <span className="emulator-status-label">Session:</span>
        <span className="emulator-status-value">{sessionName}</span>
      </div>

      {/* Host */}
      <div className="emulator-status-section">
        <span className="emulator-status-label">Host:</span>
        <span className="emulator-status-value">{hostAddress}</span>
      </div>

      {/* Emulation type */}
      <div className="emulator-status-section">
        <span className="emulator-status-label">Type:</span>
        <span className="emulator-status-value">TN5250E</span>
      </div>

      {/* Cursor position */}
      <div className="emulator-status-section">
        <span className="emulator-status-label">Pos:</span>
        <span className="emulator-status-value">
          {String(cursorRow).padStart(2, '0')}/{String(cursorCol).padStart(3, '0')}
        </span>
      </div>

      {/* Screen size */}
      <div className="emulator-status-section">
        <span className="emulator-status-value">24x80</span>
      </div>

      {/* Keyboard state */}
      <div className="emulator-status-section">
        {isKeyboardLocked ? (
          <span className="emulator-status-kbd-locked">X SYSTEM</span>
        ) : (
          <span className="emulator-status-kbd-ready">KB OK</span>
        )}
      </div>

      {/* Encryption */}
      <div className="emulator-status-section">
        <span className="emulator-status-value emulator-status-ssl">🔒 TLS 1.2</span>
      </div>

      {/* Elapsed time */}
      <div className="emulator-status-section">
        <span className="emulator-status-label">Elapsed:</span>
        <span className="emulator-status-value">{elapsedTime}</span>
      </div>

      {/* Clock */}
      <div className="emulator-status-section emulator-status-clock">
        <span className="emulator-status-value">{currentTime}</span>
      </div>
    </div>
  );
};

export default EmulatorStatusBar;
