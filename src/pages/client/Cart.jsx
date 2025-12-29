import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Select,
    MenuItem,
    FormControl,
    Autocomplete,
    CircularProgress,
} from '@mui/material';
import { Trash2, Minus, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Sample cart items (in real app, this would come from context/state management)
const initialCartItems = [
    {
        id: 1,
        name: 'Handmade Ceramic Mug',
        price: 25.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400',
        seller: 'Ceramic Studio',
    },
    {
        id: 2,
        name: 'Organic Raw Honey',
        price: 12.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=400',
        seller: 'Honey Farm',
    },
    {
        id: 3,
        name: 'Wooden Jewelry Box',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=400',
        seller: 'Wood Crafts',
    },
];

const deliveryLocations = [
    { id: 1, name: 'Home - Main Address', address: '123 Main St, Kathmandu' },
    { id: 2, name: 'Work - Office Address', address: '456 Business Ave, Lalitpur' },
    { id: 3, name: 'Other Address', address: '789 Oak Ln, Pokhara' },
];

const paymentMethods = [
    { id: 'credit_card', label: 'Credit Card' },
    { id: 'debit_card', label: 'Debit Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'apple_pay', label: 'Apple Pay' },
    { id: 'google_pay', label: 'Google Pay' },
    { id: 'cod', label: 'Cash on Delivery (COD)' },
];

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [deliveryLocation, setDeliveryLocation] = useState(deliveryLocations[0]);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(false);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Update item quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
        toast.success('Quantity updated');
    };

    // Delete item
    const deleteItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        toast.success('Item removed from cart');
    };

    // Handle checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Cart is empty');
            return;
        }
        setCheckoutDialogOpen(true);
    };

    // Process order
    const processOrder = () => {
        const selectedLocation = deliveryLocation;
        const selectedPayment = paymentMethods.find(method => method.id === paymentMethod);

        if (!selectedLocation) {
            toast.error('Please select a delivery location');
            return;
        }

        if (!selectedPayment) {
            toast.error('Please select a payment method');
            return;
        }

        const order = {
            items: cartItems,
            subtotal,
            shipping,
            tax,
            total,
            deliveryLocation: selectedLocation,
            paymentMethod: selectedPayment,
            notes: orderNotes,
            orderDate: new Date().toLocaleDateString(),
            orderId: `ORD-${Date.now()}`,
        };

        console.log('Order placed:', order);
        toast.success('Order placed successfully!');
        setCheckoutDialogOpen(false);
        setCartItems([]);
        // Persist order to localStorage (simple demo storage)
        try {
            const existing = JSON.parse(localStorage.getItem('orders') || '[]');
            existing.unshift(order);
            localStorage.setItem('orders', JSON.stringify(existing));
        } catch (e) {
            console.error('Failed to save order', e);
        }

        // Redirect to home page after delay
        setTimeout(() => {
            navigate('/home');
        }, 900);
    };

    // Search locations in Nepal using Nominatim (OpenStreetMap)
    React.useEffect(() => {
        if (!locationQuery || locationQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => {
            setLoadingLocations(true);
            const q = encodeURIComponent(locationQuery + ' Nepal');
            fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=np&limit=6&q=${q}`, {
                signal: controller.signal,
                headers: { 'Accept-Language': 'en' }
            })
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data || []);
                })
                .catch(() => {
                    setSearchResults([]);
                })
                .finally(() => setLoadingLocations(false));
        }, 450);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [locationQuery]);

    if (cartItems.length === 0 && !checkoutDialogOpen) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#d2a83d', color: 'white' }}
                        onClick={() => navigate('/home')}
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#d2a83d' }}>
                Shopping Cart
            </Typography>

            <Grid container spacing={3}>
                {/* Cart Items Table */}
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Price</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                                                />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#999' }}>
                                                        by {item.seller}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            ${item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    sx={{ color: '#d2a83d' }}
                                                >
                                                    <Minus size={16} />
                                                </IconButton>
                                                <TextField
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    inputProps={{ min: 1, style: { textAlign: 'center', width: 40 } }}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    sx={{ color: '#d2a83d' }}
                                                >
                                                    <Plus size={16} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteItem(item.id)}
                                                sx={{ color: '#e74c3c' }}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ position: 'sticky', top: 80 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                                Order Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Subtotal:</Typography>
                                    <Typography>${subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Shipping:</Typography>
                                    <Typography sx={{ color: shipping === 0 ? '#27ae60' : '#666' }}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Tax (8%):</Typography>
                                    <Typography>${tax.toFixed(2)}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Total:</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#d2a83d' }}>
                                    ${total.toFixed(2)}
                                </Typography>
                            </Box>

                            {subtotal <= 100 && subtotal > 0 && (
                                <Typography variant="caption" sx={{ color: '#27ae60', display: 'block', mb: 2 }}>
                                    💡 Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                                </Typography>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleCheckout}
                                sx={{
                                    bgcolor: '#d2a83d',
                                    color: 'white',
                                    fontWeight: 700,
                                    mb: 1,
                                    '&:hover': { bgcolor: '#b67d1a' }
                                }}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                sx={{ color: '#d2a83d', borderColor: '#d2a83d' }}
                            >
                                Continue Shopping
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Checkout Dialog */}
            <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#d2a83d', color: 'white', fontWeight: 700 }}>
                    Complete Your Order
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {/* Delivery Location */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Delivery Location
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            options={searchResults.length ? searchResults : deliveryLocations}
                            getOptionLabel={(option) => option.display_name ? option.display_name : `${option.name} - ${option.address}`}
                            filterOptions={(x) => x}
                            onInputChange={(e, value) => setLocationQuery(value)}
                            value={deliveryLocation}
                            onChange={(e, value) => setDeliveryLocation(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search delivery location in Nepal"
                                    placeholder="Type city or address"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingLocations ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Typography variant="caption" sx={{ color: '#777', mt: 1, display: 'block' }}>
                            Tip: type at least 3 characters to search Nepal locations (uses OpenStreetMap)
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Payment Method */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Payment Method
                    </Typography>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        sx={{ mb: 3 }}
                    >
                        {paymentMethods.map((method) => (
                            <FormControlLabel
                                key={method.id}
                                value={method.id}
                                control={<Radio />}
                                label={method.label}
                            />
                        ))}
                    </RadioGroup>

                    <Divider sx={{ my: 2 }} />

                    {/* Order Notes */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Special Instructions (Optional)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add any special requests or delivery notes..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Divider sx={{ my: 2 }} />

                    {/* Order Summary */}
                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Subtotal:</Typography>
                            <Typography>${subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Shipping:</Typography>
                            <Typography>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Tax:</Typography>
                            <Typography>${tax.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 700 }}>Total:</Typography>
                            <Typography sx={{ fontWeight: 700, color: '#d2a83d' }}>
                                ${total.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCheckoutDialogOpen(false)} sx={{ color: '#666' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={processOrder}
                        variant="contained"
                        sx={{ bgcolor: '#d2a83d', color: 'white' }}
                    >
                        Place Order
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Cart;