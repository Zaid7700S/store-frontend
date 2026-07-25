import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../Api/api";

const ViewCartDetail = () => {
    const { id } = useParams();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCartDetail = async () => {
            try {
                // Calls the [HttpGet("{id}")] endpoint in CartsController
                const response = await api.get(`/api/Carts/${id}`);
                setCart(response.data);
            } catch (err) {
                console.error("Failed to fetch cart details:", err);
                setError("Could not load cart details. It may have been deleted or you lack permissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartDetail();
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-black/60 font-medium font-sans min-h-[70vh]">Loading cart details...</div>;
    }

    if (error || !cart) {
        return (
            <div className="mx-4 md:mx-10 my-6 font-sans min-h-[70vh]">
                <Link to="/view-carts" className="text-black/60 text-sm hover:underline mb-4 inline-block">
                    &larr; Back to All Carts
                </Link>
                <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center">
                    {error || "Cart not found."}
                </div>
            </div>
        );
    }

    const totalItems = cart.cart_Items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="mx-4 md:mx-10 my-6 font-sans min-h-[70vh]">
            
            {/* Header */}
            <div className='mb-8'>
                <Link to="/view-carts" className="text-black/60 text-sm hover:underline mb-2 inline-block">
                    &larr; Back to All Carts
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <h1 className='font-integral text-[32px] font-bold uppercase leading-none'>
                        Cart #{cart.id}
                    </h1>
                    <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                        Total: ${cart.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                
                {/* Left Side: Items List */}
                <div className='flex-grow border border-black/10 rounded-3xl p-4 md:p-6 bg-white'>
                    <h2 className='text-[20px] font-bold mb-4 border-b border-black/10 pb-4'>
                        Items in Cart ({totalItems})
                    </h2>
                    
                    {cart.cart_Items && cart.cart_Items.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {cart.cart_Items.map((item) => (
                                <div key={item.productId} className='flex gap-4 py-4 border-b border-black/10 last:border-0 last:pb-0'>
                                    {/* Product Image Placeholder (matches Cart.jsx style) */}
                                    <div className='bg-[#F2F0F1] rounded-2xl min-w-[80px] md:min-w-[100px] h-[80px] md:h-[100px] flex justify-center items-center overflow-hidden'>
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt={item.product.name} className='w-full h-full object-cover' />
                                        ) : (
                                            <span className="text-2xl">📦</span>
                                        )}
                                    </div>
                                    
                                    <div className='flex flex-col justify-between w-full'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <p className='truncate max-w-[200px] sm:max-w-[300px] font-sans text-[16px] font-bold'>
                                                    {item.product?.name || "Unknown Product"}
                                                </p>
                                                <p className='font-sans text-[12px] text-black/60 mt-1'>
                                                    Product ID: {item.productId}
                                                </p>
                                            </div>
                                            <p className='text-[18px] font-bold'>
                                                ${item.product?.price?.toFixed(2) || "0.00"}
                                            </p>
                                        </div>
                                        
                                        <div className='flex justify-between items-center mt-2'>
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F0F0] text-black">
                                                Qty: {item.quantity}
                                            </div>
                                            <p className='text-[14px] font-semibold text-black/60'>
                                                Subtotal: ${(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-black/60">
                            This cart is completely empty.
                        </div>
                    )}
                </div>

                {/* Right Side: Cart Meta Info */}
                <div className='w-full lg:w-[350px] border border-black/10 rounded-3xl p-6 bg-white h-fit shadow-sm'>
                    <h2 className='text-[20px] font-bold pb-4 border-b border-black/10 mb-4'>Cart Overview</h2>
                    
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center text-[16px]'>
                            <p className='text-black/60'>Cart ID</p>
                            <p className='font-bold'>#{cart.id}</p>
                        </div>
                        <div className='flex justify-between items-center text-[16px]'>
                            <p className='text-black/60'>User ID</p>
                            <p className='font-bold'>{cart.userId}</p>
                        </div>
                        <div className='flex justify-between items-center text-[16px]'>
                            <p className='text-black/60'>Total Unique Items</p>
                            <p className='font-bold'>{cart.cart_Items?.length || 0}</p>
                        </div>
                        <div className='flex justify-between items-center text-[16px]'>
                            <p className='text-black/60'>Total Quantity</p>
                            <p className='font-bold'>{totalItems}</p>
                        </div>
                    </div>
                    
                    <hr className='border-black/10 my-4' />
                    
                    <div className='flex justify-between items-center'>
                        <p className='font-bold text-[18px]'>Total Amount</p>
                        <p className='font-bold text-[22px]'>${cart.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewCartDetail;