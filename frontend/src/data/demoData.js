// Demo data for NASA Space Apps Challenge presentation
// This data simulates real NASA POWER API responses for Almaty, Kazakhstan

export const demoWeatherAnalysis = {
  success: true,
  activity_type: "wedding",
  analysis_period: {
    start_date: "2025-07-01",
    end_date: "2025-07-31",
    total_days_analyzed: 31
  },
  top_recommendations: [
    {
      date: "2025-07-12",
      day_of_week: "Saturday",
      weather_score: 92.3,
      confidence_score: 95.2,
      risks: {
        very_hot: {
          probability: 5.2,
          description: "Temperature above 35°C",
          risk_level: "low"
        },
        very_cold: {
          probability: 0.0,
          description: "Temperature below -10°C", 
          risk_level: "low"
        },
        ideal_temperature: {
          probability: 89.4,
          description: "Temperature 18-28°C",
          risk_level: "low"
        },
        heavy_rain: {
          probability: 8.1,
          description: "Rainfall above 5mm/day",
          risk_level: "low"
        },
        dry_weather: {
          probability: 78.3,
          description: "Little to no rainfall (≤1mm)",
          risk_level: "low"
        },
        strong_winds: {
          probability: 12.4,
          description: "Wind speed above 25 km/h",
          risk_level: "low"
        }
      },
      conditions: {
        temperature: {
          average: 25.8,
          range: {
            min: 18.2,
            max: 32.1
          }
        },
        precipitation: {
          average_daily: 2.3,
          max_recorded: 15.7
        },
        wind_speed: {
          average: 3.1,
          max: 8.9
        },
        humidity: {
          average: 52.4
        }
      },
      historical_data_points: 63,
      recommendation: {
        text: "Excellent weather conditions expected! 🌟",
        level: "excellent",
        advice: []
      }
    },
    {
      date: "2025-07-19",
      day_of_week: "Saturday", 
      weather_score: 88.7,
      confidence_score: 93.8,
      risks: {
        very_hot: {
          probability: 8.9,
          description: "Temperature above 35°C",
          risk_level: "low"
        },
        very_cold: {
          probability: 0.0,
          description: "Temperature below -10°C",
          risk_level: "low"
        },
        ideal_temperature: {
          probability: 85.1,
          description: "Temperature 18-28°C", 
          risk_level: "low"
        },
        heavy_rain: {
          probability: 12.5,
          description: "Rainfall above 5mm/day",
          risk_level: "low"
        },
        dry_weather: {
          probability: 71.2,
          description: "Little to no rainfall (≤1mm)",
          risk_level: "low"
        },
        strong_winds: {
          probability: 15.8,
          description: "Wind speed above 25 km/h",
          risk_level: "low"
        }
      },
      conditions: {
        temperature: {
          average: 26.3,
          range: {
            min: 19.4,
            max: 34.2
          }
        },
        precipitation: {
          average_daily: 3.7,
          max_recorded: 22.1
        },
        wind_speed: {
          average: 3.8,
          max: 11.2
        },
        humidity: {
          average: 48.9
        }
      },
      historical_data_points: 61,
      recommendation: {
        text: "Very good weather conditions. Great choice! ✅",
        level: "very_good", 
        advice: []
      }
    },
    {
      date: "2025-07-05",
      day_of_week: "Saturday",
      weather_score: 82.4,
      confidence_score: 91.6,
      risks: {
        very_hot: {
          probability: 14.2,
          description: "Temperature above 35°C",
          risk_level: "low"
        },
        very_cold: {
          probability: 0.0,
          description: "Temperature below -10°C",
          risk_level: "low"
        },
        ideal_temperature: {
          probability: 79.8,
          description: "Temperature 18-28°C",
          risk_level: "low"
        },
        heavy_rain: {
          probability: 18.9,
          description: "Rainfall above 5mm/day",
          risk_level: "low"
        },
        dry_weather: {
          probability: 64.7,
          description: "Little to no rainfall (≤1mm)",
          risk_level: "low"
        },
        strong_winds: {
          probability: 21.3,
          description: "Wind speed above 25 km/h",
          risk_level: "low"
        }
      },
      conditions: {
        temperature: {
          average: 27.1,
          range: {
            min: 20.8,
            max: 35.9
          }
        },
        precipitation: {
          average_daily: 4.9,
          max_recorded: 28.4
        },
        wind_speed: {
          average: 4.2,
          max: 13.7
        },
        humidity: {
          average: 46.2
        }
      },
      historical_data_points: 59,
      recommendation: {
        text: "Very good weather conditions. Great choice! ✅",
        level: "very_good",
        advice: ["Risk of very hot weather - plan for shade and hydration"]
      }
    }
  ],
  insights: {
    best_date: "2025-07-12",
    worst_date: "2025-07-28",
    average_score: 76.8,
    score_range: {
      min: 45.2,
      max: 92.3
    },
    excellent_days: 8,
    good_days: 15,
    risky_days: 3,
    climate_note: "Analysis based on 20-year historical NASA satellite data"
  },
  methodology: {
    data_source: "NASA POWER API (20-year historical)",
    analysis_method: "Statistical probability + ML pattern recognition", 
    confidence_calculation: "Based on historical data reliability"
  }
}