import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Register from "./pages/RegisterPage";
import Login from "./pages/Login";
import ForgotPasswordRequest from "./pages/ForgotPasswordRequest";
import PasswordResetForm from "./pages/ResetPassword";
import Diagnostics from "./pages/Diagnostics";
import Routine from "./pages/Routine";
import ProductsMatch from "./pages/ProductsMatch";
import AllProducts from "./pages/AllProducts";
import ProductsList from "./pages/ProductsList";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GoogleOAuthProvider
  clientId="363340741902-q9pp9pbobqh8tjg1o5hunbk0jkdrfq9u.apps.googleusercontent.com"
  onScriptLoadSuccess={() => {
    window.google?.accounts.id.disableAutoSelect();
  }}
>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password-request" element={<ForgotPasswordRequest />} />
              <Route path="/reset-password/:token" element={<PasswordResetForm />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/products-match" element={<ProductsMatch />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/products-list" element={<ProductsList />} />

               {/* Alias: /user → nafs page products-list */}
        <Route path="/user" element={<ProductsList />} />

              {/* ❌ Supprimé route /user ghalta */}
            </Routes>
          </Router>
        </GoogleOAuthProvider>
      </CartProvider>
    </AuthProvider>
  );
}