import { useState, useEffect } from 'react'

function InventoryExpenses({ inventory, currentMonth }) {
  const [expenses, setExpenses] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ inventoryItemId: '', quantity: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    const saved = localStorage.getItem(`inventory_expenses_${currentMonth}`)
    if (saved) {
      setExpenses(JSON.parse(saved))
    } else {
      setExpenses([])
    }
  }, [currentMonth])

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(`inventory_expenses_${currentMonth}`, JSON.stringify(expenses))
    }
  }, [expenses, currentMonth])

  const handleSubmit = (e) => {
    e.preventDefault()
    const item = inventory.find(i => i.id === formData.inventoryItemId)
    if (!item) return

    const expense = {
      id: Date.now().toString(),
      inventoryItemId: formData.inventoryItemId,
      inventoryItemName: item.name,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: item.price,
      totalCost: parseFloat(formData.quantity) * item.price,
      date: formData.date
    }

    setExpenses([...expenses, expense])
    setFormData({ inventoryItemId: '', quantity: '', date: new Date().toISOString().split('T')[0] })
    setIsFormOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalCost, 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Expenses</h2>
        <button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Add Expense</button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Add Expense Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Inventory Item</label>
                <select value={formData.inventoryItemId} onChange={(e) => setFormData({...formData, inventoryItemId: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select an item</option>
                  {inventory.map(i => <option key={i.id} value={i.id}>{i.name} - GH₵{i.price.toFixed(2)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity Purchased</label>
                <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" min="0.01" step="0.01" placeholder="e.g., 10" required />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              {formData.inventoryItemId && formData.quantity && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs sm:text-sm">Total Cost: <span className="font-semibold text-green-600">GH₵{(formData.quantity * (inventory.find(i => i.id === formData.inventoryItemId)?.price || 0)).toFixed(2)}</span></p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow mb-4 sm:mb-6">
        <dt className="text-xs sm:text-sm text-gray-500">Total Expenses</dt>
        <dd className="text-xl sm:text-2xl font-semibold text-red-600">GH₵{totalExpenses.toFixed(2)}</dd>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-900">No expenses recorded</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Click "Add Expense" to record purchases</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-md overflow-hidden">
          <ul className="divide-y">
            {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
              <li key={expense.id} className="p-3 sm:p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{expense.inventoryItemName}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Qty: {expense.quantity} × GH₵{expense.pricePerUnit.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(expense.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-semibold text-red-600">GH₵{expense.totalCost.toFixed(2)}</p>
                      <button onClick={() => handleDelete(expense.id)} className="text-xs sm:text-sm text-red-600 hover:text-red-800 underline mt-1">Delete</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default InventoryExpenses
