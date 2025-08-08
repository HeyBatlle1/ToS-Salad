import React from 'react';
import AppRoutes from './routes/AppRoutes';
import AppLayout from './layouts/AppLayout';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;