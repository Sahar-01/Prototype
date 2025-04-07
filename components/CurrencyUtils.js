export const currencyRates = {
    USD: 1,
    GBP: 0.79,
    EUR: 0.92,
  };
  
  export function convertCurrency(amount, targetCurrency) {
    const rate = currencyRates[targetCurrency] || 1;
    return (parseFloat(amount) * rate).toFixed(2);
  }
  