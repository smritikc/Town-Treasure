// ALL IMPORTS MUST BE AT THE VERY TOP
import React, { useState, useEffect } from 'react';
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
    IconButton,
} from '@mui/material';
import {
    Search,
    Filter,
    ShoppingBag,
    Heart,
    Star,
    MapPin,
    Truck,
    Shield,
} from 'lucide-react';

// Sample products data
const defaultProducts = [
    // ... your products data
];

const Home = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [productsList, setProductsList] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('products') || 'null');
            if (saved && Array.isArray(saved) && saved.length) return saved;
        } catch (e) {
            // ignore
        }
        return defaultProducts;
    });

    // This useEffect should be INSIDE the component, after state
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/products`)
            .then(r => r.json())
            .then(setProductsList)
            .catch(() => setProductsList(defaultProducts));
    }, []);

    useEffect(() => {
        const refresh = () => {
            try {
                const saved = JSON.parse(localStorage.getItem('products') || 'null');
                if (saved && Array.isArray(saved) && saved.length) setProductsList(saved);
            } catch (e) { }
        };
        window.addEventListener('products-updated', refresh);
        return () => window.removeEventListener('products-updated', refresh);
    }, []);

    // ... rest of your component
};

export default Home;