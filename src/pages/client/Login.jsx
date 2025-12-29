import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Divider,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const params = new URLSearchParams(location.search);
    const roleFromUrl = params.get('role') || 'buyer';
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mock login for demo
        if (formData.email && formData.password) {
            const mockUser = {
                id: '1',
                name: 'Demo User',
                email: formData.email,
                role: roleFromUrl,
                profileImage: '',
                cart: [],
            };
            
            login(mockUser);
            toast.success('Login successful!');
            if (roleFromUrl === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/home');
            }
        } else {
            toast.error('Please fill all fields');
        }
    };
    

    const handleGoogleLogin = () => {
        // Mock Google login
        const mockUser = {
            id: '2',
            name: 'Google User',
            email: 'user@gmail.com',
            role: roleFromUrl,
            profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
            cart: [],
        };
        
        login(mockUser);
        toast.success('Google login successful!');
        if (roleFromUrl === 'seller') {
            navigate('/seller/dashboard');
        } else {
            navigate('/home');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <ShoppingBag size={32} color="#d2a83d" />
                        <Typography variant="h4" sx={{ ml: 2, color: '#d2a83d', fontFamily: "'Playfair Display', serif" }}>
                            Town Treasure
                        </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography color="text.secondary">
                        Sign in to your account to continue
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Mail size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock size={20} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                        <Button component={Link} to="/forgot-password" size="small" sx={{ textTransform: 'none' }}>
                            Forgot password?
                        </Button>
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ 
                            mt: 2,
                            bgcolor: '#d2a83d',
                            '&:hover': {
                                bgcolor: '#b67d1a',
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </form>

                <Divider sx={{ my: 4 }}>
                    <Typography color="text.secondary">Or continue with</Typography>
                </Divider>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={handleGoogleLogin}
                        sx={{
                            borderColor: '#ddd',
                            color: '#333',
                            '&:hover': {
                                borderColor: '#d2a83d',
                                bgcolor: 'rgba(210, 168, 61, 0.1)'
                            }
                        }}
                    >
                        <img 
                            src="https://www.google.com/favicon.ico" 
                            alt="Google" 
                            style={{ width: 20, height: 20, marginRight: 12 }}
                        />
                        Continue with Google
                    </Button>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Button
                            component={Link}
                            to="/register"
                            variant="text"
                            sx={{ 
                                textTransform: 'none',
                                color: '#d2a83d',
                                fontWeight: 600
                            }}
                        >
                            Sign up
                        </Button>
                    </Typography>
                </Box>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Want to sell on Town Treasure?{' '}
                        <Button
                            component={Link}
                            to="/register?role=seller"
                            variant="text"
                            sx={{ 
                                textTransform: 'none',
                                color: '#d2a83d',
                                fontWeight: 600
                            }}
                        >
                            Become a seller
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;