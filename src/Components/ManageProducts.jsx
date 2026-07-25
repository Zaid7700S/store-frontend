import React, { useEffect, useState } from 'react'
import api from "../Api/api";
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ManageProducts = () => {

    const { role } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            const url = search
                ? `/api/Products/search?s=${search}`
                : `/api/Products`;

            try {
                const response = await api.get(url);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/Products/${id}`);
            setProducts(prev => prev.filter(product => product.id !== id));
        } catch (error) {
            console.log("Delete error:", error.response);
        }
    };

    return (
        <div className="mx-4 md:mx-10 my-6 font-sans">
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4'>
                <div>
                    <h1 className='font-integral text-[32px] font-bold uppercase'>Manage Products</h1>
                </div>
                
                <div className='flex items-center gap-4 w-full md:w-auto'>
                    <div className='flex flex-grow md:w-[300px] bg-[#F0F0F0] py-[12px] px-[16px] rounded-full'>
                        <span className="text-black/60 mr-2">🔍</span>
                        <input 
                            type="text" 
                            className='bg-transparent text-[14px] outline-none w-full placeholder:text-black/60' 
                            placeholder='Search products...' 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </div>
                    {role === "Admin" && (
                        <Link to={`/add-product`} className='shrink-0'>
                            <button className='bg-black text-white px-6 py-[12px] rounded-full text-[14px] font-medium hover:bg-neutral-800 transition shadow-md cursor-pointer'>
                                + Add New
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 gap-5'>
                {products.map((product) => (
                    <div key={product.id} className='border border-black/10 rounded-3xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow'>
                        
                        <div className='flex flex-col flex-grow'>
                            <Link to={`/products/${product.id}`}>
                                <h2 className='text-[20px] font-bold mb-1 hover:underline'>{product.name}</h2>
                            </Link>
                            <p className='text-black/60 text-[14px] line-clamp-2 max-w-2xl mb-3'>{product.description}</p>
                            
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${product.quantity > 0 ? 'bg-[#F0F0F0] text-black' : 'bg-red-100 text-red-600'}`}>
                                    {product.quantity > 0 ? '📦' : '⚠️'} Stock: {product.quantity}
                                </span>
                            </div>
                        </div>

                        {role === "Admin" && (
                            <div className='flex flex-row md:flex-col items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-black/10 md:border-none'>
                                <Link to={`/update-product/${product.id}`} className="w-full md:w-auto">
                                    <button className='w-full border border-black/20 text-black px-6 py-2 rounded-full text-[14px] font-medium hover:bg-gray-50 transition cursor-pointer'>
                                        Update
                                    </button>
                                </Link>
                                <button type='button' disabled={loading} onClick={() => handleDelete(product.id)} className='w-full border border-red-500 text-red-500 px-6 py-2 rounded-full text-[14px] font-medium hover:bg-red-50 transition cursor-pointer'>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-20 text-black/60">
                    <p>No products found.</p>
                </div>
            )}
        </div>
    )
}

export default ManageProducts