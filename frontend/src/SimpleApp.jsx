import { useState } from 'react';

function SimpleApp() {
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">🌦️ Will It Rain on My Parade?</h1>
            <p className="text-xl opacity-90">NASA-powered weather analysis for your outdoor adventures</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Weather Risk Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">📍 Select Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">🎯 Activity Type</label>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select activity...</option>
                  <option value="wedding">Wedding</option>
                  <option value="hiking">Hiking</option>
                  <option value="farming">Farming</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">📅 Select Date</label>
                <input
                  type="date"
                  value={date || ''}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              🔍 Analyze Weather Risk
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="font-semibold">Parade's Guardian - Powered by NASA Earth Observation Data</span>
          </div>
          <p className="text-gray-300 text-sm">
            NASA Space Apps Challenge 2025 • American Corner Kazakhstan
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SimpleApp;