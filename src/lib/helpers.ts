/**
 * Helper function to extract year from datePublished
 * @param datePublished - ISO 8601 date string or null
 * @returns Year as string or 'N/A' if invalid
 */
export function getYear(datePublished: string | null): string {
  if (!datePublished) return 'N/A';
  const year = new Date(datePublished).getUTCFullYear();
  return isNaN(year) ? 'N/A' : year.toString();
}

/**
 * Helper function to format duration from ISO 8601 format (PT2H18M) to readable format (2h 18m)
 * @param duration - ISO 8601 duration string or null
 * @returns Formatted duration string (e.g., "2h 18m") or 'N/A' if invalid
 */
export function formatDuration(duration: string | null): string {
  if (!duration) return 'N/A';
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  const hoursNum = parseInt(match[1] || '0', 10);
  const minutesNum = parseInt(match[2] || '0', 10);

  // Return empty string for zero duration
  if (hoursNum === 0 && minutesNum === 0) return '';

  const hours = hoursNum > 0 ? `${hoursNum}h` : '';
  const minutes = minutesNum > 0 ? `${minutesNum}m` : '';
  return `${hours}${hours && minutes ? ' ' : ''}${minutes}`.trim();
}

/**
 * Helper function to calculate which page numbers to display in pagination
 * @param currentPage - The current active page number
 * @param totalPages - Total number of pages available
 * @returns Array of page numbers and ellipsis strings to display
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
}
