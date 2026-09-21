import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  FileText, 
  ListChecks, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Globe, 
  Zap, 
  Target, 
  ChevronRight,
  Award,
  BarChart3,
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onExploreDemo?: () => void;
}

export function LandingPage({ onOpenAuth, onExploreDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden font-sans">
      {/* Background ambient lighting - Warm Gold Tones */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-amber-100/40 via-yellow-50/20 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-amber-50/50 blur-[140px] rounded-full" />
        <div className="absolute top-[70%] right-[-10%] w-[500px] h-[500px] bg-yellow-50/60 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center shadow-md shadow-neutral-950/10">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-neutral-950 tracking-tight flex items-center gap-1.5">
                Recruit Agent <span className="text-[10px] uppercase font-black bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">Enterprise</span>
              </span>
              <p className="text-[11px] text-neutral-500 font-medium">
                AI Career Copilot & Job Discovery
              </p>
            </div>
          </div>

          {/* Builder badge in header */}
          <div className="hidden md:flex items-center gap-2">
            <a 
              href="https://www.invarianceai.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-amber-700 hover:border-amber-400 transition-all shadow-xs group"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Built by <strong className="text-neutral-950 group-hover:text-amber-600 transition-colors">The Invariance Group</strong></span>
              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-amber-500 transition-colors" />
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-bold text-neutral-700 hover:text-black px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="bg-neutral-950 hover:bg-black text-amber-400 border border-amber-500/40 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-neutral-950/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tag Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Engineered for South African Tech & Global Remote Markets</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.12]"
          >
            The Autonomous AI Agent for Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700">Career Breakthrough</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600 text-base sm:text-lg leading-relaxed font-normal"
          >
            Stop manual job hunting. Our AI Agent scans top opportunities across LinkedIn, PNet, and Careers24, analyzes ATS keyword match gaps, crafts custom cover letters, and organizes your entire application pipeline.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto bg-neutral-950 hover:bg-black text-amber-400 border border-amber-500/50 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-neutral-950/15 hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Account & Launch Search</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => onOpenAuth('signin')}
              className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-sm px-7 py-4 rounded-2xl border border-neutral-300 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Sign In to Workspace</span>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
            {onExploreDemo && (
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-5 py-4 rounded-2xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Preview Demo (0 Entries)</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            )}
          </motion.div>

          {/* Quick reassurance tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>0 setup fees • Instant access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              <span>POPIA & Data Privacy Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-700" />
              <span>ZAR Salary Benchmarks</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Teaser Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-14 rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xl relative overflow-hidden"
        >
          {/* Top Bar Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-neutral-300" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-neutral-900" />
              <span className="text-xs font-mono text-neutral-500 ml-2">recruit-agent.workspace/dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
              <span className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
                Cloud Sync Active
              </span>
              <span className="text-neutral-700 font-bold">Initial State: 0 Clutter Entries</span>
            </div>
          </div>

          {/* Teaser Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 hover:border-amber-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">Smart Match Probability</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Evaluates your profile against real job specs with 75% to 98% match confidence, highlighting exact strengths and potential gaps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 hover:border-amber-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">ATS Keyword Scanner</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Audit your CV against target industry algorithms. Get optimized executive summaries, STAR achievement bullets, and missing keywords.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 hover:border-amber-300 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700">
                <ListChecks className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">Application Pipeline Kanban</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Drag, drop, and progress applications through Saved, Applied, Interview, and Offer stages with custom interview dates and private notes.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition / Benefits Section */}
      <section className="relative z-10 py-20 px-6 border-t border-neutral-200 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Everything You Need to Get Hired</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Enterprise-Grade Tools for Modern Job Seekers
            </h3>
            <p className="text-sm text-neutral-600">
              Built to give candidates an unfair advantage in competitive South African & international markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">Aggregated Multi-Platform Search</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connects directly to active job listings from LinkedIn, PNet, Careers24, and corporate portals like Vodacom, Standard Bank, Amazon, Takealot, and Discovery.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">ATS Score & Keyword Intelligence</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Analyze your resume against enterprise applicant tracking systems. Discover what keywords recruiters look for and paste 1-click STAR bullet points.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">1-Click Tailored Cover Letters</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Generate high-converting, personalized cover letters matching your background to the target company's culture and specific job requirements.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">Executive Interview Simulator</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Master 5 high-yield interview questions per target role with structured STAR model answers (Situation, Task, Action, Result) and strategic pro tips.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">ZAR Salary Benchmarks</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Real-world South African market compensation ranges (ZAR) across IT Operations, Software Engineering, DevOps, Product, and Management.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="p-7 rounded-3xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950">Cloud Profile & Zero Data Loss</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sign in with Google or email. Your tracked pipeline, saved searches, custom applications, and CV drafts sync seamlessly to your private cloud storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Simple 3-Step Process</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            How to Land Your Next Role
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl relative space-y-4 shadow-sm hover:border-amber-300 transition-all">
            <div className="text-4xl font-black text-amber-500/30">01</div>
            <h4 className="text-lg font-bold text-neutral-950">Create Account & Set Target</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Sign up in 30 seconds. Choose from popular career presets (IT Operations, Engineering, Product) or paste your CV to auto-extract your background.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-8 rounded-3xl relative space-y-4 shadow-sm hover:border-amber-300 transition-all">
            <div className="text-4xl font-black text-neutral-300">02</div>
            <h4 className="text-lg font-bold text-neutral-950">Discover Matches & Audit CV</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our agent ranks active listings with match scores and why-match factors. Run the ATS audit to fill missing skill keywords before applying.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-8 rounded-3xl relative space-y-4 shadow-sm hover:border-amber-300 transition-all">
            <div className="text-4xl font-black text-amber-500/30">03</div>
            <h4 className="text-lg font-bold text-neutral-950">Apply & Track to Offer</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Generate custom cover letters, practice STAR interview answers, and track your job progress through the interactive Kanban board until you sign an offer.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner - Luxury Black & Gold Card on White Canvas */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-neutral-950 border border-amber-500/40 p-10 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden text-white">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Accelerate Your Job Search?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Join candidates testing the platform. Sign up to activate your workspace with 0 initial clutter, tailored to your exact career targets.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-black text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => onOpenAuth('signin')}
                className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 font-bold text-xs px-7 py-3.5 rounded-xl transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with The Invariance Group Branding */}
      <footer className="relative z-10 border-t border-neutral-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-neutral-950">AI Job Search & Career Copilot</p>
              <p className="text-[11px] text-neutral-500">Autonomous Career Intelligence Platform</p>
            </div>
          </div>

          {/* Builder notice */}
          <div className="text-center md:text-right space-y-1">
            <p className="font-medium text-neutral-700">
              Built with precision by{' '}
              <a 
                href="https://www.invarianceai.site/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
              >
                The Invariance Group
                <ExternalLink className="w-3 h-3 text-amber-600" />
              </a>
            </p>
            <p className="text-[11px] text-neutral-500">
              Enterprise Artificial Intelligence & Automation Solutions
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} The Invariance Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>POPIA & GDPR Compliant</span>
            <span>•</span>
            <span>Vercel Optimized Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
