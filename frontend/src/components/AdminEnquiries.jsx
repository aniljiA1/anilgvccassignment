import React, { useState } from 'react'

export default function AdminEnquiries() {
  const [token, setToken] = useState(import.meta.env.VITE_ADMIN_TOKEN || "") // default token, replace as needed
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  async function load() {
    if (!token) {
      alert('Please enter admin token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/enquiries`, {
        headers: { 'x-admin-token': token }
      })

      if (!res.ok) {
        throw new Error('Unauthorized or failed to fetch')
      }

      const data = await res.json()
      setRows(data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch enquiries (check token)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Admin token (x-admin-token)"
        />
        <button onClick={load} style={{ marginLeft: 8 }}>
          Load Enquiries
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {rows.length > 0 && (
        <div>
          <h3>Enquiries ({rows.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>ID</th>
                <th>Product</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.product_name || r.product_id}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.message}</td>
                  <td>{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rows.length === 0 && !error && (
        <div>No enquiries loaded</div>
      )}
    </div>
  )
}
