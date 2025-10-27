import { validateCRS, sanitizeCRS } from '../validation';

describe('validation utilities', () => {
  describe('validateCRS', () => {
    it('should accept valid 3-character uppercase CRS codes', () => {
      expect(validateCRS('PAD')).toBe(true);
      expect(validateCRS('KGX')).toBe(true);
      expect(validateCRS('EUS')).toBe(true);
      expect(validateCRS('ABC')).toBe(true);
    });

    it('should reject invalid CRS codes', () => {
      expect(validateCRS('')).toBe(false);
      expect(validateCRS('P')).toBe(false);
      expect(validateCRS('PADX')).toBe(false);
      expect(validateCRS('PA')).toBe(false);
      expect(validateCRS('pad')).toBe(false); // lowercase
      expect(validateCRS('PAD123')).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(validateCRS(null as any)).toBe(false);
      expect(validateCRS(undefined as any)).toBe(false);
    });
  });

  describe('sanitizeCRS', () => {
    it('should sanitize and validate CRS codes', () => {
      expect(sanitizeCRS('pad')).toBe('PAD');
      expect(sanitizeCRS('PAD')).toBe('PAD');
      expect(sanitizeCRS('  PAD  ')).toBe('PAD');
    });

    it('should return null for invalid codes', () => {
      expect(sanitizeCRS('')).toBe(null);
      expect(sanitizeCRS('PA')).toBe(null);
      expect(sanitizeCRS('123')).toBe(null);
      expect(sanitizeCRS('PADX')).toBe(null);
    });

    it('should handle whitespace correctly', () => {
      expect(sanitizeCRS(' pad ')).toBe('PAD');
      expect(sanitizeCRS('PAD ')).toBe('PAD');
      expect(sanitizeCRS(' PAD')).toBe('PAD');
    });
  });
});


