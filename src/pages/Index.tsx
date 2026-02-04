import React from 'react';
import { AppProvider } from '../contexts/AppContext';
import AppLayout from '../components/AppLayout';
// import AppLayout from '@/components/AppLayout';
// import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
