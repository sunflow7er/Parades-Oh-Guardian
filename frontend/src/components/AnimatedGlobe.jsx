import React, { useState, useEffect, useRef } from 'react';

const AnimatedGlobe = ({ location, coordinates, isAnalyzing = false }) => {
  const [rotation, setRotation] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  // Realistic satellite orbital data
  const [satellites, setSatellites] = useState({
    modis_terra: { position: 0, speed: 0.04 }, // MODIS Terra: ~99 min orbit = 0.04°/frame at 60fps
    modis_aqua: { position: 120, speed: 0.04 }, // MODIS Aqua: ~99 min orbit, 120° offset
    gpm: { position: 240, speed: 0.038 }  // GPM Core: ~93 min orbit, slightly faster
  });
  
  const animationRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setIsVisible(true);
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime.current) / 1000; // seconds
      
      // Earth rotation: 24 hours = 86400 seconds for 360°
      // Sped up for visual effect: 1 rotation per 2 minutes = 120 seconds
      setRotation((elapsed * 3) % 360); // 3°/second = 360° in 2 minutes
      
      // Pulse effect for scanning
      setPulseIntensity(Math.sin(elapsed * 2) * 0.5 + 0.5);
      
      // Realistic satellite orbital mechanics
      setSatellites(prev => ({
        modis_terra: {
          ...prev.modis_terra,
          position: (prev.modis_terra.position + prev.modis_terra.speed) % 360
        },
        modis_aqua: {
          ...prev.modis_aqua,
          position: (prev.modis_aqua.position + prev.modis_aqua.speed) % 360
        },
        gpm: {
          ...prev.gpm,
          position: (prev.gpm.position + prev.gpm.speed) % 360
        }
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Convert coordinates to position on sphere
  const getLocationPosition = () => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return { x: 50, y: 50 }; // Default center position
    }
    
    const lat = coordinates.lat;
    const lng = coordinates.lng;
    
    // Convert lat/lng to x/y position on the visible hemisphere
    const adjustedLng = ((lng - rotation + 360) % 360);
    const visible = adjustedLng > 270 || adjustedLng < 90; // Only show if on visible side
    
    if (!visible) return null;
    
    const x = 50 + (adjustedLng > 180 ? adjustedLng - 360 : adjustedLng) * 0.3;
    const y = 50 - lat * 0.6;
    
    return { x: Math.max(20, Math.min(80, x)), y: Math.max(20, Math.min(80, y)) };
  };

  const locationPos = getLocationPosition();

  return (
    <div className={`relative w-80 h-80 mx-auto transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
      {/* Orbital Rings */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
        <div className="absolute inset-8 border-2 border-blue-200 rounded-full opacity-30"></div>
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
        <div className="absolute inset-12 border border-purple-200 rounded-full opacity-20"></div>
      </div>
      
      {/* Scanning Ring (when analyzing) */}
      {isAnalyzing && (
        <div className="absolute inset-6 border-2 border-green-400 rounded-full opacity-60 animate-ping"></div>
      )}
      
      {/* Main Globe Container */}
      <div className="relative w-full h-full">
        {/* Globe Background */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 shadow-2xl overflow-hidden">
          {/* Atmospheric Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Rotating Globe Surface */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `conic-gradient(from ${rotation}deg, 
                #1e40af 0deg, #2563eb 60deg, #3b82f6 120deg, 
                #60a5fa 180deg, #93c5fd 240deg, #1e40af 300deg, #1e40af 360deg)`,
            }}
          >
            {/* Continent Patterns */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-green-600 rounded-full opacity-60"
                  style={{
                    width: `${20 + i * 5}px`,
                    height: `${10 + i * 3}px`,
                    left: `${20 + (i * 30 + rotation * 0.5) % 280}px`,
                    top: `${30 + i * 25}px`,
                    transform: `rotate(${rotation * 0.3 + i * 45}deg)`,
                    transition: 'all 0.1s ease-out'
                  }}
                />
              ))}
            </div>
            
            {/* Cloud Layer */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full blur-sm"
                  style={{
                    width: `${15 + i * 8}px`,
                    height: `${8 + i * 4}px`,
                    left: `${10 + (i * 40 + rotation * 0.8) % 260}px`,
                    top: `${20 + i * 30}px`,
                    opacity: Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.4
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Location Marker */}
          {locationPos && (
            <div
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${locationPos.x}%`, 
                top: `${locationPos.y}%`,
              }}
            >
              {/* Pulsing Marker */}
              <div className="relative">
                <div 
                  className="w-4 h-4 bg-red-500 rounded-full shadow-lg animate-bounce"
                  style={{ 
                    boxShadow: `0 0 ${10 + pulseIntensity * 10}px rgba(239, 68, 68, 0.6)`,
                  }}
                />
                <div 
                  className="absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-ping"
                  style={{ opacity: pulseIntensity }}
                />
                
                {/* Location Info Popup */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap backdrop-blur-sm border border-white/20">
                  <div className="font-bold">{location}</div>
                  {coordinates && (
                    <div className="text-xs opacity-70 mt-1 space-y-0.5">
                      <div>Lat: {coordinates.lat?.toFixed(4)}°</div>
                      <div>Lng: {coordinates.lng?.toFixed(4)}°</div>
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-opacity-90"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Realistic NASA Satellite Orbits */}
        
        {/* MODIS Terra - Sun-synchronous polar orbit */}
        <div 
          className="absolute inset-0" 
          style={{ 
            transform: `rotate(${satellites.modis_terra.position}deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg animate-pulse">
                <div className="absolute -inset-1 bg-orange-300 rounded-full animate-ping opacity-50"></div>
              </div>
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 whitespace-nowrap font-semibold bg-white px-2 py-1 rounded shadow">
                MODIS Terra
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                705km • 99min
              </div>
            </div>
          </div>
        </div>
        
        {/* MODIS Aqua - Sun-synchronous polar orbit, offset from Terra */}
        <div 
          className="absolute inset-0" 
          style={{ 
            transform: `rotate(${satellites.modis_aqua.position}deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg animate-pulse">
                <div className="absolute -inset-1 bg-blue-300 rounded-full animate-ping opacity-50"></div>
              </div>
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap font-semibold bg-white px-2 py-1 rounded shadow">
                MODIS Aqua
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                705km • 99min
              </div>
            </div>
          </div>
        </div>
        
        {/* GPM Core Observatory - Non-sun-synchronous orbit */}
        <div 
          className="absolute inset-0" 
          style={{ 
            transform: `rotate(${satellites.gpm.position}deg) rotateX(15deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg animate-pulse">
                <div className="absolute -inset-1 bg-green-300 rounded-full animate-ping opacity-50"></div>
              </div>
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-green-600 whitespace-nowrap font-semibold bg-white px-2 py-1 rounded shadow">
                GPM Core
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                407km • 93min
              </div>
            </div>
          </div>
        </div>
        
        {/* Satellite Orbital Paths */}
        <div className="absolute inset-0 border-2 border-dashed border-orange-300/30 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-dashed border-blue-300/30 rounded-full" style={{transform: 'rotateZ(10deg)'}}></div>
        <div className="absolute inset-0 border-2 border-dashed border-green-300/30 rounded-full" style={{transform: 'rotateZ(-5deg) rotateX(15deg)'}}></div>
        
        {/* Data Streams */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-t from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"
              style={{
                height: '120px',
                left: `${25 + i * 15}%`,
                top: '20px',
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s',
                transform: `rotate(${i * 15}deg)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Globe Info Display */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-100">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-gray-700">NASA Earth Observation</span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-1 text-blue-600">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-xs ml-1">Analyzing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlobe;
