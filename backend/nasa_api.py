import requests
import json
from datetime import datetime, timedelta
import pandas as pd
from typing import Dict, List, Optional

class NASAWeatherAPI:
    """
    NASA POWER API client for fetching historical weather data
    """
    
    def __init__(self):
        self.base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        self.parameters = {
            'T2M': 'Temperature at 2 Meters (°C)',
            'PRECTOTCORR': 'Precipitation Corrected (mm/day)',
            'WS2M': 'Wind Speed at 2 Meters (m/s)',
            'RH2M': 'Relative Humidity at 2 Meters (%)'
        }
        self.cache = {}
    
    def get_historical_data(self, latitude: float, longitude: float, start_date: str, end_date: str) -> Dict:
        """
        Fetch 20 years of historical weather data from NASA POWER API
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate  
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            
        Returns:
            Dictionary containing weather data and metadata
        """
        
        # Create cache key
        cache_key = f"{latitude}_{longitude}_{start_date}_{end_date}"
        
        # Check cache first
        if cache_key in self.cache:
            print(f"🔄 Using cached data for {latitude}, {longitude}")
            return self.cache[cache_key]
        
        try:
            # Calculate 20-year historical range
            target_year = datetime.strptime(start_date, '%Y-%m-%d').year
            historical_start = f"{target_year - 20}-01-01"
            historical_end = f"{target_year - 1}-12-31"
            
            # Build API request parameters
            params = {
                'parameters': ','.join(self.parameters.keys()),
                'community': 'AG',
                'longitude': longitude,
                'latitude': latitude,
                'start': historical_start.replace('-', ''),
                'end': historical_end.replace('-', ''),
                'format': 'JSON'
            }
            
            print(f"🛰️ Fetching NASA data for coordinates ({latitude}, {longitude})")
            print(f"📅 Historical range: {historical_start} to {historical_end}")
            
            # Make API request
            response = requests.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Process and structure the data
            processed_data = self._process_nasa_data(data, latitude, longitude)
            
            # Cache the result
            self.cache[cache_key] = processed_data
            
            return processed_data
            
        except requests.RequestException as e:
            raise Exception(f"NASA API request failed: {str(e)}")
        except Exception as e:
            raise Exception(f"Data processing error: {str(e)}")
    
    def _process_nasa_data(self, raw_data: Dict, latitude: float, longitude: float) -> Dict:
        """
        Process raw NASA API response into structured format
        
        Args:
            raw_data: Raw JSON response from NASA API
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Processed weather data dictionary
        """
        
        try:
            # Extract parameters data
            parameters = raw_data['properties']['parameter']
            
            # Convert to DataFrame for easier analysis
            df_data = []
            
            # Get all dates from temperature data (assuming T2M always exists)
            dates = list(parameters['T2M'].keys())
            
            for date in dates:
                row = {'date': date}
                
                # Extract all parameters for this date
                for param in self.parameters.keys():
                    if param in parameters:
                        row[param] = parameters[param].get(date, None)
                
                df_data.append(row)
            
            # Create DataFrame
            df = pd.DataFrame(df_data)
            
            # Convert date column to datetime
            df['date'] = pd.to_datetime(df['date'], format='%Y%m%d')
            
            # Add derived columns
            df['month'] = df['date'].dt.month
            df['day'] = df['date'].dt.day
            df['year'] = df['date'].dt.year
            
            # Calculate weather risk flags
            df['very_hot'] = df['T2M'] > 35  # Temperature > 35°C
            df['very_cold'] = df['T2M'] < -10  # Temperature < -10°C
            df['very_wet'] = df['PRECTOTCORR'] > 25  # Precipitation > 25mm/day
            df['very_windy'] = df['WS2M'] > 13.9  # Wind speed > 50 km/h (13.9 m/s)
            
            # Calculate summary statistics
            summary_stats = {
                'total_days': len(df),
                'years_covered': df['year'].nunique(),
                'temperature_range': {
                    'min': df['T2M'].min(),
                    'max': df['T2M'].max(),
                    'mean': df['T2M'].mean()
                },
                'precipitation_stats': {
                    'mean_daily': df['PRECTOTCORR'].mean(),
                    'max_daily': df['PRECTOTCORR'].max(),
                    'rainy_days_pct': (df['PRECTOTCORR'] > 1).mean() * 100
                },
                'extreme_weather_frequency': {
                    'very_hot_days': df['very_hot'].sum(),
                    'very_cold_days': df['very_cold'].sum(),
                    'very_wet_days': df['very_wet'].sum(),
                    'very_windy_days': df['very_windy'].sum()
                }
            }
            
            return {
                'metadata': {
                    'latitude': latitude,
                    'longitude': longitude,
                    'data_source': 'NASA POWER API',
                    'parameters': self.parameters,
                    'total_records': len(df),
                    'date_range': {
                        'start': df['date'].min().strftime('%Y-%m-%d'),
                        'end': df['date'].max().strftime('%Y-%m-%d')
                    }
                },
                'daily_data': df.to_dict('records'),
                'summary_statistics': summary_stats,
                'raw_response': raw_data
            }
            
        except Exception as e:
            raise Exception(f"Error processing NASA data: {str(e)}")
    
    def get_location_info(self, latitude: float, longitude: float) -> Dict:
        """
        Get location information for coordinates (placeholder for future enhancement)
        """
        return {
            'latitude': latitude,
            'longitude': longitude,
            'region': 'Kazakhstan' if 40 < latitude < 56 and 46 < longitude < 88 else 'Unknown',
            'timezone': 'UTC+6' if 46 < longitude < 88 else 'UTC'
        }