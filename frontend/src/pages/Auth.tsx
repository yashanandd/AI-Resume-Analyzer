import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, Terminal, Cpu } from 'lucide-react';

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
      setError(err.response?.data?.detail || 'An error occurred. Please verify parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background neon effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Terminal Console (Desktop Only) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block lg:col-span-5 h-full"
        >
          <div className="h-[460px] rounded-xl border border-white/10 bg-surface/50 backdrop-blur-md p-6 font-mono text-[11px] text-textMuted flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Terminal className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-bold text-white text-[12px]">NEXUS_SECURE_SHELL</span>
              </div>
              <div className="space-y-2">
                <p className="text-secondary">&gt; system.connect("api.nexus.local")</p>
                <p className="text-textMuted">[OK] Established cryptographic handshake (TLS_AES_256)</p>
                <p className="text-secondary">&gt; database.query("auth_vector_store")</p>
                <p className="text-textMuted">[OK] Loaded active credential mapping indices</p>
                <p className="text-secondary">&gt; user.state_check()</p>
                <p className="text-accent">[ALERT] Awaiting authentication payload...</p>
                <p className="text-textMuted">Please supply security key and email vector parameters in the adjacent form.</p>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px]">
              <span>sys.status: online</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                <span>port: 8000</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 w-full max-w-md mx-auto"
        >
          <Card className="border-white/10 glass-panel shadow-2xl relative">
            {/* Colorful top border edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-secondary"></div>
            
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl gradient-text mb-2 flex items-center justify-center gap-2">
                <Cpu className="w-5 h-5 text-accent shrink-0" />
                {isLogin ? 'Initialize_Session' : 'Create_Identity'}
              </CardTitle>
              <p className="text-xs text-textMuted font-mono">
                {isLogin ? 'Authenticate to access the Nexus' : 'Register your parameters'}
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-danger text-xs font-mono">
                  [!] ERROR: {error}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                      <Input 
                        id="name" 
                        placeholder="Enter your designation" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Vector</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@domain.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Security Key</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" disabled={isLoading}>
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
                  className="text-xs text-textMuted hover:text-white transition-colors font-mono"
                >
                  {isLogin ? '> No identity found? Register' : '> Identity exists? Authenticate'}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};
