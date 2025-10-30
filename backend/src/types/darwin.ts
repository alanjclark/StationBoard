export interface CallingPoint {
  locationName: string;
  crs: string;
  st: string; // Scheduled time
  et?: string; // Estimated time
  at?: string; // Actual time
  isCancelled?: boolean;
}

export interface TrainService {
  sta?: string; // Scheduled time of arrival
  eta?: string; // Estimated time of arrival
  std?: string; // Scheduled time of departure
  etd?: string; // Estimated time of departure
  platform?: string;
  operator: string;
  operatorCode: string;
  serviceID: string;
  rsid?: string; // Running service ID
  locationName: string;
  origin: {
    location: {
      crs: string;
      description: string;
    };
  };
  destination: {
    location: {
      crs: string;
      description: string;
    };
  }[];
  subsequentCallingPoints?: CallingPoint[][]; // Calling-at stations with live times
  isCancelled: boolean;
  isTerminating: boolean;
  serviceType: 'train' | 'bus' | 'ferry';
  length?: number;
  detachFront?: boolean;
  isReverseFormation?: boolean;
  cancellationReason?: string;
  delayReason?: string;
  overdueMessage?: string;
}

export interface BoardUpdate {
  stationCRS: string;
  services: TrainService[];
  lastUpdate: string;
  type: 'departure' | 'arrival';
}

// Darwin Push Port XML Message Types
export interface DarwinPportMessage {
  $: { 
    ts: string; 
    version: string;
    [key: string]: string;
  };
  uR?: DarwinUpdateRecord[] | DarwinUpdateRecord;
  sR?: DarwinSnapshotRecord[] | DarwinSnapshotRecord;
}

export interface DarwinUpdateRecord {
  $?: { seq?: string };
  TS?: DarwinTrainStatus[] | DarwinTrainStatus;
  schedule?: any[];
  Association?: any[];
  // Other message types discovered from actual messages
  [key: string]: any;
}

export interface DarwinSnapshotRecord {
  $?: { seq?: string };
  [key: string]: any;
}

// Darwin Train Status message (TS type)
export interface DarwinTrainStatus {
  $?: {
    rid: string;  // Running ID
    uid: string;  // Unique ID
    ssd: string;  // Scheduled start date
  };
  loc?: DarwinLocation[];
  dept?: DarwinDeparture[];
  arr?: DarwinArrival[];
  is?: DarwinIntermediateStop[];
  // Other fields discovered from actual messages
  [key: string]: any;
}

export interface DarwinLocation {
  $: {
    tpl: string;  // TIPLOC
    crs?: string; // CRS code
    locname?: string;
  };
}

export interface DarwinDeparture {
  $: {
    et?: string;  // Estimated time
    etspec?: string; // Estimated time specification (L=late, E=early, DELAYED, etc.)
    wta?: string; // Working time arrival
    wtd?: string; // Working time departure
    lat?: string; // Late running indicator (true when train is delayed)
  };
  platform?: Array<{ $: { val?: string } }>;
  [key: string]: any;
}

export interface DarwinArrival {
  $: {
    et?: string;  // Estimated time
    etspec?: string; // Estimated time specification (L=late, E=early, DELAYED, etc.)
    wta?: string; // Working time arrival
    wtd?: string; // Working time departure
    lat?: string; // Late running indicator (true when train is delayed)
  };
  platform?: Array<{ $: { val?: string } }>;
  [key: string]: any;
}

export interface DarwinIntermediateStop {
  $: {
    tpl: string;
    crs?: string;
    act?: string;
    pta?: string;
    ptd?: string;
  };
  [key: string]: any;
}

