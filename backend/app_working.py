from flask import Flask, request, jsonify
from flask_cors import CORS
from nasa_api import NASAWeatherAPI

app = Flask(__name__)
CORS(app)

nasa_api = NASAWeatherAPI()

@app.route('/')
def home():
    return jsonify({
        "message": "NASA Weather API - Working",
        "status": "operational"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/weather-windows', methods=['POST'])
def analyze_weather_windows():
    try:
        data = request.get_json()
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        activity_type = data.get('activity_type', 'general')
        
        if not all([latitude, longitude, start_date, end_date]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        result = nasa_api.get_weather_analysis(
            latitude, longitude, start_date, end_date, activity_type
        )
        
        return jsonify(result)
        
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
        
        result = nasa_api.get_weather_analysis(
            latitude, longitude, target_date, target_date, 'general'
        )
        
        if result.get('success') and result.get('daily_analysis'):
            day_data = result['daily_analysis'][0]
            return jsonify({
                'success': True,
                'date': target_date,
                'risks': day_data.get('risks', {}),
                'conditions': day_data.get('conditions', {}),
                'weather_score': day_data.get('weather_score', 0)
            })
        else:
            return jsonify({'success': False, 'error': 'No data available'})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting NASA Weather API...")
    app.run(debug=True, host='0.0.0.0', port=5001)