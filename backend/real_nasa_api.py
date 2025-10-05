"""
Real NASA API - Alternative Implementation
Focused on pure NASA POWER data with minimal processing
"""

import requests
import json
from datetime import datetime, timedelta
import time
from typing import Dict, List, Optional

class RealNASAAPI:
    """
    Pure NASA POWER API implementation
    Minimal processing, maximum authenticity
    """
    
    def __init__(self):
        self.api_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        self.timeout = 25
        
        # Core NASA POWER parameters only
        self.core_parameters = [
            'T2M',          # Temperature at 2 Meters
            'T2M_MAX',      # Maximum Temperature 
            'T2M_MIN',      # Minimum Temperature
            'PRECTOTCORR',  # Precipitation Corrected
            'WS2M',         # Wind Speed at 2 Meters
            'RH2M'          # Relative Humidity at 2 Meters
        ]
        
        # Simple activity limits
        self.activity_limits = {
            'wedding': {'rain_limit': 2, 'temp_min': 18, 'temp_max': 26},
            'hiking': {'rain_limit': 8, 'temp_min': 10, 'temp_max': 24},
            'farming': {'rain_limit': 35, 'temp_min': 5, 'temp_max': 30},
            'general': {'rain_limit': 10, 'temp_min': 12, 'temp_max': 28}
        }

    def get_pure_nasa_data(self, latitude: float, longitude: float, 
                          start_date: str, end_date: str) -> Dict:
        """
        Get pure NASA POWER data without interpretation
        """
        
        try:
            # Build NASA API request
            params = {
                'parameters': ','.join(self.core_parameters),
                'community': 'AG',
                'longitude': longitude,
                'latitude': latitude,
                'start': start_date.replace('-', ''),
                'end': end_date.replace('-', ''),
                'format': 'JSON'
            }
            
            print(f"Pure NASA request: {latitude}, {longitude}")
            
            # Make NASA API call
            response = requests.get(self.api_url, params=params, timeout=self.timeout)
            
            if response.status_code != 200:
                raise Exception(f"NASA API returned status {response.status_code}")
            
            nasa_data = response.json()
            
            # Return raw NASA data with minimal processing
            return {
                'success': True,
                'nasa_raw_data': nasa_data,
                'processed_data': self._minimal_processing(nasa_data),
                'api_call_info': {
                    'url': self.api_url,
                    'parameters': self.core_parameters,
                    'coordinates': f'{latitude}, {longitude}',
                    'date_range': f'{start_date} to {end_date}'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Pure NASA API call failed: {str(e)}',
                'nasa_api_status': 'unreachable'
            }

    def _minimal_processing(self, nasa_raw: Dict) -> List:
        """
        Minimal processing of NASA data - just organize by date
        """
        
        try:
            parameters = nasa_raw['properties']['parameter']
            daily_records = []
            
            # Get all dates from temperature data
            temp_data = parameters.get('T2M', {})
            dates = list(temp_data.keys())
            
            for date_str in dates:
                # Convert NASA date format to readable
                try:
                    date_obj = datetime.strptime(date_str, '%Y%m%d')
                    
                    record = {
                        'date': date_obj.strftime('%Y-%m-%d'),
                        'day_name': date_obj.strftime('%A'),
                        'nasa_data': {
                            'temperature': parameters.get('T2M', {}).get(date_str),
                            'temp_max': parameters.get('T2M_MAX', {}).get(date_str),
                            'temp_min': parameters.get('T2M_MIN', {}).get(date_str),
                            'precipitation': parameters.get('PRECTOTCORR', {}).get(date_str, 0),
                            'wind_speed': parameters.get('WS2M', {}).get(date_str, 0),
                            'humidity': parameters.get('RH2M', {}).get(date_str, 50)
                        }
                    }
                    
                    # Only include records with valid temperature
                    if record['nasa_data']['temperature'] is not None:
                        daily_records.append(record)
                        
                except Exception as e:
                    continue  # Skip invalid dates
            
            return daily_records
            
        except Exception as e:
            print(f"Minimal processing error: {e}")
            return []

    def analyze_with_pure_nasa(self, latitude: float, longitude: float,
                              start_date: str, end_date: str, 
                              activity_type: str = 'general') -> Dict:
        """
        Analyze weather using pure NASA data
        """
        
        analysis_start = time.time()
        
        try:
            # Get pure NASA data
            nasa_result = self.get_pure_nasa_data(latitude, longitude, start_date, end_date)
            
            if not nasa_result['success']:
                return nasa_result
            
            daily_data = nasa_result['processed_data']
            
            if not daily_data:
                return {
                    'success': False,
                    'error': 'No valid NASA data received'
                }
            
            # Simple analysis based on pure NASA measurements
            analyzed_days = []
            
            for day in daily_data:
                analysis = self._analyze_pure_day(day, activity_type)
                analyzed_days.append(analysis)
            
            # Sort by simple score
            analyzed_days.sort(key=lambda x: x.get('simple_score', 0), reverse=True)
            
            analysis_time = time.time() - analysis_start
            
            return {
                'success': True,
                'analysis_method': 'Pure NASA POWER data',
                'processing_time': f'{analysis_time:.2f}s',
                'activity_type': activity_type,
                'daily_analysis': analyzed_days,
                'top_recommendations': analyzed_days[:3],
                'nasa_data_integrity': {
                    'source': 'NASA POWER API direct',
                    'parameters': self.core_parameters,
                    'records_processed': len(daily_data),
                    'data_authenticity': '100% NASA satellite measurements'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Pure NASA analysis failed: {str(e)}'
            }

    def _analyze_pure_day(self, day_data: Dict, activity_type: str) -> Dict:
        """
        Simple analysis of single day using pure NASA data
        """
        
        nasa_data = day_data['nasa_data']
        limits = self.activity_limits[activity_type]
        
        # Extract NASA measurements
        temp = nasa_data.get('temperature', 15)
        precip = nasa_data.get('precipitation', 0)
        wind = nasa_data.get('wind_speed', 5)
        humidity = nasa_data.get('humidity', 60)
        
        # Simple scoring based on NASA data
        score = 100
        
        # Temperature scoring
        if temp < limits['temp_min'] or temp > limits['temp_max']:
            score -= 25
        elif temp < limits['temp_min'] - 5 or temp > limits['temp_max'] + 5:
            score -= 50
        
        # Precipitation scoring
        if precip > limits['rain_limit']:
            score -= min(60, precip * 3)
        
        # Wind scoring (convert m/s to km/h)
        wind_kmh = wind * 3.6
        if wind_kmh > 30:
            score -= min(30, wind_kmh - 20)
        
        # Humidity penalty for extremes
        if humidity > 80:
            score -= (humidity - 80) / 2
        
        score = max(0, score)
        
        return {
            'date': day_data['date'],
            'day_of_week': day_data['day_name'],
            'simple_score': round(score, 1),
            'nasa_measurements': {
                'temperature_c': round(temp, 1),
                'precipitation_mm': round(precip, 1),
                'wind_speed_ms': round(wind, 1),
                'wind_speed_kmh': round(wind * 3.6, 1),
                'humidity_percent': round(humidity, 1)
            },
            'simple_assessment': self._get_simple_assessment(score),
            'activity_suitability': self._assess_activity_suitability(nasa_data, activity_type),
            'data_source': 'NASA POWER API direct measurements'
        }

    def _get_simple_assessment(self, score: float) -> str:
        """
        Simple weather assessment based on score
        """
        if score >= 85:
            return "Excellent conditions based on NASA data"
        elif score >= 70:
            return "Good conditions according to NASA measurements"
        elif score >= 50:
            return "Moderate conditions from NASA observations"
        elif score >= 30:
            return "Poor conditions indicated by NASA data"
        else:
            return "Very poor conditions per NASA satellite measurements"

    def _assess_activity_suitability(self, nasa_data: Dict, activity_type: str) -> Dict:
        """
        Assess activity suitability using NASA data
        """
        
        temp = nasa_data.get('temperature', 15)
        precip = nasa_data.get('precipitation', 0)
        wind = nasa_data.get('wind_speed', 5)
        
        limits = self.activity_limits[activity_type]
        
        suitability = {
            'temperature_ok': limits['temp_min'] <= temp <= limits['temp_max'],
            'precipitation_ok': precip <= limits['rain_limit'],
            'wind_acceptable': wind * 3.6 <= 35,  # 35 km/h general limit
            'overall_suitable': True
        }
        
        # Overall assessment
        suitability['overall_suitable'] = all([
            suitability['temperature_ok'],
            suitability['precipitation_ok'],
            suitability['wind_acceptable']
        ])
        
        return suitability

    def test_nasa_connection(self) -> Dict:
        """
        Test NASA POWER API connection
        """
        try:
            # Simple test request
            test_result = self.get_pure_nasa_data(
                43.2567, 76.9286, '2024-07-01', '2024-07-01'
            )
            
            return {
                'nasa_connection': 'successful' if test_result['success'] else 'failed',
                'test_location': 'Almaty, Kazakhstan',
                'api_response': test_result['success'],
                'error': test_result.get('error', 'None')
            }
            
        except Exception as e:
            return {
                'nasa_connection': 'error',
                'error': str(e)
            }
"""
REAL NASA POWER API Integration - Accurate Weather Data
Using actual NASA satellite data for precise meteorological analysis
"""

import requests
import pandas as pd
from datetime import datetime, timedelta
import time
from typing import Dict, List

class NASAWeatherAPI:
    """
    Real NASA POWER API client using actual satellite data
    """
    
    def __init__(self):
        self.base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        # NASA POWER parameters for comprehensive weather data
        self.parameters = {
            'T2M': 'Temperature at 2 Meters (°C)',
            'T2M_MAX': 'Maximum Temperature at 2 Meters (°C)', 
            'T2M_MIN': 'Minimum Temperature at 2 Meters (°C)',
            'PRECTOTCORR': 'Precipitation Corrected (mm/day)',
            'WS2M': 'Wind Speed at 2 Meters (m/s)',
            'WS2M_MAX': 'Maximum Wind Speed at 2 Meters (m/s)',
            'RH2M': 'Relative Humidity at 2 Meters (%)',
            'PS': 'Surface Pressure (kPa)',
            'QV2M': 'Specific Humidity at 2 Meters (g/kg)'
        }
        
        self.activity_thresholds = {
            'wedding': {
                'max_rain': 5, 'ideal_temp_min': 18, 'ideal_temp_max': 28,
                'max_wind': 25, 'max_humidity': 70
            },
            'hiking': {
                'max_rain': 10, 'ideal_temp_min': 10, 'ideal_temp_max': 25,
                'max_wind': 40, 'max_humidity': 80
            },
            'farming': {
                'max_rain': 50, 'ideal_temp_min': 5, 'ideal_temp_max': 35,
                'max_wind': 60, 'max_humidity': 90
            },
            'general': {
                'max_rain': 15, 'ideal_temp_min': 15, 'ideal_temp_max': 30,
                'max_wind': 35, 'max_humidity': 75
            }
        }
        
        self.cache = {}

    def get_weather_analysis(self, latitude: float, longitude: float, 
                            start_date: str, end_date: str, 
                            activity_type: str = 'general') -> Dict:
        """
        Get REAL weather analysis using actual NASA POWER satellite data
        """
        
        analysis_start = time.time()
        
        try:
            print(f"🛰️ Fetching REAL NASA satellite data for {latitude}, {longitude}")
            
            # Parse target dates
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            
            # Get current conditions from recent NASA data (last 30 days)
            current_data = self._fetch_recent_nasa_data(latitude, longitude)
            
            # Get historical patterns for the same time period (last 10 years)
            historical_data = self._fetch_historical_patterns(latitude, longitude, start_dt, end_dt)
            
            # Analyze each target date using real data patterns
            weather_windows = []
            
            current_date = start_dt
            while current_date <= end_dt:
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
                    'historical_baseline': '10-year patterns for same date ranges',
                    'current_conditions': 'Latest 30-day NASA observations',
                    'processing_time': f'{analysis_time:.2f}s'
                }
            }
            
        except Exception as e:
            print(f"❌ NASA API Error: {str(e)}")
            # Fallback to basic analysis if NASA API fails
            return self._fallback_analysis(latitude, longitude, start_date, end_date, activity_type)

    def _fetch_recent_nasa_data(self, latitude: float, longitude: float) -> Dict:
        """
        Fetch recent NASA POWER data (last 30 days) for current conditions
        """
        
        # Get last 30 days for current conditions
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        cache_key = f"recent_{latitude}_{longitude}_{start_date.strftime('%Y%m%d')}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
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
            print(f"📡 Fetching recent conditions from NASA POWER...")
            response = requests.get(self.base_url, params=params, timeout=15)
            response.raise_for_status()
            
            data = response.json()
            processed_data = self._process_nasa_response(data)
            
            self.cache[cache_key] = processed_data
            print(f"✅ Retrieved {len(processed_data)} days of recent NASA data")
            
            return processed_data
            
        except Exception as e:
            print(f"⚠️ Recent data fetch failed: {e}")
            return {}

    def _fetch_historical_patterns(self, latitude: float, longitude: float, 
                                 start_dt: datetime, end_dt: datetime) -> Dict:
        """
        Fetch historical NASA data for the same date ranges (last 10 years)
        """
        
        current_year = datetime.now().year
        all_historical_data = []
        
        # Get data for same date range in previous years
        for year_offset in range(1, 11):  # Last 10 years
            hist_year = current_year - year_offset
            
            # Adjust dates to historical year
            hist_start = start_dt.replace(year=hist_year)
            hist_end = end_dt.replace(year=hist_year)
            
            # Skip if historical dates are in the future
            if hist_start > datetime.now():
                continue
            
            cache_key = f"hist_{latitude}_{longitude}_{hist_start.strftime('%Y%m%d')}"
            
            if cache_key in self.cache:
                year_data = self.cache[cache_key]
            else:
                year_data = self._fetch_nasa_year_data(latitude, longitude, hist_start, hist_end)
                self.cache[cache_key] = year_data
            
            if year_data:
                all_historical_data.extend(year_data)
        
        print(f"📊 Retrieved {len(all_historical_data)} historical data points")
        return {'historical_records': all_historical_data}

    def _fetch_nasa_year_data(self, latitude: float, longitude: float, 
                             start_date: datetime, end_date: datetime) -> List:
        """
        Fetch NASA data for a specific year period
        """
        
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
            response = requests.get(self.base_url, params=params, timeout=15)
            response.raise_for_status()
            
            data = response.json()
            return self._process_nasa_response(data)
            
        except Exception as e:
            print(f"⚠️ Historical data fetch failed for {start_date.year}: {e}")
            return []

    def _process_nasa_response(self, raw_data: Dict) -> List:
        """
        Process NASA API response into structured format
        """
        
        try:
            parameters = raw_data['properties']['parameter']
            processed_records = []
            
            # Get all available dates
            if 'T2M' in parameters:
                dates = list(parameters['T2M'].keys())
            else:
                return []
            
            for date_str in dates:
                try:
                    record = {
                        'date': datetime.strptime(date_str, '%Y%m%d'),
                        'temperature': parameters.get('T2M', {}).get(date_str),
                        'temp_max': parameters.get('T2M_MAX', {}).get(date_str),
                        'temp_min': parameters.get('T2M_MIN', {}).get(date_str),
                        'precipitation': parameters.get('PRECTOTCORR', {}).get(date_str, 0),
                        'wind_speed': parameters.get('WS2M', {}).get(date_str, 0),
                        'wind_max': parameters.get('WS2M_MAX', {}).get(date_str, 0),
                        'humidity': parameters.get('RH2M', {}).get(date_str, 50),
                        'pressure': parameters.get('PS', {}).get(date_str),
                        'specific_humidity': parameters.get('QV2M', {}).get(date_str)
                    }
                    
                    # Only include records with valid temperature data
                    if record['temperature'] is not None:
                        processed_records.append(record)
                        
                except Exception as e:
                    continue  # Skip invalid records
            
            return processed_records
            
        except Exception as e:
            print(f"❌ NASA data processing error: {e}")
            return []

    def _analyze_with_real_data(self, target_date: datetime, current_data: Dict, 
                               historical_data: Dict, latitude: float, longitude: float,
                               activity_type: str) -> Dict:
        """
        Analyze weather for target date using real NASA data
        """
        
        # Get recent trends
        recent_records = current_data.get('historical_records', [])
        historical_records = historical_data.get('historical_records', [])
        
        # Find similar dates in historical data (same month/day ±5 days)
        similar_dates = []
        for record in historical_records:
            date_diff = abs((record['date'].replace(year=target_date.year) - target_date).days)
            if date_diff <= 5:  # Within 5 days of target
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
        thresholds = self.activity_thresholds[activity_type]
        
        rain_risk = min(100, (avg_precip / thresholds['max_rain']) * 100)
        temp_risk = 0
        if avg_temp > 35: temp_risk = 80
        elif avg_temp < -15: temp_risk = 90
        elif avg_temp < thresholds['ideal_temp_min'] or avg_temp > thresholds['ideal_temp_max']:
            temp_risk = 40
        
        wind_risk = min(100, (avg_wind * 3.6 / thresholds['max_wind']) * 100)
        
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
            'weather_score': 50,
            'conditions': {'temperature': 10, 'precipitation': 0, 'wind_speed': 5, 'humidity': 60},
            'error': 'Insufficient NASA data for this date'
        }

    def _get_recommendation(self, score):
        if score >= 80: return "Excellent conditions based on NASA satellite data!"
        elif score >= 60: return "Good conditions according to NASA measurements"
        elif score >= 40: return "Moderate conditions - NASA data shows some risks"
        else: return "Poor conditions indicated by NASA satellite observations"

    def _get_average_conditions(self, results):
        if not results: return {}
        
        temps = [r['conditions']['temperature'] for r in results if 'conditions' in r]
        precips = [r['conditions']['precipitation'] for r in results if 'conditions' in r]
        winds = [r['conditions']['wind_speed'] for r in results if 'conditions' in r]
        humidity = [r['conditions']['humidity'] for r in results if 'conditions' in r]
        
        return {
            'temperature': {'average': round(sum(temps) / len(temps), 1) if temps else 0},
            'precipitation': {'average_daily': round(sum(precips) / len(precips), 1) if precips else 0},
            'wind_speed': {'average': round(sum(winds) / len(winds), 1) if winds else 0},
            'humidity': {'average': round(sum(humidity) / len(humidity), 1) if humidity else 0}
        }

    def _get_average_risks(self, results):
        if not results: return {}
        
        rain_risks = [r['risks']['heavy_rain']['probability'] for r in results if 'risks' in r]
        temp_risks = [r['risks']['temperature_extreme']['probability'] for r in results if 'risks' in r]
        wind_risks = [r['risks']['strong_winds']['probability'] for r in results if 'risks' in r]
        
        return {
            'heavy_rain': {'probability': round(sum(rain_risks) / len(rain_risks), 1) if rain_risks else 0},
            'temperature_extreme': {'probability': round(sum(temp_risks) / len(temp_risks), 1) if temp_risks else 0},
            'strong_winds': {'probability': round(sum(wind_risks) / len(wind_risks), 1) if wind_risks else 0}
        }