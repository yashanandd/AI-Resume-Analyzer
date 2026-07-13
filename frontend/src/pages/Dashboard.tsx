import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragAndDropZone } from '../components/upload/DragAndDropZone';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { FileText, Activity, Target, LogOut, Eye, Calendar, User as UserIcon, X, Key } from 'lucide-react';
import { resumeService, Resume } from '../services/resumeService';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const setCurrentResume = useResumeStore(state => state.setCurrentResume);
  const navigate = useNavigate();

  // Profile modal and password change states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (newPassword.length < 6) {
      setProfileError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError('New passwords do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setProfileSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Failed to change password. Please check your current password.');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const handleViewResume = (resume: Resume) => {
    setCurrentResume(resume);
    navigate('/analysis');
  };

  const analysesCount = resumes.length;
  const avgAtsScore = analysesCount > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + r.ats_score, 0) / analysesCount)
    : 0;
  const latestReport = resumes.length > 0 ? resumes[resumes.length - 1].filename : 'No analyses yet';

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-background">
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
            <button 
              onClick={() => {
                setIsProfileOpen(true);
                setProfileError('');
                setProfileSuccess('');
              }} 
              className="w-10 h-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors group"
              title="Profile Settings"
            >
              <UserIcon className="w-4 h-4 text-primary group-hover:text-white" />
            </button>
            <button 
              onClick={handleLogout} 
              className="w-10 h-10 rounded-full bg-surface border border-danger/30 flex items-center justify-center hover:bg-danger/20 transition-colors group"
              title="Sign Out"
            >
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
            <Card className="hover:border-primary/45 hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-textMuted">Analyses Run</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{analysesCount}</div>
                <p className="text-xs text-secondary mt-1">Total vectors processed</p>
              </CardContent>
            </Card>
            <Card className="hover:border-accent/45 hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-textMuted">Avg. ATS Score</CardTitle>
                <Target className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{avgAtsScore}%</div>
                <p className="text-xs text-secondary mt-1">Overall compatibility</p>
              </CardContent>
            </Card>
            <Card className="hover:border-secondary/45 hover:-translate-y-0.5 transition-all duration-300">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Zone (Left Column) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold font-mono text-white mb-2">&gt; Initialize New Analysis</h2>
                <p className="text-textMuted text-sm">Upload a new document vector to run the ATS and Skill extraction models.</p>
              </div>
              <DragAndDropZone />
            </div>

            {/* Analysis History Log (Right Column) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold font-mono text-white mb-2">&gt; Vector History Log</h2>
                <p className="text-textMuted text-sm">Previous profile iterations parsed on the Nexus server.</p>
              </div>
              
              <Card className="glass-panel max-h-[480px] overflow-y-auto">
                <CardContent className="p-4 space-y-3">
                  {resumes.length === 0 ? (
                    <div className="py-12 text-center text-textMuted font-mono text-sm border border-dashed border-white/10 rounded-lg">
                      [ No data logs found ]
                    </div>
                  ) : (
                    resumes.map((resume) => {
                      const score = resume.ats_score || 0;
                      let badgeColor = 'bg-danger/10 text-danger border-danger/20';
                      if (score >= 80) badgeColor = 'bg-secondary/10 text-secondary border-secondary/20';
                      else if (score >= 60) badgeColor = 'bg-primary/10 text-primary border-primary/20';

                      return (
                        <div 
                          key={resume.id} 
                          className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/30 hover:bg-white/5 transition-all group hover:translate-x-1"
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded bg-surface border border-white/5 shrink-0">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-white truncate font-mono" title={resume.filename}>
                                {resume.filename}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-textMuted font-mono">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(resume.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-4 shrink-0">
                            <span className={`px-2 py-0.5 border text-xs font-bold font-mono rounded ${badgeColor}`}>
                              {score}%
                            </span>
                            <button
                              onClick={() => handleViewResume(resume)}
                              className="p-1.5 rounded-md bg-surface border border-white/10 hover:border-primary/50 text-textMuted hover:text-white transition-all"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-surface/90 border border-white/10 rounded-xl p-6 shadow-2xl z-10 overflow-hidden font-mono text-xs"
            >
              {/* Premium top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent" />

              {/* Close Button */}
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    [ USER_PROFILE_PARAMETERS ]
                  </h3>
                  <p className="text-[10px] text-textMuted mt-1">Review active vector identity values.</p>
                </div>

                {/* Identity Read-only fields */}
                <div className="p-4 rounded-lg bg-background/50 border border-white/5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-textMuted">FULLNAME_KEY:</span>
                    <span className="text-white font-semibold">{user?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">EMAIL_VECTOR:</span>
                    <span className="text-white font-semibold">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">SYSTEM_ID:</span>
                    <span className="text-white font-semibold">{user?.id || 'N/A'}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-accent" />
                    Modify Security Key
                  </h4>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">CURRENT_PASSWORD_HASH</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">NEW_PASSWORD_VECTOR</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">CONFIRM_NEW_PASSWORD</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    {profileError && (
                      <div className="p-3 text-[10px] font-mono rounded bg-danger/10 border border-danger/20 text-danger animate-shake">
                        [ERROR] {profileError}
                      </div>
                    )}

                    {profileSuccess && (
                      <div className="p-3 text-[10px] font-mono rounded bg-secondary/10 border border-secondary/20 text-secondary">
                        [SUCCESS] {profileSuccess}
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isUpdating}
                      >
                        Commit Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
