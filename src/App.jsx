import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Notification from './components/common/Notification';

// Páginas públicas
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';

// Páginas de usuario
import Cart from './pages/user/Cart';
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import Favorites from './pages/user/Favorites';

// Páginas de admin
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        {/* Notificaciones globales */}
        <Notification />

        <Routes>
          {/* ---- Rutas públicas ---- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/productos/:id" element={<ProductDetail />} />

          {/* ---- Rutas de usuario ---- */}
          <Route path="/carrito" element={<Cart />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-pedidos" element={<MyOrders />} />
          <Route path="/favoritos" element={<Favorites />} />

          {/* ---- Rutas de admin ---- */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/productos" element={<AdminProducts />} />

          {/* ---- Ruta no encontrada ---- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
