import { AlertTriangle, Shield, Info } from 'lucide-react';

const DisasterPredictionCard = ({ location, disasterRisks, seasonalPatterns }) => {
  const safeDisasterRisks = Array.isArray(disasterRisks) ? disasterRisks : [];
  const safeSeasonalPatterns = Array.isArray(seasonalPatterns) ? seasonalPatterns : [];
  const getDisasterIcon = (type) => {
    const icons = {
      flood: '🌊',
      drought: '🏜️',
      heatwave: '🔥',
      blizzard: '❄️',
      storm: '⛈️',
      earthquake: '🏔️',
      wildfire: '🔥'
    };
    return icons[type] || '⚠️';
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-full">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Natural Disaster Assessment
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered risk analysis for {location}
          </p>
        </div>
      </div>

      {/* Disaster Risks */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Potential Risks (Next 30 Days)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safeDisasterRisks.length === 0 && (
            <div className="text-sm text-gray-500 col-span-2">No disaster risk data available.</div>
          )}
          {safeDisasterRisks.map((risk, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getRiskColor(risk.level)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getDisasterIcon(risk.type)}</span>
                  <span className="font-medium capitalize">{risk.type}</span>
                </div>
                <span className="text-sm font-bold uppercase">
                  {risk.level} RISK
                </span>
              </div>
              <p className="text-xs opacity-80">{risk.description}</p>
              <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    risk.level === 'high' ? 'bg-red-500' :
                    risk.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${risk.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="border-t-2 border-gray-100 pt-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <Info className="w-4 h-4" />
          Seasonal Weather Patterns
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {safeSeasonalPatterns.length === 0 && (
            <div className="text-xs text-gray-500 col-span-4">No seasonal pattern data.</div>
          )}
          {safeSeasonalPatterns.map((season, index) => (
            <div
              key={index}
              className="text-center p-3 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg"
            >
              <div className="text-2xl mb-2">{season.icon}</div>
              <div className="text-sm font-medium text-gray-800">
                {season.name}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {season.commonEvents.map(event => (
                  <div key={event} className="flex items-center justify-center gap-1">
                    <span>{getDisasterIcon(event)}</span>
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
        <p className="text-sm text-red-700 font-medium">
          🚨 Emergency Preparedness Tip:
        </p>
        <p className="text-xs text-red-600 mt-1">
          Stay informed about local emergency services and have an evacuation plan ready.
          Download weather alert apps for real-time notifications.
        </p>
      </div>
    </div>
  );
};

export default DisasterPredictionCard;
