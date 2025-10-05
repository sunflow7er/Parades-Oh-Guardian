// Weather Timeline Component - Shows day-by-day risk analysis
// High visual impact for NASA Space Apps presentation

import React, { useState } from 'react'
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

const WeatherTimeline = ({ dailyAnalysis = [], totalDays = 7 }) => {
  const [selectedDay, setSelectedDay] = useState(0)
  
  if (!dailyAnalysis.length) return null
  
  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 70) return 'bg-red-500 text-white'
    if (riskLevel >= 40) return 'bg-orange-500 text-white'
    if (riskLevel >= 20) return 'bg-yellow-500 text-black'
    return 'bg-green-500 text-white'
  }
  
  const getRiskIcon = (riskLevel) => {
    if (riskLevel >= 40) return <AlertTriangle className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }
  
  const getWeatherEmoji = (conditions) => {
    const temp = conditions?.temperature || 20
    const rain = conditions?.precipitation || 0
    const wind = conditions?.wind_speed || 0
    
    if (rain > 10) return '🌧️'
    if (rain > 5) return '🌦️'
    if (temp > 30) return '☀️'
    if (wind > 10) return '💨'
    if (temp < 5) return '❄️'
    return '⛅'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">7-Day Weather Forecast</h3>
      </div>
      
      {/* Timeline visualization */}
      <div className="relative mb-8">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        
        {/* Timeline points */}
        <div className="relative flex justify-between items-center">
          {dailyAnalysis.slice(0, 7).map((day, index) => {
            const riskLevel = day.overall_risk || 0
            const isSelected = selectedDay === index
            
            return (
              <div
                key={index}
                className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
                onClick={() => setSelectedDay(index)}
              >
                {/* Timeline point */}
                <div
                  className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                    getRiskColor(riskLevel)
                  } ${isSelected ? 'scale-125 ring-4 ring-blue-300' : ''}`}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    {getRiskIcon(riskLevel)}
                  </div>
                </div>
                
                {/* Day label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                    Day {index + 1}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
                
                {/* Weather emoji */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-2xl">
                  {getWeatherEmoji(day.conditions)}
                </div>
                
                {/* Risk percentage */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${getRiskColor(riskLevel)}`}>
                    {Math.round(riskLevel)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Selected day details */}
      {selectedDay < dailyAnalysis.length && (
        <DayDetails day={dailyAnalysis[selectedDay]} dayNumber={selectedDay + 1} />
      )}
      
      {/* Risk trend analysis */}
      <RiskTrend dailyAnalysis={dailyAnalysis.slice(0, 7)} />
    </div>
  )
}

const DayDetails = ({ day, dayNumber }) => {
  const conditions = day.conditions || {}
  const risks = day.risks || {}
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 animate-fadeIn">
      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
          {dayNumber}
        </span>
        {new Date(day.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl mb-1">🌡️</div>
          <div className="text-sm text-gray-600">Temperature</div>
          <div className="font-bold text-lg">
            {conditions.temperature?.toFixed(1) || 'N/A'}°C
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-1">🌧️</div>
          <div className="text-sm text-gray-600">Precipitation</div>
          <div className="font-bold text-lg text-blue-600">
            {conditions.precipitation?.toFixed(1) || 'N/A'} mm
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-1">💨</div>
          <div className="text-sm text-gray-600">Wind Speed</div>
          <div className="font-bold text-lg text-gray-700">
            {conditions.wind_speed?.toFixed(1) || 'N/A'} m/s
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-sm text-gray-600">Humidity</div>
          <div className="font-bold text-lg text-blue-500">
            {conditions.humidity?.toFixed(1) || 'N/A'}%
          </div>
        </div>
      </div>
      
      {/* Risk breakdown */}
      <div className="space-y-2">
        <h5 className="font-semibold text-gray-700 mb-2">Risk Analysis:</h5>
        {Object.entries(risks).map(([riskType, riskData]) => (
          <div key={riskType} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">
              {riskType.replace('_', ' ')}:
            </span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    riskData.probability >= 70 ? 'bg-red-500' :
                    riskData.probability >= 40 ? 'bg-orange-500' :
                    riskData.probability >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${riskData.probability || 0}%` }}
                />
              </div>
              <span className="text-sm font-medium min-w-[3rem]">
                {riskData.probability?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const RiskTrend = ({ dailyAnalysis }) => {
  const riskTrend = dailyAnalysis.map(day => day.overall_risk || 0)
  const avgRisk = riskTrend.reduce((sum, risk) => sum + risk, 0) / riskTrend.length
  const isIncreasing = riskTrend[riskTrend.length - 1] > riskTrend[0]
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-gray-700 flex items-center">
          {isIncreasing ? (
            <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
          ) : (
            <TrendingDown className="w-5 h-5 mr-2 text-green-500" />
          )}
          Risk Trend Analysis
        </h5>
        <div className="text-right">
          <div className="text-sm text-gray-600">Average Risk</div>
          <div className={`text-lg font-bold ${
            avgRisk >= 40 ? 'text-red-600' : avgRisk >= 20 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {avgRisk.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {isIncreasing ? (
          <span className="text-red-600 font-medium">
            ⚠️ Weather conditions are expected to worsen over the week
          </span>
        ) : (
          <span className="text-green-600 font-medium">
            ✅ Weather conditions are expected to improve over the week
          </span>
        )}
      </div>
    </div>
  )
}

export default WeatherTimeline