import React from 'react';

const LoadingState = ({ message = "Analyzing NASA satellite data...", isAnalyzing = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {/* NASA Satellite Animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Earth */}
        <div className="absolute inset-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-xl">
          {/* Continents */}
          <div className="absolute top-2 left-3 w-6 h-4 bg-green-500 rounded-full opacity-70"></div>
          <div className="absolute top-8 right-2 w-4 h-3 bg-green-500 rounded-full opacity-70"></div>
          <div className="absolute bottom-3 left-4 w-8 h-3 bg-green-500 rounded-full opacity-70"></div>
          
          {/* Atmospheric glow */}
          <div className="absolute -inset-1 bg-cyan-300 rounded-full opacity-20 blur-sm animate-pulse"></div>
        </div>

        {/* Orbital rings */}
        <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-full animate-spin opacity-50" style={{ animationDuration: '8s' }}>
          {/* Satellite 1 - MODIS */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm shadow-lg transform rotate-45">
                <div className="absolute inset-0.5 bg-yellow-300 rounded-sm"></div>
              </div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-600 font-semibold whitespace-nowrap">
                MODIS
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 border border-dashed border-green-300 rounded-full animate-spin opacity-40" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          {/* Satellite 2 - GPM */}
          <div className="absolute top-2 right-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-sm shadow-lg">
                <div className="absolute inset-0.5 bg-green-300 rounded-sm"></div>
              </div>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-semibold whitespace-nowrap">
                GPM
              </div>
            </div>
          </div>
        </div>

        {/* Data transmission lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-t from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"
            style={{
              height: '60px',
              left: `${40 + i * 10}%`,
              top: '20%',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {isAnalyzing ? "🛰️ NASA Analysis in Progress" : "🔄 Loading"}
        </h3>
        <p className="text-lg text-gray-600 animate-pulse">
          {message}
        </p>
      </div>

      {/* Progress Animation */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 animate-pulse rounded-full"></div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">NASA POWER API</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-gray-600">Giovanni Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="text-gray-600">Weather Analysis</span>
        </div>
      </div>

      {/* Animated Dots */}
      <div className="flex items-center gap-1 mt-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingState;