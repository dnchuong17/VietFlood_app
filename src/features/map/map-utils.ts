import { MapMarker } from './MapComponent';

/**
 * Clustering utilities for map performance optimization
 */

interface ClusteringOptions {
  gridSize?: number; // Grid cell size in degrees
  minClusterSize?: number; // Minimum markers to form a cluster
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/**
 * Calculate clustering for markers based on grid size
 * Optimized for performance with large datasets (1000+ markers)
 */
export function clusterMarkers(
  markers: MapMarker[],
  options: ClusteringOptions = {}
) {
  const { gridSize = 0.05, minClusterSize = 2 } = options;

  if (markers.length < minClusterSize * 2) {
    return { individual: markers, clusters: [] };
  }

  const clusters = new Map<string, MapMarker[]>();
  const individual: MapMarker[] = [];

  // Group markers by grid cell
  markers.forEach((marker) => {
    const gridLat = Math.floor(marker.latitude / gridSize);
    const gridLon = Math.floor(marker.longitude / gridSize);
    const key = `${gridLat},${gridLon}`;

    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key)?.push(marker);
  });

  // Separate individual markers from clusters
  const clusterMarkers: any[] = [];
  clusters.forEach((markerGroup) => {
    if (markerGroup.length < minClusterSize) {
      individual.push(...markerGroup);
    } else {
      clusterMarkers.push({
        id: `cluster-${markerGroup.map((m) => m.id).join('-')}`,
        latitude: markerGroup.reduce((sum, m) => sum + m.latitude, 0) / markerGroup.length,
        longitude: markerGroup.reduce((sum, m) => sum + m.longitude, 0) / markerGroup.length,
        title: `${markerGroup.length} reports`,
        isCluster: true,
        markerCount: markerGroup.length,
        markers: markerGroup,
      });
    }
  });

  return { individual, clusters: clusterMarkers };
}

/**
 * Filter markers by region for viewport optimization
 */
export function filterMarkersByRegion(
  markers: MapMarker[],
  bounds: MapBounds,
  padding: number = 0.01
) {
  return markers.filter(
    (marker) =>
      marker.latitude >= bounds.minLat - padding &&
      marker.latitude <= bounds.maxLat + padding &&
      marker.longitude >= bounds.minLon - padding &&
      marker.longitude <= bounds.maxLon + padding
  );
}

/**
 * Filter markers by severity level
 */
export function filterMarkersBySeverity(
  markers: MapMarker[],
  severityLevels: string[]
) {
  return markers.filter((marker) => !marker.severity || severityLevels.includes(marker.severity));
}

/**
 * Filter markers by type
 */
export function filterMarkersByType(markers: MapMarker[], types: string[]) {
  return markers.filter((marker) => !marker.type || types.includes(marker.type));
}

/**
 * Get markers within radius from a point
 */
export function getMarkersWithinRadius(
  markers: MapMarker[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
) {
  const earthR = 6371; // Earth's radius in km
  const dLat = (radiusKm / earthR) * (180 / Math.PI);
  const dLon = (radiusKm / earthR) * (180 / Math.PI) / Math.cos((centerLat * Math.PI) / 180);

  return markers.filter(
    (marker) =>
      Math.abs(marker.latitude - centerLat) <= dLat &&
      Math.abs(marker.longitude - centerLon) <= dLon
  );
}

/**
 * Calculate bounding box for markers
 */
export function getMarkerBounds(markers: MapMarker[]): MapBounds {
  if (markers.length === 0) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  }

  return {
    minLat: Math.min(...markers.map((m) => m.latitude)),
    maxLat: Math.max(...markers.map((m) => m.latitude)),
    minLon: Math.min(...markers.map((m) => m.longitude)),
    maxLon: Math.max(...markers.map((m) => m.longitude)),
  };
}

/**
 * Generate region to fit markers
 */
export function getRegionForMarkers(
  markers: MapMarker[],
  padding: number = 0.1
) {
  if (markers.length === 0) {
    return {
      latitude: 10.7769,
      longitude: 106.7009,
      latitudeDelta: 5,
      longitudeDelta: 5,
    };
  }

  const bounds = getMarkerBounds(markers);
  const latDelta = bounds.maxLat - bounds.minLat + padding;
  const lonDelta = bounds.maxLon - bounds.minLon + padding;

  return {
    latitude: (bounds.minLat + bounds.maxLat) / 2,
    longitude: (bounds.minLon + bounds.maxLon) / 2,
    latitudeDelta: Math.max(latDelta, 0.05),
    longitudeDelta: Math.max(lonDelta, 0.05),
  };
}

/**
 * Sort markers by distance from a point
 */
export function sortMarkersByDistance(
  markers: MapMarker[],
  centerLat: number,
  centerLon: number
) {
  return [...markers].sort((a, b) => {
    const distA = Math.hypot(a.latitude - centerLat, a.longitude - centerLon);
    const distB = Math.hypot(b.latitude - centerLat, b.longitude - centerLon);
    return distA - distB;
  });
}

/**
 * Get closest marker
 */
export function getClosestMarker(
  markers: MapMarker[],
  centerLat: number,
  centerLon: number
): MapMarker | null {
  if (markers.length === 0) return null;

  return markers.reduce((closest, marker) => {
    const dist = Math.hypot(marker.latitude - centerLat, marker.longitude - centerLon);
    const closestDist = Math.hypot(closest.latitude - centerLat, closest.longitude - centerLon);
    return dist < closestDist ? marker : closest;
  });
}

/**
 * Group markers by type
 */
export function groupMarkersByType(markers: MapMarker[]) {
  const groups: { [key: string]: MapMarker[] } = {};

  markers.forEach((marker) => {
    const type = marker.type || 'other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(marker);
  });

  return groups;
}

/**
 * Get marker statistics
 */
export function getMarkerStatistics(markers: MapMarker[]) {
  const stats = {
    total: markers.length,
    byType: {} as { [key: string]: number },
    bySeverity: {} as { [key: string]: number },
  };

  markers.forEach((marker) => {
    const type = marker.type || 'other';
    const severity = marker.severity || 'none';

    stats.byType[type] = (stats.byType[type] || 0) + 1;
    stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
  });

  return stats;
}

/**
 * Cache map tiles for offline access
 * Note: Actual tile caching requires native implementation or third-party library
 */
export class MapTileCache {
  private cache: Map<string, any> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Calculate zoom level needed to fit region
 */
export function getZoomLevel(
  latitudeDelta: number,
  longitudeDelta: number
): number {
  const maxDelta = Math.max(latitudeDelta, longitudeDelta);
  const zoom = Math.round(Math.log2(360 / maxDelta));
  return Math.max(0, Math.min(zoom, 21)); // Clamp between 0 and 21
}

/**
 * Get marker color based on severity
 */
export function getMarkerColorBySeverity(severity?: string): string {
  switch (severity) {
    case 'critical':
      return '#7f1d1d';
    case 'high':
      return '#dc2626';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#eab308';
    default:
      return '#6b7280';
  }
}

/**
 * Generate geohash for clustering
 */
export function geohash(lat: number, lon: number, precision: number = 6): string {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';

  let latMin = -90.0;
  let latMax = 90.0;
  let lonMin = -180.0;
  let lonMax = 180.0;

  while (geohash.length < precision) {
    if (evenBit) {
      const lonMid = (lonMin + lonMax) / 2;
      if (lon > lonMid) {
        idx = (idx << 1) + 1;
        lonMin = lonMid;
      } else {
        idx = idx << 1;
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (lat > latMid) {
        idx = (idx << 1) + 1;
        latMin = latMid;
      } else {
        idx = idx << 1;
        latMax = latMid;
      }
    }

    evenBit = !evenBit;

    if (++bit === 5) {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}
