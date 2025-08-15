import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactDOM from "react-dom";



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
  onBlur?: () => void; // <-- Optional onBlur prop
}

const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder,
  allowCreate = true,
  horizontalOptions = false, // <-- Default to false
  isWithDot = false, // <-- Default to true
  onBlur = () => {}, // <-- Default no-op function
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

    const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

      const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    useEffect(() => {
    if (isOpen && containerRef.current) {
      // Measure input width
      const inputWidth = containerRef.current.offsetWidth;

      // Create a temporary span to measure the longest option
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.fontSize = '14px';
      span.style.fontFamily = 'sans-serif';
      span.style.fontWeight = '400';
      document.body.appendChild(span);

      let maxOptionWidth = 0;
      options.forEach(option => {
        span.textContent = option.label;
        maxOptionWidth = Math.max(maxOptionWidth, span.offsetWidth + 40); // +40 for padding/icons
      });

      document.body.removeChild(span);

      setDropdownWidth(Math.max(inputWidth, maxOptionWidth));
    }
  }, [isOpen, options]);


  const selectedTag = options.find(opt => opt.id === value);
  
  // Handle click outside to close dropdown
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
  //       setIsOpen(false);
  //     }
  //   };
    
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

//Dynamically set dropdown position
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


  // Add these states at the top of your component
const [dropdownLeft, setDropdownLeft] = useState<number | undefined>(undefined);
const [dropdownRight, setDropdownRight] = useState<number | undefined>(undefined);

// useEffect(() => {
//   if (isOpen && containerRef.current) {
//     const rect = containerRef.current.getBoundingClientRect();
//     const dropdownHeight = 260; // Estimate: input + optionsList
//     const spaceBelow = window.innerHeight - rect.bottom;
//     const spaceAbove = rect.top;

//     // Vertical position
//     if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
//       setDropdownPosition('top');
//     } else {
//       setDropdownPosition('bottom');
//     }

   
//   }
// }, [isOpen]);


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleTagSelect = (tag: Tag) => {
    onChange(tag.id);
    setSearchTerm('');
    console.log("Selected tag:", tag);
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

  //   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (!isOpen) return;
  //   if (e.key === 'ArrowDown') {
  //     e.preventDefault();
  //     setHighlightedIndex(idx => Math.min(idx + 1, filteredOptions.length - 1));
  //   } else if (e.key === 'ArrowUp') {
  //     e.preventDefault();
  //     setHighlightedIndex(idx => Math.max(idx - 1, 0));
  //   } else if (e.key === 'Enter') {
  //     e.preventDefault();
  //     if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
  //       handleTagSelect(filteredOptions[highlightedIndex]);
  //     } else if (allowCreate && searchTerm && !hasExactMatch) {
  //       handleCreateNew();
  //     }
  //   }
  // };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!isOpen) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setHighlightedIndex(idx => Math.min(idx + 1, filteredOptions.length - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightedIndex(idx => Math.max(idx - 1, 0));
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    setHighlightedIndex(idx => Math.min(idx + 1, filteredOptions.length - 1));
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    setHighlightedIndex(idx => Math.max(idx - 1, 0));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
      handleTagSelect(filteredOptions[highlightedIndex]);
    } else if (allowCreate && searchTerm && !hasExactMatch) {
      handleCreateNew();
    }
  }
};



  return (
    <Container ref={containerRef}>
      <SelectedTag 
        onClick={() => setIsOpen(!isOpen)}
        isPlaceholder={!selectedTag}
        onBlur={onBlur} // Call onBlur when the selected tag is blurred
      >
        {selectedTag ? (
          <>
           <span
    style={
      isWithDot && selectedTag
        ? {
            background: selectedTag.color || getTagColor(selectedTag.label),
            color: '#fff',
            borderRadius: 6,
            padding: '2px 8px',
            fontWeight: 400,
            display: 'inline-block',
          }
        : undefined
    }
  >
    {selectedTag.label}
  </span>
          </>
        ) : (
          placeholder
        )}
        {/* <DropdownIcon isOpen={isOpen}>▾</DropdownIcon> */}
      </SelectedTag>
      
      {isOpen
      && dropdownWidth 
      &&  ReactDOM.createPortal 
       
       (
        <DropdownContainer $position={dropdownPosition}
          ref={dropdownRef}

        
        style={{
          // left: dropdownLeft,
      left: containerRef.current?.getBoundingClientRect().left,
          position: "absolute",

    right: dropdownRight,
     top:
              dropdownPosition === "bottom"
                ? (containerRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 4
                : undefined,
            bottom:
              dropdownPosition === "top"
                ? window.innerHeight - (containerRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY + 4
                : undefined,
      width: dropdownWidth,      // <-- Use calculated width
            minWidth: dropdownWidth,   // <-- Use calculated width
            zIndex: 2000,
  }}>
          <SearchInput 
            ref={inputRef}
            type="text" 
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleKeyDown} // <-- Add this line

          />
          
          <OptionsList $horizontal={horizontalOptions}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((tag, idx) => (
                <Option 
                  key={tag.id} 
                  onClick={() => handleTagSelect(tag)}
isSelected={tag.id === value || idx === highlightedIndex}
                    style={
                      idx === highlightedIndex
                        ? { background: '#3B4252', color: '#fff' }
                        : undefined
                    }                >
                 <span
  style={
    isWithDot
      ? {
          background: tag.color || getTagColor(tag.label),
          color: '#fff',
          borderRadius: 6,
          padding: '2px 8px',
          fontWeight: 400,
          display: 'inline-block',
        }
      : undefined
  }
>
  {tag.label}
</span>
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
      ,
        document.body
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
  max-width: 500px;
  font-family:  sans-serif;
`;

const SelectedTag = styled.div<{ isPlaceholder: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
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
  max-height: 400px;
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
  font-size: 12px;
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