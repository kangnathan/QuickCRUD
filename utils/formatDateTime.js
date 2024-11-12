import { format } from 'date-fns'

export function formatDateTime(dateTime) {
  // Ensure dateTime is a valid Date object
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) {
    return 'Invalid date'; // or handle the error as needed
  }

  const formattedDate = format(date, 'MM/dd/yyyy')
  const formattedTime = format(date, 'hh:mm a')
  return `${formattedDate} ${formattedTime}`
}
