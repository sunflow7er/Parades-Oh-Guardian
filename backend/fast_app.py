"""
Fast App - Quick Weather Analysis for Development
Provides fast responses for testing and development
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime, timedelta
import random
import time

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "🛰️ Parade's oh guardian API - NASA Space Apps Challenge 2025",
        "status": "operational - FAST MODE",
        "challenge": "Will It Rain On My Parade?"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": "2025-10-04"})

@app.route('/api/weather-windows', methods=['POST'])
def analyze_weather_windows_fast():
    """
    FAST weather analysis using smart simulation
    Returns results in under 2 seconds guaranteed!
    """
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        activity_type = data.get('activity_type', 'general')
        
        print(f"🚀 FAST Analysis: {latitude}, {longitude}, {start_date} to {end_date}")
        
        if not all([latitude, longitude, start_date, end_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Generate realistic weather analysis (based on location patterns)
        weather_windows = generate_fast_analysis(latitude, longitude, start_date, end_date, activity_type)
        
        analysis_time = time.time() - start_time
        print(f"✅ Fast analysis completed in {analysis_time:.2f} seconds")
        
        return jsonify({
            'success': True,
            'analysis_time_seconds': round(analysis_time, 2),
            'activity_type': activity_type,
            'weather_windows': weather_windows,
            'top_recommendations': weather_windows[:3],
            'daily_analysis': weather_windows,
            'conditions': get_average_conditions(weather_windows),
            'risks': get_average_risks(weather_windows),
            'methodology': {
                'data_source': 'Fast Climate Patterns',
                'approach': 'Optimized Geographic Analysis',
                'processing_time': f'{analysis_time:.2f}s',
                'note': 'Fast mode for development - uses statistical patterns'
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_fast_analysis(lat, lon, start_date, end_date, activity_type):
    """Generate fast weather analysis based on geographic patterns"""
    
    start_dt = datetime.strptime(start_date, '%Y-%m-%d')
    end_dt = datetime.strptime(end_date, '%Y-%m-%d')
    
    results = []
    current_date = start_dt
    
    while current_date <= end_dt:
        month = current_date.month
        climate_factors = get_fast_climate_factors(lat, lon, month)
        
        day_analysis = generate_fast_day_analysis(current_date, climate_factors, activity_type)
        results.append(day_analysis)
        current_date += timedelta(days=1)
    
    # Sort by weather score
    results.sort(key=lambda x: x['weather_score'], reverse=True)
    return results

def get_fast_climate_factors(lat, lon, month):
    """Get climate factors quickly"""
    
    # Kazakhstan/Central Asia
    if 40 <= lat <= 50 and 70 <= lon <= 85:
        seasonal_temps = {
            1: -8, 2: -5, 3: 2, 4: 12, 5: 18, 6: 23,
            7: 25, 8: 24, 9: 19, 10: 11, 11: 1, 12: -6
        }
        
        base_temp = seasonal_temps.get(month, 10)
        temp_variation = 8
        rain_probability = 0.2
        
        return {
            'base_temp': base_temp,
            'temp_variation': temp_variation,
            'rain_probability': rain_probability,
            'wind_factor': 1.2,
            'humidity_base': 65,
            'season': 'winter' if month in [12, 1, 2] else 'summer' if month in [6, 7, 8] else 'transition'
        }
    
    # Default climate
    seasonal_temps = {
        1: 2, 2: 4, 3: 8, 4: 14, 5: 19, 6: 23,
        7: 26, 8: 25, 9: 21, 10: 15, 11: 9, 12: 4
    }
    
    return {
        'base_temp': seasonal_temps.get(month, 15),
        'temp_variation': 6,
        'rain_probability': 0.25,
        'wind_factor': 1.0,
        'humidity_base': 65,
        'season': 'default'
    }

def generate_fast_day_analysis(date, climate_factors, activity_type):
    """Generate fast analysis for single day"""
    
    # Consistent random for same date
    random.seed(int(date.timestamp()))
    
    # Fast weather generation
    base_temp = climate_factors['base_temp']
    temp_var = climate_factors['temp_variation']
    temperature = base_temp + random.uniform(-temp_var, temp_var)
    
    # Precipitation
    rain_prob = climate_factors['rain_probability']
    if random.random() < rain_prob:
        precipitation = random.uniform(0.5, 15)  # Light to moderate rain
    else:
        precipitation = random.uniform(0, 0.5)   # Dry or trace
    
    # Wind
    wind_base = 3 + random.uniform(0, 8)
    wind_speed = wind_base * climate_factors['wind_factor']
    
    # Humidity
    humidity = climate_factors['humidity_base'] + random.uniform(-15, 20)
    humidity = max(30, min(95, humidity))
    
    # Fast risk calculation
    activity_thresholds = {
        'wedding': {'max_rain': 5, 'ideal_temp_min': 18, 'ideal_temp_max': 28},
        'hiking': {'max_rain': 10, 'ideal_temp_min': 10, 'ideal_temp_max': 25},
        'farming': {'max_rain': 50, 'ideal_temp_min': 5, 'ideal_temp_max': 35},
        'general': {'max_rain': 15, 'ideal_temp_min': 15, 'ideal_temp_max': 30}
    }
    
    thresholds = activity_thresholds.get(activity_type, activity_thresholds['general'])
    
    rain_risk = min(100, (precipitation / thresholds['max_rain']) * 100)
    temp_risk = 30 if (temperature < thresholds['ideal_temp_min'] or 
                      temperature > thresholds['ideal_temp_max']) else 0
    wind_risk = min(100, (wind_speed / 8) * 100) if wind_speed > 6 else 0
    
    weather_score = max(0, 100 - rain_risk - temp_risk - wind_risk)
    
    return {
        'date': date.strftime('%Y-%m-%d'),
        'day_of_week': date.strftime('%A'),
        'weather_score': round(weather_score, 1),
        'overall_risk': round(rain_risk + temp_risk + wind_risk, 1),
        'confidence_score': 80,
        'conditions': {
            'temperature': round(temperature, 1),
            'precipitation': round(precipitation, 1),
            'wind_speed': round(wind_speed, 1),
            'humidity': round(humidity, 1)
        },
        'risks': {
            'heavy_rain': {'probability': round(rain_risk, 1)},
            'temperature_extreme': {'probability': round(temp_risk, 1)},
            'strong_winds': {'probability': round(wind_risk, 1)}
        },
        'recommendation': get_fast_recommendation(weather_score)
    }

def get_fast_recommendation(score):
    """Fast recommendation based on score"""
    if score >= 80:
        return "Excellent conditions!"
    elif score >= 60:
        return "Good conditions"
    elif score >= 40:
        return "Moderate conditions"
    else:
        return "Poor conditions"

def get_average_conditions(results):
    """Calculate average conditions"""
    if not results:
        return {}
    
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

def get_average_risks(results):
    """Calculate average risks"""
    if not results:
        return {}
    
    rain_risks = [r['risks']['heavy_rain']['probability'] for r in results if 'risks' in r]
    temp_risks = [r['risks']['temperature_extreme']['probability'] for r in results if 'risks' in r]
    wind_risks = [r['risks']['strong_winds']['probability'] for r in results if 'risks' in r]
    
    return {
        'heavy_rain': {'probability': round(sum(rain_risks) / len(rain_risks), 1) if rain_risks else 0},
        'temperature_extreme': {'probability': round(sum(temp_risks) / len(temp_risks), 1) if temp_risks else 0},
        'strong_winds': {'probability': round(sum(wind_risks) / len(wind_risks), 1) if wind_risks else 0}
    }

@app.route('/api/weather-risks', methods=['POST'])
def analyze_weather_risks():
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        target_date = data.get('target_date')
        
        if not all([latitude, longitude, target_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Fast single day analysis
        target_dt = datetime.strptime(target_date, '%Y-%m-%d')
        climate_factors = get_fast_climate_factors(latitude, longitude, target_dt.month)
        analysis = generate_fast_day_analysis(target_dt, climate_factors, 'general')
        
        return jsonify({
            'success': True,
            'date': target_date,
            'risks': analysis['risks'],
            'conditions': analysis['conditions'],
            'weather_score': analysis['weather_score']
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Fast Weather API Starting...")
    print("Mode: Development/Testing")
    app.run(debug=True, host='0.0.0.0', port=5001)