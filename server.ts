import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  generateFallbackDailyReport,
  generateFallbackATS,
  generateFallbackCoverLetter,
  generateFallbackInterviewPrep,
  generateFallbackCVDraft,
  extractCandidateProfileFromText,
} from "./src/services/industryIntelligence";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        totalJobsFound: { type: Type.INTEGER },
        highMatches: { type: Type.INTEGER },
        mediumMatches: { type: Type.INTEGER },
      },
      required: ["totalJobsFound", "highMatches", "mediumMatches"],
    },
    topMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          salary: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          probabilityOfSuccess: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
          whyMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          applicationLink: { type: Type.STRING },
        },
        required: ["id", "jobTitle", "company", "location", "matchScore", "probabilityOfSuccess", "whyMatches", "keyGaps", "applicationLink"],
      },
    },
    secondaryMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          salary: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          probabilityOfSuccess: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
          whyMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          applicationLink: { type: Type.STRING },
        },
        required: ["id", "jobTitle", "company", "location", "matchScore", "probabilityOfSuccess", "whyMatches", "keyGaps", "applicationLink"],
      },
    },
    recommendedActions: {
      type: Type.OBJECT,
      properties: {
        immediateApplications: { type: Type.ARRAY, items: { type: Type.STRING } },
        cvTweaks: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["immediateApplications", "cvTweaks"],
    },
  },
  required: ["summary", "topMatches", "secondaryMatches", "recommendedActions"],
};

const ATS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallAtsScore: { type: Type.INTEGER },
    keywordMatchRate: { type: Type.INTEGER },
    formattingScore: { type: Type.INTEGER },
    impactScore: { type: Type.INTEGER },
    matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    formattingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    executivePitch: { type: Type.STRING },
    optimizedSummaries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          summaryText: { type: Type.STRING },
        },
        required: ["style", "summaryText"],
      },
    },
    recommendedBulletPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalConcept: { type: Type.STRING },
          enhancedBullet: { type: Type.STRING },
          targetRole: { type: Type.STRING },
          addedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["originalConcept", "enhancedBullet", "targetRole", "addedKeywords"],
      },
    },
    suggestedSkillsToAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "overallAtsScore",
    "keywordMatchRate",
    "formattingScore",
    "impactScore",
    "matchedKeywords",
    "missingKeywords",
    "formattingSuggestions",
    "executivePitch",
    "optimizedSummaries",
    "recommendedBulletPoints",
    "suggestedSkillsToAdd",
  ],
};

const COVER_LETTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    company: { type: Type.STRING },
    letterText: { type: Type.STRING },
    keyHighlightsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["jobTitle", "company", "letterText", "keyHighlightsUsed"],
};

const INTERVIEW_PREP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targetRole: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Technical", "Behavioral", "Leadership", "Scenario"] },
          modelAnswerStar: { type: Type.STRING },
          keyTip: { type: Type.STRING },
        },
        required: ["question", "category", "modelAnswerStar", "keyTip"],
      },
    },
  },
  required: ["targetRole", "questions"],
};

const CV_DRAFT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    headline: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    coreCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
    impactBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
    fullMarkdownCV: { type: Type.STRING },
  },
  required: ["fullName", "headline", "executiveSummary", "coreCompetencies", "impactBullets", "suggestedCertifications", "fullMarkdownCV"],
};

const CANDIDATE_PROFILE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    location: { type: Type.STRING },
    targetSalary: { type: Type.STRING },
    targetRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
    experienceSummary: { type: Type.STRING },
    companiesWorkedAt: { type: Type.ARRAY, items: { type: Type.STRING } },
    keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["name", "location", "targetSalary", "targetRoles", "experienceSummary", "companiesWorkedAt", "keySkills"],
};

// Helper to sanitize search URLs
function getSearchUrl(title: string, company: string, location: string) {
  const encCombined = encodeURIComponent(`${title} ${company}`.trim());
  const encLocation = encodeURIComponent(location || 'South Africa');
  return `https://www.linkedin.com/jobs/search/?keywords=${encCombined}&location=${encLocation}`;
}

// Resilient Gemini Invocation Helper
async function callGeminiSafe<T>(prompt: string, schema: any): Promise<T | null> {
  const ai = getAi();
  if (!ai) return null;

  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.7-flash"];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as T;
      }
    } catch (err: any) {
      const isQuotaOrRateLimit =
        err?.status === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.message?.includes("prepayment credits") ||
        err?.message?.includes("Quota exceeded");

      if (isQuotaOrRateLimit) {
        // Quota is exhausted for project - switch smoothly to domain intelligence engine
        break;
      }
    }
  }

  return null;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// 1. Generate Daily Report
app.post("/api/generate-report", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Missing profile payload" });
  }

  const prompt = `
    You are an expert AI Job Search & Career Copilot for all job seekers across South Africa and remote global markets.
    Find, evaluate, and rank active, realistic job opportunities matching this candidate's specific industry, field, experience, and target roles:

    CANDIDATE PROFILE:
    Name: ${profile.name}
    Location: ${profile.location}
    Target Salary: ${profile.targetSalary || "Market Rate (ZAR)"}
    Target Roles: ${(profile.targetRoles || []).join(", ")}
    Experience Summary: ${profile.experienceSummary}
    Companies Worked At: ${(profile.companiesWorkedAt || []).join(", ")}
    Key Skills: ${(profile.keySkills || []).join(", ")}

    REQUIREMENTS:
    1. Find 8 to 12 realistic, high-quality opportunities (5-7 topMatches, 3-5 secondaryMatches) matching the candidate's exact profession (e.g. Finance, Healthcare, Marketing, Sales, Human Resources, Supply Chain, Engineering, Technology, Operations, Administration, etc.).
    2. Target leading South African & global employers in the candidate's industry (e.g., Standard Bank, Discovery, Shoprite, Woolworths, Netcare, Sasol, Takealot, MultiChoice, Vodacom, Imperial Logistics, Old Mutual, etc.).
    3. Match salary benchmarks to ${profile.targetSalary || "ZAR 40,000 - 65,000/mo"}.
    4. Application links must be direct LinkedIn, PNet, or Careers24 search or portal URLs.
    5. Calculate matchScore (75-98) and probabilityOfSuccess (HIGH or MEDIUM).
    6. Return strict JSON matching schema.
  `;

  const reportData = await callGeminiSafe<any>(prompt, REPORT_SCHEMA);
  if (reportData) {
    return res.json(reportData);
  }

  // Multi-industry fallback tailored to candidate's actual profile
  const fallbackReport = generateFallbackDailyReport(profile);
  return res.json(fallbackReport);
});

// 2. Generate ATS Analysis
app.post("/api/generate-ats", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Missing profile payload" });
  }

  const prompt = `
    You are a Senior Executive Talent Recruiter and ATS Specialist.
    Analyze this Candidate Profile for roles: ${(profile.targetRoles || []).join(", ")} in ${profile.location}:

    Name: ${profile.name}
    Experience: ${profile.experienceSummary}
    Companies: ${(profile.companiesWorkedAt || []).join(", ")}
    Skills: ${(profile.keySkills || []).join(", ")}

    Provide detailed ATS keyword analysis, parsing scores, elevator pitch, 3 executive summaries, and 4 STAR bullet points.
    Return strict JSON matching schema.
  `;

  const atsData = await callGeminiSafe<any>(prompt, ATS_SCHEMA);
  if (atsData) {
    return res.json(atsData);
  }

  const fallbackATS = generateFallbackATS(profile);
  return res.json(fallbackATS);
});

// 3. Generate Cover Letter
app.post("/api/generate-cover-letter", async (req, res) => {
  const { profile, targetJobTitle, company } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Missing profile payload" });
  }

  const prompt = `
    Write a highly persuasive ATS-optimized Cover Letter for ${profile.name} applying for "${targetJobTitle}" at "${company}".
    Location: ${profile.location}
    Experience: ${profile.experienceSummary}
    Skills: ${(profile.keySkills || []).join(", ")}
    Previous Companies: ${(profile.companiesWorkedAt || []).join(", ")}

    Return strict JSON matching schema.
  `;

  const letterData = await callGeminiSafe<any>(prompt, COVER_LETTER_SCHEMA);
  if (letterData) {
    return res.json(letterData);
  }

  const fallbackLetter = generateFallbackCoverLetter(profile, targetJobTitle, company);
  return res.json(fallbackLetter);
});

// 4. Generate Interview Prep
app.post("/api/generate-interview-prep", async (req, res) => {
  const { profile, targetRole } = req.body;
  const roleToPrep = targetRole || profile?.targetRoles?.[0] || "IT Operations Manager";

  const prompt = `
    Prepare an Executive Interview Preparation package for ${profile?.name || "Candidate"} for "${roleToPrep}".
    Skills: ${(profile?.keySkills || []).join(", ")}
    Experience: ${profile?.experienceSummary || ""}

    Provide 5 high-yield interview questions with STAR answers and pro tips.
    Return strict JSON matching schema.
  `;

  const prepData = await callGeminiSafe<any>(prompt, INTERVIEW_PREP_SCHEMA);
  if (prepData) {
    return res.json(prepData);
  }

  const fallbackPrep = generateFallbackInterviewPrep(profile, roleToPrep);
  return res.json(fallbackPrep);
});

// 5. Generate Full CV Draft
app.post("/api/generate-cv-draft", async (req, res) => {
  const { profile, targetRole } = req.body;
  const roleToDraft = targetRole || profile?.targetRoles?.[0] || "Operations Leader";

  const prompt = `
    Create a complete, beautifully formatted ATS-ready CV draft for ${profile?.name || "Candidate"} targeting "${roleToDraft}".
    Location: ${profile?.location || "South Africa"}
    Experience: ${profile?.experienceSummary || ""}
    Companies: ${(profile?.companiesWorkedAt || []).join(", ")}
    Skills: ${(profile?.keySkills || []).join(", ")}

    Return strict JSON matching schema.
  `;

  const draftData = await callGeminiSafe<any>(prompt, CV_DRAFT_SCHEMA);
  if (draftData) {
    return res.json(draftData);
  }

  const fallbackDraft = generateFallbackCVDraft(profile, roleToDraft);
  return res.json(fallbackDraft);
});

// 6. Parse Resume CV
app.post("/api/parse-cv", async (req, res) => {
  const { cvText } = req.body;
  if (!cvText) {
    return res.status(400).json({ error: "Missing CV text" });
  }

  const prompt = `
    Parse this raw candidate resume/CV into structured Candidate Profile:
    """
    ${cvText}
    """
    Extract: name, location, targetSalary, targetRoles, experienceSummary, companiesWorkedAt, keySkills.
    Return strict JSON matching schema.
  `;

  const parsedProfile = await callGeminiSafe<any>(prompt, CANDIDATE_PROFILE_SCHEMA);
  if (parsedProfile) {
    return res.json(parsedProfile);
  }

  // Dynamic regex and semantic extractor matching the candidate's actual text
  const fallbackProfile = extractCandidateProfileFromText(cvText);
  return res.json(fallbackProfile);
});

// Production / Dev Vite static handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export { app };

if (!process.env.VERCEL) {
  startServer();
}
