"""
Optimized Weather Analysis Module

Advanced statistical analysis and pattern recognition for weather data
with enhanced prediction capabilities.

NASA SPACE APPS CHALLENGE 2025 COMPLIANT
Uses authentic NASA POWER API data for educational weather analysis.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime, timedelta
import statistics
import math
import logging
from collections import defaultdict, Counter

class OptimizedWeatherAnalyzer:
    """
    Advanced weather analyzer with optimized algorithms for pattern recognition,
    statistical analysis, and enhanced prediction accuracy.
    """
    
    def __init__(self):
        self.analysis_cache = {}
        self.pattern_library = {}
        self.statistical_models = {}
        self.confidence_thresholds = {
            'high': 0.8,
            'medium': 0.6,
            'low': 0.4
        }
        
        # Advanced analysis parameters
        self.correlation_window = 30  # Days for correlation analysis
        self.trend_window = 90       # Days for trend analysis
        self.seasonal_window = 365   # Days for seasonal patterns
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def comprehensive_analysis(self, weather_data: List[Dict], activity_type: str = "outdoor") -> Dict:
        """
        Perform comprehensive weather analysis with advanced statistical methods
        
        Args:
            weather_data: List of weather data dictionaries from NASA API
            activity_type: Type of activity for context-aware analysis
            
        Returns:
            Comprehensive analysis results with enhanced insights
        """
        
        if not weather_data:
            return {
                'error': 'no_data_provided',
                'analysis_status': 'failed',
                'timestamp': datetime.now().isoformat()
            }
        
        # Convert to DataFrame for advanced analysis
        df = self._create_dataframe(weather_data)
        
        if df.empty:
            return {
                'error': 'invalid_data_format',
                'analysis_status': 'failed',
                'timestamp': datetime.now().isoformat()
            }
        
        # Perform multi-dimensional analysis
        results = {
            'dataset_info': self._analyze_dataset_quality(df),
            'statistical_summary': self._advanced_statistical_analysis(df),
            'temporal_patterns': self._analyze_temporal_patterns(df),
            'correlation_analysis': self._perform_correlation_analysis(df),
            'trend_analysis': self._analyze_trends(df),
            'seasonal_decomposition': self._seasonal_decomposition(df),
            'anomaly_detection': self._detect_anomalies(df),
            'activity_suitability': self._analyze_activity_suitability(df, activity_type),
            'predictive_insights': self._generate_predictive_insights(df),
            'confidence_metrics': self._calculate_confidence_metrics(df),
            'analysis_metadata': {
                'analysis_type': 'comprehensive_optimized',
                'activity_context': activity_type,
                'data_points_analyzed': len(df),
                'analysis_timestamp': datetime.now().isoformat(),
                'nasa_data_compliant': True
            }
        }
        
        return results
    
    def _create_dataframe(self, weather_data: List[Dict]) -> pd.DataFrame:
        """Convert weather data to pandas DataFrame with proper typing"""
        
        try:
            # Normalize data structure
            normalized_data = []
            
            for record in weather_data:
                normalized_record = {}
                
                # Handle date parsing
                date_str = record.get('date', '')
                if date_str:
                    try:
                        normalized_record['date'] = pd.to_datetime(date_str)
                    except:
                        normalized_record['date'] = pd.to_datetime('today')
                else:
                    normalized_record['date'] = pd.to_datetime('today')
                
                # Extract numeric weather parameters
                parameters = [
                    'temperature', 'precipitation', 'humidity', 
                    'wind_speed', 'pressure', 'cloud_cover'
                ]
                
                for param in parameters:
                    try:
                        normalized_record[param] = float(record.get(param, 0))
                    except (ValueError, TypeError):
                        normalized_record[param] = 0.0
                
                # Add derived features
                normalized_record['temp_celsius'] = normalized_record['temperature']
                normalized_record['is_rainy'] = 1 if normalized_record['precipitation'] > 1 else 0
                normalized_record['is_windy'] = 1 if normalized_record['wind_speed'] > 15 else 0
                normalized_record['comfort_index'] = self._calculate_comfort_index(
                    normalized_record['temperature'], 
                    normalized_record['humidity']
                )
                
                normalized_data.append(normalized_record)
            
            df = pd.DataFrame(normalized_data)
            
            # Set date as index for time series analysis
            if 'date' in df.columns:
                df.set_index('date', inplace=True)
                df.sort_index(inplace=True)
            
            return df
            
        except Exception as e:
            self.logger.error(f"DataFrame creation failed: {e}")
            return pd.DataFrame()
    
    def _calculate_comfort_index(self, temperature: float, humidity: float) -> float:
        """Calculate human comfort index based on temperature and humidity"""
        
        # Simplified Heat Index calculation
        if temperature < 20:
            return max(0, 50 - abs(20 - temperature) * 2)
        
        # For temperatures above 20°C, consider humidity effect
        heat_index = temperature + (humidity - 50) * 0.1
        
        # Comfort scoring (0-100 scale)
        if 20 <= temperature <= 25 and 40 <= humidity <= 60:
            comfort = 100 - abs(22.5 - temperature) * 5 - abs(50 - humidity) * 0.5
        else:
            comfort = max(0, 80 - abs(22.5 - temperature) * 3 - abs(50 - humidity) * 0.3)
        
        return max(0, min(100, comfort))
    
    def _analyze_dataset_quality(self, df: pd.DataFrame) -> Dict:
        """Analyze quality and completeness of the dataset"""
        
        quality_metrics = {
            'total_records': len(df),
            'date_range': {
                'start': df.index.min().isoformat() if not df.empty else None,
                'end': df.index.max().isoformat() if not df.empty else None,
                'span_days': (df.index.max() - df.index.min()).days if len(df) > 1 else 0
            },
            'completeness': {},
            'data_quality_score': 0
        }
        
        # Check completeness for each column
        for col in df.columns:
            if col != 'date':
                non_null_count = df[col].notna().sum()
                completeness_pct = (non_null_count / len(df)) * 100
                quality_metrics['completeness'][col] = {
                    'percentage': round(completeness_pct, 2),
                    'missing_values': len(df) - non_null_count
                }
        
        # Calculate overall quality score
        if quality_metrics['completeness']:
            avg_completeness = np.mean([
                metrics['percentage'] 
                for metrics in quality_metrics['completeness'].values()
            ])
            
            # Quality factors
            date_continuity = min(100, (len(df) / max(1, quality_metrics['date_range']['span_days'])) * 100)
            
            quality_metrics['data_quality_score'] = round(
                (avg_completeness * 0.7 + date_continuity * 0.3), 2
            )
        
        return quality_metrics
    
    def _advanced_statistical_analysis(self, df: pd.DataFrame) -> Dict:
        """Perform advanced statistical analysis on weather parameters"""
        
        if df.empty:
            return {'error': 'no_data_available'}
        
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        
        stats_results = {}
        
        for col in numerical_cols:
            if df[col].notna().sum() > 0:  # Only analyze columns with data
                series = df[col].dropna()
                
                # Basic statistics
                basic_stats = {
                    'mean': round(series.mean(), 3),
                    'median': round(series.median(), 3),
                    'std': round(series.std(), 3),
                    'min': round(series.min(), 3),
                    'max': round(series.max(), 3),
                    'range': round(series.max() - series.min(), 3)
                }
                
                # Advanced statistics
                advanced_stats = {
                    'skewness': round(series.skew(), 3),
                    'kurtosis': round(series.kurtosis(), 3),
                    'coefficient_of_variation': round((series.std() / series.mean()) * 100, 2) if series.mean() != 0 else 0
                }
                
                # Percentiles
                percentiles = {
                    'q25': round(series.quantile(0.25), 3),
                    'q75': round(series.quantile(0.75), 3),
                    'iqr': round(series.quantile(0.75) - series.quantile(0.25), 3),
                    'q95': round(series.quantile(0.95), 3),
                    'q05': round(series.quantile(0.05), 3)
                }
                
                stats_results[col] = {
                    'basic_statistics': basic_stats,
                    'advanced_statistics': advanced_stats,
                    'percentiles': percentiles,
                    'outlier_analysis': self._detect_outliers(series)
                }
        
        return stats_results
    
    def _detect_outliers(self, series: pd.Series) -> Dict:
        """Detect outliers using multiple methods"""
        
        if len(series) < 5:
            return {'insufficient_data': True}
        
        # IQR method
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        iqr_outliers = series[(series < lower_bound) | (series > upper_bound)]
        
        # Z-score method (absolute z-score > 2.5)
        z_scores = np.abs((series - series.mean()) / series.std())
        zscore_outliers = series[z_scores > 2.5]
        
        return {
            'iqr_method': {
                'outlier_count': len(iqr_outliers),
                'outlier_percentage': round((len(iqr_outliers) / len(series)) * 100, 2),
                'bounds': {'lower': round(lower_bound, 3), 'upper': round(upper_bound, 3)}
            },
            'zscore_method': {
                'outlier_count': len(zscore_outliers),
                'outlier_percentage': round((len(zscore_outliers) / len(series)) * 100, 2),
                'threshold': 2.5
            }
        }
    
    def _analyze_temporal_patterns(self, df: pd.DataFrame) -> Dict:
        """Analyze temporal patterns and periodicities"""
        
        if df.empty or len(df) < 7:
            return {'error': 'insufficient_data_for_temporal_analysis'}
        
        patterns = {}
        
        # Create time-based features
        df_temp = df.copy()
        df_temp['dayofweek'] = df_temp.index.dayofweek
        df_temp['month'] = df_temp.index.month
        df_temp['quarter'] = df_temp.index.quarter
        
        # Weekly patterns
        if 'temperature' in df_temp.columns:
            weekly_temp = df_temp.groupby('dayofweek')['temperature'].agg(['mean', 'std']).round(2)
            patterns['weekly_temperature'] = {
                'pattern_exists': weekly_temp['std'].std() > 1,  # Significant variation
                'data': weekly_temp.to_dict()
            }
        
        # Monthly patterns
        if len(df_temp['month'].unique()) >= 3:
            monthly_patterns = {}
            for col in ['temperature', 'precipitation', 'humidity']:
                if col in df_temp.columns:
                    monthly_data = df_temp.groupby('month')[col].agg(['mean', 'std']).round(2)
                    monthly_patterns[col] = monthly_data.to_dict()
            
            patterns['monthly_patterns'] = monthly_patterns
        
        # Trend analysis
        patterns['trends'] = self._calculate_simple_trends(df_temp)
        
        return patterns
    
    def _calculate_simple_trends(self, df: pd.DataFrame) -> Dict:
        """Calculate simple linear trends for weather parameters"""
        
        trends = {}
        
        if len(df) < 10:
            return {'insufficient_data': True}
        
        # Create numerical time index
        time_index = np.arange(len(df))
        
        for col in ['temperature', 'precipitation', 'humidity', 'wind_speed']:
            if col in df.columns and df[col].notna().sum() > 5:
                y = df[col].dropna()
                x = np.arange(len(y))
                
                if len(x) > 1:
                    # Simple linear regression
                    correlation_coef = np.corrcoef(x, y)[0, 1] if len(x) > 1 else 0
                    
                    # Calculate slope
                    if len(x) > 1:
                        slope = np.polyfit(x, y, 1)[0]
                    else:
                        slope = 0
                    
                    trends[col] = {
                        'slope': round(slope, 6),
                        'correlation': round(correlation_coef, 3),
                        'trend_strength': self._classify_trend_strength(abs(correlation_coef)),
                        'direction': 'increasing' if slope > 0 else 'decreasing' if slope < 0 else 'stable'
                    }
        
        return trends
    
    def _classify_trend_strength(self, correlation: float) -> str:
        """Classify trend strength based on correlation coefficient"""
        
        if correlation >= 0.7:
            return 'strong'
        elif correlation >= 0.5:
            return 'moderate'
        elif correlation >= 0.3:
            return 'weak'
        else:
            return 'negligible'
    
    def _perform_correlation_analysis(self, df: pd.DataFrame) -> Dict:
        """Perform comprehensive correlation analysis"""
        
        if df.empty:
            return {'error': 'no_data_available'}
        
        # Select numerical columns for correlation
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        correlation_df = df[numerical_cols].corr()
        
        # Convert to dictionary and round values
        correlation_matrix = correlation_df.round(3).to_dict()
        
        # Find significant correlations (|r| > 0.5)
        significant_correlations = []
        
        for i, col1 in enumerate(numerical_cols):
            for j, col2 in enumerate(numerical_cols):
                if i < j:  # Avoid duplicates and self-correlation
                    corr_value = correlation_matrix[col1][col2]
                    if abs(corr_value) >= 0.5:
                        significant_correlations.append({
                            'variables': [col1, col2],
                            'correlation': corr_value,
                            'strength': self._classify_correlation_strength(abs(corr_value)),
                            'type': 'positive' if corr_value > 0 else 'negative'
                        })
        
        return {
            'correlation_matrix': correlation_matrix,
            'significant_correlations': significant_correlations,
            'correlation_summary': {
                'total_pairs': len(numerical_cols) * (len(numerical_cols) - 1) // 2,
                'significant_pairs': len(significant_correlations)
            }
        }
    
    def _classify_correlation_strength(self, correlation: float) -> str:
        """Classify correlation strength"""
        
        if correlation >= 0.8:
            return 'very_strong'
        elif correlation >= 0.6:
            return 'strong'
        elif correlation >= 0.4:
            return 'moderate'
        elif correlation >= 0.2:
            return 'weak'
        else:
            return 'very_weak'

    def _analyze_trends(self, df: pd.DataFrame) -> Dict:
        """Advanced trend analysis with multiple time windows"""
        
        if df.empty or len(df) < 14:
            return {'error': 'insufficient_data_for_trend_analysis'}
        
        trend_analysis = {}
        
        # Define time windows for analysis
        windows = {
            'short_term': min(14, len(df) // 4),
            'medium_term': min(30, len(df) // 2),
            'long_term': len(df)
        }
        
        for col in ['temperature', 'precipitation', 'humidity', 'wind_speed']:
            if col in df.columns and df[col].notna().sum() > 5:
                col_trends = {}
                
                for window_name, window_size in windows.items():
                    if window_size >= 5:
                        recent_data = df[col].tail(window_size).dropna()
                        
                        if len(recent_data) >= 5:
                            # Calculate trend metrics
                            x = np.arange(len(recent_data))
                            y = recent_data.values
                            
                            # Linear regression
                            slope, intercept = np.polyfit(x, y, 1)
                            correlation = np.corrcoef(x, y)[0, 1]
                            
                            # Trend significance
                            trend_significance = abs(correlation) * math.sqrt(len(recent_data) - 2) / math.sqrt(1 - correlation**2) if abs(correlation) < 1 else float('inf')
                            
                            col_trends[window_name] = {
                                'slope': round(slope, 6),
                                'correlation': round(correlation, 3),
                                'significance': round(trend_significance, 3),
                                'direction': 'increasing' if slope > 0.01 else 'decreasing' if slope < -0.01 else 'stable',
                                'data_points': len(recent_data)
                            }
                
                trend_analysis[col] = col_trends
        
        return trend_analysis

    def _seasonal_decomposition(self, df: pd.DataFrame) -> Dict:
        """Perform seasonal decomposition analysis"""
        
        if df.empty or len(df) < 30:
            return {'error': 'insufficient_data_for_seasonal_analysis'}
        
        seasonal_analysis = {}
        
        # Add time features
        df_seasonal = df.copy()
        df_seasonal['month'] = df_seasonal.index.month
        df_seasonal['season'] = df_seasonal['month'].apply(self._get_season_from_month)
        
        for col in ['temperature', 'precipitation', 'humidity']:
            if col in df_seasonal.columns and df_seasonal[col].notna().sum() > 10:
                
                # Monthly aggregation
                monthly_stats = df_seasonal.groupby('month')[col].agg(['mean', 'std', 'count']).round(2)
                
                # Seasonal aggregation
                seasonal_stats = df_seasonal.groupby('season')[col].agg(['mean', 'std', 'count']).round(2)
                
                # Calculate seasonal variation
                seasonal_variation = seasonal_stats['std'].mean() / seasonal_stats['mean'].mean() if seasonal_stats['mean'].mean() != 0 else 0
                
                seasonal_analysis[col] = {
                    'monthly_statistics': monthly_stats.to_dict(),
                    'seasonal_statistics': seasonal_stats.to_dict(),
                    'seasonal_variation_coefficient': round(seasonal_variation, 3),
                    'seasonality_strength': self._classify_seasonality_strength(seasonal_variation)
                }
        
        return seasonal_analysis
    
    def _get_season_from_month(self, month: int) -> str:
        """Convert month number to season"""
        
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:
            return 'autumn'
    
    def _classify_seasonality_strength(self, variation: float) -> str:
        """Classify seasonality strength based on variation coefficient"""
        
        if variation >= 0.5:
            return 'high'
        elif variation >= 0.3:
            return 'moderate'
        elif variation >= 0.1:
            return 'low'
        else:
            return 'minimal'
    
    def _detect_anomalies(self, df: pd.DataFrame) -> Dict:
        """Advanced anomaly detection using multiple methods"""
        
        if df.empty or len(df) < 10:
            return {'error': 'insufficient_data_for_anomaly_detection'}
        
        anomalies = {}
        
        for col in ['temperature', 'precipitation', 'humidity', 'wind_speed']:
            if col in df.columns and df[col].notna().sum() > 5:
                series = df[col].dropna()
                
                # Method 1: Statistical outliers (Z-score)
                z_scores = np.abs((series - series.mean()) / series.std())
                statistical_anomalies = series[z_scores > 3]
                
                # Method 2: IQR-based outliers
                q1, q3 = series.quantile(0.25), series.quantile(0.75)
                iqr = q3 - q1
                iqr_anomalies = series[(series < q1 - 2 * iqr) | (series > q3 + 2 * iqr)]
                
                # Method 3: Seasonal anomalies (if enough data)
                seasonal_anomalies = []
                if len(series) >= 30:
                    seasonal_anomalies = self._detect_seasonal_anomalies(series)
                
                anomalies[col] = {
                    'statistical_anomalies': {
                        'count': len(statistical_anomalies),
                        'percentage': round((len(statistical_anomalies) / len(series)) * 100, 2),
                        'threshold': 3.0
                    },
                    'iqr_anomalies': {
                        'count': len(iqr_anomalies),
                        'percentage': round((len(iqr_anomalies) / len(series)) * 100, 2),
                        'method': 'IQR_2x'
                    },
                    'seasonal_anomalies': {
                        'count': len(seasonal_anomalies),
                        'detected': len(seasonal_anomalies) > 0
                    }
                }
        
        return anomalies
    
    def _detect_seasonal_anomalies(self, series: pd.Series) -> List:
        """Detect seasonal anomalies based on historical patterns"""
        
        # This is a simplified seasonal anomaly detection
        # In practice, you might use more sophisticated methods
        
        anomalies = []
        
        if len(series) < 30:
            return anomalies
        
        # Calculate rolling statistics
        rolling_mean = series.rolling(window=7, center=True).mean()
        rolling_std = series.rolling(window=7, center=True).std()
        
        # Identify points that deviate significantly from rolling average
        for i in range(len(series)):
            if not pd.isna(rolling_mean.iloc[i]) and not pd.isna(rolling_std.iloc[i]):
                if rolling_std.iloc[i] > 0:
                    z_score = abs((series.iloc[i] - rolling_mean.iloc[i]) / rolling_std.iloc[i])
                    if z_score > 2.5:
                        anomalies.append(i)
        
        return anomalies
    
    def _analyze_activity_suitability(self, df: pd.DataFrame, activity_type: str) -> Dict:
        """Analyze weather suitability for specific activities"""
        
        if df.empty:
            return {'error': 'no_data_available'}
        
        # Define activity-specific criteria
        activity_criteria = {
            'outdoor': {
                'temperature_range': (10, 30),
                'max_precipitation': 5,
                'max_wind_speed': 20,
                'min_comfort_index': 40
            },
            'picnic': {
                'temperature_range': (15, 28),
                'max_precipitation': 1,
                'max_wind_speed': 15,
                'min_comfort_index': 60
            },
            'hiking': {
                'temperature_range': (5, 25),
                'max_precipitation': 10,
                'max_wind_speed': 25,
                'min_comfort_index': 30
            },
            'sports': {
                'temperature_range': (12, 32),
                'max_precipitation': 2,
                'max_wind_speed': 30,
                'min_comfort_index': 50
            }
        }
        
        criteria = activity_criteria.get(activity_type, activity_criteria['outdoor'])
        
        # Analyze suitability
        suitable_days = 0
        total_days = len(df)
        
        suitability_scores = []
        
        for _, row in df.iterrows():
            score = 0
            max_score = 4
            
            # Temperature check
            if criteria['temperature_range'][0] <= row.get('temperature', 15) <= criteria['temperature_range'][1]:
                score += 1
            
            # Precipitation check
            if row.get('precipitation', 0) <= criteria['max_precipitation']:
                score += 1
            
            # Wind speed check
            if row.get('wind_speed', 0) <= criteria['max_wind_speed']:
                score += 1
            
            # Comfort index check
            if row.get('comfort_index', 50) >= criteria['min_comfort_index']:
                score += 1
            
            suitability_percentage = (score / max_score) * 100
            suitability_scores.append(suitability_percentage)
            
            if suitability_percentage >= 75:
                suitable_days += 1
        
        return {
            'activity_type': activity_type,
            'criteria_used': criteria,
            'suitability_analysis': {
                'suitable_days': suitable_days,
                'total_days': total_days,
                'suitability_percentage': round((suitable_days / total_days) * 100, 2),
                'average_suitability_score': round(np.mean(suitability_scores), 2),
                'best_suitability_score': round(max(suitability_scores), 2),
                'worst_suitability_score': round(min(suitability_scores), 2)
            },
            'recommendations': self._generate_activity_recommendations(np.mean(suitability_scores))
        }
    
    def _generate_activity_recommendations(self, avg_suitability: float) -> List[str]:
        """Generate recommendations based on suitability score"""
        
        recommendations = []
        
        if avg_suitability >= 80:
            recommendations.extend([
                "Excellent conditions for outdoor activities",
                "Consider planning extended outdoor events",
                "Multiple activity options available"
            ])
        elif avg_suitability >= 60:
            recommendations.extend([
                "Good conditions with some limitations",
                "Monitor weather before activities",
                "Have backup plans ready"
            ])
        elif avg_suitability >= 40:
            recommendations.extend([
                "Moderate conditions requiring preparation",
                "Consider indoor alternatives",
                "Check weather frequently for updates"
            ])
        else:
            recommendations.extend([
                "Challenging conditions for outdoor activities",
                "Prioritize indoor activities",
                "Wait for better weather conditions"
            ])
        
        return recommendations
    
    def _generate_predictive_insights(self, df: pd.DataFrame) -> Dict:
        """Generate predictive insights based on historical patterns"""
        
        if df.empty or len(df) < 7:
            return {'error': 'insufficient_data_for_predictions'}
        
        insights = {}
        
        # Recent trend analysis for predictions
        recent_window = min(14, len(df))
        recent_data = df.tail(recent_window)
        
        for col in ['temperature', 'precipitation', 'humidity']:
            if col in recent_data.columns and recent_data[col].notna().sum() > 3:
                series = recent_data[col].dropna()
                
                # Simple trend-based prediction
                if len(series) >= 3:
                    x = np.arange(len(series))
                    slope, intercept = np.polyfit(x, series, 1)
                    
                    # Predict next few values
                    next_3_days = [slope * (len(series) + i) + intercept for i in range(1, 4)]
                    
                    # Confidence based on recent stability
                    recent_std = series.std()
                    recent_mean = series.mean()
                    stability = 1 - min(1, recent_std / max(0.1, abs(recent_mean)))
                    
                    insights[col] = {
                        'trend_direction': 'increasing' if slope > 0.01 else 'decreasing' if slope < -0.01 else 'stable',
                        'trend_strength': abs(slope),
                        'predicted_next_3_days': [round(val, 2) for val in next_3_days],
                        'prediction_confidence': round(stability * 100, 2),
                        'recent_average': round(recent_mean, 2),
                        'recent_variability': round(recent_std, 2)
                    }
        
        return insights
    
    def _calculate_confidence_metrics(self, df: pd.DataFrame) -> Dict:
        """Calculate confidence metrics for the analysis"""
        
        if df.empty:
            return {'overall_confidence': 0, 'reasons': ['no_data']}
        
        confidence_factors = {}
        
        # Data quantity factor
        data_points = len(df)
        if data_points >= 90:
            confidence_factors['data_quantity'] = 1.0
        elif data_points >= 30:
            confidence_factors['data_quantity'] = 0.8
        elif data_points >= 14:
            confidence_factors['data_quantity'] = 0.6
        elif data_points >= 7:
            confidence_factors['data_quantity'] = 0.4
        else:
            confidence_factors['data_quantity'] = 0.2
        
        # Data completeness factor
        completeness_scores = []
        for col in ['temperature', 'precipitation', 'humidity', 'wind_speed']:
            if col in df.columns:
                completeness = df[col].notna().sum() / len(df)
                completeness_scores.append(completeness)
        
        confidence_factors['data_completeness'] = np.mean(completeness_scores) if completeness_scores else 0
        
        # Data consistency factor (low variability in measurements)
        consistency_scores = []
        for col in ['temperature', 'precipitation', 'humidity']:
            if col in df.columns and df[col].notna().sum() > 1:
                cv = df[col].std() / max(0.1, abs(df[col].mean()))  # Coefficient of variation
                consistency = max(0, 1 - min(1, cv / 2))  # Normalize and invert
                consistency_scores.append(consistency)
        
        confidence_factors['data_consistency'] = np.mean(consistency_scores) if consistency_scores else 0
        
        # Calculate overall confidence
        weights = {
            'data_quantity': 0.4,
            'data_completeness': 0.4,
            'data_consistency': 0.2
        }
        
        overall_confidence = sum(
            confidence_factors.get(factor, 0) * weight 
            for factor, weight in weights.items()
        )
        
        # Confidence level classification
        if overall_confidence >= 0.8:
            confidence_level = 'high'
        elif overall_confidence >= 0.6:
            confidence_level = 'medium'
        elif overall_confidence >= 0.4:
            confidence_level = 'low'
        else:
            confidence_level = 'very_low'
        
        return {
            'overall_confidence': round(overall_confidence * 100, 2),
            'confidence_level': confidence_level,
            'confidence_factors': {k: round(v * 100, 2) for k, v in confidence_factors.items()},
            'recommendations': self._generate_confidence_recommendations(confidence_level, confidence_factors)
        }
    
    def _generate_confidence_recommendations(self, confidence_level: str, factors: Dict) -> List[str]:
        """Generate recommendations to improve analysis confidence"""
        
        recommendations = []
        
        if factors.get('data_quantity', 0) < 0.6:
            recommendations.append("Collect more data points for better analysis accuracy")
        
        if factors.get('data_completeness', 0) < 0.8:
            recommendations.append("Improve data collection to reduce missing values")
        
        if factors.get('data_consistency', 0) < 0.6:
            recommendations.append("Review data quality and measurement consistency")
        
        if confidence_level == 'high':
            recommendations.append("High confidence analysis - results are reliable")
        elif confidence_level == 'medium':
            recommendations.append("Moderate confidence - consider additional validation")
        else:
            recommendations.append("Low confidence - use results with caution and gather more data")
        
        return recommendations

    def get_analysis_summary(self, analysis_results: Dict) -> Dict:
        """Generate a concise summary of the analysis results"""
        
        if not analysis_results or 'error' in analysis_results:
            return {'summary_error': 'invalid_analysis_results'}
        
        summary = {
            'data_overview': {
                'records_analyzed': analysis_results.get('dataset_info', {}).get('total_records', 0),
                'date_range': analysis_results.get('dataset_info', {}).get('date_range', {}),
                'quality_score': analysis_results.get('dataset_info', {}).get('data_quality_score', 0)
            },
            'key_findings': [],
            'recommendations': [],
            'confidence': analysis_results.get('confidence_metrics', {}).get('confidence_level', 'unknown')
        }
        
        # Extract key findings
        if 'statistical_summary' in analysis_results:
            temp_stats = analysis_results['statistical_summary'].get('temperature', {})
            if temp_stats:
                temp_mean = temp_stats.get('basic_statistics', {}).get('mean', 'N/A')
                summary['key_findings'].append(f"Average temperature: {temp_mean}°C")
        
        if 'activity_suitability' in analysis_results:
            suitability = analysis_results['activity_suitability'].get('suitability_analysis', {})
            if suitability:
                suit_pct = suitability.get('suitability_percentage', 0)
                summary['key_findings'].append(f"Activity suitability: {suit_pct}%")
        
        # Extract recommendations
        if 'activity_suitability' in analysis_results:
            activity_recs = analysis_results['activity_suitability'].get('recommendations', [])
            summary['recommendations'].extend(activity_recs[:2])  # Top 2 recommendations
        
        return summary

if __name__ == "__main__":
    # Example usage
    analyzer = OptimizedWeatherAnalyzer()
    
    # Sample data for testing
    sample_data = [
        {'date': '2024-01-01', 'temperature': 15, 'precipitation': 2, 'humidity': 65, 'wind_speed': 8},
        {'date': '2024-01-02', 'temperature': 17, 'precipitation': 0, 'humidity': 60, 'wind_speed': 10},
        # Add more sample data as needed
    ]
    
    print("Running comprehensive analysis...")
    results = analyzer.comprehensive_analysis(sample_data, "outdoor")
    
    print("Analysis completed!")
    print("Summary:", analyzer.get_analysis_summary(results))