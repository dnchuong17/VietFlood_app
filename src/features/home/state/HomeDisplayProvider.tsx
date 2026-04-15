import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * HomeDisplayProvider
 *
 * Advanced state management for home screen display options including:
 * - Weather overlay visibility and selection
 * - Map display preferences
 * - Cached overlay selection and preferences
 *
 * This provider syncs state to AsyncStorage for persistence across app restarts.
 */

export type MapOverlay = 'rain' | 'wind' | 'temp' | 'clouds' | 'pressure' | 'rh';

type HomeDisplayState = {
  // Weather display
  isWeatherStatsVisible: boolean;
  overlay: MapOverlay;
  
  // Map preference
  isMapClustered: boolean;
  selectedMarkerCategory: 'all' | 'operations' | 'reports' | 'users';
  
  // UI state
  isLoading: boolean;
};

type HomeDisplayAction =
  | { type: 'toggleWeatherStatsVisibility' }
  | { type: 'setWeatherStatsVisibility'; payload: boolean }
  | { type: 'cycleOverlay' }
  | { type: 'setOverlay'; payload: MapOverlay }
  | { type: 'setMapClustered'; payload: boolean }
  | { type: 'setSelectedMarkerCategory'; payload: 'all' | 'operations' | 'reports' | 'users' }
  | { type: 'setIsLoading'; payload: boolean }
  | { type: 'restoreState'; payload: HomeDisplayState };

// Overlay cycling sequence
const OVERLAY_SEQUENCE: MapOverlay[] = [
  'rain',
  'wind',
  'temp',
  'rh',
  'clouds',
  'pressure',
];

// Initial state
const initialHomeDisplayState: HomeDisplayState = {
  isWeatherStatsVisible: false,
  overlay: 'rain',
  isMapClustered: true,
  selectedMarkerCategory: 'all',
  isLoading: true,
};

// Storage key
const STORAGE_KEY = '@vietflood_home_display_state';

/**
 * Reducer function for home display state
 */
function homeDisplayReducer(
  state: HomeDisplayState,
  action: HomeDisplayAction
): HomeDisplayState {
  switch (action.type) {
    case 'toggleWeatherStatsVisibility':
      return {
        ...state,
        isWeatherStatsVisible: !state.isWeatherStatsVisible,
      };

    case 'setWeatherStatsVisibility':
      return {
        ...state,
        isWeatherStatsVisible: action.payload,
      };

    case 'cycleOverlay': {
      const currentIndex = OVERLAY_SEQUENCE.indexOf(state.overlay);
      const nextIndex = (currentIndex + 1) % OVERLAY_SEQUENCE.length;
      return {
        ...state,
        overlay: OVERLAY_SEQUENCE[nextIndex],
      };
    }

    case 'setOverlay':
      return {
        ...state,
        overlay: action.payload,
      };

    case 'setMapClustered':
      return {
        ...state,
        isMapClustered: action.payload,
      };

    case 'setSelectedMarkerCategory':
      return {
        ...state,
        selectedMarkerCategory: action.payload,
      };

    case 'setIsLoading':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'restoreState':
      return action.payload;

    default:
      return state;
  }
}

type HomeDisplayContextValue = {
  state: HomeDisplayState;
  dispatch: React.Dispatch<HomeDisplayAction>;
};

const HomeDisplayContext = createContext<HomeDisplayContextValue | null>(null);

interface HomeDisplayProviderProps {
  children: ReactNode;
}

/**
 * HomeDisplayProvider Component
 *
 * Wraps the home screen and provides display state management
 * Automatically persists state to AsyncStorage
 *
 * @example
 * ```tsx
 * <HomeDisplayProvider>
 *   <HomeScreen />
 * </HomeDisplayProvider>
 * ```
 */
export function HomeDisplayProvider({ children }: HomeDisplayProviderProps) {
  const [state, dispatch] = useReducer(
    homeDisplayReducer,
    initialHomeDisplayState
  );

  // Load persisted state from AsyncStorage
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState: HomeDisplayState = JSON.parse(savedState);
          dispatch({
            type: 'restoreState',
            payload: { ...parsedState, isLoading: false },
          });
        } else {
          dispatch({ type: 'setIsLoading', payload: false });
        }
      } catch (error) {
        console.error('Failed to restore HomeDisplay state:', error);
        dispatch({ type: 'setIsLoading', payload: false });
      }
    };

    restoreState();
  }, []);

  // Persist state to AsyncStorage whenever it changes
  useEffect(() => {
    const persistState = async () => {
      try {
        // Don't persist loading state
        const { isLoading, ...stateToSave } = state;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to persist HomeDisplay state:', error);
      }
    };

    if (!state.isLoading) {
      persistState();
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <HomeDisplayContext.Provider value={value}>
      {children}
    </HomeDisplayContext.Provider>
  );
}

/**
 * useHomeDisplayState Hook
 *
 * Access home display state and dispatch actions
 *
 * @example
 * ```tsx
 * const { state, dispatch } = useHomeDisplayState();
 * dispatch({ type: 'cycleOverlay' });
 * ```
 */
export function useHomeDisplayState() {
  const context = useContext(HomeDisplayContext);

  if (!context) {
    throw new Error(
      'useHomeDisplayState must be used within HomeDisplayProvider'
    );
  }

  return context;
}

/**
 * useWeatherDisplay Hook
 *
 * Convenience hook for weather-related state and actions
 */
export function useWeatherDisplay() {
  const { state, dispatch } = useHomeDisplayState();

  return {
    isWeatherStatsVisible: state.isWeatherStatsVisible,
    overlay: state.overlay,
    toggleWeatherStats: useCallback(
      () => dispatch({ type: 'toggleWeatherStatsVisibility' }),
      [dispatch]
    ),
    setWeatherStatsVisible: useCallback(
      (visible: boolean) =>
        dispatch({ type: 'setWeatherStatsVisibility', payload: visible }),
      [dispatch]
    ),
    cycleOverlay: useCallback(
      () => dispatch({ type: 'cycleOverlay' }),
      [dispatch]
    ),
    setOverlay: useCallback(
      (overlay: MapOverlay) =>
        dispatch({ type: 'setOverlay', payload: overlay }),
      [dispatch]
    ),
  };
}

/**
 * useMapDisplay Hook
 *
 * Convenience hook for map-related state and actions
 */
export function useMapDisplay() {
  const { state, dispatch } = useHomeDisplayState();

  return {
    isMapClustered: state.isMapClustered,
    selectedMarkerCategory: state.selectedMarkerCategory,
    toggleMapClustering: useCallback(
      () => dispatch({ type: 'setMapClustered', payload: !state.isMapClustered }),
      [dispatch, state.isMapClustered]
    ),
    setMapClustered: useCallback(
      (clustered: boolean) =>
        dispatch({ type: 'setMapClustered', payload: clustered }),
      [dispatch]
    ),
    setMarkerCategory: useCallback(
      (category: 'all' | 'operations' | 'reports' | 'users') =>
        dispatch({ type: 'setSelectedMarkerCategory', payload: category }),
      [dispatch]
    ),
  };
}

/**
 * Overlay label mapping for display
 */
export const OVERLAY_LABELS: Record<MapOverlay, string> = {
  rain: 'Mưa',
  wind: 'Gió',
  temp: 'Nhiệt độ',
  rh: 'Độ ẩm',
  clouds: 'Mây',
  pressure: 'Áp suất',
};

/**
 * Get overlay color for UI display
 */
export function getOverlayColor(overlay: MapOverlay): string {
  const colorMap: Record<MapOverlay, string> = {
    rain: '#3b82f6', // blue
    wind: '#06b6d4', // cyan
    temp: '#ef4444', // red
    rh: '#8b5cf6', // purple
    clouds: '#f3f4f6', // gray
    pressure: '#f59e0b', // amber
  };
  return colorMap[overlay];
}

export type { HomeDisplayState, HomeDisplayAction };
