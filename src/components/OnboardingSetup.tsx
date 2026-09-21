import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  ArrowRight, 
  LogOut, 
  FileCheck, 
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { CandidateProfile, DailyReport } from '../types';
import { 
  parseCVToProfile, 
  generateDailyReport 
} from '../services/geminiService';
import type { User as FirebaseUser } from 'firebase/auth';

interface OnboardingSetupProps {
  currentUser: FirebaseUser;
  onComplete: (profile: CandidateProfile, report: DailyReport) => void;
  onSignOut: () => void;
}

export function OnboardingSetup({ currentUser, onComplete, onSignOut }: OnboardingSetupProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [cvText, setCvText] = useState('');
  const [targetLocation, setTargetLocation] = useState('Johannesburg, South Africa (Open to Hybrid / Remote)');
  const [targetSalary, setTargetSalary] = useState('R45,000 - R65,000 per month');
  
  // Processing & progress states
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processingSteps = [
    { title: "Analyzing CV & Career History", desc: "Extracting work experience, career achievements, and core skills..." },
    { title: "Mapping Target Roles & Compensation", desc: "Aligning seniority levels with South African & global market benchmarks..." },
    { title: "Searching Verified Vacancies", desc: "Scanning live openings across LinkedIn, PNet, Indeed & Careers24..." },
    { title: "Calculating ATS Match Probabilities", desc: "Customizing application pitch and populating your personal dashboard..." }
  ];

  const handleSampleCV = () => {
    setCvText(`Ansline Martiens
Location: Johannesburg, South Africa
Target Salary: R45,000 - R60,000 per month
Target Roles: IT Operations Manager, Service Delivery Manager, Technical Support Lead

Executive Summary:
Accomplished Enterprise IT Operations & Service Delivery Leader with 8+ years optimizing mission-critical infrastructure, driving ITIL v4 compliance, and managing high-performing engineering teams. Proven track record across Vodacom, MTN, and Dimension Data maintaining 99.8%+ SLA uptime and managing multi-million Rand vendor contracts.

Key Skills:
ITIL v4 Foundation & Managing Professional, SLA Governance, Incident & Problem Management, Cloud Infrastructure (AWS / Azure / GCP), ServiceNow ITSM, Disaster Recovery, Vendor Management, Team Leadership, Telecom Operations, Telemetry & Observability.`);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setCvText(text);
          setError(null);
        }
      };
      reader.readAsText(file);
    } else {
      // For non-txt files, read text content if possible or prompt with prefill
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.trim().length > 50) {
          setCvText(text);
        } else {
          // Provide friendly helper text
          setCvText(`Candidate Name: ${file.name.replace(/\.[^/.]+$/, "")}\nUploaded Document: ${file.name}\n\nPlease paste plain text excerpt from your document if automatic text extraction is incomplete.`);
        }
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim() || cvText.trim().length < 40) {
      setError("Please paste or upload your CV content (at least 40 characters) so our AI can accurately extract your skills and target roles.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Step 1: Parse CV
      setCurrentStep(0);
      const parsedProfile = await parseCVToProfile(cvText.trim());

      // Merge user overrides if provided
      if (targetLocation && targetLocation.trim()) {
        parsedProfile.location = targetLocation.trim();
      }
      if (targetSalary && targetSalary.trim()) {
        parsedProfile.targetSalary = targetSalary.trim();
      }

      // Step 2: Mapping
      setCurrentStep(1);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Generating Daily Report / Job matches
      setCurrentStep(2);
      const report = await generateDailyReport(parsedProfile);

      // Step 4: Finalizing
      setCurrentStep(3);
      await new Promise(r => setTimeout(r, 600));

      // Complete setup
      onComplete(parsedProfile, report);
    } catch (err: any) {
      console.error("Setup process error:", err);
      setError(err.message || "Failed to parse CV and fetch job matches. Please check your network and try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="https://www.invarianceai.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center text-amber-400 font-black text-xs border border-amber-400/40 group-hover:border-amber-400 transition-colors">
                IG
              </div>
              <span className="font-extrabold text-sm tracking-tight text-neutral-950 group-hover:text-amber-600 transition-colors">
                The Invariance Group
              </span>
            </a>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Candidate Onboarding
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{currentUser.displayName || currentUser.email}</span>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Onboarding Progress Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>First-Time Workspace Setup</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Welcome to Your AI Career Copilot
          </h1>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Your personal dashboard is currently unpopulated. Complete this quick setup by parsing your CV. 
            Our AI will extract your expertise and automatically curate high-probability job matches across South Africa.
          </p>
        </div>

        {/* Step Progression Visual */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl border-2 border-neutral-950 bg-neutral-950 text-white flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 1</div>
              <div className="text-xs sm:text-sm font-extrabold text-white">Parse CV & Profile</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500 flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-neutral-200 text-neutral-600 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Step 2</div>
              <div className="text-xs sm:text-sm font-semibold text-neutral-700">Populate Dashboard</div>
            </div>
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          {isProcessing ? (
            /* Processing Animation Screen */
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 mb-2">
                Analyzing Your CV & Scouting Vacancies
              </h2>
              <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
                Our Gemini intelligence engine is reviewing your credentials, calibrating ATS keywords, and scanning verified opportunities across South Africa and remote global markets.
              </p>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-3 text-left">
                {processingSteps.map((step, idx) => {
                  const isDone = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div 
                      key={step.title}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDone 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                          : isCurrent 
                          ? 'border-amber-400 bg-amber-50/60 text-neutral-950 shadow-sm'
                          : 'border-neutral-200 bg-neutral-50/50 text-neutral-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-neutral-300 flex-shrink-0"></div>
                        )}
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold">{step.title}</h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-medium">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Ingestion Method Tabs */}
              <div>
                <label className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-2.5">
                  Choose CV Ingestion Method
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('paste')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'paste'
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paste CV Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'upload'
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Paste Text */}
              {activeTab === 'paste' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">
                      Paste your CV, bio, or LinkedIn experience summary:
                    </span>
                    <button
                      type="button"
                      onClick={handleSampleCV}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                    >
                      Use Sample Executive CV
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="e.g. Jane Doe, Senior Operations Lead / Financial Specialist / Marketing Manager / Software Engineer in Johannesburg... Key Skills: Strategic Planning, Stakeholder Management, Team Leadership... 6+ years experience..."
                    className="w-full p-4 rounded-2xl border border-neutral-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-mono transition-all outline-none resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Minimum 40 characters required</span>
                    <span>{cvText.length} characters</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Upload File */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <label className="block border-2 border-dashed border-neutral-300 hover:border-amber-500 rounded-3xl p-8 text-center cursor-pointer bg-neutral-50/50 hover:bg-amber-50/30 transition-all">
                    <input 
                      type="file" 
                      accept=".txt,.pdf,.docx,.doc" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    <UploadCloud className="w-10 h-10 mx-auto text-amber-600 mb-3" />
                    <span className="block text-sm font-extrabold text-neutral-900">
                      Click to choose document or drag & drop
                    </span>
                    <span className="block text-xs text-neutral-500 mt-1">
                      Supports plain text (.txt), PDF, or Word files (.docx)
                    </span>
                  </label>

                  {cvText && (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-mono text-neutral-700 max-h-32 overflow-y-auto">
                      <div className="font-bold text-neutral-900 mb-1">Extracted Document Preview:</div>
                      {cvText.substring(0, 200)}...
                    </div>
                  )}
                </div>
              )}

              {/* Optional Location & Salary tuning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Target Location
                  </label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder="e.g. Johannesburg / Cape Town / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm text-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    Expected Salary (ZAR)
                  </label>
                  <input
                    type="text"
                    value={targetSalary}
                    onChange={(e) => setTargetSalary(e.target.value)}
                    placeholder="e.g. R45,000 - R65,000 per month"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs sm:text-sm text-neutral-900 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!cvText.trim()}
                  className="w-full py-4 px-6 rounded-2xl bg-neutral-950 text-white font-extrabold text-sm sm:text-base hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 group border border-amber-500/40 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Parse CV & Build My Job Pipeline</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] text-center text-neutral-400 mt-2.5">
                  By clicking parse, our AI will configure your candidate profile and query live South African job vacancies.
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer attribution */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <div>
            Built by{" "}
            <a 
              href="https://www.invarianceai.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-neutral-900 hover:text-amber-600 underline"
            >
              The Invariance Group
            </a>
          </div>
          <div>Enterprise AI Job Search & ATS Career Copilot</div>
        </div>
      </footer>
    </div>
  );
}
