import React, { useState, useEffect } from 'react';
import { Target, Heart, Mountain, Wheat, Music, Camera, Utensils, Sparkles, Brain, Zap } from 'lucide-react';

const InteractiveEventSelector = ({ 
  activity, 
  setActivity, 
  onEventAnalysis 
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const predefinedEvents = [
    { 
      value: 'wedding', 
      label: 'Wedding Ceremony', 
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      description: 'Perfect weather for your special day with guests comfort in mind',
      thresholds: { 
        idealTemp: { min: 18, max: 25 }, 
        maxRain: 5, 
        maxWind: 12, 
        humidity: { min: 40, max: 65 }
      },
      considerations: ['Guest comfort', 'Photography conditions', 'Venue logistics', 'Dress preservation'],
      riskFactors: ['Rain disruption', 'Extreme heat', 'Strong winds', 'High humidity']
    },
    { 
      value: 'hiking', 
      label: 'Hiking Adventure', 
      icon: Mountain,
      color: 'from-green-500 to-emerald-600',
      description: 'Safe and enjoyable conditions for outdoor exploration',
      thresholds: { 
        idealTemp: { min: 10, max: 28 }, 
        maxRain: 15, 
        maxWind: 25, 
        humidity: { min: 30, max: 70 }
      },
      considerations: ['Trail safety', 'Visibility', 'Equipment protection', 'Physical comfort'],
      riskFactors: ['Hypothermia', 'Heat exhaustion', 'Slippery trails', 'Flash floods']
    },
    { 
      value: 'farming', 
      label: 'Agricultural Work', 
      icon: Wheat,
      color: 'from-yellow-500 to-orange-600',
      description: 'Optimal conditions for crop management and harvesting',
      thresholds: { 
        idealTemp: { min: 5, max: 35 }, 
        maxRain: 40, 
        maxWind: 30, 
        humidity: { min: 35, max: 80 }
      },
      considerations: ['Crop health', 'Soil conditions', 'Equipment operation', 'Worker safety'],
      riskFactors: ['Crop damage', 'Soil erosion', 'Equipment failure', 'Heat stress']
    },
    { 
      value: 'festival', 
      label: 'Outdoor Festival', 
      icon: Music,
      color: 'from-purple-500 to-indigo-600',
      description: 'Comfortable conditions for large outdoor gatherings',
      thresholds: { 
        idealTemp: { min: 15, max: 28 }, 
        maxRain: 8, 
        maxWind: 18, 
        humidity: { min: 40, max: 70 }
      },
      considerations: ['Crowd safety', 'Equipment protection', 'Vendor operations', 'Sound quality'],
      riskFactors: ['Crowd discomfort', 'Equipment damage', 'Safety hazards', 'Event cancellation']
    },
    { 
      value: 'photography', 
      label: 'Photo Shoot', 
      icon: Camera,
      color: 'from-blue-500 to-cyan-600',
      description: 'Ideal lighting and weather conditions for photography',
      thresholds: { 
        idealTemp: { min: 10, max: 30 }, 
        maxRain: 2, 
        maxWind: 15, 
        humidity: { min: 35, max: 75 }
      },
      considerations: ['Lighting quality', 'Equipment safety', 'Model comfort', 'Background conditions'],
      riskFactors: ['Poor visibility', 'Equipment damage', 'Uncomfortable subjects', 'Weather disruption']
    },
    { 
      value: 'dining', 
      label: 'Outdoor Dining', 
      icon: Utensils,
      color: 'from-red-500 to-pink-600',
      description: 'Pleasant conditions for al fresco dining experiences',
      thresholds: { 
        idealTemp: { min: 16, max: 26 }, 
        maxRain: 3, 
        maxWind: 10, 
        humidity: { min: 45, max: 65 }
      },
      considerations: ['Guest comfort', 'Food quality', 'Service efficiency', 'Ambiance'],
      riskFactors: ['Rain disruption', 'Wind disturbance', 'Temperature extremes', 'Insect activity']
    }
  ];

  const customEventAnalyzer = {
    // AI-powered event analysis based on keywords
    analyzeEvent: (input) => {
      const keywords = input.toLowerCase();
      
      // Sport-related events
      if (keywords.includes('sport') || keywords.includes('game') || keywords.includes('match') || keywords.includes('race')) {
        return {
          type: 'sports_event',
          thresholds: { 
            idealTemp: { min: 12, max: 30 }, 
            maxRain: 10, 
            maxWind: 20, 
            humidity: { min: 40, max: 75 }
          },
          considerations: ['Player performance', 'Spectator comfort', 'Field conditions', 'Safety protocols'],
          description: 'Optimal conditions for athletic performance and spectator enjoyment'
        };
      }
      
      // Children's events
      if (keywords.includes('children') || keywords.includes('kids') || keywords.includes('playground') || keywords.includes('school')) {
        return {
          type: 'children_event',
          thresholds: { 
            idealTemp: { min: 18, max: 28 }, 
            maxRain: 5, 
            maxWind: 15, 
            humidity: { min: 45, max: 65 }
          },
          considerations: ['Child safety', 'Comfort levels', 'Supervision ease', 'Activity suitability'],
          description: 'Safe and comfortable conditions for children\'s activities'
        };
      }
      
      // Construction/outdoor work
      if (keywords.includes('construction') || keywords.includes('building') || keywords.includes('work') || keywords.includes('labor')) {
        return {
          type: 'outdoor_work',
          thresholds: { 
            idealTemp: { min: 5, max: 32 }, 
            maxRain: 25, 
            maxWind: 25, 
            humidity: { min: 35, max: 80 }
          },
          considerations: ['Worker safety', 'Equipment operation', 'Material protection', 'Productivity'],
          description: 'Safe working conditions for outdoor labor activities'
        };
      }
      
      // Market/commercial events
      if (keywords.includes('market') || keywords.includes('fair') || keywords.includes('vendor') || keywords.includes('sale')) {
        return {
          type: 'commercial_event',
          thresholds: { 
            idealTemp: { min: 15, max: 30 }, 
            maxRain: 8, 
            maxWind: 18, 
            humidity: { min: 40, max: 70 }
          },
          considerations: ['Product protection', 'Customer comfort', 'Equipment safety', 'Sales optimization'],
          description: 'Favorable conditions for outdoor commercial activities'
        };
      }
      
      // Default analysis for unrecognized events
      return {
        type: 'custom_event',
        thresholds: { 
          idealTemp: { min: 15, max: 25 }, 
          maxRain: 10, 
          maxWind: 20, 
          humidity: { min: 40, max: 70 }
        },
        considerations: ['General comfort', 'Weather stability', 'Safety conditions', 'Event success'],
        description: 'Balanced weather conditions suitable for most outdoor activities'
      };
    }
  };

  const handleEventSelect = (event) => {
    // Normalize thresholds shape (add minTemp/maxTemp used by other components)
    const normalized = {
      ...event,
      thresholds: event.thresholds ? {
        ...event.thresholds,
        minTemp: event.thresholds.minTemp || event.thresholds.idealTemp?.min,
        maxTemp: event.thresholds.maxTemp || event.thresholds.idealTemp?.max
      } : event.thresholds
    };

    setSelectedEvent(normalized);
    setActivity(normalized.value);
    setCustomInput('');
    
    if (onEventAnalysis) {
      onEventAnalysis(normalized);
    }
  };

  const handleCustomAnalysis = () => {
    if (!customInput.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const analysis = customEventAnalyzer.analyzeEvent(customInput);
      setAiSuggestion({
        ...analysis,
        originalInput: customInput
      });
      setIsAnalyzing(false);
      
      if (onEventAnalysis) {
        onEventAnalysis({
          value: 'custom',
          label: customInput,
          thresholds: {
            ...analysis.thresholds,
            minTemp: analysis.thresholds.idealTemp?.min,
            maxTemp: analysis.thresholds.idealTemp?.max
          },
            description: analysis.description,
            considerations: analysis.considerations
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <label className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700 mb-4">
          <Target className="w-5 h-5 text-purple-600 animate-pulse" />
          Interactive Event Analysis
        </label>
      </div>

      {/* Predefined Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predefinedEvents.map((event) => {
          const IconComponent = event.icon;
          const isSelected = selectedEvent?.value === event.value;
          
          return (
            <div
              key={event.value}
              onClick={() => handleEventSelect(event)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? 'border-purple-500 bg-gradient-to-br ' + event.color + ' text-white shadow-2xl' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
                  <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                {isSelected && (
                  <div className="flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs font-semibold">Selected</span>
                  </div>
                )}
              </div>
              
              <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {event.label}
              </h3>
              
              <p className={`text-sm mb-3 ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                {event.description}
              </p>
              
              <div className="space-y-2">
                <div className={`text-xs font-semibold ${isSelected ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                  Ideal Conditions:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                    🌡️ {event.thresholds.idealTemp.min}°-{event.thresholds.idealTemp.max}°C
                  </div>
                  <div className={`${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                    💧 Max {event.thresholds.maxRain}mm rain
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-white border-opacity-30">
                  <div className="text-xs font-semibold text-white text-opacity-80 mb-2">Key Considerations:</div>
                  <div className="flex flex-wrap gap-1">
                    {event.considerations.slice(0, 2).map((consideration, index) => (
                      <span key={index} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {consideration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI-Powered Custom Event Analysis */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-lg text-gray-800">AI Event Analysis</h3>
          <Zap className="w-4 h-4 text-yellow-500" />
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Describe your event and our AI will analyze optimal weather conditions
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g., outdoor children's birthday party, construction project, sports tournament..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleCustomAnalysis()}
          />
          <button
            onClick={handleCustomAnalysis}
            disabled={!customInput.trim() || isAnalyzing}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white transition-all
              ${isAnalyzing || !customInput.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {/* AI Analysis Results */}
        {aiSuggestion && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-gray-800">AI Analysis: {aiSuggestion.originalInput}</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">{aiSuggestion.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-2">Optimal Conditions:</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>🌡️ Temperature: {aiSuggestion.thresholds.idealTemp.min}°-{aiSuggestion.thresholds.idealTemp.max}°C</div>
                  <div>💧 Max Precipitation: {aiSuggestion.thresholds.maxRain}mm</div>
                  <div>💨 Max Wind: {aiSuggestion.thresholds.maxWind} km/h</div>
                  <div>💧 Humidity: {aiSuggestion.thresholds.humidity.min}-{aiSuggestion.thresholds.humidity.max}%</div>
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-2">Key Considerations:</div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestion.considerations.map((consideration, index) => (
                    <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {consideration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setActivity('custom');
                setSelectedEvent(null);
              }}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Use This Analysis
            </button>
          </div>
        )}
      </div>

      {/* Selected Event Summary */}
      {(selectedEvent || aiSuggestion) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-800">
              Event Selected: {selectedEvent?.label || aiSuggestion?.originalInput}
            </span>
          </div>
          <p className="text-sm text-green-700">
            Weather analysis will be optimized for this event type with specific thresholds and considerations.
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveEventSelector;