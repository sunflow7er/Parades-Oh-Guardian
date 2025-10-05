import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Navigation, Clock, X, Globe, AlertTriangle, Shield } from 'lucide-react';
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
  const dropdownRef = useRef(null);

  // Get cities from database
  const cities = kazakhstanCitiesDatabase.cities;

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (value && inputMode === 'text') {
      const filtered = kazakhstanCities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setIsDropdownOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(recentSearches.length > 0 && !value);
    }
  }, [value, inputMode]);

  // Handle city selection
  const handleCitySelect = (city) => {
    onChange(city.name);
    onCoordinatesChange({ lat: city.lat, lng: city.lng });
    addToRecentSearches(city);
    setIsDropdownOpen(false);
  };

  // Add to recent searches
  const addToRecentSearches = (city) => {
    const updated = [city, ...recentSearches.filter(r => r.name !== city.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(updated));
  };

  // Handle coordinate input
  const handleCoordinateChange = (field, newValue) => {
    const updated = { ...coordinates, [field]: newValue };
    setCoordinates(updated);
    
    if (updated.lat && updated.lng && !isNaN(updated.lat) && !isNaN(updated.lng)) {
      onChange(`${parseFloat(updated.lat).toFixed(4)}, ${parseFloat(updated.lng).toFixed(4)}`);
      onCoordinatesChange({ lat: parseFloat(updated.lat), lng: parseFloat(updated.lng) });
    }
  };

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude.toFixed(4), lng: longitude.toFixed(4) });
          onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          onCoordinatesChange({ lat: latitude, lng: longitude });
          setInputMode('coordinates');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Clear input
  const clearInput = () => {
    onChange('');
    setCoordinates({ lat: '', lng: '' });
    onCoordinatesChange(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <Globe className="w-4 h-4" />
        Location Selection
      </label>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'text'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Search className="w-4 h-4 inline mr-1" />
          City Search
        </button>
        <button
          type="button"
          onClick={() => setInputMode('coordinates')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'coordinates'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1" />
          Coordinates
        </button>
      </div>

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={placeholder}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
            {value && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Coordinate Input Mode */}
      {inputMode === 'coordinates' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                placeholder="43.2220"
                value={coordinates.lat}
                onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                placeholder="76.8512"
                value={coordinates.lng}
                onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full py-2 px-4 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Use My Current Location
          </button>
        </div>
      )}

      {/* Dropdown with Suggestions and Recent Searches */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border-b">
                Kazakhstan Cities
              </div>
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.region} • {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-400">Population: {city.population}</div>
                  </div>
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !value && (
            <div>
              <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              {recentSearches.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {suggestions.length === 0 && recentSearches.length === 0 && value && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No cities found matching "{value}"</div>
              <div className="text-xs mt-1">Try searching for a Kazakhstan city or switch to coordinates</div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default EnhancedLocationInput;
