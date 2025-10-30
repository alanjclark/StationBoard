import { Router, Request, Response } from 'express';
import { getDepartures, getArrivals } from '../services/darwin.service';
import {
  getAllStations,
  getStationByCRS,
  searchStations,
  getStationsByCategory,
  getStationsPaginated
} from '../services/stations.service';
import { validateCRS } from '../utils/validation';

const router = Router();

/**
 * GET /api/departures/:crs
 * Get departures for a station
 */
router.get('/departures/:crs', async (req: Request, res: Response) => {
  try {
    const crs = req.params.crs.toUpperCase();
    
    if (!validateCRS(crs)) {
      return res.status(400).json({ error: 'Invalid CRS code' });
    }

    const departures = await getDepartures(crs);
    res.json(departures);
  } catch (error) {
    console.error('Error fetching departures:', error);
    res.status(500).json({ error: 'Failed to fetch departures' });
  }
});

/**
 * GET /api/arrivals/:crs
 * Get arrivals for a station
 */
router.get('/arrivals/:crs', async (req: Request, res: Response) => {
  try {
    const crs = req.params.crs.toUpperCase();
    
    if (!validateCRS(crs)) {
      return res.status(400).json({ error: 'Invalid CRS code' });
    }

    const arrivals = await getArrivals(crs);
    res.json(arrivals);
  } catch (error) {
    console.error('Error fetching arrivals:', error);
    res.status(500).json({ error: 'Failed to fetch arrivals' });
  }
});

/**
 * GET /api/stations
 * Get list of all UK station codes
 * Optional query parameters:
 * - page: page number for pagination (default: 0)
 * - limit: items per page (default: 100)
 * - category: filter by category (A, B, or C)
 * - search: search by name or CRS code
 */
router.get('/stations', async (req: Request, res: Response) => {
  try {
    const { page, limit, category, search } = req.query;
    
    // If search query provided, return search results
    if (search && typeof search === 'string') {
      const results = searchStations(search);
      return res.json(results);
    }
    
    // If category provided, filter by category
    if (category && typeof category === 'string') {
      const results = getStationsByCategory(category);
      return res.json(results);
    }
    
    // If pagination requested
    if (page !== undefined || limit !== undefined) {
      const pageNum = parseInt(page as string) || 0;
      const limitNum = parseInt(limit as string) || 100;
      const result = getStationsPaginated(pageNum, limitNum);
      return res.json(result);
    }
    
    // Default: return all stations (for backward compatibility)
    const stations = getAllStations();
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations list' });
  }
});

/**
 * GET /api/stations/:crs
 * Get a specific station by CRS code
 */
router.get('/stations/:crs', async (req: Request, res: Response) => {
  try {
    const crs = req.params.crs.toUpperCase();
    
    if (!validateCRS(crs)) {
      return res.status(400).json({ error: 'Invalid CRS code' });
    }
    
    const station = getStationByCRS(crs);
    
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json(station);
  } catch (error) {
    console.error('Error fetching station:', error);
    res.status(500).json({ error: 'Failed to fetch station' });
  }
});

export default router;

