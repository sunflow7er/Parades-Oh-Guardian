import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Navigation, Clock, X, Globe, AlertTriangle, Shield, Users } from 'lucide-react';
import { kazakhstanCitiesDatabase } from '../data/kazakhstanDatabase.js';

const EnhancedLocationInput = ({ 
  location, 
  setLocation, 
  onLocationSelected 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const dropdownRef = useRef(null);

  // Get cities from database
  const cities = kazakhstanCitiesDatabase.cities;
  // Derive Kazakhstan vs Japan groupings
  const kazakhCities = cities.filter(c => c.region.toLowerCase().includes('kaz') || c.region.toLowerCase().includes('almaty') || c.region.toLowerCase().includes('astana'));
  const japanCities = cities.filter(c => c.region.toLowerCase().includes('japan') || ['tokyo','osaka','kyoto'].includes(c.id));

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (!isDropdownOpen) return; // only compute when dropdown visible
    if (location) {
      const term = location.toLowerCase();
      const filtered = cities
        .map(city => {
          const idx = city.name.toLowerCase().indexOf(term);
          return idx >= 0 ? { city, score: idx } : null;
        })
        .filter(Boolean)
        .sort((a,b) => a.score - b.score)
        .map(entry => entry.city);
      setSuggestions(filtered);
    } else {
      const defaults = [
        ...kazakhCities.slice(0,4),
        ...japanCities.slice(0,3)
      ];
      setSuggestions(defaults);
    }
  }, [location, cities, isDropdownOpen]);

  const highlightMatch = (name) => {
    if (!location) return <span>{name}</span>;
    const term = location.toLowerCase();
    const idx = name.toLowerCase().indexOf(term);
    if (idx === -1) return <span>{name}</span>;
    return (
      <span>
        {name.slice(0, idx)}
        <span className="text-white bg-blue-600/60 px-1 rounded">{name.slice(idx, idx + term.length)}</span>
        {name.slice(idx + term.length)}
      </span>
    );
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setLocation(city.name);
    setSelectedCity(city);
    setIsDropdownOpen(false);
    
    // Save to recent searches
    const newRecentSearches = [
      city,
      ...recentSearches.filter(r => r.id !== city.id).slice(0, 4)
    ];
    setRecentSearches(newRecentSearches);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(newRecentSearches));
    
    // Call callback with location and coordinates
    if (onLocationSelected) {
      onLocationSelected(city.name, city.coordinates);
    }
  };

  // Get risk level color
  const getRiskColor = (risks) => {
    const highRiskCount = Object.values(risks).filter(risk => 
      risk.probability > 60 || risk.severity === 'High' || risk.severity === 'Very High'
    ).length;
    
    if (highRiskCount >= 3) return 'text-red-600';
    if (highRiskCount >= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  const getRiskLevel = (risks) => {
    const highRiskCount = Object.values(risks).filter(risk => 
      risk.probability > 60 || risk.severity === 'High' || risk.severity === 'Very High'
    ).length;
    
    if (highRiskCount >= 3) return 'High Risk';
    if (highRiskCount >= 2) return 'Medium Risk';
    return 'Low Risk';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
        <Globe className="w-5 h-5 text-blue-600 animate-pulse" />
        Enhanced Location Selection
      </label>
      
      {/* Main Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={location}
          onChange={(e) => { setLocation(e.target.value); if(!isDropdownOpen) setIsDropdownOpen(true); }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search cities (Kazakhstan, Japan)..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg bg-gradient-to-r from-white to-blue-50 hover:shadow-lg"
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 max-h-96 overflow-y-auto">
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && !location && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 3).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-600/40 rounded-lg transition-colors"
                  >
                    {city.name}, {city.region}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City Suggestions */}
          {suggestions.length > 0 ? (
            <div className="p-2 space-y-1">
              {!location && (
                <>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 px-3 pt-1">Popular Kazakhstan</div>
                  {kazakhCities.slice(0,4).map(kc => (
                    <div key={kc.id} onClick={() => handleCitySelect(kc)} className="px-3 py-2 hover:bg-blue-600/40 rounded-lg cursor-pointer flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-300" />
                      <span className="text-sm text-gray-100">{kc.name}</span>
                      <span className="ml-auto text-[10px] opacity-60">{getRiskLevel(kc.naturalDisasters)}</span>
                    </div>
                  ))}
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 px-3 pt-2">Popular Japan</div>
                  {japanCities.slice(0,3).map(jc => (
                    <div key={jc.id} onClick={() => handleCitySelect(jc)} className="px-3 py-2 hover:bg-blue-600/40 rounded-lg cursor-pointer flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-300" />
                      <span className="text-sm text-gray-100">{jc.name}</span>
                      <span className="ml-auto text-[10px] opacity-60">{getRiskLevel(jc.naturalDisasters)}</span>
                    </div>
                  ))}
                  <div className="h-px bg-gray-700 my-2" />
                </>
              )}
              {location && (
                <div className="text-xs font-semibold text-gray-300 px-3 py-1">
                  Matches ({suggestions.length})
                </div>
              )}
              {suggestions.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="px-3 py-3 hover:bg-blue-600/40 cursor-pointer rounded-lg transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <MapPin className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                        <div>
                          <div className="font-semibold text-gray-100 text-base tracking-wide group-hover:text-white group-hover:underline decoration-white/30">{highlightMatch(city.name)}</div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-300">{city.region}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-400 group-hover:text-gray-300 mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {city.population.toLocaleString()} people
                        </div>
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          {city.description}
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${getRiskColor(city.naturalDisasters)}`}>
                          {getRiskLevel(city.naturalDisasters) === 'Low Risk' ? (
                            <Shield className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          {getRiskLevel(city.naturalDisasters)}
                        </div>
                      </div>

                      {/* Quick disaster overview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(city.naturalDisasters).slice(0, 3).map(([disaster, data]) => (
                          <span
                            key={disaster}
                            className={`px-2 py-1 text-xs rounded-full border ${
                              data.probability > 60 
                                ? 'bg-red-50 text-red-700 border-red-200' 
                                : data.probability > 40
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                            }`}
                          >
                            {disaster.replace('_', ' ')}: {data.probability}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : location && suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No cities found matching "{location}"</p>
              <p className="text-sm">Try searching for cities like Tokyo, Almaty, or Osaka</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-sm font-semibold text-gray-600 mb-3">Popular Cities</div>
              <div className="grid grid-cols-1 gap-2">
                {cities.slice(0, 6).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="text-left p-3 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-sm text-gray-600">{city.region}</div>
                      </div>
                      <div className={`text-xs font-semibold ${getRiskColor(city.naturalDisasters)}`}>
                        {getRiskLevel(city.naturalDisasters)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected City Info */}
      {selectedCity && location === selectedCity.name && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Selected: {selectedCity.name}</span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {showDetails && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Population:</span>
                  <span className="ml-2 text-gray-600">{selectedCity.population.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Climate:</span>
                  <span className="ml-2 text-gray-600">{selectedCity.climate}</span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Primary Risks:</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(selectedCity.naturalDisasters)
                    .filter(([_, data]) => data.probability > 50)
                    .slice(0, 4)
                    .map(([disaster, data]) => (
                      <div key={disaster} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                        <span className="text-gray-700 capitalize">{disaster.replace('_', ' ')}</span>
                        <span className={`font-semibold ${
                          data.probability > 60 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {data.probability}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationInput;