import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_APPLE, Marker, Circle, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../lib/theme/ThemeContext';
import { colors, spacing } from '../../lib/styling';
import { useResponsiveLayout } from '../../lib/useResponsiveLayout';

interface MapViewProps {
  markers?: MapMarker[];
  onMarkerPress?: (markerId: string) => void;
  showUserLocation?: boolean;
  showWeatherOverlay?: boolean;
  showRainOverlay?: boolean;
  showWindOverlay?: boolean;
  showTemperatureOverlay?: boolean;
  style?: any;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  type?: 'report' | 'operation' | 'user';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface OverlayData {
  type: 'rain' | 'wind' | 'temperature';
  latitude: number;
  longitude: number;
  value: number;
  timestamp: string;
}

interface CachedOverlay {
  data: OverlayData[];
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export function MapComponent({
  markers = [],
  onMarkerPress,
  showUserLocation = true,
  showWeatherOverlay = false,
  showRainOverlay = false,
  showWindOverlay = false,
  showTemperatureOverlay = false,
  style,
}: MapViewProps) {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [overlayData, setOverlayData] = useState<OverlayData[]>([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const overlayCache = useRef<Map<string, CachedOverlay>>(new Map());
  const [clusteredMarkers, setClusteredMarkers] = useState<any[]>([]);

  const { colors: themeColors, isDark } = useTheme();
  const { isSmallPhone, isTablet } = useResponsiveLayout();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Cluster markers when they change or map region changes
  useEffect(() => {
    const clustered = clusterMarkers(markers);
    setClusteredMarkers(clustered);
  }, [markers]);

  // Load weather overlays when requested
  useEffect(() => {
    if ((showRainOverlay || showWindOverlay || showTemperatureOverlay) && userLocation) {
      loadWeatherOverlay();
    }
  }, [showRainOverlay, showWindOverlay, showTemperatureOverlay, userLocation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cluster markers for performance with large datasets
   * Implements a simple grid-based clustering algorithm
   */
  const clusterMarkers = useCallback(
    (markerList: MapMarker[]) => {
      if (markerList.length < 50) {
        return markerList; // No clustering needed for small datasets
      }

      const gridSize = 0.1; // 0.1 degree grid cells
      const clusters = new Map<string, MapMarker[]>();

      // Group markers by grid cell
      markerList.forEach((marker) => {
        const gridKey = `${Math.floor(marker.latitude / gridSize)},${Math.floor(
          marker.longitude / gridSize
        )}`;
        if (!clusters.has(gridKey)) {
          clusters.set(gridKey, []);
        }
        clusters.get(gridKey)?.push(marker);
      });

      // Convert clusters to marker representation
      const result: any[] = [];
      clusters.forEach((clusterMarkers) => {
        if (clusterMarkers.length === 1) {
          result.push(clusterMarkers[0]);
        } else {
          // Create cluster marker
          const avgLat = clusterMarkers.reduce((sum, m) => sum + m.latitude, 0) / clusterMarkers.length;
          const avgLon =
            clusterMarkers.reduce((sum, m) => sum + m.longitude, 0) / clusterMarkers.length;

          result.push({
            id: `cluster-${clusterMarkers.map((m) => m.id).join('-')}`,
            latitude: avgLat,
            longitude: avgLon,
            title: `${clusterMarkers.length} items`,
            isCluster: true,
            markerCount: clusterMarkers.length,
            markers: clusterMarkers,
          });
        }
      });

      return result;
    },
    []
  );

  /**
   * Load weather overlay with caching
   */
  const loadWeatherOverlay = useCallback(async () => {
    if (!userLocation) return;

    setOverlayLoading(true);
    try {
      const cacheKey = `overlay-${userLocation.coords.latitude.toFixed(2)}-${userLocation.coords.longitude.toFixed(2)}`;
      const cached = overlayCache.current.get(cacheKey);

      // Check if cache is valid (5 minutes TTL)
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        setOverlayData(cached.data);
        setOverlayLoading(false);
        return;
      }

      // Fetch new overlay data
      const newData = await generateWeatherOverlayData(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

      // Cache the data
      overlayCache.current.set(cacheKey, {
        data: newData,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000, // 5 minutes
      });

      setOverlayData(newData);
    } catch (error) {
      console.error('Failed to load weather overlay:', error);
    } finally {
      setOverlayLoading(false);
    }
  }, [userLocation]);

  /**
   * Generate weather overlay data for visualization
   * In production, this would fetch from Windy API
   */
  const generateWeatherOverlayData = async (
    lat: number,
    lon: number
  ): Promise<OverlayData[]> => {
    // Simulate weather grid data (in production, fetch from Windy API)
    const data: OverlayData[] = [];
    const gridSize = 0.05; // 0.05 degree grid

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Rain data (mm)
        if (showRainOverlay) {
          data.push({
            type: 'rain',
            latitude: lat + i * gridSize,
            longitude: lon + j * gridSize,
            value: Math.random() * 50, // 0-50mm
            timestamp: new Date().toISOString(),
          });
        }

        // Wind data (kph)
        if (showWindOverlay) {
          data.push({
            type: 'wind',
            latitude: lat + i * gridSize,
            longitude: lon + j * gridSize,
            value: Math.random() * 60, // 0-60 kph
            timestamp: new Date().toISOString(),
          });
        }

        // Temperature data (Celsius)
        if (showTemperatureOverlay) {
          data.push({
            type: 'temperature',
            latitude: lat + i * gridSize,
            longitude: lon + j * gridSize,
            value: 20 + Math.random() * 15, // 20-35°C
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return data;
  };

  const getMarkerColor = (type?: string, severity?: string) => {
    // Severity-based coloring for reports
    if (type === 'report') {
      switch (severity) {
        case 'critical':
          return '#7f1d1d'; // Dark red
        case 'high':
          return '#dc2626'; // Red
        case 'medium':
          return '#f59e0b'; // Orange
        case 'low':
          return '#eab308'; // Yellow
        default:
          return '#dc2626';
      }
    }

    switch (type) {
      case 'operation':
        return '#3b82f6'; // Blue
      case 'user':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  const getOverlayColor = (type: string, value: number) => {
    switch (type) {
      case 'rain':
        // Rain: low to high (green to dark blue)
        if (value < 10) return 'rgba(34, 197, 94, 0.6)'; // Green
        if (value < 25) return 'rgba(59, 130, 246, 0.6)'; // Blue
        if (value < 40) return 'rgba(139, 92, 246, 0.6)'; // Purple
        return 'rgba(220, 38, 38, 0.6)'; // Red

      case 'wind':
        // Wind: low to high (green to red)
        if (value < 15) return 'rgba(34, 197, 94, 0.5)'; // Green
        if (value < 30) return 'rgba(251, 191, 36, 0.5)'; // Yellow
        if (value < 45) return 'rgba(249, 115, 22, 0.5)'; // Orange
        return 'rgba(220, 38, 38, 0.5)'; // Red

      case 'temperature':
        // Temperature: cold to hot (blue to red)
        if (value < 10) return 'rgba(59, 130, 246, 0.5)'; // Blue
        if (value < 20) return 'rgba(34, 197, 94, 0.5)'; // Green
        if (value < 30) return 'rgba(251, 191, 36, 0.5)'; // Yellow
        return 'rgba(220, 38, 38, 0.5)'; // Red

      default:
        return 'rgba(107, 114, 128, 0.5)'; // Gray
    }
  };

  const initialRegion = userLocation
    ? {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 10.7769, // Vietnam center
        longitude: 106.7009,
        latitudeDelta: 5,
        longitudeDelta: 5,
      };

  const mapStyle = isDark ? darkMapStyle : lightMapStyle;

  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            customMapStyle={mapStyle}
            showsUserLocation={showUserLocation}
            followsUserLocation={false}
            showsMyLocationButton={true}
            zoomEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
          >
            {/* User Location Circle */}
            {showUserLocation && userLocation && (
              <Circle
                center={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                radius={userLocation.coords.accuracy || 20}
                fillColor="rgba(59, 130, 246, 0.1)"
                strokeColor="rgba(59, 130, 246, 0.5)"
                strokeWidth={2}
              />
            )}

            {/* Weather Overlay Visualization */}
            {overlayData.length > 0 &&
              overlayData.map((overlay, index) => {
                const color = getOverlayColor(overlay.type, overlay.value);
                return (
                  <Polygon
                    key={`${overlay.type}-${index}`}
                    coordinates={[
                      {
                        latitude: overlay.latitude - 0.025,
                        longitude: overlay.longitude - 0.025,
                      },
                      {
                        latitude: overlay.latitude + 0.025,
                        longitude: overlay.longitude - 0.025,
                      },
                      {
                        latitude: overlay.latitude + 0.025,
                        longitude: overlay.longitude + 0.025,
                      },
                      {
                        latitude: overlay.latitude - 0.025,
                        longitude: overlay.longitude + 0.025,
                      },
                    ]}
                    fillColor={color}
                    strokeColor={color}
                    strokeWidth={1}
                    geodesic
                  />
                );
              })}

            {/* Clustered Markers */}
            {clusteredMarkers.map((marker) => {
              if (marker.isCluster) {
                return (
                  <Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title={`${marker.markerCount} reports`}
                    pinColor="#8B5CF6" // Purple for clusters
                    onPress={() => {
                      // Zoom into cluster on press
                      mapRef.current?.animateToRegion(
                        {
                          latitude: marker.latitude,
                          longitude: marker.longitude,
                          latitudeDelta: 0.02,
                          longitudeDelta: 0.02,
                        },
                        300
                      );
                    }}
                  />
                );
              } else {
                return (
                  <Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title={marker.title}
                    description={marker.description}
                    pinColor={getMarkerColor(marker.type, marker.severity)}
                    onPress={() => onMarkerPress?.(marker.id)}
                  />
                );
              }
            })}
          </MapView>

          {/* Overlay Loading Indicator */}
          {overlayLoading && (
            <View style={styles.overlayLoadingContainer}>
              <ActivityIndicator size="small" color={themeColors.primary} />
              <Text style={[styles.overlayLoadingText, { color: themeColors.text }]}>
                Loading weather data...
              </Text>
            </View>
          )}

          {/* Weather Legend */}
          {(showRainOverlay || showWindOverlay || showTemperatureOverlay) && (
            <View style={[styles.legend, { backgroundColor: themeColors.bg }]}>
              {showRainOverlay && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: 'rgba(220, 38, 38, 0.6)' }]} />
                  <Text style={[styles.legendText, { color: themeColors.text }]}>
                    Heavy Rain
                  </Text>
                </View>
              )}
              {showWindOverlay && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: 'rgba(249, 115, 22, 0.6)' }]} />
                  <Text style={[styles.legendText, { color: themeColors.text }]}>
                    High Wind
                  </Text>
                </View>
              )}
              {showTemperatureOverlay && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: 'rgba(220, 38, 38, 0.6)' }]} />
                  <Text style={[styles.legendText, { color: themeColors.text }]}>
                    High Temp
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  overlayLoadingContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  overlayLoadingText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: spacing.xs,
  },
  legend: {
    position: 'absolute',
    bottom: 80,
    right: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

const lightMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#333333',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b3d9ff',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#7da3d4',
      },
    ],
  },
];

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#424242',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#424242',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#1a237e',
      },
    ],
  },
];
