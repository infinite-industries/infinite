import { BadRequestException } from '@nestjs/common';

export function validateAndExtractOptionalDateTimeFilters(
  dateRange?: string,
): [Date | undefined, Date | undefined] {
  if (!dateRange) {
    return [undefined, undefined];
  }

  const dates = dateRange.split('/');
  if (dates.length !== 2) {
    throw new BadRequestException(
      'Invalid dateRange format. Expected format: startDate/endDate (e.g., 2024-01-01T00:00:00.000Z/2024-12-31T23:59:59.999Z)',
    );
  }

  const [startDateStr, endDateStr] = dates;

  if (!startDateStr || !endDateStr) {
    throw new BadRequestException(
      'Both startDate and endDate must be provided in dateRange parameter',
    );
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new BadRequestException(
      'Invalid date format in dateRange. Ensure dates are in ISO 8601 format.',
    );
  }

  if (startDate >= endDate) {
    throw new BadRequestException(
      'startDate must be before endDate in dateRange parameter',
    );
  }

  return [startDate, endDate];
}
