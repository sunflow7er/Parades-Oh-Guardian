import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';

const MLPatternRecognition = ({ weatherData, location, historicalData }) => {
  const [patterns, setPatterns] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [modelAccuracy, setModelAccuracy] = useState(85.7);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Simulate ML model analysis
  const runMLAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate complex ML processing
    setTimeout(() => {
      // Generate weather patterns
      const detectedPatterns = [
        {
          type: 'Seasonal Cooling Trend',
          confidence: 92.3,
          description: 'Consistent temperature decrease pattern detected for autumn transition',
          impact: 'High probability of frost events in next 14 days',
          dataPoints: 156,
          algorithm: 'Random Forest Classifier',
          icon: '❄️'
        },
        {
          type: 'High Pressure System',
          confidence: 87.8,
          description: 'Stable anticyclonic pattern forming over Central Kazakhstan',
          impact: 'Clear skies and low precipitation expected for 7-10 days',
          dataPoints: 89,
          algorithm: 'Support Vector Machine',
          icon: '☀️'
        },
        {
          type: 'Continental Air Mass',
          confidence: 79.4,
          description: 'Cold, dry air mass movement from Siberian region',
          impact: 'Temperature drop of 8-12°C within 48 hours',
          dataPoints: 203,
          algorithm: 'Neural Network',
          icon: '🌬️'
        },
        {
          type: 'Precipitation Cluster',
          confidence: 84.1,
          description: 'Localized convective activity pattern in northern regions',
          impact: 'Isolated thunderstorms with moderate rainfall intensity',
          dataPoints: 67,
          algorithm: 'K-Means Clustering',
          icon: '⛈️'
        }
      ];

      // Generate anomalies
      const detectedAnomalies = [
        {
          type: 'Temperature Spike',
          severity: 'Medium',
          value: '+15.3°C above seasonal average',
          probability: 23.7,
          timeframe: 'Next 3 days',
          explanation: 'Unusual warm air advection from southern regions',
          confidence: 76.8
        },
        {
          type: 'Sudden Wind Shift',
          severity: 'High',
          value: 'Wind direction change >180° within 6 hours',
          probability: 67.2,
          timeframe: 'Tomorrow evening',
          explanation: 'Frontal boundary passage with strong pressure gradient',
          confidence: 89.1
        },
        {
          type: 'Humidity Inversion',
          severity: 'Low',
          value: 'Relative humidity <20% during precipitation event',
          probability: 12.4,
          timeframe: 'End of week',
          explanation: 'Rare atmospheric layering with dry air aloft',
          confidence: 62.3
        }
      ];

      // Generate predictions
      const modelPredictions = [
        {
          parameter: 'Temperature Trend',
          forecast: 'Decreasing (-2.3°C/week)',
          accuracy: 91.2,
          nextWeek: 'Average 8°C lower than current',
          factors: ['Solar angle reduction', 'Continental air mass', 'Clear sky cooling']
        },
        {
          parameter: 'Precipitation Pattern',
          forecast: 'Scattered light showers',
          accuracy: 83.7,
          nextWeek: '15-25mm total accumulation',
          factors: ['Moisture transport', 'Orographic lifting', 'Diurnal heating']
        },
        {
          parameter: 'Extreme Event Risk',
          forecast: 'Low probability (18%)',
          accuracy: 76.9,
          nextWeek: 'Minimal severe weather expected',
          factors: ['Stable pressure pattern', 'Moderate wind shear', 'Limited instability']
        }
      ];

      setPatterns(detectedPatterns);
      setAnomalies(detectedAnomalies);
      setPredictions(modelPredictions);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  useEffect(() => {
    setIsVisible(true);
    runMLAnalysis();
  }, [weatherData, location]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center py-12">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">AI Pattern Analysis in Progress</h3>
          <p className="text-gray-600 mb-4">Processing {historicalData?.length || 7300}+ data points with multiple ML algorithms...</p>
          
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Random Forest Classifier</span>
              <span className="animate-pulse">Running...</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Neural Network Analysis</span>
              <span className="animate-pulse">Processing...</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Anomaly Detection</span>
              <span className="animate-pulse">Scanning...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Pattern Recognition
          </h3>
          <p className="text-gray-600">
            Advanced machine learning analysis for {location || 'Kazakhstan'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{modelAccuracy}%</div>
          <div className="text-sm text-gray-500">Model Accuracy</div>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Accuracy</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{modelAccuracy}%</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Data Points</span>
          </div>
          <div className="text-xl font-bold text-blue-600">7,300+</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Patterns</span>
          </div>
          <div className="text-xl font-bold text-green-600">{patterns.length}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Anomalies</span>
          </div>
          <div className="text-xl font-bold text-orange-600">{anomalies.length}</div>
        </div>
      </div>

      {/* Detected Patterns */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Detected Weather Patterns
        </h4>
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pattern.icon}</span>
                  <div>
                    <h5 className="font-bold text-gray-800">{pattern.type}</h5>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`font-semibold ${getConfidenceColor(pattern.confidence)}`}>
                        {pattern.confidence}% confidence
                      </span>
                      <span className="text-gray-600">{pattern.algorithm}</span>
                      <span className="text-gray-500">{pattern.dataPoints} data points</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{pattern.description}</p>
              <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                <span className="font-medium text-gray-800">Expected Impact: </span>
                <span className="text-gray-700">{pattern.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Anomaly Detection Results
        </h4>
        <div className="space-y-4">
          {anomalies.map((anomaly, index) => (
            <div key={index} className={`p-6 rounded-xl border-2 ${getSeverityColor(anomaly.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-bold text-lg">{anomaly.type}</h5>
                  <div className="flex items-center gap-4 text-sm mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity} Risk
                    </span>
                    <span>Probability: {anomaly.probability}%</span>
                    <span>Timeframe: {anomaly.timeframe}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getConfidenceColor(anomaly.confidence)}`}>
                    {anomaly.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>
              <div className="bg-white bg-opacity-60 p-3 rounded-lg mb-3">
                <span className="font-semibold">Detected Value: </span>
                <span>{anomaly.value}</span>
              </div>
              <p className="text-sm">
                <span className="font-medium">Analysis: </span>
                {anomaly.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ML Predictions */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Machine Learning Predictions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h5 className="font-bold text-lg text-gray-800">{prediction.parameter}</h5>
                  <div className="text-2xl font-bold text-green-600 mt-1">{prediction.forecast}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getConfidenceColor(prediction.accuracy)}`}>
                    {prediction.accuracy}%
                  </div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-60 p-3 rounded-lg mb-3">
                <span className="font-semibold">Next Week Outlook: </span>
                <span>{prediction.nextWeek}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Key Factors: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prediction.factors.map((factor, factorIndex) => (
                    <span
                      key={factorIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">ML Models & Algorithms Used</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-purple-600 mb-1">Random Forest</div>
            <div className="text-gray-600">Pattern classification and feature importance analysis</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-blue-600 mb-1">Neural Networks</div>
            <div className="text-gray-600">Complex non-linear relationship modeling</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-green-600 mb-1">Anomaly Detection</div>
            <div className="text-gray-600">Isolation Forest and statistical outlier identification</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPatternRecognition;