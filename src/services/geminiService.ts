import { GoogleGenAI, Type } from "@google/genai";
import { DailyReport, CandidateProfile, JobMatch, ATSAnalysis, SalaryBenchmark, JobSpecificATS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const CANDIDATE_PROFILE: CandidateProfile = {
  name: "Ansline Martiens",
  location: "Johannesburg, South Africa (open to remote or hybrid)",
  targetSalary: "R35,000 – R50,000 per month",
  targetRoles: [
    "IT Operations Manager",
    "Service Delivery Manager",
    "Technical Account Manager",
    "IT Manager",
    "Support Team Lead (Senior)"
  ],
  experienceSummary: "8+ years in IT Operations, Technical Support, and Service Delivery. Experience leading teams (8–15 people). KPI, SLA, Incident & Problem Management. Process improvement and automation. Cloud exposure (Google Cloud, Azure). Background in telecom, enterprise IT, and global support.",
  companiesWorkedAt: ["MTN", "Amazon", "SAAB Grintek Defence", "United Wireless"],
  keySkills: [
    "IT Operations", "Service Delivery", "SLA Management", "Incident Management",
    "Problem Management", "Change Management", "ITIL", "Technical Support",
    "Cloud Computing", "Google Cloud", "Azure", "Team Leadership",
    "KPI Management", "Process Improvement", "Automation", "Stakeholder Management"
  ]
};

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
    executivePitch: { type: Type.STRING }
  },
  required: [
    "overallAtsScore", "keywordMatchRate", "formattingScore", "impactScore",
    "matchedKeywords", "missingKeywords", "formattingSuggestions", "executivePitch"
  ]
};

const JOB_SPECIFIC_ATS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    company: { type: Type.STRING },
    matchScore: { type: Type.INTEGER },
    probabilityOfSuccess: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
    matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    gapAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
    coverLetter: { type: Type.STRING }
  },
  required: [
    "jobTitle", "company", "matchScore", "probabilityOfSuccess",
    "matchedKeywords", "missingKeywords", "gapAnalysis", "coverLetter"
  ]
};

function isGenericHomepage(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== "string") return true;
  try {
    const url = new URL(urlStr.trim());
    const path = url.pathname.toLowerCase().replace(/\/+$/, "");
    const search = url.search.trim();

    const genericPaths = ["", "/jobs", "/careers", "/about", "/login", "/home", "/search", "/en"];
    if (genericPaths.includes(path) && !search) {
      return true;
    }

    if (path.length <= 3 && !search) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

function resolveDirectOrSearchUrl(
  rawLink: string,
  jobTitle: string,
  company: string,
  groundingChunks?: Array<Record<string, unknown>>
): string {
  if (groundingChunks && Array.isArray(groundingChunks)) {
    for (const chunk of groundingChunks) {
      const web = (chunk.web as { uri?: string; title?: string }) || {};
      const uri = web.uri || (chunk.uri as string) || "";
      const title = web.title || (chunk.title as string) || "";

      if (uri && !isGenericHomepage(uri)) {
        const lowerUri = uri.toLowerCase();
        const lowerTitle = title.toLowerCase();
        const lowerCompany = company.toLowerCase();
        const lowerJobTitle = jobTitle.toLowerCase();

        const companyMatch = lowerCompany && (lowerUri.includes(lowerCompany.replace(/\s+/g, "")) || lowerTitle.includes(lowerCompany));
        const titleMatch = lowerJobTitle && (lowerTitle.includes(lowerJobTitle) || lowerUri.includes(lowerJobTitle.split(" ")[0]));

        if (companyMatch || titleMatch) {
          return uri;
        }
      }
    }
  }

  if (rawLink && !isGenericHomepage(rawLink)) {
    return rawLink;
  }

  const lowerRaw = (rawLink || "").toLowerCase();
  const titleAndCompany = `${jobTitle} ${company}`;
  const encodedQuery = encodeURIComponent(titleAndCompany);

  if (lowerRaw.includes("linkedin.com")) {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${titleAndCompany} Johannesburg`)}`;
  }
  if (lowerRaw.includes("pnet.co.za")) {
    return `https://www.pnet.co.za/jobs/search?keywords=${encodedQuery}`;
  }
  if (lowerRaw.includes("indeed.com")) {
    return `https://za.indeed.com/jobs?q=${encodedQuery}&l=Johannesburg`;
  }
  if (lowerRaw.includes("offerzen.com")) {
    return `https://www.offerzen.com/jobs?query=${encodeURIComponent(jobTitle)}`;
  }
  if (lowerRaw.includes("careers24.com")) {
    return `https://www.careers24.com/jobs/kw-${encodeURIComponent(`${jobTitle}-${company}`)}/`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${company} "${jobTitle}" Johannesburg job application`)}`;
}

function sanitizeReportLinks(report: DailyReport, groundingChunks?: Array<Record<string, unknown>>): DailyReport {
  const sanitizeJob = (job: JobMatch): JobMatch => ({
    ...job,
    applicationLink: resolveDirectOrSearchUrl(job.applicationLink, job.jobTitle, job.company, groundingChunks),
  });

  return {
    ...report,
    topMatches: (report.topMatches || []).map(sanitizeJob),
    secondaryMatches: (report.secondaryMatches || []).map(sanitizeJob),
  };
}

export async function generateDailyReport(profile: CandidateProfile): Promise<DailyReport> {
  const prompt = `
    You are an expert AI Job Search & Recruitment Agent.
    Your role is to automatically find, evaluate, and rank job opportunities for the candidate:

    CANDIDATE PROFILE:
    Name: ${profile.name}
    Location: ${profile.location}
    Target Salary: ${profile.targetSalary}
    Target Roles: ${profile.targetRoles.join(", ")}
    Experience Summary: ${profile.experienceSummary}
    Companies Worked At: ${profile.companiesWorkedAt.join(", ")}
    Key Skills: ${profile.keySkills.join(", ")}

    OBJECTIVES:
    1. Search for real, active job listings for target roles in Johannesburg, South Africa or Remote South Africa.
    2. Use Google Search to locate real job postings from LinkedIn, Indeed, PNet, OfferZen, Careers24, and corporate career portals.
    3. **CRITICAL - LINK INTEGRITY RULE**:
       - NEVER output generic homepages like "https://www.linkedin.com" or "https://www.pnet.co.za".
       - Return the EXACT, full deep link URL to the job post.
       - If an exact job view URL is unavailable, return a direct platform search URL like "https://www.linkedin.com/jobs/search/?keywords=JobTitle+Company+Johannesburg".
    4. Include only jobs matching at least 60% of the candidate's skills and within or near the salary expectation (R35k-R50k/month).
    5. Calculate a MATCH SCORE (0-100%).
    6. Determine PROBABILITY OF SUCCESS: HIGH (80-100%), MEDIUM (60-79%).
    7. Assign a unique string "id" to each job.

    Return a DAILY REPORT in strict JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: REPORT_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate report");
  }

  const parsedReport = JSON.parse(response.text) as DailyReport;
  const groundingChunks = (response as unknown as { candidates?: Array<{ groundingMetadata?: { groundingChunks?: Array<Record<string, unknown>> } }> })
    .candidates?.[0]?.groundingMetadata?.groundingChunks;

  return sanitizeReportLinks(parsedReport, groundingChunks);
}

export async function generateATSAnalysis(profile: CandidateProfile): Promise<ATSAnalysis> {
  const prompt = `
    You are a Senior Executive Talent Recruiter and ATS (Applicant Tracking System) Specialist.
    Analyze the following Candidate Profile for high-level Enterprise IT leadership roles in South Africa (e.g. IT Operations Manager, Service Delivery Manager, Technical Account Manager).

    CANDIDATE PROFILE:
    Name: ${profile.name}
    Location: ${profile.location}
    Target Roles: ${profile.targetRoles.join(", ")}
    Experience: ${profile.experienceSummary}
    Companies: ${profile.companiesWorkedAt.join(", ")}
    Skills: ${profile.keySkills.join(", ")}

    Perform a rigorous ATS Parsing & Keyword Analysis:
    1. Estimate ATS Overall Parsing Score (0-100).
    2. Calculate Keyword Coverage Rate (0-100%).
    3. Calculate Formatting Readiness Score (0-100%).
    4. Calculate Executive Impact Score (0-100%).
    5. List top 6-8 matched enterprise keywords found in profile.
    6. List top 4-6 missing critical keywords expected by recruiters in South Africa (e.g. ITIL v4, SOC 2, COBIT, ServiceNow, DevOps Governance, ISO 27001).
    7. Provide 3 high-impact actionable CV formatting or phrasing improvements.
    8. Write a compelling 3-sentence Executive Elevator Pitch for recruiter outreach.

    Return strict JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ATS_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to run ATS analysis");
  }

  return JSON.parse(response.text) as ATSAnalysis;
}

export async function generateJobSpecificATS(profile: CandidateProfile, jobDescription: string): Promise<JobSpecificATS> {
  const prompt = `
    You are a Senior Executive IT Recruiter and expert ATS Auditor in South Africa.
    Conduct a highly personalized and deep matching assessment of the candidate against the provided Job Description.

    CANDIDATE PROFILE:
    Name: ${profile.name}
    Location: ${profile.location}
    Target Salary: ${profile.targetSalary}
    Target Roles: ${profile.targetRoles.join(", ")}
    Experience: ${profile.experienceSummary}
    Companies: ${profile.companiesWorkedAt.join(", ")}
    Skills: ${profile.keySkills.join(", ")}

    JOB DESCRIPTION PASTE:
    ${jobDescription}

    ASSESSMENT RULES:
    1. Parse the Job Description to extract the Job Title and Company. If company is not mentioned, use "Enterprise Employer".
    2. Compare the candidate's skills and experience against the requirements.
    3. Calculate a highly realistic Match Score (0-100).
    4. Set Probability of Success: HIGH (80-100%), MEDIUM (60-79%), or LOW (under 60%).
    5. List matched keywords and missing keywords found in the job description relative to the candidate profile.
    6. Identify 3 specific gaps in candidate experience or certifications (Gap Analysis).
    7. Generate a professional, compelling, and fully customized Cover Letter addressed to the hiring manager or recruiter. Highlight the candidate's achievements at ${profile.companiesWorkedAt.slice(0, 2).join(" and ")} and emphasize how their Service Delivery and IT Operations background makes them the ideal fit. Keep it structured, engaging, and in South African business-English style.

    Return strict JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: JOB_SPECIFIC_ATS_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate job specific ATS analysis and cover letter.");
  }

  return JSON.parse(response.text) as JobSpecificATS;
}

export const SOUTH_AFRICA_SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    role: "IT Operations Manager",
    minSalary: "R40,000",
    medianSalary: "R52,000",
    maxSalary: "R68,000",
    demandTrend: "HIGH",
    topSkills: ["Cloud Infrastructure", "Incident Mgmt", "SLA Enforcement", "ITIL v4"]
  },
  {
    role: "Service Delivery Manager",
    minSalary: "R38,000",
    medianSalary: "R48,000",
    maxSalary: "R62,000",
    demandTrend: "HIGH",
    topSkills: ["Stakeholder Relations", "Vendor Governance", "KPI Tracking", "ServiceNow"]
  },
  {
    role: "Technical Account Manager",
    minSalary: "R35,000",
    medianSalary: "R45,000",
    maxSalary: "R58,000",
    demandTrend: "HIGH",
    topSkills: ["Enterprise Support", "Client Escalations", "Telecom Networks", "Cloud Adoption"]
  },
  {
    role: "IT Manager (Senior)",
    minSalary: "R45,000",
    medianSalary: "R58,000",
    maxSalary: "R75,000",
    demandTrend: "STABLE",
    topSkills: ["IT Strategy", "Budget Control", "Security Compliance", "Team Leadership"]
  },
  {
    role: "Support Team Lead (Senior)",
    minSalary: "R32,000",
    medianSalary: "R42,000",
    maxSalary: "R52,000",
    demandTrend: "STABLE",
    topSkills: ["Shift Roster Mgmt", "Tier 2/3 Support", "Ticketing SLA", "Coaching"]
  }
];
