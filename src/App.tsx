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
  MessageSquare,
  Copy,
  FileCheck,
  HelpCircle,
  Send,
  ListChecks,
  FileDown,
  Calendar,
  Edit3,
  Clock,
  CheckSquare,
  PlusCircle,
  Bell,
  BellRing,
  BookmarkPlus,
  LogIn,
  LogOut,
  UserCheck,
  Database,
  Cloud,
  CloudCheck,
  CloudOff,
  Wand2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  generateDailyReport, 
  generateATSAnalysis, 
  generateCoverLetter,
  generateInterviewPrep,
  generateFullCVDraft,
  CANDIDATE_PROFILE, 
  CAREER_PRESETS,
  SOUTH_AFRICA_SALARY_BENCHMARKS,
  getPlatformSearchUrls,
  resolveDirectOrSearchUrl,
  sanitizeReportLinks
} from './services/geminiService';
import { 
  auth,
  onAuthStateChanged,
  logoutUser,
  saveUserProfileToCloud,
  loadUserProfileFromCloud,
  saveJobToCloud,
  removeJobFromCloud,
  loadSavedJobsFromCloud,
  saveSearchQueryToCloud,
  deleteSearchQueryFromCloud,
  loadSavedSearchesFromCloud
} from './services/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { AuthModal } from './components/AuthModal';
import { CVParserModal } from './components/CVParserModal';
import { 
  DailyReport, 
  JobMatch, 
  ViewType, 
  CandidateProfile, 
  ATSAnalysis,
  CoverLetter,
  InterviewPrep,
  FullCVDraft,
  ApplicationStatus,
  ApplicationTrackerEntry,
  SavedSearch
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
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeReportLinks(parsed);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

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

  // ATS & CV Toolsuite states
  const [atsSubTab, setAtsSubTab] = useState<'audit' | 'summaries' | 'bullets' | 'coverletter' | 'cvdraft' | 'interview'>('audit');
  
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(() => {
    try {
      const saved = localStorage.getItem('cover_letter');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loadingCover, setLoadingCover] = useState(false);
  const [targetCompanyForCover, setTargetCompanyForCover] = useState('');
  const [targetRoleForCover, setTargetRoleForCover] = useState(CANDIDATE_PROFILE.targetRoles[0]);

  const [interviewPrep, setInterviewPrep] = useState<InterviewPrep | null>(() => {
    try {
      const saved = localStorage.getItem('interview_prep');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loadingInterview, setLoadingInterview] = useState(false);

  const [cvDraft, setCvDraft] = useState<FullCVDraft | null>(() => {
    try {
      const saved = localStorage.getItem('cv_draft');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loadingCvDraft, setLoadingCvDraft] = useState(false);

  const [copiedItemKey, setCopiedItemKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItemKey(key);
    setTimeout(() => setCopiedItemKey(null), 2500);
  };

  const handleAddSkillFromAts = (skill: string) => {
    if (!profile.keySkills.includes(skill)) {
      const updated = { ...profile, keySkills: [...profile.keySkills, skill] };
      setProfile(updated);
      localStorage.setItem('candidate_profile', JSON.stringify(updated));
    }
  };

  const handleGenerateCoverLetter = async (roleOverride?: string, companyOverride?: string) => {
    const role = roleOverride || targetRoleForCover || profile.targetRoles[0] || 'IT Operations Manager';
    const company = companyOverride || targetCompanyForCover || 'Enterprise Technology Client';
    setLoadingCover(true);
    try {
      const res = await generateCoverLetter(profile, role, company);
      setCoverLetter(res);
      localStorage.setItem('cover_letter', JSON.stringify(res));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCover(false);
    }
  };

  const handleGenerateInterviewPrep = async (roleOverride?: string) => {
    const role = roleOverride || targetRoleForCover || profile.targetRoles[0] || 'IT Operations Manager';
    setLoadingInterview(true);
    try {
      const res = await generateInterviewPrep(profile, role);
      setInterviewPrep(res);
      localStorage.setItem('interview_prep', JSON.stringify(res));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleGenerateCvDraft = async (roleOverride?: string) => {
    const role = roleOverride || targetRoleForCover || profile.targetRoles[0] || 'IT Operations Manager';
    setLoadingCvDraft(true);
    try {
      const res = await generateFullCVDraft(profile, role);
      setCvDraft(res);
      localStorage.setItem('cv_draft', JSON.stringify(res));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCvDraft(false);
    }
  };

  const handleDownloadTextFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  // Profile modal states for adding items
  const [newRole, setNewRole] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

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

  // Application Tracker states
  const [trackerEntries, setTrackerEntries] = useState<Record<string, ApplicationTrackerEntry>>({});

  const [trackerFilter, setTrackerFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [trackerLayout, setTrackerLayout] = useState<'kanban' | 'list'>('kanban');

  // Custom application modal form state
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Johannesburg, South Africa');
  const [customSalary, setCustomSalary] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [customStatus, setCustomStatus] = useState<ApplicationStatus>('applied');
  const [customNotes, setCustomNotes] = useState('');

  // Editing notes modal / inline state
  const [editingNotesJobId, setEditingNotesJobId] = useState<string | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  // Saved Searches state & persistence
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    try {
      const saved = localStorage.getItem('saved_searches');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'preset-high-match',
          name: 'High Match Opportunities',
          query: '',
          filter: 'HIGH',
          createdAt: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
          newMatchesCount: 0,
          lastCheckedJobIds: [],
          hasNewAlert: false
        }
      ];
    } catch {
      return [];
    }
  });

  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [customSearchNameInput, setCustomSearchNameInput] = useState('');
  const [showSavedSearchesModal, setShowSavedSearchesModal] = useState(false);
  const [savedSearchToast, setSavedSearchToast] = useState<string | null>(null);

  // Firebase Auth & Cloud Sync states
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCvParserModal, setShowCvParserModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'guest'>('guest');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('it_ops');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Application Tracker toast notification
  const [trackerToast, setTrackerToast] = useState<{
    message: string;
    actionText?: string;
    onAction?: () => void;
  } | null>(null);

  const triggerTrackerToast = (message: string, actionText?: string, onAction?: () => void) => {
    setTrackerToast({ message, actionText, onAction });
    setTimeout(() => setTrackerToast(null), 4500);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        setSyncStatus('syncing');
        try {
          // 1. Fetch user profile from Firestore
          const cloudProfile = await loadUserProfileFromCloud(user.uid);
          if (cloudProfile) {
            setProfile(cloudProfile);
            localStorage.setItem('candidate_profile', JSON.stringify(cloudProfile));
          } else {
            // Initial backup to user's new Firestore account
            await saveUserProfileToCloud(user.uid, profile);
          }

          // 2. Fetch saved jobs from Firestore
          const cloudJobs = await loadSavedJobsFromCloud(user.uid);
          if (cloudJobs && cloudJobs.length > 0) {
            const cloudJobIds = cloudJobs.map(cj => cj.job.id);
            setSavedJobIds(cloudJobIds);
            
            const updated: Record<string, ApplicationTrackerEntry> = {};
            cloudJobs.forEach(cj => {
              updated[cj.job.id] = {
                jobId: cj.job.id,
                jobTitle: cj.job.jobTitle,
                company: cj.job.company,
                location: cj.job.location,
                salary: cj.job.salary,
                matchScore: cj.job.matchScore,
                applicationLink: cj.job.applicationLink,
                status: (cj.status as ApplicationStatus) || 'saved',
                notes: cj.notes || '',
                lastUpdated: new Date().toLocaleDateString('en-ZA')
              };
            });
            setTrackerEntries(updated);
          } else {
            // New or empty user account - start with 0 saved jobs and 0 tracked applications
            setSavedJobIds([]);
            setTrackerEntries({});
          }

          // 3. Fetch saved searches from Firestore
          const cloudSearches = await loadSavedSearchesFromCloud(user.uid);
          if (cloudSearches && cloudSearches.length > 0) {
            setSavedSearches(cloudSearches);
          }

          setSyncStatus('synced');
          triggerTrackerToast(`Logged in as ${user.displayName || user.email}! Cloud database active.`);
        } catch (err) {
          console.warn("Firestore sync error:", err);
          setSyncStatus('synced');
        }
      } else {
        // Guest user - clear all tracker entries and saved roles
        setSyncStatus('guest');
        setSavedJobIds([]);
        setTrackerEntries({});
        try {
          localStorage.removeItem('saved_job_ids');
          localStorage.removeItem('tracked_applications');
        } catch {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setSavedJobIds([]);
      setTrackerEntries({});
      try {
        localStorage.removeItem('saved_job_ids');
        localStorage.removeItem('tracked_applications');
      } catch {}
      triggerTrackerToast('Successfully signed out. Operating in Guest mode.');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectPreset = async (presetId: string) => {
    const preset = CAREER_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    const newProf = { ...preset.profile };
    setProfile(newProf);
    localStorage.setItem('candidate_profile', JSON.stringify(newProf));

    if (currentUser) {
      setSyncStatus('syncing');
      await saveUserProfileToCloud(currentUser.uid, newProf, { activePresetId: presetId });
      setSyncStatus('synced');
    }

    triggerTrackerToast(`Switched career profile to ${preset.title || preset.name || 'Selected Role'}! Re-running search...`);
    runSearchWithProfile(newProf);
  };

  const handleProfileParsed = async (newProf: CandidateProfile) => {
    setProfile(newProf);
    localStorage.setItem('candidate_profile', JSON.stringify(newProf));

    if (currentUser) {
      setSyncStatus('syncing');
      await saveUserProfileToCloud(currentUser.uid, newProf);
      setSyncStatus('synced');
    }

    triggerTrackerToast(`Loaded profile for ${newProf.name}! Re-running search...`);
    runSearchWithProfile(newProf);
  };

  const handleSaveProfileManual = async () => {
    localStorage.setItem('candidate_profile', JSON.stringify(profile));
    if (currentUser) {
      setSyncStatus('syncing');
      await saveUserProfileToCloud(currentUser.uid, profile);
      setSyncStatus('synced');
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } else {
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('saved_searches', JSON.stringify(savedSearches));
    } catch (e) {
      console.error('Failed to save searches', e);
    }
  }, [savedSearches]);

  const totalNewAlerts = useMemo(() => {
    return savedSearches.reduce((acc, s) => acc + (s.hasNewAlert ? (s.newMatchesCount || 1) : 0), 0);
  }, [savedSearches]);

  // Persist tracked applications only for logged in users
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`tracked_applications_${currentUser.uid}`, JSON.stringify(trackerEntries));
      } catch (e) {
        console.error('Failed to save tracked applications', e);
      }
    }
  }, [trackerEntries, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('candidate_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Persist saved jobs only for logged in users
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`saved_job_ids_${currentUser.uid}`, JSON.stringify(savedJobIds));
      } catch (e) {
        console.error('Failed to save job ids', e);
      }
    }
  }, [savedJobIds, currentUser]);

  // Persist hidden jobs
  useEffect(() => {
    try {
      localStorage.setItem('hidden_job_ids', JSON.stringify(hiddenJobIds));
    } catch (e) {
      console.error('Failed to save hidden jobs', e);
    }
  }, [hiddenJobIds]);

  const runSearchWithProfile = async (customProf: CandidateProfile) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyReport(customProf);
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

      // Check saved searches for new high-probability match alerts
      const newJobs = [...(data.topMatches || []), ...(data.secondaryMatches || [])];
      setSavedSearches(prevSearches => {
        return prevSearches.map(s => {
          const matches = newJobs.filter(job => {
            if (s.filter === 'HIGH' && job.probabilityOfSuccess !== 'HIGH') return false;
            if (s.filter === 'MEDIUM' && job.probabilityOfSuccess !== 'MEDIUM') return false;
            if (s.query && s.query.trim()) {
              const q = s.query.toLowerCase();
              const mTitle = job.jobTitle.toLowerCase().includes(q);
              const mComp = job.company.toLowerCase().includes(q);
              const mLoc = job.location.toLowerCase().includes(q);
              const mWhy = job.whyMatches.some(w => w.toLowerCase().includes(q));
              if (!mTitle && !mComp && !mLoc && !mWhy) return false;
            }
            return true;
          });

          const newHighMatches = matches.filter(
            m => m.probabilityOfSuccess === 'HIGH' && (!s.lastCheckedJobIds || !s.lastCheckedJobIds.includes(m.id))
          );

          const currentMatchIds = matches.map(m => m.id);
          const updatedCheckedIds = Array.from(new Set([...(s.lastCheckedJobIds || []), ...currentMatchIds]));

          if (newHighMatches.length > 0) {
            return {
              ...s,
              newMatchesCount: (s.newMatchesCount || 0) + newHighMatches.length,
              hasNewAlert: true,
              lastCheckedJobIds: updatedCheckedIds
            };
          }
          return {
            ...s,
            lastCheckedJobIds: updatedCheckedIds
          };
        });
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch job opportunities. Please verify your network or Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSaveSearchModal = () => {
    const defaultName = searchQuery.trim() 
      ? `Search: "${searchQuery.trim()}" (${filter === 'ALL' ? 'All Roles' : filter === 'HIGH' ? 'High Match' : 'Medium Match'})`
      : `Filter: ${filter === 'ALL' ? 'All Opportunities' : filter === 'HIGH' ? 'High Probability' : 'Medium Match'}`;
    setCustomSearchNameInput(defaultName);
    setShowSaveSearchModal(true);
  };

  const handleConfirmSaveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = customSearchNameInput.trim() || 'Saved Job Search';

    const currentMatchingJobIds = allJobs.filter(j => {
      if (filter === 'HIGH' && j.probabilityOfSuccess !== 'HIGH') return false;
      if (filter === 'MEDIUM' && j.probabilityOfSuccess !== 'MEDIUM') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = j.jobTitle.toLowerCase().includes(q);
        const mComp = j.company.toLowerCase().includes(q);
        const mLoc = j.location.toLowerCase().includes(q);
        const mWhy = j.whyMatches.some(w => w.toLowerCase().includes(q));
        if (!mTitle && !mComp && !mLoc && !mWhy) return false;
      }
      return true;
    }).map(j => j.id);

    const newSavedSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: nameToUse,
      query: searchQuery,
      filter: filter,
      createdAt: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
      newMatchesCount: 0,
      lastCheckedJobIds: currentMatchingJobIds,
      hasNewAlert: false
    };

    setSavedSearches(prev => [newSavedSearch, ...prev]);
    setShowSaveSearchModal(false);
    
    if (currentUser) {
      saveSearchQueryToCloud(currentUser.uid, newSavedSearch);
    }

    setSavedSearchToast(`Search "${nameToUse}" saved to your cloud workspace!`);
    setTimeout(() => setSavedSearchToast(null), 3500);
  };

  const handleApplySavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilter(savedSearch.filter);
    setCurrentView('dashboard');

    const currentMatchingJobIds = allJobs.filter(j => {
      if (savedSearch.filter === 'HIGH' && j.probabilityOfSuccess !== 'HIGH') return false;
      if (savedSearch.filter === 'MEDIUM' && j.probabilityOfSuccess !== 'MEDIUM') return false;
      if (savedSearch.query && savedSearch.query.trim()) {
        const q = savedSearch.query.toLowerCase();
        const mTitle = j.jobTitle.toLowerCase().includes(q);
        const mComp = j.company.toLowerCase().includes(q);
        const mLoc = j.location.toLowerCase().includes(q);
        const mWhy = j.whyMatches.some(w => w.toLowerCase().includes(q));
        if (!mTitle && !mComp && !mLoc && !mWhy) return false;
      }
      return true;
    }).map(j => j.id);

    setSavedSearches(prev => prev.map(s => {
      if (s.id === savedSearch.id) {
        return {
          ...s,
          hasNewAlert: false,
          newMatchesCount: 0,
          lastCheckedJobIds: Array.from(new Set([...(s.lastCheckedJobIds || []), ...currentMatchingJobIds]))
        };
      }
      return s;
    }));

    setShowSavedSearchesModal(false);
    setSavedSearchToast(`Applied saved search: "${savedSearch.name}"`);
    setTimeout(() => setSavedSearchToast(null), 3500);
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    if (currentUser) {
      deleteSearchQueryFromCloud(currentUser.uid, id);
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

  useEffect(() => {
    if (!report) {
      runSearch();
    }
  }, []);

  const toggleSaveJob = (id: string, jobObj?: JobMatch) => {
    if (!currentUser) {
      setShowAuthModal(true);
      triggerTrackerToast('Sign in or register to save opportunities and track applications.', 'Sign In', () => setShowAuthModal(true));
      return;
    }

    setSavedJobIds(prev => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        removeJobFromCloud(currentUser.uid, id);
        return prev.filter(jId => jId !== id);
      } else {
        if (jobObj && !trackerEntries[id]) {
          const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
          const newEntry: ApplicationTrackerEntry = {
            jobId: id,
            jobTitle: jobObj.jobTitle,
            company: jobObj.company,
            location: jobObj.location,
            salary: jobObj.salary,
            matchScore: jobObj.matchScore,
            applicationLink: jobObj.applicationLink,
            status: 'saved',
            lastUpdated: today
          };
          setTrackerEntries(tPrev => ({
            ...tPrev,
            [id]: newEntry
          }));
          saveJobToCloud(currentUser.uid, jobObj, 'saved');
        } else if (jobObj) {
          saveJobToCloud(currentUser.uid, jobObj, 'saved');
        }
        return [...prev, id];
      }
    });
  };

  const handleUpdateJobStatus = (
    jobId: string, 
    newStatus: ApplicationStatus, 
    jobData?: Partial<ApplicationTrackerEntry>
  ) => {
    if (!currentUser) {
      setShowAuthModal(true);
      triggerTrackerToast('Sign in to track applications and update stages.', 'Sign In', () => setShowAuthModal(true));
      return;
    }

    const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    
    setTrackerEntries(prev => {
      const existing = prev[jobId] || {};
      const updated: ApplicationTrackerEntry = {
        jobId,
        jobTitle: jobData?.jobTitle || existing.jobTitle || 'Target Position',
        company: jobData?.company || existing.company || 'Enterprise Partner',
        location: jobData?.location || existing.location || 'South Africa',
        salary: jobData?.salary !== undefined ? jobData.salary : existing.salary,
        matchScore: jobData?.matchScore !== undefined ? jobData.matchScore : existing.matchScore,
        applicationLink: jobData?.applicationLink !== undefined ? jobData.applicationLink : existing.applicationLink,
        status: newStatus,
        appliedDate: newStatus === 'applied' ? (existing.appliedDate || today) : existing.appliedDate,
        interviewDate: newStatus === 'interviewing' ? (existing.interviewDate || today) : existing.interviewDate,
        offerDate: newStatus === 'offer' ? (existing.offerDate || today) : existing.offerDate,
        notes: jobData?.notes !== undefined ? jobData.notes : existing.notes,
        lastUpdated: today,
        customAdded: jobData?.customAdded !== undefined ? jobData.customAdded : existing.customAdded || false
      };

      saveJobToCloud(currentUser.uid, {
        id: jobId,
        jobTitle: updated.jobTitle,
        company: updated.company,
        location: updated.location,
        salary: updated.salary || '',
        matchScore: updated.matchScore || 85,
        applicationLink: updated.applicationLink || '',
        probabilityOfSuccess: 'HIGH',
        whyMatches: [],
        keyGaps: []
      }, newStatus, updated.notes);

      return { ...prev, [jobId]: updated };
    });

    if (!savedJobIds.includes(jobId)) {
      setSavedJobIds(prev => [...prev, jobId]);
    }

    if (newStatus === 'applied') {
      const title = jobData?.jobTitle || 'Position';
      triggerTrackerToast(
        `"${title}" moved to APPLIED stage & synced!`, 
        'View Pipeline', 
        () => setCurrentView('tracker')
      );
    } else {
      triggerTrackerToast(
        `Application stage updated to ${newStatus.toUpperCase()}`,
        'View Pipeline',
        () => setCurrentView('tracker')
      );
    }
  };

  const handleSaveNotes = (jobId: string, notesText: string) => {
    if (!currentUser) return;
    setTrackerEntries(prev => {
      const existing = prev[jobId];
      if (!existing) return prev;
      const updated = { ...existing, notes: notesText };

      saveJobToCloud(currentUser.uid, {
        id: jobId,
        jobTitle: updated.jobTitle,
        company: updated.company,
        location: updated.location,
        salary: updated.salary || '',
        matchScore: updated.matchScore || 85,
        applicationLink: updated.applicationLink || '',
        probabilityOfSuccess: 'HIGH',
        whyMatches: [],
        keyGaps: []
      }, updated.status, notesText);

      return {
        ...prev,
        [jobId]: updated
      };
    });
    setEditingNotesJobId(null);
  };

  const handleDeleteTrackedJob = (jobId: string) => {
    setTrackerEntries(prev => {
      const copy = { ...prev };
      delete copy[jobId];
      return copy;
    });
    setSavedJobIds(prev => prev.filter(id => id !== jobId));
    if (currentUser) {
      removeJobFromCloud(currentUser.uid, jobId);
    }
  };

  const handleAddCustomApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      triggerTrackerToast('Sign in to track custom external job applications.', 'Sign In', () => setShowAuthModal(true));
      return;
    }
    if (!customJobTitle.trim() || !customCompany.trim()) return;

    const jobId = `custom-${Date.now()}`;
    const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

    const newEntry: ApplicationTrackerEntry = {
      jobId,
      jobTitle: customJobTitle.trim(),
      company: customCompany.trim(),
      location: customLocation.trim(),
      salary: customSalary.trim() || undefined,
      applicationLink: customLink.trim() || undefined,
      status: customStatus,
      appliedDate: customStatus === 'applied' ? today : undefined,
      interviewDate: customStatus === 'interviewing' ? today : undefined,
      offerDate: customStatus === 'offer' ? today : undefined,
      notes: customNotes.trim() || undefined,
      lastUpdated: today,
      customAdded: true
    };

    setTrackerEntries(prev => ({ ...prev, [jobId]: newEntry }));
    setSavedJobIds(prev => [...prev, jobId]);
    
    saveJobToCloud(currentUser.uid, {
      id: jobId,
      jobTitle: newEntry.jobTitle,
      company: newEntry.company,
      location: newEntry.location,
      salary: newEntry.salary || '',
      matchScore: 90,
      applicationLink: newEntry.applicationLink || '',
      probabilityOfSuccess: 'HIGH',
      whyMatches: ['External tracked role'],
      keyGaps: []
    }, newEntry.status, newEntry.notes);

    setCustomJobTitle('');
    setCustomCompany('');
    setCustomSalary('');
    setCustomLink('');
    setCustomNotes('');
    setShowAddCustomModal(false);
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
    return [...(report.topMatches || []), ...(report.secondaryMatches || [])];
  }, [report]);

  const allTrackedList = useMemo(() => {
    const map: Record<string, ApplicationTrackerEntry> = { ...trackerEntries };

    savedJobIds.forEach(id => {
      if (!map[id]) {
        const matchingJob = allJobs.find(j => j.id === id);
        if (matchingJob) {
          map[id] = {
            jobId: matchingJob.id,
            jobTitle: matchingJob.jobTitle,
            company: matchingJob.company,
            location: matchingJob.location,
            salary: matchingJob.salary,
            matchScore: matchingJob.matchScore,
            applicationLink: matchingJob.applicationLink,
            status: 'saved',
            lastUpdated: 'Saved'
          };
        }
      }
    });

    return Object.values(map);
  }, [trackerEntries, savedJobIds, allJobs]);

  const pipelineCounts = useMemo(() => {
    const saved = allTrackedList.filter(t => t.status === 'saved').length;
    const applied = allTrackedList.filter(t => t.status === 'applied').length;
    const interviewing = allTrackedList.filter(t => t.status === 'interviewing').length;
    const offer = allTrackedList.filter(t => t.status === 'offer').length;
    const rejected = allTrackedList.filter(t => t.status === 'rejected').length;
    const activeCount = applied + interviewing + offer;
    return { saved, applied, interviewing, offer, rejected, activeCount, total: allTrackedList.length };
  }, [allTrackedList]);

  const summaryCounts = useMemo(() => {
    const total = allJobs.length;
    const high = allJobs.filter(j => j.probabilityOfSuccess === 'HIGH').length;
    const medium = total - high;
    return { total, high, medium };
  }, [allJobs]);

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
    return allJobs.filter(job => savedJobIds.includes(job.id));
  }, [allJobs, savedJobIds]);

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
        {savedSearchToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-indigo-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border border-indigo-700"
          >
            <BookmarkCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            {savedSearchToast}
          </motion.div>
        )}
        {trackerToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border border-slate-700"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{trackerToast.message}</span>
            {trackerToast.actionText && (
              <button 
                onClick={trackerToast.onAction}
                className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-1 rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1"
              >
                {trackerToast.actionText} <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
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
            icon={<ListChecks className="w-5 h-5" />} 
            label="Application Tracker" 
            active={currentView === 'tracker'} 
            onClick={() => setCurrentView('tracker')}
            badge={pipelineCounts.total}
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

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
          {currentUser ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  {currentUser.displayName ? currentUser.displayName.charAt(0) : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                </div>
                <div className="truncate flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">{currentUser.displayName || currentUser.email}</p>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Cloud Connected</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <CloudOff className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black text-indigo-900">Guest Mode</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug font-medium">
                Sign in to sync your profile, saved roles & pipeline across all devices.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-72 p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        {/* Global Top Action & Auth Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target: <strong className="text-indigo-900">{profile.targetRoles[0] || 'Candidate'}</strong></span>
            </div>

            {/* Cloud Status Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firestore Cloud: Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Guest Mode (Local)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 1-Click Career Preset Switcher */}
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="" disabled>Switch Career Preset</option>
              {CAREER_PRESETS.map(p => (
                <option key={p.id} value={p.id}>Role: {p.title || p.name}</option>
              ))}
            </select>

            {/* Resume Parser Button */}
            <button
              onClick={() => setShowCvParserModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
              title="Parse resume plain text into candidate parameters"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              Parse My CV
            </button>

            {/* Auth CTA */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-slate-100 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Cloud Sign Up
              </button>
            )}
          </div>
        </div>

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
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 px-5 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm text-sm"
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
                      value={summaryCounts.total} 
                      icon={<Search className="w-6 h-6 text-blue-600" />}
                      active={filter === 'ALL'}
                      onClick={() => setFilter('ALL')}
                    />
                    <StatCard 
                      label="High Probability Matches" 
                      value={summaryCounts.high} 
                      icon={<Zap className="w-6 h-6 text-emerald-600" />}
                      active={filter === 'HIGH'}
                      onClick={() => setFilter('HIGH')}
                    />
                    <StatCard 
                      label="Strategic Matches" 
                      value={summaryCounts.medium} 
                      icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                      active={filter === 'MEDIUM'}
                      onClick={() => setFilter('MEDIUM')}
                    />
                  </div>

                  {/* APPLICATION TRACKER DASHBOARD SECTION */}
                  <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                          <div className="bg-indigo-50 p-2.5 rounded-2xl border border-indigo-100">
                            <ListChecks className="w-5 h-5 text-indigo-600" />
                          </div>
                          Application Tracker Pipeline
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">Real-time status tracking for saved positions and external job applications.</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setShowAddCustomModal(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-indigo-600" />
                          Track External Job
                        </button>
                        <button 
                          onClick={() => setCurrentView('tracker')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md"
                        >
                          Full Tracker Board <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Pipeline Stage Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div 
                        onClick={() => { setTrackerFilter('saved'); setCurrentView('tracker'); }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                      >
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">📌 Saved</span>
                        <p className="text-2xl font-black text-slate-900 group-hover:text-indigo-600">{pipelineCounts.saved}</p>
                      </div>
                      <div 
                        onClick={() => { setTrackerFilter('applied'); setCurrentView('tracker'); }}
                        className="bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                      >
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">📩 Applied</span>
                        <p className="text-2xl font-black text-blue-900 group-hover:text-blue-700">{pipelineCounts.applied}</p>
                      </div>
                      <div 
                        onClick={() => { setTrackerFilter('interviewing'); setCurrentView('tracker'); }}
                        className="bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                      >
                        <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">🎙️ Interviewing</span>
                        <p className="text-2xl font-black text-amber-900 group-hover:text-amber-700">{pipelineCounts.interviewing}</p>
                      </div>
                      <div 
                        onClick={() => { setTrackerFilter('offer'); setCurrentView('tracker'); }}
                        className="bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                      >
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">🎉 Offer Received</span>
                        <p className="text-2xl font-black text-emerald-900 group-hover:text-emerald-700">{pipelineCounts.offer}</p>
                      </div>
                      <div 
                        onClick={() => { setTrackerFilter('rejected'); setCurrentView('tracker'); }}
                        className="bg-red-50/50 hover:bg-red-100/50 border border-red-100 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                      >
                        <span className="text-[10px] font-black uppercase text-red-500 tracking-wider block">❌ Rejected / Closed</span>
                        <p className="text-2xl font-black text-red-900 group-hover:text-red-700">{pipelineCounts.rejected}</p>
                      </div>
                    </div>
                  </section>

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

                  {/* Alert Banner for New Saved Search Matches */}
                  {totalNewAlerts > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 text-white p-5 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
                          <BellRing className="w-6 h-6 text-yellow-200 animate-bounce" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base tracking-tight">New High-Probability Opportunities Detected!</h4>
                          <p className="text-xs text-white/90 font-medium mt-0.5">
                            {totalNewAlerts} new high-match position(s) found matching your saved search criteria during the last sync.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowSavedSearchesModal(true)}
                        className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 flex-shrink-0"
                      >
                        View Alerts & Apply Filters <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

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

                      <div className="flex items-center gap-3 flex-wrap">
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
                            High ({summaryCounts.high})
                          </button>
                          <button 
                            onClick={() => setFilter('MEDIUM')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'MEDIUM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                          >
                            Medium ({summaryCounts.medium})
                          </button>
                        </div>

                        {/* Save Search Button */}
                        <button 
                          onClick={handleOpenSaveSearchModal}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-xs"
                          title="Save active search criteria to automatically monitor new matches on sync"
                        >
                          <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                          Save Search
                        </button>

                        {/* Saved Searches Drawer Trigger */}
                        <button 
                          onClick={() => setShowSavedSearchesModal(true)}
                          className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all"
                          title="View and manage saved search configurations"
                        >
                          <Bookmark className="w-4 h-4 text-slate-600" />
                          Saved ({savedSearches.length})
                          {totalNewAlerts > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                              {totalNewAlerts}
                            </span>
                          )}
                        </button>

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
                              onToggleSave={() => toggleSaveJob(job.id, job)}
                              onToggleHide={() => toggleHideJob(job.id)}
                              trackedEntry={trackerEntries[job.id]}
                              onUpdateStatus={(status) => handleUpdateJobStatus(job.id, status, {
                                jobTitle: job.jobTitle,
                                company: job.company,
                                location: job.location,
                                salary: job.salary,
                                matchScore: job.matchScore,
                                applicationLink: job.applicationLink
                              })}
                              onNavigateToTracker={() => setCurrentView('tracker')}
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

          {/* APPLICATION TRACKER VIEW */}
          {currentView === 'tracker' && (
            <motion.div 
              key="tracker"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                    Application Tracker & Pipeline
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium text-sm">
                    Manage application stages (Saved, Applied, Interviewing, Offer, Rejected), record dates, and track interview progress.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    onClick={() => {
                      if (!currentUser) {
                        setShowAuthModal(true);
                        triggerTrackerToast('Sign in to track custom external applications.', 'Sign In', () => setShowAuthModal(true));
                      } else {
                        setShowAddCustomModal(true);
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Track External Job
                  </button>
                </div>
              </header>

              {!currentUser && (
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold text-base text-white">Guest Session — Sign in to Track Applications</h4>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Your application stages, interview dates, and recruiter notes are secured to your account. Sign in or register to start tracking applications in your pipeline.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap self-start md:self-auto flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Sign Up
                  </button>
                </div>
              )}

              {/* Pipeline Metric Bar */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Tracked</span>
                  <p className="text-2xl font-black text-slate-900">{pipelineCounts.total}</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">📌 Saved / Backlog</span>
                  <p className="text-2xl font-black text-slate-900">{pipelineCounts.saved}</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">📩 Applied</span>
                  <p className="text-2xl font-black text-blue-900">{pipelineCounts.applied}</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">🎙️ Interviewing</span>
                  <p className="text-2xl font-black text-amber-900">{pipelineCounts.interviewing}</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">🎉 Offer Received</span>
                  <p className="text-2xl font-black text-emerald-900">{pipelineCounts.offer}</p>
                </div>
              </div>

              {/* Filter Tabs & Layout Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  {(['ALL', 'saved', 'applied', 'interviewing', 'offer', 'rejected'] as const).map(st => (
                    <button 
                      key={st}
                      onClick={() => setTrackerFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        trackerFilter === st 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'ALL' ? 'All Roles' : st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Layout:</span>
                  <button 
                    onClick={() => setTrackerLayout('kanban')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      trackerLayout === 'kanban' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Board
                  </button>
                  <button 
                    onClick={() => setTrackerLayout('list')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      trackerLayout === 'list' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <ListChecks className="w-4 h-4" /> List
                  </button>
                </div>
              </div>

              {/* KANBAN BOARD VIEW */}
              {trackerLayout === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Column 1: SAVED */}
                  <KanbanColumn 
                    title="📌 Saved / Backlog" 
                    status="saved"
                    items={allTrackedList.filter(t => (trackerFilter === 'ALL' || trackerFilter === 'saved') && t.status === 'saved')}
                    onUpdateStatus={handleUpdateJobStatus}
                    onDelete={handleDeleteTrackedJob}
                    onEditNotes={(id, currentNotes) => {
                      setEditingNotesJobId(id);
                      setTempNotesText(currentNotes || '');
                    }}
                  />

                  {/* Column 2: APPLIED */}
                  <KanbanColumn 
                    title="📩 Applied" 
                    status="applied"
                    items={allTrackedList.filter(t => (trackerFilter === 'ALL' || trackerFilter === 'applied') && t.status === 'applied')}
                    onUpdateStatus={handleUpdateJobStatus}
                    onDelete={handleDeleteTrackedJob}
                    onEditNotes={(id, currentNotes) => {
                      setEditingNotesJobId(id);
                      setTempNotesText(currentNotes || '');
                    }}
                  />

                  {/* Column 3: INTERVIEWING */}
                  <KanbanColumn 
                    title="🎙️ Interviewing" 
                    status="interviewing"
                    items={allTrackedList.filter(t => (trackerFilter === 'ALL' || trackerFilter === 'interviewing') && t.status === 'interviewing')}
                    onUpdateStatus={handleUpdateJobStatus}
                    onDelete={handleDeleteTrackedJob}
                    onEditNotes={(id, currentNotes) => {
                      setEditingNotesJobId(id);
                      setTempNotesText(currentNotes || '');
                    }}
                  />

                  {/* Column 4: OFFER */}
                  <KanbanColumn 
                    title="🎉 Offer Received" 
                    status="offer"
                    items={allTrackedList.filter(t => (trackerFilter === 'ALL' || trackerFilter === 'offer') && t.status === 'offer')}
                    onUpdateStatus={handleUpdateJobStatus}
                    onDelete={handleDeleteTrackedJob}
                    onEditNotes={(id, currentNotes) => {
                      setEditingNotesJobId(id);
                      setTempNotesText(currentNotes || '');
                    }}
                  />
                </div>
              ) : (
                /* STRUCTURED LIST VIEW */
                <div className="space-y-4">
                  {allTrackedList
                    .filter(t => trackerFilter === 'ALL' || t.status === trackerFilter)
                    .map(entry => (
                      <div key={entry.jobId} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-xl font-black text-slate-900">{entry.jobTitle}</h4>
                              {entry.matchScore && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                                  {entry.matchScore}% Match
                                </span>
                              )}
                              {entry.customAdded && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                                  Custom Added
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {entry.company}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {entry.location}</span>
                              {entry.salary && <span className="flex items-center gap-1 text-indigo-600"><DollarSign className="w-3.5 h-3.5" /> {entry.salary}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <select 
                              value={entry.status}
                              onChange={(e) => handleUpdateJobStatus(entry.jobId, e.target.value as ApplicationStatus)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold outline-none border cursor-pointer ${
                                entry.status === 'offer' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                entry.status === 'interviewing' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                entry.status === 'applied' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                entry.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-300' :
                                'bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="saved">📌 Saved</option>
                              <option value="applied">📩 Applied</option>
                              <option value="interviewing">🎙️ Interviewing</option>
                              <option value="offer">🎉 Offer Received</option>
                              <option value="rejected">❌ Rejected</option>
                            </select>

                            {entry.applicationLink && (
                              <a 
                                href={entry.applicationLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                                title="Open Job Posting"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}

                            <button 
                              onClick={() => handleDeleteTrackedJob(entry.jobId)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Status Stepper Progress Bar */}
                        <div className="pt-2 border-t border-slate-100">
                          <StatusStepper status={entry.status} />
                        </div>

                        {/* Notes display */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> Candidate Notes:
                            </span>
                            <p className="text-xs font-medium text-slate-700">{entry.notes || 'No notes added yet. Click edit to record interview feedback or follow-up details.'}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setEditingNotesJobId(entry.jobId);
                              setTempNotesText(entry.notes || '');
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex-shrink-0"
                          >
                            Edit Notes
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SAVED ROLES VIEW */}
          {currentView === 'saved' && (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Saved Roles & Bookmarks</h2>
                  <p className="text-slate-500 mt-2 font-medium text-sm">Targeted applications saved for outreach and tracking.</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200">
                  {savedJobsList.length} Saved
                </span>
              </header>

              {!currentUser && (
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold text-base text-white">Guest Session — Sign in to Save Roles</h4>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Saved jobs are tied directly to your account and synced with your cloud database. Sign in or register to bookmark jobs and prepare applications.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap self-start md:self-auto flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Sign Up
                  </button>
                </div>
              )}

              {savedJobsList.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-sm">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                    <Bookmark className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {!currentUser ? 'No saved roles in guest mode' : 'No saved roles yet'}
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                    {!currentUser 
                      ? 'Sign in to bookmark matches from the dashboard and manage your application pipeline across devices.' 
                      : 'Click "Save Job" on any match in your dashboard to track roles you plan to apply to.'}
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {!currentUser ? (
                      <button 
                        onClick={() => setShowAuthModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" /> Sign In to Save Roles
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md"
                      >
                        Browse Identified Opportunities
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedJobsList.map((job, i) => (
                    <JobCard 
                      key={`saved-${job.id}`} 
                      job={job} 
                      index={i} 
                      isSaved={true}
                      isHidden={hiddenJobIds.includes(job.id)}
                      onToggleSave={() => toggleSaveJob(job.id)}
                      onToggleHide={() => toggleHideJob(job.id)}
                    />
                  ))}
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
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Candidate Profile & Settings</h2>
                  <p className="text-slate-500 mt-1 font-medium text-sm">Configure target roles, skills, and sync your preferences securely to Firestore.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCvParserModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" /> AI Resume Ingestion
                  </button>
                  <button
                    onClick={handleSaveProfileManual}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    {profileSaveSuccess ? 'Saved to Cloud!' : 'Save Parameters'}
                  </button>
                </div>
              </header>

              {/* 1-Click Role Presets */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      1-Click Career Role Presets
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Switch presets instantly to test AI job match algorithms for different career paths.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {CAREER_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-2 ring-indigo-200'
                            : 'bg-slate-50/50 border-slate-200 hover:border-indigo-300 hover:bg-white'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        )}
                        <p className={`font-black text-xs ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{preset.title || preset.name}</p>
                        <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{preset.profile.targetSalary}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">{preset.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

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
                  {/* Cloud Database Sync Status Card */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        Cloud Persistence
                      </h4>
                      {currentUser ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Synced</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Guest</span>
                      )}
                    </div>
                    {currentUser ? (
                      <div className="space-y-2 text-xs text-slate-600">
                        <p className="font-bold text-slate-900">{currentUser.displayName || currentUser.email}</p>
                        <p className="text-[11px] text-slate-500">Your profile, saved jobs, pipeline status, and custom searches are automatically synced to Firestore database.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Create an account or sign in so you can access your saved jobs and target profile on any device.
                        </p>
                        <button
                          onClick={() => setShowAuthModal(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign In / Sign Up
                        </button>
                      </div>
                    )}
                  </div>

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
                    <div className="flex flex-wrap gap-2">
                      {profile.companiesWorkedAt.map((company, i) => (
                        <span key={i} className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CV & ATS AUDIT ENGINE VIEW */}
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
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">CV & ATS Optimization Engine</h2>
                  <p className="text-slate-500 mt-2 font-medium text-sm">Comprehensive ATS auditing, CV drafting, STAR bullet generator, cover letters & interview prep.</p>
                </div>
                <button 
                  onClick={runAtsAudit}
                  disabled={loadingAts}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {loadingAts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {atsAnalysis ? 'Re-Scan & Optimize' : 'Run Complete ATS Audit'}
                </button>
              </header>

              {/* Sub-navigation tools bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
                <button 
                  onClick={() => setAtsSubTab('audit')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'audit' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4" /> ATS Audit & Keywords
                </button>
                <button 
                  onClick={() => setAtsSubTab('summaries')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'summaries' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Executive Summaries
                </button>
                <button 
                  onClick={() => setAtsSubTab('bullets')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'bullets' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ListChecks className="w-4 h-4" /> STAR Experience Bullets
                </button>
                <button 
                  onClick={() => setAtsSubTab('coverletter')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'coverletter' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Send className="w-4 h-4" /> Cover Letter Studio
                </button>
                <button 
                  onClick={() => setAtsSubTab('cvdraft')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'cvdraft' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Full CV Draft
                </button>
                <button 
                  onClick={() => setAtsSubTab('interview')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    atsSubTab === 'interview' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Interview Prep Simulator
                </button>
              </div>

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
                  <p className="font-bold text-slate-900 text-lg">Parsing Profile & Generating Tailored CV Optimizations...</p>
                </div>
              )}

              {atsAnalysis && !loadingAts && (
                <div className="space-y-8">
                  {/* SUB-TAB 1: ATS AUDIT & KEYWORDS */}
                  {atsSubTab === 'audit' && (
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
                          <h4 className="font-bold text-slate-900 flex items-center justify-between text-sm uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              Matched Enterprise Keywords ({atsAnalysis.matchedKeywords.length})
                            </span>
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
                          <h4 className="font-bold text-slate-900 flex items-center justify-between text-sm uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                              Missing Keywords (Click + to Add)
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {atsAnalysis.missingKeywords.map((kw, i) => {
                              const alreadyAdded = profile.keySkills.includes(kw);
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleAddSkillFromAts(kw)}
                                  disabled={alreadyAdded}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                                    alreadyAdded 
                                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 active:scale-95'
                                  }`}
                                  title={alreadyAdded ? 'Added to Profile' : 'Click to add to your Profile Skills'}
                                >
                                  {alreadyAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 text-amber-600" />}
                                  {kw}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Strategic Skills to Add */}
                      {atsAnalysis.suggestedSkillsToAdd && (
                        <div className="bg-indigo-50/70 border border-indigo-100 p-6 rounded-3xl space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-indigo-950 text-xs uppercase tracking-widest flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              Strategic Recruiter Keywords to Inject
                            </h4>
                            <span className="text-[10px] font-bold text-indigo-500">Click to instantly append to Profile Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {atsAnalysis.suggestedSkillsToAdd.map((skill, i) => {
                              const alreadyAdded = profile.keySkills.includes(skill);
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleAddSkillFromAts(skill)}
                                  disabled={alreadyAdded}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                                    alreadyAdded 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-600 hover:text-white'
                                  }`}
                                >
                                  {alreadyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Pitch & Format Suggestions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                          <Sparkles className="w-32 h-32 text-indigo-500/10 absolute -right-6 -bottom-6" />
                          <div className="flex items-center justify-between relative z-10">
                            <h4 className="font-bold text-indigo-300 text-sm uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Executive Recruiter Pitch
                            </h4>
                            <button 
                              onClick={() => handleCopyText(atsAnalysis.executivePitch, 'pitch')}
                              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              {copiedItemKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedItemKey === 'pitch' ? 'Copied' : 'Copy Pitch'}
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

                  {/* SUB-TAB 2: EXECUTIVE SUMMARIES */}
                  {atsSubTab === 'summaries' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Tailored CV Executive Summaries</h3>
                          <p className="text-slate-500 text-xs mt-1">Select and copy targeted profile intro statements designed for high ATS parsing.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {(atsAnalysis.optimizedSummaries || []).map((summaryItem, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                {summaryItem.style}
                              </span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    setProfile({ ...profile, experienceSummary: summaryItem.summaryText });
                                    handleCopyText(summaryItem.summaryText, `summary-${idx}`);
                                  }}
                                  className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Use in Profile
                                </button>
                                <button 
                                  onClick={() => handleCopyText(summaryItem.summaryText, `summary-${idx}`)}
                                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                                >
                                  {copiedItemKey === `summary-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedItemKey === `summary-${idx}` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              {summaryItem.summaryText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: STAR EXPERIENCE BULLETS */}
                  {atsSubTab === 'bullets' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Metric-Driven STAR Experience Bullets</h3>
                        <p className="text-slate-500 text-xs mt-1">High-impact bullet points quantifying achievements for your target IT roles.</p>
                      </div>

                      <div className="space-y-4">
                        {(atsAnalysis.recommendedBulletPoints || []).map((bullet, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Target Role: <strong className="text-indigo-600">{bullet.targetRole}</strong>
                              </span>
                              <button 
                                onClick={() => handleCopyText(bullet.enhancedBullet, `bullet-${idx}`)}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                              >
                                {copiedItemKey === `bullet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedItemKey === `bullet-${idx}` ? 'Copied' : 'Copy Bullet Point'}
                              </button>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold text-slate-800 text-sm leading-relaxed">
                              • {bullet.enhancedBullet}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-slate-400 font-bold text-[10px] uppercase">Keywords injected:</span>
                              {bullet.addedKeywords.map((kw, i) => (
                                <span key={i} className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-bold border border-emerald-100">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: AI COVER LETTER STUDIO */}
                  {atsSubTab === 'coverletter' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <Send className="w-5 h-5 text-indigo-600" />
                              AI Cover Letter Studio
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Generate a highly targeted cover letter tailored to any South Africa enterprise hiring manager.</p>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-wrap">
                            <input 
                              type="text" 
                              placeholder="Company (e.g., Vodacom, Standard Bank)"
                              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
                              value={targetCompanyForCover}
                              onChange={(e) => setTargetCompanyForCover(e.target.value)}
                            />
                            <select 
                              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                              value={targetRoleForCover}
                              onChange={(e) => setTargetRoleForCover(e.target.value)}
                            >
                              {profile.targetRoles.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleGenerateCoverLetter()}
                              disabled={loadingCover}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {loadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              Generate Letter
                            </button>
                          </div>
                        </div>

                        {!coverLetter && !loadingCover && (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
                            <FileText className="w-10 h-10 text-indigo-400 mx-auto" />
                            <h4 className="font-bold text-slate-800 text-sm">No Cover Letter Generated Yet</h4>
                            <p className="text-slate-500 text-xs max-w-sm mx-auto">Enter a target company name above and click "Generate Letter" to create an executive cover letter.</p>
                            <button 
                              onClick={() => handleGenerateCoverLetter()}
                              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md"
                            >
                              Generate Instant Letter
                            </button>
                          </div>
                        )}

                        {loadingCover && (
                          <div className="flex flex-col items-center justify-center py-16 space-y-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-sm font-bold text-slate-700">Writing custom executive cover letter...</p>
                          </div>
                        )}

                        {coverLetter && !loadingCover && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                Target: {coverLetter.jobTitle} at {coverLetter.company}
                              </span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleCopyText(coverLetter.letterText, 'cover-letter')}
                                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                  {copiedItemKey === 'cover-letter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedItemKey === 'cover-letter' ? 'Copied' : 'Copy Text'}
                                </button>
                                <button 
                                  onClick={() => handleDownloadTextFile(coverLetter.letterText, `Cover_Letter_${coverLetter.company.replace(/\s+/g, '_')}.txt`)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                  Download (.txt)
                                </button>
                              </div>
                            </div>

                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 min-h-[320px]"
                              value={coverLetter.letterText}
                              onChange={(e) => setCoverLetter({...coverLetter, letterText: e.target.value})}
                            />

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Highlights Included:</span>
                              {coverLetter.keyHighlightsUsed.map((h, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 5: FULL CV DRAFT */}
                  {atsSubTab === 'cvdraft' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <Layers className="w-5 h-5 text-indigo-600" />
                              Full Tailored ATS CV Draft
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Complete markdown CV document formatted for ATS parsers and human recruiters.</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <select 
                              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                              value={targetRoleForCover}
                              onChange={(e) => setTargetRoleForCover(e.target.value)}
                            >
                              {profile.targetRoles.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleGenerateCvDraft()}
                              disabled={loadingCvDraft}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {loadingCvDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              Generate Full CV
                            </button>
                          </div>
                        </div>

                        {!cvDraft && !loadingCvDraft && (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
                            <FileCheck className="w-10 h-10 text-indigo-400 mx-auto" />
                            <h4 className="font-bold text-slate-800 text-sm">No Complete CV Generated Yet</h4>
                            <p className="text-slate-500 text-xs max-w-sm mx-auto">Click "Generate Full CV" to construct an executive ATS-optimized resume draft.</p>
                            <button 
                              onClick={() => handleGenerateCvDraft()}
                              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md"
                            >
                              Generate Instant CV Draft
                            </button>
                          </div>
                        )}

                        {loadingCvDraft && (
                          <div className="flex flex-col items-center justify-center py-16 space-y-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-sm font-bold text-slate-700">Synthesizing full executive ATS CV draft...</p>
                          </div>
                        )}

                        {cvDraft && !loadingCvDraft && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-lg">{cvDraft.fullName}</h4>
                                <p className="text-indigo-600 text-xs font-bold">{cvDraft.headline}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleCopyText(cvDraft.fullMarkdownCV, 'full-cv')}
                                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                  {copiedItemKey === 'full-cv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedItemKey === 'full-cv' ? 'Copied' : 'Copy Markdown'}
                                </button>
                                <button 
                                  onClick={() => handleDownloadTextFile(cvDraft.fullMarkdownCV, `CV_${cvDraft.fullName.replace(/\s+/g, '_')}.md`)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                                >
                                  <FileDown className="w-3.5 h-3.5" />
                                  Download (.md)
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Core Competencies</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {cvDraft.coreCompetencies.map((c, i) => (
                                    <span key={i} className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Recommended Certifications</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {cvDraft.suggestedCertifications.map((c, i) => (
                                    <span key={i} className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full CV Markdown Document</label>
                              <textarea 
                                className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl p-6 leading-relaxed outline-none min-h-[380px]"
                                value={cvDraft.fullMarkdownCV}
                                onChange={(e) => setCvDraft({...cvDraft, fullMarkdownCV: e.target.value})}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 6: INTERVIEW PREP SIMULATOR */}
                  {atsSubTab === 'interview' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-indigo-600" />
                              Interview Prep & STAR Simulator
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">High-yield interview questions and model answers crafted for South Africa enterprise IT leadership.</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <select 
                              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                              value={targetRoleForCover}
                              onChange={(e) => setTargetRoleForCover(e.target.value)}
                            >
                              {profile.targetRoles.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleGenerateInterviewPrep()}
                              disabled={loadingInterview}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {loadingInterview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              Generate Questions
                            </button>
                          </div>
                        </div>

                        {!interviewPrep && !loadingInterview && (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
                            <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto" />
                            <h4 className="font-bold text-slate-800 text-sm">No Interview Package Generated Yet</h4>
                            <p className="text-slate-500 text-xs max-w-sm mx-auto">Click "Generate Questions" to receive role-specific interview scenarios and STAR model responses.</p>
                            <button 
                              onClick={() => handleGenerateInterviewPrep()}
                              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md"
                            >
                              Generate Instant Interview Prep
                            </button>
                          </div>
                        )}

                        {loadingInterview && (
                          <div className="flex flex-col items-center justify-center py-16 space-y-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-sm font-bold text-slate-700">Simulating hiring manager interview questions...</p>
                          </div>
                        )}

                        {interviewPrep && !loadingInterview && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                Target Role: {interviewPrep.targetRole}
                              </span>
                              <button 
                                onClick={() => handleGenerateInterviewPrep()}
                                className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> Re-Simulate
                              </button>
                            </div>

                            <div className="space-y-4">
                              {interviewPrep.questions.map((q, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${
                                        q.category === 'Technical' ? 'bg-blue-100 text-blue-800' :
                                        q.category === 'Behavioral' ? 'bg-purple-100 text-purple-800' :
                                        q.category === 'Leadership' ? 'bg-emerald-100 text-emerald-800' :
                                        'bg-amber-100 text-amber-800'
                                      }`}>
                                        {q.category} Question
                                      </span>
                                      <h4 className="font-extrabold text-slate-900 text-base">{q.question}</h4>
                                    </div>
                                    <button 
                                      onClick={() => handleCopyText(`Question: ${q.question}\n\nModel STAR Answer:\n${q.modelAnswerStar}\n\nDelivery Tip: ${q.keyTip}`, `interview-${idx}`)}
                                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 flex-shrink-0"
                                    >
                                      {copiedItemKey === `interview-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      {copiedItemKey === `interview-${idx}` ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>

                                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Model STAR Response Framework</span>
                                    <p className="text-slate-700 text-xs leading-relaxed font-medium">{q.modelAnswerStar}</p>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                                    <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <span><strong>Recruiter Delivery Tip:</strong> {q.keyTip}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

        {/* ADD CUSTOM APPLICATION MODAL */}
        <AnimatePresence>
          {showAddCustomModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-100 my-8"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-indigo-600" />
                      Track External Job Application
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Manually record position details, initial stage, and personal notes.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddCustomModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCustomApplication} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Position Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Senior Cloud & Infrastructure Manager"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={customJobTitle}
                      onChange={(e) => setCustomJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Company / Employer *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Standard Bank SA"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Johannesburg / Remote"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Salary Range (ZAR)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. R950,000 - R1,200,000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={customSalary}
                        onChange={(e) => setCustomSalary(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Initial Application Stage</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={customStatus}
                        onChange={(e) => setCustomStatus(e.target.value as ApplicationStatus)}
                      >
                        <option value="saved">📌 Saved</option>
                        <option value="applied">📩 Applied</option>
                        <option value="interviewing">🎙️ Interviewing</option>
                        <option value="offer">🎉 Offer Received</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Application Link / URL</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Candidate Notes & History</label>
                    <textarea 
                      placeholder="e.g. Submitted CV via HR contact on LinkedIn, follow up scheduled for Friday..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-h-[90px]"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setShowAddCustomModal(false)}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md"
                    >
                      Add to Tracker
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* EDIT CANDIDATE NOTES MODAL */}
        <AnimatePresence>
          {editingNotesJobId && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-600" />
                    Edit Application Notes
                  </h4>
                  <button 
                    onClick={() => setEditingNotesJobId(null)}
                    className="text-slate-400 hover:text-slate-600 p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 min-h-[140px]"
                  placeholder="Enter notes, interviewer feedback, salary negotiation logs..."
                  value={tempNotesText}
                  onChange={(e) => setTempNotesText(e.target.value)}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setEditingNotesJobId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSaveNotes(editingNotesJobId, tempNotesText)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Save Notes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SAVE SEARCH MODAL */}
        <AnimatePresence>
          {showSaveSearchModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-100"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <BookmarkPlus className="w-5 h-5 text-indigo-600" />
                      Save Search & Alert Rules
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Store current query and match filters to monitor during next sync scan.</p>
                  </div>
                  <button 
                    onClick={() => setShowSaveSearchModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleConfirmSaveSearch} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Search Preset Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Senior Cloud Roles - High Match"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={customSearchNameInput}
                      onChange={(e) => setCustomSearchNameInput(e.target.value)}
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-medium text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Search Query:</span>
                      <span className="font-bold text-slate-900">{searchQuery ? `"${searchQuery}"` : 'All Terms'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Match Level:</span>
                      <span className="font-bold text-indigo-600">{filter === 'ALL' ? 'All Opportunities' : filter === 'HIGH' ? 'High Probability Only' : 'Medium Match'}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="text-slate-400">Current Matching Jobs:</span>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{filteredJobs.length} Positions</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setShowSaveSearchModal(false)}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2"
                    >
                      <BookmarkCheck className="w-4 h-4" /> Save Search & Monitor
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SAVED SEARCHES & ALERTS MODAL */}
        <AnimatePresence>
          {showSavedSearchesModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-100 my-8"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-indigo-600" />
                      Saved Searches & Sync Notifications
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Manage stored filter criteria and review alerts for newly scanned high-match jobs.</p>
                  </div>
                  <button 
                    onClick={() => setShowSavedSearchesModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {savedSearches.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <BookmarkPlus className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-sm">No Saved Searches Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Configure search queries or filters on the dashboard, then click "Save Search" to automatically receive alerts on next sync.
                    </p>
                    <button 
                      onClick={() => {
                        setShowSavedSearchesModal(false);
                        handleOpenSaveSearchModal();
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Save Current Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    {savedSearches.map((s) => (
                      <div 
                        key={s.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          s.hasNewAlert 
                            ? 'bg-amber-50/70 border-amber-300 shadow-md ring-2 ring-amber-200/50' 
                            : 'bg-white border-slate-200 hover:border-indigo-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 text-base">{s.name}</h4>
                              {s.hasNewAlert && (
                                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                                  <BellRing className="w-3 h-3" /> {s.newMatchesCount || 1} New High Match!
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">Created on {s.createdAt}</p>
                          </div>
                          
                          <button 
                            onClick={() => handleDeleteSavedSearch(s.id)}
                            className="text-slate-300 hover:text-red-500 p-1.5 transition-colors"
                            title="Delete Saved Search"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Search criteria tags */}
                        <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                            Query: {s.query ? `"${s.query}"` : 'Any'}
                          </span>
                          <span className={`px-3 py-1 rounded-lg border ${
                            s.filter === 'HIGH' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : s.filter === 'MEDIUM' 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            Filter: {s.filter === 'ALL' ? 'All Roles' : s.filter === 'HIGH' ? 'High Probability' : 'Medium Match'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-medium text-slate-500">
                            {s.lastCheckedJobIds ? `${s.lastCheckedJobIds.length} tracked positions` : 'Auto-monitored'}
                          </span>

                          <button 
                            onClick={() => handleApplySavedSearch(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                              s.hasNewAlert
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            <Search className="w-3.5 h-3.5" /> Apply Filter & Clear Alert
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleOpenSaveSearchModal}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Save Current Active Filters
                  </button>

                  <button 
                    onClick={() => setShowSavedSearchesModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AUTHENTICATION MODAL (SIGN IN / REGISTER / FIREBASE) */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }}
        />

        {/* CV & RESUME INGESTION MODAL */}
        <CVParserModal
          isOpen={showCvParserModal}
          onClose={() => setShowCvParserModal(false)}
          onProfileParsed={handleProfileParsed}
        />
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
  onToggleHide,
  trackedEntry,
  onUpdateStatus,
  onNavigateToTracker
}: { 
  key?: string | number,
  job: JobMatch, 
  index: number, 
  isSaved: boolean, 
  isHidden: boolean, 
  onToggleSave: () => void, 
  onToggleHide: () => void,
  trackedEntry?: ApplicationTrackerEntry,
  onUpdateStatus?: (status: ApplicationStatus) => void,
  onNavigateToTracker?: () => void
}) {
  const [justOpenedApply, setJustOpenedApply] = useState(false);
  const resolvedLink = resolveDirectOrSearchUrl(job.applicationLink, job.jobTitle, job.company);
  const platform = getPlatformLabel(resolvedLink);
  const priority = job.probabilityOfSuccess;
  const platformUrls = getPlatformSearchUrls(job.jobTitle, job.company, job.location);

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
        {/* Post-Apply Prompt Banner */}
        {justOpenedApply && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-emerald-50 via-indigo-50 to-purple-50 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl flex-shrink-0 shadow-xs">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Opened application portal for {job.jobTitle}!</p>
                <p className="text-[11px] text-slate-600 font-medium">Completed applying on {platform}? Click below to record it in your Application Tracker.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus('applied');
                  setJustOpenedApply(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                ✓ Mark as Applied
              </button>
              <button 
                onClick={() => setJustOpenedApply(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
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
              {trackedEntry?.status === 'applied' && (
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tracked: Applied
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

          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap flex-shrink-0">
            <a 
              href={resolvedLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setJustOpenedApply(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              Apply / View Position
              <ExternalLink className="w-4 h-4" />
            </a>

            {trackedEntry && trackedEntry.status === 'applied' ? (
              <button 
                onClick={onNavigateToTracker}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-5 py-3.5 rounded-2xl text-xs font-black hover:bg-emerald-100 transition-all shadow-xs"
                title="Click to view in Application Tracker"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Applied ({trackedEntry.appliedDate || 'Tracked'})
              </button>
            ) : trackedEntry && (trackedEntry.status === 'interviewing' || trackedEntry.status === 'offer') ? (
              <button 
                onClick={onNavigateToTracker}
                className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 px-5 py-3.5 rounded-2xl text-xs font-black hover:bg-amber-100 transition-all shadow-xs"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                {trackedEntry.status.toUpperCase()}
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus('applied');
                  setJustOpenedApply(false);
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                title="Mark this position as applied and add to tracker"
              >
                <CheckSquare className="w-4 h-4" />
                Add to Tracker / Mark Applied
              </button>
            )}
          </div>
        </div>

        {/* Multi-portal direct search pills */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-500" /> Verify Live Postings Across Portals:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <a 
              href={platformUrls.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setJustOpenedApply(true)}
              className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              LinkedIn <ArrowUpRight className="w-3 h-3" />
            </a>
            <a 
              href={platformUrls.pnet} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setJustOpenedApply(true)}
              className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              PNet SA <ArrowUpRight className="w-3 h-3" />
            </a>
            <a 
              href={platformUrls.indeed} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setJustOpenedApply(true)}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              Indeed SA <ArrowUpRight className="w-3 h-3" />
            </a>
            <a 
              href={platformUrls.companySite} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setJustOpenedApply(true)}
              className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              Careers Portal <ArrowUpRight className="w-3 h-3" />
            </a>
            <a 
              href={platformUrls.google} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setJustOpenedApply(true)}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              Google Jobs <Search className="w-3 h-3" />
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
      
      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Probability:</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${priority === 'HIGH' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {job.probabilityOfSuccess}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (trackedEntry?.status === 'applied') {
                if (onNavigateToTracker) onNavigateToTracker();
              } else {
                if (onUpdateStatus) onUpdateStatus('applied');
              }
            }}
            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
              trackedEntry?.status === 'applied' ? 'text-emerald-600 font-extrabold' : 'text-slate-400 hover:text-emerald-600'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            {trackedEntry?.status === 'applied' ? 'In Tracker (Applied)' : 'Add to Application Tracker'}
          </button>
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

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
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

function StatusStepper({ status }: { status: ApplicationStatus }) {
  const steps: { key: ApplicationStatus; label: string }[] = [
    { key: 'saved', label: 'Saved' },
    { key: 'applied', label: 'Applied' },
    { key: 'interviewing', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
  ];

  const getStepIndex = (st: ApplicationStatus) => {
    switch (st) {
      case 'saved': return 0;
      case 'applied': return 1;
      case 'interviewing': return 2;
      case 'offer': return 3;
      case 'rejected': return -1;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(status);

  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
        <X className="w-4 h-4" /> Position Closed / Application Rejected
      </div>
    );
  }

  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentIdx;
          const isPassed = idx <= currentIdx;
          return (
            <span 
              key={step.key} 
              className={isCurrent ? 'text-indigo-600 font-extrabold scale-105' : isPassed ? 'text-slate-700' : 'text-slate-300'}
            >
              {step.label}
            </span>
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {steps.map((step, idx) => {
          const isPassed = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div 
              key={step.key}
              className={`h-2 rounded-full transition-all ${
                isCurrent ? 'bg-indigo-600 ring-2 ring-indigo-200' : isPassed ? 'bg-indigo-400' : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function KanbanColumn({ 
  title, 
  status, 
  items, 
  onUpdateStatus, 
  onDelete, 
  onEditNotes 
}: { 
  title: string;
  status: ApplicationStatus;
  items: ApplicationTrackerEntry[];
  onUpdateStatus: (jobId: string, status: ApplicationStatus, jobData?: Partial<ApplicationTrackerEntry>) => void;
  onDelete: (jobId: string) => void;
  onEditNotes: (jobId: string, notes?: string) => void;
}) {
  return (
    <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/80 space-y-4 flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h4 className="font-extrabold text-sm text-slate-800">{title}</h4>
        <span className="text-xs font-black bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700">
          {items.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-300 rounded-2xl">
            <p className="text-xs font-bold text-slate-400">No applications in this stage</p>
          </div>
        ) : (
          items.map(item => (
            <motion.div 
              key={item.jobId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.jobTitle}
                  </h5>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{item.company}</p>
                </div>
                <button 
                  onClick={() => onDelete(item.jobId)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 flex-wrap">
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{item.location}</span>
                {item.matchScore && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black">
                    {item.matchScore}% Match
                  </span>
                )}
                {item.salary && <span className="text-indigo-600 font-extrabold">{item.salary}</span>}
              </div>

              {/* Status Stepper */}
              <StatusStepper status={item.status} />

              {/* Move Stage Selector */}
              <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
                <span className="text-[9px] font-black uppercase text-slate-400">Move:</span>
                <div className="flex items-center gap-1">
                  {status !== 'saved' && (
                    <button 
                      onClick={() => onUpdateStatus(item.jobId, 'saved')}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                    >
                      Saved
                    </button>
                  )}
                  {status !== 'applied' && (
                    <button 
                      onClick={() => onUpdateStatus(item.jobId, 'applied')}
                      className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      Applied
                    </button>
                  )}
                  {status !== 'interviewing' && (
                    <button 
                      onClick={() => onUpdateStatus(item.jobId, 'interviewing')}
                      className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded"
                    >
                      Interview
                    </button>
                  )}
                  {status !== 'offer' && (
                    <button 
                      onClick={() => onUpdateStatus(item.jobId, 'offer')}
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded"
                    >
                      Offer
                    </button>
                  )}
                </div>
              </div>

              {/* Notes / Dates footer */}
              <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-medium text-slate-600 flex items-center justify-between gap-2">
                <p className="truncate italic">
                  {item.notes ? `"${item.notes}"` : 'No notes added'}
                </p>
                <button 
                  onClick={() => onEditNotes(item.jobId, item.notes)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex-shrink-0"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
