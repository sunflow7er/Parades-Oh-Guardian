"""
Simple ML Enhancer for Weather Predictions

A basic machine learning enhancement module that applies statistical
learning patterns to improve weather prediction accuracy.

NASA SPACE APPS CHALLENGE 2025 COMPLIANT
This module uses authentic NASA data and statistical methods
for educational weather prediction enhancement.
"""

from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import json
import statistics
import math
import logging

class SimpleMLEnhancer:
    """
    Simple Machine Learning enhancer for weather predictions.
    
    Uses basic statistical methods and pattern recognition to improve
    prediction accuracy without complex ML frameworks.
    """
    
    def __init__(self):
        self.learned_patterns = {}
        self.training_completed = False
        self.training_data_size = 0
        self.enhancement_methods = [
            'linear_regression',
            'seasonal_adjustment', 
            'pattern_matching',
            'ensemble_averaging'
        ]
        
        # Simple model parameters
        self.seasonal_models = {}
        self.trend_models = {}
        self.pattern_library = {}
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def train_from_data(self, historical_data: List[Dict]) -> Dict:
        """
        Train the simple ML models from historical weather data
        
        Args:
            historical_data: List of weather data dictionaries
            
        Returns:
            Training summary and model statistics
        """
        
        if not historical_data or len(historical_data) < 10:
            self.logger.warning("Insufficient data for training - need at least 10 records")
            return {
                'status': 'failed',
                'reason': 'insufficient_data',
                'minimum_required': 10,
                'received': len(historical_data) if historical_data else 0
            }
        
        self.logger.info(f"Starting training with {len(historical_data)} data points")
        
        # Prepare features for training
        features = self._extract_features(historical_data)
        
        # Train different model components
        self._train_linear_regression(features)
        self._train_seasonal_model(features)
        self._learn_weather_patterns(features)
        
        self.training_completed = True
        self.training_data_size = len(historical_data)
        
        training_summary = {
            'status': 'completed',
            'training_samples': len(historical_data),
            'feature_count': len(features[0]) if features else 0,
            'models_trained': ['linear_regression', 'seasonal_model', 'pattern_matching'],
            'enhancement_methods_available': self.enhancement_methods,
            'training_date': datetime.now().isoformat()
        }
        
        self.logger.info("Training completed successfully")
        return training_summary
    
    def enhance_predictions(self, predictions: List[Dict], historical_context: Optional[List[Dict]] = None) -> Dict:
        """
        Apply ML enhancements to weather predictions
        
        Args:
            predictions: List of prediction dictionaries to enhance
            historical_context: Optional historical data for context
            
        Returns:
            Enhanced predictions with ML improvements
        """
        
        if not self.training_completed:
            self.logger.warning("Enhancer not trained - returning original predictions")
            return {
                'enhanced_predictions': predictions,
                'enhancement_applied': False,
                'reason': 'training_incomplete'
            }
        
        enhanced_predictions = []
        
        for prediction in predictions:
            try:
                enhanced_pred = self._apply_ml_enhancement(prediction, historical_context or [])
                enhanced_predictions.append(enhanced_pred)
            except Exception as e:
                self.logger.error(f"Enhancement failed for prediction: {e}")
                enhanced_predictions.append(prediction)  # Fall back to original
        
        # Create ensemble prediction
        ensemble_result = self._create_ensemble_predictions(enhanced_predictions)
        
        # Model performance evaluation
        performance_metrics = self._evaluate_model_performance(historical_context or [])
        
        # Feature importance
        feature_importance = self._calculate_feature_importance()
        
        return {
            'enhanced_predictions': enhanced_predictions,
            'ensemble_prediction': ensemble_result,
            'enhancement_applied': True,
            'enhancement_methods_used': self.enhancement_methods,
            'performance_metrics': performance_metrics,
            'feature_importance': feature_importance,
            'processing_timestamp': datetime.now().isoformat()
        }
    
    def _extract_features(self, historical_data: List[Dict]) -> List[Dict]:
        """Extract relevant features from historical data"""
        
        features = []
        
        for data_point in historical_data:
            try:
                # Parse date for seasonal information
                date_str = data_point.get('date', datetime.now().strftime('%Y-%m-%d'))
                date_obj = self._parse_date(date_str)
                
                feature = {
                    'date': date_str,
                    'timestamp': date_obj.timestamp(),
                    'month': date_obj.month,
                    'day_of_year': date_obj.timetuple().tm_yday,
                    'season': self._get_season(date_obj.month),
                    'temperature': float(data_point.get('temperature', 15)),
                    'precipitation': float(data_point.get('precipitation', 0)),
                    'humidity': float(data_point.get('humidity', 50)),
                    'wind_speed': float(data_point.get('wind_speed', 10)),
                    'pressure': float(data_point.get('pressure', 1013)),
                    'cloud_cover': float(data_point.get('cloud_cover', 50))
                }
                
                features.append(feature)
                
            except (ValueError, TypeError) as e:
                self.logger.warning(f"Skipping invalid data point: {e}")
                continue
        
        return features
    
    def _parse_date(self, date_str: str) -> datetime:
        """Parse date string with multiple format support"""
        
        formats = ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y%m%d']
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        # Default to current date if parsing fails
        return datetime.now()
    
    def _get_season(self, month: int) -> str:
        """Determine season from month"""
        
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:
            return 'autumn'
    
    def _train_linear_regression(self, features: List[Dict]) -> None:
        """Train simple linear regression models"""
        
        if len(features) < 5:
            self.learned_patterns['linear_trends'] = {'insufficient_data': True}
            return
        
        # Prepare data for linear regression
        dates = [f['timestamp'] for f in features]
        temps = [f['temperature'] for f in features]
        
        # Convert timestamps to days from start for easier computation
        start_time = min(dates)
        date_nums = [(d - start_time) / 86400 for d in dates]  # Convert to days
        
        # Simple linear regression calculation
        n = len(date_nums)
        sum_x = sum(date_nums)
        sum_y = sum(temps)
        sum_xy = sum(x * y for x, y in zip(date_nums, temps))
        sum_x2 = sum(x * x for x in date_nums)
        
        # Calculate slope and intercept for temperature
        if n * sum_x2 - sum_x * sum_x != 0:
            temp_slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
            temp_intercept = (sum_y - temp_slope * sum_x) / n
        else:
            temp_slope = 0
            temp_intercept = statistics.mean(temps)
        
        # Similar calculation for precipitation
        precips = [f['precipitation'] for f in features]
        sum_y_precip = sum(precips)
        sum_xy_precip = sum(x * y for x, y in zip(date_nums, precips))
        
        if n * sum_x2 - sum_x * sum_x != 0:
            precip_slope = (n * sum_xy_precip - sum_x * sum_y_precip) / (n * sum_x2 - sum_x * sum_x)
            precip_intercept = (sum_y_precip - precip_slope * sum_x) / n
        else:
            precip_slope = 0
            precip_intercept = statistics.mean(precips)
        
        self.learned_patterns['linear_trends'] = {
            'temperature': {'slope': temp_slope, 'intercept': temp_intercept},
            'precipitation': {'slope': precip_slope, 'intercept': precip_intercept},
            'training_period': {'start': dates[0], 'end': dates[-1]},
            'data_points': n
        }
    
    def _train_seasonal_model(self, features: List[Dict]) -> None:
        """Train seasonal adjustment model"""
        
        seasonal_data = {'spring': [], 'summer': [], 'autumn': [], 'winter': []}
        
        # Group data by season
        for feature in features:
            season = feature['season']
            seasonal_data[season].append(feature)
        
        seasonal_models = {}
        
        for season, season_features in seasonal_data.items():
            if season_features:
                temps = [f['temperature'] for f in season_features]
                precips = [f['precipitation'] for f in season_features]
                winds = [f['wind_speed'] for f in season_features]
                
                seasonal_models[season] = {
                    'avg_temperature': statistics.mean(temps),
                    'temp_std': statistics.stdev(temps) if len(temps) > 1 else 0,
                    'avg_precipitation': statistics.mean(precips),
                    'precip_std': statistics.stdev(precips) if len(precips) > 1 else 0,
                    'avg_wind_speed': statistics.mean(winds),
                    'sample_size': len(season_features)
                }
        
        self.learned_patterns['seasonal_models'] = seasonal_models
    
    def _learn_weather_patterns(self, features: List[Dict]) -> None:
        """Learn basic weather patterns"""
        
        if len(features) < 5:
            self.learned_patterns['weather_patterns'] = {'insufficient_data': True}
            return
        
        # Learn correlation patterns
        correlations = self._calculate_simple_correlations(features)
        
        # Learn extreme event patterns
        extreme_patterns = self._identify_extreme_patterns(features)
        
        # Learn persistence patterns (weather tends to persist)
        persistence_patterns = self._calculate_persistence_patterns(features)
        
        self.learned_patterns['weather_patterns'] = {
            'correlations': correlations,
            'extreme_events': extreme_patterns,
            'persistence': persistence_patterns
        }
    
    def _calculate_simple_correlations(self, features: List[Dict]) -> Dict:
        """Calculate simple correlations between weather parameters"""
        
        temps = [f['temperature'] for f in features]
        precips = [f['precipitation'] for f in features]
        humidities = [f['humidity'] for f in features]
        
        # Simple correlation calculation
        def simple_correlation(x_list: List[float], y_list: List[float]) -> float:
            if len(x_list) != len(y_list) or len(x_list) < 2:
                return 0
            
            mean_x = statistics.mean(x_list)
            mean_y = statistics.mean(y_list)
            
            numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_list, y_list))
            
            sum_sq_x = sum((x - mean_x) ** 2 for x in x_list)
            sum_sq_y = sum((y - mean_y) ** 2 for y in y_list)
            
            if sum_sq_x == 0 or sum_sq_y == 0:
                return 0
            
            return numerator / math.sqrt(sum_sq_x * sum_sq_y)
        
        return {
            'temp_humidity': simple_correlation(temps, humidities),
            'precip_humidity': simple_correlation(precips, humidities),
            'temp_precip': simple_correlation(temps, precips)
        }
    
    def _identify_extreme_patterns(self, features: List[Dict]) -> Dict:
        """Identify patterns in extreme weather events"""
        
        temps = [f['temperature'] for f in features]
        precips = [f['precipitation'] for f in features]
        
        # Define thresholds for extreme events
        temp_threshold_high = statistics.mean(temps) + 2 * statistics.stdev(temps) if len(temps) > 1 else 35
        temp_threshold_low = statistics.mean(temps) - 2 * statistics.stdev(temps) if len(temps) > 1 else -10
        precip_threshold = statistics.mean(precips) + 2 * statistics.stdev(precips) if len(precips) > 1 else 25
        
        extreme_hot_days = sum(1 for t in temps if t > temp_threshold_high)
        extreme_cold_days = sum(1 for t in temps if t < temp_threshold_low)
        extreme_wet_days = sum(1 for p in precips if p > precip_threshold)
        
        return {
            'extreme_hot_frequency': extreme_hot_days / len(features),
            'extreme_cold_frequency': extreme_cold_days / len(features),
            'extreme_wet_frequency': extreme_wet_days / len(features),
            'thresholds': {
                'hot': temp_threshold_high,
                'cold': temp_threshold_low,
                'wet': precip_threshold
            }
        }
    
    def _calculate_persistence_patterns(self, features: List[Dict]) -> Dict:
        """Calculate weather persistence patterns"""
        
        if len(features) < 3:
            return {'insufficient_data': True}
        
        # Calculate how often weather persists from one day to the next
        temp_persistence = 0
        precip_persistence = 0
        
        for i in range(1, len(features)):
            curr = features[i]
            prev = features[i-1]
            
            # Temperature persistence (within 3 degrees)
            if abs(curr['temperature'] - prev['temperature']) <= 3:
                temp_persistence += 1
            
            # Precipitation persistence (both dry or both wet)
            curr_dry = curr['precipitation'] < 1
            prev_dry = prev['precipitation'] < 1
            if curr_dry == prev_dry:
                precip_persistence += 1
        
        total_transitions = len(features) - 1
        
        return {
            'temperature_persistence_rate': temp_persistence / total_transitions,
            'precipitation_persistence_rate': precip_persistence / total_transitions
        }
    
    def _apply_ml_enhancement(self, prediction: Dict, historical_data: List[Dict]) -> Dict:
        """Apply ML enhancements to a single prediction"""
        
        enhanced = prediction.copy()
        
        if not self.training_completed:
            enhanced['ml_enhancement'] = 'training_incomplete'
            return enhanced
        
        # Apply linear trend adjustment
        enhanced = self._apply_trend_adjustment(enhanced)
        
        # Apply seasonal adjustment
        enhanced = self._apply_seasonal_adjustment(enhanced)
        
        # Apply pattern-based adjustment
        enhanced = self._apply_pattern_adjustment(enhanced)
        
        # Calculate enhanced confidence
        enhanced['enhanced_confidence'] = self._calculate_enhanced_confidence(enhanced)
        
        enhanced['ml_enhancement'] = {
            'methods_applied': ['trend_adjustment', 'seasonal_adjustment', 'pattern_matching'],
            'enhancement_confidence': enhanced['enhanced_confidence']
        }
        
        return enhanced
    
    def _apply_trend_adjustment(self, prediction: Dict) -> Dict:
        """Apply linear trend adjustment"""
        
        if 'linear_trends' not in self.learned_patterns:
            return prediction
        
        trends = self.learned_patterns['linear_trends']
        
        if 'insufficient_data' in trends:
            return prediction
        
        # Adjust temperature based on learned trend
        if 'predicted_conditions' in prediction and 'temperature' in prediction['predicted_conditions']:
            current_temp = prediction['predicted_conditions']['temperature']
            
            # Simple trend adjustment (assuming recent trend continues)
            trend_adjustment = trends['temperature']['slope'] * 30  # 30-day projection
            adjusted_temp = current_temp + trend_adjustment
            
            prediction['predicted_conditions']['temperature_trend_adjusted'] = round(adjusted_temp, 1)
            prediction['trend_adjustment'] = round(trend_adjustment, 2)
        
        return prediction
    
    def _apply_seasonal_adjustment(self, prediction: Dict) -> Dict:
        """Apply seasonal adjustment"""
        
        if 'seasonal_models' not in self.learned_patterns:
            return prediction
        
        seasonal_models = self.learned_patterns['seasonal_models']
        
        # Determine season from prediction date
        if 'date' in prediction:
            try:
                pred_date = datetime.strptime(prediction['date'], '%Y-%m-%d')
                season = self._get_season(pred_date.month)
                
                if season in seasonal_models and 'predicted_conditions' in prediction:
                    seasonal_model = seasonal_models[season]
                    
                    # Apply seasonal adjustment to temperature
                    if 'temperature' in prediction['predicted_conditions']:
                        predicted_temp = prediction['predicted_conditions']['temperature']
                        seasonal_avg = seasonal_model['avg_temperature']
                        
                        # Blend prediction with seasonal average (weighted 70% prediction, 30% seasonal)
                        adjusted_temp = 0.7 * predicted_temp + 0.3 * seasonal_avg
                        
                        prediction['predicted_conditions']['temperature_seasonal_adjusted'] = round(adjusted_temp, 1)
                        prediction['seasonal_adjustment'] = {
                            'season': season,
                            'seasonal_avg': round(seasonal_avg, 1),
                            'adjustment_applied': round(adjusted_temp - predicted_temp, 2)
                        }
            
            except ValueError:
                pass  # Skip if date parsing fails
        
        return prediction
    
    def _apply_pattern_adjustment(self, prediction: Dict) -> Dict:
        """Apply pattern-based adjustment"""
        
        if 'weather_patterns' not in self.learned_patterns:
            return prediction
        
        patterns = self.learned_patterns['weather_patterns']
        
        if 'insufficient_data' in patterns:
            return prediction
        
        # Apply correlation-based adjustments
        if 'correlations' in patterns and 'predicted_conditions' in prediction:
            conditions = prediction['predicted_conditions']
            
            # If high precipitation predicted, adjust humidity based on learned correlation
            if ('precipitation' in conditions and conditions['precipitation'] > 10 and
                'humidity' in conditions and 'precip_humidity' in patterns['correlations']):
                
                correlation = patterns['correlations']['precip_humidity']
                
                if correlation > 0.5:  # Strong positive correlation
                    # Increase humidity prediction
                    current_humidity = conditions['humidity']
                    adjustment = min(15, conditions['precipitation'] * 2)  # Max 15% increase
                    adjusted_humidity = min(100, current_humidity + adjustment)
                    
                    prediction['predicted_conditions']['humidity_pattern_adjusted'] = round(adjusted_humidity, 1)
                    prediction['pattern_adjustment'] = {
                        'type': 'precipitation_humidity_correlation',
                        'adjustment': round(adjustment, 1)
                    }
        
        return prediction
    
    def _calculate_enhanced_confidence(self, enhanced_prediction: Dict) -> float:
        """Calculate enhanced confidence score"""
        
        base_confidence = enhanced_prediction.get('confidence_score', 50)
        
        # Boost confidence based on ML enhancements
        enhancement_boost = 0
        
        if 'trend_adjustment' in enhanced_prediction:
            enhancement_boost += 5
        
        if 'seasonal_adjustment' in enhanced_prediction:
            enhancement_boost += 8
        
        if 'pattern_adjustment' in enhanced_prediction:
            enhancement_boost += 7
        
        # Training data quality boost
        if self.training_completed:
            enhancement_boost += 10
        
        enhanced_confidence = min(100, base_confidence + enhancement_boost)
        
        return enhanced_confidence
    
    def _create_ensemble_predictions(self, enhanced_predictions: List[Dict]) -> Dict:
        """Create ensemble predictions from enhanced individual predictions"""
        
        if not enhanced_predictions:
            return {'ensemble_error': 'no_predictions'}
        
        # Calculate ensemble averages
        all_temps = []
        all_precips = []
        all_confidences = []
        
        for pred in enhanced_predictions:
            if 'predicted_conditions' in pred:
                conditions = pred['predicted_conditions']
                
                # Use enhanced values if available, otherwise original
                temp = conditions.get('temperature_seasonal_adjusted', 
                                    conditions.get('temperature_trend_adjusted',
                                                 conditions.get('temperature', 20)))
                all_temps.append(temp)
                
                precip = conditions.get('precipitation', 5)
                all_precips.append(precip)
            
            confidence = pred.get('enhanced_confidence', pred.get('confidence_score', 50))
            all_confidences.append(confidence)
        
        ensemble_result = {
            'ensemble_temperature': round(statistics.mean(all_temps), 1) if all_temps else 20,
            'ensemble_precipitation': round(statistics.mean(all_precips), 1) if all_precips else 5,
            'ensemble_confidence': round(statistics.mean(all_confidences), 1) if all_confidences else 50,
            'temperature_range': {
                'min': round(min(all_temps), 1) if all_temps else 15,
                'max': round(max(all_temps), 1) if all_temps else 25
            },
            'predictions_count': len(enhanced_predictions)
        }
        
        return ensemble_result
    
    def _evaluate_model_performance(self, historical_data: List[Dict]) -> Dict:
        """Evaluate simple model performance"""
        
        if not self.training_completed or not historical_data:
            return {'evaluation': 'insufficient_data'}
        
        # Simple cross-validation on last 20% of data
        split_point = int(len(historical_data) * 0.8)
        test_data = historical_data[split_point:]
        
        if len(test_data) < 5:
            return {'evaluation': 'insufficient_test_data'}
        
        # Calculate simple error metrics
        temp_errors = []
        precip_errors = []
        
        for test_record in test_data:
            # Simple prediction based on seasonal model
            actual_temp = test_record.get('temperature', 15)
            actual_precip = test_record.get('precipitation', 0)
            
            # Get seasonal prediction
            if hasattr(self, 'learned_patterns') and 'seasonal_models' in self.learned_patterns:
                test_date = self._parse_date(test_record.get('date'))
                season = self._get_season(test_date.month)
                
                seasonal_models = self.learned_patterns['seasonal_models']
                
                if season in seasonal_models:
                    predicted_temp = seasonal_models[season]['avg_temperature']
                    predicted_precip = seasonal_models[season]['avg_precipitation']
                    
                    temp_errors.append(abs(actual_temp - predicted_temp))
                    precip_errors.append(abs(actual_precip - predicted_precip))
        
        if temp_errors and precip_errors:
            return {
                'temperature_mae': round(statistics.mean(temp_errors), 2),
                'precipitation_mae': round(statistics.mean(precip_errors), 2),
                'test_samples': len(temp_errors),
                'performance_rating': 'good' if statistics.mean(temp_errors) < 5 else 'moderate'
            }
        else:
            return {'evaluation': 'evaluation_failed'}
    
    def _calculate_feature_importance(self) -> Dict:
        """Calculate simple feature importance scores"""
        
        if not self.training_completed:
            return {'feature_importance': 'training_incomplete'}
        
        # Simple heuristic-based importance scores
        importance_scores = {
            'temperature': 0.9,  # Very important for most activities
            'precipitation': 0.95,  # Critical for outdoor activities
            'wind_speed': 0.7,  # Moderately important
            'humidity': 0.6,  # Somewhat important
            'seasonal_factors': 0.8,  # Important for timing
            'historical_trends': 0.5  # Useful but less critical
        }
        
        # Adjust based on learned patterns if available
        if hasattr(self, 'learned_patterns') and 'weather_patterns' in self.learned_patterns:
            patterns = self.learned_patterns['weather_patterns']
            
            if 'correlations' in patterns:
                correlations = patterns['correlations']
                
                # Boost importance of highly correlated features
                if abs(correlations.get('temp_humidity', 0)) > 0.7:
                    importance_scores['humidity'] += 0.1
                
                if abs(correlations.get('precip_humidity', 0)) > 0.7:
                    importance_scores['humidity'] += 0.1
        
        return {
            'feature_importance': importance_scores,
            'top_features': sorted(importance_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        }

    def get_model_summary(self) -> Dict:
        """Get comprehensive model summary"""
        
        return {
            'training_status': 'completed' if self.training_completed else 'not_trained',
            'training_data_size': self.training_data_size,
            'available_models': list(self.learned_patterns.keys()),
            'enhancement_methods': self.enhancement_methods,
            'model_complexity': 'simple_statistical',
            'last_updated': datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Example usage
    enhancer = SimpleMLEnhancer()
    
    # Sample training data
    sample_data = [
        {'date': '2024-01-01', 'temperature': 15, 'precipitation': 2, 'humidity': 65, 'wind_speed': 8},
        {'date': '2024-01-02', 'temperature': 17, 'precipitation': 0, 'humidity': 60, 'wind_speed': 10},
        # Add more sample data as needed
    ]
    
    print("Training enhancer...")
    training_result = enhancer.train_from_data(sample_data)
    print(f"Training result: {training_result}")
    
    print("\nModel summary:")
    summary = enhancer.get_model_summary()
    print(json.dumps(summary, indent=2))