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
import { User, Store, Upload, ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const steps = ['Select Role', 'Account Details', 'Complete'];

// Email validation regex pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Password validation regex pattern (minimum 8 chars, at least one letter and one number)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

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

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [touchedFields, setTouchedFields] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        phone: false,
    });

    // Set role from URL when component loads
    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }, [roleFromUrl]);

    // Validate email
    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        if (email.length > 254) return 'Email is too long';
        return '';
    };

    // Validate password
    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!passwordRegex.test(password)) return 'Password must contain at least one letter and one number';
        return '';
    };

    // Validate confirm password
    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== formData.password) return 'Passwords do not match';
        return '';
    };

    // Validate phone number (optional, but validate if provided)
    const validatePhone = (phone) => {
        if (!phone) return ''; // Phone is optional
       const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
       if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
            return 'Please enter a valid phone number';
        }
        return '';
    };

    // Handle field change with validation
    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validate immediately if field has been touched
        if (touchedFields[field]) {
            let error = '';
            switch (field) {
                case 'email':
                    error = validateEmail(value);
                    break;
                case 'password':
                    error = validatePassword(value);
                    // Also re-validate confirm password if password changes
                    if (touchedFields.confirmPassword) {
                        setValidationErrors(prev => ({
                            ...prev,
                            confirmPassword: validateConfirmPassword(formData.confirmPassword)
                        }));
                    }
                    break;
                case 'confirmPassword':
                    error = validateConfirmPassword(value);
                    break;
                case 'phone':
                    error = validatePhone(value);
                    break;
                default:
                    break;
            }
            setValidationErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // Handle field blur (when user leaves the field)
    const handleFieldBlur = (field) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
        
        let error = '';
        switch (field) {
            case 'email':
                error = validateEmail(formData.email);
                break;
            case 'password':
                error = validatePassword(formData.password);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(formData.confirmPassword);
                break;
            case 'phone':
                error = validatePhone(formData.phone);
                break;
            default:
                break;
        }
        setValidationErrors(prev => ({ ...prev, [field]: error }));
    };

    // Check if all fields in current step are valid
    const isStepValid = () => {
        if (activeStep === 1) {
            const errors = {
                email: validateEmail(formData.email),
                password: validatePassword(formData.password),
                confirmPassword: validateConfirmPassword(formData.confirmPassword),
                phone: validatePhone(formData.phone),
            };
            
            // Check if there are any validation errors
            const hasErrors = Object.values(errors).some(error => error !== '');
            
            // Check required fields
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                return false;
            }
            
            // Check seller-specific required field
            if (formData.role === 'seller' && !formData.shopName) {
                return false;
            }
            
            return !hasErrors;
        }
        return true;
    };

    const handleNext = () => {
        if (activeStep === 0 && !formData.role) {
            toast.error('Please select a role');
            return;
        }
        
        if (activeStep === 1) {
            // Mark all fields as touched to show errors
            setTouchedFields({
                email: true,
                password: true,
                confirmPassword: true,
                phone: true,
            });
            
            // Validate all fields
            const errors = {
                email: validateEmail(formData.email),
                password: validatePassword(formData.password),
                confirmPassword: validateConfirmPassword(formData.confirmPassword),
                phone: validatePhone(formData.phone),
            };
            
            setValidationErrors(errors);
            
            // Check for errors
            const hasErrors = Object.values(errors).some(error => error !== '');
            
            if (!formData.name) {
                toast.error('Please enter your name');
                return;
            }
            
            if (!formData.email) {
                toast.error('Please enter your email');
                return;
            }
            
            if (!formData.password) {
                toast.error('Please enter a password');
                return;
            }
            
            if (!formData.confirmPassword) {
                toast.error('Please confirm your password');
                return;
            }
            
            if (hasErrors) {
                toast.error('Please fix the validation errors');
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

    // Helper component for validation feedback
    const ValidationFeedback = ({ isValid, message }) => (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mt: 0.5,
            fontSize: '0.75rem',
            color: isValid ? '#4caf50' : '#f44336'
        }}>
            {isValid ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {message}
        </Box>
    );

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
                                    error={touchedFields.name && !formData.name}
                                    helperText={touchedFields.name && !formData.name ? 'Name is required' : ''}
                                    onBlur={() => setTouchedFields(prev => ({ ...prev, name: true }))}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    onBlur={() => handleFieldBlur('email')}
                                    error={touchedFields.email && !!validationErrors.email}
                                    helperText={touchedFields.email && validationErrors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <Mail size={20} style={{ marginRight: 8, color: '#666' }} />
                                        ),
                                    }}
                                />
                                {formData.email && touchedFields.email && !validationErrors.email && (
                                    <ValidationFeedback 
                                        isValid={true} 
                                        message="Valid email address" 
                                    />
                                )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleFieldChange('password', e.target.value)}
                                    onBlur={() => handleFieldBlur('password')}
                                    error={touchedFields.password && !!validationErrors.password}
                                    helperText={touchedFields.password && validationErrors.password}
                                />
                                {formData.password && touchedFields.password && !validationErrors.password && (
                                    <ValidationFeedback 
                                        isValid={true} 
                                        message="Strong password" 
                                    />
                                )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                                    onBlur={() => handleFieldBlur('confirmPassword')}
                                    error={touchedFields.confirmPassword && !!validationErrors.confirmPassword}
                                    helperText={touchedFields.confirmPassword && validationErrors.confirmPassword}
                                />
                                {formData.confirmPassword && touchedFields.confirmPassword && !validationErrors.confirmPassword && (
                                    <ValidationFeedback 
                                        isValid={true} 
                                        message="Passwords match" 
                                    />
                                )}
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    onBlur={() => handleFieldBlur('phone')}
                                    error={touchedFields.phone && !!validationErrors.phone}
                                    helperText={touchedFields.phone && validationErrors.phone}
                                    placeholder="+1 (555) 123-4567"
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
                                    placeholder="Street, City, State, ZIP Code"
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
                                            error={touchedFields.shopName && !formData.shopName}
                                            helperText={touchedFields.shopName && !formData.shopName ? 'Shop name is required for sellers' : ''}
                                            onBlur={() => setTouchedFields(prev => ({ ...prev, shopName: true }))}
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
                        
                        {/* Password Requirements Info */}
                        <Paper sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                Password Requirements:
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {formData.password.length >= 8 ? 
                                            <CheckCircle size={14} color="#4caf50" /> : 
                                            <XCircle size={14} color="#f44336" />
                                        }
                                        <Typography variant="caption">8+ characters</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {/[A-Za-z]/.test(formData.password) ? 
                                            <CheckCircle size={14} color="#4caf50" /> : 
                                            <XCircle size={14} color="#f44336" />
                                        }
                                        <Typography variant="caption">One letter</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {/\d/.test(formData.password) ? 
                                            <CheckCircle size={14} color="#4caf50" /> : 
                                            <XCircle size={14} color="#f44336" />
                                        }
                                        <Typography variant="caption">One number</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
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
                                    <Typography variant="body1">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {formData.email}
                                            {emailRegex.test(formData.email) && 
                                                <CheckCircle size={16} color="#4caf50" />
                                            }
                                        </Box>
                                    </Typography>
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
                                disabled={activeStep === 1 && !isStepValid()}
                                sx={{
                                    bgcolor: '#d2a83d',
                                    '&:hover': { bgcolor: '#b67d1a' },
                                    '&.Mui-disabled': {
                                        bgcolor: '#e0e0e0'
                                    }
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