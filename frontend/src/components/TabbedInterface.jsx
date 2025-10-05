import React, { useState } from 'react';
import { 
  Globe, 
  BarChart3, 
  Calendar, 
  Brain, 
  Target, 
  TrendingUp,
  Activity,
  MapPin,
  Database,
  Zap,
  ExternalLink
} from 'lucide-react';
// Ensure Modal component is imported; if not existing, needs implementation elsewhere
import Modal from './Modal';

const TabbedInterface = ({ 
  children, 
  activeTab, 
  setActiveTab,
  location,
  results,
  hasData 
}) => {
  const [modalTab, setModalTab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (tabId) => {
    setModalTab(tabId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTab(null);
  };
  const tabs = [
    {
      id: 'overview',
      name: 'Weather Mine',
      icon: Globe,
      description: 'Current conditions & animated globe',
      emoji: '🌍',
      enabled: true
    },
    {
      id: 'risk',
      name: 'Risk Scanner',
      icon: Target,
      description: '5 NASA challenge conditions',
      emoji: '🎯', 
      enabled: hasData
    },
    {
      id: 'historical',
      name: 'Time Machine',
      icon: BarChart3,
      description: '20-year climate patterns',
      emoji: '📈',
      enabled: !!location
    },
    {
      id: 'alternatives',
      name: 'Date Crafter',
      icon: Calendar,
      description: 'Alternative weather windows',
      emoji: '🗓️',
      enabled: !!location
    },
    {
      id: 'ml',
      name: 'AI Brain',
      icon: Brain,
      description: 'Machine learning insights',
      emoji: '🤖',
      enabled: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-green-50 to-lime-50 border-b-2 border-green-800 minecraft-header">
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
                  flex items-center gap-3 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 group relative
                  ${isActive 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-lg' 
                    : isEnabled 
                      ? 'border-transparent hover:border-green-300 hover:bg-green-50 text-gray-600 hover:text-green-700' 
                      : 'border-transparent text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : isEnabled ? 'text-gray-500 group-hover:text-green-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    <span>{tab.name}</span>
                  </div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
                {isEnabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(tab.id);
                    }}
                    className="ml-2 w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Open in full window"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                {!isEnabled && (
                  <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
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
      <div className="bg-green-800 px-6 py-3 border-t-2 border-green-700 minecraft-footer">
        <div className="flex items-center justify-between text-xs text-green-100 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-lime-400 rounded-sm animate-pulse"></div>
              Active: {tabs.find(t => t.id === activeTab)?.name}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-sm"></div>
              Available: {tabs.filter(t => t.enabled).length}/{tabs.length} 🟩
            </span>
          </div>
          
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>📍 {location}</span>
            </div>
          )}
          
          {results && (
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>🛰️ NASA Mining Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Modal Windows */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={tabs.find(t => t.id === modalTab)?.name || 'Weather Tool'}
        icon={tabs.find(t => t.id === modalTab)?.icon}
        fullWidth={true}
      >
        <div className="minecraft-modal-content">
          {modalTab && children}
        </div>
      </Modal>
    </div>
  );
};

export default TabbedInterface;
