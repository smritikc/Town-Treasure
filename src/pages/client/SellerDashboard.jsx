import React, { useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Avatar,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Store,
    Package,
    DollarSign,
    Users,
    TrendingUp,
    Plus,
    Edit,
    Eye,
    Trash2,
    Upload,
} from 'lucide-react';

const SellerDashboard = () => {
        React.useEffect(() => {
            const refresh = () => {
                try {
                    const saved = JSON.parse(localStorage.getItem('products') || 'null');
                    if (saved && Array.isArray(saved) && saved.length) setProducts(saved);
                } catch (e) { /* ignore */ }
            };
            window.addEventListener('products-updated', refresh);
            return () => window.removeEventListener('products-updated', refresh);
        }, []);

        const [products, setProducts] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('products') || 'null');
            if (stored && Array.isArray(stored)) return stored;
        } catch (e) {
            // ignore
        }
        return [
            { id: 1, name: 'Ceramic Mug', price: 25.99, stock: 15, orders: 42, status: 'Active', image: '' },
            { id: 2, name: 'Wooden Box', price: 49.99, stock: 8, orders: 23, status: 'Active', image: '' },
            { id: 3, name: 'Wool Scarf', price: 35.99, stock: 12, orders: 67, status: 'Active', image: '' },
            { id: 4, name: 'Leather Wallet', price: 54.99, stock: 5, orders: 18, status: 'Low Stock', image: '' },
        ];
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewOrder, setViewOrder] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [earningsOpen, setEarningsOpen] = useState(false);

    const handleDeleteProduct = (productId) => {
        setDeleteConfirm(productId);
    };

    const confirmDelete = () => {
        setProducts(products.filter(p => p.id !== deleteConfirm));
        setDeleteConfirm(null);
        alert('Product deleted successfully!');
    };

    const handleViewOrder = (order) => {
        setViewOrder(order);
    };

    const fileInputRef = React.createRef();

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // convert files to data URLs and store
        const readers = files.map(file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        }));

        Promise.all(readers).then(urls => {
            const valid = urls.filter(Boolean);
            if (valid.length) {
                setProductImages(prev => [...prev, ...valid]);
                alert(`${valid.length} image(s) uploaded`);
            }
        }).finally(() => { e.target.value = null; });
    };

    

    const handleOpenEarnings = () => setEarningsOpen(true);
    const handleCloseEarnings = () => setEarningsOpen(false);

    const handleUpdateOrderStatus = (newStatus) => {
        if (!viewOrder) return;
        const updated = orders.map(o => o.id === viewOrder.id ? { ...o, status: newStatus } : o);
        setOrders(updated);
        setViewOrder(prev => prev ? { ...prev, status: newStatus } : prev);
        alert('Order status updated');
    };

    const [orders, setOrders] = useState([
        { id: 'ORD-001', customer: 'John Doe', amount: 85.98, status: 'Delivered', date: '2024-01-15' },
        { id: 'ORD-002', customer: 'Jane Smith', amount: 49.99, status: 'Shipped', date: '2024-01-14' },
        { id: 'ORD-003', customer: 'Bob Wilson', amount: 71.98, status: 'Processing', date: '2024-01-13' },
    ]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProduct({ name: '', price: '', stock: '', description: '' });
    };

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.price && newProduct.stock) {
            const product = {
                id: products.length + 1,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                orders: 0,
                status: 'Active',
                image: productImages[0] || '',
            };
            const updated = [...products, product];
            setProducts(updated);
            try { 
                localStorage.setItem('products', JSON.stringify(updated)); 
                window.dispatchEvent(new Event('products-updated'));
            } catch (e) {}
            handleCloseDialog();
            // clear uploaded images after adding
            setProductImages([]);
            alert('Product added successfully!');
        } else {
            alert('Please fill all required fields');
        }
    };

    const stats = [
        { label: 'Total Sales', value: '$2,458', icon: DollarSign, color: '#28a745' },
        { label: 'Total Orders', value: '150', icon: Package, color: '#007bff' },
        { label: 'Products', value: '24', icon: Store, color: '#d2a83d' },
        { label: 'Customers', value: '89', icon: Users, color: '#6c757d' },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif" }}>
                        <Store size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                        Seller Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Plus />}
                        onClick={handleOpenDialog}
                        sx={{ bgcolor: '#d2a83d' }}
                    >
                        Add New Product
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Manage your shop, products, and orders
                </Typography>
            </Box>

            {/* Simple Summary */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                {stats.map((stat) => (
                    <Box key={stat.label} sx={{ flex: '1 1 200px', p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                        <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Products Section */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5">
                                    Your Products
                                </Typography>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button startIcon={<Upload />} variant="outlined">
                                                    Export
                                                </Button>
                                                <Button startIcon={<Plus />} onClick={handleOpenDialog} variant="contained" sx={{ bgcolor: '#d2a83d' }}>
                                                    Add Product
                                                </Button>
                                            </Box>
                            </Box>
                            
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Stock</TableCell>
                                            <TableCell>Orders</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Typography fontWeight="medium">
                                                        {product.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>${product.price}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>{product.orders}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={product.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: product.status === 'Active' ? '#d4edda' : '#fff3cd',
                                                            color: product.status === 'Active' ? '#155724' : '#856404',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton size="small">
                                                            <Eye size={16} />
                                                        </IconButton>
                                                        <IconButton size="small">
                                                            <Edit size={16} />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Recent Orders
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    <Typography fontWeight="medium">
                                                        {order.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{order.customer}</TableCell>
                                                <TableCell>${order.amount}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={order.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 
                                                                order.status === 'Delivered' ? '#d4edda' :
                                                                order.status === 'Shipped' ? '#cce5ff' :
                                                                '#fff3cd',
                                                            color: 
                                                                order.status === 'Delivered' ? '#155724' :
                                                                order.status === 'Shipped' ? '#004085' :
                                                                '#856404',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>
                                                    <Button size="small" variant="outlined" onClick={() => handleViewOrder(order)}>
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Plus />}
                                    onClick={handleOpenDialog}
                                    sx={{ bgcolor: '#d2a83d' }}
                                >
                                    Add New Product
                                </Button>
                                <>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={handleFilesSelected}
                                    />
                                    <Button variant="outlined" startIcon={<Upload />} onClick={handleUploadClick}>
                                        Upload Product Images
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">{productImages.length} image(s) uploaded</Typography>
                                </>
                                
                                <Button variant="outlined" startIcon={<DollarSign />} onClick={handleOpenEarnings}>
                                    View Earnings
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Shop Status */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Shop Status
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Shop Rating
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h4" sx={{ mr: 1 }}>
                                        4.8
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        (128 reviews)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Performance
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Order Completion</Typography>
                                    <Typography fontWeight="bold">98%</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Response Time</Typography>
                                    <Typography fontWeight="bold">2.4 hrs</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Customer Satisfaction</Typography>
                                    <Typography fontWeight="bold">96%</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Product Name"
                        placeholder="e.g., Ceramic Mug"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        placeholder="e.g., 25.99"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        margin="normal"
                        required
                        inputProps={{ step: '0.01', min: '0' }}
                    />
                    <TextField
                        fullWidth
                        label="Stock Quantity"
                        type="number"
                        placeholder="e.g., 10"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        margin="normal"
                        required
                        inputProps={{ min: '0' }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        placeholder="Product description..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProduct} variant="contained" sx={{ bgcolor: '#d2a83d' }}>
                        Add Product
                    </Button>
                </DialogActions>
            </Dialog>

                    {/* Image upload inside Add Product dialog */}
                    <Box sx={{ mt: 2 }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFilesSelected}
                        />
                        <Button variant="outlined" startIcon={<Upload />} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                            Upload Product Images
                        </Button>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {productImages.map((src, idx) => (
                                <Box key={idx} sx={{ width: 80, height: 80, borderRadius: 1, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                                    <img src={src} alt={`preview-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Order Details Dialog */}
            <Dialog open={viewOrder !== null} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {viewOrder && (
                        <Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                                <Typography variant="body1" fontWeight="bold">{viewOrder.id}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                                <Typography variant="body1">{viewOrder.customer}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                                <Typography variant="body1" fontWeight="bold">${viewOrder.amount}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Chip
                                    label={viewOrder.status}
                                    sx={{
                                        bgcolor: 
                                            viewOrder.status === 'Delivered' ? '#d4edda' :
                                            viewOrder.status === 'Shipped' ? '#cce5ff' :
                                            '#fff3cd',
                                        color: 
                                            viewOrder.status === 'Delivered' ? '#155724' :
                                            viewOrder.status === 'Shipped' ? '#004085' :
                                            '#856404',
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                                <Typography variant="body1">{viewOrder.date}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="order-status-label">Update Status</InputLabel>
                                    <Select
                                        labelId="order-status-label"
                                        value={viewOrder.status}
                                        label="Update Status"
                                        onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                                    >
                                        <MenuItem value="Processing">Processing</MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOrder(null)}>Close</Button>
                    <Button variant="contained" sx={{ bgcolor: '#d2a83d' }}>
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            
        </Container>
    );
};

export default SellerDashboard;