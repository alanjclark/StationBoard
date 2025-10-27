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

