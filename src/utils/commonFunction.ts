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


// export function parseDurationToMinutes(duration: string) {
//   let total = 0;
//   const hourMatch = duration.match(/(\d+)\s*hour/);
//   const minMatch = duration.match(/(\d+)\s*minute/);
//   if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
//   if (minMatch) total += parseInt(minMatch[1], 10);
//   return total;
// }


// export function parseDurationToMinutes(duration: string): number {
//   if (!duration) return 0;
//   let total = 0;

//   // Handle "H:MM" or "H:MM min" format
//   const colonMatch = duration.match(/^(\d{1,2}):(\d{1,2})$/);
//   if (colonMatch) {
//     total += parseInt(colonMatch[1], 10) * 60;
//     total += parseInt(colonMatch[2], 10);
//     return total;
//   }

//   // Handle "1 hour 30 minutes", "1 hours 30 minutes", etc.
//   const hourMatch = duration.match(/(\d+)\s*hour[s]?/i);
//   const minMatch = duration.match(/(\d+)\s*minute[s]?/i);
//   if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
//   if (minMatch) total += parseInt(minMatch[1], 10);

//   // Handle only "45 min" or "45 minutes"
//   const minOnlyMatch = duration.match(/^(\d{1,3})\s*min(ute)?s?$/i);
//   if (minOnlyMatch) total += parseInt(minOnlyMatch[1], 10);

//   // Handle plain number string (e.g., "90")
//   if (!isNaN(Number(duration))) {
//     total += Number(duration);
//   }

//   return total;
// }




// Helper to add minutes to a time string (e.g., "20:00")
export function addMinutesToTime(startTime: string, minutes: number) {
  return dayjs(startTime, ['HH:mm', 'h:mm A']).add(minutes, 'minute').format('h:mm A');
}


// export function formatDurationShort(duration: string): string {
//   let hours = 0, minutes = 0;
//   const hourMatch = duration.match(/(\d+)\s*hour/);
//   const minMatch = duration.match(/(\d+)\s*minute/);
//   if (hourMatch) hours = parseInt(hourMatch[1], 10);
//   if (minMatch) minutes = parseInt(minMatch[1], 10);

//   let result = '';
//   if (hours > 0) result += `${hours}hr`;
//   if (minutes > 0) result += (result ? ' ' : '') + `${minutes}min`;
//   if (!result) result = '0min';
//   return result;
// }



// export function formatDurationShort(timeStr : string) {
//   if (!timeStr) return 0;
//   let totalMinutes = 0;

//   // Handle "1:45 min" or "1:45" format (treat as hours:minutes)
//   const colonMatch = timeStr.match(/(\d{1,2}):(\d{1,2})/);
//   if (colonMatch) {
//     totalMinutes += parseInt(colonMatch[1], 10) * 60;
//     totalMinutes += parseInt(colonMatch[2], 10);
//     return totalMinutes;
//   }

//   // Handle "1 hour 45 minutes", "1 hours 45 minutes", etc.
//   const hourMatch = timeStr.match(/(\d+)\s*hour[s]?/i);
//   const minuteMatch = timeStr.match(/(\d+)\s*minute[s]?/i);

//   if (hourMatch) {
//     totalMinutes += parseInt(hourMatch[1], 10) * 60;
//   }
//   if (minuteMatch) {
//     totalMinutes += parseInt(minuteMatch[1], 10);
//   }

//   // Handle only "45 min" or "45 minutes"
//   const minOnlyMatch = timeStr.match(/^(\d{1,3})\s*min(ute)?s?$/i);
//   if (minOnlyMatch) {
//     totalMinutes += parseInt(minOnlyMatch[1], 10);
//   }

//   return totalMinutes;
// }


export function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;
  let total = 0;

  // Handle "H:MM" or "H:MM min" format
  const colonMatch = duration.match(/^(\d{1,2}):(\d{1,2})(?:\s*min)?$/i);
  if (colonMatch) {
    total += parseInt(colonMatch[1], 10) * 60;
    total += parseInt(colonMatch[2], 10);
    return total;
  }

  // Handle "1 hour 30 minutes", "1 hours 30 minutes", etc.
  const hourMatch = duration.match(/(\d+)\s*hour[s]?/i);
  const minMatch = duration.match(/(\d+)\s*minute[s]?/i);
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) total += parseInt(minMatch[1], 10);

  // Handle only "45 min" or "45 minutes"
  const minOnlyMatch = duration.match(/^(\d{1,3})\s*min(ute)?s?$/i);
  if (minOnlyMatch) total += parseInt(minOnlyMatch[1], 10);

  // Handle plain number string (e.g., "90")
  if (!isNaN(Number(duration))) {
    total += Number(duration);
  }

  return total;
}


export function formatDurationShort(timeStr: string): string {
  if (!timeStr) return '0 min';
  let totalMinutes = 0;

  // Handle "1:30" or "1:30 min" format (treat as hours:minutes)
  const colonMatch = timeStr.match(/(\d{1,2}):(\d{1,2})/);
  if (colonMatch) {
    totalMinutes += parseInt(colonMatch[1], 10) * 60;
    totalMinutes += parseInt(colonMatch[2], 10);
  } else {
    // Handle "1 hour 45 minutes", "1 hours 45 minutes", etc.
    const hourMatch = timeStr.match(/(\d+)\s*hour[s]?/i);
    const minuteMatch = timeStr.match(/(\d+)\s*minute[s]?/i);

    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1], 10) * 60;
    }
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1], 10);
    }

    // Handle only "45 min" or "45 minutes"
    const minOnlyMatch = timeStr.match(/^(\d{1,3})\s*min(ute)?s?$/i);
    if (minOnlyMatch) {
      totalMinutes += parseInt(minOnlyMatch[1], 10);
    }

    // Handle plain number string (e.g., "90")
    if (!isNaN(Number(timeStr))) {
      totalMinutes += Number(timeStr);
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')} hr`;
  } else if (hours > 0) {
    return `${hours} hr`;
  } else {
    return `${minutes} min`;
  }
}