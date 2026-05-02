"use client";

import React, { useState } from 'react';

interface EmulatorToolbarProps {
  onAction?: (action: string) => void;
  isConnected?: boolean;
}

const EmulatorToolbar: React.FC<EmulatorToolbarProps> = ({ onAction, isConnected = true }) => {
  const [showKeypad, setShowKeypad] = useState(false);

  const toolbarButtons = [
    { id: 'connect', icon: '🔌', label: 'Connect', tooltip: 'Connect to Host (Ctrl+Shift+C)', disabled: isConnected },
    { id: 'disconnect', icon: '⛔', label: 'Disconnect', tooltip: 'Disconnect Session', disabled: !isConnected },
    { id: 'separator1', separator: true },
    { id: 'copy', icon: '📋', label: 'Copy', tooltip: 'Copy Selection (Ctrl+C)' },
    { id: 'paste', icon: '📥', label: 'Paste', tooltip: 'Paste (Ctrl+V)' },
    { id: 'separator2', separator: true },
    { id: 'print', icon: '🖨️', label: 'Print', tooltip: 'Print Screen (Ctrl+P)' },
    { id: 'capture', icon: '📷', label: 'Capture', tooltip: 'Screen Capture' },
    { id: 'separator3', separator: true },
    { id: 'macro-record', icon: '⏺️', label: 'Record', tooltip: 'Record Macro (Ctrl+M)' },
    { id: 'macro-play', icon: '▶️', label: 'Play', tooltip: 'Play Macro (Ctrl+Shift+M)' },
    { id: 'separator4', separator: true },
    { id: 'keypad', icon: '⌨️', label: 'Keypad', tooltip: 'Show Function Keypad' },
    { id: 'transfer', icon: '📁', label: 'Transfer', tooltip: 'Data Transfer Wizard' },
    { id: 'separator5', separator: true },
    { id: 'sysreq', icon: '⚡', label: 'SysReq', tooltip: 'System Request (Shift+Esc)' },
    { id: 'attn', icon: '🔔', label: 'Attn', tooltip: 'Attention Key (Esc)' },
    { id: 'reset', icon: '🔄', label: 'Reset', tooltip: 'Reset (Ctrl+R)' },
  ];

  const keypadKeys = [
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
    ['F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['F13', 'F14', 'F15', 'F16', 'F17', 'F18'],
    ['F19', 'F20', 'F21', 'F22', 'F23', 'F24'],
    ['Enter', 'Field Exit', 'Field+', 'Dup', 'Field-', 'Erase Input'],
    ['PA1', 'PA2', 'PA3', 'Attn', 'SysReq', 'Reset'],
  ];

  return (
    <div className="emulator-toolbar-container">
      <div className="emulator-toolbar">
        {toolbarButtons.map((btn) => {
          if (btn.separator) {
            return <div key={btn.id} className="emulator-toolbar-separator" />;
          }
          return (
            <button
              key={btn.id}
              className={`emulator-toolbar-btn ${btn.disabled ? 'disabled' : ''}`}
              title={btn.tooltip}
              disabled={btn.disabled}
              onClick={() => {
                if (btn.id === 'keypad') {
                  setShowKeypad(!showKeypad);
                } else {
                  onAction?.(btn.id);
                }
              }}
            >
              <span className="emulator-toolbar-btn-icon">{btn.icon}</span>
              <span className="emulator-toolbar-btn-label">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {showKeypad && (
        <div className="emulator-keypad-overlay">
          <div className="emulator-keypad">
            <div className="emulator-keypad-header">
              <span>Function Keypad</span>
              <button
                className="emulator-keypad-close"
                onClick={() => setShowKeypad(false)}
              >
                ✕
              </button>
            </div>
            <div className="emulator-keypad-grid">
              {keypadKeys.map((row, rowIdx) => (
                <div key={`krow-${rowIdx}`} className="emulator-keypad-row">
                  {row.map((key) => (
                    <button
                      key={key}
                      className="emulator-keypad-key"
                      onClick={() => onAction?.(`keypad-${key}`)}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmulatorToolbar;
