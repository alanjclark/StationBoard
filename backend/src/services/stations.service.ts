import db from '../database/db';

export interface Station {
  id: number;
  crs: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Get all stations from database
 */
export function getAllStations(): Station[] {
  const stmt = db.prepare('SELECT * FROM stations ORDER BY name');
  return stmt.all() as Station[];
}

/**
 * Get station by CRS code
 */
export function getStationByCRS(crs: string): Station | undefined {
  const stmt = db.prepare('SELECT * FROM stations WHERE crs = ?');
  return stmt.get(crs.toUpperCase()) as Station | undefined;
}

/**
 * Search stations by name or CRS code
 */
export function searchStations(query: string): Station[] {
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM stations 
    WHERE name LIKE ? OR crs LIKE ?
    ORDER BY name
    LIMIT 100
  `);
  return stmt.all(searchTerm, searchTerm.toUpperCase()) as Station[];
}

/**
 * Get stations by category
 */
export function getStationsByCategory(category: string): Station[] {
  const stmt = db.prepare('SELECT * FROM stations WHERE category = ? ORDER BY name');
  return stmt.all(category) as Station[];
}

/**
 * Get total count of stations
 */
export function getStationCount(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM stations');
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * Get stations with pagination
 */
export function getStationsPaginated(page: number = 0, limit: number = 50): {
  stations: Station[];
  total: number;
  page: number;
  totalPages: number;
} {
  const offset = page * limit;
  const stmt = db.prepare(`
    SELECT * FROM stations 
    ORDER BY name 
    LIMIT ? OFFSET ?
  `);
  const stations = stmt.all(limit, offset) as Station[];
  const total = getStationCount();
  
  return {
    stations,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

