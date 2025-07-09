import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface Tag {
  id: string | number;
  label: string;
  color?: string;
}

interface TagSelectorProps {
  options: Tag[];
  value?: string | number | null;
  onChange: (id: string | number | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
  horizontalOptions?: boolean; // <-- Add this prop
  isWithDot?: boolean; // <-- Add this prop for color dot
}

const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder,
  allowCreate = true,
  horizontalOptions = false, // <-- Default to false
  isWithDot = false, // <-- Default to true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTag = options.find(opt => opt.id === value);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Dynamically set dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 260; // Estimate: input + optionsList
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleTagSelect = (tag: Tag) => {
    onChange(tag.id);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    // Generate a unique ID (in a real app, this might come from the backend)
    const newId = `new-${Date.now()}`;
    // Create new tag with the search term
    onChange(newId);
    setSearchTerm('');
    setIsOpen(false);
  };

  const hasExactMatch = filteredOptions.some(
    opt => opt.label.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <Container ref={containerRef}>
      <SelectedTag 
        onClick={() => setIsOpen(!isOpen)}
        isPlaceholder={!selectedTag}
      >
        {selectedTag ? (
          <>
            {isWithDot && <ColorDot color={selectedTag.color || getTagColor(selectedTag.label)} />}
            <span>{selectedTag.label}</span>
          </>
        ) : (
          placeholder
        )}
        {/* <DropdownIcon isOpen={isOpen}>▾</DropdownIcon> */}
      </SelectedTag>
      
      {isOpen && (
        <DropdownContainer $position={dropdownPosition}>
          <SearchInput 
            ref={inputRef}
            type="text" 
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <OptionsList $horizontal={horizontalOptions}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(tag => (
                <Option 
                  key={tag.id} 
                  onClick={() => handleTagSelect(tag)}
                  isSelected={tag.id === value}
                >
                  {isWithDot && <ColorDot color={tag.color || getTagColor(tag.label)} />}
                  {tag.label}
                </Option>
              ))
            ) : (
              <NoResults>No tags found</NoResults>
            )}
            
            {allowCreate && searchTerm && !hasExactMatch && (
              <CreateOption onClick={handleCreateNew}>
                + Create "{searchTerm}"
              </CreateOption>
            )}
          </OptionsList>
        </DropdownContainer>
      )}
    </Container>
  );
};

// Helper function to generate consistent colors from strings
const getTagColor = (text: string): string => {
  const colors = [
    '#5E81AC', // Blue
    '#A3BE8C', // Green
    '#B48EAD', // Purple
    '#D08770', // Orange
    '#EBCB8B', // Yellow
    '#BF616A', // Red
    '#88C0D0', // Light blue
    '#8FBCBB', // Teal
  ];
  
  // Generate a hash from the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to select a color
  return colors[Math.abs(hash) % colors.length];
};

// Styled components
const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  font-family:  sans-serif;
`;

const SelectedTag = styled.div<{ isPlaceholder: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: #191919
;
  // border: 1px solid #3B4252;
  cursor: pointer;
  color: ${props => props.isPlaceholder ? '#6C7A96' : '#E5E9F0'};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #191919;
    background-color: #191919
;
  }
`;

const ColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0;
`;

const DropdownIcon = styled.span<{ isOpen: boolean }>`
  margin-left: auto;
  color: #6C7A96;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

const DropdownContainer = styled.div<{ $position?: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  width: 150%;
  min-width: 220px;
  max-width: 500px;
  background-color: #191919;
  border-radius: 8px;
  border: 1px solid #3B4252;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
  ${({ $position }) =>
    $position === 'top'
      ? `
    bottom: calc(100% + 4px);
    top: auto;
    `
      : `
    top: calc(100% + 4px);
    bottom: auto;
    `
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #3B4252;
  background-color: #191919;
  color: #E5E9F0;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #6C7A96;
  }
`;

const OptionsList = styled.div<{ $horizontal?: boolean }>`
  // max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: ${props => props.$horizontal ? 'row' : 'column'};
  flex-wrap: wrap;
  justify-content:'flex-start';
  gap: ${props => props.$horizontal ? '8px' : '0'};
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #191919
;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #191919;
    border-radius: 3px;
  }
`;

const Option = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 6px;
  cursor: pointer;
  font-size: 14px;
  color: #E5E9F0;
  background-color: ${props => props.isSelected ? '#4C566A' : 'transparent'};
  // min-width: 120px;
  // justify-content: center;
  
  &:hover {
    background-color: #3B4252;
  }
`;

const NoResults = styled.div`
  padding: 10px 12px;
  color: #6C7A96;
  font-size: 14px;
  text-align: center;
`;

const CreateOption = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #88C0D0;
  border-top: 1px solid #3B4252;
  font-weight: 500;
  
  &:hover {
    background-color: #3B4252;
  }
`;

export default TagSelector;