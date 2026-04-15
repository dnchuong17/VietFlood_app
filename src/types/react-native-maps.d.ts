declare module 'react-native-maps' {
  import { ViewProps, ViewStyle } from 'react-native';
  import { ReactNode } from 'react';

  export const PROVIDER_GOOGLE: string;
  export const PROVIDER_APPLE: string;

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface MapViewProps extends ViewProps {
    region?: Region;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    provider?: string;
    style?: ViewStyle;
    children?: ReactNode;
    zoomEnabled?: boolean;
    scrollEnabled?: boolean;
    pitchEnabled?: boolean;
    rotateEnabled?: boolean;
    toolbarEnabled?: boolean;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    followsUserLocation?: boolean;
    initialRegion?: Region;
    camera?: any;
    onMapReady?: () => void;
    customMapStyle?: any[];
  }

  export interface MarkerProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    image?: any;
    onPress?: () => void;
    children?: ReactNode;
    pinColor?: string;
  }

  export interface CircleProps {
    center: LatLng;
    radius: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  }

  export interface PolylineProps {
    coordinates: LatLng[];
    strokeColor?: string;
    strokeWidth?: number;
    geodesic?: boolean;
    tappable?: boolean;
    onPress?: () => void;
  }

  export interface PolygonProps {
    coordinates: LatLng[];
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    tappable?: boolean;
    onPress?: () => void;
    geodesic?: boolean;
  }

  export default class MapView extends React.Component<MapViewProps> {
    animateToRegion(region: Region, duration?: number): void;
    animateToCoordinate(latLng: LatLng, duration?: number): void;
    fitToCoordinates(coordinates: LatLng[], options?: any): void;
  }

  export class Marker extends React.Component<MarkerProps> {}
  export class Circle extends React.Component<CircleProps> {}
  export class Polyline extends React.Component<PolylineProps> {}
  export class Polygon extends React.Component<PolygonProps> {}
}
