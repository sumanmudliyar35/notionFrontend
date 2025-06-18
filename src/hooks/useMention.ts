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
    if (!searchText) return options;
    const search = searchText.replace('@', '').toLowerCase();
    return options.filter((option: any) => option.label.toLowerCase().includes(search));
  }, [searchText, options]);

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
    const matches = textBeforeCursor.match(/@([^@\s]*)$/);

    if (val[cursorPos - 1] === '@') {
      setShowDropdown(true);
      showDropdownDynamic();
      setSearchText(matches ? matches[0] : '');
    } else {
      setShowDropdown(false);
      setSearchText('');
    }
  };

  const handleSelectMember = (member: any) => {
    ignoreBlurRef.current = true;
    if (!inputRef.current) return;
    const input = inputRef.current;
    const cursorPos = input.selectionStart || 0;
    const before = inputValue.slice(0, cursorPos - 1); // remove '@'
    const after = inputValue.slice(cursorPos);
    const newValue = `${before}@${member.label} ${after}`;

    setMentionedUserIds((prev) => (prev.includes(member.value) ? prev : [...prev, member.value]));
    setInputValue(newValue);
    setShowDropdown(false);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(before.length + member.label.length + 2, before.length + member.label.length + 2);
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