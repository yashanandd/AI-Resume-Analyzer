import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AnalysisResult } from './pages/AnalysisResult';
import { useAuthStore } from './store/authStore';
import { authService } from './services/authService';

const Landing = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-mono">
        Nexus <span className="gradient-text">AI</span>
      </h1>
      <p className="text-xl text-textMuted max-w-2xl mx-auto font-mono mb-10">
        [ system.initialize() ] — Advanced semantic analysis for your professional identity.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/auth" className="px-8 py-3 rounded-md bg-primary hover:bg-primary/90 text-white font-medium transition-all neon-glow flex items-center gap-2 font-mono">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Initialize Analysis
        </Link>
      </div>
    </motion.div>
  </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const token = useAuthStore(state => state.token);
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [token, setUser, logout]);

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center text-white font-mono">Initializing Nexus...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/30 font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <ProtectedRoute>
              <AnalysisResult />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
