import React, { useEffect, useState } from 'react'
import { fetchProduct } from '../api'
import EnquiryForm from './EnquiryForm'

export default function ProductModal({ id, onClose }){
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(()=>{
    setLoading(true)
    fetchProduct(id).then(p => setProduct(p)).catch(()=>alert('Failed')).finally(()=>setLoading(false))
  }, [id])

  if (!product && loading) return <div className="modal"><div className="modal-inner">Loading...</div></div>

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-inner" onClick={e=>e.stopPropagation()}>
        <button style={{float:'right'}} onClick={onClose}>Close</button>
        <div style={{display:'flex', gap:12}}>
          <img src={product.image_url} alt={product.name} style={{width:300, height:220, objectFit:'cover', borderRadius:6}}/>
          <div>
            <h2>{product.name}</h2>
            <div className="small-muted">{product.category}</div>
            <p>{product.long_desc || product.short_desc}</p>
            <strong>₹{product.price}</strong>
            <div style={{marginTop:12}}>
              <button onClick={()=>setShowForm(s=>!s)}>{showForm ? 'Hide' : 'Enquire'}</button>
            </div>
          </div>
        </div>

        {showForm && <div style={{marginTop:12}}>
          <EnquiryForm productId={product.id} onSuccess={()=>{ alert('Enquiry sent'); setShowForm(false) }} />
        </div>}
      </div>
    </div>
  )
}
