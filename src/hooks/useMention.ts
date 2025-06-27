import { useState, useRef, useMemo } from 'react';

const DROPDOWN_HEIGHT = 150; // px

export const useMention = (options: any[], initialValues: any) => {
  const [inputValue, setInputValue] = useState(initialValues || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, above: false });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ignoreBlurRef = useRef(false);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);

  const filteredOptions = useMemo(() => {
    if (!showDropdown) return [];
    // Find the last @ and get the text after it
    const cursorPos = inputRef.current?.selectionStart || inputValue.length;
    const textBeforeCursor = inputValue.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@([^@\s]*)$/);
    const search = match ? match[1].toLowerCase() : '';
    if (!search) return options;
    return options.filter((option: any) =>
      option.label.toLowerCase().includes(search)
    );
  }, [showDropdown, inputValue, options]);

  const showDropdownDynamic = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let above = false;
      let top = rect.bottom;
      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > DROPDOWN_HEIGHT) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@([^@\s]*)$/);

    if (match) {
      setShowDropdown(true);
      showDropdownDynamic();
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectMember = (member: any) => {
    ignoreBlurRef.current = true;
    if (!inputRef.current) return;
    const input = inputRef.current;
    const cursorPos = input.selectionStart || 0;
    const textBeforeCursor = inputValue.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@([^@\s]*)$/);

    let before = inputValue;
    let after = '';
    if (match) {
      const atIndex = textBeforeCursor.lastIndexOf('@');
      before = inputValue.slice(0, atIndex);
      after = inputValue.slice(cursorPos);
    }
    const newValue = `${before}@${member.label} ${after}`;

    setMentionedUserIds((prev) =>
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

  return {
    inputValue,
    setInputValue,
    showDropdown,
    dropdownPos,
    filteredOptions,
    inputRef,
    handleInputChange,
    handleSelectMember,
    mentionedUserIds,
    ignoreBlurRef,
  };
};