import xml2js from 'xml2js';
import * as zlib from 'zlib';
import type { 
  DarwinPportMessage, 
  DarwinUpdateRecord, 
  TrainService 
} from '../types/darwin';

const parser = new xml2js.Parser({ 
  explicitArray: false,
  mergeAttrs: false,
  explicitChildren: true,
  preserveChildrenOrder: false
});

export async function parseDarwinMessage(
  compressedBuffer: Buffer
): Promise<DarwinPportMessage | null> {
  try {
    // Decompress gzip message
    const decompressed = await new Promise<Buffer>((resolve, reject) => {
      zlib.gunzip(compressedBuffer, (err: Error | null, result: Buffer) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Parse XML
    const xmlString = decompressed.toString('utf8');
    const result = await parser.parseStringPromise(xmlString);
    
    return result as DarwinPportMessage;
  } catch (error) {
    console.error('Error parsing Darwin message:', error);
    return null;
  }
}

/**
 * Extract train services from Darwin message for a specific station
 * This is a simplified version - full implementation would require
 * cross-referencing with schedule data
 */
export function extractTrainServices(
  message: DarwinPportMessage,
  stationCRS: string,
  type: 'departure' | 'arrival'
): TrainService[] {
  const services: TrainService[] = [];
  
  // Get update records (uR) or snapshot records (sR)
  const updateRecords: DarwinUpdateRecord[] = 
    (message.uR ? (Array.isArray(message.uR) ? message.uR : [message.uR]) : [])
    .concat(message.sR ? (Array.isArray(message.sR) ? message.sR : [message.sR]) : []);

  // Process each update record
  for (const record of updateRecords) {
    if (!record.TS) continue;
    
    const trainStatuses = Array.isArray(record.TS) ? record.TS : [record.TS];
    
    for (const ts of trainStatuses) {
      // Extract location data
      const locations = ts.loc ? (Array.isArray(ts.loc) ? ts.loc : [ts.loc]) : [];
      
      for (const loc of locations) {
        if (loc.$?.crs === stationCRS) {
          // This is a relevant train for our station
          // Extract departure/arrival information
          const dept = ts.dept?.[0] || (Array.isArray(ts.dept) ? ts.dept[0] : undefined);
          const arr = ts.arr?.[0] || (Array.isArray(ts.arr) ? ts.arr[0] : undefined);
          
          if (type === 'departure' && dept) {
            const scheduled = dept.$?.wtd;
            const estimated = dept.$?.et;
            const isLate = dept.$?.lat === 'true' || dept.$?.etspec === 'L' || dept.$?.etspec?.toUpperCase() === 'DELAYED';
            
            // If no estimated time but train is marked as late, leave etd undefined
            // The frontend will detect this as a delay based on the isLate flag
            services.push({
              std: scheduled || '',
              etd: estimated || (isLate ? undefined : scheduled || ''), // undefined triggers delay detection
              platform: dept.platform?.[0]?.$?.val,
              operator: 'Unknown', // Would need to look up from schedule
              operatorCode: '??',
              serviceID: ts.$?.rid || 'unknown',
              rsid: ts.$?.uid,
              locationName: loc.$?.locname || stationCRS,
              origin: { location: { crs: stationCRS, description: loc.$?.locname || stationCRS } },
              destination: [], // Would need to extract from schedule
              isCancelled: false, // Would need to check for cancellation elements
              isTerminating: false,
              serviceType: 'train',
              subsequentCallingPoints: undefined,
              delayReason: isLate && !estimated ? 'Delayed' : undefined, // Signal delay to frontend
            });
          } else if (type === 'arrival' && arr) {
            const scheduled = arr.$?.wta;
            const estimated = arr.$?.et;
            const isLate = arr.$?.lat === 'true' || arr.$?.etspec === 'L' || arr.$?.etspec?.toUpperCase() === 'DELAYED';
            
            services.push({
              sta: scheduled || '',
              eta: estimated || (isLate ? undefined : scheduled || ''), // undefined triggers delay detection
              platform: arr.platform?.[0]?.$?.val,
              operator: 'Unknown',
              operatorCode: '??',
              serviceID: ts.$?.rid || 'unknown',
              rsid: ts.$?.uid,
              locationName: loc.$?.locname || stationCRS,
              origin: { location: { crs: stationCRS, description: loc.$?.locname || stationCRS } },
              destination: [],
              isCancelled: false,
              isTerminating: false,
              serviceType: 'train',
              subsequentCallingPoints: undefined,
              delayReason: isLate && !estimated ? 'Delayed' : undefined, // Signal delay to frontend
            });
          }
        }
      }
    }
  }
  
  return services;
}

/**
 * Filter Darwin messages by station and type
 */
export function shouldProcessMessage(
  message: DarwinPportMessage,
  stationCRS: string
): boolean {
  // Check if message contains data for our station
  const updateRecords: DarwinUpdateRecord[] = 
    (message.uR ? (Array.isArray(message.uR) ? message.uR : [message.uR]) : [])
    .concat(message.sR ? (Array.isArray(message.sR) ? message.sR : [message.sR]) : []);

  for (const record of updateRecords) {
    if (!record.TS) continue;
    
    const trainStatuses = Array.isArray(record.TS) ? record.TS : [record.TS];
    
    for (const ts of trainStatuses) {
      const locations = ts.loc ? (Array.isArray(ts.loc) ? ts.loc : [ts.loc]) : [];
      
      for (const loc of locations) {
        if (loc.$?.crs === stationCRS) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Get message type from STOMP headers
 */
export function getMessageType(headers: Record<string, string>): string | null {
  return headers?.MessageType || null;
}

/**
 * Get sequence number for gap detection
 */
export function getSequenceNumber(headers: Record<string, string>): number | null {
  const seq = headers?.SequenceNumber;
  return seq ? parseInt(seq, 10) : null;
}

