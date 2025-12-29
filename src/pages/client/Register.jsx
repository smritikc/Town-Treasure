import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Avatar,
    IconButton,
} from '@mui/material';
import { User, Store, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const steps = ['Select Role', 'Account Details', 'Complete'];

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const queryParams = new URLSearchParams(location.search);
    const roleFromUrl = queryParams.get('role') || 'buyer';

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        role: roleFromUrl,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        shopName: '',
        shopDescription: '',
        address: '',
        profileImage: null,
    });

    // Set role from URL when component loads
    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }, [roleFromUrl]);

    const handleNext = () => {
        if (activeStep === 0 && !formData.role) {
            toast.error('Please select a role');
            return;
        }
        if (activeStep === 1) {
            if (!formData.name || !formData.email || !formData.password) {
                toast.error('Please fill all required fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            if (formData.role === 'seller' && !formData.shopName) {
                toast.error('Please enter your shop name');
                return;
            }
        }
        setActiveStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    const handleSubmit = () => {
        // Mock registration
        const userData = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            profileImage: formData.profileImage,
            shopName: formData.shopName,
            phone: formData.phone,
            address: formData.address,
            createdAt: new Date().toISOString(),
        };

        login(userData);
        toast.success(`Registration successful! Welcome as ${formData.role === 'buyer' ? 'Buyer' : 'Seller'}`);
        
        // Redirect based on role
        if (formData.role === 'seller') {
            navigate('/seller/dashboard');
        } else {
            navigate('/home');
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 4 }}>
                        <FormLabel component="legend" sx={{ mb: 3, fontSize: '1.2rem', fontWeight: 'bold' }}>
                            I want to join as:
                        </FormLabel>
                        <RadioGroup
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <Paper 
                                sx={{ 
                                    p: 4, 
                                    mb: 3, 
                                    cursor: 'pointer',
                                    border: formData.role === 'buyer' ? '3px solid #d2a83d' : '1px solid #e0e0e0',
                                    '&:hover': { borderColor: '#d2a83d' }
                                }}
                                onClick={() => setFormData({ ...formData, role: 'buyer' })}
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
                                    border: formData.role === 'seller' ? '3px solid #d2a83d' : '1px solid #e0e0e0',
                                    '&:hover': { borderColor: '#d2a83d' }
                                }}
                                onClick={() => setFormData({ ...formData, role: 'seller' })}
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
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ mt: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ''}
                                        sx={{ 
                                            width: 100, 
                                            height: 100, 
                                            mb: 2,
                                            bgcolor: formData.profileImage ? 'transparent' : '#d2a83d'
                                        }}
                                    >
                                        {!formData.profileImage && <User size={48} />}
                                    </Avatar>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<Upload size={20} />}
                                        sx={{
                                            borderColor: '#d2a83d',
                                            color: '#d2a83d',
                                            '&:hover': {
                                                borderColor: '#b67d1a',
                                                bgcolor: 'rgba(210, 168, 61, 0.1)'
                                            }
                                        }}
                                    >
                                        Upload Profile Photo
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    setFormData({ ...formData, profileImage: e.target.files[0] });
                                                }
                                            }}
                                        />
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            
                            {/* Seller-specific fields */}
                            {formData.role === 'seller' && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mt: 2, mb: 2, color: '#d2a83d' }}>
                                            Shop Information
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shop Name"
                                            value={formData.shopName}
                                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Shop Description"
                                            value={formData.shopDescription}
                                            onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
                                            multiline
                                            rows={3}
                                            placeholder="Tell customers about your shop and products..."
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ mt: 4 }}>
                        <Paper sx={{ p: 4, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom color="primary.main">
                                Registration Summary
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Role:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {formData.role === 'buyer' ? '👤 Buyer' : '🏪 Seller'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Name:</Typography>
                                    <Typography variant="body1">{formData.name}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                                    <Typography variant="body1">{formData.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Phone:</Typography>
                                    <Typography variant="body1">{formData.phone || 'Not provided'}</Typography>
                                </Grid>
                                {formData.role === 'seller' && formData.shopName && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="text.secondary">Shop Name:</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {formData.shopName}
                                            </Typography>
                                        </Grid>
                                        {formData.shopDescription && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary">Shop Description:</Typography>
                                                <Typography variant="body1">{formData.shopDescription}</Typography>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </Paper>

                        <Box sx={{ mt: 4, p: 3, border: '1px dashed #d2a83d', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                By creating an account, you agree to our{' '}
                                <Link to="/terms" style={{ color: '#d2a83d', textDecoration: 'none' }}>
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" style={{ color: '#d2a83d', textDecoration: 'none' }}>
                                    Privacy Policy
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton onClick={() => navigate('/')}>
                        <ArrowLeft />
                    </IconButton>
                    <Typography variant="h4" sx={{ ml: 2, color: '#d2a83d', fontFamily: "'Playfair Display', serif" }}>
                        Join Town Treasure as {formData.role === 'buyer' ? 'Buyer' : 'Seller'}
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {getStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowLeft size={20} />}
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    bgcolor: '#d2a83d',
                                    '&:hover': { bgcolor: '#b67d1a' }
                                }}
                            >
                                Complete Registration
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    bgcolor: '#d2a83d',
                                    '&:hover': { bgcolor: '#b67d1a' }
                                }}
                            >
                                Continue
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Button
                            component={Link}
                            to="/login"
                            variant="text"
                            sx={{ 
                                textTransform: 'none',
                                color: '#d2a83d',
                                fontWeight: 600
                            }}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;