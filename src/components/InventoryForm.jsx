import { useState, useEffect } from 'react'

function InventoryForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        price: item.price || ''
      })
    } else {
      setFormData({
        name: '',
        price: ''
      })
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price'
        ? (value === '' ? '' : parseFloat(value)) 
        : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter an item name')
      return
    }
    if (formData.price === '' || formData.price <= 0) {
      alert('Please enter a valid price')
      return
    }

    const submissionData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price)
    }

    if (item && item.price !== submissionData.price) {
      submissionData.priceChanged = true
      submissionData.oldPrice = item.price
    }

    onSubmit(submissionData)
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Organic Flour"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price per Unit (GH₵)
              {item && item.price && formData.price !== item.price && (
                <span className="ml-2 text-xs text-orange-600">
                  (Previous: GH₵{item.price.toFixed(2)})
                </span>
              )}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 15.50"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {item ? 'Update' : 'Add'} Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default InventoryForm
