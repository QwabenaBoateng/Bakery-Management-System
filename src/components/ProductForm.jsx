import { useState, useEffect } from 'react'

function ProductForm({ product, onSubmit, onCancel, inventory }) {
  const [formData, setFormData] = useState({
    productName: '',
    price: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        price: product.price || ''
      })
    } else {
      setFormData({
        productName: '',
        price: ''
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : parseFloat(value)) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.productName.trim()) {
      alert('Please enter a product name')
      return
    }
    if (formData.price === '' || formData.price <= 0) {
      alert('Please enter a valid price')
      return
    }

    const submissionData = {
      productName: formData.productName.trim(),
      price: parseFloat(formData.price)
    }

    onSubmit(submissionData)
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Sugar Bread"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (GH₵)
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
              placeholder="e.g., 5.00"
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
            {product ? 'Update' : 'Add'} Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
