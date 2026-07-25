import React from 'react'
import { Link } from 'react-router-dom'

const AdminPanel = () => {
  return (
    <div className="min-h-[70vh] py-10 px-4 md:px-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-integral font-bold text-[32px] md:text-[40px] leading-none mb-2 uppercase">
          Admin Dashboard
        </h1>
        <p className="text-black/60 mb-8">Manage your store and monitor customer activity.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={`/manage-products`} className="flex flex-col justify-center items-center h-48 border border-black/10 rounded-3xl bg-white hover:bg-[#F2F0F1] transition-colors cursor-pointer shadow-sm">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 text-2xl shadow-md">
              📦
            </div>
            <h2 className="text-[20px] font-bold">Manage Products</h2>
            <p className="text-black/60 text-sm mt-1">Add, update, or delete items</p>
          </Link>

          <Link to={`/view-carts`} className="flex flex-col justify-center items-center h-48 border border-black/10 rounded-3xl bg-white hover:bg-[#F2F0F1] transition-colors cursor-pointer shadow-sm">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 text-2xl shadow-md">
              🛒
            </div>
            <h2 className="text-[20px] font-bold">View All Carts</h2>
            <p className="text-black/60 text-sm mt-1">Monitor active customer sessions</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel