import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    FormLabel
} from '@mui/material';
import { ShoppingBag, Store, Shield, Truck, Star, User, ArrowRight, X } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState('buyer');

    const handleRoleSelection = () => {
        // Directly navigate to registration with selected role
        navigate(`/register?role=${selectedRole}`);
        setOpenRoleDialog(false);
    };

    const handleRegisterClick = () => {
        setOpenRoleDialog(true);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        // Option 1: Navigate immediately when role is selected
        navigate(`/register?role=${role}`);
        setOpenRoleDialog(false);
        
        // OR Option 2: Keep the dialog and let user click "Continue"
        // setSelectedRole(role);
    };

    // Optional: Auto-redirect based on button clicks
    const handleBuyerClick = () => {
        navigate('/register?role=buyer');
    };

    const handleSellerClick = () => {
        navigate('/register?role=seller');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#faf4e6' }}>
            {/* Hero Section */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #d2a83d 0%, #b67d1a 100%)',
                color: 'white',
                py: 12,
                textAlign: 'center'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 3
                    }}>
                        🏘️ Town Treasure
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 4, opacity: 0.9 }}>
                        Your Local Marketplace for Handmade Treasures
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
                        Connect with local artisans, discover unique handmade items, 
                        and support your community's creativity
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleBuyerClick}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#d2a83d',
                                '&:hover': { bgcolor: '#f8f9fa' },
                                minWidth: 200
                            }}
                            startIcon={<ShoppingBag />}
                        >
                            Start Shopping as Buyer
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large"
                            onClick={handleSellerClick}
                            sx={{ 
                                borderColor: 'white', 
                                color: 'white',
                                '&:hover': { 
                                    borderColor: '#f8f9fa',
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                },
                                minWidth: 200
                            }}
                            startIcon={<Store />}
                        >
                            Become a Seller
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    mb: 6
                }}>
                    Why Choose Town Treasure?
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
                    {[
                        { icon: <Store />, title: 'Local Artisans', desc: 'Support local creators in your community' },
                        { icon: <Shield />, title: 'Secure Transactions', desc: 'Safe and reliable payment processing' },
                        { icon: <Truck />, title: 'Local Delivery', desc: 'Fast delivery within your town' },
                        { icon: <Star />, title: 'Quality Guarantee', desc: 'Handpicked quality items' }
                    ].map((feature, index) => (
                        <Paper key={index} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <Box sx={{ color: '#d2a83d', mb: 2 }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {feature.desc}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Container>

            {/* Role Selection Dialog */}
            <Dialog 
                open={openRoleDialog} 
                onClose={() => setOpenRoleDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    bgcolor: '#d2a83d', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6">Join Town Treasure</Typography>
                    <IconButton onClick={() => setOpenRoleDialog(false)} sx={{ color: 'white' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <FormLabel component="legend" sx={{ mb: 3, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        I want to join as:
                    </FormLabel>
                    <RadioGroup
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                    >
                        <Paper 
                            sx={{ 
                                p: 4, 
                                mb: 3, 
                                cursor: 'pointer',
                                border: selectedRole === 'buyer' ? '3px solid #d2a83d' : '1px solid #e0e0e0',
                                '&:hover': { borderColor: '#d2a83d' }
                            }}
                            onClick={() => handleRoleChange('buyer')}
                        >
                            <FormControlLabel
                                value="buyer"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <User size={32} />
                                        <Box>
                                            <Typography variant="h5" gutterBottom>
                                                Buyer
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Browse and purchase unique local products from artisans
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        </Paper>
                        <Paper 
                            sx={{ 
                                p: 4, 
                                cursor: 'pointer',
                                border: selectedRole === 'seller' ? '3px solid #d2a83d' : '1px solid #e0e0e0',
                                '&:hover': { borderColor: '#d2a83d' }
                            }}
                            onClick={() => handleRoleChange('seller')}
                        >
                            <FormControlLabel
                                value="seller"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Store size={32} />
                                        <Box>
                                            <Typography variant="h5" gutterBottom>
                                                Seller
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Sell your handmade creations to local buyers in your community
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        </Paper>
                    </RadioGroup>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpenRoleDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleRoleSelection}
                        sx={{
                            bgcolor: '#d2a83d',
                            '&:hover': { bgcolor: '#b67d1a' }
                        }}
                        endIcon={<ArrowRight />}
                    >
                        Continue to Registration
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Call to Action */}
            <Box sx={{ bgcolor: '#212529', color: 'white', py: 8, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Playfair Display', serif" }}>
                        Ready to Join Our Community?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Thousands of buyers and sellers are already connected
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{ 
                                bgcolor: '#d2a83d',
                                '&:hover': { bgcolor: '#b67d1a' }
                            }}
                        >
                            Login to Existing Account
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large"
                            onClick={handleRegisterClick}
                            sx={{ 
                                borderColor: 'white', 
                                color: 'white',
                                '&:hover': { borderColor: '#f8f9fa' }
                            }}
                        >
                            Create New Account
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;