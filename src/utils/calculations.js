// Calculation utility functions

// Note: Stock-based calculations removed as inventory no longer tracks stock levels
// Inventory now focuses on expense tracking instead of stock management

// Format currency for display (Ghanaian Cedis)
export function formatCurrency(amount) {
  return `GH₵${amount.toFixed(2)}`
}

// Calculate total expenses from expense array
export function calculateTotalExpenses(expenses) {
  return expenses.reduce((total, expense) => total + (expense.totalCost || 0), 0)
}

// Calculate total revenue from production data
export function calculateTotalRevenue(productionData) {
  return productionData.reduce((total, entry) => total + (entry.actualRevenue || 0), 0)
}

// Calculate expected vs actual revenue difference
export function calculateRevenueDifference(productionData) {
  const expected = productionData.reduce((total, entry) => total + (entry.expectedRevenue || 0), 0)
  const actual = productionData.reduce((total, entry) => total + (entry.actualRevenue || 0), 0)
  return {
    expected,
    actual,
    difference: expected - actual
  }
}

// Group expenses by inventory item
export function groupExpensesByItem(expenses) {
  const grouped = {}
  
  expenses.forEach(expense => {
    const itemName = expense.inventoryItemName
    if (!grouped[itemName]) {
      grouped[itemName] = {
        name: itemName,
        totalQuantity: 0,
        totalCost: 0,
        entries: []
      }
    }
    grouped[itemName].totalQuantity += expense.quantity
    grouped[itemName].totalCost += expense.totalCost
    grouped[itemName].entries.push(expense)
  })
  
  return Object.values(grouped)
}

// Calculate profit margin
export function calculateProfit(revenue, expenses) {
  return {
    revenue,
    expenses,
    profit: revenue - expenses,
    margin: revenue > 0 ? ((revenue - expenses) / revenue * 100) : 0
  }
}
