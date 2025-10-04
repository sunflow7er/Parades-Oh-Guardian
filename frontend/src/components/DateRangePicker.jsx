import { Calendar } from 'lucide-react'

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  
  const handleStartDateChange = (e) => {
    onChange({
      startDate: e.target.value,
      endDate: endDate
    })
  }
  
  const handleEndDateChange = (e) => {
    onChange({
      startDate: startDate,
      endDate: e.target.value
    })
  }
  
  // Helper to get min date (today) and max date (1 year from now)
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split('T')[0]
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Calendar className="w-4 h-4 inline mr-1" />
        Event Date Range
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            min={today}
            max={maxDateStr}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || today}
            max={maxDateStr}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Quick Date Range Presets */}
      <div className="flex flex-wrap gap-2 mt-3">
        <QuickDateButton 
          label="Next Week"
          onClick={() => {
            const start = new Date()
            start.setDate(start.getDate() + 7)
            const end = new Date(start)
            end.setDate(end.getDate() + 6)
            onChange({
              startDate: start.toISOString().split('T')[0],
              endDate: end.toISOString().split('T')[0]
            })
          }}
        />
        
        <QuickDateButton 
          label="Next Month"
          onClick={() => {
            const start = new Date()
            start.setMonth(start.getMonth() + 1)
            start.setDate(1)
            const end = new Date(start)
            end.setMonth(end.getMonth() + 1)
            end.setDate(0) // Last day of month
            onChange({
              startDate: start.toISOString().split('T')[0],
              endDate: end.toISOString().split('T')[0]
            })
          }}
        />
        
        <QuickDateButton 
          label="Summer 2025"
          onClick={() => {
            onChange({
              startDate: '2025-06-01',
              endDate: '2025-08-31'
            })
          }}
        />
      </div>
      
      {/* Date Range Summary */}
      {startDate && endDate && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <Calendar className="w-4 h-4 inline mr-1" />
          Analyzing {calculateDaysDifference(startDate, endDate)} days 
          from {formatDate(startDate)} to {formatDate(endDate)}
        </div>
      )}
    </div>
  )
}

const QuickDateButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
  >
    {label}
  </button>
)

const calculateDaysDifference = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

export default DateRangePicker