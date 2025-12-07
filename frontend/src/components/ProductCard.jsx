import React from 'react'

export default function ProductCard({ product, onView }) {
  return (
    <div className="card" role="article">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="small-muted">{product.category}</div>
      <p>{product.short_desc}</p>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>₹{product.price}</strong>
        <button onClick={onView}>View</button>
      </div>
    </div>
  )
}
