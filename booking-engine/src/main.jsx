import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import reduxStore from './store/reduxStore';
import App from './App.jsx';
import { AuthProvider } from './features/auth/AuthContext';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1, // Retry failed requests once before showing an error
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={reduxStore}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    </StrictMode>
);