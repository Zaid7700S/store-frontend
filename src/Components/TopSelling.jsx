import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import api from '../Api/api';

const TopSelling = () => {
    const API = "/api/Products?limit=4";
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(API);


                setProducts(response.data);
            } catch (error) {
                console.error(error)
                setError("The products could not be loaded.")
            } finally {
                setLoading(false);
            }
        }
        getProducts();
    }, [])

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status"></div>
                <p className="mt-3">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
         <>
                    <div className='my-10'>
                        <div>
                            <h1 className='text-center font-integral text-[38px] md:text-[48px] font-black'>TOP SELLING</h1>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-6 ml-4 overflow-x-auto md:justify-center md:flex-wrap">
                            {products.map((product) => {
                                const title = product.name;
                                const rating = product.rating;
                                const price = product.price;
                                // Use imageUrl matching the backend, with a fallback generic placeholder if empty
                                const imgSrc = product.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
        
                                return (
                                    <div className="shrink-0 md:shrink" key={product.id}>
                                        <Link to={`products/${product.id}`}>
                                            <div className=' bg-[#F2F0F1] rounded-2xl w-49.5 h-62.5 md:w-73.75 md:h-74.5 '>
                                                <div className='flex justify-center items-center h-full '>
                                                    <img src={imgSrc} alt={title} className='w-37.5 md:w-60 h-45 md:h-62.5 object-contain mix-blend-multiply' />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className='text-[16px] font-sans font-semibold md:text-[20px] truncate w-49.5 md:w-60'>{title}</p>
                                            </div>
                                        </Link>
                                        <div>
                                            <p className='font-sans text-[12px] md:text-[14px]'>⭐{rating}/5</p>
                                        </div>
                                        <div>
                                            <p className='text-[20px] md:text-[24px] font-semibold font-sans'>${price}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='flex justify-center my-10 font-semibold px-4'>
                            <Link to={`/products`}><button className='border mx-2 border-gray-300 rounded-full w-full md:w-54.5 h-13 font-sans text-[16px] cursor-pointer hover:bg-gray-50 transition'>
                                View All
                            </button></Link>                
                        </div>
                    </div>
                </>
    )
}


export default TopSelling
