import React from 'react';
import { 
  Globe, 
  BarChart3, 
  Calendar, 
  Brain, 
  Target, 
  MapPin,
  Database,
  Zap
} from 'lucide-react';

const TabbedInterface = ({ 
  children, 
  activeTab, 
  setActiveTab,
  location,
  results,
  hasData 
}) => {
  const tabs = [
    {
      id: 'overview',
      name: 'Weather Overview',
      icon: Globe,
      description: 'Current conditions & animated globe',
      enabled: true
    },
    {
      id: 'risk',
      name: 'Risk Analysis',
      icon: Target,
      description: '5 NASA challenge conditions',
      enabled: hasData
    },
    {
      id: 'historical',
      name: 'Historical Trends',
      icon: BarChart3,
      description: '20-year climate patterns',
      enabled: !!location
    },
    {
      id: 'alternatives',
      name: 'Date Finder',
      icon: Calendar,
      description: 'Alternative weather windows',
      enabled: !!location
    },
    {
      id: 'ml',
      name: 'AI Patterns',
      icon: Brain,
      description: 'Machine learning insights',
      enabled: true
    },
    {
      id: 'enhanced',
      name: 'Advanced Tools',
      icon: Zap,
      description: 'Enhanced location & features',
      enabled: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isEnabled = tab.enabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => isEnabled && setActiveTab(tab.id)}
                disabled={!isEnabled}
                className={`
                  flex items-center gap-3 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : isEnabled 
                      ? 'border-transparent hover:border-gray-300 hover:bg-gray-50 text-gray-600' 
                      : 'border-transparent text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : isEnabled ? 'text-gray-500' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
                {!isEnabled && (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Tab Status Indicators */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active: {tabs.find(t => t.id === activeTab)?.name}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Available: {tabs.filter(t => t.enabled).length}/{tabs.length}
            </span>
          </div>
          
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Location: {location}</span>
            </div>
          )}
          
          {results && (
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>NASA Data: Connected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabbedInterface;