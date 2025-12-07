import React, { useState } from 'react'
import { postEnquiry } from '../api'

export default function EnquiryForm({ productId, onSuccess }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate(){
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name required'
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Valid email required'
    if (!form.message.trim()) errs.message = 'Message required'
    return errs
  }

  async function submit(e){
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await postEnquiry({ product_id: productId, ...form })
      setForm({ name:'', email:'', phone:'', message:'' })
      onSuccess?.()
    } catch (err) {
      alert('Failed to send enquiry')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>
          Name* <br/>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} aria-label="Name" />
        </label>
        <div style={{color:'red'}}>{errors.name}</div>
      </div>
      <div className="form-row">
        <label>
          Email* <br/>
          <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} aria-label="Email"/>
        </label>
        <div style={{color:'red'}}>{errors.email}</div>
      </div>
      <div className="form-row">
        <label>
          Phone <br/>
          <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} aria-label="Phone"/>
        </label>
      </div>
      <div className="form-row">
        <label>
          Message* <br/>
          <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} rows={4}/>
        </label>
        <div style={{color:'red'}}>{errors.message}</div>
      </div>
      <div>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Enquiry'}</button>
      </div>
    </form>
  )
}
