import React, { useEffect, useState } from 'react'
import api from '../Api/api';
import { Link } from "react-router-dom";
import Delete from "../assets/Delete.svg";
import Plus from "../assets/Plus.svg"
import Minus from "../assets/Minus.svg"
import coupon from "../assets/coupon.svg"

const Cart = (props) => {
    const [cart, setCart] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const totalPrice = cart?.cart_Items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
    const discount = (totalPrice * 20) / 100;
    const deliveryFee = 15;

    const finalPrice = totalPrice > 0 ? ((totalPrice - discount) + deliveryFee).toFixed(2) : 0;

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await api.get("/api/Carts/cart");
                setCart(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    console.log("Cart not found");
                } else {
                    console.error(err);
                }
            } finally {
                setLoading(false)
            }
        };

        getCart();
    }, []);

    const handleQuantityChange = async (productId, change) => {
        const item = cart.cart_Items.find(x => x.productId === productId);

        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity < 1) return;

        try {
            await api.put(
                `/api/Carts/${cart.id}/items/${productId}`,
                {
                    quantity: newQuantity
                }
            );

            setCart(prev => {
                const updatedItems = prev.cart_Items.map(i =>
                    i.productId === productId
                        ? { ...i, quantity: newQuantity }
                        : i
                );

                const total = updatedItems.reduce(
                    (sum, i) => sum + i.quantity * i.product.price,
                    0
                );

                return {
                    ...prev,
                    cart_Items: updatedItems,
                    totalAmount: total
                };
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await api.delete(`/api/Carts/${cart.id}/items/${productId}`);

            setCart(prev => ({
                ...prev,
                cart_Items: prev.cart_Items.filter(
                    item => item.productId !== productId
                )
            }));
        } catch (err) {
            console.error(err);
        }
    };

    // 1. Added loading state to prevent premature "Product not found" flash
    if (loading) {
        return (
            <div className="container mx-4 md:mx-10 my-10 flex justify-center">
                <h2 className="text-xl font-bold font-sans animate-pulse">Loading cart...</h2>
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

    // 2. Safely check if cart exists and has items
    if (!cart || !cart.cart_Items || cart.cart_Items.length === 0) {
        return (
            <div className="container mx-4 md:mx-10 my-10">
                <h2 className="text-2xl font-bold font-sans">Your cart is empty.</h2>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <>
            <div className='mx-4 md:mx-10 my-6'>
                <hr className='mb-4 border-black/10' />
                <div className='flex gap-4 font-sans text-[14px] mb-4'>
                    <Link to={`/`}><p className='text-black/60'>HOME</p></Link>
                    <p>&gt;</p>
                    <p>CART</p>
                </div>

                <div>
                    <h1 className='font-integral text-[32px] font-bold uppercase mb-4'>YOUR CART</h1>
                </div>

                <div className='flex flex-col md:flex-row gap-5'>

                    <div className='flex-grow border border-black/10 rounded-3xl p-[14px]'>
                        {cart.cart_Items.map((item) => (

                            <div key={item.product.id} className='flex gap-4 my-4 border-b border-black/10 pb-4 last:border-0 last:pb-0'>
                                <div className='bg-[#F2F0F1] rounded-2xl min-w-[99px] min-h-[99px] flex justify-center items-center overflow-hidden'>
                                    {/* 3. Changed item.product.image to item.product.imageUrl */}
                                    <Link to={`/products/${item.product.id}`}>
                                        <img 
                                            src={item.product.imageUrl || 'https://via.placeholder.com/150'} 
                                            alt={item.product.name} 
                                            className='w-24 h-24 object-cover mix-blend-multiply' 
                                        />
                                    </Link>
                                </div>

                                <div className='flex flex-col justify-between w-full'>

                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <Link to={`/products/${item.product.id}`}><p className='truncate max-w-[200px] sm:max-w-[300px] font-sans text-[16px] font-bold'>{item.product.name}</p>
                                            </Link>
                                            <p className='font-sans text-[12px] text-black/60'>Size: <span className="text-black">M</span></p>
                                            <p className='font-sans text-[12px] text-black/60'>Category: <span className="text-black">{item.product.category}</span></p>
                                        </div>
                                        <button className='cursor-pointer hover:opacity-70 transition' onClick={() => handleDelete(item.product.id)}>
                                            <img src={Delete} alt="Delete item" />
                                        </button>
                                    </div>

                                    <div className='flex justify-between items-center mt-2'>
                                        <p className='text-[20px] font-bold'>${item.product.price}</p>

                                        <div className='flex gap-3 bg-[#F0F0F0] w-[105px] min-h-[31px] justify-between items-center px-3 rounded-full'>
                                            <button className='cursor-pointer hover:scale-110 transition' onClick={() => handleQuantityChange(item.product.id, -1)}><img src={Minus} alt="Decrease" /></button>
                                            <span className='font-bold text-[14px]'>{item.quantity}</span>
                                            <button className='cursor-pointer hover:scale-110 transition' onClick={() => handleQuantityChange(item.product.id, 1)}><img src={Plus} alt="Increase" /></button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='border border-black/10 rounded-3xl p-[20px] font-sans w-full md:w-[400px] h-fit'>
                        <div>
                            <h1 className='font-sans text-[20px] font-bold pb-[16px]'>Order Summary</h1>
                        </div>
                        <div className='flex justify-between items-center py-3 text-[16px]'>
                            <p className='text-black/60'>Subtotal</p>
                            <p className='font-bold'>${totalPrice.toFixed(2)}</p>
                        </div>
                        <div className='flex justify-between items-center py-3 text-[16px]'>
                            <p className='text-black/60'>Discount (-20%)</p>
                            <p className='font-bold text-[#FF3333]'>-${discount.toFixed(2)}</p>
                        </div>
                        <div className='flex justify-between items-center py-3 text-[16px]'>
                            <p className='text-black/60'>Delivery Fee</p>
                            <p className='font-bold'>${deliveryFee.toFixed(2)}</p>
                        </div>
                        <hr className='border-black/10 my-2' />
                        <div className='flex justify-between items-center py-3'>
                            <p>Total</p>
                            <p className='font-bold text-[20px]'>${finalPrice}</p>
                        </div>
                        <div className='flex justify-between py-[16px] gap-2'>
                            <div className='flex flex-grow bg-[#F0F0F0] py-[12px] px-[16px] rounded-full'>
                                <img src={coupon} alt="coupon icon" />
                                <input type="text" placeholder='Add promo code' className='bg-transparent text-[14px] outline-none pl-[10px] w-full' />
                            </div>
                            <button className='bg-black text-[14px] text-white py-[12px] px-[20px] rounded-full cursor-pointer hover:bg-neutral-800 transition'>
                                Apply
                            </button>
                        </div>
                        <div className='mt-2'>
                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-neutral-800 transition cursor-pointer mt-6"
                            >
                                Go to Checkout ➔
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Demo Checkout Modal Overlay */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform scale-100 transition-transform">

                        <div className="w-16 h-16 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🛒</span>
                        </div>

                        <h2 className="text-center font-integral text-[24px] font-bold uppercase mb-3">
                            Demo System
                        </h2>

                        <p className="text-center text-black/60 font-sans mb-8">
                            Thank you for exploring Shop.co! This is a portfolio demonstration project, so the checkout and payment systems are disabled. No real orders are processed.
                        </p>

                        <button
                            onClick={() => setShowCheckoutModal(false)}
                            className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-neutral-800 transition cursor-pointer"
                        >
                            Continue Shopping
                        </button>

                    </div>
                </div>
            )}
        </>
    )
}

export default Cart
