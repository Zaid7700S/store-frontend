import { useState } from 'react'
import SmallHeader from './Components/SmallHeader'
import Navbar from './Components/Navbar'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Footer from './Components/Footer'
import HomePage from './Components/HomePage'
import ProductDetails from './Components/ProductDetails'
import Cart from './Components/Cart'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Login from './Components/Login'
import MainLayout from './Components/MainLayout'
import { AuthProvider } from './Components/AuthProvider'
import Signup from './Components/SignUp'
import ResetPassword from './Components/ResetPassword'
import EditDetails from './Components/EditDetails'
import Details from './Components/Details'
import CustomerSupportChat from './Components/CustomerSupportChat'
import AdminSupportChat from './Components/AdminSupportChat'
import AdminRoutes from './utils/AdminRoutes'
import { useAuth } from './Components/AuthProvider'
import AdminPanel from './Components/AdminPanel'
import ManageProducts from './Components/ManageProducts'
import AddProduct from './Components/AddProducts'
import UpdateProduct from './Components/UpdateProduct'
import ViewAllCarts from './Components/ViewAllCarts'
import ViewCartDetail from './Components/ViewCartDetail'
import ProductsPage from './Components/ProductsPage'
import CategoryPage from './Components/CategoryPage'
import ScrollToTop from './utils/ScrollToTop';







function App() {

  const ChatWidgetWrapper = () => {
  const { role } = useAuth();
  
  // Only render the floating customer chat if the user is logged in and is NOT an admin
  const token = localStorage.getItem("accessToken");
  if (token && role !== "Admin") {
    return <CustomerSupportChat />;
  }
  return null;
};

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route  path="/category/:categoryName" element={<CategoryPage/>}/> 
              <Route element={<ProtectedRoutes />}>
                <Route path="/cart" element={<Cart />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/edit-details" element={<EditDetails />} />
            <Route path="/details" element={<Details />} />
            
             <Route element={<AdminRoutes />}>
                <Route path="/adminchat" element={<AdminSupportChat />} />
                <Route path="/adminpanel" element={<AdminPanel />} />
                <Route path="/manage-products" element={<ManageProducts />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path='/update-product/:id' element={<UpdateProduct/>} />
                <Route path="/view-carts" element={<ViewAllCarts />} />
                <Route path="/view-carts/:id" element={<ViewCartDetail />} />
              </Route>
          </Routes>
          <ChatWidgetWrapper />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
