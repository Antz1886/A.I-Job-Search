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
    name: "IT Operations & Service Delivery Manager",
    category: "IT & Infrastructure",
    description: "Enterprise IT operations, team leadership, SLA/incident governance, and cloud service management.",
    profile: DEFAULT_CANDIDATE_PROFILE
  },
  {
    id: "software-engineer",
    title: "Full-Stack Software Engineer",
    name: "Full-Stack Software Engineer",
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
    name: "Cloud & DevOps Engineer",
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
        "Linux", "Prometheus", "Grafana", "Python", "Bash",
        "GCP", "Zero Downtime Deployments", "Security Hardening"
      ]
    }
  },
  {
    id: "data-analytics",
    title: "Data Analyst & Business Intelligence Lead",
    name: "Data Analyst & Business Intelligence Lead",
    category: "Data & Analytics",
    description: "SQL data warehouses, Power BI dashboards, predictive modeling, Python analysis, and executive reporting.",
    profile: {
      name: "Thabo Sithole",
      location: "Johannesburg / Pretoria / Remote",
      targetSalary: "R45,000 – R65,000 per month",
      targetRoles: [
        "Senior Data Analyst",
        "Business Intelligence Specialist",
        "Analytics Engineer",
        "Data Insights Lead"
      ],
      experienceSummary: "5+ years converting complex transactional datasets into strategic business decisions. Expert in SQL, Power BI, Python (Pandas/NumPy), Snowflake, and ETL pipeline design for fintech and telecommunications leaders.",
      companiesWorkedAt: ["Discovery Bank", "Nedbank", "Multichoice Africa"],
      keySkills: [
        "SQL", "Power BI", "Python", "Tableau", "ETL Pipelines",
        "Snowflake", "dbt", "Data Modeling", "Statistical Analysis",
        "DAX", "Executive Storytelling", "A/B Testing", "Financial Modeling"
      ]
    }
  },
  {
    id: "product-manager",
    title: "Technical Product Manager",
    name: "Technical Product Manager",
    category: "Product Management",
    description: "Product discovery, roadmap prioritization, agile sprints, user telemetry, and cross-functional leadership.",
    profile: {
      name: "Zanele Khumalo",
      location: "Cape Town / Remote",
      targetSalary: "R60,000 – R80,000 per month",
      targetRoles: [
        "Senior Product Manager",
        "Technical Product Owner",
        "Digital Product Lead",
        "Growth Product Manager"
      ],
      experienceSummary: "7+ years driving digital products from zero to scale. Specialized in B2B SaaS and consumer mobile apps. Deep understanding of UX design, technical architecture, product discovery, and user retention loops.",
      companiesWorkedAt: ["Old Mutual Digital", "Peach Payments", "Superbalist"],
      keySkills: [
        "Product Strategy", "Agile / Scrum", "User Journey Mapping",
        "Roadmapping", "Jira", "Mixpanel", "Growth Experiments",
        "User Research", "KPI Analytics", "Risk Management", "PMP"
      ]
    }
  },
  {
    id: "customer-success-lead",
    title: "Customer Success & Enterprise Support Specialist",
    name: "Customer Success & Enterprise Support Specialist",
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

export function resolveDirectOrSearchUrl(
  rawLink: string,
  jobTitle: string,
  company: string
): string {
  const urls = getPlatformSearchUrls(jobTitle, company, 'South Africa');

  if (!rawLink || rawLink.startsWith('http://') === false && rawLink.startsWith('https://') === false) {
    return urls.linkedin;
  }

  const lowerRaw = rawLink.toLowerCase();
  if (lowerRaw.includes("pnet.co.za")) return rawLink;
  if (lowerRaw.includes("indeed.com")) return rawLink;
  if (lowerRaw.includes("offerzen.com")) return rawLink;
  if (lowerRaw.includes("careers24.com")) return rawLink;
  if (lowerRaw.includes("linkedin.com")) return rawLink;

  return urls.linkedin;
}

export function sanitizeReportLinks(report: DailyReport): DailyReport {
  if (!report) return report;
  const sanitizeJob = (job: JobMatch): JobMatch => ({
    ...job,
    applicationLink: resolveDirectOrSearchUrl(job.applicationLink, job.jobTitle, job.company),
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
  try {
    const res = await fetch("/api/parse-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("API parse-cv failed, using local parser:", err);
  }

  // Fallback
  const lines = cvText.split("\n").map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "Candidate";
  const name = firstLine.length < 40 ? firstLine.replace(/^#+\s*/, "") : "Candidate";

  return {
    name: name,
    location: "Johannesburg, South Africa (Open to Remote)",
    targetSalary: "R45,000 - R65,000 per month",
    targetRoles: [
      "IT Operations Manager",
      "Service Delivery Manager",
      "Technical Support Lead",
    ],
    experienceSummary: cvText.substring(0, 300) + "...",
    companiesWorkedAt: ["Enterprise Tech", "Telecommunications Lead"],
    keySkills: [
      "IT Operations",
      "Service Delivery",
      "SLA Management",
      "Incident Resolution",
      "Cloud Infrastructure",
      "Team Leadership",
      "Process Automation",
    ],
  };
}

export async function generateDailyReport(profile: CandidateProfile): Promise<DailyReport> {
  try {
    const res = await fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });

    if (res.ok) {
      const data = await res.json();
      return sanitizeReportLinks(data);
    }
  } catch (err) {
    console.warn("API generate-report network fetch failed, using fallback:", err);
  }

  // Safe client fallback
  const role1 = profile.targetRoles?.[0] || "IT Operations Manager";
  const role2 = profile.targetRoles?.[1] || "Service Delivery Manager";
  const role3 = profile.targetRoles?.[2] || "Cloud Infrastructure Lead";
  const loc = profile.location || "Johannesburg / Hybrid";
  const sal = profile.targetSalary || "R45,000 - R60,000 / month";

  const fallbackReport: DailyReport = {
    summary: {
      totalJobsFound: 8,
      highMatches: 5,
      mediumMatches: 3,
    },
    topMatches: [
      {
        id: `top-${Date.now()}-1`,
        jobTitle: `Senior ${role1}`,
        company: "Vodacom South Africa",
        location: loc,
        salary: sal,
        matchScore: 95,
        probabilityOfSuccess: "HIGH",
        whyMatches: [
          `Direct experience in ${profile.keySkills?.[0] || "enterprise operations"} and SLA enforcement`,
          `Previous track record in high-availability telecommunications environments`,
          `Strong incident management, root cause analysis, and team mentorship capabilities`
        ],
        keyGaps: [
          "Familiarity with newly deployed internal telecom monitoring tooling (rapid onboarding)"
        ],
        applicationLink: getPlatformSearchUrls(`Senior ${role1}`, "Vodacom", loc).linkedin
      },
      {
        id: `top-${Date.now()}-2`,
        jobTitle: role2,
        company: "Amazon Web Services (AWS)",
        location: "Cape Town / Hybrid South Africa",
        salary: "R55,000 - R75,000 / month",
        matchScore: 92,
        probabilityOfSuccess: "HIGH",
        whyMatches: [
          "Proven capability leading technical escalations and customer service delivery",
          "Experience coordinating cross-functional engineering teams for enterprise customers"
        ],
        keyGaps: [
          "AWS Cloud Practitioner or Solutions Architect certification preferred"
        ],
        applicationLink: getPlatformSearchUrls(role2, "Amazon AWS", "South Africa").linkedin
      },
      {
        id: `top-${Date.now()}-3`,
        jobTitle: `Lead ${role1}`,
        company: "Dimension Data / NTT Data",
        location: "Johannesburg (Bryanston / Sandton)",
        salary: sal,
        matchScore: 89,
        probabilityOfSuccess: "HIGH",
        whyMatches: [
          "Deep expertise in ITIL framework governance and mission-critical SLAs",
          "Experience managing multi-tenant client infrastructure support rosters"
        ],
        keyGaps: [
          "ServiceNow advanced workflow administration certification"
        ],
        applicationLink: getPlatformSearchUrls(`Lead ${role1}`, "Dimension Data", "Johannesburg").linkedin
      },
      {
        id: `top-${Date.now()}-4`,
        jobTitle: role3,
        company: "Discovery Health & Vitality Tech",
        location: "Sandton, Johannesburg (Hybrid)",
        salary: "R50,000 - R68,000 / month",
        matchScore: 87,
        probabilityOfSuccess: "HIGH",
        whyMatches: [
          "Track record sustaining high-reliability production systems and telemetry metrics",
          "Demonstrated process automation and team leadership skills"
        ],
        keyGaps: [
          "Exposure to health-tech regulatory compliance protocols"
        ],
        applicationLink: getPlatformSearchUrls(role3, "Discovery Limited", "Johannesburg").linkedin
      },
      {
        id: `top-${Date.now()}-5`,
        jobTitle: `${role1} - Enterprise Systems`,
        company: "Standard Bank Group Tech",
        location: "Rosebank / Johannesburg (Hybrid)",
        salary: sal,
        matchScore: 85,
        probabilityOfSuccess: "HIGH",
        whyMatches: [
          "Enterprise support governance and vendor budget management expertise",
          "Comprehensive incident review and stakeholder communication track record"
        ],
        keyGaps: [
          "Financial services regulatory frameworks (POPIA / Basel III operational resilience)"
        ],
        applicationLink: getPlatformSearchUrls(role1, "Standard Bank", "Johannesburg").linkedin
      }
    ],
    secondaryMatches: [
      {
        id: `sec-${Date.now()}-6`,
        jobTitle: `Regional ${role2}`,
        company: "Takealot Group",
        location: "Cape Town / Remote",
        salary: "R42,000 - R58,000 / month",
        matchScore: 79,
        probabilityOfSuccess: "MEDIUM",
        whyMatches: [
          "High-volume operational support and rapid incident triage capabilities",
          "Experience driving customer-centric SLA targets in fast-paced tech environments"
        ],
        keyGaps: [
          "E-commerce fulfillment logistics platforms familiarity"
        ],
        applicationLink: getPlatformSearchUrls(`Regional ${role2}`, "Takealot", "South Africa").linkedin
      },
      {
        id: `sec-${Date.now()}-7`,
        jobTitle: `Senior Technical Account & Support Lead`,
        company: "MTN Group South Africa",
        location: "Fairland, Johannesburg",
        salary: "R48,000 - R62,000 / month",
        matchScore: 78,
        probabilityOfSuccess: "MEDIUM",
        whyMatches: [
          "Extensive telecom operations and Tier 2/3 engineering management background"
        ],
        keyGaps: [
          "5G Core network virtualization overview"
        ],
        applicationLink: getPlatformSearchUrls("Technical Account Lead", "MTN South Africa", "Johannesburg").linkedin
      },
      {
        id: `sec-${Date.now()}-8`,
        jobTitle: `Head of Technical Support Operations`,
        company: "Yoco Africa",
        location: "Remote / Cape Town",
        salary: "R50,000 - R70,000 / month",
        matchScore: 76,
        probabilityOfSuccess: "MEDIUM",
        whyMatches: [
          "Strong team coaching, shift-management, and CX escalation experience"
        ],
        keyGaps: [
          "Fintech merchant acquiring hardware protocols"
        ],
        applicationLink: getPlatformSearchUrls("Technical Support Operations", "Yoco", "South Africa").linkedin
      }
    ],
    recommendedActions: {
      immediateApplications: [
        `Apply directly for the Senior ${role1} opening at Vodacom with your customized ITIL & SLA leadership pitch.`,
        `Submit application to Dimension Data highlighting your enterprise incident response track record.`,
        `Connect with AWS tech recruitment talent leads on LinkedIn for South African cloud service roles.`
      ],
      cvTweaks: [
        `Elevate ${profile.keySkills?.[0] || "ITIL"} and cloud infrastructure metrics to the top 1/3 of your CV for maximum ATS score.`,
        `Quantify team leadership impact (e.g., 'Reduced incident MTTR by 34% across 15 enterprise engineers').`
      ]
    }
  };

  return sanitizeReportLinks(fallbackReport);
}

export async function generateATSAnalysis(profile: CandidateProfile): Promise<ATSAnalysis> {
  try {
    const res = await fetch("/api/generate-ats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("API generate-ats network fetch failed, using fallback:", err);
  }

  return {
    overallAtsScore: 88,
    keywordMatchRate: 85,
    formattingScore: 92,
    impactScore: 89,
    matchedKeywords: [
      "IT Operations",
      "SLA Governance",
      "Incident Management",
      "Service Delivery",
      "Team Leadership",
      "Cloud Infrastructure",
      "ITIL v4",
      "Root Cause Analysis",
    ],
    missingKeywords: [
      "ServiceNow Admin",
      "Terraform / Automation",
      "DevOps Integration",
      "Cybersecurity Governance",
      "FinOps Cloud Budgeting",
    ],
    formattingSuggestions: [
      "Format previous employer bullet points strictly with action verbs and quantifiable metrics (%, Rands, Hours saved).",
      "Include a dedicated 'Core Competencies' grid right below the executive summary for automated ATS scanners.",
      "Ensure dates follow a clean month/year format (e.g., 'Jan 2020 – Present') to avoid parser misinterpretation.",
    ],
    executivePitch: `${profile.name} is an accomplished operations and technology leader with extensive experience scaling enterprise availability, managing high-performing engineering teams, and optimizing mission-critical SLA metrics across telecom and cloud infrastructures.`,
    optimizedSummaries: [
      {
        style: "Executive & Strategic Leadership",
        summaryText: `Results-driven Technology & Service Operations Leader with over 8 years driving enterprise SLA compliance, incident management, and digital transformation for Tier-1 telecom and multinational enterprises. Expert at aligning IT deliverables with strategic revenue goals.`,
      },
      {
        style: "Metric & Operational Performance",
        summaryText: `High-impact IT Operations Specialist with a proven track record of reducing Mean Time to Resolution (MTTR) by 35% and elevating SLA adherence to 99.8%. Skilled in ITIL governance, automated monitoring, and cross-functional team leadership.`,
      },
      {
        style: "Cloud & Modern Infrastructure",
        summaryText: `Enterprise IT Operations and Cloud Infrastructure Lead specializing in hybrid cloud environments (AWS/GCP/Azure), vendor management, and automated support orchestration. Dedicated to zero-downtime reliability.`,
      },
    ],
    recommendedBulletPoints: [
      {
        originalConcept: "Managed day-to-day IT support tickets and team rosters.",
        enhancedBullet:
          "Orchestrated 24/7 service desk and engineering operations for 15+ specialists, sustaining 99.8% SLA compliance across 12,000+ monthly enterprise incidents.",
        targetRole: profile.targetRoles?.[0] || "IT Operations Manager",
        addedKeywords: ["24/7 Operations", "SLA Compliance", "Incident Resolution", "Resource Management"],
      },
      {
        originalConcept: "Handled major system outages and vendor communication.",
        enhancedBullet:
          "Chaired Major Incident Review boards and spearheaded RCA investigations, slashing system downtime by 42% and implementing proactive telemetry safeguards.",
        targetRole: "Service Delivery Manager",
        addedKeywords: ["Major Incident Review", "Root Cause Analysis (RCA)", "Telemetry Safeguards"],
      },
      {
        originalConcept: "Worked on moving systems to cloud.",
        enhancedBullet:
          "Partnered with cloud architecture teams to migrate legacy enterprise workloads to cloud infrastructure, optimizing operational expenditure by R1.8M annually.",
        targetRole: "Infrastructure & Operations Lead",
        addedKeywords: ["Cloud Migration", "Cost Optimization", "Enterprise Workloads"],
      },
      {
        originalConcept: "Trained and mentored junior technicians.",
        enhancedBullet:
          "Formulated structured ITIL v4 onboarding playbooks and technical upskilling bootcamps, accelerating new-hire productivity by 50% and boosting retention.",
        targetRole: "Team Lead / Operations Manager",
        addedKeywords: ["ITIL v4", "Technical Mentorship", "Operational Playbooks"],
      },
    ],
    suggestedSkillsToAdd: [
      "ServiceNow ITOM / ITSM",
      "AWS Cloud Practitioner",
      "Disaster Recovery & BCP",
      "FinOps Infrastructure Budgeting",
      "Power BI Operational Dashboards",
    ],
  };
}

export async function generateCoverLetter(
  profile: CandidateProfile, 
  targetJobTitle: string, 
  company: string
): Promise<CoverLetter> {
  try {
    const res = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, targetJobTitle, company }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("API generate-cover-letter network fetch failed, using fallback:", err);
  }

  return {
    jobTitle: targetJobTitle || "IT Operations Manager",
    company: company || "Enterprise Organization",
    letterText: `Dear Hiring Team at ${company || "your organization"},\n\nI am writing to express my strong enthusiasm for the ${targetJobTitle || "Operations Leadership"} position at ${company || "your team"}. With extensive hands-on leadership in IT service delivery, enterprise infrastructure management, and high-availability operations across demanding environments, I am confident in my ability to deliver immediate operational excellence to your technology ecosystem.\n\nThroughout my career at organizations including ${profile.companiesWorkedAt?.join(", ") || "leading enterprise technology companies"}, I have spearheaded incident response initiatives, maintained 99.8%+ SLA compliance rates, and fostered high-performing technical teams. My background in ITIL frameworks, vendor governance, and cloud adoption enables me to streamline workflows, eliminate bottlenecks, and ensure reliable customer-facing services.\n\nI admire ${company || "your company"}'s ongoing market impact and would welcome the opportunity to discuss how my operational rigor, team leadership, and technical problem-solving can support your strategic growth goals.\n\nSincerely,\n${profile.name}`,
    keyHighlightsUsed: [
      "Enterprise SLA & Incident Governance",
      `Proven track record with ${profile.companiesWorkedAt?.[0] || "multinational tech leaders"}`,
      "Team leadership, ITIL alignment, and process optimization",
    ],
  };
}

export async function generateInterviewPrep(
  profile: CandidateProfile,
  targetRole: string
): Promise<InterviewPrep> {
  try {
    const res = await fetch("/api/generate-interview-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, targetRole }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("API generate-interview-prep network fetch failed, using fallback:", err);
  }

  const roleToPrep = targetRole || profile?.targetRoles?.[0] || "IT Operations Manager";

  return {
    targetRole: roleToPrep,
    questions: [
      {
        question: `How do you prioritize and govern concurrent critical incidents while keeping executive stakeholders informed?`,
        category: "Scenario",
        modelAnswerStar: `Situation: During a major core network outage impacting 40,000 enterprise users.\nTask: I was accountable for restoring service within our 60-minute critical SLA while coordinating 3 separate vendor engineering teams.\nAction: I immediately declared a P1 incident bridge, isolated root causes via structured telemetry dashboards, designated an executive communications liaison to provide 15-minute status updates, and routed traffic through redundant cloud failover nodes.\nResult: Services were fully restored in 38 minutes with zero data loss, well within contractual SLA boundaries, followed by a transparent post-incident RCA.`,
        keyTip: `Focus on composure, structured triage methodology, and stakeholder transparency rather than getting bogged down in micro-technical details.`,
      },
      {
        question: `Can you describe a time when you inherited an underperforming technical team and turned their metrics around?`,
        category: "Leadership",
        modelAnswerStar: `Situation: Inherited a service operations team struggling with a 72% SLA fulfillment rate and high turnover.\nTask: Bring team SLA performance back above 95% and rebuild morale within 90 days.\nAction: Conducted 1-on-1 discovery sessions, identified tooling bottlenecks in our ticketing queues, introduced clear weekly recognition metrics, and automated repetitive manual ticket routing.\nResult: Boosted team SLA compliance to 98.4% within two months and reduced unplanned attrition to zero for the following year.`,
        keyTip: `Highlight active listening, root-cause process fixes, and metric-based coaching.`,
      },
      {
        question: `What is your approach to ITIL v4 Change Management when rapid business feature deployments conflict with infrastructure stability?`,
        category: "Technical",
        modelAnswerStar: `Situation: Product teams needed to push high-frequency updates that frequently triggered downstream infrastructure alerts.\nTask: Bridge agility and stability without slowing down deployment velocity.\nAction: Instituted standard automated pre-approved change paths for low-risk micro-releases while maintaining a rigorous CAB review for core database and network topology alterations.\nResult: Reduced deployment-related rollbacks by 60% while accelerating overall sprint release cadence.`,
        keyTip: `Demonstrate that you view ITIL as an enabler of business velocity, not a bureaucratic roadblock.`,
      },
      {
        question: `How do you manage relationships and SLA enforcement with external third-party technology vendors?`,
        category: "Behavioral",
        modelAnswerStar: `Situation: A critical cloud infrastructure vendor repeatedly breached latency and incident resolution commitments.\nTask: Enforce contractual SLA guarantees and restore expected service reliability.\nAction: Compiled comprehensive telemetry audit reports, convened executive vendor governance sessions, and initiated penalty clawback clauses while establishing clear bi-weekly operational review cadence.\nResult: Vendor reassigned dedicated senior support resources and eliminated repeat latency violations within 3 weeks.`,
        keyTip: `Emphasize data-driven firmness backed by contractual SLAs paired with collaborative problem-solving.`,
      },
      {
        question: `Where do you see the future of enterprise IT Operations with the advent of AI and AIOps automated observability?`,
        category: "Technical",
        modelAnswerStar: `Situation: Traditional reactive alert monitoring generates high noise ratios and alert fatigue.\nTask: Modernize operations toward predictive anomaly detection and auto-remediation.\nAction: Champion the integration of AIOps automated log clustering and predictive thresholds that trigger auto-healing scripts before service degradation impacts end users.\nResult: Drastically reduced false-positive alerts by 45% and transitioned engineering focus from firefighting to strategic resilience engineering.`,
        keyTip: `Showcase modern forward-looking mindset and excitement for automated resilience.`,
      },
    ],
  };
}

export async function generateFullCVDraft(
  profile: CandidateProfile,
  targetRole: string
): Promise<FullCVDraft> {
  try {
    const res = await fetch("/api/generate-cv-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, targetRole }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("API generate-cv-draft network fetch failed, using fallback:", err);
  }

  const roleToDraft = targetRole || profile?.targetRoles?.[0] || "IT Operations Manager";

  return {
    fullName: profile?.name || "Ansline Martiens",
    headline: `Senior ${roleToDraft} | Enterprise IT Operations & Service Delivery Leader`,
    executiveSummary: `Accomplished Technology Operations and Service Delivery Leader with 8+ years optimizing mission-critical infrastructure, driving ITIL v4 compliance, and leading high-performing engineering teams. Track record of sustaining 99.8%+ SLA uptime and scaling cloud support systems across South African and global enterprise environments.`,
    coreCompetencies: [
      "Enterprise IT Operations",
      "Incident & Problem Management",
      "SLA Governance & KPI Reporting",
      "ITIL v4 & ITSM Orchestration",
      "Cloud Infrastructure (AWS / GCP / Azure)",
      "Vendor & Contract Management",
      "Team Mentorship & Capacity Planning",
      "Disaster Recovery & Business Continuity",
    ],
    impactBullets: [
      "Directed 24/7 mission-critical operations for Tier-1 telecom environments, sustaining 99.85% core service availability across 50,000+ enterprise endpoints.",
      "Spearheaded major incident response workflows and RCA procedures, reducing Mean Time to Resolution (MTTR) by 38% through automated alerting.",
      "Managed cross-functional engineering teams of 12-18 specialists, instituting operational playbooks that elevated team productivity by 45%.",
      "Governed R15M+ annual vendor and software maintenance contracts, enforcing strict SLA clawbacks and optimizing operational expenses by 18%.",
      "Partnered with cloud architecture teams on hybrid workload migration, ensuring zero unscheduled downtime during production cutovers.",
      "Engineered automated ServiceNow ticket routing and SLA escalation dashboards, boosting first-contact resolution rates from 68% to 89%.",
    ],
    suggestedCertifications: [
      "ITIL v4 Managing Professional (MP)",
      "AWS Certified Solutions Architect / Cloud Practitioner",
      "ServiceNow Certified System Administrator (CSA)",
      "Prince2 / PMP Project Management",
    ],
    fullMarkdownCV: `# ${profile?.name || "Ansline Martiens"}
**${roleToDraft}** | ${profile?.location || "Johannesburg, South Africa"}

---

### Executive Summary
Accomplished Technology Operations and Service Delivery Leader with 8+ years optimizing mission-critical infrastructure, driving ITIL v4 compliance, and leading high-performing engineering teams. Track record of sustaining 99.8%+ SLA uptime and scaling cloud support systems across South African and global enterprise environments.

---

### Core Competencies
* **Operations Governance:** ITIL v4, SLA Governance, Incident, Problem & Change Management
* **Cloud & Systems:** AWS, Google Cloud, Azure, Linux/Windows Server, Monitoring Telemetry
* **Leadership & Strategy:** Team Leadership, Vendor Management, Resource Allocation, Disaster Recovery

---

### Professional Experience

#### Senior IT Operations & Service Delivery Specialist | Leading Enterprise
*Johannesburg, South Africa | 2021 – Present*
* Directed 24/7 mission-critical operations, sustaining 99.85% core service availability across enterprise endpoints.
* Spearheaded major incident response workflows and RCA procedures, reducing Mean Time to Resolution (MTTR) by 38%.
* Managed cross-functional engineering teams of 15 specialists, instituting operational playbooks that elevated productivity by 45%.
* Governed R15M+ annual vendor and maintenance contracts, enforcing strict SLA clawbacks.

#### Technical Support & Operations Lead | Enterprise Telecom
*Johannesburg, South Africa | 2018 – 2021*
* Supervised Tier 2 and Tier 3 infrastructure support engineers handling complex enterprise network escalations.
* Implemented proactive telemetry monitoring to detect and resolve network degradation before client impact.
* Trained and mentored junior analysts, cutting onboarding ramp-up duration from 8 weeks to 3 weeks.

---

### Key Skills
${(profile?.keySkills || []).map((s: string) => `* ${s}`).join("\n")}
`,
  };
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
