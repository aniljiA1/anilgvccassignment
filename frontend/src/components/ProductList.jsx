import React, { useEffect, useState } from 'react'
import { fetchProducts } from '../api'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

export default function ProductList(){
  const [productsData, setProductsData] = useState({ data: [], pagination: {} })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [selected, setSelected] = useState(null)

  function load(){
    setLoading(true)
    fetchProducts({ search, category, page, limit })
      .then(res => setProductsData(res))
      .catch(err => alert('Failed to fetch products'))
      .finally(()=>setLoading(false))
  }

  useEffect(()=> { load() }, [search, category, page])

  const cats = ['','Electronics','Fashion','Sports','Kitchen','Furniture','Stationery']

  const { data, pagination } = productsData

  return (
    <>
      <div className="controls">
        <input placeholder="Search products..." value={search} onChange={e=>{setPage(1); setSearch(e.target.value)}} aria-label="Search products"/>
        <select value={category} onChange={e=>{setPage(1); setCategory(e.target.value)}}>
          {cats.map(c => <option value={c} key={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {loading ? <div>Loading...</div> :
        <>
          <div className="grid">
            {data.map(p => <ProductCard key={p.id} product={p} onView={()=>setSelected(p.id)} />)}
          </div>

          <div className="pager">
            <button disabled={page <= 1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <div className="small-muted">Page {pagination.page || 1} / {pagination.totalPages || 1} — {pagination.total || 0} items</div>
            <button disabled={page >= (pagination.totalPages || 1)} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </>
      }

      {selected && <ProductModal id={selected} onClose={()=>setSelected(null)} />}
    </>
  )
}
