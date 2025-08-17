import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';
import { InventoryProvider } from './context/InventoryContext';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider>
          <InventoryProvider>
            <div className="min-h-screen">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <AppRoutes />
            </div>
          </InventoryProvider>
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;