import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class DisasterPredictor:
    """
    Predicts natural disaster risks based on weather patterns
    """
    
    DISASTER_THRESHOLDS = {
        'flood': {
            'precipitation_3day': 75.0,  # mm in 3 days
            'soil_moisture': 0.8,
            'elevation_risk': True
        },
        'drought': {
            'precipitation_30day': 10.0,  # mm in 30 days
            'temperature_avg': 35.0,
            'humidity_avg': 30.0
        },
        'heatwave': {
            'temperature_consecutive': 35.0,  # 3+ days above 35°C
            'duration_days': 3
        },
        'blizzard': {
            'temperature_max': -5.0,
            'wind_speed': 15.0,  # m/s
            'precipitation': 20.0  # snow
        }
    }
    
    REGIONAL_PATTERNS = {
        'KZ': {  # Kazakhstan
            'spring': ['dust_storm', 'flood'],
            'summer': ['heatwave', 'drought'],
            'autumn': ['early_frost'],
            'winter': ['blizzard', 'extreme_cold']
        },
        'US': {  # United States
            'spring': ['tornado', 'flood'],
            'summer': ['hurricane', 'wildfire', 'heatwave'],
            'autumn': ['hurricane'],
            'winter': ['blizzard', 'ice_storm']
        },
        'JP': {  # Japan
            'spring': ['earthquake'],
            'summer': ['typhoon', 'heatwave'],
            'autumn': ['typhoon'],
            'winter': ['heavy_snow']
        }
    }
    
    def predict_disasters(self, historical_df, target_date, latitude, longitude):
        """
        Predict disaster risks for target location and date
        """
        country_code = self._get_country_code(latitude, longitude)
        season = self._get_season(target_date)
        
        # Analyze historical patterns
        disaster_risks = []
        
        # Flood risk
        flood_risk = self._calculate_flood_risk(historical_df, target_date)
        if flood_risk['probability'] > 20:
            disaster_risks.append(flood_risk)
        
        # Drought risk
        drought_risk = self._calculate_drought_risk(historical_df, target_date)
        if drought_risk['probability'] > 15:
            disaster_risks.append(drought_risk)
        
        # Heatwave risk
        heatwave_risk = self._calculate_heatwave_risk(historical_df, target_date)
        if heatwave_risk['probability'] > 25:
            disaster_risks.append(heatwave_risk)
        
        # Regional specific risks
        regional_risks = self._get_regional_risks(country_code, season, historical_df)
        disaster_risks.extend(regional_risks)
        
        return disaster_risks
    
    def _calculate_flood_risk(self, df, target_date):
        """Calculate flood risk based on precipitation patterns"""
        month = target_date.month
        day = target_date.day
        
        # Find similar dates
        similar_dates = df[
            (df['month'] == month) & 
            (abs(df['day'] - day) <= 5)
        ]
        
        # Calculate 3-day precipitation sums
        heavy_rain_events = 0
        total_events = 0
        
        for i in range(len(similar_dates) - 2):
            three_day_sum = similar_dates.iloc[i:i+3]['precipitation'].sum()
            total_events += 1
            if three_day_sum > self.DISASTER_THRESHOLDS['flood']['precipitation_3day']:
                heavy_rain_events += 1
        
        probability = (heavy_rain_events / max(total_events, 1)) * 100 if total_events > 0 else 0
        
        return {
            'type': 'flood',
            'probability': min(probability, 100),
            'level': 'high' if probability > 40 else 'medium' if probability > 20 else 'low',
            'description': f'Risk of flooding based on {total_events} historical events'
        }
    
    def _calculate_drought_risk(self, df, target_date):
        """Calculate drought risk based on precipitation and temperature"""
        month = target_date.month
        
        # Look at same month across years
        month_data = df[df['month'] == month]
        
        # Calculate monthly precipitation totals
        monthly_precip = month_data.groupby(month_data['date'].dt.year)['precipitation'].sum()
        
        # Count dry months (< 10mm total)
        dry_months = len(monthly_precip[monthly_precip < self.DISASTER_THRESHOLDS['drought']['precipitation_30day']])
        total_months = len(monthly_precip)
        
        probability = (dry_months / max(total_months, 1)) * 100 if total_months > 0 else 0
        
        return {
            'type': 'drought',
            'probability': min(probability, 100),
            'level': 'high' if probability > 30 else 'medium' if probability > 15 else 'low',
            'description': f'Drought conditions observed in {dry_months}/{total_months} years'
        }
    
    def _calculate_heatwave_risk(self, df, target_date):
        """Calculate heatwave risk"""
        month = target_date.month
        day = target_date.day
        
        similar_dates = df[
            (df['month'] == month) & 
            (abs(df['day'] - day) <= 7)
        ]
        
        # Find consecutive hot days
        heatwave_events = 0
        total_periods = 0
        
        for i in range(len(similar_dates) - 2):
            three_day_temps = similar_dates.iloc[i:i+3]['temp_max']
            total_periods += 1
            if all(temp > self.DISASTER_THRESHOLDS['heatwave']['temperature_consecutive'] for temp in three_day_temps):
                heatwave_events += 1
        
        probability = (heatwave_events / max(total_periods, 1)) * 100 if total_periods > 0 else 0
        
        return {
            'type': 'heatwave',
            'probability': min(probability, 100),
            'level': 'high' if probability > 35 else 'medium' if probability > 20 else 'low',
            'description': f'Heatwave risk based on temperature patterns'
        }
    
    def _get_regional_risks(self, country_code, season, df):
        """Get region-specific disaster risks"""
        if country_code not in self.REGIONAL_PATTERNS:
            return []
        
        seasonal_risks = self.REGIONAL_PATTERNS[country_code].get(season, [])
        regional_disasters = []
        
        for risk_type in seasonal_risks:
            if risk_type == 'dust_storm' and country_code == 'KZ':
                regional_disasters.append({
                    'type': 'dust_storm',
                    'probability': 25,
                    'level': 'medium',
                    'description': 'Seasonal dust storms common in Kazakhstan steppes'
                })
            elif risk_type == 'earthquake' and country_code == 'JP':
                regional_disasters.append({
                    'type': 'earthquake',
                    'probability': 15,
                    'level': 'medium',
                    'description': 'Japan is in active seismic zone'
                })
        
        return regional_disasters
    
    def get_seasonal_patterns(self, country_code):
        """Get seasonal weather patterns for a country"""
        patterns = [
            {
                'name': 'Spring',
                'icon': '🌸',
                'commonEvents': self.REGIONAL_PATTERNS.get(country_code, {}).get('spring', ['mild_weather'])
            },
            {
                'name': 'Summer',
                'icon': '☀️',
                'commonEvents': self.REGIONAL_PATTERNS.get(country_code, {}).get('summer', ['hot_weather'])
            },
            {
                'name': 'Autumn',
                'icon': '🍂',
                'commonEvents': self.REGIONAL_PATTERNS.get(country_code, {}).get('autumn', ['cool_weather'])
            },
            {
                'name': 'Winter',
                'icon': '❄️',
                'commonEvents': self.REGIONAL_PATTERNS.get(country_code, {}).get('winter', ['cold_weather'])
            }
        ]
        return patterns
    
    def _get_country_code(self, lat, lon):
        """Simple country detection based on coordinates"""
        # Kazakhstan
        if 40 <= lat <= 55 and 46 <= lon <= 87:
            return 'KZ'
        # USA (continental)
        elif 25 <= lat <= 49 and -125 <= lon <= -66:
            return 'US'
        # Japan
        elif 30 <= lat <= 46 and 129 <= lon <= 146:
            return 'JP'
        else:
            return 'UNKNOWN'
    
    def _get_season(self, date):
        """Get season based on date"""
        month = date.month
        if month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        elif month in [9, 10, 11]:
            return 'autumn'
        else:
            return 'winter'

# Global instance
disaster_predictor = DisasterPredictor()
