import React, { useEffect, useState } from 'react';
import api from "../Api/api";
import { Link } from 'react-router-dom';

const ViewAllCarts = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                // Calls the [HttpGet] endpoint in CartsController
                const response = await api.get("/api/Carts");
                setCarts(response.data);
            } catch (err) {
                console.error("Failed to fetch carts:", err);
                setError("Could not load carts. Ensure you have Admin privileges.");
            } finally {
                setLoading(false);
            }
        };

        fetchCarts();
    }, []);

    const handleDeleteCart = async (id) => {
        if (!window.confirm("Are you sure you want to delete this cart?")) return;

        try {
            // Calls the [HttpDelete("{id}")] endpoint
            await api.delete(`/api/Carts/${id}`);
            setCarts(prev => prev.filter(cart => cart.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete cart.");
        }
    };

    // Filter carts based on user ID search
    const filteredCarts = carts.filter(cart =>
        cart.userId?.toString().includes(search) ||
        cart.id?.toString().includes(search)
    );

    return (
        <div className="mx-4 md:mx-10 my-6 font-sans min-h-[70vh]">
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4'>
                <div>
                    <Link to="/adminpanel" className="text-black/60 text-sm hover:underline mb-2 inline-block">
                        &larr; Back to Admin Panel
                    </Link>
                    <h1 className='font-integral text-[32px] font-bold uppercase'>View All Carts</h1>
                </div>

                <div className='flex flex-grow max-w-md bg-[#F0F0F0] py-[12px] px-[16px] rounded-full'>
                    <span className="text-black/60 mr-2">🔍</span>
                    <input
                        type="text"
                        className='bg-transparent text-[14px] outline-none w-full placeholder:text-black/60'
                        placeholder='Search by Cart ID or User ID...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-black/60 font-medium">Loading carts...</div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 text-center">
                    {error}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {filteredCarts.map((cart) => {
                        const totalItems = cart.cart_Items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                        return (
                            <div key={cart.id} className='border border-black/10 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full'>

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className='text-[20px] font-bold'>Cart #{cart.id}</h2>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${totalItems > 0 ? 'bg-[#F0F0F0] text-black' : 'bg-red-50 text-red-600'}`}>
                                            {totalItems} Items
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <p className='text-black/60 text-[14px]'>
                                            <span className="font-semibold text-black">User ID:</span> {cart.userId}
                                        </p>
                                        <p className='text-black/60 text-[14px]'>
                                            <span className="font-semibold text-black">Total Amount:</span> ${cart.totalAmount?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 pt-4 border-t border-black/10'>
                                    <Link
                                        to={`/view-carts/${cart.id}`}
                                        className='flex-1 border border-black/20 text-black px-4 py-2.5 rounded-full text-[14px] font-medium hover:bg-gray-50 transition cursor-pointer text-center'
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteCart(cart.id)}
                                        className='flex-1 border border-red-500 text-red-500 px-4 py-2.5 rounded-full text-[14px] font-medium hover:bg-red-50 transition cursor-pointer'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && filteredCarts.length === 0 && (
                <div className="text-center py-20 text-black/60">
                    <div className="text-4xl mb-4">🛒</div>
                    <p>No active carts found.</p>
                </div>
            )}
        </div>
    );
};

export default ViewAllCarts;