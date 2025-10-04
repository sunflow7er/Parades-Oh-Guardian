import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'

const LocationInput = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  
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
  
  const handleCitySelect = (city) => {
    onChange({
      latitude: city.lat,
      longitude: city.lng
    })
    setSearchQuery(city.name)
  }
  
  const handleCoordinateChange = (field, val) => {
    onChange({
      ...value,
      [field]: parseFloat(val) || 0
    })
  }
  
  const filteredCities = kazakhstanCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-1" />
        Location
      </label>
      
      {/* City Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Kazakhstan cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {searchQuery && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-gray-500">
                  {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Manual Coordinates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={value.latitude || ''}
            onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="43.2567"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={value.longitude || ''}
            onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="76.9286"
          />
        </div>
      </div>
      
      {/* Current Selection Display */}
      {value.latitude && value.longitude && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-4 h-4 inline mr-1" />
          Selected: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
        </div>
      )}
    </div>
  )
}

export default LocationInput