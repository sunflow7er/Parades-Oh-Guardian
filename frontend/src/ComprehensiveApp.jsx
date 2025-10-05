import { useState, useEffect } from 'react';
import { Satellite, Brain, Calendar, TrendingUp, Target, Thermometer, Droplets, Wind, CloudRain, Globe, Zap } from 'lucide-react';

// Import all the advanced components
import AnimatedGlobe from './components/AnimatedGlobe';
import AnimatedMetrics from './components/AnimatedMetrics';
import LoadingState from './components/LoadingState';
import EnhancedLocationInput from './components/EnhancedLocationInputNew';
import InteractiveEventSelector from './components/InteractiveEventSelector';
import WeatherRiskVisualization from './components/WeatherRiskVisualization';
import HistoricalTrendsVisualization from './components/HistoricalTrendsVisualization';
import AlternativeDateFinder from './components/AlternativeDateFinder';
import MLPatternRecognition from './components/MLPatternRecognition';
import TabbedInterface from './components/TabbedInterface';
import WeatherVisualization from './components/WeatherVisualization';
import WeatherTimeline from './components/WeatherTimeline';
import DisasterPredictionCard from './components/DisasterPredictionCard';

// Import demo data
import { demoWeatherAnalysis } from './data/demoData';

// Provide a safe baseline result shape so UI components never crash accessing nested props
const EMPTY_RESULTS = {
  success: false,
  bestDays: [],
  weatherWindow: { totalDays: 0, suitableDays: 0, riskLevel: 'unknown' },
  thresholdAnalysis: {},
  nasaDataSources: [],
  mlPredictions: [],
  alternativeDates: [],
  disasterRisks: {},
  location: '',
  coordinates: { lat: 0, lng: 0 }
};

function ComprehensiveApp() {
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [activeTab, setActiveTab] = useState('overview');
  const [coordinates, setCoordinates] = useState({ lat: 43.2220, lng: 76.8512 }); // Default to Almaty
  const [showVisualizations, setShowVisualizations] = useState(false);

  const kazakhstanCities = [
    { name: 'Almaty', coords: { lat: 43.2220, lng: 76.8512 } },
    { name: 'Nur-Sultan (Astana)', coords: { lat: 51.1694, lng: 71.4491 } },
    { name: 'Shymkent', coords: { lat: 42.3000, lng: 69.6000 } },
    { name: 'Aktobe', coords: { lat: 50.2839, lng: 57.2094 } },
    { name: 'Taraz', coords: { lat: 42.9000, lng: 71.3667 } },
    { name: 'Pavlodar', coords: { lat: 52.2833, lng: 76.9667 } }
  ];

  const activities = [
    { 
      value: 'wedding', 
      label: '💒 Wedding', 
      desc: 'Perfect weather for your special day',
      thresholds: { maxTemp: 30, minTemp: 5, maxWind: 15, maxRain: 10 }
    },
    { 
      value: 'hiking', 
      label: '🥾 Hiking', 
      desc: 'Safe conditions for outdoor adventures',
      thresholds: { maxTemp: 35, minTemp: -5, maxWind: 25, maxRain: 20 }
    },
    { 
      value: 'farming', 
      label: '🌾 Farming', 
      desc: 'Optimal weather for agricultural activities',
      thresholds: { maxTemp: 40, minTemp: -10, maxWind: 30, maxRain: 50 }
    },
    { 
      value: 'festival', 
      label: '🎭 Festival', 
      desc: 'Comfortable conditions for outdoor events',
      thresholds: { maxTemp: 28, minTemp: 8, maxWind: 20, maxRain: 5 }
    }
  ];

  // Weather thresholds from NASA Space Apps Challenge
  const weatherThresholds = {
    veryHot: 35,
    veryCold: -10,
    veryWindy: 50,
    veryWet: 20,
    veryUncomfortable: 40
  };

  useEffect(() => {
    // Add dynamic background effects
    const addWeatherEffects = () => {
      const effects = document.getElementById('weather-effects');
      if (effects && results) {
        // Add animated weather particles based on conditions
        const condition = results.bestDays?.[0]?.conditions || 'clear';
        effects.className = `fixed inset-0 pointer-events-none z-0 weather-${condition}`;
      }
    };

    addWeatherEffects();
  }, [results]);

  const handleAnalyze = async () => {
    // Basic validation
    if (!location || !dateFrom || !dateTo) {
      return;
    }
    if (new Date(dateFrom) >= new Date(dateTo)) {
      setResults({ ...EMPTY_RESULTS, error: 'End date must be after start date.' });
      return;
    }

    setLoading(true);
    setShowVisualizations(false);

    try {
      // Set coordinates from selected city
      const city = kazakhstanCities.find(c => c.name === location);
      const coords = city ? city.coords : coordinates;
      if (city) setCoordinates(city.coords);

      const payload = {
        latitude: coords.lat,
        longitude: coords.lng,
        start_date: dateFrom,
        end_date: dateTo,
        activity_type: activity || 'general'
      };

      const response = await fetch('http://localhost:5001/api/weather-windows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const apiData = await response.json();
      const normalized = normalizeNASAResult(apiData, { dateFrom, dateTo, location, activity, coords });
      setResults(normalized);
      setShowVisualizations(true);
    } catch (err) {
      console.error('NASA analysis failed, using fallback.', err);
      setResults({ ...EMPTY_RESULTS, error: 'NASA data fetch failed. Please retry.', location });
    } finally {
      setLoading(false);
    }
  };

  const normalizeNASAResult = (apiData, ctx) => {
    if (!apiData || !apiData.daily_analysis) {
      return { ...EMPTY_RESULTS, error: 'No NASA data available', location: ctx.location };
    }

    const daily = apiData.daily_analysis;
    // Derive best days from top_recommendations if available, else sort by weather_score
    const top = apiData.top_recommendations?.length ? apiData.top_recommendations : [...daily].sort((a,b)=>b.weather_score - a.weather_score).slice(0,5);
    const bestDays = top.map(d => ({
      date: d.date,
      temperature: d.conditions?.temperature,
      precipitation: d.conditions?.precipitation,
      windSpeed: d.conditions?.wind_speed,
      humidity: d.conditions?.humidity,
      suitabilityScore: d.weather_score,
      overallRisk: d.overall_risk,
      confidence: d.confidence_score
    }));

    const thresholdAnalysis = computeThresholdAnalysis(daily);
    const averageConditions = aggregateAverageConditions(daily);
    const weatherWindow = computeWeatherWindowMeta(daily);
    const alternativeDates = suggestAlternativeDates(daily, bestDays);

    return {
      success: apiData.success,
      location: ctx.location,
      coordinates: ctx.coords,
      dateRange: { from: ctx.dateFrom, to: ctx.dateTo },
      activity: ctx.activity,
      bestDays,
      dailyAnalysis: daily,
      weatherWindow,
      thresholdAnalysis,
      averageConditions,
      alternativeDates,
      nasaDataSources: apiData?.data_source_info ? [apiData.data_source_info.primary || 'NASA POWER API'] : ['NASA POWER API'],
      analysisTime: apiData.analysis_time_seconds,
      methodology: apiData.methodology,
      confidence: Math.min(100, Math.round(bestDays[0]?.confidence || 80)),
      raw: apiData
    };
  };

  const computeThresholdAnalysis = (daily) => {
    const temps = daily.map(d => d.conditions?.temperature).filter(v => typeof v === 'number');
    const winds = daily.map(d => d.conditions?.wind_speed).filter(v => typeof v === 'number');
    const precs = daily.map(d => d.conditions?.precipitation).filter(v => typeof v === 'number');
    const humid = daily.map(d => d.conditions?.humidity).filter(v => typeof v === 'number');

    const maxTemp = temps.length ? Math.max(...temps) : null;
    const minTemp = temps.length ? Math.min(...temps) : null;
    const maxWind = winds.length ? Math.max(...winds) : null;
    const maxPrecip = precs.length ? Math.max(...precs) : null;
    const maxHumidity = humid.length ? Math.max(...humid) : null;

    return {
      veryHot: maxTemp !== null && maxTemp > weatherThresholds.veryHot,
      veryCold: minTemp !== null && minTemp < weatherThresholds.veryCold,
      veryWindy: maxWind !== null && (maxWind * 3.6) > weatherThresholds.veryWindy, // convert m/s to km/h if thresholds km/h
      veryWet: maxPrecip !== null && maxPrecip > weatherThresholds.veryWet,
      veryUncomfortable: maxHumidity !== null && maxHumidity > weatherThresholds.veryUncomfortable
    };
  };

  const aggregateAverageConditions = (daily) => {
    if (!daily.length) return {};
    const avg = (arr) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
    const temps = daily.map(d=>d.conditions?.temperature).filter(n=>typeof n==='number');
    const precs = daily.map(d=>d.conditions?.precipitation).filter(n=>typeof n==='number');
    const winds = daily.map(d=>d.conditions?.wind_speed).filter(n=>typeof n==='number');
    const hums = daily.map(d=>d.conditions?.humidity).filter(n=>typeof n==='number');
    return {
      temperature: avg(temps),
      precipitation: avg(precs),
      windSpeed: avg(winds),
      humidity: avg(hums)
    };
  };

  const computeWeatherWindowMeta = (daily) => {
    if (!daily.length) return { totalDays: 0, suitableDays: 0, riskLevel: 'unknown' };
    const totalDays = daily.length;
    const suitableDays = daily.filter(d => d.weather_score >= 60).length;
    const avgRisk = daily.reduce((s,d)=> s + (d.overall_risk || 0), 0) / totalDays;
    const riskLevel = avgRisk > 140 ? 'high' : avgRisk > 80 ? 'medium' : 'low';
    return { totalDays, suitableDays, riskLevel };
  };

  const suggestAlternativeDates = (daily, bestDays) => {
    if (!daily.length) return [];
    const usedDates = new Set(bestDays.map(d=>d.date));
    const candidates = daily
      .filter(d => !usedDates.has(d.date) && d.weather_score >= 50)
      .sort((a,b)=> b.weather_score - a.weather_score)
      .slice(0,5)
      .map(d => ({
        date: d.date,
        score: d.weather_score,
        temperature: d.conditions?.temperature,
        precipitation: d.conditions?.precipitation,
        windSpeed: d.conditions?.wind_speed
      }));
    return candidates;
  };

  const generateEnhancedBestDays = () => {
    const days = [];
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    
    for (let d = new Date(startDate); d <= endDate && days.length < 10; d.setDate(d.getDate() + 1)) {
      const temp = Math.floor(Math.random() * 25) + 15; // 15-40°C
      const precipitation = Math.random() * 20; // 0-20mm
      const wind = Math.floor(Math.random() * 30) + 5; // 5-35 km/h
      const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
      const pressure = Math.floor(Math.random() * 50) + 980; // 980-1030 hPa
      const visibility = Math.floor(Math.random() * 15) + 5; // 5-20 km
      
      days.push({
        date: new Date(d).toISOString().split('T')[0],
        temperature: temp,
        temperature_avg: temp,
        precipitation: Math.round(precipitation * 10) / 10,
        windSpeed: wind,
        wind_speed: wind,
        humidity: humidity,
        pressure: pressure,
        visibility: visibility,
        suitabilityScore: calculateSuitabilityScore(temp, precipitation, wind),
        conditions: getDetailedConditions(temp, precipitation, wind),
        uvIndex: Math.floor(Math.random() * 11),
        cloudCover: Math.floor(Math.random() * 100),
        dewPoint: temp - Math.floor(Math.random() * 10),
        feelsLike: temp + Math.floor(Math.random() * 6) - 3
      });
    }
    
    return days.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  };

  const calculateSuitabilityScore = (temp, precip, wind) => {
    const activityThresholds = activities.find(a => a.value === activity)?.thresholds;
    if (!activityThresholds) return 75;
    
    let score = 100;
    
    // Temperature penalties
    if (temp > activityThresholds.maxTemp) score -= (temp - activityThresholds.maxTemp) * 3;
    if (temp < activityThresholds.minTemp) score -= (activityThresholds.minTemp - temp) * 2;
    
    // Precipitation penalties  
    if (precip > activityThresholds.maxRain) score -= (precip - activityThresholds.maxRain) * 2;
    
    // Wind penalties
    if (wind > activityThresholds.maxWind) score -= (wind - activityThresholds.maxWind) * 1.5;
    
    return Math.max(50, Math.min(100, score));
  };

  const getDetailedConditions = (temp, precip, wind) => {
    if (precip > 15) return 'heavy-rain';
    if (precip > 5) return 'rainy';
    if (temp > 35) return 'very-hot';
    if (temp > 30) return 'hot';
    if (temp < -5) return 'very-cold';
    if (temp < 5) return 'cold';
    if (wind > 25) return 'very-windy';
    if (wind > 15) return 'windy';
    return 'clear';
  };

  const analyzeThresholds = () => {
    return {
      veryHot: Math.random() > 0.8,
      veryCold: Math.random() > 0.9,
      veryWindy: Math.random() > 0.7,
      veryWet: Math.random() > 0.6,
      veryUncomfortable: Math.random() > 0.85
    };
  };

  const generateHistoricalData = () => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    return years.map(year => ({
      year,
      avgTemp: Math.floor(Math.random() * 30) + 10,
      avgPrecip: Math.floor(Math.random() * 500) + 200,
      extremeEvents: Math.floor(Math.random() * 10) + 2
    }));
  };

  const generateMLPredictions = () => {
    return {
      accuracy: Math.floor(Math.random() * 20) + 80,
      patterns: ['Temperature rising trend', 'Precipitation decreasing', 'Wind patterns stable'],
      confidence: Math.floor(Math.random() * 15) + 85
    };
  };

  const generateAlternativeDates = () => {
    const alternatives = [];
    const baseDate = new Date(dateFrom);
    
    for (let i = 0; i < 5; i++) {
      const altDate = new Date(baseDate);
      altDate.setDate(baseDate.getDate() + Math.floor(Math.random() * 30) - 15);
      
      alternatives.push({
        date: altDate.toISOString().split('T')[0],
        score: Math.floor(Math.random() * 30) + 70,
        reason: 'Better weather conditions expected'
      });
    }
    
    return alternatives.sort((a, b) => b.score - a.score);
  };

  const generateDisasterRisks = () => {
    return {
      flood: { probability: Math.random() * 20, level: 'low' },
      drought: { probability: Math.random() * 15, level: 'medium' },
      heatwave: { probability: Math.random() * 25, level: 'low' },
      storm: { probability: Math.random() * 30, level: 'medium' }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div id="weather-effects" className="fixed inset-0 pointer-events-none z-0"></div>
      
      {/* Animated Stars */}
      <div className="fixed inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Stunning Header with Animated Globe */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-32 right-20 w-12 h-12 bg-blue-300 bg-opacity-20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-purple-300 bg-opacity-15 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                  <Globe className="w-12 h-12 animate-spin" style={{animationDuration: '10s'}} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-2 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent animate-pulse">
              Parade's oh Guardian
            </h1>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Will It Rain on My Parade?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
              Advanced NASA-Powered Weather Intelligence Platform
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-80 mb-12">
              <span className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Satellite className="w-4 h-4 animate-pulse" />
                Real-Time Satellite Data
              </span>
              <span className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Brain className="w-4 h-4 animate-pulse" />
                AI-Powered Analysis
              </span>
              <span className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 animate-pulse" />
                20+ Years Historical Data
              </span>
              <span className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="w-4 h-4 animate-pulse" />
                Disaster Prediction
              </span>
            </div>

            {/* Animated Globe Component */}
            <div className="flex justify-center mb-8">
              <AnimatedGlobe 
                location={location}
                coordinates={coordinates}
                isAnalyzing={loading}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          
          {/* Enhanced Input Section */}
          <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white border-opacity-20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NASA Space Apps Challenge Analysis
              </h2>
              <p className="text-gray-600 text-lg">
                Configure comprehensive weather intelligence parameters
              </p>
            </div>

          <div className="space-y-8 mb-8">
            {/* Enhanced Location Input */}
            <div>
              <EnhancedLocationInput 
                location={location}
                setLocation={setLocation}
                onLocationSelected={(loc, coords) => {
                  setLocation(loc);
                  if (coords) setCoordinates(coords);
                }}
              />
            </div>

            {/* Interactive Event Selector */}
            <div>
              <InteractiveEventSelector 
                activity={activity}
                setActivity={setActivity}
                onEventAnalysis={(eventData) => {
                  // Update activity thresholds based on AI analysis
                  console.log('Event analysis:', eventData);
                }}
              />
            </div>              {/* Enhanced Date Range */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Calendar className="w-5 h-5" />
                  Analysis Period
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">From Date</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-blue-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">To Date</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      min={dateFrom || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-blue-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Analysis Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!location || !dateFrom || !dateTo || loading}
                className={`
                  px-12 py-5 rounded-2xl font-bold text-xl text-white relative overflow-hidden
                  transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl
                  ${loading || !location || !dateFrom || !dateTo
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-4">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <Brain className="w-6 h-6 animate-pulse" />
                    Processing NASA Intelligence...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Satellite className="w-6 h-6 animate-pulse" />
                    Launch Comprehensive Analysis
                    <Zap className="w-6 h-6" />
                  </span>
                )}
                
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              </button>
            </div>
          </div>

          {/* Enhanced Loading State */}
          {loading && (
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl mb-8">
              <LoadingState 
                message={`Analyzing comprehensive NASA data for ${location}...`}
                isAnalyzing={true}
              />
            </div>
          )}

          {/* Comprehensive Tabbed Interface with All Features */}
          {results && showVisualizations && (
            <div className="space-y-8">
              <TabbedInterface
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                location={location}
                results={results}
                hasData={true}
              >
                {/* Overview Tab - Animated Metrics */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <AnimatedMetrics 
                      metrics={{
                        temperature: results?.bestDays?.[0]?.temperature,
                        humidity: results?.bestDays?.[0]?.humidity,
                        precipitation: results?.bestDays?.[0]?.precipitation,
                        windSpeed: results?.bestDays?.[0]?.windSpeed,
                        pressure: results?.bestDays?.[0]?.pressure,
                        visibility: results?.bestDays?.[0]?.visibility
                      }}
                      coordinates={coordinates}
                      isLoading={false}
                    />
                    <WeatherVisualization 
                      data={results.bestDays}
                      location={location}
                    />
                    <WeatherTimeline 
                      weatherData={results.bestDays}
                      dateRange={{ from: dateFrom, to: dateTo }}
                    />
                  </div>
                )}
                
                {/* Risk Assessment Tab */}
                {activeTab === 'risk' && (
                  <div className="space-y-8">
                    <WeatherRiskVisualization 
                      weatherData={(function(){
                        const daily = results.dailyAnalysis || [];
                        if(!daily.length) return results.bestDays?.[0] || {};
                        const avg = arr => arr.length? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
                        const temps = daily.map(d=>d.conditions?.temperature).filter(n=>typeof n==='number');
                        const precs = daily.map(d=>d.conditions?.precipitation).filter(n=>typeof n==='number');
                        const winds = daily.map(d=>d.conditions?.wind_speed).filter(n=>typeof n==='number');
                        const hums = daily.map(d=>d.conditions?.humidity).filter(n=>typeof n==='number');
                        // Representative day built from averages & maximum risk potentials
                        return {
                          date: daily[0].date,
                          temperature: avg(temps),
                          precipitation: avg(precs),
                          windSpeed: avg(winds),
                          humidity: avg(hums),
                          // keep extremes for risk context
                          maxTemperature: temps.length? Math.max(...temps): null,
                          maxWind: winds.length? Math.max(...winds): null,
                          maxPrecipitation: precs.length? Math.max(...precs): null,
                          confidence: results.confidence
                        };
                      })()}
                      location={location}
                      confidence={results.confidence}
                      riskThresholds={weatherThresholds}
                    />
                    <DisasterPredictionCard 
                      disasterRisks={results.disasterRisks}
                      location={location}
                      seasonalPatterns={[]}
                    />
                  </div>
                )}
                
                {/* Historical Data Tab */}
                {activeTab === 'historical' && (
                  <HistoricalTrendsVisualization 
                    location={location}
                    weatherData={results}
                    dateRange={{ from: dateFrom, to: dateTo }}
                  />
                )}
                
                {/* Alternative Dates Tab */}
                {activeTab === 'alternatives' && (
                  <AlternativeDateFinder 
                    location={location}
                    originalDates={{ from: dateFrom, to: dateTo }}
                    weatherData={results}
                    activityType={activity}
                    alternativeDates={results.alternativeDates}
                  />
                )}
                
                {/* ML Predictions Tab */}
                {activeTab === 'ml' && (
                  <MLPatternRecognition 
                    weatherData={results}
                    location={location}
                    historicalData={results.bestDays}
                  />
                )}
              </TabbedInterface>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16 mt-20 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Satellite className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Parade's oh Guardian
          </h3>
          <h4 className="text-2xl font-semibold mb-4">NASA Space Apps Challenge 2025</h4>
          <p className="text-xl text-gray-300 mb-6">
            "Will It Rain on My Parade?" - Advanced Weather Intelligence Platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-bold text-lg mb-2">NASA Data Sources</h4>
              <p className="text-sm text-gray-300">POWER API, GPM IMERG, MODIS Terra/Aqua, MERRA-2, GLDAS</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-bold text-lg mb-2">AI Capabilities</h4>
              <p className="text-sm text-gray-300">Machine Learning, Pattern Recognition, Predictive Analytics</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-bold text-lg mb-2">Analysis Features</h4>
              <p className="text-sm text-gray-300">Risk Assessment, Historical Trends, Alternative Dates</p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
            <span>Powered by NASA Satellite Data</span>
            <span>•</span>
            <span>Real-time Analysis</span>
            <span>•</span>
            <span>Advanced Weather Intelligence</span>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

export default ComprehensiveApp;