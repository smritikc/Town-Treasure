import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [exchangeRate, setExchangeRate] = useState(133.50);
  const [currency, setCurrency] = useState('NPR'); // 'NPR' or 'USD'
  
  // Fetch real exchange rate (example using free API)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Using a free exchange rate API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRate(data.rates.NPR || 133.50);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Use default rate if API fails
        setExchangeRate(133.50);
      }
    };
    
    fetchExchangeRate();
    // Refresh every hour
    const interval = setInterval(fetchExchangeRate, 3600000);
    return () => clearInterval(interval);
  }, []);

  const convertToNPR = (usdAmount) => {
    return usdAmount * exchangeRate;
  };

  const convertToUSD = (nprAmount) => {
    return nprAmount / exchangeRate;
  };

  const formatPrice = (price) => {
    if (currency === 'USD') {
      return `$${parseFloat(price).toFixed(2)}`;
    } else {
      const nprPrice = convertToNPR(price);
      return `रु ${nprPrice.toLocaleString('ne-NP', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'NPR' : 'USD');
    toast.success(`Switched to ${currency === 'USD' ? 'NPR' : 'USD'}`);
  };

  const value = {
    currency,
    exchangeRate,
    convertToNPR,
    convertToUSD,
    formatPrice,
    toggleCurrency,
    displayBoth: (usdPrice) => ({
      usd: `$${usdPrice.toFixed(2)}`,
      npr: `रु ${convertToNPR(usdPrice).toLocaleString('ne-NP', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    })
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};