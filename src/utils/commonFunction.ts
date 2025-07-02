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
  const d = dayjs(date);
  if (!d.isValid()) return "";
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