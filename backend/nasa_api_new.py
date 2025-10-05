import requests
import json
import time
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class EnhancedNASAWeatherAPI:
    def __init__(self):
        self.base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        self.timeout = 30
        self.retry_attempts = 3
        self.cache = {}
        
        # Extended NASA POWER parameters
        self.parameters = {
            'T2M': 'Temperature at 2 Meters (°C)',
            'T2M_MAX': 'Maximum Temperature at 2 Meters (°C)', 
            'T2M_MIN': 'Minimum Temperature at 2 Meters (°C)',
            'PRECTOTCORR': 'Precipitation Corrected (mm/day)',
            'WS2M': 'Wind Speed at 2 Meters (m/s)',
            'WS2M_MAX': 'Maximum Wind Speed at 2 Meters (m/s)',
            'RH2M': 'Relative Humidity at 2 Meters (%)',
            'PS': 'Surface Pressure (kPa)',
            'QV2M': 'Specific Humidity at 2 Meters (g/kg)',
            'T2MDEW': 'Dew Point Temperature at 2 Meters (°C)'
        }
        
        # Activity thresholds for different activities
        self.activity_thresholds = {
            'wedding': {
                'max_rain': 3, 'ideal_temp_min': 20, 'ideal_temp_max': 26,
                'max_wind': 20, 'max_humidity': 65
            },
            'hiking': {
                'max_rain': 8, 'ideal_temp_min': 8, 'ideal_temp_max': 24,
                'max_wind': 35, 'max_humidity': 80
            },
            'outdoor': {
                'max_rain': 10, 'ideal_temp_min': 12, 'ideal_temp_max': 28,
                'max_wind': 30, 'max_humidity': 75
            },
            'general': {
                'max_rain': 15, 'ideal_temp_min': 15, 'ideal_temp_max': 30,
                'max_wind': 35, 'max_humidity': 75
            }
        }
        print("Enhanced NASA API initialized successfully")
    
    def get_weather_analysis(self, latitude: float, longitude: float, 
                            start_date: str, end_date: str, 
                            activity_type: str = 'general') -> Dict:
        """Get enhanced weather analysis using real NASA POWER satellite data"""
        
        print(f"Enhanced NASA POWER API analysis...")
        print(f"   Location: ({latitude}, {longitude})")
        print(f"   Period: {start_date} to {end_date}")
        print(f"   Activity: {activity_type}")
        
        analysis_start = time.time()
        
        try:
            # Parse dates
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            
            # Validate date range
            if (end_dt - start_dt).days > 365:
                raise ValueError("Date range too large (max 1 year)")
            
            # Get current conditions from recent NASA data
            print("   Fetching recent NASA conditions...")
            current_data = self._fetch_recent_nasa_data(latitude, longitude)
            
            # Get historical patterns for same time period
            print("   Fetching historical NASA patterns...")
            historical_data = self._fetch_historical_patterns(latitude, longitude, start_dt, end_dt)
            
            # Analyze each target date using real data patterns
            print("   Analyzing weather windows...")
            weather_windows = []
            
            current_date = start_dt
            day_count = 0
            total_days = (end_dt - start_dt).days + 1
            
            while current_date <= end_dt:
                day_count += 1
                print(f"   Processing day {day_count}/{total_days}: {current_date.strftime('%Y-%m-%d')}")
                
                day_analysis = self._analyze_with_real_data(
                    current_date, current_data, historical_data, 
                    latitude, longitude, activity_type
                )
                weather_windows.append(day_analysis)
                current_date += timedelta(days=1)
            
            # Sort by weather score
            weather_windows.sort(key=lambda x: x['weather_score'], reverse=True)
            
            analysis_time = time.time() - analysis_start
            
            return {
                'success': True,
                'analysis_time_seconds': round(analysis_time, 2),
                'activity_type': activity_type,
                'weather_windows': weather_windows,
                'top_recommendations': weather_windows[:3],
                'daily_analysis': weather_windows,
                'conditions': self._get_average_conditions(weather_windows),
                'risks': self._get_average_risks(weather_windows),
                'data_source_info': {
                    'primary': 'NASA POWER API - Real Satellite Data',
                    'parameters': list(self.parameters.keys()),
                    'coverage': '40+ years of global meteorological data',
                    'resolution': '0.5° x 0.625° global grid',
                    'update_frequency': 'Daily',
                    'accuracy': 'Validated against ground stations globally'
                },
                'methodology': {
                    'approach': 'Statistical analysis of real NASA satellite measurements',
                    'historical_baseline': '5-year patterns for same date ranges',
                    'current_conditions': 'Latest 30-day NASA observations',
                    'processing_time': f'{analysis_time:.2f}s'
                }
            }
            
        except Exception as e:
            print(f"Enhanced NASA API Error: {str(e)}")
            return self._fallback_analysis(latitude, longitude, start_date, end_date, activity_type)

    def _fetch_recent_nasa_data(self, latitude: float, longitude: float) -> List:
        """Fetch recent NASA data for current conditions"""
        
        # Get last 30 days for current conditions
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        cache_key = f"recent_{latitude}_{longitude}_{start_date.strftime('%Y%m%d')}"
        
        if cache_key in self.cache:
            print(f"   Using cached recent data ({len(self.cache[cache_key])} records)")
            return self.cache[cache_key]
        
        return self._fetch_nasa_data_for_period(latitude, longitude, start_date, end_date, cache_key)
    
    def _fetch_historical_patterns(self, latitude: float, longitude: float, 
                                 start_dt: datetime, end_dt: datetime) -> Dict:
        """Fetch historical NASA data for same date ranges (last 5 years for performance)"""
        
        current_year = datetime.now().year
        all_historical_data = []
        
        # Get data for same date range in previous 5 years (optimized from 10)
        for year_offset in range(1, 6):  # Last 5 years for faster processing
            hist_year = current_year - year_offset
            
            # Adjust dates to historical year
            hist_start = start_dt.replace(year=hist_year)
            hist_end = end_dt.replace(year=hist_year)
            
            # Skip if historical dates are in the future
            if hist_start > datetime.now():
                continue
            
            print(f"   Fetching {hist_year} historical data...")
            
            cache_key = f"hist_{latitude}_{longitude}_{hist_start.strftime('%Y%m%d')}"
            
            if cache_key in self.cache:
                year_data = self.cache[cache_key]
                print(f"   Using cached data for {hist_year} ({len(year_data)} records)")
            else:
                year_data = self._fetch_nasa_data_for_period(latitude, longitude, hist_start, hist_end, cache_key)
                if year_data:
                    print(f"   Retrieved {len(year_data)} records for {hist_year}")
            
            if year_data:
                all_historical_data.extend(year_data)
        
        print(f"   Total historical data points: {len(all_historical_data)}")
        return {'historical_records': all_historical_data}
    
    def _fetch_nasa_data_for_period(self, latitude: float, longitude: float, 
                                   start_date: datetime, end_date: datetime, cache_key: str) -> List:
        """Fetch NASA data for a specific period"""
        
        params = {
            'parameters': ','.join(self.parameters.keys()),
            'community': 'AG',
            'longitude': longitude,
            'latitude': latitude,
            'start': start_date.strftime('%Y%m%d'),
            'end': end_date.strftime('%Y%m%d'),
            'format': 'JSON'
        }
        
        try:
            response = requests.get(self.base_url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            processed_data = self._process_nasa_response(data)
            
            if processed_data:
                self.cache[cache_key] = processed_data
                
            return processed_data
            
        except Exception as e:
            print(f"   Warning: NASA data fetch failed: {e}")
            return []
    
    def _process_nasa_response(self, raw_data: Dict) -> List:
        """Process NASA API response into structured format"""
        
        try:
            if 'properties' not in raw_data or 'parameter' not in raw_data['properties']:
                return []
                
            parameters = raw_data['properties']['parameter']
            processed_records = []
            
            # Get all available dates
            if 'T2M' in parameters and isinstance(parameters['T2M'], dict):
                dates = list(parameters['T2M'].keys())
            else:
                return []
            
            for date_str in dates:
                try:
                    record = {
                        'date': datetime.strptime(date_str, '%Y%m%d'),
                        'temperature': self._safe_get_param(parameters, 'T2M', date_str),
                        'temp_max': self._safe_get_param(parameters, 'T2M_MAX', date_str),
                        'temp_min': self._safe_get_param(parameters, 'T2M_MIN', date_str),
                        'precipitation': self._safe_get_param(parameters, 'PRECTOTCORR', date_str, 0),
                        'wind_speed': self._safe_get_param(parameters, 'WS2M', date_str, 0),
                        'wind_max': self._safe_get_param(parameters, 'WS2M_MAX', date_str, 0),
                        'humidity': self._safe_get_param(parameters, 'RH2M', date_str, 50),
                        'pressure': self._safe_get_param(parameters, 'PS', date_str),
                        'specific_humidity': self._safe_get_param(parameters, 'QV2M', date_str)
                    }
                    
                    # Only include records with valid temperature data
                    if record['temperature'] is not None and record['temperature'] != -999:
                        processed_records.append(record)
                        
                except Exception as e:
                    continue  # Skip invalid records
            
            return processed_records
            
        except Exception as e:
            print(f"   NASA data processing error: {e}")
            return []
    
    def _safe_get_param(self, parameters: Dict, param_name: str, 
                       date_str: str, default=None):
        """Safely extract parameter value with type checking"""
        
        try:
            if param_name in parameters:
                param_data = parameters[param_name]
                if isinstance(param_data, dict) and date_str in param_data:
                    value = param_data[date_str]
                    # Handle NASA's missing data value
                    if value == -999:
                        return default
                    return value
            return default
        except:
            return default
    
    def _analyze_with_real_data(self, target_date: datetime, current_data: List, 
                               historical_data: Dict, latitude: float, longitude: float,
                               activity_type: str) -> Dict:
        """Analyze weather for target date using real NASA data"""
        
        # Get recent trends
        recent_records = current_data if isinstance(current_data, list) else []
        historical_records = historical_data.get('historical_records', [])
        
        # Find similar dates in historical data (same month/day ±5 days)
        similar_dates = []
        target_month = target_date.month
        target_day = target_date.day
        
        for record in historical_records:
            # Check if within same month and ±5 days
            if record['date'].month == target_month:
                day_diff = abs(record['date'].day - target_day)
                if day_diff <= 5:
                    similar_dates.append(record)
        
        if not similar_dates:
            return self._fallback_day_analysis(target_date, latitude, longitude, activity_type)
        
        # Calculate statistics from real NASA data
        temperatures = [r['temperature'] for r in similar_dates if r['temperature'] is not None]
        precipitations = [r['precipitation'] for r in similar_dates if r['precipitation'] is not None]
        wind_speeds = [r['wind_speed'] for r in similar_dates if r['wind_speed'] is not None]
        humidities = [r['humidity'] for r in similar_dates if r['humidity'] is not None]
        
        if not temperatures:
            return self._fallback_day_analysis(target_date, latitude, longitude, activity_type)
        
        # Use real NASA statistics
        avg_temp = sum(temperatures) / len(temperatures)
        avg_precip = sum(precipitations) / len(precipitations) if precipitations else 0
        avg_wind = sum(wind_speeds) / len(wind_speeds) if wind_speeds else 0
        avg_humidity = sum(humidities) / len(humidities) if humidities else 60
        
        # Calculate risks based on real data
        thresholds = self.activity_thresholds.get(activity_type, self.activity_thresholds['general'])
        
        rain_risk = min(100, (avg_precip / thresholds['max_rain']) * 100) if thresholds['max_rain'] > 0 else 0
        
        temp_risk = 0
        if avg_temp > 35: 
            temp_risk = 80
        elif avg_temp < -15: 
            temp_risk = 90
        elif avg_temp < thresholds['ideal_temp_min'] or avg_temp > thresholds['ideal_temp_max']:
            temp_risk = 40
        
        wind_risk = min(100, (avg_wind * 3.6 / thresholds['max_wind']) * 100) if thresholds['max_wind'] > 0 else 0
        
        weather_score = max(0, 100 - rain_risk - (temp_risk * 0.8) - (wind_risk * 0.6))
        
        return {
            'date': target_date.strftime('%Y-%m-%d'),
            'day_of_week': target_date.strftime('%A'),
            'weather_score': round(weather_score, 1),
            'overall_risk': round(rain_risk + temp_risk + wind_risk, 1),
            'confidence_score': min(100, len(similar_dates) * 10),
            'conditions': {
                'temperature': round(avg_temp, 1),
                'precipitation': round(avg_precip, 1),
                'wind_speed': round(avg_wind, 1),
                'humidity': round(avg_humidity, 1)
            },
            'risks': {
                'heavy_rain': {'probability': round(rain_risk, 1)},
                'temperature_extreme': {'probability': round(temp_risk, 1)},
                'strong_winds': {'probability': round(wind_risk, 1)}
            },
            'recommendation': self._get_recommendation(weather_score),
            'data_points': len(similar_dates),
            'data_source': 'NASA POWER Real Satellite Data'
        }
    
    def _fallback_analysis(self, lat, lon, start_date, end_date, activity_type):
        """Fallback when NASA API is unavailable"""
        return {
            'success': False,
            'error': 'NASA POWER API temporarily unavailable',
            'fallback_note': 'Please try again in a few moments'
        }
    
    def _fallback_day_analysis(self, date, lat, lon, activity_type):
        """Fallback analysis for single day"""
        return {
            'date': date.strftime('%Y-%m-%d'),
            'day_of_week': date.strftime('%A'),
            'weather_score': 50,
            'conditions': {
                'temperature': 15, 
                'precipitation': 5, 
                'wind_speed': 10, 
                'humidity': 60
            },
            'risks': {
                'heavy_rain': {'probability': 25},
                'temperature_extreme': {'probability': 25},
                'strong_winds': {'probability': 25}
            },
            'recommendation': 'Insufficient NASA data for reliable analysis',
            'data_points': 0,
            'data_source': 'Fallback estimation',
            'error': 'Insufficient NASA data for this date'
        }
    
    def _get_recommendation(self, score):
        """Generate recommendation based on weather score"""
        if score >= 80: 
            return "Excellent conditions based on NASA satellite data!"
        elif score >= 60: 
            return "Good conditions according to NASA measurements"
        elif score >= 40: 
            return "Moderate conditions - NASA data shows some risks"
        else: 
            return "Poor conditions indicated by NASA satellite observations"
    
    def _get_average_conditions(self, results):
        """Calculate average conditions across all results"""
        if not results: 
            return {}
        
        temps = [r['conditions']['temperature'] for r in results if 'conditions' in r and 'temperature' in r['conditions']]
        precips = [r['conditions']['precipitation'] for r in results if 'conditions' in r and 'precipitation' in r['conditions']]
        winds = [r['conditions']['wind_speed'] for r in results if 'conditions' in r and 'wind_speed' in r['conditions']]
        humidity = [r['conditions']['humidity'] for r in results if 'conditions' in r and 'humidity' in r['conditions']]
        
        return {
            'temperature': {'average': round(sum(temps) / len(temps), 1) if temps else 0},
            'precipitation': {'average_daily': round(sum(precips) / len(precips), 1) if precips else 0},
            'wind_speed': {'average': round(sum(winds) / len(winds), 1) if winds else 0},
            'humidity': {'average': round(sum(humidity) / len(humidity), 1) if humidity else 0}
        }
    
    def _get_average_risks(self, results):
        """Calculate average risks across all results"""
        if not results: 
            return {}
        
        rain_risks = [r['risks']['heavy_rain']['probability'] for r in results if 'risks' in r and 'heavy_rain' in r['risks']]
        temp_risks = [r['risks']['temperature_extreme']['probability'] for r in results if 'risks' in r and 'temperature_extreme' in r['risks']]
        wind_risks = [r['risks']['strong_winds']['probability'] for r in results if 'risks' in r and 'strong_winds' in r['risks']]
        
        return {
            'heavy_rain': {'probability': round(sum(rain_risks) / len(rain_risks), 1) if rain_risks else 0},
            'temperature_extreme': {'probability': round(sum(temp_risks) / len(temp_risks), 1) if temp_risks else 0},
            'strong_winds': {'probability': round(sum(wind_risks) / len(wind_risks), 1) if wind_risks else 0}
        }


# Test the enhanced API
if __name__ == "__main__":
    api = EnhancedNASAWeatherAPI()
    
    print("Enhanced NASA POWER API Test")
    print("Testing with sample coordinates...")
    
    result = api.get_weather_analysis(
        latitude=40.7128,
        longitude=-74.0060,
        start_date="2024-01-15",
        end_date="2024-01-17",
        activity_type="outdoor"
    )
    
    if result.get('success'):
        print("Enhanced NASA API test successful!")
        print(f"   Analyzed: {len(result.get('weather_windows', []))} days")
        print(f"   Data source: {result.get('data_source_info', {}).get('primary')}")
        print(f"   Analysis time: {result.get('analysis_time_seconds')}s")
    else:
        print(f"Test failed: {result.get('error')}")
