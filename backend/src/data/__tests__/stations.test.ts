import stations from '../stations.json';

describe('Stations Data', () => {
  it('should load stations.json', () => {
    expect(stations).toBeDefined();
    expect(Array.isArray(stations)).toBe(true);
  });

  it('should have valid structure for each station', () => {
    stations.forEach((station) => {
      expect(station).toHaveProperty('crs');
      expect(station).toHaveProperty('name');
      expect(station).toHaveProperty('description');
      expect(station).toHaveProperty('category');
      
      expect(typeof station.crs).toBe('string');
      expect(typeof station.name).toBe('string');
      expect(typeof station.description).toBe('string');
      expect(typeof station.category).toBe('string');
    });
  });

  it('should have valid CRS codes (3 characters, uppercase)', () => {
    stations.forEach((station) => {
      expect(station.crs.length).toBe(3);
      expect(station.crs).toBe(station.crs.toUpperCase());
      expect(/^[A-Z]{3}$/.test(station.crs)).toBe(true);
    });
  });

  it('should have non-empty names and descriptions', () => {
    stations.forEach((station) => {
      expect(station.name.trim().length).toBeGreaterThan(0);
      expect(station.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('should have valid category values', () => {
    const validCategories = ['A', 'B', 'C'];
    stations.forEach((station) => {
      expect(validCategories).toContain(station.category);
    });
  });

  it('should have no duplicate CRS codes', () => {
    const crsCodes = stations.map((station) => station.crs);
    const uniqueCodes = new Set(crsCodes);
    expect(uniqueCodes.size).toBe(crsCodes.length);
  });
});


