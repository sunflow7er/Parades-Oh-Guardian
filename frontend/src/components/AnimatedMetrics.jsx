import React, { useState, useEffect } from 'react';

const AnimatedMetrics = ({ metrics, isLoading = false, coordinates = null }) => {
  const [animatedValues, setAnimatedValues] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (!metrics || isLoading) return;

    // Animate numbers from 0 to target values
    const animateValue = (key, targetValue, suffix = '') => {
      const startValue = 0;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: {
            value: currentValue,
            suffix,
            isComplete: progress === 1
          }
        }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    // Start animations for each metric
    if (metrics.temperature !== undefined) {
      animateValue('temperature', parseFloat(metrics.temperature), '°C');
    }
    if (metrics.humidity !== undefined) {
      animateValue('humidity', parseFloat(metrics.humidity), '%');
    }
    if (metrics.precipitation !== undefined) {
      animateValue('precipitation', parseFloat(metrics.precipitation), 'mm');
    }
    if (metrics.wind_speed !== undefined || metrics.windSpeed !== undefined) {
      animateValue('windSpeed', parseFloat(metrics.wind_speed || metrics.windSpeed), ' km/h');
    }
    if (metrics.pressure !== undefined) {
      animateValue('pressure', parseFloat(metrics.pressure), ' hPa');
    }
    if (metrics.visibility !== undefined) {
      animateValue('visibility', parseFloat(metrics.visibility), ' km');
    }

  }, [metrics, isLoading]);

  const getMetricIcon = (type) => {
    const icons = {
      temperature: '🌡️',
      humidity: '💧',
      precipitation: '🌧️',
      windSpeed: '💨',
      pressure: '📊',
      visibility: '👁️',
      latitude: '🌍',
      longitude: '🗺️'
    };
    return icons[type] || '📊';
  };

  const getMetricColor = (type, value) => {
    switch (type) {
      case 'temperature':
        if (value < 0) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (value < 15) return 'text-cyan-600 bg-cyan-50 border-cyan-200';
        if (value < 25) return 'text-green-600 bg-green-50 border-green-200';
        if (value < 35) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
      
      case 'humidity':
        if (value < 30) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (value < 70) return 'text-green-600 bg-green-50 border-green-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
      
      case 'precipitation':
        if (value === 0) return 'text-gray-600 bg-gray-50 border-gray-200';
        if (value < 2) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (value < 10) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
      
      case 'windSpeed':
        if (value < 10) return 'text-green-600 bg-green-50 border-green-200';
        if (value < 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (value < 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
      
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatDisplayValue = (type, animatedValue) => {
    if (!animatedValue) return '0';
    
    const { value, suffix, isComplete } = animatedValue;
    
    if (type === 'latitude' || type === 'longitude') {
      return `${value?.toFixed(4) || '0.0000'}°`;
    }
    
    const displayValue = isComplete ? 
      (Math.round(value * 100) / 100).toString() : 
      Math.round(value).toString();
    
    return `${displayValue}${suffix || ''}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metricItems = [
    { key: 'temperature', label: 'Temperature' },
    { key: 'humidity', label: 'Humidity' },
    { key: 'precipitation', label: 'Precipitation' },
    { key: 'windSpeed', label: 'Wind Speed' },
    { key: 'pressure', label: 'Pressure' },
    { key: 'visibility', label: 'Visibility' },
  ];

  // Add coordinate metrics if available
  if (coordinates) {
    metricItems.push(
      { key: 'latitude', label: 'Latitude', value: coordinates.lat },
      { key: 'longitude', label: 'Longitude', value: coordinates.lng }
    );
  }

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {metricItems.map((item, index) => {
          const metricValue = item.value !== undefined ? item.value : metrics?.[item.key];
          const animatedValue = animatedValues[item.key];
          const hasValue = metricValue !== undefined && metricValue !== null;
          
          if (!hasValue && !animatedValue) return null;

          const colorClasses = getMetricColor(item.key, metricValue || animatedValue?.value || 0);

          return (
            <div
              key={item.key}
              className={`
                bg-white rounded-xl p-6 border-2 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl
                transform ${colorClasses}
              `}
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl animate-pulse">
                  {getMetricIcon(item.key)}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-current transition-all duration-300">
                  {item.key === 'latitude' || item.key === 'longitude' 
                    ? formatDisplayValue(item.key, { value: metricValue, isComplete: true })
                    : formatDisplayValue(item.key, animatedValue) || `${metricValue || 0}${
                        item.key === 'temperature' ? '°C' :
                        item.key === 'humidity' ? '%' :
                        item.key === 'precipitation' ? 'mm' :
                        item.key === 'windSpeed' ? ' km/h' :
                        item.key === 'pressure' ? ' hPa' :
                        item.key === 'visibility' ? ' km' : ''
                      }`
                  }
                </div>
                <div className="text-sm font-medium opacity-80">
                  {item.label}
                </div>
                
                {/* Animated Progress Bar for non-coordinate metrics */}
                {item.key !== 'latitude' && item.key !== 'longitude' && (
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-current transition-all duration-1000 rounded-full"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 
                          item.key === 'temperature' ? Math.max(0, (metricValue + 20) * 2) :
                          item.key === 'humidity' ? metricValue :
                          item.key === 'precipitation' ? Math.min(100, metricValue * 10) :
                          item.key === 'windSpeed' ? Math.min(100, metricValue * 2.5) :
                          item.key === 'pressure' ? Math.min(100, (metricValue - 950) * 2) :
                          item.key === 'visibility' ? Math.min(100, metricValue * 10) :
                          50
                        ))}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedMetrics;
