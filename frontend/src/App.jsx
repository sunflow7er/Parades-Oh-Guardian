import { useState } from 'react'
import { Satellite, Calendar, MapPin, Sparkles } from 'lucide-react'
import LocationInput from './components/LocationInput'
import DateRangePicker from './components/DateRangePicker'
import ActivitySelector from './components/ActivitySelector'
import WeatherResults from './components/WeatherResults'
import LoadingState from './components/LoadingState'
import './App.css'

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    latitude: 43.2567,  // Default to Almaty, Kazakhstan
    longitude: 76.9286,
    startDate: '',
    endDate: '',
    activityType: 'general'
  })

  const handleAnalyzeWeather = async () => {
    if (!formData.latitude || !formData.longitude || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/weather-windows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: formData.latitude,
          longitude: formData.longitude,
          start_date: formData.startDate,
          end_date: formData.endDate,
          activity_type: formData.activityType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch weather analysis')
      }

      const data = await response.json()
      
      if (data.success) {
        setAnalysisData(data)
      } else {
        setError(data.error || 'Analysis failed')
      }
      
    } catch (err) {
      setError('Failed to connect to weather service. Please try again.')
      console.error('Weather analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Satellite className="w-12 h-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Parade Saver</h1>
          </div>
          <p className="text-xl opacity-90 mb-2">Will It Rain On My Parade?</p>
          <p className="text-blue-100">NASA-powered weather predictions for your outdoor plans</p>
          <div className="mt-4 flex items-center justify-center text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>NASA Space Apps Challenge 2025 • Kazakhstan</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Find Your Perfect Weather Window
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <LocationInput 
              value={{ latitude: formData.latitude, longitude: formData.longitude }}
              onChange={(coords) => setFormData(prev => ({ ...prev, ...coords }))}
            />
            
            <DateRangePicker 
              startDate={formData.startDate}
              endDate={formData.endDate}
              onChange={(dates) => setFormData(prev => ({ ...prev, ...dates }))}
            />
          </div>
          
          <div className="mt-6">
            <ActivitySelector 
              value={formData.activityType}
              onChange={(activityType) => setFormData(prev => ({ ...prev, activityType }))}
            />
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          <button
            onClick={handleAnalyzeWeather}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing NASA Data...
              </>
            ) : (
              <>
                <Satellite className="w-5 h-5 mr-2" />
                Analyze Weather Patterns
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Results */}
        {analysisData && !loading && (
          <WeatherResults data={analysisData} />
        )}
        
        {/* Features Overview */}
        {!analysisData && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Satellite className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">NASA Data Analysis</h3>
              <p className="text-gray-600">20 years of satellite data from NASA POWER API for accurate predictions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Date Ranking</h3>
              <p className="text-gray-600">Get the top 5 weather windows ranked by probability of perfect conditions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Kazakhstan Focus</h3>
              <p className="text-gray-600">Optimized for Central Asian weather patterns and local conditions</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Satellite className="w-6 h-6 mr-2" />
            <span className="font-semibold">Powered by NASA Earth Observation Data</span>
          </div>
          <p className="text-gray-300 text-sm">
            NASA Space Apps Challenge 2025 • American Corner Kazakhstan
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Data sources: NASA POWER API, Giovanni Platform, Worldview
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
