import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  FileText, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { parseCVToProfile } from '../services/geminiService';
import { CandidateProfile } from '../types';

interface CVParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileParsed: (profile: CandidateProfile) => void;
}

export function CVParserModal({ isOpen, onClose, onProfileParsed }: CVParserModalProps) {
  const [cvText, setCvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim() || cvText.trim().length < 50) {
      setError('Please paste a substantial portion of your CV/Resume (at least 50 characters) so the AI can extract your details accurately.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const parsedProfile = await parseCVToProfile(cvText.trim());
      setSuccess(true);
      setTimeout(() => {
        onProfileParsed(parsedProfile);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse resume text. Please check the content and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleCV = () => {
    setCvText(`Ansline Martiens
Location: Johannesburg, South Africa
Target Salary: R45,000 - R55,000 per month
Target Roles: IT Operations Manager, Service Delivery Manager, IT Support Lead

Executive Summary:
Experienced Enterprise IT Operations & Service Delivery Leader with 10+ years driving infrastructure availability, telecom SLA compliance, and cross-functional engineering teams. Proven track record across Vodacom, MTN, and Dimension Data.

Key Skills:
ITIL v4, SLA Governance, Incident & Problem Management, Cloud Infrastructure (AWS/GCP), ServiceNow, Vendor Management, Team Leadership, Disaster Recovery, Network Operations.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-neutral-950 text-white p-6 relative border-b border-amber-500/30">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 border border-amber-400/40 p-2.5 rounded-2xl text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">AI Resume Ingestion</span>
              <h3 className="font-extrabold text-xl text-white">Paste & Auto-Parse Your CV</h3>
            </div>
          </div>
          <p className="text-neutral-300 text-xs mt-2 leading-relaxed">
            Paste your resume, LinkedIn summary, or bio below. Gemini will extract your name, target roles, location, key skills, and experience to instantly customize your job search and ATS scores.
          </p>
        </div>

        <form onSubmit={handleParse} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>CV successfully parsed! Loading your new personalized profile...</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Resume / CV Plain Text
              </label>
              <button
                type="button"
                onClick={handleSampleCV}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 underline"
              >
                Load Sample Resume
              </button>
            </div>

            <textarea
              required
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV text, experience bullet points, or LinkedIn 'About' summary here..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs font-mono font-medium text-neutral-900 leading-relaxed outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white min-h-[220px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-neutral-950 hover:bg-black text-amber-400 border border-amber-500/40 font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Analyzing Resume with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Extract & Populate Profile
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
