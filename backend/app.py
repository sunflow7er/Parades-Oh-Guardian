from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from nasa_api import NASAWeatherAPI
from weather_analyzer import WeatherAnalyzer

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize NASA API and Weather Analyzer
nasa_api = NASAWeatherAPI()
weather_analyzer = WeatherAnalyzer()

@app.route('/')
def home():
    return jsonify({
        "message": "🛰️ Parade Saver API - NASA Space Apps Challenge 2025",
        "status": "operational",
        "challenge": "Will It Rain On My Parade?"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": "2025-10-04"})

@app.route('/api/weather-windows', methods=['POST'])
def analyze_weather_windows():
    try:
        data = request.get_json()
        
        # Extract parameters
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        activity_type = data.get('activity_type', 'general')
        
        # Validate inputs
        if not all([latitude, longitude, start_date, end_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Fetch NASA data
        weather_data = nasa_api.get_historical_data(latitude, longitude, start_date, end_date)
        
        # Analyze weather windows
        analysis_result = weather_analyzer.find_best_weather_windows(
            weather_data, 
            activity_type,
            start_date,
            end_date
        )
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/weather-risks', methods=['POST'])
def analyze_weather_risks():
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        target_date = data.get('target_date')
        
        if not all([latitude, longitude, target_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Get weather risk analysis for specific date
        risks = weather_analyzer.calculate_weather_risks(latitude, longitude, target_date)
        
        return jsonify(risks)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)