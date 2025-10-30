import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/stations.db');

/**
 * Initialize database with schema
 */
function initializeDatabase() {
  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✓ Created data directory');
  }
  
  const db = new Database(DB_PATH);
  
  // Read and execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema);
  console.log('✓ Database schema initialized');
  
  return db;
}

/**
 * Import stations from JSON file
 */
function importStations(db: DatabaseType) {
  const stationsJsonPath = path.join(__dirname, '../data/stations.json');
  const stations = JSON.parse(fs.readFileSync(stationsJsonPath, 'utf8'));
  
  console.log(`Importing ${stations.length} stations...`);
  
  const insert = db.prepare(`
    INSERT OR REPLACE INTO stations (crs, name, description, category)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertMany = db.transaction((stations: any[]) => {
    for (const station of stations) {
      insert.run(station.crs, station.name, station.description, station.category);
    }
  });
  
  insertMany(stations);
  console.log(`✓ Imported ${stations.length} stations`);
  
  // Verify count
  const count = db.prepare('SELECT COUNT(*) as count FROM stations').get() as { count: number };
  console.log(`✓ Total stations in database: ${count.count}`);
}

/**
 * Main migration function
 */
function main() {
  console.log('Starting database migration...');
  
  // Remove existing database if it exists
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Removed existing database');
  }
  
  // Initialize database
  const db = initializeDatabase();
  
  // Import stations
  importStations(db);
  
  // Close database
  db.close();
  
  console.log('✓ Migration complete!');
}

if (require.main === module) {
  main();
}

export { main as migrate };

