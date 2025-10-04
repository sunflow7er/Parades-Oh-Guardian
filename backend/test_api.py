#!/usr/bin/env python3
"""
Quick test of NASA POWER API integration
"""

import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nasa_api import NASAWeatherAPI
from weather_analyzer import WeatherAnalyzer

def test_nasa_api():
    """Test NASA API with Almaty coordinates"""
    
    print("🛰️ Testing NASA POWER API Integration...")
    print("-" * 50)
    
    # Initialize API
    nasa_api = NASAWeatherAPI()
    
    # Test with Almaty, Kazakhstan coordinates
    latitude = 43.2567
    longitude = 76.9286
    start_date = "2025-07-01"
    end_date = "2025-07-31"
    
    print(f"📍 Location: Almaty, Kazakhstan ({latitude}, {longitude})")
    print(f"📅 Target period: {start_date} to {end_date}")
    print()
    
    try:
        # Fetch NASA data
        print("📡 Fetching NASA data...")
        weather_data = nasa_api.get_historical_data(latitude, longitude, start_date, end_date)
        
        print("✅ NASA API call successful!")
        print(f"📊 Retrieved {weather_data['metadata']['total_records']:,} historical records")
        print(f"📈 Data range: {weather_data['metadata']['date_range']['start']} to {weather_data['metadata']['date_range']['end']}")
        print()
        
        # Test weather analyzer
        print("🔍 Testing Weather Analysis...")
        analyzer = WeatherAnalyzer()
        
        analysis = analyzer.find_best_weather_windows(
            weather_data, 
            "wedding", 
            start_date, 
            end_date
        )
        
        if analysis['success']:
            print("✅ Weather analysis successful!")
            print(f"🎯 Found {len(analysis['top_recommendations'])} weather windows")
            
            # Show best recommendation
            if analysis['top_recommendations']:
                best = analysis['top_recommendations'][0]
                print(f"🌟 Best date: {best['date']} ({best['day_of_week']})")
                print(f"📊 Weather score: {best['weather_score']}%")
                print(f"🎯 Confidence: {best['confidence_score']}%")
                print(f"📝 Recommendation: {best['recommendation']['text']}")
        else:
            print(f"❌ Analysis failed: {analysis.get('error', 'Unknown error')}")
            
        print("\n" + "="*50)
        print("🎉 NASA Space Apps Challenge - Weather System Test Complete!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        print("\n📋 Troubleshooting tips:")
        print("1. Check internet connection")
        print("2. Verify NASA API is accessible")
        print("3. Check firewall settings")
        return False

if __name__ == "__main__":
    success = test_nasa_api()
    sys.exit(0 if success else 1)