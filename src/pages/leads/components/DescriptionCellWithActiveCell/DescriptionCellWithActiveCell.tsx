import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DROPDOWN_HEIGHT = 150; // px

// Utility to hide @@id parts for display



interface DescriptionCellProps {  value?: string;
  onChange?: (value: string, leadid: string | number, mentionedUserIds: string[]) => void;
  leadid?: string | number;
  assigneeOptions?: { id: string | number; label: string; value: any }[];
  activeCell?: boolean;

};

const DescriptionCellWithActiveCell = ({ value = '', onChange, leadid, assigneeOptions = [], customIsEdited, activeCell }: any) => {
  const [isEditing, setIsEditing] = useState(false);

 useEffect(() => {
   
    if (activeCell) {
      setIsEditing(true);
    }
  }, [activeCell]);

 

  const [inputValue, setInputValue] = useState(value);


  useEffect(() => {
  setInputValue(value);
}, [value]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, above: false });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ignoreBlurRef = useRef(false);


  const filteredOptions = useMemo(() => {
  if (!showDropdown) return [];
  // Find the last @ and get the text after it
  const cursorPos = inputRef.current?.selectionStart || inputValue.length;
  const textBeforeCursor = inputValue.slice(0, cursorPos);
  const match = textBeforeCursor.match(/@([^@\s]*)$/);
  const search = match ? match[1].toLowerCase() : '';
  if (!search) return assigneeOptions;
  return assigneeOptions.filter((option: any) =>
    option.label.toLowerCase().includes(search)
  );
}, [showDropdown, inputValue, assigneeOptions]);
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

    // Auto-resize on change
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    if (matches) {
      setShowDropdown(true);
      setSearchText(matches[1] || '');
      showDropdownDynamic();
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
    const textBeforeCursor = inputValue.slice(0, cursorPos);
    // Find the last @ and the text after it
    const match = textBeforeCursor.match(/@([^@\s]*)$/);
    let before = inputValue;
    let after = '';
    if (match) {
      // Replace the partial mention with the selected member
      const atIndex = textBeforeCursor.lastIndexOf('@');
      before = inputValue.slice(0, atIndex);
      after = inputValue.slice(cursorPos);
    }
    const newValue = `${before}@${member.label} ${after}`;

    setMentionedUserIds(prev =>
      prev.includes(member.value) ? prev : [...prev, member.value]
    );
    setInputValue(newValue);
    setShowDropdown(false);
    setTimeout(() => {
      input.focus();
      // Place cursor after the inserted mention
      const pos = (before + '@' + member.label + ' ').length;
      input.setSelectionRange(pos, pos);
    }, 0);


    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 0);
  };

  // Reset highlight when dropdown or options change
  useEffect(() => {
    if (showDropdown) setHighlightedIndex(0);
  }, [showDropdown, filteredOptions.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showDropdown && filteredOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % filteredOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + filteredOptions.length) % filteredOptions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectMember(filteredOptions[highlightedIndex]);
        }
      }
      return;
    }
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
    console.log('DescriptionCellWithActiveCell blurred', isEditing);
    if (ignoreBlurRef.current) return; // Ignore blur if selecting member
    console.log('Saving on blur', isEditing);
    setIsEditing(false);

  };

  useEffect(() => {
  if (isEditing && inputRef.current) {
    inputRef.current.focus();
    // Place cursor at the end
    const length = inputRef.current.value.length;
    inputRef.current.setSelectionRange(length, length);
    // Auto-resize on edit start
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }
}, [isEditing]);

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
            style={{
              width: '100%',
              background: '#202020',
              color: 'white',
              minHeight: 40,
              borderRadius: 4,
               borderColor: "#1890ff",
               outline: "1px solid #1890ff", // blue outline
              fontSize: 14,
              lineHeight: 1.4,

              resize: 'none', // Prevent manual resize
              fontFamily: 'sans-serif',
              overflow: 'hidden'
            }}
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
              {filteredOptions.map((member: any, i: number) => (
                <div
                  key={member.value}
                  style={{
                    padding: 8,
                    cursor: 'pointer',
                    color: 'white',
                    background: i === highlightedIndex ? '#444' : undefined,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectMember(member);
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  {member.label}
                </div>
              ))}
            </div>,
            document.body
          )}
        </>
      ) : (
        
        value ? (
       <span
  style={{ whiteSpace: 'pre-line', cursor: 'pointer', display: 'block' }}
  onClick={e => {
    // Only trigger edit if not clicking a link
    if ((e.target as HTMLElement).tagName !== 'A') setIsEditing(true);
  }}
  dangerouslySetInnerHTML={{
    __html:
      (value || "Add a description ...").replace(
        /((https?:\/\/|www\.)[^\s]+)/g,
        (url: any) => {
          const href = url.startsWith('http') ? url : `https://${url}`;
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#4fa3ff;text-decoration:underline;">${url}</a>`;
        }
      )
  }}
/>
         ) : ( 
           <span
          style={{ whiteSpace: 'pre-line', cursor: 'pointer', display: 'block' }}
          onClick={() => setIsEditing(true)}
          
        >
          {value || "Add a description ..."}
        </span>

        )
       
      )}
    </div>
  );
};

export default DescriptionCellWithActiveCell;