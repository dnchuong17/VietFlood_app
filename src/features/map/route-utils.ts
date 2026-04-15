import { Polyline } from 'react-native-maps';
import { Location } from '../../types/reports';
import { colors } from '../../lib/styling';

/**
 * Route interface for visualization
 */
export interface Route {
  id: string;
  name: string;
  waypoints: Location[];
  status?: 'planned' | 'in-progress' | 'completed';
  estimatedTime?: number; // in minutes
  distance?: number; // in km
  color?: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate total route distance
 */
export const calculateRouteTotalDistance = (waypoints: Location[]): number => {
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistance(
      waypoints[i].latitude,
      waypoints[i].longitude,
      waypoints[i + 1].latitude,
      waypoints[i + 1].longitude
    );
  }
  return total;
};

/**
 * Estimate travel time based on distance and average speed
 * Assumes average speed of 40 km/h for relief operations
 */
export const estimateTravelTime = (distanceKm: number): number => {
  const averageSpeed = 40; // km/h
  return Math.ceil((distanceKm / averageSpeed) * 60); // return in minutes
};

/**
 * Get color for route status
 */
export const getRouteStatusColor = (status?: string): string => {
  switch (status) {
    case 'planned':
      return colors.info;
    case 'in-progress':
      return colors.warning;
    case 'completed':
      return colors.success;
    default:
      return colors.primary;
  }
};

/**
 * Generate polyline coordinates for route
 * Creates intermediate points along route if needed
 */
export const generateRoutePolyline = (waypoints: Location[]): Array<{ latitude: number; longitude: number }> => {
  if (waypoints.length === 0) return [];
  if (waypoints.length === 1) return [{ latitude: waypoints[0].latitude, longitude: waypoints[0].longitude }];

  // Return waypoints as polyline coordinates
  return waypoints.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
  }));
};

/**
 * Create optimized routes by grouping nearby locations
 */
export const optimizeRoutes = (locations: Location[]): Route[] => {
  if (locations.length === 0) return [];

  const routes: Route[] = [];
  let routeId = 0;

  for (let i = 0; i < locations.length; i += 5) {
    const chunk = locations.slice(i, i + 5);
    const distance = calculateRouteTotalDistance(chunk);
    const estimatedTime = estimateTravelTime(distance);

    routes.push({
      id: `auto-route-${routeId}`,
      name: `Route ${routeId + 1}`,
      waypoints: chunk,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      estimatedTime,
    });

    routeId++;
  }

  return routes;
};

/**
 * Create a simple route between two locations
 */
export const createSimpleRoute = (start: Location, end: Location): Route => {
  const distance = calculateDistance(
    start.latitude,
    start.longitude,
    end.latitude,
    end.longitude
  );
  const estimatedTime = estimateTravelTime(distance);

  return {
    id: `route-simple-${Date.now()}`,
    name: 'Direct Route',
    waypoints: [start, end],
    distance: Math.round(distance * 10) / 10,
    estimatedTime,
  };
};

/**
 * Merge multiple routes into a single continuous route
 */
export const mergeRoutes = (routes: Route[]): Route => {
  const allWaypoints: Location[] = [];
  let totalDistance = 0;

  routes.forEach((route) => {
    allWaypoints.push(...route.waypoints);
    totalDistance += route.distance || 0;
  });

  const estimatedTime = estimateTravelTime(totalDistance);

  return {
    id: `merged-route-${Date.now()}`,
    name: 'Merged Route',
    waypoints: allWaypoints,
    distance: Math.round(totalDistance * 10) / 10,
    estimatedTime,
  };
};

/**
 * Sort locations in optimal order for visiting (nearest neighbor algorithm)
 */
export const optimizeLocationOrder = (locations: Location[]): Location[] => {
  if (locations.length <= 2) return locations;

  const visited = new Set<number>();
  const optimized: Location[] = [locations[0]];
  visited.add(0);

  while (visited.size < locations.length) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let i = 0; i < locations.length; i++) {
      if (!visited.has(i)) {
        const distance = calculateDistance(
          current.latitude,
          current.longitude,
          locations[i].latitude,
          locations[i].longitude
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
    }

    if (nearestIndex !== -1) {
      optimized.push(locations[nearestIndex]);
      visited.add(nearestIndex);
    }
  }

  return optimized;
};

/**
 * Generate route summary
 */
export const getRouteSummary = (route: Route): string => {
  const parts: string[] = [];

  if (route.waypoints.length > 0) {
    parts.push(`${route.waypoints.length} điểm dừng`);
  }

  if (route.distance) {
    parts.push(`${route.distance} km`);
  }

  if (route.estimatedTime) {
    parts.push(`~${route.estimatedTime} phút`);
  }

  return parts.join(' • ');
};
