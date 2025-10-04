import { Activity, Heart, Mountain, Wheat } from 'lucide-react'

const ActivitySelector = ({ value, onChange }) => {
  
  const activities = [
    {
      id: 'wedding',
      name: 'Wedding',
      icon: Heart,
      description: 'Low rain tolerance, ideal temperature range',
      color: 'pink'
    },
    {
      id: 'hiking',
      name: 'Hiking',
      icon: Mountain,
      description: 'Moderate conditions, avoid extreme weather',
      color: 'green'
    },
    {
      id: 'farming',
      name: 'Farming',
      icon: Wheat,
      description: 'High tolerance for varied conditions',
      color: 'yellow'
    },
    {
      id: 'general',
      name: 'General Outdoor Event',
      icon: Activity,
      description: 'Balanced weather preferences',
      color: 'blue'
    }
  ]
  
  const getColorClasses = (color, isSelected) => {
    const baseClasses = isSelected 
      ? 'ring-2 ring-offset-2' 
      : 'hover:bg-gray-50'
    
    const colorClasses = {
      pink: isSelected 
        ? 'ring-pink-500 bg-pink-50 border-pink-200' 
        : 'border-gray-200',
      green: isSelected 
        ? 'ring-green-500 bg-green-50 border-green-200' 
        : 'border-gray-200',
      yellow: isSelected 
        ? 'ring-yellow-500 bg-yellow-50 border-yellow-200' 
        : 'border-gray-200',
      blue: isSelected 
        ? 'ring-blue-500 bg-blue-50 border-blue-200' 
        : 'border-gray-200'
    }
    
    return `${baseClasses} ${colorClasses[color]}`
  }
  
  const getIconClasses = (color) => {
    const colorClasses = {
      pink: 'text-pink-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      blue: 'text-blue-600'
    }
    return colorClasses[color]
  }
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Activity className="w-4 h-4 inline mr-1" />
        Activity Type
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.map((activity) => {
          const IconComponent = activity.icon
          const isSelected = value === activity.id
          
          return (
            <button
              key={activity.id}
              onClick={() => onChange(activity.id)}
              className={`p-4 border rounded-xl text-left transition-all duration-200 ${getColorClasses(activity.color, isSelected)}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${activity.color === 'pink' ? 'bg-pink-100' : activity.color === 'green' ? 'bg-green-100' : activity.color === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                  <IconComponent className={`w-5 h-5 ${getIconClasses(activity.color)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Activity-Specific Thresholds Info */}
      {value && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Weather Criteria for {activities.find(a => a.id === value)?.name}</h4>
          <ActivityThresholds activityType={value} />
        </div>
      )}
    </div>
  )
}

const ActivityThresholds = ({ activityType }) => {
  const thresholds = {
    wedding: {
      rain: '< 5mm/day',
      temperature: '18-28°C',
      wind: '< 25 km/h',
      humidity: '< 70%'
    },
    hiking: {
      rain: '< 10mm/day',
      temperature: '10-25°C',
      wind: '< 40 km/h',
      humidity: '< 80%'
    },
    farming: {
      rain: '< 50mm/day',
      temperature: '5-35°C',
      wind: '< 60 km/h',
      humidity: '< 90%'
    },
    general: {
      rain: '< 15mm/day',
      temperature: '15-30°C',
      wind: '< 35 km/h',
      humidity: '< 75%'
    }
  }
  
  const current = thresholds[activityType]
  
  if (!current) return null
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div>
        <span className="text-gray-500">Rain:</span>
        <div className="font-medium">{current.rain}</div>
      </div>
      <div>
        <span className="text-gray-500">Temperature:</span>
        <div className="font-medium">{current.temperature}</div>
      </div>
      <div>
        <span className="text-gray-500">Wind:</span>
        <div className="font-medium">{current.wind}</div>
      </div>
      <div>
        <span className="text-gray-500">Humidity:</span>
        <div className="font-medium">{current.humidity}</div>
      </div>
    </div>
  )
}

export default ActivitySelector