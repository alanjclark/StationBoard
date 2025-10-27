import axios from 'axios';
import type { TrainService } from '../types/darwin';

// Rail Data Marketplace API credentials (Active and working!)
// Note: These are functions to ensure they read the latest env vars
const getRDM_API_KEY = () => process.env.RDM_API_KEY;
const getRDM_API_BASE_URL = () => process.env.RDM_API_BASE_URL || 'https://api1.raildata.org.uk/1010-live-departure-board-dep1_2/LDBWS/api/20220120';

// Darwin Push Port credentials (Inactive - awaiting activation)
const DARWIN_PUSH_PORT_USERNAME = process.env.DARWIN_PUSH_PORT_USERNAME;
const DARWIN_PUSH_PORT_PASSWORD = process.env.DARWIN_PUSH_PORT_PASSWORD;
const DARWIN_MESSAGING_HOST = process.env.DARWIN_MESSAGING_HOST || 'darwin-dist-44ae45.nationalrail.co.uk';
const DARWIN_STOMP_PORT = parseInt(process.env.DARWIN_STOMP_PORT || '61613', 10);
const DARWIN_OPENWIRE_PORT = parseInt(process.env.DARWIN_OPENWIRE_PORT || '61616', 10);
const DARWIN_TOPIC_LIVE = process.env.DARWIN_TOPIC_LIVE || 'darwin.pushport-v16';
const DARWIN_TOPIC_STATUS = process.env.DARWIN_TOPIC_STATUS || 'darwin.status';

/**
 * Darwin OpenLDBWS API client
 * This service connects to Network Rail's Darwin system via datafeeds.networkrail.co.uk
 * 
 * Darwin provides two main data feeds:
 * 1. Darwin Push Port (STOMP/ActiveMQ) - Real-time streaming (implemented in websocket handler)
 * 2. Darwin OpenLDBWS (SOAP API) - Query API for board data
 */

const OPENLDBWS_BASE_URL = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS';

interface DarwinSOAPResponse {
  GetStationBoardResult?: {
    crs: string;
    locationName: string;
    generatedAt: string;
    trainServices?: {
      service: TrainService[];
    };
    nrccMessages?: any;
  };
  GetArrivalBoardResult?: {
    crs: string;
    locationName: string;
    generatedAt: string;
    trainServices?: {
      service: TrainService[];
    };
  };
}

/**
 * Get departures for a station using Darwin OpenLDBWS SOAP API
 * Falls back to Darwin Push Port subscription if available
 */
/**
 * Get departures using Rail Data Marketplace API
 */
export async function getDepartures(crs: string): Promise<TrainService[]> {
  const apiKey = getRDM_API_KEY();
  console.log(`getDepartures(${crs}) - RDM_API_KEY:`, apiKey ? 'SET' : 'NOT SET');
  if (!apiKey) {
    console.error('RDM_API_KEY not configured - check .env file');
    return [];
  }

  try {
    const response = await axios.get(
      `${getRDM_API_BASE_URL()}/GetDepartureBoard/${crs}`,
      {
        params: { numRows: 15 },
        headers: { 'x-apikey': apiKey },
      }
    );

    const trainServices = response.data.trainServices || [];
    
    // Transform RDM format to our TrainService type
    return trainServices.map((service: any) => ({
      sta: service.sta,
      eta: service.eta,
      std: service.std,
      etd: service.etd, // Don't default to 'On time', let frontend handle it
      platform: service.platform,
      operator: service.operator,
      operatorCode: service.operatorCode,
      serviceID: service.serviceID,
      rsid: service.rsid,
      locationName: response.data.locationName,
      origin: service.origin?.[0] ? {
        location: {
          crs: service.origin[0].crs,
          description: service.origin[0].locationName,
        },
      } : undefined,
      destination: service.destination?.map((dest: any) => ({
        location: {
          crs: dest.crs,
          description: dest.locationName,
        },
      })) || [],
      subsequentCallingPoints: service.subsequentCallingPoints?.map((pointGroup: any) => 
        pointGroup.callingPoint?.map((point: any) => ({
          locationName: point.locationName,
          crs: point.crs,
          st: point.st,
          et: point.et,
          at: point.at,
          isCancelled: point.isCancelled,
        })) || []
      ),
      isCancelled: service.isCancelled || false,
      isTerminating: false,
      serviceType: service.serviceType || 'train',
      length: service.length || 0,
      detachFront: service.detachFront || false,
      isReverseFormation: service.isReverseFormation || false,
      cancellationReason: service.cancellationReason,
      delayReason: service.delayReason,
    }));
  } catch (error: any) {
    console.error(`Error fetching departures for ${crs}:`, error.message);
    return [];
  }
}

/**
 * Get arrivals for a station using Darwin OpenLDBWS SOAP API
 */
/**
 * Get arrivals using Rail Data Marketplace API
 * Note: The API doesn't have a dedicated arrivals endpoint, so we return an empty array
 * and display arrivals from the departures feed at the destination station instead
 */
export async function getArrivals(crs: string): Promise<TrainService[]> {
  // The Rail Data Marketplace API endpoint doesn't support arrivals
  // Arrivals would need to be fetched from a different source or by querying
  // the arrivals at the destination station's departure board
  console.log(`getArrivals(${crs}) - API doesn't support arrivals`);
  return [];
}

/**
 * Initialize STOMP connection to Darwin Push Port
 * This handles real-time streaming updates via STOMP/ActiveMQ
 * Called from the WebSocket handler when clients subscribe
 */
/**
 * Get STOMP connection configuration
 */
export function getDarwinStompConfig() {
  if (!DARWIN_PUSH_PORT_USERNAME || !DARWIN_PUSH_PORT_PASSWORD) {
    throw new Error('Darwin Push Port credentials not configured - account awaiting activation');
  }

  // Darwin uses TOPICS, not queues
  // Live feed topic is darwin.pushport-v16 as per credentials page
  
  return {
    host: DARWIN_MESSAGING_HOST,
    stompPort: DARWIN_STOMP_PORT,
    openwirePort: DARWIN_OPENWIRE_PORT,
    username: DARWIN_PUSH_PORT_USERNAME,
    password: DARWIN_PUSH_PORT_PASSWORD,
    topics: {
      live: `/topic/${DARWIN_TOPIC_LIVE}`, // Use topic, not queue
      status: `/topic/${DARWIN_TOPIC_STATUS}`, // Use topic, not queue
    },
    connectHeaders: {
      login: DARWIN_PUSH_PORT_USERNAME,
      passcode: DARWIN_PUSH_PORT_PASSWORD,
      'client-id': DARWIN_PUSH_PORT_USERNAME, // Client ID should be username
      host: '/', // Add host header
    },
  };
}

export async function initializeDarwinPushPort(): Promise<void> {
  console.log('Darwin Push Port configuration:');
  console.log(`  Host: ${DARWIN_MESSAGING_HOST}`);
  console.log(`  STOMP Port: ${DARWIN_STOMP_PORT}`);
  console.log(`  OpenWire Port: ${DARWIN_OPENWIRE_PORT}`);
  console.log(`  Username: ${DARWIN_PUSH_PORT_USERNAME}`);
  console.log(`  Live Topic: /topic/${DARWIN_TOPIC_LIVE}`);
  console.log(`  Status Topic: /topic/${DARWIN_TOPIC_STATUS}`);
  
  // STOMP client will be initialized in the WebSocket handler
}

/**
 * Filter train services to only show those stopping/terminating at specified station
 */
export function filterServicesForStation(
  services: TrainService[],
  stationCRS: string,
  isArrival: boolean
): TrainService[] {
  return services.filter((service) => {
    if (isArrival) {
      // For arrivals: show trains arriving or terminating at the station
      return (
        service.locationName.toUpperCase() === stationCRS ||
        service.isTerminating
      );
    } else {
      // For departures: show trains departing from the station
      return service.origin?.location?.crs === stationCRS;
    }
  });
}

