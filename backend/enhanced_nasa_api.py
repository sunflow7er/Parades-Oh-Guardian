import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import time
from pathlib import Path

class EnhancedNASAAPI:
    """
    Enhanced NASA API integration with multiple data sources
    """
    
    def __init__(self):
        self.power_base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        self.giovanni_base_url = "https://giovanni.gsfc.nasa.gov/giovanni"
        self.cache_dir = Path('data/nasa_cache')
        self.cache_dir.mkdir(exist_ok=True)
        
        # NASA POWER parameters for weather analysis
        self.weather_parameters = {
            'T2M': 'Temperature at 2 Meters',
            'T2M_MAX': 'Maximum Temperature at 2 Meters', 
            'T2M_MIN': 'Minimum Temperature at 2 Meters',
            'PRECTOTCORR': 'Precipitation Corrected',
            'WS2M': 'Wind Speed at 2 Meters',
            'RH2M': 'Relative Humidity at 2 Meters',
            'PS': 'Surface Pressure',
            'QV2M': 'Specific Humidity at 2 Meters',
            'T2MDEW': 'Dew Point Temperature at 2 Meters',
            'GWETROOT': 'Root Zone Soil Wetness'
        }
    
    def fetch_comprehensive_weather_data(self, latitude, longitude, start_date, end_date):
        """
        Fetch comprehensive weather data from NASA POWER API
        """
        cache_key = f"nasa_{latitude}_{longitude}_{start_date}_{end_date}"
        cache_file = self.cache_dir / f"{cache_key}.json"
        
        # Check cache first
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                cached_data = json.load(f)
                if cached_data.get('timestamp', 0) > time.time() - 86400:  # 24h cache
                    print("Using cached NASA data")
                    return pd.DataFrame(cached_data['data'])
        
        print(f"Fetching NASA POWER data for {latitude}, {longitude}")
        
        params = {
            'start': start_date.strftime('%Y%m%d'),
            'end': end_date.strftime('%Y%m%d'),
            'latitude': latitude,
            'longitude': longitude,
            'community': 'ag',
            'parameters': ','.join(self.weather_parameters.keys()),
            'format': 'json',
            'header': 'true',
            'time-standard': 'utc'
        }
        
        try:
            response = requests.get(self.power_base_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Parse NASA data
            parameters = data['properties']['parameter']
            
            # Create comprehensive DataFrame
            dates = list(parameters['T2M'].keys())
            df = pd.DataFrame({
                'date': pd.to_datetime(dates, format='%Y%m%d'),
                'temperature': [parameters['T2M'][d] for d in dates],
                'temp_max': [parameters['T2M_MAX'][d] for d in dates],
                'temp_min': [parameters['T2M_MIN'][d] for d in dates],
                'precipitation': [parameters['PRECTOTCORR'][d] for d in dates],
                'wind_speed': [parameters['WS2M'][d] for d in dates],
                'humidity': [parameters['RH2M'][d] for d in dates],
                'pressure': [parameters['PS'][d] for d in dates],
                'dew_point': [parameters['T2MDEW'][d] for d in dates],
                'soil_moisture': [parameters['GWETROOT'][d] for d in dates]
            })
            
            # Clean invalid data (-999.0 values)
            df = df.replace(-999.0, np.nan)
            
            # Add derived meteorological indices
            df['heat_index'] = df.apply(self._calculate_heat_index, axis=1)
            df['wind_chill'] = df.apply(self._calculate_wind_chill, axis=1)
            df['comfort_index'] = df.apply(self._calculate_comfort_index, axis=1)
            
            # Add seasonal and temporal features
            df['month'] = df['date'].dt.month
            df['day'] = df['date'].dt.day
            df['day_of_year'] = df['date'].dt.dayofyear
            df['season'] = df['month'].apply(self._get_season)
            
            # Cache the results
            cache_data = {
                'data': df.to_dict('records'),
                'timestamp': time.time(),
                'source': 'NASA POWER API',
                'parameters': self.weather_parameters
            }
            
            with open(cache_file, 'w') as f:
                json.dump(cache_data, f, default=str)
            
            print(f"Successfully fetched {len(df)} days of NASA data")
            return df
            
        except requests.RequestException as e:
            print(f"NASA API Error: {e}")
            return None
        except Exception as e:
            print(f"Data processing error: {e}")
            return None
    
    def _calculate_heat_index(self, row):
        """Calculate heat index using NASA formula"""
        T = row['temperature']  # Celsius
        RH = row['humidity']     # Percentage
        
        if pd.isna(T) or pd.isna(RH) or T < 27:
            return T
        
        # Convert to Fahrenheit for calculation
        TF = T * 9/5 + 32
        
        # Rothfusz equation
        HI = (-42.379 + 2.04901523*TF + 10.14333127*RH 
              - 0.22475541*TF*RH - 6.83783e-3*TF*TF 
              - 5.481717e-2*RH*RH + 1.22874e-3*TF*TF*RH 
              + 8.5282e-4*TF*RH*RH - 1.99e-6*TF*TF*RH*RH)
        
        # Convert back to Celsius
        return (HI - 32) * 5/9
    
    def _calculate_wind_chill(self, row):
        """Calculate wind chill index"""
        T = row['temperature']  # Celsius
        V = row['wind_speed']   # m/s
        
        if pd.isna(T) or pd.isna(V) or T > 10:
            return T
        
        # Convert wind speed to km/h
        V_kmh = V * 3.6
        
        # Environment Canada formula
        WCI = 13.12 + 0.6215*T - 11.37*(V_kmh**0.16) + 0.3965*T*(V_kmh**0.16)
        return WCI
    
    def _calculate_comfort_index(self, row):
        """Calculate comfort index (0-100 scale)"""
        T = row['temperature']
        H = row['humidity']
        
        if pd.isna(T) or pd.isna(H):
            return 50  # neutral
        
        # Optimal conditions: 20-25°C, 40-60% humidity
        temp_score = max(0, 100 - abs(T - 22.5) * 4)
        humid_score = max(0, 100 - abs(H - 50) * 2)
        
        return (temp_score + humid_score) / 2
    
    def _get_season(self, month):
        """Get season from month"""
        if month in [12, 1, 2]:
            return 'Winter'
        elif month in [3, 4, 5]:
            return 'Spring'
        elif month in [6, 7, 8]:
            return 'Summer'
        else:
            return 'Autumn'
    
    def get_climate_statistics(self, latitude, longitude, years=20):
        """Get long-term climate statistics"""
        end_date = datetime.now() - timedelta(days=1)
        start_date = end_date - timedelta(days=365 * years)
        
        df = self.fetch_comprehensive_weather_data(latitude, longitude, start_date, end_date)
        
        if df is None or len(df) == 0:
            return None
        
        # Calculate monthly statistics
        monthly_stats = df.groupby('month').agg({
            'temperature': ['mean', 'std', 'min', 'max'],
            'temp_max': ['mean', 'max'],
            'temp_min': ['mean', 'min'], 
            'precipitation': ['mean', 'sum', 'max'],
            'wind_speed': ['mean', 'max'],
            'humidity': ['mean']
        }).round(2)
        
        # Calculate extreme weather frequency
        extremes = {
            'hot_days': len(df[df['temp_max'] > 35]) / len(df) * 100,
            'cold_days': len(df[df['temp_min'] < -10]) / len(df) * 100,
            'rainy_days': len(df[df['precipitation'] > 1]) / len(df) * 100,
            'windy_days': len(df[df['wind_speed'] > 10]) / len(df) * 100
        }
        
        return {
            'monthly_stats': monthly_stats.to_dict(),
            'extremes': extremes,
            'data_period': f"{start_date.year}-{end_date.year}",
            'total_days': len(df)
        }

# Global instance
nasa_api = EnhancedNASAAPI()
