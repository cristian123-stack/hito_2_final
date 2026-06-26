import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProducts } from '../services/mockData';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  // Productos globales — compartidos entre admin y catálogo
  products: mockProducts,

  cart: [],
  cartCount: 0,
  cartTotal: 0,
  favorites: [],

  isDarkMode: false,
  isLoading: false,
  notification: null,
};

const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',

  // Productos
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',

  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',

  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  SET_FAVORITES: 'SET_FAVORITES',

  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_LOADING: 'SET_LOADING',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

const calcCartCount = (cart) => cart.reduce((sum, item) => sum + item.quantity, 0);
const calcCartTotal = (cart) => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload?.role === 'admin',
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        cart: [],
        cartCount: 0,
        cartTotal: 0,
        favorites: [],
      };

    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    // ---- Productos ----
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };

    case ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };

    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };

    // ---- Carrito ----
    case ACTIONS.ADD_TO_CART: {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      const cart = exists
        ? state.cart.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          )
        : [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }];
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }

    case ACTIONS.REMOVE_FROM_CART: {
      const cart = state.cart.filter((i) => i.id !== action.payload);
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }

    case ACTIONS.UPDATE_CART_ITEM: {
      const cart = state.cart.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [], cartCount: 0, cartTotal: 0 };

    case ACTIONS.SET_CART: {
      const cart = action.payload;
      return { ...state, cart, cartCount: calcCartCount(cart), cartTotal: calcCartTotal(cart) };
    }

    case ACTIONS.ADD_TO_FAVORITES:
      if (state.favorites.find((f) => f.id === action.payload.id)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };

    case ACTIONS.REMOVE_FROM_FAVORITES:
      return { ...state, favorites: state.favorites.filter((f) => f.id !== action.payload) };

    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload };

    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, isDarkMode: !state.isDarkMode };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SHOW_NOTIFICATION:
      return { ...state, notification: action.payload };

    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistir en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pet_store_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user) dispatch({ type: ACTIONS.LOGIN, payload: parsed.user });
        if (parsed.cart?.length) dispatch({ type: ACTIONS.SET_CART, payload: parsed.cart });
        if (parsed.favorites?.length) dispatch({ type: ACTIONS.SET_FAVORITES, payload: parsed.favorites });
        if (parsed.products?.length) dispatch({ type: ACTIONS.SET_PRODUCTS, payload: parsed.products });
      } catch (e) {
        console.error('Error al cargar estado:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'pet_store_state',
      JSON.stringify({
        user: state.user,
        cart: state.cart,
        favorites: state.favorites,
        products: state.products,
      })
    );
  }, [state.user, state.cart, state.favorites, state.products]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.isDarkMode);
  }, [state.isDarkMode]);

  // ---- Acciones ----
  const login = (userData, token) => {
    if (token) localStorage.setItem('pet_store_token', token);
    dispatch({ type: ACTIONS.LOGIN, payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('pet_store_token');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const updateUser = (data) => dispatch({ type: ACTIONS.UPDATE_USER, payload: data });

  // Productos
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: newProduct });
    return newProduct;
    // TODO: productService.create(product)
  };

  const updateProduct = (product) => {
    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: product });
    // TODO: productService.update(product.id, product)
  };

  const deleteProduct = (id) => {
    dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: id });
    // TODO: productService.delete(id)
  };

  // Carrito
  const addToCart = (product, quantity = 1) =>
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: { ...product, quantity } });

  const removeFromCart = (productId) =>
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });

  const updateCartItem = (productId, quantity) =>
    dispatch({ type: ACTIONS.UPDATE_CART_ITEM, payload: { id: productId, quantity } });

  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  const toggleFavorite = (product) => {
    const isFav = state.favorites.some((f) => f.id === product.id);
    dispatch({
      type: isFav ? ACTIONS.REMOVE_FROM_FAVORITES : ACTIONS.ADD_TO_FAVORITES,
      payload: isFav ? product.id : product,
    });
  };

  const isFavorite = (productId) => state.favorites.some((f) => f.id === productId);

  const toggleDarkMode = () => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });

  const showNotification = (message, type = 'success') => {
    dispatch({ type: ACTIONS.SHOW_NOTIFICATION, payload: { message, type } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), 3500);
  };

  const setLoading = (val) => dispatch({ type: ACTIONS.SET_LOADING, payload: val });

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    toggleFavorite,
    isFavorite,
    toggleDarkMode,
    showNotification,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}

export default AppContext;
