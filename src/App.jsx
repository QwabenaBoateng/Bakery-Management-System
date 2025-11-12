import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import InventoryList from './components/InventoryList'
import ProductList from './components/ProductList'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import { 
  loadInventory, 
  saveInventory, 
  loadProducts, 
  saveProducts,
  getCurrentMonthKey,
  getAvailableMonths,
  generateMonthOptions,
  formatMonthKey,
  migrateOldInventory,
  hasCompletedOnboarding,
  setOnboardingCompleted,
  isLoggedIn,
  setLoggedIn,
  setLoggedOut,
  getCurrentUser
} from './utils/storage'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey())
  const [monthOptions, setMonthOptions] = useState(generateMonthOptions())
  const [availableMonths, setAvailableMonths] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Migrate old inventory and load data on mount
  useEffect(() => {
    migrateOldInventory()
    const months = getAvailableMonths()
    setAvailableMonths(months)
    setMonthOptions(generateMonthOptions())
    
    // Check authentication status
    const loggedIn = isLoggedIn()
    setIsAuthenticated(loggedIn)
    
    if (loggedIn) {
      setUser(getCurrentUser())
      // User is logged in, don't show onboarding or login
      setShowOnboarding(false)
      setShowLogin(false)
    } else {
      // User is not logged in
      // Check if onboarding has been completed first
      const onboardingCompleted = hasCompletedOnboarding()
      if (!onboardingCompleted) {
        // Show onboarding first
        setShowOnboarding(true)
        setShowLogin(false)
      } else {
        // Onboarding is complete, show login
        setShowOnboarding(false)
        setShowLogin(true)
      }
    }
  }, [])

  // Load inventory for current month whenever it changes (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const savedInventory = loadInventory(currentMonth)
      setInventory(savedInventory)
    }
  }, [currentMonth, isAuthenticated])

  // Load products on mount (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const savedProducts = loadProducts()
      setProducts(savedProducts)
    }
  }, [isAuthenticated])

  // Save inventory to localStorage whenever it changes (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      saveInventory(inventory, currentMonth)
      // Update available months list
      const months = getAvailableMonths()
      setAvailableMonths(months)
    }
  }, [inventory, currentMonth, isAuthenticated])

  // Save products to localStorage whenever they change (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      if (products.length > 0 || localStorage.getItem('products')) {
        saveProducts(products)
      }
    }
  }, [products, isAuthenticated])

  // Handle month change
  const handleMonthChange = (monthKey) => {
    setCurrentMonth(monthKey)
  }

  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      priceHistory: [{
        price: item.price,
        date: new Date().toISOString(),
        month: currentMonth
      }]
    }
    setInventory([...inventory, newItem])
  }

  const updateInventoryItem = (id, updatedItem) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const updated = { ...updatedItem, id }
        
        // Track price changes
        if (updatedItem.priceChanged) {
          const priceHistory = item.priceHistory || []
          updated.priceHistory = [
            ...priceHistory,
            {
              price: updatedItem.price,
              oldPrice: updatedItem.oldPrice,
              date: new Date().toISOString(),
              month: currentMonth
            }
          ]
          delete updated.priceChanged
          delete updated.oldPrice
        } else {
          updated.priceHistory = item.priceHistory || []
        }
        
        return updated
      }
      return item
    }))
  }

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => 
      product.id === id ? { ...updatedProduct, id } : product
    ))
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setOnboardingCompleted()
    setShowOnboarding(false)
    // Show login after onboarding
    setShowLogin(true)
  }

  // Handle login
  const handleLogin = (username) => {
    setLoggedIn(username)
    setUser(username)
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  // Handle logout
  const handleLogout = () => {
    setLoggedOut()
    setUser(null)
    setIsAuthenticated(false)
    setShowLogin(true)
  }

  // Prevent body scroll when onboarding or login is shown
  useEffect(() => {
    if (showOnboarding || showLogin) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showOnboarding, showLogin])

  // Show onboarding first if not completed
  if (showOnboarding) {
    return (
      <div>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // Show login page if not authenticated but onboarding is complete
  if (showLogin && !isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Show main app only if authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:h-16">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">🥖 Bakery Inventory</h1>
              </div>
              {/* Mobile logout button */}
              <button
                onClick={handleLogout}
                className="sm:hidden inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile navigation */}
            <div className="flex sm:hidden border-t border-gray-200">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex-1 py-2 text-xs font-medium border-b-2 ${
                  activeView === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('inventory')}
                className={`flex-1 py-2 text-xs font-medium border-b-2 ${
                  activeView === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveView('products')}
                className={`flex-1 py-2 text-xs font-medium border-b-2 ${
                  activeView === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Products
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeView === 'dashboard'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView('inventory')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeView === 'inventory'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setActiveView('products')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeView === 'products'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Products
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
              {/* Month Selector */}
              <div className="flex items-center">
                <label htmlFor="month-select" className="mr-2 text-xs lg:text-sm font-medium text-gray-700 hidden lg:block">
                  Month:
                </label>
                <select
                  id="month-select"
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="block w-32 lg:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs lg:text-sm py-1"
                >
                  {monthOptions.map((option) => {
                    const monthKey = option.key
                    const hasInventory = availableMonths.includes(monthKey)
                    const currentMonthKey = getCurrentMonthKey()
                    const isCurrent = monthKey === currentMonthKey
                    return (
                      <option key={monthKey} value={monthKey}>
                        {option.label}
                        {isCurrent && ' (Current)'}
                        {!hasInventory && !isCurrent && ' (No data)'}
                      </option>
                    )
                  })}
                </select>
              </div>
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className="text-xs lg:text-sm text-gray-700 hidden lg:inline">Welcome, <strong>{user}</strong></span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 border border-transparent text-xs lg:text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Month Selector */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-2">
        <label htmlFor="mobile-month-select" className="block text-xs font-medium text-gray-700 mb-1">
          Select Month:
        </label>
        <select
          id="mobile-month-select"
          value={currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
        >
          {monthOptions.map((option) => {
            const monthKey = option.key
            const hasInventory = availableMonths.includes(monthKey)
            const currentMonthKey = getCurrentMonthKey()
            const isCurrent = monthKey === currentMonthKey
            return (
              <option key={monthKey} value={monthKey}>
                {option.label}
                {isCurrent && ' (Current)'}
                {!hasInventory && !isCurrent && ' (No data)'}
              </option>
            )
          })}
        </select>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-6 lg:px-8">
        {/* Month Display */}
        <div className="mb-4 px-4 sm:px-0">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-blue-700">
                  Viewing inventory for <strong>{formatMonthKey(currentMonth)}</strong>
                  {currentMonth === getCurrentMonthKey() && (
                    <span className="ml-2 text-xs text-blue-600">(Current Month)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <Dashboard inventory={inventory} products={products} currentMonth={currentMonth} />
        )}
        {activeView === 'inventory' && (
          <InventoryList
            inventory={inventory}
            onAdd={addInventoryItem}
            onUpdate={updateInventoryItem}
            onDelete={deleteInventoryItem}
            currentMonth={currentMonth}
          />
        )}
        {activeView === 'products' && (
          <ProductList
            products={products}
            inventory={inventory}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            currentMonth={currentMonth}
          />
        )}
      </main>
    </div>
  )
}

export default App

