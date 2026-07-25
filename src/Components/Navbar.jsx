import React, { useState, useEffect } from 'react';
import search from '../assets/search.svg';
import searchb from '../assets/searchb.svg';
import hamburger from '../assets/hamburger.svg';
import cart from '../assets/cart.svg';
import account from '../assets/account.svg';
import msg from '../assets/msg.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import api from '../Api/api';

const Navbar = () => {
    const { loadUser, role } = useAuth();
    const token = localStorage.getItem("accessToken");
    const isLoggedIn = !!token;
    const navigate = useNavigate();
    const location = useLocation();
    
    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Check if we are on a page that should filter main screen instead of dropdown
    const isShopPage = location.pathname.includes('/products') || location.pathname.includes('/category');

    // Fetch all products for the dropdown if we are NOT on the shop page
    useEffect(() => {
        if (!isShopPage) {
            api.get('/api/Products')
                .then(res => setAllProducts(res.data))
                .catch(err => console.error("Failed to load search data", err));
        }
    }, [isShopPage]);

    // Clear search query when changing pages
    useEffect(() => {
        setSearchQuery("");
        setIsDropdownOpen(false);
        setIsMobileSearchOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("Logged Out");
        loadUser(); 
        navigate("/", { replace: true });
    };

    const closeMenu = () => setIsMenuOpen(false);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (isShopPage) {
            // Update URL to trigger filtering on the Shop/Category page instantly
            const searchParams = new URLSearchParams(location.search);
            if (query.trim()) {
                searchParams.set('search', query);
            } else {
                searchParams.delete('search');
            }
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        } else {
            // Filter local list and show styled dropdown
            if (query.trim()) {
                const results = allProducts.filter(p => 
                    p.name.toLowerCase().includes(query.toLowerCase()) || 
                    (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
                );
                setSearchResults(results);
                setIsDropdownOpen(true);
            } else {
                setIsDropdownOpen(false);
            }
        }
    };

    // Shared Dropdown Component to avoid repeating code
    const SearchDropdown = () => (
        !isShopPage && isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                {searchResults.map(product => (
                    <Link 
                        to={`/products/${product.id}`} 
                        key={product.id} 
                        className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <img 
                            src={product.imageUrl || 'https://via.placeholder.com/150'} 
                            alt={product.name} 
                            className="w-12 h-12 object-contain rounded-md mr-4 mix-blend-multiply" 
                        />
                        <div>
                            <p className="text-[14px] font-bold text-black truncate">{product.name}</p>
                            <p className="text-[12px] text-gray-500 font-semibold">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        )
    );

    return (
        <>
            <nav className='h-16 relative bg-white z-50'>
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between md:justify-center px-4 relative">
                    
                    <div className="flex items-center md:hidden">
                        <button 
                            className='cursor-pointer mr-3' 
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <img src={hamburger} alt="Menu" height="24px" width="24px" />
                        </button>
                        <Link to={`/`}>
                            <h1 className="text-2xl font-integral font-black whitespace-nowrap">
                                SHOP.CO
                            </h1>
                        </Link>
                    </div>

                    <div className='hidden md:flex items-center gap-8 w-full justify-between'>
                        <div className="flex items-center gap-8">
                            <Link to={`/`}>
                                <h1 className="text-[32px] font-extrabold font-integral whitespace-nowrap">
                                    SHOP.CO
                                </h1>
                            </Link>
                            <Link to="/products" className='font-sans hover:text-gray-600 transition-colors'>Shop</Link>
                            <Link to="/products" className='font-sans hover:text-gray-600 transition-colors'>On Sale</Link>
                            <Link to="/products" className='font-sans hover:text-gray-600 transition-colors'>New Arrivals</Link>
                            <Link to="/products" className='font-sans hover:text-gray-600 transition-colors'>Brands</Link>
                        </div>
                        
                        {/* Desktop Search Bar */}
                        <div className="relative w-80">
                            <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 w-full">
                                <img src={search} alt="Search" className='mr-3 w-5 h-5 opacity-50' />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search For Products" 
                                    className="bg-transparent outline-none w-full text-[15px]" 
                                />
                            </div>
                            <SearchDropdown />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link to={`/cart/`}><img src={cart} alt="Cart" /></Link>
                            <Link to={!isLoggedIn ? `/login` : `/details`}><img src={account} alt="Account" /></Link>
                            {isLoggedIn && role === "Admin" && <Link to={`/adminchat`}><img src={msg} alt="Messages" /></Link>}
                            {isLoggedIn && <button className='font-bold cursor-pointer hover:text-red-500 transition-colors' onClick={handleLogout}>Log Out</button>}
                            {isLoggedIn && role === "Admin" && <Link to={`/adminpanel`}><button className='font-bold cursor-pointer'>Admin</button></Link>}
                        </div>
                    </div>

                    <div className='flex items-center gap-4 md:hidden'>
                        <button 
                            className='cursor-pointer'
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            <img src={searchb} alt="Search" className="w-6 h-6"/>
                        </button>
                        <Link to={`/cart`}><img src={cart} alt="Cart" className="w-6 h-6" /></Link>
                        <Link to={!isLoggedIn ? `/login` : `/details`}><img src={account} alt="Account" className="w-6 h-6" /></Link>
                        {isLoggedIn && role === "Admin" && <Link to={`/adminchat`}><img src={msg} alt="Messages" className="w-6 h-6" /></Link>}
                    </div>
                </div>

                {/* Mobile Expandable Search Bar Overlay */}
                {isMobileSearchOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white px-4 pb-4 shadow-sm z-40 md:hidden animate-fade-in-down">
                        <div className="relative w-full">
                            <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 w-full">
                                <img src={search} alt="Search" className='mr-3 w-5 h-5 opacity-50' />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search For Products" 
                                    className="bg-transparent outline-none w-full text-[15px]" 
                                />
                            </div>
                            <SearchDropdown />
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Sidebar Navigation (Existing code) */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={closeMenu}
            ></div>

            <div 
                className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-integral font-extrabold">SHOP.CO</h2>
                    <button 
                        onClick={closeMenu} 
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col grow py-4 px-5 space-y-4">
                    <Link to="/products" onClick={closeMenu} className="text-lg font-medium hover:text-gray-500 transition-colors">Shop</Link>
                    <Link to="/products"  onClick={closeMenu} className="text-lg font-medium hover:text-gray-500 transition-colors">On Sale</Link>
                    <Link to="/products"  onClick={closeMenu} className="text-lg font-medium hover:text-gray-500 transition-colors">New Arrivals</Link>
                    <Link to="/products"  onClick={closeMenu} className="text-lg font-medium hover:text-gray-500 transition-colors">Brands</Link>
                </div>

                <div className="p-5 border-t border-gray-100">
                    {isLoggedIn ? (
                        <button 
                            className="w-full text-center bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
                            onClick={() => {
                                handleLogout();
                                closeMenu();
                            }}
                        >
                            Log Out
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            onClick={closeMenu} 
                            className="block w-full text-center bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;