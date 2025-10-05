import { useState } from 'react';

function MinimalApp() {
  const [location, setLocation] = useState('');
  
  const kazakhstanCities = [
    'Almaty', 'Nur-Sultan (Astana)', 'Shymkent', 'Aktobe', 'Taraz', 'Pavlodar'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-600">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-20 relative overflow-hidden minecraft-header">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">
            ⛏️ Will It Rain on My Parade? 🟩
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
            NASA-powered weather analysis for your outdoor adventures
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Simple Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Weather Risk Analysis
            </h2>
            <p className="text-gray-600 text-lg">
              Get NASA-powered insights for your perfect weather window
            </p>
          </div>

          {/* Location Input */}
          <div className="max-w-md mx-auto">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
              <span className="text-2xl">📍</span>
              Select Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg bg-gradient-to-r from-white to-blue-50 hover:shadow-lg"
            >
              <option value="">Choose your location...</option>
              {kazakhstanCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {location && (
            <div className="mt-6 text-center">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 inline-block">
                <p className="text-lg font-bold text-green-800">
                  📍 Selected: {location}
                </p>
                <p className="text-green-600">
                  Ready for weather analysis!
                </p>
              </div>
            </div>
          )}

          {/* Test Button */}
          <div className="mt-8 text-center">
            <button className="bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 hover:from-green-700 hover:via-emerald-700 hover:to-lime-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl border-2 border-green-800 transition-all duration-300 transform hover:scale-105">
              ⛏️ Mine Weather Data 🟩
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            🛰️ NASA Space Apps Challenge 2025
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Minimal App is Working! All components will load progressively.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold text-green-800">React Loaded</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold text-blue-800">Tailwind Working</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold text-purple-800">Minecraft Theme</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;