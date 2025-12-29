import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import SellerDashboard from './pages/client/SellerDashboard';
import BuyerLayout from './components/client/BuyerLayout';

// Import pages
import Landing from './pages/client/Landing';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Home from './pages/client/Home';
import Cart from './pages/client/Cart';
import Orders from './pages/client/Orders';
import Offers from './pages/client/Offers';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#d2a83d',
      light: '#f2e4c3',
      dark: '#b67d1a',
    },
    secondary: {
      main: '#ffc107',
    },
    background: {
      default: '#faf4e6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected buyer routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <BuyerLayout />
                  </PrivateRoute>
                }
              >
                <Route path="home" element={<Home />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<Orders />} />
                <Route path="offers" element={<Offers />} />
              </Route>

              {/* Seller routes (no Navbar) */}
              <Route
                path="/seller/dashboard"
                element={
                  <PrivateRoute>
                    <SellerDashboard />
                  </PrivateRoute>
                }
              />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;