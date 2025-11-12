import { useState } from 'react'
import InventoryForm from './InventoryForm'
import InventoryExpenses from './InventoryExpenses'

function InventoryList({ inventory, onAdd, onUpdate, onDelete, currentMonth }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('inventory')

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (itemData) => {
    if (editingItem) {
      onUpdate(editingItem.id, itemData)
      setEditingItem(null)
    } else {
      onAdd(itemData)
    }
    setIsFormOpen(false)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('inventory')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
              Inventory Items
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
              Expenses & Purchases
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'expenses' ? (
        <InventoryExpenses inventory={inventory} currentMonth={currentMonth} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
            <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add New Item
            </button>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <InventoryForm item={editingItem} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
              </div>
            </div>
          )}

          {inventory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new inventory item.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price per Unit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GH₵{(item.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InventoryList
