import { apiClient } from './api-client';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  timestamp: string;
}

interface WindyAPIResponse {
  data?: {
    wind: {
      direction: number;
      speed: number;
    };
    temp: number;
    rh: number;
    press: number;
    rainAccu: number;
    cloudCover: number;
  };
}

export const weatherService = {
  /**
   * Fetch weather data from Windy API
   * Uses coordinates (lat, lon) to get location-specific weather
   */
  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // Windy API endpoint - requires API key from environment
      const apiKey = process.env.EXPO_PUBLIC_WINDY_API_KEY;
      if (!apiKey) {
        console.warn('EXPO_PUBLIC_WINDY_API_KEY not configured');
        return null;
      }

      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      return {
        temperature: data.current.temp_c,
        windSpeed: data.current.wind_kph,
        windDirection: data.current.wind_degree,
        precipitation: data.current.precip_mm,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        cloudCover: data.current.cloud,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather data fetch error:', error);
      return null;
    }
  },

  /**
   * Get multiple weather data points for flood risk assessment
   */
  async getFloodRiskIndicators(
    latitude: number,
    longitude: number
  ): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    rainTrend: number; // mm next 24 hours
    windSpeed: number;
    riverLevel?: number;
  } | null> {
    try {
      const weather = await this.getWeatherData(latitude, longitude);
      if (!weather) return null;

      // Simple risk assessment logic
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (weather.precipitation > 50) riskLevel = 'high';
      if (weather.precipitation > 100) riskLevel = 'critical';
      if (weather.precipitation > 20) riskLevel = 'medium';

      return {
        riskLevel,
        rainTrend: weather.precipitation,
        windSpeed: weather.windSpeed,
      };
    } catch (error) {
      console.error('Flood risk indicators error:', error);
      return null;
    }
  },
};
