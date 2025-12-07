import React, { useState } from 'react'
import ProductList from './components/ProductList'
import AdminEnquiries from './components/AdminEnquiries'

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div className="container">
      <div className="header">
        <h1>Product Showcase</h1>
        <div>
          <button onClick={() => setShowAdmin(!showAdmin)} style={{background:'#111', marginLeft:8}}>
            {showAdmin ? 'Back to Shop' : 'Admin'}
          </button>
        </div>
      </div>

      {showAdmin ? <AdminEnquiries /> : <ProductList />}
    </div>
  )
}
