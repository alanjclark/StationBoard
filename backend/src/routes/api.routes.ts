import { Router, Request, Response } from 'express';
import { getDepartures, getArrivals } from '../services/darwin.service';
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
 */
router.get('/stations', async (req: Request, res: Response) => {
  try {
    // Import station list (static data)
    const stations = await import('../data/stations.json');
    res.json(stations.default);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations list' });
  }
});

export default router;

