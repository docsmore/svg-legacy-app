"use client";

import React, { useState, useRef, useEffect } from 'react';

interface MenuItem {
  label: string;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  submenu?: MenuItem[];
  action?: () => void;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface EmulatorMenuBarProps {
  onAction?: (action: string) => void;
}

const EmulatorMenuBar: React.FC<EmulatorMenuBarProps> = ({ onAction }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: MenuGroup[] = [
    {
      label: 'Session',
      items: [
        { label: 'Connect...', shortcut: 'Ctrl+Shift+C', action: () => onAction?.('connect') },
        { label: 'Disconnect', shortcut: 'Ctrl+Shift+D', disabled: false, action: () => onAction?.('disconnect') },
        { label: 'divider', divider: true },
        { label: 'New Session', shortcut: 'Ctrl+N' },
        { label: 'Open Session...', shortcut: 'Ctrl+O' },
        { label: 'Save Session', shortcut: 'Ctrl+S' },
        { label: 'Save Session As...' },
        { label: 'divider', divider: true },
        { label: 'Print Screen', shortcut: 'Ctrl+P' },
        { label: 'Print Setup...' },
        { label: 'divider', divider: true },
        { label: 'Recent Sessions', submenu: [
          { label: '1. PROD-AS400-A  (10.45.12.100)' },
          { label: '2. DEV-AS400-B   (10.45.12.101)' },
          { label: '3. TEST-AS400-C  (10.45.12.102)' },
        ]},
        { label: 'divider', divider: true },
        { label: 'Exit', shortcut: 'Alt+F4' },
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' },
        { label: 'Copy & Paste' },
        { label: 'divider', divider: true },
        { label: 'Select All', shortcut: 'Ctrl+A' },
        { label: 'Select Rectangle' },
        { label: 'Unselect' },
        { label: 'divider', divider: true },
        { label: 'Find/Replace...', shortcut: 'Ctrl+F' },
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Toolbar', shortcut: '' },
        { label: 'Status Bar' },
        { label: 'Session Tabs' },
        { label: 'divider', divider: true },
        { label: 'Font Size', submenu: [
          { label: '10px' },
          { label: '12px' },
          { label: '14px' },
          { label: '16px' },
          { label: '18px' },
        ]},
        { label: 'Color Scheme', submenu: [
          { label: 'Classic Green on Black', action: () => onAction?.('theme-classic') },
          { label: 'White on Black' },
          { label: 'Amber on Black' },
          { label: 'Blue on White (SNA)' },
        ]},
        { label: 'divider', divider: true },
        { label: 'Full Screen', shortcut: 'Alt+Enter' },
        { label: 'Zoom In', shortcut: 'Ctrl+=' },
        { label: 'Zoom Out', shortcut: 'Ctrl+-' },
      ]
    },
    {
      label: 'Communication',
      items: [
        { label: 'TN5250 Settings...' },
        { label: 'SSL/TLS Configuration...' },
        { label: 'Host Entry...' },
        { label: 'divider', divider: true },
        { label: 'Connection Type', submenu: [
          { label: 'TN5250E (AS/400)' },
          { label: 'TN3270E (Mainframe)' },
          { label: 'VT220/VT320' },
        ]},
        { label: 'divider', divider: true },
        { label: 'Trace Connection...' },
      ]
    },
    {
      label: 'Actions',
      items: [
        { label: 'Record Macro...', shortcut: 'Ctrl+M' },
        { label: 'Play Macro...', shortcut: 'Ctrl+Shift+M' },
        { label: 'divider', divider: true },
        { label: 'Send System Request', shortcut: 'Shift+Esc' },
        { label: 'Attention (ATTN)', shortcut: 'Esc' },
        { label: 'Reset', shortcut: 'Ctrl+R' },
        { label: 'divider', divider: true },
        { label: 'Run Script...' },
        { label: 'Script Editor...' },
      ]
    },
    {
      label: 'Options',
      items: [
        { label: 'Session Properties...' },
        { label: 'Global Preferences...' },
        { label: 'Keyboard Map...', action: () => onAction?.('keymap') },
        { label: 'Hotspots...' },
        { label: 'divider', divider: true },
        { label: 'Auto-Login Configuration...' },
        { label: 'Macro Manager...' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: 'Data Transfer Wizard...' },
        { label: 'File Transfer (IFS)...' },
        { label: 'Printer Session...' },
        { label: 'divider', divider: true },
        { label: 'Key Learner' },
        { label: 'Screen Capture...' },
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Terminal Emulator Help', shortcut: 'F1' },
        { label: 'Keyboard Shortcuts...' },
        { label: 'divider', divider: true },
        { label: 'Check for Updates...' },
        { label: 'License Information...' },
        { label: 'divider', divider: true },
        { label: 'About iAccess Terminal', action: () => onAction?.('about') },
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, idx: number) => {
    if (item.divider) {
      return <div key={`div-${idx}`} className="emulator-menu-divider" />;
    }

    return (
      <div
        key={`item-${idx}`}
        className={`emulator-menu-item ${item.disabled ? 'disabled' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!item.disabled) {
            item.action?.();
            setActiveMenu(null);
          }
        }}
      >
        <span className="emulator-menu-item-label">{item.label}</span>
        {item.shortcut && <span className="emulator-menu-item-shortcut">{item.shortcut}</span>}
        {item.submenu && <span className="emulator-menu-item-arrow">&#9656;</span>}
      </div>
    );
  };

  return (
    <div ref={menuBarRef} className="emulator-menubar">
      {menus.map((menu) => (
        <div
          key={menu.label}
          className={`emulator-menubar-item ${activeMenu === menu.label ? 'active' : ''}`}
          onMouseDown={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
          onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
        >
          <span className="emulator-menubar-label">{menu.label}</span>
          {activeMenu === menu.label && (
            <div className="emulator-menu-dropdown">
              {menu.items.map((item, idx) => renderMenuItem(item, idx))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmulatorMenuBar;
