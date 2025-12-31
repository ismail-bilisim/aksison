import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, subYears } from 'date-fns';

export function getDateRange(rangeKey: string): { startDate: string; endDate: string } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (rangeKey) {
    case 'bu ay': // This Month
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case '3 ay': // Last 3 Months
      startDate = startOfMonth(subMonths(now, 2)); // 3 months including current
      endDate = endOfMonth(now);
      break;
    case '6 ay': // Last 6 Months
      startDate = startOfMonth(subMonths(now, 5)); // 6 months including current
      endDate = endOfMonth(now);
      break;
    case 'bu yıl': // This Year
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case '1 yıl': // Last 12 Months
      startDate = startOfMonth(subMonths(now, 11)); // 12 months including current
      endDate = endOfMonth(now);
      break;
    default: // Default to 'bu ay' if invalid key
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
  }

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };
}
