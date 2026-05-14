import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setToken = useAuthStore(state => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await authService.login(email, password);
        setToken(data.access_token);
        navigate('/dashboard');
      } else {
        await authService.signup(email, password, name);
        // After signup, log them in automatically
        const data = await authService.login(email, password);
        setToken(data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background neon effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-white/20 glass-panel">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl gradient-text mb-2">
              {isLogin ? 'Initialize_Session' : 'Create_Identity'}
            </CardTitle>
            <p className="text-sm text-textMuted font-mono">
              {isLogin ? 'Authenticate to access the Nexus' : 'Register your parameters'}
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm font-mono">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your designation" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Vector</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Security Key</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full mt-4" size="lg" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLogin ? 'Execute Login' : 'Execute Registration')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-textMuted hover:text-white transition-colors font-mono"
              >
                {isLogin ? '> No identity found? Register' : '> Identity exists? Authenticate'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
