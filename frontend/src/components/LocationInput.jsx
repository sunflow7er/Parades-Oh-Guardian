import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, X } from 'lucide-react'

const LocationInput = ({ onLocationSelect, selectedLocation }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const kazakhstanCities = [
    { name: 'Almaty', lat: 43.2567, lng: 76.9286 },
    { name: 'Nur-Sultan (Astana)', lat: 51.1694, lng: 71.4491 },
    { name: 'Shymkent', lat: 42.3417, lng: 69.5901 },
    { name: 'Aktobe', lat: 50.2958, lng: 57.1674 },
    { name: 'Taraz', lat: 42.9000, lng: 71.3667 },
    { name: 'Pavlodar', lat: 52.2874, lng: 76.9674 },
    { name: 'Ust-Kamenogorsk', lat: 49.9487, lng: 82.6159 },
    { name: 'Semey', lat: 50.4119, lng: 80.2275 }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value) => {
    setLoading(true)
    setTimeout(() => {
      const filtered = kazakhstanCities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
      setLoading(false)
    }, 300)
  }

  const handleLocationSelect = (location) => {
    onLocationSelect(location)
    setQuery(location.name)
    setShowDropdown(false)
    setSuggestions([])
  }

  const clearSelection = () => {
    onLocationSelect(null)
    setQuery('')
    setShowDropdown(false)
    setSuggestions([])
  }

  return (
    <div className="space-y-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-1" />
        Location
      </label>
      
      {/* Enhanced Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDropdown(e.target.value.length > 0)
            handleSearch(e.target.value)
          }}
          onFocus={() => setShowDropdown(query.length > 0)}
          placeholder="Search city or enter coordinates..."
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={clearSelection}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Fixed Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{location.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">{selectedLocation.name}</p>
                <p className="text-sm text-green-600">
                  📍 {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                </p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationInput