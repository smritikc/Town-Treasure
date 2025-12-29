import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('town_treasure_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('town_treasure_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('town_treasure_user');
        // We'll handle navigation in components using useNavigate
    };

    const switchRole = () => {
        if (user) {
            const newRole = user.role === 'buyer' ? 'seller' : 'buyer';
            const updatedUser = { ...user, role: newRole };
            setUser(updatedUser);
            localStorage.setItem('town_treasure_user', JSON.stringify(updatedUser));
        }
    };

    const updateCart = (cartItems) => {
        if (user) {
            const updatedUser = { ...user, cart: cartItems };
            setUser(updatedUser);
            localStorage.setItem('town_treasure_user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        switchRole,
        updateCart,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};