import React, { useMemo, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

interface TimeInputWithIntervalProps {
  value?: { hour: number; minute: number };
  onChange?: (value: { hour: number; minute: number } | null) => void;
}

const minuteOptions = [0, 15, 30, 45];

function formatTime(hour: number, minute: number) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const m = minute.toString().padStart(2, '0');
  const period = hour < 12 ? 'am' : 'pm';
  return `${h}:${m}${period}`;
}

// Helper to parse time string like "4:30pm" or "16:30"
function parseTimeString(str: string): { hour: number; minute: number } | null {
  const match = str.match(/^(\d{1,2}):(\d{2})(am|pm)?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toLowerCase();
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
    return { hour, minute };
  }
  return null;
}

// Helper to get current time rounded to nearest 15 minutes
function getCurrentRoundedTime() {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  // Round to nearest 15
  minute = minuteOptions.reduce((prev, curr) =>
    Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
  );
  return { hour, minute };
}

const TimeInputWithInterval: React.FC<TimeInputWithIntervalProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(
    value ? formatTime(value.hour, value.minute) : ''
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Generate all time options for 24 hours, every 15 minutes
  const timeOptions = useMemo(() => {
    const options: { label: string; value: { hour: number; minute: number } }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min of minuteOptions) {
        options.push({
          label: formatTime(hour, min),
          value: { hour, minute: min }
        });
      }
    }
    return options;
  }, []);

  // Show all matching options, scrollable, with current time first
  // const visibleOptions = useMemo(() => {
  //   if (inputValue) {
  //     // If user types only a number (hour)
  //     const hourMatch = inputValue.match(/^(\d{1,2})$/);
  //     if (hourMatch) {
  //       const hour = parseInt(hourMatch[1], 10);

  //       // Build all options for this hour (am and pm), then the next hour, etc.
  //       const now = new Date();
  //       const isAM = now.getHours() < 12;

  //       // Helper to get all options for a given hour (am or pm)
  //       const getHourOptions = (baseHour: number) =>
  //         minuteOptions.map(min => {
  //           const label = formatTime(baseHour, min);
  //           return timeOptions.find(opt => opt.label === label);
  //         }).filter(Boolean);

  //       // Start with current period (am or pm), then the other
  //       const amHour = hour === 12 ? 12 : hour % 12;
  //       const pmHour = hour === 12 ? 12 : hour + 12;

  //       const amOptions = getHourOptions(amHour);
  //       const pmOptions = getHourOptions(pmHour);

  //       // Next hours after the typed hour (same period first)
  //       const getNextOptions = (baseHour: number) => {
  //         const options: typeof timeOptions = [];
  //         for (let h = baseHour + 1; h < baseHour + 12; h++) {
  //           const realHour = h % 12 === 0 ? 12 : h % 12;
  //           const hour24 = baseHour < 12 ? realHour : realHour + 12;
  //           options.push(...(getHourOptions(hour24).filter(Boolean) as { label: string; value: { hour: number; minute: number } }[]));
  //         }
  //         return options;
  //       };

  //       const amNext = getNextOptions(amHour);
  //       const pmNext = getNextOptions(pmHour);

  //       // Prioritize current period
  //       const result = isAM
  //         ? [...amOptions, ...amNext, ...pmOptions, ...pmNext]
  //         : [...pmOptions, ...pmNext, ...amOptions, ...amNext];

  //       // Remove any undefined/null and flatten
  //       return result.filter(Boolean);
  //     }

  //     // Default filtering
  //     return timeOptions.filter(opt =>
  //       opt.label.toLowerCase().includes(inputValue.toLowerCase())
  //     );
  //   }

  //   // Default: start from current time and wrap around
  //   const current = getCurrentRoundedTime();
  //   const currentLabel = formatTime(current.hour, current.minute);
  //   const idx = timeOptions.findIndex(opt => opt.label === currentLabel);
  //   if (idx === -1) return timeOptions;
  //   return [...timeOptions.slice(idx), ...timeOptions.slice(0, idx)];
  // }, [inputValue, timeOptions]);


  const visibleOptions = useMemo(() => {
  if (!inputValue) return timeOptions;
  return timeOptions.filter(opt =>
    opt.label.startsWith(inputValue.padStart(2, '0'))
    || opt.label.startsWith(inputValue)
  );
}, [inputValue, timeOptions]);

  // Sync input field when value changes externally, but NOT while editing
  React.useEffect(() => {
    if (value && !isFocused) {
      const formatted = formatTime(value.hour, value.minute);
      if (formatted !== inputValue) {
        setInputValue(formatted);
        setError(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isFocused]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowDropdown(true);
    const parsed = parseTimeString(val.replace(/\s/g, ''));
    if (parsed) {
      setError(null);
      if (onChange) onChange(parsed);
    } else {
      setError(val ? 'Invalid time format' : null);
      if (onChange) onChange(null);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type or select time (e.g. 4:30pm)"
        style={{
          padding: 4,
          minWidth: 100,
          marginBottom: 8,
          borderColor: error ? 'red' : undefined,
          backgroundColor: '#191919',
          color: '#fff',
        }}
        autoComplete="off"
        onFocus={e => { setIsFocused(true); e.target.select(); setShowDropdown(true); }}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <div style={{ color: 'red', fontSize: 12, marginBottom: 4 }}>{error}</div>
      )}
      {showDropdown && wrapperRef.current &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              top: wrapperRef.current.getBoundingClientRect().bottom + window.scrollY,
              left: wrapperRef.current.getBoundingClientRect().left + window.scrollX,
              width: 120,
              maxHeight: 200,
              overflowY: 'auto',
              background: '#222',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 4,
              zIndex: 2000,
            }}
          >
            {visibleOptions.filter((opt): opt is { label: string; value: { hour: number; minute: number } } => !!opt).map(opt => (
              <div
                key={opt.label}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: inputValue === opt.label ? '#444' : 'transparent',
                }}
                onMouseDown={() => {
                  setInputValue(opt.label);
                  setShowDropdown(false);
                  setError(null);
                  if (onChange) onChange(opt.value);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default TimeInputWithInterval;