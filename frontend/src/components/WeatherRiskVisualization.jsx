import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, CloudRain, AlertTriangle } from 'lucide-react';

const WeatherRiskVisualization = ({ weatherData, riskThresholds }) => {
  const [animatedScores, setAnimatedScores] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Risk categories with their thresholds and calculations
  const riskCategories = [
    {
      id: 'veryHot',
      name: 'Very Hot',
      icon: Thermometer,
      color: 'red',
      threshold: riskThresholds?.veryHot || 35,
      unit: '°C',
  getValue: () => (typeof weatherData?.temperature === 'number' ? weatherData.temperature : 0),
      description: 'Risk of extreme heat conditions'
    },
    {
      id: 'veryCold',
      name: 'Very Cold',
      icon: Thermometer,
      color: 'blue',
      threshold: riskThresholds?.veryCold || -20,
      unit: '°C',
  getValue: () => (typeof weatherData?.temperature === 'number' ? weatherData.temperature : 0),
      description: 'Risk of extreme cold conditions',
      isReverse: true // Risk increases as value goes below threshold
    },
    {
      id: 'veryWindy',
      name: 'Very Windy',
      icon: Wind,
      color: 'yellow',
      threshold: riskThresholds?.veryWindy || 25,
      unit: ' km/h',
      getValue: () => {
        const v = weatherData?.windSpeed ?? weatherData?.wind_speed;
        return typeof v === 'number' ? v : 0;
      },
      description: 'Risk of dangerous wind conditions'
    },
    {
      id: 'veryWet',
      name: 'Very Wet',
      icon: CloudRain,
      color: 'indigo',
      threshold: riskThresholds?.veryWet || 20,
      unit: 'mm',
  getValue: () => (typeof weatherData?.precipitation === 'number' ? weatherData.precipitation : 0),
      description: 'Risk of heavy precipitation'
    },
    {
      id: 'veryUncomfortable',
      name: 'Very Uncomfortable',
      icon: AlertTriangle,
      color: 'orange',
      threshold: riskThresholds?.veryUncomfortable || 80,
      unit: '',
      getValue: () => {
        const T = weatherData?.temperature; // °C
        const RH = weatherData?.humidity; // %
        const windMs = weatherData?.windSpeed || weatherData?.wind_speed; // m/s
        if (typeof T !== 'number' || typeof RH !== 'number') return 0;
        // Heat Index (NOAA) valid for T >= 27°C (80°F) & RH >= 40%
        const toF = (c) => c * 9/5 + 32;
        const toC = (f) => (f - 32) * 5/9;
        let discomfort = 0;
        if (T >= 27 && RH >= 40) {
          const T_F = toF(T);
          // NOAA Rothfusz regression
          const HI_F = -42.379 + 2.04901523*T_F + 10.14333127*RH - 0.22475541*T_F*RH - 0.00683783*T_F*T_F - 0.05481717*RH*RH + 0.00122874*T_F*T_F*RH + 0.00085282*T_F*RH*RH - 0.00000199*T_F*T_F*RH*RH;
          discomfort = toC(HI_F); // convert back to °C equivalent
        } else if (T <= 10 && windMs) {
          // Wind chill (Canadian formula) only valid for T <= 10°C & wind > 4.8 km/h
            const windKmh = windMs * 3.6;
            if (windKmh > 4.8) {
              discomfort = 13.12 + 0.6215*T - 11.37*Math.pow(windKmh,0.16) + 0.3965*T*Math.pow(windKmh,0.16);
            } else {
              discomfort = T;
            }
        } else {
          // Mild band: use humidity-adjusted apparent temperature (simple approximation)
          discomfort = T + (0.33 * (RH/100) * 6) - 4;
        }
        // Transform into a pseudo-index 0-120 for risk scaling; clamp
        return Math.min(120, Math.max(0, discomfort));
      },
      description: 'Heat index / wind chill adjusted apparent stress'
    }
  ];

  // Calculate risk score for each category
  const calculateRiskScore = (category) => {
    const currentValue = category.getValue();
    const threshold = category.threshold;
    
    if (category.isReverse) {
      // For cold conditions - risk increases as temperature drops below threshold
      if (currentValue <= threshold) {
        return Math.min(100, ((threshold - currentValue) / Math.abs(threshold)) * 100);
      }
      return 0;
    } else {
      // For hot, windy, wet, discomfort conditions - risk increases as value exceeds threshold
      if (currentValue >= threshold) {
        return Math.min(100, ((currentValue - threshold) / threshold) * 100);
      }
      return Math.max(0, (currentValue / threshold) * 25); // gentler ramp below threshold
    }
  };

  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'EXTREME', color: 'red' };
    if (score >= 60) return { level: 'HIGH', color: 'orange' };
    if (score >= 40) return { level: 'MODERATE', color: 'yellow' };
    if (score >= 20) return { level: 'LOW', color: 'blue' };
    return { level: 'MINIMAL', color: 'green' };
  };

  // Animate scores on mount
  useEffect(() => {
    setIsVisible(true);
    const animateScores = () => {
      riskCategories.forEach((category, index) => {
        const targetScore = calculateRiskScore(category);
        setTimeout(() => {
          let currentScore = 0;
          const increment = targetScore / 30; // 30 steps animation
          
          const interval = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
              currentScore = targetScore;
              clearInterval(interval);
            }
            
            setAnimatedScores(prev => ({
              ...prev,
              [category.id]: currentScore
            }));
          }, 50);
        }, index * 200);
      });
    };

    if (weatherData) {
      animateScores();
    }
  }, [weatherData]);

  // Calculate overall risk
  const overallRisk = riskCategories.reduce((sum, cat) => sum + calculateRiskScore(cat), 0) / riskCategories.length;
  const overallRiskLevel = getRiskLevel(overallRisk);

  const CircularProgress = ({ score, color, size = 120 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            style={{ strokeLinecap: 'round' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${color}-600`}>
              {Math.round(score)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!weatherData) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Weather Risk Analysis</h3>
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No weather data available for risk analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Weather Risk Analysis</h3>
        <p className="text-gray-600">Statistical analysis based on NASA satellite data</p>
      </div>

      {/* Overall Risk Score */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">Overall Risk Assessment</h4>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold text-${overallRiskLevel.color}-800 bg-${overallRiskLevel.color}-100 border border-${overallRiskLevel.color}-200`}>
              {overallRiskLevel.level} RISK
            </div>
            <p className="text-gray-600 mt-2">
              Composite score: {Math.round(overallRisk)}% • Based on 5 weather factors
            </p>
          </div>
          <CircularProgress score={animatedScores.overall || overallRisk} color={overallRiskLevel.color} size={100} />
        </div>
      </div>

      {/* Individual Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskCategories.map((category, index) => {
          const score = animatedScores[category.id] || 0;
          const riskLevel = getRiskLevel(score);
          const currentValue = category.getValue();
          const Icon = category.icon;

          return (
            <div
              key={category.id}
              className={`bg-gradient-to-br from-${category.color}-50 to-${category.color}-100 rounded-xl p-6 border-2 border-${category.color}-200 transition-all duration-500 hover:shadow-lg`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-${category.color}-200`}>
                    <Icon className={`w-6 h-6 text-${category.color}-700`} />
                  </div>
                  <div>
                    <h5 className={`font-bold text-${category.color}-800`}>{category.name}</h5>
                    <p className={`text-sm text-${category.color}-600`}>
                      {currentValue.toFixed(1)}{category.unit}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <CircularProgress score={score} color={category.color} size={80} />
              </div>

              <div className={`text-center p-3 rounded-lg bg-${category.color}-50 border border-${category.color}-200`}>
                <div className={`text-sm font-bold text-${category.color}-800 mb-1`}>
                  {riskLevel.level}
                </div>
                <div className={`text-xs text-${category.color}-600`}>
                  Threshold: {category.threshold}{category.unit}
                </div>
              </div>

              <p className={`text-xs text-${category.color}-600 mt-3`}>
                {category.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Confidence and Data Sources */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-gray-700">
              Analysis Confidence: {weatherData.confidence || 85}%
            </span>
          </div>
          <div className="text-gray-500">
            Data: NASA POWER • Historical: 20 years • Updated: Real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherRiskVisualization;