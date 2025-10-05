"""
Old App with Fake Data - BACKUP ONLY
This version contains random data generation for comparison purposes
DO NOT USE FOR COMPETITION - CONTAINS FAKE WEATHER DATA
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "⚠️ BACKUP VERSION WITH FAKE DATA - DO NOT USE FOR COMPETITION",
        "status": "backup_only", 
        "data_source": "FAKE RANDOM DATA - NOT NASA",
        "challenge": "Will It Rain On My Parade?",
        "warning": "THIS VERSION VIOLATES COMPETITION RULES",
        "use_instead": "Use app.py or app_backup.py for NASA data"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "fake_data_backup", 
        "warning": "Contains random data generation",
        "competition_compliant": False
    })

@app.route('/api/weather-windows', methods=['POST'])
def analyze_weather_windows():
    """
    FAKE weather analysis using random data
    ⚠️ DO NOT USE FOR COMPETITION ⚠️
    """
    
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        activity_type = data.get('activity_type', 'general')
        
        print(f"⚠️ FAKE DATA Analysis: {latitude}, {longitude}")
        
        if not all([latitude, longitude, start_date, end_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Generate FAKE weather data - DO NOT USE FOR COMPETITION
        weather_windows = generate_fake_analysis(latitude, longitude, start_date, end_date, activity_type)
        
        analysis_time = time.time() - start_time
        
        return jsonify({
            'success': True,
            'WARNING': '⚠️ THIS IS FAKE DATA - NOT FOR COMPETITION USE',
            'analysis_time_seconds': round(analysis_time, 2),
            'activity_type': activity_type,
            'weather_windows': weather_windows,
            'top_recommendations': weather_windows[:3],
            'daily_analysis': weather_windows,
            'data_integrity_warning': 'CONTAINS RANDOM GENERATED DATA',
            'methodology': {
                'data_source': 'FAKE RANDOM GENERATION',
                'approach': 'Mathematical simulation - NOT REAL',
                'processing_time': f'{analysis_time:.2f}s',
                'competition_violation': True
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_fake_analysis(lat, lon, start_date, end_date, activity_type):
    """Generate FAKE weather analysis - DO NOT USE FOR COMPETITION"""
    
    start_dt = datetime.strptime(start_date, '%Y-%m-%d')
    end_dt = datetime.strptime(end_date, '%Y-%m-%d')
    
    results = []
    current_date = start_dt
    
    while current_date <= end_dt:
        # FAKE DATA GENERATION - VIOLATES COMPETITION RULES
        temperature = random.uniform(-10, 35)  # ⚠️ FAKE
        precipitation = random.uniform(0, 25)  # ⚠️ FAKE  
        wind_speed = random.uniform(0, 15)     # ⚠️ FAKE
        humidity = random.uniform(30, 90)      # ⚠️ FAKE
        
        # FAKE risk calculation
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
        wind_risk = min(100, (wind_speed * 3.6 / 25) * 100) if wind_speed > 6 else 0
        
        weather_score = max(0, 100 - rain_risk - temp_risk - wind_risk)
        
        day_analysis = {
            'date': current_date.strftime('%Y-%m-%d'),
            'day_of_week': current_date.strftime('%A'),
            'weather_score': round(weather_score, 1),
            'overall_risk': round(rain_risk + temp_risk + wind_risk, 1),
            'confidence_score': 0,  # Zero confidence - fake data
            'DATA_WARNING': '⚠️ FAKE GENERATED DATA',
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
            'recommendation': get_fake_recommendation(weather_score),
            'data_source': 'FAKE RANDOM GENERATION - NOT NASA'
        }
        
        results.append(day_analysis)
        current_date += timedelta(days=1)
    
    # Sort by weather score
    results.sort(key=lambda x: x['weather_score'], reverse=True)
    return results

def get_fake_recommendation(score):
    """Get fake recommendation - DO NOT USE"""
    if score >= 80:
        return "⚠️ Fake: Excellent conditions (randomly generated)"
    elif score >= 60:
        return "⚠️ Fake: Good conditions (randomly generated)"
    elif score >= 40:
        return "⚠️ Fake: Moderate conditions (randomly generated)"
    else:
        return "⚠️ Fake: Poor conditions (randomly generated)"

@app.route('/api/weather-risks', methods=['POST'])
def analyze_weather_risks():
    """FAKE risk analysis - DO NOT USE FOR COMPETITION"""
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        target_date = data.get('target_date')
        
        if not all([latitude, longitude, target_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # FAKE single day analysis
        target_dt = datetime.strptime(target_date, '%Y-%m-%d')
        fake_analysis = generate_fake_analysis(latitude, longitude, target_date, target_date, 'general')[0]
        
        return jsonify({
            'success': True,
            'WARNING': '⚠️ FAKE DATA - NOT FOR COMPETITION',
            'date': target_date,
            'risks': fake_analysis['risks'],
            'conditions': fake_analysis['conditions'],
            'weather_score': fake_analysis['weather_score'],
            'data_integrity': 'FAKE RANDOM DATA'
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("⚠️" * 30)
    print("WARNING: FAKE DATA VERSION")
    print("DO NOT USE FOR COMPETITION")
    print("CONTAINS RANDOM DATA GENERATION")
    print("USE app.py OR app_backup.py FOR NASA DATA")
    print("⚠️" * 30)
    app.run(debug=True, host='0.0.0.0', port=5005)