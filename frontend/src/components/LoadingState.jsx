import { Satellite, Database, BarChart } from 'lucide-react'

const LoadingState = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Satellite className="w-16 h-16 text-blue-600 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Analyzing NASA Satellite Data
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Crunching 20 years of historical weather patterns to find your perfect weather windows...
      </p>
      
      {/* Loading Steps */}
      <div className="space-y-4 max-w-sm mx-auto">
        <LoadingStep 
          icon={Satellite}
          text="Fetching NASA POWER API data"
          completed={true}
        />
        <LoadingStep 
          icon={Database}
          text="Processing 20 years of weather records"
          completed={false}
          active={true}
        />
        <LoadingStep 
          icon={BarChart}
          text="Calculating weather risk probabilities"
          completed={false}
          active={false}
        />
      </div>
      
      {/* Progress Bar */}
      <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse w-2/3 transition-all duration-1000"></div>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        This may take a few moments while we analyze thousands of data points...
      </p>
    </div>
  )
}

const LoadingStep = ({ icon: Icon, text, completed, active }) => {
  return (
    <div className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
      completed ? 'bg-green-50' : active ? 'bg-blue-50' : 'bg-gray-50'
    }`}>
      <div className={`p-2 rounded-full mr-3 ${
        completed ? 'bg-green-100' : active ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <Icon className={`w-4 h-4 ${
          completed ? 'text-green-600' : active ? 'text-blue-600 animate-spin' : 'text-gray-400'
        }`} />
      </div>
      <span className={`text-sm ${
        completed ? 'text-green-700' : active ? 'text-blue-700' : 'text-gray-500'
      }`}>
        {text}
      </span>
      {completed && (
        <div className="ml-auto">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingState