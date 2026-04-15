import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MapComponent, MapMarker } from './MapComponent';
import { colors, spacing } from '../../lib/styling';
import { useTheme } from '../../lib/theme/ThemeContext';

interface WindyMapProps {
  markers?: MapMarker[];
  onMarkerPress?: (markerId: string) => void;
  showUserLocation?: boolean;
  style?: any;
}

export function WindyMap({
  markers = [],
  onMarkerPress,
  showUserLocation = true,
  style,
}: WindyMapProps) {
  const [showRain, setShowRain] = useState(false);
  const [showWind, setShowWind] = useState(false);
  const [showTemp, setShowTemp] = useState(false);
  const { colors: themeColors, isDark } = useTheme();

  const OverlayButton = ({
    active,
    label,
    onPress,
  }: {
    active: boolean;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.overlayButton,
        {
          backgroundColor: active ? themeColors.primary : 'rgba(0, 0, 0, 0.5)',
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.overlayButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <MapComponent
        markers={markers}
        onMarkerPress={onMarkerPress}
        showUserLocation={showUserLocation}
        showRainOverlay={showRain}
        showWindOverlay={showWind}
        showTemperatureOverlay={showTemp}
        style={styles.map}
      />

      {/* Overlay Control Buttons */}
      <View style={styles.overlayControls}>
        <OverlayButton
          active={showRain}
          label="🌧️ Rain"
          onPress={() => setShowRain(!showRain)}
        />
        <OverlayButton
          active={showWind}
          label="💨 Wind"
          onPress={() => setShowWind(!showWind)}
        />
        <OverlayButton
          active={showTemp}
          label="🌡️ Temp"
          onPress={() => setShowTemp(!showTemp)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlayControls: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 10,
  },
  overlayButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  overlayButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
