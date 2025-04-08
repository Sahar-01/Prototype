import React from 'react';
import AppNavigator from './components/AppNavigator';
import { CurrencyProvider } from './components/CurrencyContext'; 

const App = () => {
  return (
    <CurrencyProvider> 
      <AppNavigator />
    </CurrencyProvider>
  );
};

export default App;
