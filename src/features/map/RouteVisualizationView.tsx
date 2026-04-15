import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Location } from '../../types/reports';
import { colors, spacing, fonts, shadows } from '../../lib/styling';
import { Card } from '../../components';
import {
  Route,
  calculateRouteTotalDistance,
  estimateTravelTime,
  getRouteStatusColor,
  generateRoutePolyline,
  optimizeLocationOrder,
  getRouteSummary,
} from './route-utils';

interface RouteVisualizationViewProps {
  operationLocation: Location;
  destinations: Location[];
  operationName?: string;
  loading?: boolean;
  onRouteSelect?: (route: Route) => void;
}

/**
 * RouteVisualizationView component
 *
 * Displays routes between operation locations on a map.
 * Shows route statistics (distance, estimated time).
 *
 * @example
 * ```tsx
 * const origin: Location = { latitude: 20.8, longitude: 106.7 };
 * const destinations: Location[] = [
 *   { latitude: 20.81, longitude: 106.71 },
 *   { latitude: 20.82, longitude: 106.72 }
 * ];
 *
 * <RouteVisualizationView
 *   operationLocation={origin}
 *   destinations={destinations}
 *   operationName="Cứu Hộ A"
 * />
 * ```
 */
export const RouteVisualizationView: React.FC<RouteVisualizationViewProps> = ({
  operationLocation,
  destinations,
  operationName = 'Operation',
  loading = false,
  onRouteSelect,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Generate optimized route from operation to all destinations
  const mainRoute: Route = useMemo(() => {
    if (destinations.length === 0) {
      return {
        id: 'empty-route',
        name: 'No Destinations',
        waypoints: [operationLocation],
      };
    }

    // Optimize order of destinations
    const optimizedDest = optimizeLocationOrder(destinations);

    // Create route starting from operation location
    const routeWaypoints = [operationLocation, ...optimizedDest];
    const distance = calculateRouteTotalDistance(routeWaypoints);
    const estimatedTime = estimateTravelTime(distance);

    return {
      id: 'main-route',
      name: `${operationName} Route`,
      waypoints: routeWaypoints,
      distance: Math.round(distance * 10) / 10,
      estimatedTime,
      status: 'planned',
    };
  }, [operationLocation, destinations, operationName]);

  // Generate individual routes to each destination
  const individualRoutes: Route[] = useMemo(() => {
    return destinations.map((dest, index) => {
      const distance = Math.sqrt(
        Math.pow(dest.latitude - operationLocation.latitude, 2) +
          Math.pow(dest.longitude - operationLocation.longitude, 2)
      ) * 111; // Approximate km
      const estimatedTime = estimateTravelTime(distance);

      return {
        id: `route-${index}`,
        name: `To Destination ${index + 1}`,
        waypoints: [operationLocation, dest],
        distance: Math.round(distance * 10) / 10,
        estimatedTime,
      };
    });
  }, [operationLocation, destinations]);

  // Default to main route if none selected
  const displayRoute = selectedRoute || mainRoute;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const polylineCoordinates = generateRoutePolyline(displayRoute.waypoints);

  return (
    <View style={styles.container}>
      {/* Route Map */}
      {showMap && polylineCoordinates.length > 0 && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: displayRoute.waypoints[0]?.latitude || 20.8,
              longitude: displayRoute.waypoints[0]?.longitude || 106.7,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {/* Draw polyline for route */}
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor={getRouteStatusColor(displayRoute.status)}
              strokeWidth={3}
            />

            {/* Markers for waypoints */}
            {displayRoute.waypoints.map((waypoint, index) => (
              <Marker
                key={`waypoint-${index}`}
                coordinate={{
                  latitude: waypoint.latitude,
                  longitude: waypoint.longitude,
                }}
                title={index === 0 ? 'Start' : `Stop ${index}`}
                pinColor={index === 0 ? colors.primary : colors.success}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.toggleMapButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.toggleMapButtonText}>Hide Map</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showMap && (
        <TouchableOpacity
          style={styles.showMapButton}
          onPress={() => setShowMap(true)}
        >
          <Text style={styles.showMapButtonText}>📍 Show Map</Text>
        </TouchableOpacity>
      )}

      {/* Route Summary */}
      <View style={styles.summarySection}>
        <Card style={styles.summaryCard}>
          <Text style={styles.routeName}>{displayRoute.name}</Text>
          <View style={styles.routeStats}>
            {displayRoute.distance && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{displayRoute.distance} km</Text>
              </View>
            )}
            {displayRoute.estimatedTime && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Est. Time</Text>
                <Text style={styles.statValue}>~{displayRoute.estimatedTime} min</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Stops</Text>
              <Text style={styles.statValue}>{displayRoute.waypoints.length}</Text>
            </View>
          </View>
          {displayRoute.status && (
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getRouteStatusColor(displayRoute.status) },
                ]}
              >
                <Text style={styles.statusBadgeText}>{displayRoute.status}</Text>
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* Routes List */}
      <View style={styles.routesSection}>
        <Text style={styles.sectionTitle}>
          Routes ({individualRoutes.length + 1})
        </Text>

        {/* Main Route Option */}
        <RouteListItem
          route={mainRoute}
          isSelected={selectedRoute === null || selectedRoute?.id === mainRoute.id}
          onPress={() => {
            setSelectedRoute(null);
            onRouteSelect?.(mainRoute);
          }}
        />

        {/* Individual Route Options */}
        {individualRoutes.length > 0 && (
          <>
            <Text style={styles.subSectionTitle}>Individual Destinations</Text>
            <FlatList
              data={individualRoutes}
              renderItem={({ item }) => (
                <RouteListItem
                  route={item}
                  isSelected={selectedRoute?.id === item.id}
                  onPress={() => {
                    setSelectedRoute(item);
                    onRouteSelect?.(item);
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </View>
  );
};

interface RouteListItemProps {
  route: Route;
  isSelected: boolean;
  onPress: () => void;
}

function RouteListItem({ route, isSelected, onPress }: RouteListItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        style={isSelected ? { ...styles.routeItem, ...styles.routeItemSelected } : styles.routeItem}
      >
        <View style={styles.routeItemContent}>
          <View style={styles.routeItemInfo}>
            <Text style={styles.routeItemName}>{route.name}</Text>
            <Text style={styles.routeItemSummary}>
              {getRouteSummary(route)}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIndicatorText}>✓</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 300,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadows.md,
  },
  map: {
    flex: 1,
  },
  toggleMapButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 4,
    ...shadows.sm,
  },
  toggleMapButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  showMapButton: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  showMapButtonText: {
    color: colors.primary,
    fontSize: fonts.sizes.body,
    fontWeight: '600',
  },
  summarySection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  summaryCard: {
    padding: spacing.md,
  },
  routeName: {
    fontSize: fonts.sizes.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  statusRow: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  routesSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginVertical: spacing.md,
  },
  routeItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  routeItemSelected: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  routeItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeItemInfo: {
    flex: 1,
  },
  routeItemName: {
    fontSize: fonts.sizes.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  routeItemSummary: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '700',
  },
});
