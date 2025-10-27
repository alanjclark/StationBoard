/**
 * Validate CRS (Computer Reservation System) station code
 * UK station codes are exactly 3 uppercase letters
 */
export function validateCRS(crs: string): boolean {
  return /^[A-Z]{3}$/.test(crs);
}

/**
 * Sanitize station code input
 */
export function sanitizeCRS(crs: string): string | null {
  const cleaned = crs.toUpperCase().trim();
  return validateCRS(cleaned) ? cleaned : null;
}

