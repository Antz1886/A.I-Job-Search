import { GoogleGenAI, Type } from "@google/genai";
import { 
  DailyReport, 
  CandidateProfile, 
  JobMatch, 
  ATSAnalysis, 
  SalaryBenchmark,
  CoverLetter,
  InterviewPrep,
  FullCVDraft,
  ProfilePreset
} from "../types";

let aiClient: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
      (typeof window !== 'undefined' && ((window as unknown as { __GEMINI_API_KEY?: string }).__GEMINI_API_KEY || (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY)) || 
      '';
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
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

// Aliased for backward compatibility
export const CANDIDATE_PROFILE: CandidateProfile = DEFAULT_CANDIDATE_PROFILE;

export const CAREER_PRESETS: ProfilePreset[] = [
  {
    id: "it-ops-leadership",
    title: "IT Operations & Service Delivery Manager",
    category: "IT & Infrastructure",
    description: "Enterprise IT operations, team leadership, SLA/incident governance, and cloud service management.",
    profile: DEFAULT_CANDIDATE_PROFILE
  },
  {
    id: "software-engineer",
    title: "Full-Stack Software Engineer",
    category: "Software Development",
    description: "Modern web applications, React, Node.js, TypeScript, Python, REST/GraphQL APIs, and Cloud deployment.",
    profile: {
      name: "Alex Ndlovu",
      location: "Cape Town / Remote South Africa",
      targetSalary: "R55,000 – R75,000 per month",
      targetRoles: [
        "Senior Full Stack Developer",
        "Frontend React Engineer",
        "Node.js Backend Developer",
        "Software Engineer (Full-Stack)"
      ],
      experienceSummary: "6+ years building high-traffic web applications, microservices, and distributed cloud systems. Skilled in React 18+, Next.js, Node.js, TypeScript, PostgreSQL, Docker, and AWS. Strong track record of shipping scalable SaaS products.",
      companiesWorkedAt: ["Takealot", "Yoco", "Luno", "Sanlam Digital"],
      keySkills: [
        "React", "TypeScript", "Node.js", "Next.js", "PostgreSQL",
        "Tailwind CSS", "REST APIs", "GraphQL", "AWS", "Docker",
        "CI/CD", "Jest", "Git", "System Design", "Agile/Scrum"
      ]
    }
  },
  {
    id: "devops-cloud",
    title: "Cloud & DevOps Engineer",
    category: "Cloud & DevOps",
    description: "Kubernetes, Terraform, AWS/Azure, CI/CD automation, observability, and container orchestration.",
    profile: {
      name: "Kabelo Mokoena",
      location: "Johannesburg / Remote South Africa",
      targetSalary: "R60,000 – R85,000 per month",
      targetRoles: [
        "Cloud Engineer",
        "DevOps Specialist",
        "Site Reliability Engineer (SRE)",
        "Infrastructure Lead"
      ],
      experienceSummary: "5+ years orchestrating hybrid-cloud infrastructure, automating deployments with GitHub Actions and Terraform, managing multi-cluster Kubernetes, and securing AWS/GCP cloud environments with zero downtime.",
      companiesWorkedAt: ["Vodacom", "Standard Bank Cloud", "Dimension Data"],
      keySkills: [
        "AWS", "Kubernetes", "Docker", "Terraform", "CI/CD Pipelines",
        "Linux Administration", "Python", "Prometheus/Grafana", "Ansible",
        "Azure", "Infrastructure as Code", "Security Hardening"
      ]
    }
  },
  {
    id: "data-analyst-bi",
    title: "Data Analyst & BI Specialist",
    category: "Data & Analytics",
    description: "Data modeling, PowerBI/Tableau visualization, SQL query optimization, Python data analytics, and reporting.",
    profile: {
      name: "Zanele Khumalo",
      location: "Johannesburg / Hybrid",
      targetSalary: "R40,000 – R58,000 per month",
      targetRoles: [
        "Senior Data Analyst",
        "Business Intelligence Specialist",
        "Analytics Engineer",
        "Reporting Lead"
      ],
      experienceSummary: "5+ years translating complex datasets into executive decision dashboards. Expert in SQL, PowerBI, Tableau, Python (Pandas/NumPy), and data warehousing (Snowflake, BigQuery). Experienced in retail and fintech analytics.",
      companiesWorkedAt: ["Discovery Health", "Shoprite Group", "Absa Group"],
      keySkills: [
        "SQL", "Power BI", "Tableau", "Python", "Data Warehousing",
        "ETL Pipelines", "Data Modeling", "Business Intelligence",
        "DAX", "Excel Advanced", "Snowflake", "A/B Testing"
      ]
    }
  },
  {
    id: "product-project-manager",
    title: "Technical Product / Project Manager",
    category: "Product & Project Management",
    description: "Product roadmap delivery, Agile/Scrum ceremonies, stakeholder management, and cross-functional leadership.",
    profile: {
      name: "Sipho Dlamini",
      location: "Pretoria / Remote South Africa",
      targetSalary: "R50,000 – R70,000 per month",
      targetRoles: [
        "Technical Product Manager",
        "Senior Agile Project Manager",
        "Scrum Master / Delivery Lead",
        "Program Manager"
      ],
      experienceSummary: "7+ years managing digital transformation, fintech platforms, and mobile apps from concept to launch. Certified Scrum Master (CSM) and PMP with strong business-to-technical translation skills.",
      companiesWorkedAt: ["Capitec Bank", "Old Mutual", "Multichoice"],
      keySkills: [
        "Product Management", "Agile & Scrum", "Jira / Confluence",
        "Roadmapping", "Sprint Planning", "Stakeholder Governance",
        "User Research", "KPI Analytics", "Risk Management", "PMP"
      ]
    }
  },
  {
    id: "customer-success-lead",
    title: "Customer Success & Enterprise Support Specialist",
    category: "Customer Support & CX",
    description: "High-touch customer onboarding, retention, Zendesk/Salesforce administration, and escalation management.",
    profile: {
      name: "Nadia Pieterse",
      location: "Durban / Remote",
      targetSalary: "R30,000 – R45,000 per month",
      targetRoles: [
        "Customer Success Manager",
        "Client Relationship Lead",
        "Senior Technical Support Specialist",
        "CX Operations Lead"
      ],
      experienceSummary: "6+ years managing client success for B2B SaaS and enterprise accounts. Proven record of reducing churn by 28% and exceeding Net Promoter Score (NPS) targets through proactive outreach and swift incident resolution.",
      companiesWorkedAt: ["Zoho Partner Africa", "Webafrica", "Afrihost"],
      keySkills: [
        "Customer Success", "Zendesk", "Salesforce", "Churn Prevention",
        "Onboarding", "SLA Monitoring", "Client Relationship Mgmt",
        "Conflict Resolution", "Technical Troubleshooting", "NPS Growth"
      ]
    }
  }
];

const CANDIDATE_PROFILE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    location: { type: Type.STRING },
    targetSalary: { type: Type.STRING },
    targetRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
    experienceSummary: { type: Type.STRING },
    companiesWorkedAt: { type: Type.ARRAY, items: { type: Type.STRING } },
    keySkills: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["name", "location", "targetSalary", "targetRoles", "experienceSummary", "companiesWorkedAt", "keySkills"]
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
    executivePitch: { type: Type.STRING },
    optimizedSummaries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          summaryText: { type: Type.STRING },
        },
        required: ["style", "summaryText"]
      }
    },
    recommendedBulletPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalConcept: { type: Type.STRING },
          enhancedBullet: { type: Type.STRING },
          targetRole: { type: Type.STRING },
          addedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["originalConcept", "enhancedBullet", "targetRole", "addedKeywords"]
      }
    },
    suggestedSkillsToAdd: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "overallAtsScore", "keywordMatchRate", "formattingScore", "impactScore",
    "matchedKeywords", "missingKeywords", "formattingSuggestions", "executivePitch",
    "optimizedSummaries", "recommendedBulletPoints", "suggestedSkillsToAdd"
  ]
};

const COVER_LETTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    company: { type: Type.STRING },
    letterText: { type: Type.STRING },
    keyHighlightsUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["jobTitle", "company", "letterText", "keyHighlightsUsed"]
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
          keyTip: { type: Type.STRING }
        },
        required: ["question", "category", "modelAnswerStar", "keyTip"]
      }
    }
  },
  required: ["targetRole", "questions"]
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
    fullMarkdownCV: { type: Type.STRING }
  },
  required: ["fullName", "headline", "executiveSummary", "coreCompetencies", "impactBullets", "suggestedCertifications", "fullMarkdownCV"]
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

export function cleanSearchQueryText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[/\-\\|()\[\]{}:;,\t\n]/g, ' ')
    .replace(/["'’`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPlatformSearchUrls(jobTitle: string, company: string, location: string = 'South Africa') {
  const cleanTitle = cleanSearchQueryText(jobTitle);
  const cleanCompany = cleanSearchQueryText(company);
  const combined = `${cleanTitle} ${cleanCompany}`.trim();
  const encCombined = encodeURIComponent(combined);
  const encLocation = encodeURIComponent(location || 'South Africa');

  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encCombined}&location=${encLocation}`,
    pnet: `https://www.pnet.co.za/jobs/search?keywords=${encCombined}`,
    indeed: `https://za.indeed.com/jobs?q=${encCombined}&l=${encLocation}`,
    careers24: `https://www.careers24.com/jobs/se-${encodeURIComponent(cleanTitle)}/`,
    offerzen: `https://www.offerzen.com/jobs?query=${encodeURIComponent(cleanTitle)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(`${cleanTitle} ${cleanCompany} South Africa job application`)}`,
    companySite: `https://www.google.com/search?q=${encodeURIComponent(`site:${cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.za OR site:${cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com careers ${cleanTitle}`)}`
  };
}

function isUrlInGrounding(url: string, groundingChunks?: Array<Record<string, unknown>>): boolean {
  if (!url || !groundingChunks || !Array.isArray(groundingChunks)) return false;
  const lowerUrl = url.toLowerCase().trim();
  return groundingChunks.some(chunk => {
    const web = (chunk.web as { uri?: string }) || {};
    const uri = (web.uri || (chunk.uri as string) || "").toLowerCase().trim();
    return uri && (uri === lowerUrl || uri.includes(lowerUrl) || lowerUrl.includes(uri));
  });
}

export function resolveDirectOrSearchUrl(
  rawLink: string,
  jobTitle: string,
  company: string,
  groundingChunks?: Array<Record<string, unknown>>
): string {
  const urls = getPlatformSearchUrls(jobTitle, company, 'South Africa');

  if (!rawLink || isGenericHomepage(rawLink)) {
    return urls.linkedin;
  }

  const lowerRaw = rawLink.toLowerCase();

  // If rawLink is a static LinkedIn view URL (e.g. linkedin.com/jobs/view/12345678)
  // or contains quotes/slashes, replace with live LinkedIn search URL to guarantee zero 404s
  if (lowerRaw.includes('linkedin.com/jobs/view/') || rawLink.includes('%22') || rawLink.includes('"')) {
    if (groundingChunks && isUrlInGrounding(rawLink, groundingChunks) && !lowerRaw.includes('%22')) {
      return rawLink;
    }
    return urls.linkedin;
  }

  if (groundingChunks && isUrlInGrounding(rawLink, groundingChunks)) {
    return rawLink;
  }

  if (lowerRaw.includes("pnet.co.za")) return urls.pnet;
  if (lowerRaw.includes("indeed.com")) return urls.indeed;
  if (lowerRaw.includes("offerzen.com")) return urls.offerzen;
  if (lowerRaw.includes("careers24.com")) return urls.careers24;
  if (lowerRaw.includes("linkedin.com")) return urls.linkedin;

  return urls.linkedin;
}

export function sanitizeReportLinks(report: DailyReport, groundingChunks?: Array<Record<string, unknown>>): DailyReport {
  if (!report) return report;
  const sanitizeJob = (job: JobMatch): JobMatch => ({
    ...job,
    applicationLink: resolveDirectOrSearchUrl(job.applicationLink, job.jobTitle, job.company, groundingChunks),
  });

  const topMatches = (report.topMatches || []).map(sanitizeJob);
  const secondaryMatches = (report.secondaryMatches || []).map(sanitizeJob);
  const totalCount = topMatches.length + secondaryMatches.length;

  const highMatches = topMatches.filter(j => j.probabilityOfSuccess === 'HIGH').length + secondaryMatches.filter(j => j.probabilityOfSuccess === 'HIGH').length;
  const mediumMatches = totalCount - highMatches;

  return {
    ...report,
    topMatches,
    secondaryMatches,
    summary: {
      totalJobsFound: totalCount,
      highMatches: highMatches,
      mediumMatches: mediumMatches,
    },
  };
}

/**
 * Universal CV / Resume Parser
 * Parses pasted raw resume text or job seeker summary into a structured CandidateProfile
 */
export async function parseCVToProfile(cvText: string): Promise<CandidateProfile> {
  const prompt = `
    You are an expert AI Talent Acquisition and Resume Parsing specialist.
    Parse the following raw candidate resume/CV or bio text into a structured Candidate Profile:

    RAW CANDIDATE TEXT:
    """
    ${cvText}
    """

    EXTRACT THE FOLLOWING FIELDS:
    - name: Candidate's Full Name (or "Candidate" if not mentioned).
    - location: Candidate's preferred location or current residence (e.g. "Johannesburg, South Africa (Open to Remote)").
    - targetSalary: Estimated target salary range or typical market rate for their level in ZAR/USD (e.g. "R45,000 – R65,000 per month").
    - targetRoles: Top 3-5 specific job titles the candidate is qualified for.
    - experienceSummary: A concise 2-4 sentence executive summary of their background, years of experience, and key accomplishments.
    - companiesWorkedAt: List of previous companies/employers mentioned.
    - keySkills: 10-16 technical, operational, and domain skills mentioned or implied.

    Return STRICT JSON matching the schema.
  `;

  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CANDIDATE_PROFILE_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to parse resume");
  }

  return JSON.parse(response.text) as CandidateProfile;
}

export async function generateDailyReport(profile: CandidateProfile): Promise<DailyReport> {
  const prompt = `
    You are an expert AI Job Search & Recruitment Agent.
    Your role is to automatically find, evaluate, and rank job opportunities tailored specifically for this candidate:

    CANDIDATE PROFILE:
    Name: ${profile.name}
    Location: ${profile.location}
    Target Salary: ${profile.targetSalary || "Market Rate"}
    Target Roles: ${profile.targetRoles.join(", ")}
    Experience Summary: ${profile.experienceSummary}
    Companies Worked At: ${profile.companiesWorkedAt.join(", ")}
    Key Skills: ${profile.keySkills.join(", ")}

    OBJECTIVES:
    1. Search for real, active job listings matching target roles in ${profile.location} or Remote.
    2. Provide a COMPREHENSIVE list of at least 8 to 12 distinct job opportunities.
       - Place 5 to 7 high-alignment roles in topMatches.
       - Place 3 to 5 additional strategic roles in secondaryMatches.
    3. Use Google Search to locate real job postings from LinkedIn, Indeed, PNet, OfferZen, Careers24, and corporate career portals.
    4. **CRITICAL - LINK INTEGRITY RULE**:
       - NEVER output generic homepages like "https://www.linkedin.com" or "https://www.pnet.co.za".
       - Return the EXACT, full deep link URL to the job post.
       - If an exact job view URL is unavailable, return a direct platform search URL like "https://www.linkedin.com/jobs/search/?keywords=JobTitle+Company+Location".
    5. Include only jobs matching at least 60% of the candidate's skills and within or near their target salary expectations (${profile.targetSalary}).
    6. Calculate a MATCH SCORE (0-100%).
    7. Determine PROBABILITY OF SUCCESS: HIGH (80-100%), MEDIUM (60-79%).
    8. Assign a unique string "id" to each job.
    9. Ensure summary.totalJobsFound equals the EXACT count of all items in topMatches and secondaryMatches combined.

    Return a DAILY REPORT in strict JSON format.
  `;

  const response = await getAi().models.generateContent({
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
    Analyze the following Candidate Profile for roles matching: ${profile.targetRoles.join(", ")} in ${profile.location}.

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
    6. List top 4-6 missing critical keywords expected by recruiters for these target roles.
    7. Provide 3 high-impact actionable CV formatting or phrasing improvements.
    8. Write a compelling 3-sentence Executive Elevator Pitch for recruiter outreach.
    9. Provide 3 optimized profile summary variations (e.g., Executive Leadership, Results-Driven Metric Focused, Technical Strategy).
    10. Generate 4 high-impact metric-driven bullet points formatted with STAR methodology (Situation, Task, Action, Result) with specific percentages, financial metrics, and measurable outcomes.
    11. Provide 5 strategic skills to add to boost search visibility.

    Return strict JSON matching the schema.
  `;

  const response = await getAi().models.generateContent({
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

export async function generateCoverLetter(
  profile: CandidateProfile, 
  targetJobTitle: string, 
  company: string
): Promise<CoverLetter> {
  const prompt = `
    Write a highly persuasive, professional, ATS-optimized Cover Letter tailored for ${profile.name} applying for the role of "${targetJobTitle}" at "${company}".
    
    CANDIDATE DETAILS:
    - Name: ${profile.name}
    - Location: ${profile.location}
    - Experience: ${profile.experienceSummary}
    - Key Skills: ${profile.keySkills.join(", ")}
    - Previous Companies: ${profile.companiesWorkedAt.join(", ")}
    - Target Salary Range: ${profile.targetSalary}

    RULES:
    - Keep tone executive, confident, and highly customized to ${company}.
    - Highlight specific operational leadership metrics, SLA track records, technical achievements, or relevant competencies.
    - Address how ${profile.name} solves key operational and organizational pain points for ${company} in the "${targetJobTitle}" role.
    - Length: 3-4 structured, well-spaced paragraphs.
  `;

  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: COVER_LETTER_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate cover letter");
  }

  return JSON.parse(response.text) as CoverLetter;
}

export async function generateInterviewPrep(
  profile: CandidateProfile,
  targetRole: string
): Promise<InterviewPrep> {
  const prompt = `
    You are an Executive Hiring Manager and Senior Recruiter.
    Prepare a comprehensive Interview Preparation package for ${profile.name} applying for "${targetRole}".

    CANDIDATE CONTEXT:
    - Target Role: ${targetRole}
    - Candidate Skills: ${profile.keySkills.join(", ")}
    - Background: ${profile.experienceSummary}
    - Previous Companies: ${profile.companiesWorkedAt.join(", ")}

    Provide 5 high-yield interview questions:
    - 1 Technical/Functional Domain question tailored to "${targetRole}"
    - 2 Behavioral questions (e.g. Handling critical incidents, conflict resolution, or team alignment)
    - 1 Leadership/Stakeholder Management question
    - 1 Scenario-Based Problem Solving / Crisis Management question.

    For each question, provide:
    1. The Question text.
    2. Category (Technical, Behavioral, Leadership, Scenario).
    3. Model STAR Answer (Situation, Task, Action, Result) referencing realistic industry situations.
    4. Pro Tip for interview delivery.
  `;

  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: INTERVIEW_PREP_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate interview prep");
  }

  return JSON.parse(response.text) as InterviewPrep;
}

export async function generateFullCVDraft(
  profile: CandidateProfile,
  targetRole: string
): Promise<FullCVDraft> {
  const prompt = `
    You are an Executive CV Writer and ATS Resume Optimization Specialist.
    Create a complete, beautifully structured, ATS-optimized CV Draft for ${profile.name} targeting the role: "${targetRole}".

    CANDIDATE INFO:
    - Name: ${profile.name}
    - Location: ${profile.location}
    - Experience: ${profile.experienceSummary}
    - Companies: ${profile.companiesWorkedAt.join(", ")}
    - Skills: ${profile.keySkills.join(", ")}

    REQUIREMENTS:
    - Craft a compelling executive headline tailored to "${targetRole}".
    - Write a high-impact executive summary.
    - List core competencies structured for ATS parsers.
    - Write 6 metric-driven experience bullet points using action verbs (e.g., "Spearheaded", "Architected", "Optimized", "Delivered", "Accelerated").
    - Provide recommended certifications to boost visibility for "${targetRole}".
    - Provide a full clean Markdown document of the entire CV ready for copying or exporting to PDF/Word.
  `;

  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CV_DRAFT_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate full CV draft");
  }

  return JSON.parse(response.text) as FullCVDraft;
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
    role: "Senior Full Stack Software Engineer",
    minSalary: "R55,000",
    medianSalary: "R72,000",
    maxSalary: "R95,000",
    demandTrend: "HIGH",
    topSkills: ["React/TypeScript", "Node.js", "PostgreSQL", "Cloud Architecture"]
  },
  {
    role: "Cloud & DevOps Specialist",
    minSalary: "R50,000",
    medianSalary: "R68,000",
    maxSalary: "R90,000",
    demandTrend: "HIGH",
    topSkills: ["Kubernetes", "AWS / Azure", "Terraform", "CI/CD Automation"]
  },
  {
    role: "Data Analyst & BI Specialist",
    minSalary: "R35,000",
    medianSalary: "R48,000",
    maxSalary: "R65,000",
    demandTrend: "HIGH",
    topSkills: ["SQL", "Power BI", "Python (Pandas)", "Data Modeling"]
  },
  {
    role: "Technical Product Manager",
    minSalary: "R48,000",
    medianSalary: "R62,000",
    maxSalary: "R82,000",
    demandTrend: "HIGH",
    topSkills: ["Agile/Scrum", "User Journey", "Jira", "Stakeholder Alignment"]
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
  },
  {
    role: "Customer Success / CX Manager",
    minSalary: "R30,000",
    medianSalary: "R42,000",
    maxSalary: "R55,000",
    demandTrend: "HIGH",
    topSkills: ["Zendesk/Salesforce", "Churn Reduction", "Account Onboarding", "NPS Growth"]
  }
];

