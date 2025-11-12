import { useState } from 'react'
import ProductForm from './ProductForm'
import DailyProduction from './DailyProduction'

function ProductList({ products, inventory, onAdd, onUpdate, onDelete, currentMonth }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('products')

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      onUpdate(editingProduct.id, productData)
      setEditingProduct(null)
    } else {
      onAdd(productData)
    }
    setIsFormOpen(false)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('products')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
              Product Management
            </button>
            <button onClick={() => setActiveTab('daily')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'daily' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
              Daily Production & Revenue
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'daily' ? (
        <DailyProduction products={products} currentMonth={currentMonth} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            <button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add New Product
            </button>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={handleFormCancel} inventory={inventory} />
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{product.productName}</h3>
                      <p className="text-sm text-gray-700 mt-2">Price: <strong>GH₵{(product.price || 0).toFixed(2)}</strong> per piece</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductList
