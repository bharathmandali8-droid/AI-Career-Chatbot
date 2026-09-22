import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { LiquidBackground } from './components/LiquidBackground';
import { ChatHistorySidebar } from './components/ChatHistorySidebar';
import { ChatWindow } from './components/ChatWindow';
import { ContextModal } from './components/ContextModal';
import { LoginPage } from './components/LoginPage';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-mono text-sm">
        Initializing Spatial Studio Engine...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="relative min-h-screen flex text-slate-900 dark:text-slate-100 font-sans z-10">
      <ChatHistorySidebar />
      <ChatWindow />
      <ContextModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <div className="relative min-h-screen">
            <LiquidBackground />
            <MainLayout />
          </div>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
