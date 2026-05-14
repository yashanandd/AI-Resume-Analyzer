import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DragAndDropZone } from '../components/upload/DragAndDropZone';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { FileText, Activity, Target, LogOut } from 'lucide-react';
import { resumeService, Resume } from '../services/resumeService';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeService.getResumes();
        setResumes(data);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const analysesCount = resumes.length;
  const avgAtsScore = analysesCount > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + r.ats_score, 0) / analysesCount)
    : 0;
  const latestReport = resumes.length > 0 ? resumes[resumes.length - 1].filename : 'No analyses yet';

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background neon effect */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex justify-between items-center pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Nexus <span className="text-primary">Dashboard</span></h1>
            <p className="text-textMuted text-sm font-mono">[ system.status: online ]</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.full_name || 'Authorized User'}</p>
              <p className="text-xs text-textMuted font-mono">user_id: {user?.id || 'unknown'}</p>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-surface border border-danger/30 flex items-center justify-center hover:bg-danger/20 transition-colors group">
              <LogOut className="w-4 h-4 text-danger group-hover:text-white" />
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-primary font-mono animate-pulse">
            Loading metrics...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-textMuted">Analyses Run</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{analysesCount}</div>
                <p className="text-xs text-secondary mt-1">Total vectors processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-textMuted">Avg. ATS Score</CardTitle>
                <Target className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{avgAtsScore}%</div>
                <p className="text-xs text-secondary mt-1">Overall compatibility</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-textMuted">Latest Report</CardTitle>
                <FileText className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-sm truncate">{latestReport}</div>
                <p className="text-xs text-textMuted mt-1 font-mono">Most recent file</p>
              </CardContent>
            </Card>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold font-mono text-white mb-2">&gt; Initialize New Analysis</h2>
            <p className="text-textMuted text-sm">Upload a new document vector to run the ATS and Skill extraction models.</p>
          </div>
          
          <DragAndDropZone />
        </motion.div>
      </div>
    </div>
  );
};
