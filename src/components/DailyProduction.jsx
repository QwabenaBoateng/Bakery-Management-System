import { useState, useEffect } from 'react'

function DailyProduction({ products, currentMonth }) {
  const [productionData, setProductionData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ productId: '', quantity: '', leftover: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    const saved = localStorage.getItem(`daily_production_${currentMonth}`)
    if (saved) {
      setProductionData(JSON.parse(saved))
    } else {
      setProductionData([])
    }
  }, [currentMonth])

  useEffect(() => {
    if (productionData.length > 0) {
      localStorage.setItem(`daily_production_${currentMonth}`, JSON.stringify(productionData))
    }
  }, [productionData, currentMonth])

  const handleSubmit = (e) => {
    e.preventDefault()
    const product = products.find(p => p.id === formData.productId)
    if (!product) return

    const entry = {
      id: Date.now().toString(),
      productId: formData.productId,
      productName: product.productName,
      pricePerUnit: product.price,
      quantity: parseInt(formData.quantity),
      leftover: parseInt(formData.leftover) || 0,
      date: formData.date,
      sold: parseInt(formData.quantity) - (parseInt(formData.leftover) || 0),
      expectedRevenue: parseInt(formData.quantity) * product.price,
      actualRevenue: (parseInt(formData.quantity) - (parseInt(formData.leftover) || 0)) * product.price
    }

    setProductionData([...productionData, entry])
    setFormData({ productId: '', quantity: '', leftover: '', date: new Date().toISOString().split('T')[0] })
    setIsFormOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry?')) {
      setProductionData(productionData.filter(e => e.id !== id))
    }
  }

  const totalExpectedRevenue = productionData.reduce((sum, e) => sum + e.expectedRevenue, 0)
  const totalActualRevenue = productionData.reduce((sum, e) => sum + e.actualRevenue, 0)
  const totalQuantityMade = productionData.reduce((sum, e) => sum + e.quantity, 0)
  const totalQuantitySold = productionData.reduce((sum, e) => sum + e.sold, 0)
  const totalLeftover = productionData.reduce((sum, e) => sum + e.leftover, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Daily Production & Revenue</h2>
        <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Add Production Entry</button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Add Daily Production</h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product (Type of Bread)</label>
                <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select a product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.productName} - GH₵{p.price.toFixed(2)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity Made Today</label>
                <input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" 
                  min="0" 
                  placeholder="e.g., 100"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Leftover at End of Day</label>
                <input 
                  type="number" 
                  value={formData.leftover} 
                  onChange={(e) => setFormData({...formData, leftover: e.target.value})} 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" 
                  min="0" 
                  placeholder="e.g., 5"
                />
                <p className="mt-1 text-xs text-gray-500">Enter quantity not sold (optional)</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-2 sm:px-3 text-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              
              {formData.productId && formData.quantity && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Revenue Preview</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="text-gray-700">
                      Expected Revenue: <span className="font-semibold text-green-600">
                        GH₵{(formData.quantity * (products.find(p => p.id === formData.productId)?.price || 0)).toFixed(2)}
                      </span>
                    </p>
                    {formData.leftover && (
                      <p className="text-gray-700">
                        Actual Revenue: <span className="font-semibold text-blue-600">
                          GH₵{((formData.quantity - (formData.leftover || 0)) * (products.find(p => p.id === formData.productId)?.price || 0)).toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Monthly Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white p-3 sm:p-5 rounded-lg shadow">
            <dt className="text-xs sm:text-sm text-gray-500">Total Made</dt>
            <dd className="text-lg sm:text-2xl font-semibold text-gray-900">{totalQuantityMade}</dd>
          </div>
          <div className="bg-white p-3 sm:p-5 rounded-lg shadow">
            <dt className="text-xs sm:text-sm text-gray-500">Total Sold</dt>
            <dd className="text-lg sm:text-2xl font-semibold text-blue-600">{totalQuantitySold}</dd>
          </div>
          <div className="bg-white p-3 sm:p-5 rounded-lg shadow">
            <dt className="text-xs sm:text-sm text-gray-500">Expected</dt>
            <dd className="text-base sm:text-2xl font-semibold text-green-600">GH₵{totalExpectedRevenue.toFixed(2)}</dd>
          </div>
          <div className="bg-white p-3 sm:p-5 rounded-lg shadow">
            <dt className="text-xs sm:text-sm text-gray-500">Actual</dt>
            <dd className="text-base sm:text-2xl font-semibold text-blue-600">GH₵{totalActualRevenue.toFixed(2)}</dd>
          </div>
        </div>
        {totalLeftover > 0 && (
          <div className="mt-3 sm:mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-orange-800">
              <span className="font-semibold">Total Leftover:</span> {totalLeftover} units 
              <span className="ml-2">({((totalLeftover / totalQuantityMade) * 100).toFixed(1)}%)</span>
            </p>
          </div>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Daily Production Records</h3>

      {productionData.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-900">No production entries</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Click "Add Production Entry" to record daily production</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-md overflow-hidden">
          <ul className="divide-y">
            {productionData.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => (
              <li key={entry.id} className="p-3 sm:p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <p className="font-medium text-sm sm:text-base text-gray-900">{entry.productName}</p>
                      <span className="text-xs text-gray-500">• {new Date(entry.date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500">Made:</span>
                        <span className="ml-1 font-medium text-gray-900">{entry.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sold:</span>
                        <span className="ml-1 font-medium text-blue-600">{entry.sold}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Leftover:</span>
                        <span className="ml-1 font-medium text-orange-600">{entry.leftover}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-1 font-medium text-gray-900">GH₵{entry.pricePerUnit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="flex gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Expected</p>
                        <p className="text-sm font-semibold text-green-600">GH₵{entry.expectedRevenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Actual</p>
                        <p className="text-base sm:text-lg font-semibold text-blue-600">GH₵{entry.actualRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(entry.id)} className="text-xs sm:text-sm text-red-600 hover:text-red-800 underline whitespace-nowrap">Delete</button>
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

export default DailyProduction
