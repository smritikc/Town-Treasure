import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Chip,
    Rating,
    // IconButton,
} from '@mui/material';
import {
    Search,
    // Filter,
    ShoppingBag,
    // Heart,
    Star,
    MapPin,
    Truck,
    Shield,
} from 'lucide-react';

// Sample products data
const products = [
    {
        id: 1,
        name: 'Handmade Ceramic Mug',
        description: 'Beautiful hand-painted ceramic mug',
        price: 25.99,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400',
        category: 'Home Decor',
        location: 'Local - 2 miles away',
    },
    {
        id: 2,
        name: 'Organic Raw Honey',
        description: 'Pure raw honey from local bees',
        price: 12.99,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=400',
        category: 'Food',
        location: 'Local - 5 miles away',
    },
    {
        id: 3,
        name: 'Wooden Jewelry Box',
        description: 'Handcrafted wooden box',
        price: 49.99,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=400',
        category: 'Home Decor',
        location: 'Local - 3 miles away',
    },
    {
        id: 4,
        name: 'Hand-knitted Wool Scarf',
        description: 'Warm wool scarf',
        price: 35.99,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400',
        category: 'Clothing',
        location: 'Local - 4 miles away',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Handmade', 'Organic', 'Vintage', 'Art', 'Clothing', 'Home Decor'];

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Hero Section */}
            <Box sx={{ 
                bgcolor: '#d2a83d', 
                borderRadius: 3, 
                p: 4, 
                mb: 4,
                color: 'white',
            }}>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", mb: 2 }}>
                    Discover Local Treasures
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                    Find unique handmade items from artisans in your community
                </Typography>
                
                {/* Search Bar */}
                <Box sx={{ display: 'flex', gap: 1, maxWidth: 600 }}>
                    <TextField
                        fullWidth
                        placeholder="Search handmade products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ 
                            bgcolor: 'white',
                            borderRadius: 1
                        }}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ 
                            bgcolor: 'white', 
                            color: '#d2a83d',
                            minWidth: 'auto',
                            px: 3
                        }}
                    >
                        <Search />
                    </Button>
                </Box>
            </Box>

            {/* Categories */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Categories</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            onClick={() => setSelectedCategory(category)}
                            variant={selectedCategory === category ? 'filled' : 'outlined'}
                            sx={{
                                bgcolor: selectedCategory === category ? '#d2a83d' : 'transparent',
                                color: selectedCategory === category ? 'white' : '#d2a83d',
                                borderColor: '#d2a83d',
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Products Grid */}
            <Typography variant="h4" sx={{ mb: 3, fontFamily: "'Playfair Display', serif" }}>
                Featured Products
            </Typography>
            
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {product.description}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating value={product.rating} precision={0.5} size="small" readOnly />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({product.rating})
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <MapPin size={14} style={{ marginRight: 4 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {product.location}
                                    </Typography>
                                </Box>
                                
                                <Typography variant="h6" color="primary.main">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<ShoppingBag size={18} />}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    sx={{ 
                                        bgcolor: '#d2a83d',
                                        '&:hover': { bgcolor: '#b67d1a' }
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Stats Banner */}
            <Box sx={{ 
                bgcolor: '#f8f9fa', 
                borderRadius: 3, 
                p: 4, 
                mt: 6,
                textAlign: 'center'
            }}>
                <Grid container spacing={4}>
                    <Grid item xs={6} md={3}>
                        <Star size={32} color="#d2a83d" style={{ marginBottom: '12px' }} />
                        <Typography variant="h5" color="primary.main">500+</Typography>
                        <Typography variant="body1">Local Artisans</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <ShoppingBag size={32} color="#d2a83d" style={{ marginBottom: '12px' }} />
                        <Typography variant="h5" color="primary.main">2,000+</Typography>
                        <Typography variant="body1">Products</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Shield size={32} color="#d2a83d" style={{ marginBottom: '12px' }} />
                        <Typography variant="h5" color="primary.main">10K+</Typography>
                        <Typography variant="body1">Happy Customers</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Truck size={32} color="#d2a83d" style={{ marginBottom: '12px' }} />
                        <Typography variant="h5" color="primary.main">100%</Typography>
                        <Typography variant="body1">Local Delivery</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;  // MAKE SURE THIS EXPORT EXISTS!