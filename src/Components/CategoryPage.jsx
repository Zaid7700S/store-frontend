import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../Api/api';

const CategoryPage = () => {
    // Extract the category name from the URL (e.g., "casual", "gym")
    const { categoryName } = useParams();
    
    // NEW: Extract the search query from the URL (e.g., ?search=shirt)
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || "";
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter States
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                setError("");
                // Fetch ALL products so we can manually split the categories on the frontend
                const response = await api.get('/api/Products');
                setProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []); 

    // Apply Filters (Search, Tags & Price)
    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        return products.filter(product => {
            // 1. Search Match (NEW)
            const matchSearch = product.name.toLowerCase().includes(searchQuery);

            // 2. Tag Match (Category)
            const productTags = product.category 
                ? product.category.split(',').map(c => c.trim().toLowerCase()) 
                : [];
            const targetCategory = categoryName.toLowerCase();
            const matchCategory = productTags.includes(targetCategory);

            // 3. Price Match
            const min = priceRange.min === "" ? 0 : parseFloat(priceRange.min);
            const max = priceRange.max === "" ? Infinity : parseFloat(priceRange.max);
            const matchPrice = product.price >= min && product.price <= max;

            // Combine all constraints!
            return matchSearch && matchCategory && matchPrice;
        });
    }, [products, categoryName, priceRange, searchQuery]); // <-- searchQuery added as a dependency

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center font-sans">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-semibold text-[#9A9A9A]">Loading {categoryName}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center font-sans">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl font-medium">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 font-sans">
            
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8 border-b border-black/10 pb-6">
                <div>
                    <nav className="flex items-center gap-2 mb-4 text-[14px] text-black/60 capitalize">
                        <Link to="/" className="hover:text-black">Home</Link>
                        <span>›</span>
                        <Link to="/products" className="hover:text-black">Shop</Link>
                        <span>›</span>
                        <span className="text-black font-medium">{categoryName}</span>
                    </nav>
                    <h1 className="font-integral font-bold text-[32px] md:text-[40px] uppercase">
                        {categoryName}
                    </h1>
                    <p className="text-[#9A9A9A] mt-1 text-sm md:text-base">
                        Showing {filteredProducts.length} result{filteredProducts.length !== 1 && 's'}
                        {searchQuery && <span> for "<span className="text-black font-semibold">{searchQuery}</span>"</span>}
                    </p>
                </div>

                {/* Mobile Filter Toggle Button */}
                <button 
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="md:hidden bg-[#F0F0F0] p-3 rounded-full flex items-center justify-center"
                >
                    <span className="text-xl">🎛️</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Filters Sidebar */}
                <div className={`
                    w-full md:w-64 shrink-0 
                    ${isMobileFilterOpen ? 'block' : 'hidden md:block'}
                `}>
                    <div className="border border-black/10 rounded-3xl p-6 bg-white sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-[20px]">Filters</h2>
                            <span className="text-[#9A9A9A]">🎛️</span>
                        </div>

                        <hr className="border-black/10 mb-6" />

                        {/* Price Range */}
                        <div>
                            <h3 className="font-semibold mb-4 text-[16px]">Price</h3>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full border border-black/20 rounded-lg p-2 text-sm outline-none focus:border-black/50"
                                />
                                <span className="text-[#9A9A9A]">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full border border-black/20 rounded-lg p-2 text-sm outline-none focus:border-black/50"
                                />
                            </div>
                            
                            {/* Clear Filters Button */}
                            <button 
                                onClick={() => setPriceRange({ min: "", max: "" })}
                                className="w-full mt-6 bg-[#F2F0F1] hover:bg-black hover:text-white text-black font-semibold rounded-full py-3 transition-colors text-sm"
                            >
                                Clear Price Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="h-64 flex flex-col justify-center items-center text-center bg-[#F2F0F1] rounded-3xl p-6">
                            <span className="text-4xl mb-4">🔍</span>
                            <h3 className="font-bold text-xl mb-2">No products found</h3>
                            <p className="text-[#9A9A9A]">
                                {searchQuery 
                                    ? `We couldn't find any "${searchQuery}" in the ${categoryName} category.` 
                                    : `We couldn't find any ${categoryName} items in this price range.`}
                            </p>
                            
                            {(priceRange.min || priceRange.max || searchQuery) && (
                                <button 
                                    onClick={() => {
                                        setPriceRange({ min: "", max: "" });
                                        // Optional: You could also clear the search bar by updating the URL here
                                    }}
                                    className="mt-4 text-black underline font-semibold cursor-pointer"
                                >
                                    Clear Price Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredProducts.map((product) => {
                                const imgSrc = product.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
                                
                                return (
                                    <Link key={product.id} to={`/products/${product.id}`} className="group cursor-pointer">
                                        <div className="bg-[#F2F0F1] rounded-[20px] aspect-[4/5] p-4 relative flex items-center justify-center overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-md">
                                            <img 
                                                src={imgSrc} 
                                                alt={product.name} 
                                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                                            />
                                        </div>
                                        <div className="px-1">
                                            <h3 className="text-[16px] md:text-[18px] font-bold font-sans truncate text-black">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-yellow-400 text-sm">⭐</span>
                                                <span className="font-sans text-[13px] md:text-[14px] text-black/60">
                                                    {product.rating}/5
                                                </span>
                                            </div>
                                            <p className="text-[20px] md:text-[24px] font-bold font-sans mt-1">
                                                ${product.price}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CategoryPage;