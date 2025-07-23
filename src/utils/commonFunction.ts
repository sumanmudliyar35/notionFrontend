import dayjs from "dayjs";

// Helper to get ordinal suffix
function getOrdinal(n: number) {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

export const formatDisplayDate = (date: string | Date | null | undefined) => {
  if (!date) return "";
  
  // Check for invalid "0000-00-00" date format
  if (typeof date === "string" && (date === "0000-00-00" || date.startsWith("0000-00-00"))) {
    return "";
  }
  
  const d = dayjs(date);
  if (!d.isValid()) return "";
  
  // Additional validation: check for very old dates that might be parsing errors
  if (d.year() < 1000) {
    return "";
  }
  
  const day = d.date();
  const month = d.format("MMMM");
  const year = d.year();

  // Check if input has a time part (for string input)
  let showTime = false;
  if (typeof date === "string" && (date.includes("T") || date.includes(":"))) {
    showTime = true;
  } else if (date instanceof Date && (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0)) {
    showTime = true;
  }

  const time = d.format("h:mm A");
  return `${day}${getOrdinal(day)} ${month} ${year}${showTime ? " " + time : ""}`;
}


export function DateWithThreeMonthletters(date?: string | null): string {
  if (!date) return "";
  const d = dayjs(date);
  if (!d.isValid()) return "";

  const day = d.date();
  const year = d.format('YY');
  const month = d.format('MMM'); // 3-letter month

  // Ordinal suffix
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinal(day)} ${month} '${year}`;

};

export const formatDisplayTime = (date: string | Date | null | undefined) => {
  if (!date) return "";

  // Accepts both "16:00:00" and full date strings
  let d;
  if (typeof date === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(date.trim())) {
    // If only time is provided, use today as date
    d = dayjs(`2000-01-01T${date.trim()}`);
  } else {
    d = dayjs(date);
  }
  if (!d.isValid()) return "";

  return d.format("h:mm A");
};
