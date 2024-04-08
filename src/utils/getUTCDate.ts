// I hate timezones
export function convertUTCDateToLocalDateString(date: Date | null) {
  if (date === null) return null;
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const newDate = `${year}-${month}-${day}T00:00:00.000Z`;
  return newDate;
}

export function convertUTCDateToLocalDate(date: Date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const newDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  return newDate;
}
