import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Cpu, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AnalysisResult } from './pages/AnalysisResult';
import { useAuthStore } from './store/authStore';
import { authService } from './services/authService';

const Landing = () => (
  <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
    {/* Floating Cyber Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

    {/* Header */}
    <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center neon-glow">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg font-mono text-white tracking-wider">NEXUS_AI</span>
          <span className="text-[9px] block text-primary font-mono tracking-widest">[ VER_2.5.F ]</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-textMuted">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
          <span>core.status: operational</span>
        </div>
        <Link to="/auth" className="px-4 py-2 rounded bg-surface border border-white/10 hover:border-primary/50 text-white font-mono text-sm transition-all hover:bg-white/5">
          [ AUTHENTICATE ]
        </Link>
      </div>
    </header>

    {/* Hero Section */}
    <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 flex-grow">
      {/* Left Column */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7 space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LLM-POWERED SEMANTIC RESUME PARSING</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
          Audit your profile against <span className="gradient-text">ATS algorithms</span> in real-time
        </h1>
        
        <p className="text-base sm:text-lg text-textMuted max-w-xl font-mono leading-relaxed">
          Nexus parses technical resume vectors, matches missing core criteria, and runs compatibility scoring using Generative AI parameters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/auth" className="px-8 py-4 rounded-md bg-primary hover:bg-primary/90 text-white font-medium transition-all neon-glow flex items-center justify-center gap-2 font-mono group">
            Initialize Analysis Vector
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-md bg-surface hover:bg-white/5 border border-white/10 text-textMuted hover:text-white font-medium transition-all flex items-center justify-center gap-2 font-mono">
            View Parameters
          </a>
        </div>
      </motion.div>

      {/* Right Column (Visual Preview) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:col-span-5 w-full flex justify-center"
      >
        <div className="w-full max-w-md relative">
          {/* Neon shadow box behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative rounded-xl border border-white/10 bg-surface/80 backdrop-blur-xl p-6 shadow-2xl space-y-6 font-mono text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              </div>
              <span className="text-[10px] text-textMuted">system_analysis.log</span>
            </div>

            <div className="space-y-3">
              <div className="text-textMuted">&gt; loading profile_vector_draft.pdf...</div>
              <div className="text-secondary">&gt; parsing completed [200 OK]</div>
            </div>

            {/* Simulated Stats card */}
            <div className="p-4 rounded-lg bg-background/50 border border-white/5 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="text-[10px] text-textMuted uppercase tracking-wider">ATS MATCH_RATING</div>
                <div className="text-lg font-bold text-white">85.4% COMPATIBLE</div>
              </div>
              {/* Fake progress ring */}
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>

            <div className="space-y-2">
              <div className="text-textMuted">&gt; structural_improvements:</div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-primary">+</span> Add Docker / AWS cloud projects
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-primary">+</span> Quantify business metrics by +15%
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>

    {/* Features Grid */}
    <section id="features" className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-white/5 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-white/5 bg-surface/40 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">01 / ATS Scorer</h3>
          <p className="text-sm text-textMuted leading-relaxed">
            Extracts structural metadata and counts syntax parameters to output clean compatibility ratings.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/5 bg-surface/40 backdrop-blur-sm space-y-4 hover:border-accent/30 transition-all hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">02 / Semantic Mining</h3>
          <p className="text-sm text-textMuted leading-relaxed">
            Identifies gap keywords (e.g. cloud patterns, deployment layers) missing from your workspace profile.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-white/5 bg-surface/40 backdrop-blur-sm space-y-4 hover:border-secondary/30 transition-all hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">03 / Action Suggestions</h3>
          <p className="text-sm text-textMuted leading-relaxed">
            Get targeted micro-enhancements parsed directly by Gemini to boost resume-to-role matching parameters.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="w-full border-t border-white/5 py-6 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-textMuted">
        <p>© 2026 NEXUS AI. All systems online.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">SECURITY_POLICY</a>
          <a href="#" className="hover:text-white transition-colors">API_DOCS</a>
        </div>
      </div>
    </footer>
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
