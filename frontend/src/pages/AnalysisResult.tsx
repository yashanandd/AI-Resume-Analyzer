import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ATSScoreRing } from '../components/dashboard/ATSScoreRing';
import { Target, AlertTriangle, Lightbulb, CheckCircle, ArrowLeft } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

export const AnalysisResult = () => {
  const currentResume = useResumeStore(state => state.currentResume);
  const navigate = useNavigate();
  const [data, setData] = useState<{
    score: number;
    role: string;
    missingKeywords: string[];
    suggestions: string[];
    skills: string[];
  } | null>(null);

  useEffect(() => {
    if (!currentResume) {
      navigate('/dashboard');
      return;
    }

    try {
      const parsedFeedback = JSON.parse(currentResume.ai_feedback);
      setData({
        score: currentResume.ats_score,
        role: "Target Role", // We didn't persist the job_role in the model directly, but feedback is based on it
        missingKeywords: parsedFeedback.missing_keywords || [],
        suggestions: parsedFeedback.suggestions || [],
        skills: parsedFeedback.matched_skills || [],
      });
    } catch (e) {
      console.error("Failed to parse AI feedback", e);
    }
  }, [currentResume, navigate]);

  if (!data) return <div className="min-h-screen flex items-center justify-center text-white font-mono">Initializing Analysis Data...</div>;

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="pb-6 border-b border-white/10 relative">
          <button 
            onClick={() => navigate('/dashboard')}
            className="absolute left-0 top-0 -mt-2 -ml-2 p-2 text-textMuted hover:text-white transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="ml-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary font-mono text-sm">&gt; result_computed</span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </div>
            <h1 className="text-3xl font-bold font-mono text-white">Analysis Output</h1>
            <p className="text-textMuted font-mono text-sm mt-1">File: {currentResume?.filename}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Score & Skills */}
          <div className="space-y-8 lg:col-span-1">
            <Card className="glass-panel text-center flex flex-col items-center p-8">
              <h3 className="text-lg font-mono text-textMuted mb-6 text-left w-full">ATS Compatibility</h3>
              <ATSScoreRing score={data.score} />
              <p className="mt-6 text-sm text-textMuted max-w-[200px]">
                Your profile vector has been analyzed against industry standards.
              </p>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Extracted Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-surface border border-white/10 rounded-full text-xs font-mono text-white">
                      {skill}
                    </span>
                  ))}
                  {data.skills.length === 0 && <span className="text-textMuted text-sm italic">No specific skills matched.</span>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="border-danger/20 bg-danger/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-danger">
                  <AlertTriangle className="w-5 h-5" />
                  Missing Parameters (Keywords)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-danger/10 border border-danger/20 text-danger rounded-md text-sm font-mono">
                      + {kw}
                    </span>
                  ))}
                  {data.missingKeywords.length === 0 && <span className="text-textMuted text-sm">No critical keywords missing!</span>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Lightbulb className="w-5 h-5" />
                  Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.suggestions.map((suggestion, i) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex items-start gap-3 bg-surface/50 p-4 rounded-lg border border-primary/10"
                    >
                      <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/90 leading-relaxed font-mono">{suggestion}</p>
                    </motion.li>
                  ))}
                  {data.suggestions.length === 0 && <span className="text-textMuted text-sm italic">No specific suggestions provided.</span>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
