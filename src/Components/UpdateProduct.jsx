import api from '../Api/api';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        quantity: "",
        description: "",
        rating: "",
        price: "",
        category: "",
        imageUrl: "" // Track existing image
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/api/Products/${id}`);
                setProductData(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update text data
            await api.put(`/api/Products/${id}`, productData);

            // 2. If a NEW image was selected, upload it
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                await api.post(`/api/Products/${id}/upload-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
            }

            alert("Product Updated Successfully");
            navigate("/products");
        } catch (error) {
            console.error(error);
            setMessage("Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex justify-center items-center px-4 py-10 font-sans">
            <div className="w-full max-w-2xl border border-black/10 rounded-3xl p-8 shadow-sm bg-white">
                <h1 className="font-integral text-[32px] font-bold uppercase mb-2">
                    Update Product
                </h1>
                <p className="text-black/60 mb-6">
                    Modify the details below to update this product.
                </p>

                {message && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block font-medium mb-2 text-sm">Product Image</label>
                        {productData.imageUrl && !imageFile && (
                            <img src={productData.imageUrl} alt="Current Product" className="w-24 h-24 object-cover rounded-xl border border-gray-200 mb-3" />
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800" 
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-medium mb-2 text-sm">Name</label>
                        <input type="text" name='name' value={productData.name || ""} onChange={handleChange} placeholder='Enter Product Name' className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-medium mb-2 text-sm">Description</label>
                        <textarea name='description' value={productData.description || ""} onChange={handleChange} placeholder='Enter Product Description' rows="3" className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-2 text-sm">Price ($)</label>
                        <input type="number" step="0.01" name='price' value={productData.price || ""} onChange={handleChange} className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-2 text-sm">Quantity</label>
                        <input type="number" name='quantity' value={productData.quantity || ""} onChange={handleChange} className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-2 text-sm">Rating (0-5)</label>
                        <input type="number" step="0.1" max="5" name='rating' value={productData.rating || ""} onChange={handleChange} className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" />
                    </div>

                    <div>
                        <label className="block font-medium mb-2 text-sm">Category</label>
                        <input type="text" name='category' value={productData.category || ""} onChange={handleChange} className="w-full border border-black/20 rounded-xl p-3 outline-none focus:border-black/50" required />
                    </div>

                    <div className="md:col-span-2 mt-4 flex gap-3">
                        <button type='submit' disabled={loading} className="flex-1 bg-black text-white rounded-full py-3.5 font-medium hover:bg-neutral-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                        <button type="button" onClick={() => navigate("/manage-products")} className="flex-1 border border-black/20 rounded-full py-3.5 font-medium hover:bg-[#F2F0F1] transition cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </form> 
            </div>
        </div>
    )
}

export default UpdateProduct