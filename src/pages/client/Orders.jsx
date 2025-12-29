import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(saved);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  const handleRefresh = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(saved);
    } catch (e) {
      setOrders([]);
    }
  };

  const handleCancel = (orderId) => {
    const remaining = orders.filter(o => o.orderId !== orderId);
    setOrders(remaining);
    localStorage.setItem('orders', JSON.stringify(remaining));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#d2a83d' }}>My Orders</Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>No orders found.</Typography>
          <Button sx={{ mt: 2 }} variant="contained" href="/home">Continue Shopping</Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleRefresh}>Refresh</Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Delivery</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>
                      {order.items.map(i => (
                        <div key={i.id}>{i.name} x{i.quantity}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order.deliveryLocation?.display_name || order.deliveryLocation?.name || 'N/A'}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => setViewOrder(order)}>View</Button>
                      <Button size="small" color="error" onClick={() => handleCancel(order.orderId)}>Cancel</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              {viewOrder && (
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Order ID: {viewOrder.orderId}</Typography>
                  <Typography sx={{ mb: 1 }}>Date: {viewOrder.orderDate}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ fontWeight: 700, mt: 1 }}>Items</Typography>
                  {viewOrder.items.map(i => (
                    <Box key={i.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <div>{i.name} x{i.quantity}</div>
                      <div>${(i.price * i.quantity).toFixed(2)}</div>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ fontWeight: 700 }}>Delivery</Typography>
                  <Typography>{viewOrder.deliveryLocation?.display_name || viewOrder.deliveryLocation?.name}</Typography>

                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ fontWeight: 700 }}>Total: ${viewOrder.total.toFixed(2)}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewOrder(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Orders;
