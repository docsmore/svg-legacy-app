"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ScreenConfig, ScreenField } from '@/types';

interface TerminalProps {
  screenConfig: ScreenConfig;
  onKeyPress?: (key: string) => void;
  onFieldChange?: (fieldName: string, value: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ 
  screenConfig, 
  onKeyPress, 
  onFieldChange 
}) => {
  const [cursorPosition, setCursorPosition] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [internalFields, setInternalFields] = useState<ScreenField[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Initialize internal fields and cursor position only on first render
  useEffect(() => {
    if (!isInitialized) {
      setInternalFields(screenConfig.fields);
      
      // Find the first editable field and set cursor position
      const firstEditableField = screenConfig.fields.find(field => field.isEditable);
      if (firstEditableField) {
        setCursorPosition({ 
          row: firstEditableField.row, 
          col: firstEditableField.col 
        });
      }
      
      setIsInitialized(true);
    } else {
      // Update internal fields but preserve cursor position
      setInternalFields(screenConfig.fields);
    }
  }, [screenConfig, isInitialized]);
  
  // Focus the terminal when it mounts
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle function keys (F1-F24)
    if (e.key.startsWith('F') && !isNaN(parseInt(e.key.substring(1)))) {
      e.preventDefault();
      onKeyPress?.(e.key);
      return;
    }

    // Handle special keys
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onKeyPress?.('Enter');
        break;
      case 'Escape':
        e.preventDefault();
        onKeyPress?.('Escape');
        break;
      case 'Tab':
        e.preventDefault();
        navigateToNextField();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        handleArrowKey(e.key);
        break;
      case 'Delete':
        e.preventDefault();
        handleDelete();
        break;
      case 'Backspace':
        e.preventDefault();
        handleBackspace();
        break;
      default:
        // Handle typing in editable fields
        const currentField = getCurrentEditableField();
        if (currentField && e.key.length === 1) {
          handleFieldInput(currentField, e.key);
        }
    }
  };

  const getCurrentEditableField = () => {
    return internalFields.find(
      field => 
        field.isEditable && 
        field.row === cursorPosition.row && 
        cursorPosition.col >= field.col && 
        cursorPosition.col < field.col + field.length
    );
  };

  const handleFieldInput = (field: ScreenField, key: string) => {
    const fieldValue = field.value || '';
    const cursorOffset = cursorPosition.col - field.col;
    
    // Create new value by inserting the character at cursor position
    const newValue = 
      fieldValue.substring(0, cursorOffset) + 
      key + 
      fieldValue.substring(cursorOffset);
    
    // Update the field value (truncate if necessary)
    const updatedValue = newValue.substring(0, field.length);
    
    // Update internal field state
    const updatedFields = [...internalFields];
    const fieldIndex = updatedFields.findIndex(f => 
      f.row === field.row && 
      f.col === field.col && 
      f.fieldName === field.fieldName
    );
    
    if (fieldIndex !== -1) {
      updatedFields[fieldIndex] = {
        ...field,
        value: updatedValue
      };
      setInternalFields(updatedFields);
    }
    
    // Move cursor right if within field bounds
    if (cursorPosition.col < field.col + field.length - 1) {
      setCursorPosition({
        ...cursorPosition,
        col: cursorPosition.col + 1
      });
    }
    
    // Notify parent component of field change
    if (field.fieldName) {
      onFieldChange?.(field.fieldName, updatedValue);
    }
  };

  const handleDelete = () => {
    const currentField = getCurrentEditableField();
    if (!currentField) return;
    
    const fieldValue = currentField.value || '';
    const cursorOffset = cursorPosition.col - currentField.col;
    
    // Can't delete if at the end of the field value
    if (cursorOffset >= fieldValue.length) return;
    
    // Delete character at cursor position
    const newValue = 
      fieldValue.substring(0, cursorOffset) + 
      fieldValue.substring(cursorOffset + 1);
    
    // Update internal field state
    const updatedFields = [...internalFields];
    const fieldIndex = updatedFields.findIndex(f => 
      f.row === currentField.row && 
      f.col === currentField.col && 
      f.fieldName === currentField.fieldName
    );
    
    if (fieldIndex !== -1) {
      updatedFields[fieldIndex] = {
        ...currentField,
        value: newValue
      };
      setInternalFields(updatedFields);
    }
    
    // Notify parent component of field change
    if (currentField.fieldName) {
      onFieldChange?.(currentField.fieldName, newValue);
    }
  };

  const handleBackspace = () => {
    const currentField = getCurrentEditableField();
    if (!currentField) return;
    
    const fieldValue = currentField.value || '';
    const cursorOffset = cursorPosition.col - currentField.col;
    
    // Can't backspace if at the beginning of the field
    if (cursorOffset <= 0) return;
    
    // Delete character before cursor position
    const newValue = 
      fieldValue.substring(0, cursorOffset - 1) + 
      fieldValue.substring(cursorOffset);
    
    // Update internal field state
    const updatedFields = [...internalFields];
    const fieldIndex = updatedFields.findIndex(f => 
      f.row === currentField.row && 
      f.col === currentField.col && 
      f.fieldName === currentField.fieldName
    );
    
    if (fieldIndex !== -1) {
      updatedFields[fieldIndex] = {
        ...currentField,
        value: newValue
      };
      setInternalFields(updatedFields);
    }
    
    // Move cursor left
    setCursorPosition({
      ...cursorPosition,
      col: cursorPosition.col - 1
    });
    
    // Notify parent component of field change
    if (currentField.fieldName) {
      onFieldChange?.(currentField.fieldName, newValue);
    }
  };

  const navigateToNextField = () => {
    const editableFields = internalFields.filter(field => field.isEditable);
    if (editableFields.length === 0) return;
    
    const currentField = getCurrentEditableField();
    const currentIndex = currentField 
      ? editableFields.findIndex(f => 
          f.row === currentField.row && 
          f.col === currentField.col && 
          f.fieldName === currentField.fieldName
        ) 
      : -1;
    
    const nextIndex = (currentIndex + 1) % editableFields.length;
    const nextField = editableFields[nextIndex];
    
    setCursorPosition({
      row: nextField.row,
      col: nextField.col
    });
  };

  const handleArrowKey = (key: string) => {
    const currentField = getCurrentEditableField();
    
    if (currentField) {
      const fieldStart = currentField.col;
      const fieldEnd = currentField.col + (currentField.value?.length || 0);
      
      switch (key) {
        case 'ArrowLeft':
          if (cursorPosition.col > fieldStart) {
            setCursorPosition(prev => ({ ...prev, col: prev.col - 1 }));
          }
          break;
        case 'ArrowRight':
          if (cursorPosition.col < fieldEnd) {
            setCursorPosition(prev => ({ ...prev, col: prev.col + 1 }));
          }
          break;
        case 'ArrowUp':
          // Find editable field above
          const fieldAbove = internalFields.find(f => 
            f.isEditable && 
            f.row < currentField.row &&
            f.col <= cursorPosition.col && 
            f.col + f.length > cursorPosition.col
          );
          
          if (fieldAbove) {
            setCursorPosition({
              row: fieldAbove.row,
              col: Math.min(fieldAbove.col + (fieldAbove.value?.length || 0), fieldAbove.col + fieldAbove.length - 1)
            });
          }
          break;
        case 'ArrowDown':
          // Find editable field below
          const fieldBelow = internalFields.find(f => 
            f.isEditable && 
            f.row > currentField.row &&
            f.col <= cursorPosition.col && 
            f.col + f.length > cursorPosition.col
          );
          
          if (fieldBelow) {
            setCursorPosition({
              row: fieldBelow.row,
              col: Math.min(fieldBelow.col + (fieldBelow.value?.length || 0), fieldBelow.col + fieldBelow.length - 1)
            });
          }
          break;
      }
    } else {
      // No current field, just move cursor
      switch (key) {
        case 'ArrowUp':
          setCursorPosition(prev => ({ ...prev, row: Math.max(0, prev.row - 1) }));
          break;
        case 'ArrowDown':
          setCursorPosition(prev => ({ ...prev, row: prev.row + 1 }));
          break;
        case 'ArrowLeft':
          setCursorPosition(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }));
          break;
        case 'ArrowRight':
          setCursorPosition(prev => ({ ...prev, col: prev.col + 1 }));
          break;
      }
    }
  };

  // Render terminal screen with fields
  const renderScreen = () => {
    // Create a 24x80 grid (standard AS/400 screen dimensions)
    const rows = Array(24).fill(0).map((_, rowIndex) => {
      const cols = Array(80).fill(' ');
      
      // Fill in fields
      internalFields.forEach(field => {
        if (field.row === rowIndex) {
          const value = field.value || '';
          for (let i = 0; i < field.length && i < value.length; i++) {
            cols[field.col + i] = value.charAt(i);
          }
        }
      });
      
      return cols;
    });
    
    // Render rows
    return rows.map((cols, rowIndex) => (
      <div key={`row-${rowIndex}`} className="terminal-row">
        {cols.map((char, colIndex) => {
          // Check if this position has a field
          const field = internalFields.find(
            f => f.row === rowIndex && colIndex >= f.col && colIndex < f.col + f.length
          );
          
          // Determine if this is the cursor position
          const isCursor = rowIndex === cursorPosition.row && colIndex === cursorPosition.col;
          
          // Determine cell classes
          const cellClasses = [
            'terminal-cell',
            field?.isHighlighted ? 'highlighted' : '',
            field?.isEditable ? 'editable' : '',
            isCursor ? 'cursor' : ''
          ].filter(Boolean).join(' ');
          
          return (
            <span key={`cell-${rowIndex}-${colIndex}`} className={cellClasses}>
              {char}
            </span>
          );
        })}
      </div>
    ));
  };

  return (
    <div 
      ref={terminalRef}
      className="terminal-container" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      <div className="terminal-header">
        {screenConfig.title || 'AS/400 Terminal'}
      </div>
      <div className="terminal-screen">
        {renderScreen()}
      </div>
      <div className="terminal-footer">
        <div className="function-keys">
          {screenConfig.functionKeys?.map((fKey, index) => (
            <div key={`fkey-${index}`} className="function-key">
              <span className="key-label">{fKey.key}</span>
              <span className="key-desc">{fKey.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
