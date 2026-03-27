/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VesselType = 'OIL TANKER' | 'GAS' | 'CARGO' | 'RECREATIONAL' | 'NAVY' | 'FISHING';

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  origin: string;
  destination: string;
  speed: number;
  heading: number;
  lat: number;
  lng: number;
  imo: string;
  mmsi: string;
  status: 'CRUISING' | 'AT ANCHOR' | 'RESTRICTED_MAN' | 'REFUELING' | 'ON STATION';
}

export interface IntelAlert {
  id: string;
  timestamp: string;
  sector: string;
  source: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
}

const ORIGINS = ['SAUDI ARABIA', 'UAE', 'IRAQ', 'KUWAIT', 'QATAR', 'OMAN', 'USA', 'GERMANY', 'LIBERIA'];
const DESTINATIONS = ['FUJAIRAH', 'JEBEL ALI', 'BANDAR ABBAS', 'MUSCAT', 'DOHA', 'SINGAPORE', 'ROTTERDAM'];
const VESSEL_NAMES = [
  'MARINER-7', 'SILVER GLORY', 'NEPTUNE GHOST', 'GLOBAL TRADE', 'SHILOH', 'ARABIAN STAR',
  'OCEAN VOYAGER', 'DESERT ROSE', 'GULF SPIRIT', 'HORIZON', 'ECLIPSE', 'TITAN'
];

export async function fetchVessels(): Promise<Vessel[]> {
  try {
    const response = await fetch('/api/vessels');
    if (!response.ok) throw new Error('Failed to fetch vessels');
    return await response.json();
  } catch (error) {
    console.error('Error fetching vessels:', error);
    return [];
  }
}

export function generateInitialVessels(): Vessel[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `v-${i}`,
    name: `${i % 2 === 0 ? 'M/T' : 'C/V'} ${VESSEL_NAMES[i % VESSEL_NAMES.length]}`,
    type: (['OIL TANKER', 'GAS', 'CARGO', 'RECREATIONAL', 'NAVY'][i % 5]) as VesselType,
    origin: ORIGINS[i % ORIGINS.length],
    destination: DESTINATIONS[i % DESTINATIONS.length],
    speed: parseFloat((Math.random() * 20 + 5).toFixed(1)),
    heading: Math.floor(Math.random() * 360),
    lat: 26.5 + (Math.random() - 0.5) * 0.5,
    lng: 56.4 + (Math.random() - 0.5) * 0.5,
    imo: Math.floor(1000000 + Math.random() * 9000000).toString(),
    mmsi: Math.floor(100000000 + Math.random() * 900000000).toString(),
    status: (['CRUISING', 'AT ANCHOR', 'RESTRICTED_MAN', 'REFUELING', 'ON STATION'][i % 5]) as any,
  }));
}

export function generateInitialAlerts(): IntelAlert[] {
  return [
    {
      id: 'a-1',
      timestamp: '14:31:05',
      sector: 'SECTOR_02',
      source: 'SIGINT_V4',
      message: 'Sub-surface acoustic anomaly detected near Ras Al-Khaimah. Verification protocol initiated.',
      level: 'INFO'
    },
    {
      id: 'a-2',
      timestamp: '14:28:44',
      sector: 'AIS_HUB',
      source: 'AIS_HUB',
      message: "M/T 'SILVER GLORY' (Flag: Liberia) exited terminal at Jebel Ali. Cargo: Crude. ETA Straits: 2h 15m.",
      level: 'INFO'
    },
    {
      id: 'a-3',
      timestamp: '14:22:12',
      sector: 'NAV_COMMS',
      source: 'NAV_COMMS',
      message: 'Warning issued to unidentified craft entering corridor B. Vessel non-responsive to Bridge-to-Bridge Channel 16.',
      level: 'CRITICAL'
    }
  ];
}

export function updateVesselPositions(vessels: Vessel[]): Vessel[] {
  return vessels.map(v => {
    if (v.status === 'AT ANCHOR' || v.status === 'REFUELING') return v;
    
    // Move slightly based on heading and speed
    const rad = (v.heading * Math.PI) / 180;
    const moveLat = Math.cos(rad) * (v.speed / 10000);
    const moveLng = Math.sin(rad) * (v.speed / 10000);
    
    return {
      ...v,
      lat: v.lat + moveLat,
      lng: v.lng + moveLng,
    };
  });
}
