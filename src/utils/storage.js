// Storage utility functions for the Bakery Management System

// Get current month key in format YYYY-MM
export function getCurrentMonthKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// Format month key for display (e.g., "2024-11" -> "November 2024")
export function formatMonthKey(monthKey) {
  const [year, month] = monthKey.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Generate list of month options (current month + 11 previous months)
export function generateMonthOptions() {
  const options = []
  const now = new Date()
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`
    options.push({
      key,
      label: formatMonthKey(key)
    })
  }
  
  return options
}

// Get all available months from localStorage
export function getAvailableMonths() {
  const months = new Set()
  
  // Check for inventory data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('inventory_') || key.startsWith('products_') || 
        key.startsWith('inventory_expenses_') || key.startsWith('daily_production_')) {
      const monthKey = key.split('_').pop()
      if (monthKey.match(/^\d{4}-\d{2}$/)) {
        months.add(monthKey)
      }
    }
  }
  
  return Array.from(months).sort().reverse()
}

// Inventory functions
export function loadInventory(monthKey = getCurrentMonthKey()) {
  const key = `inventory_${monthKey}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}

export function saveInventory(inventory, monthKey = getCurrentMonthKey()) {
  const key = `inventory_${monthKey}`
  localStorage.setItem(key, JSON.stringify(inventory))
}

// Products functions
export function loadProducts(monthKey = getCurrentMonthKey()) {
  const key = `products_${monthKey}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}

export function saveProducts(products, monthKey = getCurrentMonthKey()) {
  const key = `products_${monthKey}`
  localStorage.setItem(key, JSON.stringify(products))
}

// Migrate old inventory data (if any exists without month key)
export function migrateOldInventory() {
  const oldInventory = localStorage.getItem('inventory')
  const oldProducts = localStorage.getItem('products')
  
  if (oldInventory && !localStorage.getItem(`inventory_${getCurrentMonthKey()}`)) {
    localStorage.setItem(`inventory_${getCurrentMonthKey()}`, oldInventory)
    localStorage.removeItem('inventory')
  }
  
  if (oldProducts && !localStorage.getItem(`products_${getCurrentMonthKey()}`)) {
    localStorage.setItem(`products_${getCurrentMonthKey()}`, oldProducts)
    localStorage.removeItem('products')
  }
}

// Onboarding functions
export function hasCompletedOnboarding() {
  return localStorage.getItem('onboarding_completed') === 'true'
}

export function setOnboardingCompleted() {
  localStorage.setItem('onboarding_completed', 'true')
}

// Login functions
export function isLoggedIn() {
  return localStorage.getItem('is_logged_in') === 'true'
}

export function setLoggedIn(username) {
  localStorage.setItem('is_logged_in', 'true')
  localStorage.setItem('current_user', username)
}

export function setLoggedOut() {
  localStorage.setItem('is_logged_in', 'false')
  localStorage.removeItem('current_user')
}

export function getCurrentUser() {
  return localStorage.getItem('current_user') || ''
}
