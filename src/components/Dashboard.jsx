function Dashboard({ inventory, products, currentMonth }) {
  const totalItems = inventory.length
  const totalProducts = products.length
  
  const loadExpenses = () => {
    try {
      const saved = localStorage.getItem(`inventory_expenses_${currentMonth}`)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      return []
    }
  }
  
  const loadProduction = () => {
    try {
      const saved = localStorage.getItem(`daily_production_${currentMonth}`)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      return []
    }
  }
  
  const loadPreviousMonthProduction = () => {
    try {
      const [year, month] = currentMonth.split('-')
      const prevMonth = parseInt(month) - 1
      const prevYear = prevMonth === 0 ? parseInt(year) - 1 : parseInt(year)
      const prevMonthStr = prevMonth === 0 ? '12' : String(prevMonth).padStart(2, '0')
      const prevMonthKey = `${prevYear}-${prevMonthStr}`
      const saved = localStorage.getItem(`daily_production_${prevMonthKey}`)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      return []
    }
  }
  
  const expenses = loadExpenses()
  const production = loadProduction()
  const previousProduction = loadPreviousMonthProduction()
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.totalCost, 0)
  const totalRevenue = production.reduce((sum, entry) => sum + entry.actualRevenue, 0)
  const profit = totalRevenue - totalExpenses
  const isProfitable = profit >= 0
  
  const currentMonthTotal = production.reduce((sum, entry) => sum + entry.quantity, 0)
  const previousMonthTotal = previousProduction.reduce((sum, entry) => sum + entry.quantity, 0)
  const productionChange = currentMonthTotal - previousMonthTotal
  const isIncreasing = productionChange >= 0
  
  // Pie chart helper function
  const createPieChart = (percentage, color1, color2) => {
    const degrees = (percentage / 100) * 360
    return {
      background: `conic-gradient(${color1} 0deg ${degrees}deg, ${color2} ${degrees}deg 360deg)`
    }
  }
  
  const profitPercentage = totalRevenue > 0 ? Math.min(100, Math.max(0, ((profit / totalRevenue) * 100))) : 0
  const productionGrowthPercentage = previousMonthTotal > 0 
    ? Math.min(100, Math.max(0, ((currentMonthTotal / previousMonthTotal) * 100))) 
    : (currentMonthTotal > 0 ? 100 : 50)
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">Welcome to your Bakery Inventory Management System</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Inventory Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Expenses</dt>
                  <dd className="text-lg font-medium text-red-600">GH₵{totalExpenses.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Section - Pie Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit/Loss Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit/Loss Analysis</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <div 
                className="w-full h-full rounded-full"
                style={createPieChart(
                  isProfitable ? profitPercentage : 100 - profitPercentage,
                  isProfitable ? '#10b981' : '#ef4444',
                  '#e5e7eb'
                )}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      {isProfitable ? '📈' : '📉'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {isProfitable ? 'Profit' : 'Loss'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-semibold text-green-600">GH₵{totalRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-xl font-semibold text-red-600">GH₵{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">Net {isProfitable ? 'Profit' : 'Loss'}</p>
                  <p className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                    GH₵{Math.abs(profit).toFixed(2)}
                  </p>
                </div>
                {totalRevenue > 0 && (
                  <p className="text-xs text-gray-500">
                    {isProfitable ? 'Profit' : 'Loss'} Margin: {((Math.abs(profit) / totalRevenue) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Production Trend */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Trend</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <div 
                className="w-full h-full rounded-full"
                style={createPieChart(
                  productionGrowthPercentage,
                  isIncreasing ? '#3b82f6' : '#f59e0b',
                  '#e5e7eb'
                )}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isIncreasing ? 'text-blue-600' : 'text-orange-600'}`}>
                      {isIncreasing ? '📊' : '📉'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {isIncreasing ? 'Growing' : 'Declining'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Current Month Production</p>
                  <p className="text-xl font-semibold text-blue-600">{currentMonthTotal} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previous Month Production</p>
                  <p className="text-xl font-semibold text-gray-600">{previousMonthTotal} units</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">Change</p>
                  <p className={`text-2xl font-bold ${isIncreasing ? 'text-blue-600' : 'text-orange-600'}`}>
                    {isIncreasing ? '+' : ''}{productionChange} units
                  </p>
                </div>
                {previousMonthTotal > 0 && (
                  <p className="text-xs text-gray-500">
                    {isIncreasing ? 'Growth' : 'Decline'}: {Math.abs(((productionChange / previousMonthTotal) * 100)).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Summary</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Inventory Items</dt>
              <dd className="mt-1 text-sm text-gray-900">{totalItems}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Products</dt>
              <dd className="mt-1 text-sm text-gray-900">{totalProducts}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Expenses</dt>
              <dd className="mt-1 text-sm font-medium text-red-600">GH₵{totalExpenses.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
