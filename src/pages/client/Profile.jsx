import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { themeMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update user in context
      updateUser({ name: username, email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#d2a83d' }}>
        My Profile
      </Typography>

      {/* Profile Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#d2a83d',
                color: 'white',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>
                {user?.role === 'seller' ? '🏪 Seller' : '👤 Buyer'}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" sx={{ color: '#666' }}>
            Member since {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Edit Profile
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#d2a83d',
                },
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            disabled
            variant="outlined"
            helperText="Email cannot be changed"
            sx={{
              '& .MuiOutlinedInput-root.Mui-disabled': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Save size={20} />}
            onClick={handleSaveProfile}
            disabled={isSaving || username === user?.name}
            sx={{
              bgcolor: '#d2a83d',
              color: 'white',
              fontWeight: 700,
              '&:hover': { bgcolor: '#b67d1a' },
              '&:disabled': { bgcolor: '#ccc' },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      {/* Theme Preference */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Appearance
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {themeMode === 'dark' ? (
              <Moon size={20} color="#d2a83d" />
            ) : (
              <Sun size={20} color="#d2a83d" />
            )}
            <Typography>
              {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Typography>
          </Box>
          <Switch
            checked={themeMode === 'dark'}
            onChange={toggleTheme}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#d2a83d',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#d2a83d',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Account Actions */}
      <Paper sx={{ p: 3, bgcolor: '#fef5e7' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Account
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogOut size={20} />}
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            color: '#e74c3c',
            borderColor: '#e74c3c',
            fontWeight: 700,
            '&:hover': {
              bgcolor: '#ffebee',
              borderColor: '#e74c3c',
            },
          }}
        >
          Logout
        </Button>
      </Paper>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{ bgcolor: '#e74c3c', color: 'white' }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
