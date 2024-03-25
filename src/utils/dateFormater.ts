const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dateFormater(
  date: Date,
  time: boolean = false,
  ampm: boolean = false,
) {
  const day = days[date.getUTCDay()];
  const dayNumber = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const formattedDate = `${day}, ${dayNumber}${getDaySuffix(dayNumber)} ${month} ${year}`;

  if (time)
    if (ampm) {
      const hours = date.getHours();
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${formattedDate} ${formattedHours}:${minutes} ${meridiem}`;
    } else {
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");
      return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }

  return formattedDate;
}

function getDaySuffix(dayNumber: number) {
  if (dayNumber >= 11 && dayNumber <= 13) {
    return "th";
  }

  switch (dayNumber % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
