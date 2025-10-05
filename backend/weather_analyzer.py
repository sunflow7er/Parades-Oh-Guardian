"""
Weather Analyzer - Statistical Analysis Module  
Traditional weather pattern analysis for outdoor event planning
"""

import statistics
import math
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class WeatherAnalyzer:
    """
    Traditional weather analyzer with statistical methods
    """
    
    def __init__(self):
        self.historical_weight = 0.7
        self.recent_weight = 0.3
        self.confidence_threshold = 50
        
        # Weather risk thresholds
        self.risk_thresholds = {
            'temperature': {'very_hot': 35, 'very_cold': -15},
            'precipitation': {'heavy_rain': 25, 'moderate_rain': 10},
            'wind': {'strong_wind': 50, 'moderate_wind': 25},
            'humidity': {'very_humid': 85, 'very_dry': 20}
        }
        
        # Activity-specific comfort ranges
        self.comfort_ranges = {
            'wedding': {
                'temp_min': 18, 'temp_max': 28, 'max_rain': 5, 'max_wind': 25
            },
            'hiking': {
                'temp_min': 10, 'temp_max': 25, 'max_rain': 15, 'max_wind': 40
            },
            'farming': {
                'temp_min': 0, 'temp_max': 35, 'max_rain': 40, 'max_wind': 60
            },
            'general': {
                'temp_min': 15, 'temp_max': 30, 'max_rain': 12, 'max_wind': 35
            }
        }

    def analyze_weather_patterns(self, historical_data: List[Dict], 
                               target_dates: List[str], 
                               activity_type: str = 'general') -> Dict:
        """
        Analyze weather patterns for given target dates
        """
        
        try:
            if not historical_data:
                return self._generate_fallback_analysis(target_dates, activity_type)
            
            # Process historical data
            processed_data = self._process_historical_data(historical_data)
            
            # Calculate baseline statistics
            baseline_stats = self._calculate_baseline_statistics(processed_data)
            
            # Analyze seasonal patterns
            seasonal_patterns = self._analyze_seasonal_patterns(processed_data)
            
            # Generate predictions for each target date
            predictions = []
            for date_str in target_dates:
                target_date = datetime.strptime(date_str, '%Y-%m-%d')
                prediction = self._predict_weather_for_date(
                    target_date, processed_data, baseline_stats, 
                    seasonal_patterns, activity_type
                )
                predictions.append(prediction)
            
            # Sort predictions by suitability score
            predictions.sort(key=lambda x: x.get('suitability_score', 0), reverse=True)
            
            return {
                'success': True,
                'analysis_method': 'Statistical Weather Pattern Analysis',
                'baseline_statistics': baseline_stats,
                'seasonal_patterns': seasonal_patterns,
                'predictions': predictions,
                'top_recommendations': predictions[:3],
                'activity_analysis': self._analyze_activity_suitability(predictions, activity_type),
                'data_quality': {
                    'records_analyzed': len(processed_data),
                    'date_range': self._get_data_date_range(processed_data),
                    'completeness': self._assess_data_completeness(processed_data)
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Weather pattern analysis failed: {str(e)}',
                'fallback_analysis': self._generate_fallback_analysis(target_dates, activity_type)
            }

    def _process_historical_data(self, raw_data: List[Dict]) -> List[Dict]:
        """Process and validate historical weather data"""
        
        processed = []
        
        for record in raw_data:
            try:
                # Extract and validate data
                processed_record = {
                    'date': self._parse_date(record.get('date')),
                    'temperature': float(record.get('temperature', 15)),
                    'precipitation': float(record.get('precipitation', 0)),
                    'wind_speed': float(record.get('wind_speed', 5)),
                    'humidity': float(record.get('humidity', 60)),
                    'pressure': float(record.get('pressure', 1013.25))
                }
                
                # Add derived fields
                processed_record['month'] = processed_record['date'].month
                processed_record['day_of_year'] = processed_record['date'].timetuple().tm_yday
                processed_record['season'] = self._determine_season(processed_record['month'])
                
                processed.append(processed_record)
                
            except (ValueError, TypeError, AttributeError):
                continue  # Skip invalid records
        
        return processed

    def _parse_date(self, date_input) -> datetime:
        """Parse date from various input formats"""
        
        if isinstance(date_input, datetime):
            return date_input
        elif isinstance(date_input, str):
            # Try common date formats
            for fmt in ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y', '%d/%m/%Y']:
                try:
                    return datetime.strptime(date_input, fmt)
                except ValueError:
                    continue
        
        raise ValueError(f"Unable to parse date: {date_input}")

    def _determine_season(self, month: int) -> str:
        """Determine season from month number"""
        
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:  # [9, 10, 11]
            return 'autumn'

    def _calculate_baseline_statistics(self, processed_data: List[Dict]) -> Dict:
        """Calculate baseline weather statistics"""
        
        if not processed_data:
            return {}
        
        # Extract parameter lists
        temperatures = [r['temperature'] for r in processed_data]
        precipitations = [r['precipitation'] for r in processed_data]
        wind_speeds = [r['wind_speed'] for r in processed_data]
        humidities = [r['humidity'] for r in processed_data]
        
        return {
            'temperature': {
                'mean': statistics.mean(temperatures),
                'median': statistics.median(temperatures),
                'std_dev': statistics.stdev(temperatures) if len(temperatures) > 1 else 0,
                'min': min(temperatures),
                'max': max(temperatures)
            },
            'precipitation': {
                'mean': statistics.mean(precipitations),
                'median': statistics.median(precipitations),
                'total_days_with_rain': sum(1 for p in precipitations if p > 1),
                'heavy_rain_days': sum(1 for p in precipitations if p > 25)
            },
            'wind_speed': {
                'mean': statistics.mean(wind_speeds),
                'median': statistics.median(wind_speeds),
                'strong_wind_days': sum(1 for w in wind_speeds if w > 15)
            },
            'humidity': {
                'mean': statistics.mean(humidities),
                'median': statistics.median(humidities),
                'very_humid_days': sum(1 for h in humidities if h > 85)
            }
        }

    def _analyze_seasonal_patterns(self, processed_data: List[Dict]) -> Dict:
        """Analyze seasonal weather patterns"""
        
        seasonal_data = {'winter': [], 'spring': [], 'summer': [], 'autumn': []}
        
        # Group data by season
        for record in processed_data:
            seasonal_data[record['season']].append(record)
        
        seasonal_analysis = {}
        
        for season, records in seasonal_data.items():
            if records:
                temps = [r['temperature'] for r in records]
                precips = [r['precipitation'] for r in records]
                
                seasonal_analysis[season] = {
                    'avg_temperature': statistics.mean(temps),
                    'temp_range': max(temps) - min(temps),
                    'avg_precipitation': statistics.mean(precips),
                    'rainy_days_percent': (sum(1 for p in precips if p > 1) / len(precips)) * 100,
                    'record_count': len(records)
                }
        
        return seasonal_analysis

    def _predict_weather_for_date(self, target_date: datetime, processed_data: List[Dict],
                                baseline_stats: Dict, seasonal_patterns: Dict, 
                                activity_type: str) -> Dict:
        """Predict weather conditions for a specific target date"""
        
        # Find similar historical dates (same month, ±15 days)
        similar_dates = self._find_similar_dates(target_date, processed_data)
        
        if not similar_dates:
            return self._generate_fallback_prediction(target_date, activity_type)
        
        # Calculate predictions from similar dates
        predicted_conditions = self._calculate_predicted_conditions(similar_dates)
        
        # Assess risks based on historical patterns
        risk_assessment = self._assess_weather_risks(predicted_conditions, similar_dates)
        
        # Calculate suitability for the activity
        suitability_score = self._calculate_activity_suitability(
            predicted_conditions, activity_type
        )
        
        # Calculate confidence based on data quality
        confidence_score = self._calculate_confidence_score(similar_dates, baseline_stats)
        
        return {
            'date': target_date.strftime('%Y-%m-%d'),
            'day_of_week': target_date.strftime('%A'),
            'predicted_conditions': predicted_conditions,
            'risk_assessment': risk_assessment,
            'suitability_score': round(suitability_score, 1),
            'confidence_score': round(confidence_score, 1),
            'activity_type': activity_type,
            'recommendation': self._generate_recommendation(
                suitability_score, risk_assessment
            ),
            'similar_dates_analyzed': len(similar_dates),
            'season': self._determine_season(target_date.month)
        }

    def _find_similar_dates(self, target_date: datetime, 
                           processed_data: List[Dict]) -> List[Dict]:
        """Find historically similar dates"""
        
        target_month = target_date.month
        target_day = target_date.day
        
        similar_dates = []
        
        for record in processed_data:
            # Same month check
            if record['month'] == target_month:
                # Within ±15 days check
                day_difference = abs(record['date'].day - target_day)
                if day_difference <= 15:
                    similar_dates.append(record)
        
        return similar_dates

    def _calculate_predicted_conditions(self, similar_dates: List[Dict]) -> Dict:
        """Calculate predicted conditions from similar historical dates"""
        
        temperatures = [r['temperature'] for r in similar_dates]
        precipitations = [r['precipitation'] for r in similar_dates]
        wind_speeds = [r['wind_speed'] for r in similar_dates]
        humidities = [r['humidity'] for r in similar_dates]
        
        return {
            'temperature': round(statistics.mean(temperatures), 1),
            'temperature_range': {
                'min': round(min(temperatures), 1),
                'max': round(max(temperatures), 1)
            },
            'precipitation': round(statistics.mean(precipitations), 1),
            'wind_speed': round(statistics.mean(wind_speeds), 1),
            'humidity': round(statistics.mean(humidities), 1)
        }

    def _assess_weather_risks(self, conditions: Dict, similar_dates: List[Dict]) -> Dict:
        """Assess weather-related risks"""
        
        temp = conditions['temperature']
        precip = conditions['precipitation']
        wind = conditions['wind_speed']
        
        # Calculate risk probabilities based on historical data
        total_records = len(similar_dates)
        
        very_hot_count = sum(1 for r in similar_dates if r['temperature'] > 35)
        very_cold_count = sum(1 for r in similar_dates if r['temperature'] < -15)
        heavy_rain_count = sum(1 for r in similar_dates if r['precipitation'] > 25)
        strong_wind_count = sum(1 for r in similar_dates if r['wind_speed'] > 15)
        
        return {
            'very_hot': {
                'probability': round((very_hot_count / total_records) * 100, 1),
                'description': 'Temperature above 35°C'
            },
            'very_cold': {
                'probability': round((very_cold_count / total_records) * 100, 1),
                'description': 'Temperature below -15°C'
            },
            'heavy_rain': {
                'probability': round((heavy_rain_count / total_records) * 100, 1),
                'description': 'Precipitation above 25mm/day'
            },
            'strong_winds': {
                'probability': round((strong_wind_count / total_records) * 100, 1),
                'description': 'Wind speed above 15 m/s (54 km/h)'
            },
            'overall_risk_level': self._categorize_risk_level(
                very_hot_count + very_cold_count + heavy_rain_count + strong_wind_count,
                total_records
            )
        }

    def _calculate_activity_suitability(self, conditions: Dict, activity_type: str) -> float:
        """Calculate how suitable conditions are for the specified activity"""
        
        comfort_range = self.comfort_ranges.get(activity_type, self.comfort_ranges['general'])
        
        temp = conditions['temperature']
        precip = conditions['precipitation']
        wind = conditions['wind_speed']
        
        # Temperature suitability
        if comfort_range['temp_min'] <= temp <= comfort_range['temp_max']:
            temp_score = 100
        else:
            temp_deviation = min(
                abs(temp - comfort_range['temp_min']), 
                abs(temp - comfort_range['temp_max'])
            )
            temp_score = max(0, 100 - (temp_deviation * 5))
        
        # Precipitation suitability
        if precip <= comfort_range['max_rain']:
            precip_score = 100
        else:
            precip_score = max(0, 100 - ((precip - comfort_range['max_rain']) * 10))
        
        # Wind suitability
        wind_kmh = wind * 3.6  # Convert m/s to km/h
        if wind_kmh <= comfort_range['max_wind']:
            wind_score = 100
        else:
            wind_score = max(0, 100 - ((wind_kmh - comfort_range['max_wind']) * 2))
        
        # Weighted average (precipitation weighted highest for outdoor activities)
        suitability = (0.3 * temp_score + 0.5 * precip_score + 0.2 * wind_score)
        
        return suitability

    def _calculate_confidence_score(self, similar_dates: List[Dict], 
                                  baseline_stats: Dict) -> float:
        """Calculate confidence score for prediction"""
        
        # Base confidence from sample size
        sample_size = len(similar_dates)
        sample_confidence = min(100, sample_size * 10)  # 10% per sample, max 100%
        
        # Data consistency confidence
        if sample_size > 1:
            temps = [r['temperature'] for r in similar_dates]
            temp_consistency = 100 - (statistics.stdev(temps) * 5)  # Lower std dev = higher confidence
            temp_consistency = max(0, min(100, temp_consistency))
        else:
            temp_consistency = 50
        
        # Historical data depth
        years_of_data = len(set(r['date'].year for r in similar_dates))
        depth_confidence = min(100, years_of_data * 15)  # 15% per year of data
        
        # Weighted average
        confidence = (0.4 * sample_confidence + 0.4 * temp_consistency + 0.2 * depth_confidence)
        
        return confidence

    def _categorize_risk_level(self, risk_events: int, total_records: int) -> str:
        """Categorize overall risk level"""
        
        risk_percentage = (risk_events / total_records) * 100 if total_records > 0 else 0
        
        if risk_percentage > 30:
            return 'high'
        elif risk_percentage > 15:
            return 'moderate'
        elif risk_percentage > 5:
            return 'low'
        else:
            return 'minimal'

    def _generate_recommendation(self, suitability_score: float, 
                               risk_assessment: Dict) -> str:
        """Generate human-readable recommendation"""
        
        risk_level = risk_assessment['overall_risk_level']
        
        if suitability_score >= 80 and risk_level in ['minimal', 'low']:
            return "Excellent conditions expected - highly recommended!"
        elif suitability_score >= 60 and risk_level in ['minimal', 'low', 'moderate']:
            return "Good conditions expected - recommended with minor precautions"
        elif suitability_score >= 40:
            return "Moderate conditions - consider backup plans"
        else:
            return "Poor conditions expected - strong backup plans recommended"

    def _analyze_activity_suitability(self, predictions: List[Dict], 
                                    activity_type: str) -> Dict:
        """Analyze overall activity suitability across all predictions"""
        
        suitability_scores = [p.get('suitability_score', 0) for p in predictions]
        
        if not suitability_scores:
            return {'analysis': 'No predictions available'}
        
        excellent_days = sum(1 for score in suitability_scores if score >= 80)
        good_days = sum(1 for score in suitability_scores if 60 <= score < 80)
        moderate_days = sum(1 for score in suitability_scores if 40 <= score < 60)
        poor_days = sum(1 for score in suitability_scores if score < 40)
        
        return {
            'activity_type': activity_type,
            'total_days_analyzed': len(suitability_scores),
            'excellent_days': excellent_days,
            'good_days': good_days,
            'moderate_days': moderate_days,
            'poor_days': poor_days,
            'average_suitability': round(statistics.mean(suitability_scores), 1),
            'best_day': predictions[0]['date'] if predictions else None,
            'recommendation_summary': self._generate_overall_recommendation(
                excellent_days, good_days, moderate_days, poor_days
            )
        }

    def _generate_overall_recommendation(self, excellent: int, good: int, 
                                       moderate: int, poor: int) -> str:
        """Generate overall recommendation summary"""
        
        total = excellent + good + moderate + poor
        
        if total == 0:
            return "No analysis available"
        
        excellent_pct = (excellent / total) * 100
        good_pct = (good / total) * 100
        
        if excellent_pct >= 50:
            return "Excellent period for outdoor activities - many great options!"
        elif (excellent_pct + good_pct) >= 60:
            return "Good period overall - several suitable days available"
        elif moderate >= (total * 0.5):
            return "Mixed conditions - careful date selection recommended"
        else:
            return "Challenging period - consider indoor alternatives or flexible scheduling"

    def _get_data_date_range(self, processed_data: List[Dict]) -> Dict:
        """Get the date range of analyzed data"""
        
        if not processed_data:
            return {}
        
        dates = [r['date'] for r in processed_data]
        
        return {
            'earliest': min(dates).strftime('%Y-%m-%d'),
            'latest': max(dates).strftime('%Y-%m-%d'),
            'span_years': (max(dates) - min(dates)).days / 365.25
        }

    def _assess_data_completeness(self, processed_data: List[Dict]) -> Dict:
        """Assess completeness and quality of data"""
        
        if not processed_data:
            return {'completeness': 'no_data'}
        
        total_records = len(processed_data)
        
        # Check for missing values (assuming 0 or negative values might indicate missing data)
        temp_valid = sum(1 for r in processed_data if r['temperature'] != 0)
        precip_valid = sum(1 for r in processed_data if r['precipitation'] >= 0)
        wind_valid = sum(1 for r in processed_data if r['wind_speed'] >= 0)
        
        return {
            'total_records': total_records,
            'temperature_completeness': (temp_valid / total_records) * 100,
            'precipitation_completeness': (precip_valid / total_records) * 100,
            'wind_completeness': (wind_valid / total_records) * 100,
            'overall_quality': 'high' if total_records > 100 else 'moderate' if total_records > 30 else 'limited'
        }

    def _generate_fallback_analysis(self, target_dates: List[str], 
                                  activity_type: str) -> Dict:
        """Generate fallback analysis when no historical data is available"""
        
        fallback_predictions = []
        
        for date_str in target_dates:
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
            fallback_predictions.append({
                'date': date_str,
                'day_of_week': target_date.strftime('%A'),
                'predicted_conditions': {
                    'temperature': 20, 'precipitation': 5, 'wind_speed': 8, 'humidity': 60
                },
                'suitability_score': 50,
                'confidence_score': 25,
                'fallback_reason': 'No historical data available'
            })
        
        return {
            'success': True,
            'analysis_method': 'Fallback Analysis',
            'predictions': fallback_predictions,
            'warning': 'Results based on default values - limited accuracy'
        }

    def _generate_fallback_prediction(self, target_date: datetime, 
                                    activity_type: str) -> Dict:
        """Generate fallback prediction for single date"""
        
        return {
            'date': target_date.strftime('%Y-%m-%d'),
            'day_of_week': target_date.strftime('%A'),
            'predicted_conditions': {
                'temperature': 20, 'precipitation': 5, 'wind_speed': 8, 'humidity': 60
            },
            'suitability_score': 50,
            'confidence_score': 25,
            'fallback_used': True
        }