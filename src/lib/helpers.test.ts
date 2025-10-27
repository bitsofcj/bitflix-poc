import { getYear, formatDuration, getPageNumbers } from './helpers';

describe('Helper Functions', () => {
  describe('getYear', () => {
    it('should extract year from valid ISO date string', () => {
      expect(getYear('2010-07-16T00:00:00.000Z')).toBe('2010');
      expect(getYear('2024-12-25T00:00:00.000Z')).toBe('2024');
    });

    it('should return N/A for null input', () => {
      expect(getYear(null)).toBe('N/A');
    });

    it('should return N/A for invalid date string', () => {
      expect(getYear('invalid-date')).toBe('N/A');
    });

    it('should handle edge cases', () => {
      expect(getYear('1900-01-01T00:00:00.000Z')).toBe('1900');
      expect(getYear('2099-12-31T23:59:59.999Z')).toBe('2099');
    });
  });

  describe('formatDuration', () => {
    it('should format hours and minutes correctly', () => {
      expect(formatDuration('PT2H18M')).toBe('2h 18m');
      expect(formatDuration('PT1H45M')).toBe('1h 45m');
    });

    it('should format hours only', () => {
      expect(formatDuration('PT2H')).toBe('2h');
      expect(formatDuration('PT3H')).toBe('3h');
    });

    it('should format minutes only', () => {
      expect(formatDuration('PT90M')).toBe('90m');
      expect(formatDuration('PT45M')).toBe('45m');
    });

    it('should return N/A for null input', () => {
      expect(formatDuration(null)).toBe('N/A');
    });

    it('should return original string for invalid format', () => {
      expect(formatDuration('invalid')).toBe('invalid');
      expect(formatDuration('2h 30m')).toBe('2h 30m');
    });

    it('should handle edge cases', () => {
      expect(formatDuration('PT0H0M')).toBe('');
      expect(formatDuration('PT10H30M')).toBe('10h 30m');
    });
  });

  describe('getPageNumbers', () => {
    it('should show all pages when total is 5 or less', () => {
      expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
      expect(getPageNumbers(2, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show ellipsis at end when on early pages', () => {
      expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, '...', 10]);
      expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, 4, '...', 10]);
      expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('should show ellipsis at start when on late pages', () => {
      expect(getPageNumbers(10, 10)).toEqual([1, '...', 7, 8, 9, 10]);
      expect(getPageNumbers(9, 10)).toEqual([1, '...', 7, 8, 9, 10]);
      expect(getPageNumbers(8, 10)).toEqual([1, '...', 7, 8, 9, 10]);
    });

    it('should show ellipsis on both sides when in middle', () => {
      expect(getPageNumbers(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
      expect(getPageNumbers(6, 10)).toEqual([1, '...', 5, 6, 7, '...', 10]);
    });

    it('should handle edge cases', () => {
      expect(getPageNumbers(1, 1)).toEqual([1]);
      expect(getPageNumbers(1, 2)).toEqual([1, 2]);
    });

    it('should handle large page numbers', () => {
      expect(getPageNumbers(50, 100)).toEqual([
        1,
        '...',
        49,
        50,
        51,
        '...',
        100,
      ]);
    });
  });
});
