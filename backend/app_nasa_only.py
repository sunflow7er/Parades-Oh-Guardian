from flask import Flask, request, jsonify
from flask_cors import CORS
from nasa_api import NASAWeatherAPI
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize NASA API
nasa_api = NASAWeatherAPI()

@app.route('/')
def home():
    return jsonify({
        "message": "NASA ONLY - Space Apps Challenge 2025",
        "status": "nasa_power_only", 
        "data_source": "NASA POWER API Exclusive",
        "challenge": "Will It Rain On My Parade?",
        "compliance": "100% NASA satellite data",
        "no_fake_data": True
    })

@app.route('/api/nasa-status', methods=['GET'])
def nasa_status():
    """Check NASA API connectivity"""
    try:
        # Test NASA connection
        test_result = nasa_api.get_weather_analysis(
            43.2567, 76.9286, '2024-07-01', '2024-07-01', 'general'
        )
        
        if test_result.get('success'):
            return jsonify({
                "nasa_api": "connected",
                "status": "operational",
                "test_location": "Almaty, Kazakhstan",
                "data_points": len(test_result.get('daily_analysis', []))
            })
        else:
            return jsonify({
                "nasa_api": "degraded",
                "status": "limited",
                "error": test_result.get('error')
            })
            
    except Exception as e:
        return jsonify({
            "nasa_api": "unavailable",
            "status": "offline",
            "error": str(e)
        }), 503

@app.route('/api/weather-windows', methods=['POST'])
def analyze_weather_windows():
    """NASA-ONLY weather analysis"""
    
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude') 
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        activity_type = data.get('activity_type', 'general')
        
        print(f"NASA-ONLY Analysis: {latitude}, {longitude}")
        
        if not all([latitude, longitude, start_date, end_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # ONLY use NASA POWER API - NO OTHER DATA SOURCES
        result = nasa_api.get_weather_analysis(
            latitude, longitude, start_date, end_date, activity_type
        )
        
        # Add NASA-specific metadata
        if result.get('success'):
            result['nasa_compliance'] = {
                'data_source': 'NASA POWER API exclusively',
                'satellite_missions': ['MODIS', 'GOES', 'NOAA'],
                'parameters': ['T2M', 'PRECTOTCORR', 'WS2M', 'RH2M'],
                'resolution': '0.5° x 0.625° global grid',
                'temporal_coverage': '40+ years (1981-present)'
            }
        
        analysis_time = time.time() - start_time
        print(f"NASA-ONLY analysis: {analysis_time:.2f}s")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"NASA-ONLY Error: {str(e)}")
        return jsonify({
            "error": "NASA POWER API exclusive mode failed",
            "fallback": "None - NASA data only"
        }), 500

@app.route('/api/nasa-parameters', methods=['GET'])
def nasa_parameters():
    """NASA POWER API parameter definitions"""
    return jsonify({
        "parameters": {
            "T2M": {
                "name": "Temperature at 2 Meters",
                "unit": "°C",
                "description": "Air temperature at 2 meters above ground"
            },
            "PRECTOTCORR": {
                "name": "Precipitation Corrected",
                "unit": "mm/day",
                "description": "Daily precipitation corrected for gauge undercatch"
            },
            "WS2M": {
                "name": "Wind Speed at 2 Meters",
                "unit": "m/s",
                "description": "Wind speed at 2 meters above ground"
            },
            "RH2M": {
                "name": "Relative Humidity at 2 Meters",
                "unit": "%",
                "description": "Relative humidity at 2 meters above ground"
            }
        },
        "data_source": "NASA POWER API",
        "documentation": "https://power.larc.nasa.gov/docs/"
    })

if __name__ == '__main__':
    print("NASA-ONLY Weather API Starting...")
    print("Data Source: NASA POWER API Exclusively")
    print("No fallback data - NASA satellite measurements only")
    app.run(debug=True, host='0.0.0.0', port=5003)