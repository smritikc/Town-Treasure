import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Typography,
    Button,
    Avatar,
} from '@mui/material';
import {
    ShoppingCart,
    User,
    LogOut,
    Home,
    Store,
    Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate('/profile');
    };

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                bgcolor: 'white', 
                color: '#333',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/home"
                    sx={{
                        mr: 2,
                        fontWeight: 700,
                        color: '#d2a83d',
                        textDecoration: 'none',
                        fontFamily: "'Playfair Display', serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    🏘️ Town Treasure
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Navigation Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/home"
                        startIcon={<Home size={20} />}
                        sx={{ color: '#666', '&:hover': { color: '#d2a83d' } }}
                    >
                        Home
                    </Button>
                    
                    <Button
                        component={Link}
                        to="/cart"
                        startIcon={<ShoppingCart size={20} />}
                        sx={{ color: '#666', '&:hover': { color: '#d2a83d' } }}
                    >
                        Cart
                    </Button>

                    <Button
                        component={Link}
                        to="/offers"
                        startIcon={<Tag size={18} />}
                        sx={{ color: '#666', '&:hover': { color: '#d2a83d' } }}
                    >
                        Offers
                    </Button>

                    {/* Profile Menu */}
                    <IconButton onClick={handleMenuClick} sx={{ ml: 1 }}>
                        <Avatar 
                            sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: '#d2a83d',
                                color: 'white'
                            }}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: { width: 200, mt: 1 }
                        }}
                    >
                        <MenuItem onClick={handleProfileClick}>
                            <User size={18} style={{ marginRight: 12 }} />
                            Profile
                        </MenuItem>
                        <MenuItem component={Link} to="/orders">
                            <Store size={18} style={{ marginRight: 12 }} />
                            My Orders
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogOut size={18} style={{ marginRight: 12 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;