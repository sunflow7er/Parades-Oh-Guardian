// Weather Visualization Components for NASA Space Apps Challenge
// Quick 2-3 hour implementation for major presentation impact

import React from 'react'
import { Thermometer, Cloud, Wind, Droplets } from 'lucide-react'

const WeatherVisualization = ({ conditions, risks }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <TemperatureGauge 
        temperature={conditions?.temperature?.average || 0}
        risk={risks?.very_hot?.probability || 0}
      />
      <RainIntensity 
        precipitation={conditions?.precipitation?.average_daily || 0}
        risk={risks?.heavy_rain?.probability || 0}
      />
      <WindGauge 
        windSpeed={conditions?.wind_speed?.average || 0}
        risk={risks?.strong_winds?.probability || 0}
      />
      <HumidityMeter 
        humidity={conditions?.humidity?.average || 50}
      />
    </div>
  )
}

const TemperatureGauge = ({ temperature, risk }) => {
  const getTemperatureColor = (temp) => {
    if (temp > 35) return '#ef4444' // Red - Very hot
    if (temp > 28) return '#f97316' // Orange - Hot  
    if (temp > 18) return '#22c55e' // Green - Ideal
    if (temp > 0) return '#3b82f6'  // Blue - Cool
    return '#8b5cf6' // Purple - Cold
  }
  
  const temperatureHeight = Math.min(Math.max(((temperature + 20) / 60) * 100, 10), 100)
  const color = getTemperatureColor(temperature)
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Thermometer className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Temperature</span>
      </div>
      
      <div className="relative h-24 w-8 mx-auto mb-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full transition-all duration-1000 ease-out rounded-full"
          style={{ 
            height: `${temperatureHeight}%`, 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-800" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold" style={{ color }}>
          {temperature.toFixed(1)}°C
        </div>
        <div className="text-xs text-gray-500">
          Risk: {risk}%
        </div>
      </div>
    </div>
  )
}

const RainIntensity = ({ precipitation, risk }) => {
  const rainDrops = Math.min(Math.ceil(precipitation / 2), 10)
  const intensity = Math.min(precipitation / 50 * 100, 100)
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Cloud className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Precipitation</span>
      </div>
      
      <div className="relative h-24 mb-3 overflow-hidden">
        {/* Animated rain drops */}
        <div className="absolute inset-0">
          {Array.from({ length: rainDrops }).map((_, i) => (
            <Droplets
              key={i}
              className={`absolute w-3 h-3 text-blue-500 animate-bounce`}
              style={{
                left: `${(i * 15) % 100}%`,
                top: `${(i * 25) % 80}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: Math.min(intensity / 100 + 0.3, 1)
              }}
            />
          ))}
        </div>
        
        {/* Rain intensity bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-300 transition-all duration-1000 ease-out"
            style={{ height: `${intensity}%` }}
          />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">
          {precipitation.toFixed(1)} mm
        </div>
        <div className="text-xs text-gray-500">
          Risk: {risk}%
        </div>
      </div>
    </div>
  )
}

const WindGauge = ({ windSpeed, risk }) => {
  const windRotation = Math.min((windSpeed / 20) * 180, 180)
  const windIntensity = Math.min(windSpeed / 15 * 100, 100)
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Wind className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Wind Speed</span>
      </div>
      
      <div className="relative h-24 mb-3 flex items-center justify-center">
        {/* Wind gauge semicircle */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-8 border-gray-200 rounded-full border-b-transparent" />
          <div 
            className="absolute inset-2 border-4 border-transparent rounded-full transition-all duration-1000 ease-out"
            style={{ 
              borderTopColor: windIntensity > 70 ? '#ef4444' : windIntensity > 40 ? '#f59e0b' : '#22c55e',
              transform: `rotate(${windRotation}deg)`
            }}
          />
          
          {/* Wind pointer */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-gray-800 origin-bottom transition-all duration-1000 ease-out"
            style={{ 
              transform: `translate(-50%, -100%) rotate(${windRotation - 90}deg)` 
            }}
          />
          
          {/* Animated wind lines */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-0.5 bg-gray-400 mb-1 animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  opacity: windIntensity > (i * 30) ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-gray-700">
          {windSpeed.toFixed(1)} m/s
        </div>
        <div className="text-xs text-gray-500">
          Risk: {risk}%
        </div>
      </div>
    </div>
  )
}

const HumidityMeter = ({ humidity }) => {
  const humidityLevel = Math.min(Math.max(humidity, 0), 100)
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Droplets className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Humidity</span>
      </div>
      
      <div className="relative h-24 mb-3 flex items-center justify-center">
        {/* Circular humidity meter */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-1000 ease-out ${
                humidityLevel > 70 ? 'text-blue-600' : 
                humidityLevel > 40 ? 'text-blue-400' : 'text-blue-300'
              }`}
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              strokeDasharray={`${humidityLevel}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">
              {Math.round(humidityLevel)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">
          {humidity.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500">
          Humidity Level
        </div>
      </div>
    </div>
  )
}

export default WeatherVisualization