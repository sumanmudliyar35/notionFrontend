import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DROPDOWN_HEIGHT = 150; // px

// Utility to hide @@id parts for display





const DescriptionCell = ({ value = '', onChange, leadid, assigneeOptions = [] }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, above: false });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ignoreBlurRef = useRef(false);


  const filteredOptions = useMemo(() => {
  if (!searchText) return assigneeOptions;
  const search = searchText.replace('@', '').toLowerCase();
  return assigneeOptions.filter((option: any) => 
    option.label.toLowerCase().includes(search)
  );
}, [searchText, assigneeOptions]);
  // Calculate dropdown position dynamically
  const showDropdownDynamic = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let above = false;
      let top = rect.bottom;
      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > DROPDOWN_HEIGHT) {
        // Not enough space below, but enough above: show above
        above = true;
        top = rect.top - DROPDOWN_HEIGHT;
      }
      setDropdownPos({
        top,
        left: rect.left,
        width: rect.width,
        above,
      });
    }
  };

  // Show dropdown when "@" is typed
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const cursorPos = e.target.selectionStart || 0;
      const textBeforeCursor = val.slice(0, cursorPos);
    const matches = textBeforeCursor.match(/@([^@\s]*)$/);


    if (val[cursorPos - 1] === '@') {
      setShowDropdown(true);
      showDropdownDynamic();
          setSearchText(matches ? matches[0] : ''); // includes the @

    } else {
      setShowDropdown(false);
          setSearchText('');

    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);


  const handleSelectMember = (member: any) => {
    ignoreBlurRef.current = true;
    if (!inputRef.current) return;
    const input = inputRef.current;
    const cursorPos = input.selectionStart || 0;
    const before = inputValue.slice(0, cursorPos - 1); // remove '@'
    const after = inputValue.slice(cursorPos);
    const newValue = `${before}@${member.label} ${after}`;

    setMentionedUserIds(prev =>
    prev.includes(member.value) ? prev : [...prev, member.value]
  );
    setInputValue(newValue);
    setShowDropdown(false);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(before.length + member.label.length + 2, before.length + member.label.length + 2);
    }, 0);


    // if (onChange) onChange(newValue, leadid);
    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Insert newline
        const input = inputRef.current;
        if (input) {
          const cursorPos = input.selectionStart || 0;
          const before = inputValue.slice(0, cursorPos);
          const after = inputValue.slice(cursorPos);
          const newValue = before + '\n' + after;
          setInputValue(newValue);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(cursorPos + 1, cursorPos + 1);
          }, 0);
        }
        e.preventDefault();
      } else {
        // Save and exit
        setIsEditing(false);
        if (onChange) onChange(inputValue, leadid, mentionedUserIds);
        e.preventDefault();
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) onChange(inputValue, leadid, mentionedUserIds);
  };

  const handleBlur = () => {
    console.log('DescriptionCell blurred', isEditing);
    if (ignoreBlurRef.current) return; // Ignore blur if selecting member
    console.log('Saving on blur', isEditing);
    setIsEditing(false);

  };

  return (
    <div style={{ minHeight: 24, position: 'relative' }}>
      {isEditing ? (
        <>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ width: '100%', background: '#202020', color: 'white', minHeight: 40, resize: 'vertical', fontFamily: 'sans-serif' }}
          />
          {showDropdown && createPortal(
            <div
              style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                background: '#222',
                zIndex: 2200,
                border: '1px solid #444',
                maxHeight: DROPDOWN_HEIGHT,
                overflowY: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {filteredOptions.map((member: any) => (
                <div
                  key={member.value}
                  style={{ padding: 8, cursor: 'pointer', color: 'white' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectMember(member);
                  }}
                >
                  {member.label}
                </div>
              ))}
            </div>,
            document.body
          )}
        </>
      ) : (
        <span
          style={{ whiteSpace: 'pre-line', cursor: 'pointer', display: 'block' }}
          onClick={() => setIsEditing(true)}
        >
          {value || "Add a description ..."}
        </span>
      )}
    </div>
  );
};

export default DescriptionCell;