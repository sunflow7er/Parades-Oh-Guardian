import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertTriangle, Sun } from 'lucide-react';

// Real-data powered Alternative Date Finder (Date Crafter)
// Uses NASA dailyAnalysis passed via weatherData to score candidate dates instead of random mock data.
// If weatherData.alternativeDates already provided (from backend normalization), integrates and enriches them.
const AlternativeDateFinder = ({ location, originalDates, weatherData, activityType }) => {
  const [alternativeDates, setAlternativeDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const computeAbortRef = useRef(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [searchRange, setSearchRange] = useState(14); // forward days to consider (if present in dailyAnalysis)
  const [selectedActivity, setSelectedActivity] = useState(activityType || 'general');
  const [isVisible, setIsVisible] = useState(false);

  const activityRequirements = {
    general: {
      name: 'General Activities',
      temperature: { min: 5, max: 35 },
      precipitation: { max: 5 },
      wind: { max: 25 },
      humidity: { max: 80 },
      icon: Sun
    },
    outdoor_sports: {
      name: 'Outdoor Sports',
      temperature: { min: 10, max: 30 },
      precipitation: { max: 2 },
      wind: { max: 20 },
      humidity: { max: 70 },
      icon: Sun
    },
    photography: {
      name: 'Photography',
      temperature: { min: 0, max: 40 },
      precipitation: { max: 1 },
      wind: { max: 30 },
      humidity: { max: 85 },
      icon: Sun
    },
    construction: {
      name: 'Construction Work',
      temperature: { min: -5, max: 32 },
      precipitation: { max: 0.5 },
      wind: { max: 25 },
      humidity: { max: 75 },
      icon: Sun
    },
    agriculture: {
      name: 'Agricultural Work',
      temperature: { min: 5, max: 35 },
      precipitation: { max: 10 },
      wind: { max: 30 },
      humidity: { min: 30, max: 90 },
      icon: Sun
    },
    travel: {
      name: 'Travel & Tourism',
      temperature: { min: 8, max: 32 },
      precipitation: { max: 3 },
      wind: { max: 35 },
      humidity: { max: 80 },
      icon: Sun
    }
  };

  // Calculate weather safety score
  const calculateSafetyScore = (weather, requirements) => {
    let score = 100;
    const factors = [];

    // Temperature check
    if (weather.temperature < requirements.temperature.min) {
      const penalty = (requirements.temperature.min - weather.temperature) * 3;
      score -= penalty;
      factors.push(`Too cold (${penalty.toFixed(0)} points)`);
    }
    if (weather.temperature > requirements.temperature.max) {
      const penalty = (weather.temperature - requirements.temperature.max) * 2;
      score -= penalty;
      factors.push(`Too hot (${penalty.toFixed(0)} points)`);
    }

    // Precipitation check
    if (weather.precipitation > requirements.precipitation.max) {
      const penalty = (weather.precipitation - requirements.precipitation.max) * 5;
      score -= penalty;
      factors.push(`Rain risk (${penalty.toFixed(0)} points)`);
    }

    // Wind check
    if (weather.windSpeed > requirements.wind.max) {
      const penalty = (weather.windSpeed - requirements.wind.max) * 2;
      score -= penalty;
      factors.push(`Too windy (${penalty.toFixed(0)} points)`);
    }

    // Humidity check
    if (requirements.humidity.min && weather.humidity < requirements.humidity.min) {
      const penalty = (requirements.humidity.min - weather.humidity) * 1;
      score -= penalty;
      factors.push(`Too dry (${penalty.toFixed(0)} points)`);
    }
    if (weather.humidity > requirements.humidity.max) {
      const penalty = (weather.humidity - requirements.humidity.max) * 1.5;
      score -= penalty;
      factors.push(`Too humid (${penalty.toFixed(0)} points)`);
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      factors: factors
    };
  };

  // Extract real daily analysis (NASA normalized structure) once
  const dailyAnalysis = useMemo(() => weatherData?.dailyAnalysis || weatherData?.daily_analysis || [], [weatherData]);

  // Memoize transformed weather objects to avoid re-mapping each render
  const mappedDaily = useMemo(() => {
    return dailyAnalysis
      .map(d => {
        if (!d) return null;
        const dateStr = d.date;
        const conditions = d.conditions || {};
        // Pre-compute primitive fields once
        const temperature = conditions.temperature ?? d.temperature_avg ?? d.temperature;
        const precipitation = conditions.precipitation ?? d.precipitation ?? 0;
        const rawWind = conditions.wind_speed ?? d.wind_speed ?? d.windSpeed ?? 0;
        // If original had wind_speed assume m/s -> convert to km/h else leave
        const windSpeed = (d.wind_speed || conditions.wind_speed) ? rawWind * 3.6 : rawWind;
        const humidity = conditions.humidity ?? d.humidity ?? 0;
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj)) return null;
        return {
          date: dateStr,
            dateObj,
          temperature,
          precipitation,
          windSpeed,
          humidity,
          cloudCover: conditions.cloud_cover ?? d.cloudCover ?? 0,
          uvIndex: conditions.uv_index ?? d.uvIndex ?? 0
        };
      })
      .filter(Boolean);
  }, [dailyAnalysis]);

  // Transform a NASA daily record to simplified weather metrics
  // mapDailyToWeather now redundant - use mappedDaily instead

  // Build candidates from real data within searchRange (future oriented if possible)
  const buildCandidatePool = () => {
    if (!mappedDaily.length) return [];
    const requirements = activityRequirements[selectedActivity] || activityRequirements['general'];
    const now = Date.now();
    const horizonMs = searchRange * 24 * 3600 * 1000;
    const endMs = now + horizonMs;
    let candidates = mappedDaily.filter(w => w.dateObj.getTime() >= now && w.dateObj.getTime() <= endMs);
    if (!candidates.length) candidates = mappedDaily;

    // Prefilter: drop days far outside temperature band (>15°C below min or >10°C above max) to save scoring time
    candidates = candidates.filter(w => {
      const req = requirements.temperature;
      if (typeof w.temperature !== 'number') return false;
      if (w.temperature < req.min - 15) return false;
      if (w.temperature > req.max + 10) return false;
      return true;
    });

    // Hard cap to avoid huge loops (post filter). Keep earliest slice.
    if (candidates.length > 150) candidates = candidates.slice(0, 150);
    return candidates;
  };

  const incrementalScore = (candidates, onDone) => {
    const requirements = activityRequirements[selectedActivity] || activityRequirements['general'];
    const topK = 40;
    const scored = [];
    let index = 0;
    let dynamicChunk = 10; // starting chunk size
    let lastChunkTime = 0;
    let lastFrameTs = performance.now();
    setProgress({ processed: 0, total: candidates.length });

    const flushPartial = () => {
      // Provide partial progressive results (sorted copy) without blocking scoring
      const partial = [...scored].sort((a,b)=> b.safetyScore - a.safetyScore);
      setAlternativeDates(partial);
    };

    const processChunk = () => {
      if (computeAbortRef.current) return;
      const startTs = performance.now();
      const end = Math.min(index + dynamicChunk, candidates.length);
      for (; index < end; index++) {
        const w = candidates[index];
        const s = calculateSafetyScore(w, requirements);
        const entry = {
          date: w.dateObj,
          weather: w,
          safetyScore: s.score,
          safetyFactors: s.factors,
          dayOfWeek: w.dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
          recommendation: s.score >= 80 ? 'excellent' : s.score >= 60 ? 'good' : s.score >= 40 ? 'fair' : 'poor'
        };
        scored.push(entry);
        if (scored.length > topK) {
          let worstIdx = 0;
          for (let i=1;i<scored.length;i++) if (scored[i].safetyScore < scored[worstIdx].safetyScore) worstIdx = i;
          scored.splice(worstIdx,1);
        }
      }
      const chunkDuration = performance.now() - startTs;
      lastChunkTime = chunkDuration;
      // Adapt chunk size: aim for ~8-14ms per chunk
      if (chunkDuration < 6 && dynamicChunk < 60) dynamicChunk += 4;
      else if (chunkDuration > 18 && dynamicChunk > 6) dynamicChunk = Math.max(6, Math.floor(dynamicChunk * 0.7));

      setProgress({ processed: index, total: candidates.length });

      // Flush partial every ~40ms or on first chunk
      const nowTs = performance.now();
      if (nowTs - lastFrameTs > 40 || index === end) {
        flushPartial();
        lastFrameTs = nowTs;
      }

      if (index < candidates.length && !computeAbortRef.current) {
        requestAnimationFrame(processChunk);
      } else {
        // Final sort and completion
        scored.sort((a,b)=> b.safetyScore - a.safetyScore);
        flushPartial();
        onDone(scored);
      }
    };
    requestAnimationFrame(processChunk);
  };

  // Merge backend-provided alternativeDates (if any) for consistency
  const mergeBackendAlternatives = (generated) => {
    const backendAlt = weatherData?.alternativeDates || weatherData?.alternative_dates || [];
    if (!backendAlt.length) return generated;
    const existingDates = new Set(generated.map(a => a.date.toISOString().split('T')[0]));
    const mapped = backendAlt.map(d => {
      const dateStr = d.date || d;
      const dateObj = new Date(dateStr);
      const weatherFromDaily = mappedDaily.find(x => x.date === dateStr);
      const mappedWeather = weatherFromDaily || {
        date: dateStr,
        temperature: d.temperature,
        precipitation: d.precipitation,
        windSpeed: d.windSpeed,
        humidity: d.humidity || 60,
        cloudCover: d.cloudCover || 0,
        uvIndex: d.uvIndex || 0,
        dateObj
      };
      const requirements = activityRequirements[selectedActivity];
      const s = calculateSafetyScore(mappedWeather, requirements);
      return {
        date: dateObj,
        weather: mappedWeather,
        safetyScore: s.score,
        safetyFactors: s.factors,
        dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        recommendation: s.score >= 80 ? 'excellent' : s.score >= 60 ? 'good' : s.score >= 40 ? 'fair' : 'poor'
      };
    }).filter(a => !existingDates.has(a.date.toISOString().split('T')[0]));
    const combined = [...generated, ...mapped];
    return combined.sort((a,b)=> b.safetyScore - a.safetyScore);
  };

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);
    setTimedOut(false);
    computeAbortRef.current = false;

    const start = performance.now();
    const timeoutId = setTimeout(() => {
      setTimedOut(true);
      computeAbortRef.current = true;
    }, 2500); // slight bump to allow chunked flow

    const candidates = buildCandidatePool();
    incrementalScore(candidates, (scoredFinal) => {
      if (!computeAbortRef.current) {
        const merged = mergeBackendAlternatives(scoredFinal);
        setAlternativeDates(merged);
      }
      clearTimeout(timeoutId);
      setLoading(false);
      const elapsed = performance.now() - start;
      console.debug('AlternativeDateFinder incremental total (ms):', Math.round(elapsed));
    });

    return () => {
      computeAbortRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [selectedActivity, searchRange, location, mappedDaily]);

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'fair': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'poor': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing {searchRange} days of weather forecasts...</p>
            {progress.total > 0 && (
              <p className="text-xs text-gray-500 mt-1">Processed {progress.processed}/{progress.total} candidates…</p>
            )}
            {timedOut && (
              <p className="text-xs text-red-500 mt-2">Still processing… large range or slow device. Partial results will appear soon.</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Finding optimal dates for {(activityRequirements[selectedActivity]||activityRequirements['general']).name}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Alternative Date Finder</h3>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Finding optimal weather windows for {location || 'Kazakhstan'}
          </p>
        </div>
        <Calendar className="w-12 h-12 text-green-600" />
      </div>

      {/* Activity Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Select Activity Type</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(activityRequirements).map(([key, activity]) => {
            const Icon = activity.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedActivity(key)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedActivity === key
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{activity.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Range */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Search Range</h4>
        <div className="flex gap-2">
          {[7, 14, 21, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSearchRange(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchRange === days
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Alternative Dates List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Recommended Dates (Analyzed {alternativeDates.length} candidates)
        </h4>
        
        {alternativeDates.length === 0 && (
          <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-gray-600">
            No suitable alternative dates found in the analyzed range. Try expanding the search range or adjusting activity type.
          </div>
        )}
        {alternativeDates.slice(0, 10).map((alternative, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${getRecommendationColor(alternative.recommendation)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getRecommendationIcon(alternative.recommendation)}
                  <div>
                    <h5 className="font-bold text-lg">
                      {alternative.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h5>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold">
                        Safety Score: {alternative.safetyScore.toFixed(0)}/100
                      </span>
                      <span className="capitalize font-medium">
                        {alternative.recommendation} Choice
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-xs">🌡️</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{alternative.weather.temperature.toFixed(1)}°C</div>
                      <div className="text-xs opacity-75">Temperature</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs">🌧️</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{alternative.weather.precipitation.toFixed(1)}mm</div>
                      <div className="text-xs opacity-75">Precipitation</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs">💨</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{alternative.weather.windSpeed.toFixed(1)} km/h</div>
                      <div className="text-xs opacity-75">Wind Speed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <span className="text-xs">💧</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{alternative.weather.humidity.toFixed(0)}%</div>
                      <div className="text-xs opacity-75">Humidity</div>
                    </div>
                  </div>
                </div>

                {/* Safety Factors */}
                {alternative.safetyFactors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Considerations:</p>
                    <div className="flex flex-wrap gap-2">
                      {alternative.safetyFactors.map((factor, factorIndex) => (
                        <span
                          key={factorIndex}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded-lg text-xs font-medium"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ranking Badge */}
              <div className="flex flex-col items-center ml-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-green-600 text-white' :
                  index === 1 ? 'bg-blue-600 text-white' :
                  index === 2 ? 'bg-yellow-600 text-white' :
                  'bg-gray-400 text-white'
                }`}>
                  #{index + 1}
                </div>
                <span className="text-xs mt-1 font-medium">Rank</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Requirements Summary */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">
          Optimal Conditions for {(activityRequirements[selectedActivity] || activityRequirements['general']).name}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Temperature:</span>
            <div>{(activityRequirements[selectedActivity]||activityRequirements['general']).temperature.min}°C to {(activityRequirements[selectedActivity]||activityRequirements['general']).temperature.max}°C</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Max Precipitation:</span>
            <div>{(activityRequirements[selectedActivity]||activityRequirements['general']).precipitation.max}mm</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Max Wind:</span>
            <div>{(activityRequirements[selectedActivity]||activityRequirements['general']).wind.max} km/h</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Max Humidity:</span>
            <div>{(activityRequirements[selectedActivity]||activityRequirements['general']).humidity.max}%</div>
          </div>
        </div>
            <p className="text-xs text-gray-500 mt-4">Scores derived from NASA POWER daily analysis. Wind converted to km/h if originally in m/s.</p>
      </div>
    </div>
  );
};

export default AlternativeDateFinder;