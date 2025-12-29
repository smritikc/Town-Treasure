import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { DollarSign, IndianRupee } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <Tooltip title={`Switch to ${currency === 'USD' ? 'NPR' : 'USD'}`}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={toggleCurrency}
          startIcon={currency === 'USD' ? <DollarSign size={16} /> : <IndianRupee size={16} />}
          sx={{
            borderColor: '#d2a83d',
            color: currency === 'USD' ? '#d2a83d' : 'inherit',
            fontWeight: currency === 'USD' ? 'bold' : 'normal'
          }}
        >
          {currency}
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};

export default CurrencyToggle;