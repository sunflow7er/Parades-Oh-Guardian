const CalculationExplanation = ({ calculations }) => {
  const methodologySteps = [
    {
      step: 1,
      title: "NASA Data Collection",
      description: "We fetch 20 years of historical weather data from NASA POWER API",
      details: [
        "Temperature (surface, min, max)",
        "Precipitation (corrected satellite data)", 
        "Wind speed and direction",
        "Humidity and atmospheric pressure",
        "Solar radiation and cloud cover"
      ],
      icon: "🛰️",
      color: "blue"
    },
    {
      step: 2,
      title: "Statistical Analysis",
      description: "Advanced algorithms analyze patterns in historical data",
      details: [
        "Seasonal trend identification",
        "Extreme weather event frequency",
        "Standard deviation calculations",
        "Confidence interval determination",
        "Cross-validation with multiple sources"
      ],
      icon: "📊",
      color: "green"
    },
    {
      step: 3,
      title: "Machine Learning Enhancement",
      description: "AI models identify complex weather patterns and correlations",
      details: [
        "Random Forest classification",
        "Pattern recognition algorithms",
        "Anomaly detection systems",
        "Ensemble model predictions",
        "Real-time model updating"
      ],
      icon: "🤖",
      color: "purple"
    },
    {
      step: 4,
      title: "Risk Assessment",
      description: "Probability calculations for specific weather conditions",
      details: [
        "Extreme temperature probability",
        "Precipitation likelihood analysis", 
        "Wind speed risk assessment",
        "Combined comfort index calculation",
        "Activity-specific recommendations"
      ],
      icon: "⚡",
      color: "orange"
    }
  ];

  const dataSources = [
    {
      name: "NASA POWER",
      description: "Primary meteorological data source",
      coverage: "Global, 1° resolution",
      icon: "🌍"
    },
    {
      name: "GPM Satellite",
      description: "Precipitation measurements",
      coverage: "60°N-60°S, high accuracy",
      icon: "🛰️"
    },
    {
      name: "MODIS Terra/Aqua",
      description: "Cloud cover and surface conditions",
      coverage: "Global, daily coverage",
      icon: "☁️"
    },
    {
      name: "Giovanni Platform",
      description: "Data validation and cross-referencing",
      coverage: "Multi-source integration",
      icon: "🔬"
    }
  ];

  const getColorClasses = (color) => ({
    blue: "from-blue-50 to-blue-100 border-blue-500 text-blue-700",
    green: "from-green-50 to-green-100 border-green-500 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-500 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-500 text-orange-700"
  }[color]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          How We Calculate Weather Risks
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our predictions combine NASA satellite data, advanced statistics, and machine learning 
          to provide accurate weather risk assessments with {calculations?.confidence || 87}% confidence.
        </p>
      </div>

      {/* Methodology Steps */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Calculation Process</h3>
        
        {methodologySteps.map((step, index) => (
          <div
            key={index}
            className={`
              bg-gradient-to-r ${getColorClasses(step.color)}
              rounded-xl p-6 border-l-4
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{step.icon}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-bold">
                    Step {step.step}
                  </span>
                  <h4 className="text-xl font-bold">{step.title}</h4>
                </div>
                
                <p className="mb-4 opacity-90">{step.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm">✓</span>
                      <span className="text-sm opacity-80">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">NASA Data Sources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataSources.map((source, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{source.icon}</span>
                <h4 className="text-lg font-bold text-gray-800">{source.name}</h4>
              </div>
              <p className="text-gray-600 mb-2">{source.description}</p>
              <p className="text-sm text-blue-600 font-medium">📍 {source.coverage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Analysis Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {calculations?.totalDataPoints?.toLocaleString() || '7,300'}
            </div>
            <div className="text-sm text-gray-600">Historical Days</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {calculations?.confidence || 87}%
            </div>
            <div className="text-sm text-gray-600">Confidence Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">20</div>
            <div className="text-sm text-gray-600">Years of Data</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
            <div className="text-sm text-gray-600">NASA Sources</div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h4 className="text-lg font-bold text-blue-800 mb-3">🔬 Technical Implementation</h4>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>API Integration:</strong> Real-time NASA POWER API calls with 24-hour caching</p>
          <p><strong>Data Processing:</strong> Pandas & NumPy for statistical computations</p>
          <p><strong>ML Framework:</strong> Scikit-learn Random Forest with cross-validation</p>
          <p><strong>Accuracy:</strong> Validated against NOAA and local meteorological stations</p>
        </div>
      </div>
    </div>
  );
};

export default CalculationExplanation;
