import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const sampleOffers = [
  { id: 1, title: '10% off on Handmade Goods', desc: 'Use code HAND10 at checkout', validUntil: '2026-01-31' },
  { id: 2, title: 'Free Shipping over NPR 5000', desc: 'Automatic at checkout', validUntil: '2026-03-01' },
];

const Offers = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#d2a83d' }}>Offers & Promotions</Typography>
      <Grid container spacing={2}>
        {sampleOffers.map(o => (
          <Grid item xs={12} md={6} key={o.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{o.title}</Typography>
                <Typography sx={{ mb: 2 }}>{o.desc}</Typography>
                <Typography variant="caption">Valid until: {o.validUntil}</Typography>
                <Button sx={{ mt: 2 }} variant="contained">Apply</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Offers;
