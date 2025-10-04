import { Star, Calendar, ThermometerSun, CloudRain, Wind, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const WeatherResults = ({ data }) => {
  if (!data || !data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
        <p className="text-red-600">{data?.error || 'Unable to analyze weather data'}</p>
      </div>
    )
  }

  const { top_recommendations, insights, methodology } = data

  return (
    <div className="space-y-8">
      
      {/* Top Recommendation Highlight */}
      {top_recommendations && top_recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center mb-4">
            <Star className="w-8 h-8 mr-3" />
            <h2 className="text-3xl font-bold">Best Weather Window</h2>
          </div>
          
          <WeatherRecommendationCard 
            recommendation={top_recommendations[0]} 
            highlight={true}
          />
        </div>
      )}

      {/* Alternative Recommendations */}
      {top_recommendations && top_recommendations.length > 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Alternative Weather Windows</h3>
          <div className="space-y-4">
            {top_recommendations.slice(1).map((rec, index) => (
              <WeatherRecommendationCard 
                key={rec.date} 
                recommendation={rec} 
                rank={index + 2}
              />
            ))}
          </div>
        </div>
      )}

      {/* Insights Summary */}
      {insights && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Analysis Insights
          </h3>
          <InsightsSummary insights={insights} />
        </div>
      )}

      {/* Methodology */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">How We Calculate This</h3>
        <MethodologyInfo methodology={methodology} />
      </div>
    </div>
  )
}

const WeatherRecommendationCard = ({ recommendation, highlight = false, rank = 1 }) => {
  const { date, day_of_week, weather_score, confidence_score, risks, conditions, recommendation: rec } = recommendation
  
  const getScoreColor = (score) => {
    if (score >= 85) return highlight ? 'text-white' : 'text-green-600'
    if (score >= 70) return highlight ? 'text-green-100' : 'text-blue-600'
    if (score >= 55) return highlight ? 'text-yellow-100' : 'text-yellow-600'
    return highlight ? 'text-red-100' : 'text-red-600'
  }
  
  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 70) return 'bg-blue-500'
    if (score >= 55) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className={`${highlight ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'} rounded-xl p-6 border ${highlight ? 'border-white/20' : 'border-gray-200'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            {!highlight && rank && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                {rank}
              </div>
            )}
            <div>
              <h4 className={`text-xl font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <p className={`${highlight ? 'text-white/80' : 'text-gray-600'}`}>{day_of_week}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(weather_score)}`}>
            {weather_score}%
          </div>
          <div className={`text-sm ${highlight ? 'text-white/70' : 'text-gray-500'}`}>
            Weather Score
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`mb-4 p-3 rounded-lg ${highlight ? 'bg-white/10' : 'bg-white'}`}>
        <p className={`font-medium ${highlight ? 'text-white' : 'text-gray-800'}`}>
          {rec?.text || 'Weather analysis complete'}
        </p>
      </div>

      {/* Weather Risks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {risks && Object.entries(risks).slice(0, 4).map(([key, risk]) => (
          <WeatherRiskCard 
            key={key} 
            risk={risk} 
            highlight={highlight}
          />
        ))}
      </div>

      {/* Conditions Summary */}
      {conditions && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className={`text-center ${highlight ? 'text-white/90' : 'text-gray-700'}`}>
            <ThermometerSun className={`w-5 h-5 mx-auto mb-1 ${highlight ? 'text-white' : 'text-orange-500'}`} />
            <div className="font-medium">{conditions.temperature?.average}°C</div>
            <div className={`text-xs ${highlight ? 'text-white/70' : 'text-gray-500'}`}>Average</div>
          </div>
          
          <div className={`text-center ${highlight ? 'text-white/90' : 'text-gray-700'}`}>
            <CloudRain className={`w-5 h-5 mx-auto mb-1 ${highlight ? 'text-white' : 'text-blue-500'}`} />
            <div className="font-medium">{conditions.precipitation?.average_daily}mm</div>
            <div className={`text-xs ${highlight ? 'text-white/70' : 'text-gray-500'}`}>Rain</div>
          </div>
          
          <div className={`text-center ${highlight ? 'text-white/90' : 'text-gray-700'}`}>
            <Wind className={`w-5 h-5 mx-auto mb-1 ${highlight ? 'text-white' : 'text-gray-500'}`} />
            <div className="font-medium">{conditions.wind_speed?.average} m/s</div>
            <div className={`text-xs ${highlight ? 'text-white/70' : 'text-gray-500'}`}>Wind</div>
          </div>
        </div>
      )}

      {/* Confidence Score */}
      <div className={`mt-4 pt-3 border-t ${highlight ? 'border-white/20' : 'border-gray-200'} text-sm`}>
        <div className="flex items-center justify-between">
          <span className={`${highlight ? 'text-white/80' : 'text-gray-600'}`}>
            Confidence Score: {confidence_score}%
          </span>
          <span className={`text-xs ${highlight ? 'text-white/70' : 'text-gray-500'}`}>
            Based on {recommendation.historical_data_points} similar days
          </span>
        </div>
      </div>
    </div>
  )
}

const WeatherRiskCard = ({ risk, highlight = false }) => {
  const getRiskColor = (level) => {
    if (highlight) {
      return level === 'low' ? 'text-green-200' : level === 'medium' ? 'text-yellow-200' : 'text-red-200'
    }
    return level === 'low' ? 'text-green-600' : level === 'medium' ? 'text-yellow-600' : 'text-red-600'
  }
  
  const getRiskBg = (level) => {
    if (highlight) {
      return level === 'low' ? 'bg-green-500/20' : level === 'medium' ? 'bg-yellow-500/20' : 'bg-red-500/20'
    }
    return level === 'low' ? 'bg-green-50' : level === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
  }

  return (
    <div className={`p-2 rounded-lg ${getRiskBg(risk.risk_level)}`}>
      <div className={`font-bold text-sm ${getRiskColor(risk.risk_level)}`}>
        {risk.probability}%
      </div>
      <div className={`text-xs ${highlight ? 'text-white/70' : 'text-gray-600'}`}>
        {risk.description?.split(' ').slice(0, 2).join(' ')}
      </div>
    </div>
  )
}

const InsightsSummary = ({ insights }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div>
            <div className="font-semibold text-green-800">Best Date</div>
            <div className="text-green-600">{new Date(insights.best_date).toLocaleDateString()}</div>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="font-semibold text-blue-800">Excellent Days</div>
            <div className="text-blue-600">{insights.excellent_days} out of {insights.excellent_days + insights.good_days + insights.risky_days}</div>
          </div>
          <Star className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-800 mb-2">Score Range</div>
          <div className="text-sm text-gray-600">
            Best: {insights.score_range?.max}% • Worst: {insights.score_range?.min}%
          </div>
          <div className="text-sm text-gray-600">
            Average: {insights.average_score}%
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="font-semibold text-yellow-800 mb-1">Climate Note</div>
          <div className="text-sm text-yellow-700">{insights.climate_note}</div>
        </div>
      </div>
    </div>
  )
}

const MethodologyInfo = ({ methodology }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 text-sm">
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Data Source</h4>
        <p className="text-gray-600">NASA POWER API with 20+ years of satellite observations</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Analysis Method</h4>
        <p className="text-gray-600">Statistical probability analysis with machine learning pattern recognition</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Confidence Calculation</h4>
        <p className="text-gray-600">Based on historical data reliability and sample size</p>
      </div>
    </div>
  )
}

export default WeatherResults