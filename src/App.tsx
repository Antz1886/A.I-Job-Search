/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  RefreshCw,
  LayoutDashboard,
  Target,
  FileText,
  Zap,
  User,
  Save,
  ChevronRight,
  Filter,
  BarChart3,
  Globe,
  Bookmark,
  BookmarkCheck,
  EyeOff,
  Plus,
  X,
  Download,
  Award,
  Sparkles,
  Share2,
  Check,
  Trash2,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  Calendar,
  CheckSquare,
  Menu
} from 'lucide-react';
import { 
  generateDailyReport, 
  generateATSAnalysis, 
  generateJobSpecificATS,
  CANDIDATE_PROFILE, 
  SOUTH_AFRICA_SALARY_BENCHMARKS 
} from './services/geminiService';
import { 
  DailyReport, 
  JobMatch, 
  ViewType, 
  CandidateProfile, 
  ATSAnalysis,
  JobSpecificATS,
  ApplicationStatus
} from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // LocalStorage-backed state persistence
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    try {
      const saved = localStorage.getItem('candidate_profile');
      return saved ? JSON.parse(saved) : CANDIDATE_PROFILE;
    } catch {
      return CANDIDATE_PROFILE;
    }
  });

  const [report, setReport] = useState<DailyReport | null>(() => {
    try {
      const saved = localStorage.getItem('cached_report');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_job_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hiddenJobIds, setHiddenJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hidden_job_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return localStorage.getItem('last_updated') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Search states
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Profile modal states for adding items
  const [newRole, setNewRole] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);

  // ATS Analysis state
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(() => {
    try {
      const saved = localStorage.getItem('ats_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loadingAts, setLoadingAts] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [exportedToast, setExportedToast] = useState(false);

  // Interactive Salary Calculator states
  const [calcTargetSalary, setCalcTargetSalary] = useState<number>(45000);
  const [calcSelectedRole, setCalcSelectedRole] = useState<string>('IT Operations Manager');

  // Job Tracker Pipeline State
  const [jobStatuses, setJobStatuses] = useState<Record<string, ApplicationStatus>>(() => {
    try {
      const saved = localStorage.getItem('job_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [jobNotes, setJobNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('job_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activePipelineTab, setActivePipelineTab] = useState<ApplicationStatus | 'all_pipeline'>('all_pipeline');

  // Job-Specific ATS Tailored state
  const [jobSpecificInput, setJobSpecificInput] = useState<string>('');
  const [jobSpecificResult, setJobSpecificResult] = useState<JobSpecificATS | null>(() => {
    try {
      const saved = localStorage.getItem('job_specific_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loadingJobSpecific, setLoadingJobSpecific] = useState<boolean>(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState<boolean>(false);

  // Mobile navigation slider drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Persist profile changes
  useEffect(() => {
    try {
      localStorage.setItem('candidate_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Persist saved jobs
  useEffect(() => {
    try {
      localStorage.setItem('saved_job_ids', JSON.stringify(savedJobIds));
    } catch (e) {
      console.error('Failed to save job ids', e);
    }
  }, [savedJobIds]);

  // Persist hidden jobs
  useEffect(() => {
    try {
      localStorage.setItem('hidden_job_ids', JSON.stringify(hiddenJobIds));
    } catch (e) {
      console.error('Failed to save hidden jobs', e);
    }
  }, [hiddenJobIds]);

  // Persist pipeline tracking states
  useEffect(() => {
    try {
      localStorage.setItem('job_statuses', JSON.stringify(jobStatuses));
    } catch (e) {
      console.error('Failed to save job statuses', e);
    }
  }, [jobStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem('job_notes', JSON.stringify(jobNotes));
    } catch (e) {
      console.error('Failed to save job notes', e);
    }
  }, [jobNotes]);

  // Persist job specific ATS
  useEffect(() => {
    try {
      localStorage.setItem('job_specific_result', JSON.stringify(jobSpecificResult));
    } catch (e) {
      console.error('Failed to save job specific result', e);
    }
  }, [jobSpecificResult]);

  const runSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyReport(profile);
      setReport(data);
      const timestamp = new Date().toLocaleString();
      setLastUpdated(timestamp);
      localStorage.setItem('cached_report', JSON.stringify(data));
      localStorage.setItem('last_updated', timestamp);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch job opportunities. Please verify your network or Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  const runAtsAudit = async () => {
    setLoadingAts(true);
    try {
      const data = await generateATSAnalysis(profile);
      setAtsAnalysis(data);
      localStorage.setItem('ats_analysis', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAts(false);
    }
  };

  const runJobSpecificATS = async () => {
    if (!jobSpecificInput.trim()) return;
    setLoadingJobSpecific(true);
    try {
      const result = await generateJobSpecificATS(profile, jobSpecificInput);
      setJobSpecificResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobSpecific(false);
    }
  };

  useEffect(() => {
    if (!report) {
      runSearch();
    }
  }, []);

  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev => {
      const isCurrentlySaved = prev.includes(id);
      if (isCurrentlySaved) {
        // Remove tracking status if removed from saved list entirely
        setJobStatuses(curr => {
          const updated = { ...curr };
          delete updated[id];
          return updated;
        });
        return prev.filter(jId => jId !== id);
      } else {
        // Default to 'saved' when bookmarking
        setJobStatuses(curr => ({ ...curr, [id]: 'saved' }));
        return [...prev, id];
      }
    });
  };

  const toggleHideJob = (id: string) => {
    setHiddenJobIds(prev => 
      prev.includes(id) ? prev.filter(jId => jId !== id) : [...prev, id]
    );
  };

  const handleExportReport = () => {
    if (!report) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ profile, report, exportedAt: new Date().toISOString() }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `recruit_report_${profile.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 3000);
  };

  // Helper to filter all matches based on score filter, search term, and hidden status
  const allJobs = useMemo(() => {
    if (!report) return [];
    return [...(report.topMatches || []), ...(report.secondaryMatches || []).map(j => ({ ...j }))];
  }, [report]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Hidden filter
      const isHidden = hiddenJobIds.includes(job.id);
      if (isHidden && !showHidden) return false;

      // Score filter
      if (filter === 'HIGH' && job.probabilityOfSuccess !== 'HIGH') return false;
      if (filter === 'MEDIUM' && job.probabilityOfSuccess !== 'MEDIUM') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.jobTitle.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesWhy = job.whyMatches.some(w => w.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesWhy) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, filter, searchQuery, hiddenJobIds, showHidden]);

  const savedJobsList = useMemo(() => {
    const list = allJobs.filter(job => savedJobIds.includes(job.id));
    return list.map(job => ({
      ...job,
      status: jobStatuses[job.id] || 'saved',
      notes: jobNotes[job.id] || ''
    }));
  }, [allJobs, savedJobIds, jobStatuses, jobNotes]);

  const pipelineFilteredJobs = useMemo(() => {
    if (activePipelineTab === 'all_pipeline') return savedJobsList;
    return savedJobsList.filter(job => job.status === activePipelineTab);
  }, [savedJobsList, activePipelineTab]);

  const handleAddRole = () => {
    if (newRole.trim()) {
      setProfile(prev => ({ ...prev, targetRoles: [...prev.targetRoles, newRole.trim()] }));
      setNewRole('');
      setShowAddRole(false);
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.filter(r => r !== roleToRemove)
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({ ...prev, keySkills: [...prev.keySkills, newSkill.trim()] }));
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddCompany = () => {
    if (newCompany.trim()) {
      setProfile(prev => ({ ...prev, companiesWorkedAt: [...prev.companiesWorkedAt, newCompany.trim()] }));
      setNewCompany('');
      setShowAddCompany(false);
    }
  };

  const handleRemoveCompany = (companyToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      companiesWorkedAt: prev.companiesWorkedAt.filter(c => c !== companyToRemove)
    }));
  };

  const updateJobStatus = (id: string, status: ApplicationStatus) => {
    setJobStatuses(prev => ({ ...prev, [id]: status }));
  };

  const updateJobNotes = (id: string, notes: string) => {
    setJobNotes(prev => ({ ...prev, [id]: notes }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-indigo-100">
      {/* Toast Banner */}
      <AnimatePresence>
        {exportedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold border border-slate-700"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Report Exported Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-md tracking-tight text-slate-900 leading-none">Enterprise</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">Recruit Agent</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <nav className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 p-8 hidden lg:flex flex-col shadow-sm z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-indigo-200 shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900">Enterprise</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 -mt-1">Recruit Agent</p>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
            badge={filteredJobs.length}
          />
          <NavItem 
            icon={<Bookmark className="w-5 h-5" />} 
            label="Saved Roles" 
            active={currentView === 'saved'} 
            onClick={() => setCurrentView('saved')}
            badge={savedJobIds.length}
          />
          <NavItem 
            icon={<User className="w-5 h-5" />} 
            label="Profile & Roles" 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')}
          />
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="CV & ATS Audit" 
            active={currentView === 'analysis'} 
            onClick={() => setCurrentView('analysis')}
          />
          <NavItem 
            icon={<Globe className="w-5 h-5" />} 
            label="Market Insights" 
            active={currentView === 'market'} 
            onClick={() => setCurrentView('market')}
          />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {profile.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="font-bold text-sm text-slate-900 truncate">{profile.name}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Candidate Profile</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 truncate leading-relaxed">{profile.location}</p>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 p-8 flex flex-col border-l border-slate-100 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-md tracking-tight text-slate-900 leading-none">Enterprise</h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">Recruit Agent</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 border border-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <NavItem
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                  active={currentView === 'dashboard'}
                  onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                  badge={filteredJobs.length}
                />
                <NavItem
                  icon={<Bookmark className="w-5 h-5" />}
                  label="Saved Roles"
                  active={currentView === 'saved'}
                  onClick={() => { setCurrentView('saved'); setMobileMenuOpen(false); }}
                  badge={savedJobIds.length}
                />
                <NavItem
                  icon={<User className="w-5 h-5" />}
                  label="Profile & Roles"
                  active={currentView === 'profile'}
                  onClick={() => { setCurrentView('profile'); setMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<FileText className="w-5 h-5" />}
                  label="CV & ATS Audit"
                  active={currentView === 'analysis'}
                  onClick={() => { setCurrentView('analysis'); setMobileMenuOpen(false); }}
                />
                <NavItem
                  icon={<Globe className="w-5 h-5" />}
                  label="Market Insights"
                  active={currentView === 'market'}
                  onClick={() => { setCurrentView('market'); setMobileMenuOpen(false); }}
                />
              </div>

              <div className="pt-6 border-t border-slate-100 mt-auto">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-sm text-slate-900">{profile.name}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Candidate Profile</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 p-6 md:p-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Recruitment Dashboard</h2>
                  <p className="text-slate-500 mt-2 font-medium flex items-center gap-2 text-sm">
                    <RefreshCw className={`w-4 h-4 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
                    {lastUpdated ? `Agent synchronized: ${lastUpdated}` : 'Initializing agent search...'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={runSearch}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 px-5 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm text-sm animate-none"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Sync Data
                  </button>
                  <button 
                    onClick={handleExportReport}
                    disabled={!report}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </header>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">System Connection Issue</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              )}

              {loading && !report && (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Search className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-extrabold text-slate-900">Scanning South Africa Tech Market</p>
                    <p className="text-sm text-slate-500">Aggregating LinkedIn, PNet, Careers24, and Indeed listings...</p>
                  </div>
                </div>
              )}

              {report && (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                      label="Total Opportunities" 
                      value={report.summary.totalJobsFound} 
                      icon={<Search className="w-6 h-6 text-blue-600" />}
                      active={filter === 'ALL'}
                      onClick={() => setFilter('ALL')}
                    />
                    <StatCard 
                      label="High Probability Matches" 
                      value={report.summary.highMatches} 
                      icon={<Zap className="w-6 h-6 text-emerald-600" />}
                      active={filter === 'HIGH'}
                      onClick={() => setFilter('HIGH')}
                    />
                    <StatCard 
                      label="Strategic Matches" 
                      value={report.summary.mediumMatches} 
                      icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                      active={filter === 'MEDIUM'}
                      onClick={() => setFilter('MEDIUM')}
                    />
                  </div>

                  {/* Recommended Actions */}
                  <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        Strategic AI Recommendations
                      </h3>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full">
                        AI Agent Analysis
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Priority Application Pipeline
                        </h4>
                        <div className="space-y-3">
                          {report.recommendedActions.immediateApplications.map((action, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm text-emerald-900 font-medium leading-relaxed">
                              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          CV Optimization Protocol
                        </h4>
                        <div className="space-y-3">
                          {report.recommendedActions.cvTweaks.map((tweak, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm text-indigo-900 font-medium leading-relaxed">
                              <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                              {tweak}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Search and Filters Bar */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Search job title, company, or key skill..."
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                          <button 
                            onClick={() => setFilter('ALL')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            All ({allJobs.length})
                          </button>
                          <button 
                            onClick={() => setFilter('HIGH')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'HIGH' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            High ({report.summary.highMatches})
                          </button>
                          <button 
                            onClick={() => setFilter('MEDIUM')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'MEDIUM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            Medium ({report.summary.mediumMatches})
                          </button>
                        </div>

                        {hiddenJobIds.length > 0 && (
                          <button 
                            onClick={() => setShowHidden(!showHidden)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${showHidden ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            {showHidden ? 'Hide Filtered' : `Hidden (${hiddenJobIds.length})`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-6">
                      {filteredJobs.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
                          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Search className="w-8 h-8" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">No opportunities match current criteria</h4>
                          <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Try broadening your search query or reset filters to view all available positions.
                          </p>
                          <button 
                            onClick={() => {
                              setFilter('ALL');
                              setSearchQuery('');
                              setShowHidden(false);
                            }}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredJobs.map((job, i) => (
                            <JobCard 
                              key={job.id || `job-${i}`} 
                              job={job} 
                              index={i} 
                              isSaved={savedJobIds.includes(job.id)}
                              isHidden={hiddenJobIds.includes(job.id)}
                              onToggleSave={() => toggleSaveJob(job.id)}
                              onToggleHide={() => toggleHideJob(job.id)}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* SAVED ROLES VIEW - Job CRM Tracker Integration */}
          {currentView === 'saved' && (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Application Pipeline CRM</h2>
                  <p className="text-slate-500 mt-2 font-medium text-sm">Save roles, schedule follow-ups, keep private records, and manage your progress.</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200 inline-block self-start md:self-auto">
                  {savedJobsList.length} Tracks Saved
                </span>
              </header>

              {savedJobsList.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                    <Bookmark className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">No tracked applications yet</h3>
                  <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                    Bookmark jobs on the dashboard to initiate your interactive tracker pipeline.
                  </p>
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Browse Identified Opportunities
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pipeline Kanban-Tabs selector */}
                  <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <button
                      onClick={() => setActivePipelineTab('all_pipeline')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activePipelineTab === 'all_pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                      All Saved ({savedJobsList.length})
                    </button>
                    {(['saved', 'applied', 'interviewing', 'offered', 'rejected'] as ApplicationStatus[]).map((st) => {
                      const count = savedJobsList.filter(job => job.status === st).length;
                      const label = st.charAt(0).toUpperCase() + st.slice(1);
                      return (
                        <button
                          key={st}
                          onClick={() => setActivePipelineTab(st)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activePipelineTab === st ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                          {label} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-6">
                    {pipelineFilteredJobs.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                        <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-55 text-slate-400" />
                        <p className="text-sm font-bold">No jobs currently in this status phase.</p>
                      </div>
                    ) : (
                      pipelineFilteredJobs.map((job, i) => (
                        <div key={`saved-${job.id}`} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                          <div className="p-8 space-y-6">
                            {/* Card header */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div>
                                <h4 className="text-xl font-bold text-slate-900">{job.jobTitle}</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                  <Briefcase className="w-4 h-4 text-slate-400" /> {job.company} • <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                {/* Direct Status update drop-down */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                                  <select
                                    value={job.status}
                                    onChange={(e) => updateJobStatus(job.id, e.target.value as ApplicationStatus)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                                  >
                                    <option value="saved">Saved / Bookmarked</option>
                                    <option value="applied">Applied</option>
                                    <option value="interviewing">Interviewing</option>
                                    <option value="offered">Offered / Negotiating</option>
                                    <option value="rejected">Rejected / Closed</option>
                                  </select>
                                </div>

                                <a
                                  href={job.applicationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  Portal Link <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => toggleSaveJob(job.id)}
                                  className="text-slate-400 hover:text-red-600 p-2 border border-slate-100 rounded-xl hover:bg-red-50/50 transition-colors"
                                  title="Remove Tracker Entirely"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Dynamic pipeline progress gauge */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-5 gap-1 text-center">
                              {['saved', 'applied', 'interviewing', 'offered', 'rejected'].map((phase, idx) => {
                                const currentPhases = ['saved', 'applied', 'interviewing', 'offered', 'rejected'];
                                const isCurrent = job.status === phase;
                                const isPassed = currentPhases.indexOf(job.status) >= idx;
                                return (
                                  <div key={phase} className="space-y-1">
                                    <div className={`h-2.5 rounded-full ${isCurrent ? 'bg-indigo-600 animate-pulse' : isPassed ? 'bg-indigo-400' : 'bg-slate-200'}`}></div>
                                    <span className={`text-[9px] font-black uppercase tracking-wider block ${isCurrent ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}`}>
                                      {phase}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Personal Outreach Notes Area */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                CRM Follow-Up Notes, Contacts & Dates
                              </label>
                              <textarea
                                value={job.notes}
                                onChange={(e) => updateJobNotes(job.id, e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                                placeholder="e.g. Spoke to HR Recruiter Sarah (sarah@company.co.za). Initial HR Call scheduled for Tuesday 10:00 AM. Mentioned cloud-scale background."
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE VIEW */}
          {currentView === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Candidate Profile</h2>
                <p className="text-slate-500 mt-2 font-medium text-sm">Configure your recruitment parameters and background details.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <ProfileSection title="Core Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Full Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} />
                      <Input label="Location" value={profile.location} onChange={(v) => setProfile({...profile, location: v})} />
                      <Input label="Target Salary" value={profile.targetSalary} onChange={(v) => setProfile({...profile, targetSalary: v})} />
                    </div>
                  </ProfileSection>

                  <ProfileSection title="Experience Summary">
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none min-h-[140px] leading-relaxed"
                      value={profile.experienceSummary}
                      onChange={(e) => setProfile({...profile, experienceSummary: e.target.value})}
                    />
                  </ProfileSection>

                  <ProfileSection title="Target Roles">
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {profile.targetRoles.map((role, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-indigo-100 flex items-center gap-2">
                          {role}
                          <button 
                            onClick={() => handleRemoveRole(role)}
                            className="text-indigo-400 hover:text-indigo-700 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {showAddRole ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <input 
                          type="text" 
                          placeholder="e.g. IT Governance Lead"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                        />
                        <button 
                          onClick={handleAddRole}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => setShowAddRole(false)}
                          className="text-slate-400 hover:text-slate-600 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowAddRole(true)}
                        className="bg-white border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Target Role
                      </button>
                    )}
                  </ProfileSection>

                  <ProfileSection title="Core Competencies & Key Skills">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.keySkills.map((skill, i) => (
                        <span key={i} className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                          {skill}
                          <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {showAddSkill ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <input 
                          type="text" 
                          placeholder="e.g. ServiceNow, ITIL v4"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                        <button 
                          onClick={handleAddSkill}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => setShowAddSkill(false)}
                          className="text-slate-400 hover:text-slate-600 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowAddSkill(true)}
                        className="bg-white border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Competency Skill
                      </button>
                    )}
                  </ProfileSection>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <Zap className="w-32 h-32 text-white/10 absolute -right-8 -bottom-8 rotate-12" />
                    <h3 className="text-xl font-extrabold mb-3 relative z-10">Agent Retraining</h3>
                    <p className="text-indigo-100 text-xs mb-6 leading-relaxed relative z-10">
                      Updating profile parameters automatically persists your data and re-calibrates Gemini search algorithms.
                    </p>
                    <button 
                      onClick={() => {
                        runSearch();
                        setCurrentView('dashboard');
                      }}
                      disabled={loading}
                      className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg relative z-10 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Save & Re-Sync Agent
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Companies Background
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.companiesWorkedAt.map((company, i) => (
                        <span key={i} className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2">
                          {company}
                          <button
                            onClick={() => handleRemoveCompany(company)}
                            className="text-indigo-400 hover:text-indigo-700 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {showAddCompany ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Vodacom"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
                        />
                        <button
                          onClick={handleAddCompany}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-700"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddCompany(false)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddCompany(true)}
                        className="bg-white border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Company
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CV & ATS AUDIT VIEW with Custom Job description Parser */}
          {currentView === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">CV & ATS Audit Engine</h2>
                  <p className="text-slate-500 mt-2 font-medium text-sm">Automated resume parsing score and keyword optimization for enterprise recruiters.</p>
                </div>
                <button 
                  onClick={runAtsAudit}
                  disabled={loadingAts}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {loadingAts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {atsAnalysis ? 'Re-Run ATS Audit' : 'Run ATS Audit'}
                </button>
              </header>

              {!atsAnalysis && !loadingAts && (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-6 shadow-sm">
                  <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
                    <Award className="w-10 h-10" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Execute Enterprise ATS Scan</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Evaluate your candidate profile against standard Applicant Tracking Systems used by top South Africa IT recruiters.
                    </p>
                  </div>
                  <button 
                    onClick={runAtsAudit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 transition-all"
                  >
                    Run Instant ATS Audit
                  </button>
                </div>
              )}

              {loadingAts && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="font-bold text-slate-900 text-lg">Parsing Profile against Enterprise ATS Algorithms...</p>
                </div>
              )}

              {atsAnalysis && !loadingAts && (
                <div className="space-y-8">
                  {/* Gauge Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AtsMetricCard 
                      label="Overall ATS Score" 
                      score={atsAnalysis.overallAtsScore} 
                      icon={<Award className="w-5 h-5 text-indigo-600" />}
                      status="Excellent Match"
                    />
                    <AtsMetricCard 
                      label="Keyword Match Rate" 
                      score={atsAnalysis.keywordMatchRate} 
                      icon={<Target className="w-5 h-5 text-emerald-600" />}
                      status="High Density"
                    />
                    <AtsMetricCard 
                      label="Formatting Readiness" 
                      score={atsAnalysis.formattingScore} 
                      icon={<FileText className="w-5 h-5 text-blue-600" />}
                      status="Clean Layout"
                    />
                    <AtsMetricCard 
                      label="Executive Impact" 
                      score={atsAnalysis.impactScore} 
                      icon={<Zap className="w-5 h-5 text-amber-600" />}
                      status="Leadership Focus"
                    />
                  </div>

                  {/* Keywords Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Matched Enterprise Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsAnalysis.matchedKeywords.map((kw, i) => (
                          <span key={i} className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Recommended High-Impact Additions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsAnalysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-amber-600" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Executive Pitch & Format Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                      <Sparkles className="w-32 h-32 text-indigo-500/10 absolute -right-6 -bottom-6" />
                      <div className="flex items-center justify-between relative z-10">
                        <h4 className="font-bold text-indigo-300 text-sm uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Executive Recruiter Pitch
                        </h4>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(atsAnalysis.executivePitch);
                            setCopiedPitch(true);
                            setTimeout(() => setCopiedPitch(false), 2000);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          {copiedPitch ? 'Copied' : 'Copy Pitch'}
                        </button>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed font-medium relative z-10 bg-white/5 p-5 rounded-2xl border border-white/10 italic">
                        "{atsAnalysis.executivePitch}"
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Formatting & Content Optimization
                      </h4>
                      <ul className="space-y-3">
                        {atsAnalysis.formattingSuggestions.map((sug, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-3 leading-relaxed">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                            {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Job-Specific Targeted Cover Letter & ATS Match tool */}
              <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Job-Specific ATS & Tailored Cover Letter Generator</h3>
                    <p className="text-xs text-slate-500">Paste any external job description to check your exact matching score, missing core keywords, and compile a custom-addressed executive cover letter.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={jobSpecificInput}
                    onChange={(e) => setJobSpecificInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[140px]"
                    placeholder="Paste the target job description details here..."
                  />
                  <button
                    onClick={runJobSpecificATS}
                    disabled={loadingJobSpecific || !jobSpecificInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50 animate-none"
                  >
                    {loadingJobSpecific ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Analyze & Generate Cover Letter
                  </button>
                </div>

                {jobSpecificResult && !loadingJobSpecific && (
                  <div className="mt-8 space-y-6 border-t border-slate-100 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Title & Company</p>
                        <p className="font-extrabold text-slate-800 text-sm mt-1">{jobSpecificResult.jobTitle}</p>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">{jobSpecificResult.company}</p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom ATS Match Score</p>
                        <p className="font-extrabold text-slate-800 text-2xl mt-1 text-emerald-600">{jobSpecificResult.matchScore}%</p>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Probability: {jobSpecificResult.probabilityOfSuccess}</span>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Gap Analysis</p>
                        <div className="text-left mt-1 space-y-1">
                          {jobSpecificResult.gapAnalysis.map((gap, i) => (
                            <p key={i} className="text-[10px] font-bold text-slate-600 flex items-start gap-1">
                              <span className="text-amber-500 font-black">•</span>
                              <span>{gap}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Keywords
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {jobSpecificResult.matchedKeywords.map((kw, i) => (
                            <span key={i} className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{kw}</span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-500" /> Missing High-Impact Keywords
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {jobSpecificResult.missingKeywords.map((kw, i) => (
                            <span key={i} className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">{kw}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Styled Cover Letter text */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 relative overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> Customized Recruiter Cover Letter
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(jobSpecificResult.coverLetter);
                            setCopiedCoverLetter(true);
                            setTimeout(() => setCopiedCoverLetter(false), 2000);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          {copiedCoverLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          {copiedCoverLetter ? 'Copied' : 'Copy Cover Letter'}
                        </button>
                      </div>
                      <pre className="text-slate-200 text-xs leading-relaxed font-sans font-semibold relative z-10 bg-white/5 p-5 rounded-xl border border-white/10 overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {jobSpecificResult.coverLetter}
                      </pre>
                    </div>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* MARKET INSIGHTS VIEW */}
          {currentView === 'market' && (
            <motion.div 
              key="market"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <header>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">South Africa Tech Market Insights</h2>
                <p className="text-slate-500 mt-2 font-medium text-sm">Real-time compensation benchmarks and hiring demand in Gauteng & Remote regions.</p>
              </header>

              {/* Salary Benchmarks */}
              <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    Monthly Compensation Benchmarks (Gauteng / Remote)
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">2026 Tech Data</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <th className="py-4 px-4">Target Role</th>
                        <th className="py-4 px-4">Min (ZAR)</th>
                        <th className="py-4 px-4">Median (ZAR)</th>
                        <th className="py-4 px-4">Max (ZAR)</th>
                        <th className="py-4 px-4">Market Demand</th>
                        <th className="py-4 px-4">In-Demand Competencies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                      {SOUTH_AFRICA_SALARY_BENCHMARKS.map((bench, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">{bench.role}</td>
                          <td className="py-4 px-4 text-slate-600">{bench.minSalary}</td>
                          <td className="py-4 px-4 font-bold text-indigo-600">{bench.medianSalary}</td>
                          <td className="py-4 px-4 text-slate-600">{bench.maxSalary}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                              bench.demandTrend === 'HIGH' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {bench.demandTrend}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {bench.topSkills.map((sk, j) => (
                                <span key={j} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Interactive Salary Negotiation & Calculator */}
              <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Salary Comparison & Negotiation Calculator</h3>
                    <p className="text-xs text-slate-500">Benchmark your target monthly salary against South Africa IT standards and unlock customized negotiation strategies.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select Target Benchmark Role</label>
                      <select
                        value={calcSelectedRole}
                        onChange={(e) => {
                          setCalcSelectedRole(e.target.value);
                          const matching = SOUTH_AFRICA_SALARY_BENCHMARKS.find(b => b.role === e.target.value);
                          if (matching) {
                            const numericMedian = parseInt(matching.medianSalary.replace(/[^0-9]/g, ''));
                            setCalcTargetSalary(numericMedian);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {SOUTH_AFRICA_SALARY_BENCHMARKS.map((b, i) => (
                          <option key={i} value={b.role}>{b.role}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Your Target Monthly Salary (ZAR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">R</span>
                        <input
                          type="number"
                          value={calcTargetSalary}
                          onChange={(e) => setCalcTargetSalary(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. 45000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculations & Strategy output */}
                  {(() => {
                    const benchmark = SOUTH_AFRICA_SALARY_BENCHMARKS.find(b => b.role === calcSelectedRole) || SOUTH_AFRICA_SALARY_BENCHMARKS[0];
                    const minVal = parseInt(benchmark.minSalary.replace(/[^0-9]/g, ''));
                    const medVal = parseInt(benchmark.medianSalary.replace(/[^0-9]/g, ''));
                    const maxVal = parseInt(benchmark.maxSalary.replace(/[^0-9]/g, ''));

                    const percentOfMedian = medVal > 0 ? Math.round((calcTargetSalary / medVal) * 100) : 0;
                    let positioning = "";
                    let colorClass = "";
                    let leverageTips: string[] = [];

                    if (calcTargetSalary < minVal) {
                      positioning = "Below Market Minimum";
                      colorClass = "text-amber-600 bg-amber-50 border-amber-200";
                      leverageTips = [
                        `Your target is below standard entry benchmarks. Recruiters will accept this quickly, but you are leaving money on the table.`,
                        `Use your 8+ years of experience at companies like ${profile.companiesWorkedAt[0] || 'MTN'} to justify a minimum target of ${benchmark.minSalary} immediately.`,
                        `Leverage your ITIL or core service skills to request the median bracket of ${benchmark.medianSalary}.`
                      ];
                    } else if (calcTargetSalary <= medVal) {
                      positioning = "Competitive Market Range (Moderate)";
                      colorClass = "text-blue-600 bg-blue-50 border-blue-200";
                      leverageTips = [
                        "Your target is highly reasonable and fits cleanly within local hiring budgets.",
                        "Secure the upper end of this bracket by showcasing your experience managing teams.",
                        "Incorporate your Cloud exposure (Azure, GCP) as a premium value-add during initial HR screenings."
                      ];
                    } else if (calcTargetSalary <= maxVal) {
                      positioning = "Premium Market Segment (High-Value)";
                      colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
                      leverageTips = [
                        "You are targeting high-tier enterprise compensation. This requires proving direct business impact.",
                        "Highlight incident and problem management KPI achievements to prove how you reduce service downtime costs.",
                        `Emphasize your background at tier-1 organizations like ${profile.companiesWorkedAt.slice(0, 2).join(" or ")} to justify premium rates.`
                      ];
                    } else {
                      positioning = "Super-Premium / Executive Level";
                      colorClass = "text-indigo-600 bg-indigo-50 border-indigo-200";
                      leverageTips = [
                        "Your target is above the standard maximum benchmark. Be prepared to position yourself as an indispensable strategic consultant.",
                        "Highlight SLA optimization, process automation savings, and cloud adoption strategies that directly impact company bottom line.",
                        "Be flexible to offer-structured packages, including performance-based bonuses, hybrid flexibility, or telecommunication benefits."
                      ];
                    }

                    return (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Market Position Assessment</p>
                          <div className={`mt-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold inline-block ${colorClass}`}>
                            {positioning} ({percentOfMedian}% of Median)
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-700">Dynamic Negotiation Leverage Tips:</p>
                          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                            {leverageTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>

              {/* Employer Ecosystem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Top Hiring Enterprise Employers
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Key corporate and telecom hiring hubs actively seeking IT Operations & Service Delivery leadership in South Africa:
                  </p>
                  <div className="space-y-3">
                    {['MTN South Africa', 'Vodacom Group', 'Amazon Web Services (AWS)', 'SAAB Grintek Defence', 'Dimension Data', 'Datacentrix', 'Entelect'].map((company, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-800">
                        <span>{company}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-500" />
                    High-Value Certifications (2026)
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Credentials that yield highest salary negotiation leverage for IT Operations leadership roles:
                  </p>
                  <div className="space-y-4">
                    <CertBadge name="ITIL 4 Managing Professional" impact="High Leverage" desc="Service Management & Governance" />
                    <CertBadge name="GCP / AWS Cloud Architect" impact="High Leverage" desc="Enterprise Cloud Transformation" />
                    <CertBadge name="PMP / PRINCE2 Practitioner" impact="Medium Leverage" desc="Project & Delivery Operations" />
                    <CertBadge name="COBIT 2019 / ISO 27001 Foundation" impact="Medium Leverage" desc="IT Governance & Security" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold transition-all text-sm ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {typeof badge === 'number' && badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon, active, onClick }: { label: string, value: number, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-7 rounded-3xl border text-left transition-all group ${
        active 
          ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-50 ring-2 ring-indigo-600' 
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3 rounded-2xl transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
          {icon}
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`}></div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className={`text-4xl font-black tracking-tight ${active ? 'text-slate-900' : 'text-slate-700'}`}>{value}</p>
    </button>
  );
}

function getPlatformLabel(url: string) {
  if (!url) return 'Job Portal';
  const lower = url.toLowerCase();
  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('pnet.co.za')) return 'PNet';
  if (lower.includes('indeed.com')) return 'Indeed';
  if (lower.includes('offerzen.com')) return 'OfferZen';
  if (lower.includes('careers24.com')) return 'Careers24';
  if (lower.includes('google.com')) return 'Google Search';
  return 'Company Portal';
}

function JobCard({ 
  job, 
  index, 
  isSaved, 
  isHidden, 
  onToggleSave, 
  onToggleHide 
}: { 
  key?: string | number,
  job: JobMatch, 
  index: number, 
  isSaved: boolean, 
  isHidden: boolean, 
  onToggleSave: () => void, 
  onToggleHide: () => void 
}) {
  const platform = getPlatformLabel(job.applicationLink);
  const priority = job.probabilityOfSuccess;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isHidden ? 0.4 : 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group ${
        isSaved ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-indigo-200'
      }`}
    >
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {job.jobTitle}
              </h4>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                priority === 'HIGH' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <Zap className="w-3 h-3" />
                {job.matchScore}% Match
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                {platform}
              </span>
              {isSaved && (
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3 text-indigo-600" /> Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-sm font-bold flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                {job.company}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-indigo-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  {job.salary}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a 
              href={job.applicationLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Apply on {platform}
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(`${job.jobTitle} at ${job.company} Johannesburg job application`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center p-3.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-400 rounded-2xl transition-all shadow-sm"
              title="Search on Google for direct portal link"
            >
              <Search className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Match Justification
            </h5>
            <ul className="space-y-2.5">
              {job.whyMatches.map((point, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-3 leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Identified Gaps
            </h5>
            <ul className="space-y-2.5">
              {job.keyGaps.map((gap, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-3 leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Probability:</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${priority === 'HIGH' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {job.probabilityOfSuccess}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSave}
            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
              isSaved ? 'text-indigo-600 font-extrabold' : 'text-slate-400 hover:text-indigo-600'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" /> : <Bookmark className="w-3.5 h-3.5" />}
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <button 
            onClick={onToggleHide}
            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
              isHidden ? 'text-amber-600 font-extrabold' : 'text-slate-400 hover:text-red-600'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            {isHidden ? 'Unhide' : 'Hide'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>
      {children}
    </div>
  );
}

// Ensure unique input name attributes
function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const inputId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
        id={inputId}
        name={inputId}
        type="text" 
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AtsMetricCard({ label, score, icon, status }: { label: string, score: number, icon: React.ReactNode, status: string }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="bg-slate-50 p-2.5 rounded-2xl">{icon}</div>
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{status}</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{score}%</p>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        ></div>
      </div>
    </div>
  );
}

function CertBadge({ name, impact, desc }: { name: string, impact: string, desc: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
      <div>
        <p className="font-bold text-sm text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex-shrink-0">
        {impact}
      </span>
    </div>
  );
}
