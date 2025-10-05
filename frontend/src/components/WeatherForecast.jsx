import { useState } from 'react';

const WeatherForecast = ({ forecastData, selectedDate }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const getWeatherIcon = (condition, temp) => {
    if (temp > 30) return '☀️';
    if (temp < 0) return '❄️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('snow')) return '🌨️';
    if (condition.includes('cloud')) return '☁️';
    return '🌤️';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header with better positioning */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          7-Day Weather Forecast
        </h3>
        <p className="text-gray-600">Detailed outlook for your location</p>
      </div>

      {/* Forecast cards - removed day labels */}
      <div className="grid grid-cols-7 gap-3">
        {forecastData?.slice(0, 7).map((day, index) => (
          <div
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${selectedDay === index 
                ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                : 'border-gray-200 bg-white hover:border-blue-300'
              }
            `}
          >
            {/* Date only - no "Day" label */}
            <div className="text-center mb-3">
              <p className="text-lg font-bold text-gray-800">
                {new Date(day.date).getDate()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </p>
            </div>

            {/* Weather icon with proper spacing */}
            <div className="text-center mb-4">
              <span className="text-4xl block mb-2">
                {getWeatherIcon(day.condition, day.temp)}
              </span>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <p className="text-sm font-bold text-gray-800">
                {Math.round(day.temp_max)}°
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(day.temp_min)}°
              </p>
            </div>

            {/* Precipitation probability */}
            <div className="mt-2 text-center">
              <p className="text-xs text-blue-600">
                {Math.round(day.precipitation_prob)}% 💧
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed view for selected day */}
      {forecastData && selectedDay < forecastData.length && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Detailed Forecast - {new Date(forecastData[selectedDay].date).toLocaleDateString()}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-xl font-bold text-blue-600">
                {Math.round(forecastData[selectedDay].temp)}°C
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Feels Like</p>
              <p className="text-xl font-bold text-orange-600">
                {Math.round(forecastData[selectedDay].feels_like)}°C
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Wind</p>
              <p className="text-xl font-bold text-green-600">
                {Math.round(forecastData[selectedDay].wind_speed)} km/h
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-bold text-purple-600">
                {Math.round(forecastData[selectedDay].humidity)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
