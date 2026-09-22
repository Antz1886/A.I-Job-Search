import {
  CandidateProfile,
  DailyReport,
  ATSAnalysis,
  CoverLetter,
  InterviewPrep,
  JobMatch,
  FullCVDraft,
} from '../types';

export interface IndustryConfig {
  name: string;
  employers: Array<{ name: string; location: string }>;
  inDemandSkills: string[];
  certifications: string[];
  metrics: string[];
  roleExamples: string[];
}

export function resolveCandidateIndustry(profile: Partial<CandidateProfile>): IndustryConfig {
  const combined = `${(profile.targetRoles || []).join(' ')} ${(profile.keySkills || []).join(' ')} ${profile.experienceSummary || ''}`.toLowerCase();

  // 1. Finance, Banking & Accounting
  if (/financ|account|audit|tax|ifrs|ca\(sa\)|invest|bank|treasury|ledger|cfo|reconciliation|bookkeep/i.test(combined)) {
    return {
      name: "Finance, Banking & Accounting",
      employers: [
        { name: "Standard Bank Corporate", location: "Rosebank, Johannesburg (Hybrid)" },
        { name: "FirstRand / FNB", location: "Sandton, Johannesburg" },
        { name: "Investec South Africa", location: "Sandton, Johannesburg" },
        { name: "Discovery Limited Finance", location: "Sandton, Johannesburg" },
        { name: "Sanlam Financial Services", location: "Bellville, Cape Town / Remote" },
        { name: "Old Mutual South Africa", location: "Pinelands, Cape Town / Hybrid" },
        { name: "PwC South Africa", location: "Waterfall City, Midrand" },
        { name: "Nedbank Group", location: "Sandton, Johannesburg" },
      ],
      inDemandSkills: ["Financial Modeling", "IFRS Compliance", "Regulatory Reporting", "Risk Management", "ERP (SAP / Oracle)", "Cash Flow Forecasting", "Management Accounting"],
      certifications: ["SAICA CA(SA)", "CIMA Professional", "CFA Charter", "FAIS RE5 Certification"],
      metrics: ["Reduced month-end financial closing cycle by 4 days", "Optimized working capital allocation by R8.4M", "Achieved 100% clean audit compliance across all corporate entities"],
      roleExamples: ["Financial Manager", "Senior Management Accountant", "Financial Analyst", "Audit Manager", "Finance Director"]
    };
  }

  // 2. Healthcare, Clinical & Life Sciences
  if (/health|clinic|medic|nurs|pharma|patient|hospital|biotech|doctor|therap/i.test(combined)) {
    return {
      name: "Healthcare & Life Sciences",
      employers: [
        { name: "Netcare Healthcare Group", location: "Sandton, Johannesburg" },
        { name: "Life Healthcare", location: "Rosebank, Johannesburg" },
        { name: "Mediclinic Southern Africa", location: "Stellenbosch / Hybrid" },
        { name: "Discovery Health", location: "Sandton, Johannesburg" },
        { name: "Aspen Pharmacare", location: "Durban / Hybrid" },
        { name: "Dis-Chem Pharmacies Corporate", location: "Midrand, Gauteng" },
        { name: "Clicks Group Health", location: "Cape Town / Hybrid" },
        { name: "National Health Laboratory Service", location: "Johannesburg" },
      ],
      inDemandSkills: ["Clinical Governance", "Patient Care Protocols", "Healthcare Compliance", "Quality Assurance", "Healthcare Administration", "Health Records (EMR/EHR)", "Infection Prevention"],
      certifications: ["SANC Registration", "HPCSA Certification", "Healthcare Quality Management (HQM)", "GCP Clinical Practice"],
      metrics: ["Maintained 99.4% clinical compliance audit score", "Reduced patient intake wait times by 28%", "Trained 35+ clinical staff on updated SOPs with zero adverse incidents"],
      roleExamples: ["Healthcare Operations Manager", "Clinical Services Administrator", "Unit Practice Manager", "Health Information Specialist"]
    };
  }

  // 3. Marketing, Media & Brand Communications
  if (/market|brand|social media|seo|content|creative|copywrit|pr\b|public relation|advertising|campaign|growth/i.test(combined)) {
    return {
      name: "Marketing, Media & Brand Communications",
      employers: [
        { name: "MultiChoice Group", location: "Randburg, Johannesburg" },
        { name: "Takealot Group Marketing", location: "Cape Town / Hybrid" },
        { name: "Ogilvy South Africa", location: "Bryanston, Johannesburg" },
        { name: "Showmax Africa", location: "Johannesburg / Remote" },
        { name: "Nando's Worldwide", location: "Johannesburg, South Africa" },
        { name: "Woolworths Brand & Marketing", location: "Cape Town / Hybrid" },
        { name: "Vodacom Commercial & Brand", location: "Midrand, Johannesburg" },
        { name: "TBWA\\Hunt Lascaris", location: "Sandton, Johannesburg" },
      ],
      inDemandSkills: ["Omnichannel Strategy", "Brand Storytelling", "Campaign Performance", "Marketing Analytics (GA4)", "Paid Media & ROAS", "Content Lifecycle", "Customer Acquisition"],
      certifications: ["Google Marketing Platform Certified", "Meta Certified Media Specialist", "HubSpot Inbound Marketing", "DMI Digital Marketing Pro"],
      metrics: ["Elevated organic inbound traffic by 64% in 6 months", "Achieved 4.8x ROAS across multi-channel digital campaigns", "Scaled active brand reach to 2.5M unique consumers"],
      roleExamples: ["Marketing Manager", "Brand Strategist", "Digital Marketing Specialist", "Communications Director", "Growth Marketing Lead"]
    };
  }

  // 4. Sales, Commercial & Business Development
  if (/sales|account exec|business dev|bdm|client relation|revenue|quota|deal|consultative|commercial/i.test(combined)) {
    return {
      name: "Sales, Business Development & Commercial",
      employers: [
        { name: "Discovery Corporate Sales", location: "Sandton, Johannesburg" },
        { name: "Vodacom Enterprise Business", location: "Midrand / Hybrid" },
        { name: "Dimension Data Commercial", location: "Bryanston, Johannesburg" },
        { name: "Standard Bank Commercial Banking", location: "Rosebank, Johannesburg" },
        { name: "Liberty Corporate", location: "Braamfontein, Johannesburg" },
        { name: "Takealot Marketplace Sales", location: "Cape Town / Hybrid" },
        { name: "Bidvest Commercial Group", location: "Johannesburg / Remote" },
        { name: "Momentum Metropolitan", location: "Centurion, Pretoria" },
      ],
      inDemandSkills: ["B2B Solution Selling", "Pipeline Forecasting", "Consultative Negotiation", "Key Account Management", "CRM Mastery (Salesforce)", "Executive Stakeholder Engagement", "Contract Closing"],
      certifications: ["MEDDPIC Sales Methodology", "Salesforce Certified Professional", "Miller Heiman Strategic Selling", "Challenger Sales Practitioner"],
      metrics: ["Exceeded annual enterprise revenue quota by 132%", "Closed R14.5M in new commercial contracts", "Grew key account retention rate to 96.8%"],
      roleExamples: ["Key Account Manager", "Business Development Manager", "Commercial Director", "B2B Sales Specialist", "National Sales Manager"]
    };
  }

  // 5. Human Resources & Talent Management
  if (/human resource|hr\b|people ops|talent|recruit|employee relation|labour|b-bbee|payroll|staffing/i.test(combined)) {
    return {
      name: "Human Resources & Talent Management",
      employers: [
        { name: "Standard Bank People & Culture", location: "Rosebank, Johannesburg" },
        { name: "MultiChoice People Operations", location: "Randburg, Johannesburg" },
        { name: "Sanlam People & Organization", location: "Bellville, Cape Town" },
        { name: "Sasol Corporate HR", location: "Sandton, Johannesburg" },
        { name: "Discovery People Experience", location: "Sandton, Johannesburg" },
        { name: "Woolworths Human Capital", location: "Cape Town / Hybrid" },
        { name: "Anglo American HR", location: "Johannesburg / Remote" },
        { name: "Vodacom HR Operations", location: "Midrand, Johannesburg" },
      ],
      inDemandSkills: ["Strategic Talent Acquisition", "B-BBEE & Employment Equity", "Employee Relations & LRA", "Performance Management", "HRIS (Workday / SAP)", "Organizational Culture", "Workforce Planning"],
      certifications: ["SABPP Chartered HR Practitioner", "CIPD Level 5/7", "B-BBEE Champion Certification", "CCMA Labor Law Certificate"],
      metrics: ["Reduced time-to-hire by 35% across 45 senior appointments", "Boosted organizational employee engagement by 22 points", "Achieved Level 1 B-BBEE human capital scorecard targets"],
      roleExamples: ["HR Business Partner", "Talent Acquisition Lead", "People Operations Manager", "Employee Relations Specialist", "Head of Human Capital"]
    };
  }

  // 6. Supply Chain, Logistics & Procurement
  if (/supply chain|logistics|procurement|warehouse|freight|inventory|fleet|transport|buyer|sourcing/i.test(combined)) {
    return {
      name: "Supply Chain, Logistics & Procurement",
      employers: [
        { name: "Imperial Logistics", location: "Bedfordview, Johannesburg" },
        { name: "DHL Express South Africa", location: "Isando, Kempton Park" },
        { name: "DSV Global Transport & Logistics", location: "Kempton Park / Hybrid" },
        { name: "Super Group Supply Chain", location: "Sandton, Johannesburg" },
        { name: "Shoprite Supply Chain Division", location: "Brackenfell, Cape Town" },
        { name: "Bidvest Freight & Logistics", location: "Johannesburg / Durban" },
        { name: "Takealot Logistics Network", location: "Johannesburg / Cape Town" },
        { name: "Barloworld Supply Chain", location: "Sandton, Johannesburg" },
      ],
      inDemandSkills: ["End-to-End Supply Chain", "Vendor Contract Negotiation", "Logistics Route Optimization", "Inventory Control & Demand Planning", "SAP MM/WM", "Customs & Freight Compliance", "Strategic Sourcing"],
      certifications: ["CSCP (APICS)", "CIPS Level 4/5 Diploma", "Six Sigma Green Belt", "SCOR Framework Professional"],
      metrics: ["Cut logistics transport spend by R4.2M annually", "Improved on-time delivery fulfillment from 88% to 98.2%", "Reduced warehouse inventory holding costs by 18%"],
      roleExamples: ["Supply Chain Manager", "Procurement Specialist", "Logistics Operations Lead", "Category Buyer", "Warehouse Operations Manager"]
    };
  }

  // 7. Engineering, Manufacturing & Physical Operations
  if (/engineer|mechanic|civil|electric|manufactur|plant|mining|mine\b|maintenance|factory|hse|safety/i.test(combined)) {
    return {
      name: "Engineering, Manufacturing & Physical Operations",
      employers: [
        { name: "Sasol Energy & Chemical", location: "Secunda / Sandton" },
        { name: "Anglo American South Africa", location: "Rosebank, Johannesburg" },
        { name: "BMW South Africa Manufacturing", location: "Rosslyn, Pretoria" },
        { name: "Murray & Roberts", location: "Bedfordview, Johannesburg" },
        { name: "Defy Appliances", location: "Durban / Hybrid" },
        { name: "Gold Fields Corporate", location: "Sandton, Johannesburg" },
        { name: "Mondi Group South Africa", location: "Durban / Remote" },
        { name: "Sappi Southern Africa", location: "Rosebank, Johannesburg" },
      ],
      inDemandSkills: ["Technical Project Execution", "Preventive Maintenance", "Root Cause Analysis", "Occupational Health & Safety (OHS)", "Six Sigma / Lean Operations", "Capex Budget Management", "Asset Reliability"],
      certifications: ["ECSA Pr.Eng / Pr.Tech.Eng", "Government Certificate of Competency (GCC)", "Six Sigma Black Belt", "ISO 9001/14001 Auditor"],
      metrics: ["Elevated plant operating uptime to 98.7%", "Delivered R22M capex project 3 weeks ahead of deadline", "Maintained 0 Lost Time Injuries (LTI) over 24 consecutive months"],
      roleExamples: ["Operations Engineer", "Plant Maintenance Manager", "Project Engineering Lead", "Continuous Improvement Manager", "Technical Operations Director"]
    };
  }

  // 8. Software, Cloud & Information Technology
  if (/software|developer|devops|cloud|aws|azure|kubernetes|python|react|typescript|backend|frontend|data engineering|sysadmin/i.test(combined)) {
    return {
      name: "Software, Cloud & Information Technology",
      employers: [
        { name: "Amazon Web Services (AWS)", location: "Cape Town / Hybrid" },
        { name: "Vodacom Technology", location: "Midrand / Johannesburg" },
        { name: "Standard Bank Group Tech", location: "Rosebank, Johannesburg" },
        { name: "Takealot Group Tech", location: "Cape Town / Remote" },
        { name: "Entelect Software", location: "Melrose Arch, Johannesburg" },
        { name: "BBD Software", location: "Johannesburg / Remote" },
        { name: "Discovery Vitality Tech", location: "Sandton, Johannesburg" },
        { name: "Yoco Africa", location: "Cape Town / Remote" },
      ],
      inDemandSkills: ["Full Stack Architecture", "Cloud Infrastructure (AWS/GCP/Azure)", "CI/CD & Automation", "Database Optimization", "System Reliability (SRE)", "API Design", "Agile Methodologies"],
      certifications: ["AWS Certified Solutions Architect", "Kubernetes CKA", "Terraform Associate", "Azure DevOps Expert"],
      metrics: ["Reduced system deployment rollback rate by 65%", "Scaled microservices to support 500k daily active users", "Optimized cloud compute spend by 28% without latency degradation"],
      roleExamples: ["Senior Full Stack Engineer", "Cloud & DevOps Architect", "Engineering Manager", "Solutions Architect", "Data Platform Engineer"]
    };
  }

  // 9. Customer Experience, Support & Operations
  if (/customer service|customer support|call center|helpdesk|cx\b|client success|customer success|service desk/i.test(combined)) {
    return {
      name: "Customer Experience & Service Operations",
      employers: [
        { name: "Takealot Group CX", location: "Cape Town / Remote" },
        { name: "Discovery Limited CX", location: "Sandton, Johannesburg" },
        { name: "Vodacom Customer Care", location: "Midrand / Johannesburg" },
        { name: "Standard Bank Client Services", location: "Johannesburg / Remote" },
        { name: "MultiChoice Customer Care", location: "Randburg, Johannesburg" },
        { name: "Woolworths Customer Experience", location: "Cape Town / Hybrid" },
        { name: "Yoco Customer Operations", location: "Cape Town / Remote" },
        { name: "Amazon Customer Service SA", location: "Cape Town / Remote" },
      ],
      inDemandSkills: ["Customer Retention", "Omnichannel Ticketing (Zendesk / Salesforce)", "SLA Governance", "Quality Assurance Coaching", "Escalation Management", "NPS / CSAT Optimization", "Team Scheduling"],
      certifications: ["COPC Implementation Leader", "Zendesk Support Administrator", "Salesforce Service Cloud Specialist"],
      metrics: ["Elevated first-contact resolution (FCR) from 74% to 89%", "Increased customer satisfaction (CSAT) to 94.6%", "Reduced customer churn rate by 18% through proactive escalation triage"],
      roleExamples: ["Customer Success Manager", "CX Operations Lead", "Service Desk Team Lead", "Client Experience Director", "Head of Support Operations"]
    };
  }

  // 10. Default General Operations, Administration & Leadership
  return {
    name: "Enterprise Operations & Leadership",
    employers: [
      { name: "Standard Bank Group", location: "Johannesburg, South Africa (Hybrid)" },
      { name: "Discovery Limited", location: "Sandton, Johannesburg (Hybrid)" },
      { name: "Vodacom South Africa", location: "Midrand / Johannesburg" },
      { name: "Woolworths Holdings", location: "Cape Town / Hybrid" },
      { name: "Takealot Group", location: "Cape Town / Remote" },
      { name: "Old Mutual South Africa", location: "Pinelands, Cape Town" },
      { name: "Bidvest Group", location: "Sandton / Hybrid" },
      { name: "MultiChoice Africa", location: "Randburg, Johannesburg" },
    ],
    inDemandSkills: ["Strategic Operations", "Cross-Functional Leadership", "Process Optimization", "Performance Analytics", "Stakeholder Governance", "Budget & Resource Management", "Executive Reporting"],
    certifications: ["Project Management Professional (PMP)", "Agile / Scrum Master", "Lean Operations Certification", "Six Sigma Green Belt"],
    metrics: ["Increased team operational throughput by 34%", "Spearheaded organizational transformation across 30+ team members", "Consistently met or exceeded 98%+ SLA performance benchmarks"],
    roleExamples: ["Operations Manager", "General Manager", "Head of Operations", "Business Operations Lead", "Executive Director"]
  };
}

/**
 * Strips raw PDF stream bytecode, PostScript/PDF dictionary artifacts,
 * nested dictionary delimiters (e.g. << ... >>), compression tags, and
 * stream metadata tokens like <</Filter /FlateDecode/Length 2670>>.
 */
export function stripPdfBytecode(str?: string): string {
  if (!str) return '';
  let s = String(str);

  // 1. Strip PDF streams: stream ... endstream
  s = s.replace(/stream[\s\S]*?endstream/gi, ' ');
  // 2. Strip PDF object declarations and cross-references
  s = s.replace(/\b\d+\s+\d+\s+obj[\s\S]*?endobj/gi, ' ');
  s = s.replace(/\b\d+\s+\d+\s+obj\b/gi, ' ');
  s = s.replace(/\bendobj\b/gi, ' ');

  // 3. Repeatedly strip nested or sequential << ... >> dictionaries
  let prev = '';
  let iterations = 0;
  while (s !== prev && iterations < 8) {
    prev = s;
    iterations++;
    s = s.replace(/<<[\s\S]*?>>/g, ' ');
  }

  // 4. Strip any unclosed or partial PDF dictionary tokens and compression keywords
  s = s
    .replace(/\/Filter\s*\/?[a-zA-Z0-9_-]+/gi, ' ')
    .replace(/\/FlateDecode/gi, ' ')
    .replace(/\/ASCIIHexDecode/gi, ' ')
    .replace(/\/ASCII85Decode/gi, ' ')
    .replace(/\/LZWDecode/gi, ' ')
    .replace(/\/Crypt/gi, ' ')
    .replace(/\/CCITTFaxDecode/gi, ' ')
    .replace(/\/JBIG2Decode/gi, ' ')
    .replace(/\/DCTDecode/gi, ' ')
    .replace(/\/RunLengthDecode/gi, ' ')
    .replace(/\/(Length|Length1|Length2|Length3)\s*\d*/gi, ' ')
    .replace(/\/(Type|Subtype|Width|Height|BitsPerComponent|ColorSpace|MediaBox|Resources|Font|ProcSet)\s*\/?[a-zA-Z0-9_-]*/gi, ' ')
    .replace(/\b(FlateDecode|ASCIIHexDecode|ASCII85Decode|LZWDecode|CCITTFaxDecode|JBIG2Decode|DCTDecode|endstream|endobj|startxref|trailer|xref)\b/gi, ' ')
    .replace(/%PDF-[0-9.]+/gi, ' ')
    // Remove isolated double or single angle brackets often left by broken dictionaries
    .replace(/<<+/g, ' ')
    .replace(/>>+/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return s;
}

/**
 * Strips raw PDF stream bytecode, PostScript tokens, unprintable binary bytes,
 * and dictionary artifacts from text.
 */
export function sanitizeCVInputText(text: string): string {
  if (!text) return '';
  let cleaned = stripPdfBytecode(text);
  return cleaned
    // Remove raw HTML/XML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove non-printable control characters except standard tabs and newlines
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Cleans a job title string, stripping any PDF stream junk, angle brackets,
 * or parenthetical noise, returning a clean professional title.
 */
export function cleanJobTitle(str?: string): string {
  if (!str) return '';
  let cleaned = stripPdfBytecode(str)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[/\-\\|(){}:;,\t\n]/g, ' ')
    .replace(/["'’`]/g, '')
    .replace(/[<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If the title contains no letters or is too short
  if (/^[^a-zA-Z]+$/.test(cleaned) || cleaned.length < 3) {
    return '';
  }

  // Cap to 55 characters
  if (cleaned.length > 55) {
    cleaned = cleaned.substring(0, 55).trim();
  }

  return cleaned;
}

/**
 * Cleans a company name, stripping location suffixes, corporate suffixes,
 * and any unparsed PDF/bracket tokens.
 */
export function cleanCompanyName(str?: string): string {
  if (!str) return 'Enterprise';
  let cleaned = stripPdfBytecode(str)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[<>]/g, ' ')
    .replace(/[/\-\\|(){}:;,\t\n]/g, ' ')
    .replace(/["'’`]/g, '')
    // Strip location if appended, e.g. "Standard Bank Group Johannesburg"
    .replace(/\b(Johannesburg|Cape Town|Durban|Pretoria|South Africa|Gauteng|Western Cape)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove corporate suffixes that restrict job searches excessively
  cleaned = cleaned.replace(/\b(Group|Pty|Ltd|Proprietary|Limited|Incorporated|Inc|Corp|Corporation)\b/gi, '').trim();

  return cleaned || 'Enterprise';
}

/**
 * Cleans a location string for search engines, removing parentheticals like
 * "(Open to Hybrid / Remote)" which break LinkedIn / Indeed geocoders.
 */
export function cleanLocationForSearch(loc?: string): string {
  if (!loc) return 'South Africa';
  let cleaned = loc
    .replace(/<<[^>]*>>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\b(open to|hybrid|remote|onsite|flexible|relocation)\b/gi, ' ')
    .replace(/[/\\|]/g, ' ')
    .replace(/[<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Normalize South African metropolitan regions for job board geocoders (LinkedIn, Indeed, PNet)
  const lower = cleaned.toLowerCase();
  if (
    lower.includes('johannesburg') || 
    lower.includes('sandton') || 
    lower.includes('rosebank') || 
    lower.includes('midrand') || 
    lower.includes('randburg') || 
    lower.includes('bryanston') || 
    lower.includes('braamfontein') ||
    lower.includes('bedfordview') ||
    lower.includes('woodmead') ||
    lower.includes('fourways')
  ) {
    return 'Johannesburg, South Africa';
  }

  if (
    lower.includes('cape town') || 
    lower.includes('stellenbosch') || 
    lower.includes('bellville') || 
    lower.includes('pinelands') || 
    lower.includes('claremont') || 
    lower.includes('century city') ||
    lower.includes('somerset west') ||
    lower.includes('paarl')
  ) {
    return 'Cape Town, South Africa';
  }

  if (
    lower.includes('pretoria') || 
    lower.includes('centurion') || 
    lower.includes('tshwane') || 
    lower.includes('hatfield') || 
    lower.includes('menlyn')
  ) {
    return 'Pretoria, South Africa';
  }

  if (
    lower.includes('durban') || 
    lower.includes('umhlanga') || 
    lower.includes('pinetown') || 
    lower.includes('ballito') ||
    lower.includes('westville')
  ) {
    return 'Durban, South Africa';
  }

  if (lower.includes('gauteng')) return 'Gauteng, South Africa';
  if (lower.includes('western cape')) return 'Western Cape, South Africa';
  if (lower.includes('kwazulu') || lower.includes('kzn')) return 'KwaZulu-Natal, South Africa';
  if (lower.includes('south africa')) return 'South Africa';

  cleaned = cleaned
    .replace(/\s*,\s*/g, ', ')
    .replace(/,(\s*,)*/g, ', ')
    .replace(/^,\s*|,\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || 'South Africa';
}

/**
 * Returns direct official career portal URLs for South African and global blue-chip employers
 */
export function getDirectCompanyCareersUrl(company: string, jobTitle: string, location: string): string {
  const cleanComp = cleanCompanyName(company).toLowerCase();
  const cleanTitle = cleanJobTitle(jobTitle) || 'Specialist';
  const encTitle = encodeURIComponent(cleanTitle);

  if (cleanComp.includes('standard bank')) return `https://jobs.standardbank.com/search/?q=${encTitle}`;
  if (cleanComp.includes('discovery')) return `https://www.discovery.co.za/corporate/careers`;
  if (cleanComp.includes('vodacom')) return `https://jobs.vodafone.com/vodacom/search/?q=${encTitle}`;
  if (cleanComp.includes('woolworths')) return `https://careers.woolworths.co.za/search/?q=${encTitle}`;
  if (cleanComp.includes('takealot')) return `https://takealot.zohorecruit.com/jobs/Careers`;
  if (cleanComp.includes('old mutual')) return `https://oldmutual.wd3.myworkdayjobs.com/Old_Mutual_Careers`;
  if (cleanComp.includes('multichoice')) return `https://www.multichoice.com/careers/`;
  if (cleanComp.includes('capitec')) return `https://careers.capitecbank.co.za/search/?q=${encTitle}`;
  if (cleanComp.includes('nedbank')) return `https://jobs.nedbank.co.za/search/?q=${encTitle}`;
  if (cleanComp.includes('sanlam')) return `https://www.sanlam.co.za/careers`;
  if (cleanComp.includes('bidvest')) return `https://www.bidvest.co.za/careers.php`;
  if (cleanComp.includes('sasol')) return `https://www.sasol.com/careers`;
  if (cleanComp.includes('firstrand') || cleanComp.includes('fnb')) return `https://www.firstrand.co.za/careers/`;
  if (cleanComp.includes('netcare')) return `https://www.netcare.co.za/Careers`;
  if (cleanComp.includes('life healthcare')) return `https://www.lifehealthcare.co.za/careers/`;
  if (cleanComp.includes('mediclinic')) return `https://www.mediclinic.co.za/en/corporate/careers.html`;
  if (cleanComp.includes('dis-chem') || cleanComp.includes('dischem')) return `https://careers.dischem.co.za/`;
  if (cleanComp.includes('clicks')) return `https://careers.clicksgroup.co.za/`;
  if (cleanComp.includes('shoprite')) return `https://www.shopriteholdings.co.za/careers.html`;
  if (cleanComp.includes('pick n pay')) return `https://www.pnp.co.za/careers`;
  if (cleanComp.includes('mtn')) return `https://www.mtn.com/careers/`;
  if (cleanComp.includes('telkom') || cleanComp.includes('bcx')) return `https://www.bcx.co.za/careers/`;
  if (cleanComp.includes('amazon')) return `https://www.amazon.jobs/en/locations/cape-town-south-africa`;
  if (cleanComp.includes('microsoft')) return `https://careers.microsoft.com/us/en/search-results?q=${encTitle}`;
  if (cleanComp.includes('google')) return `https://www.google.com/about/careers/applications/jobs/results/?location=Johannesburg%2C%20South%20Africa`;
  if (cleanComp.includes('showmax')) return `https://www.showmax.com/careers`;
  if (cleanComp.includes('nando')) return `https://www.nandos.co.za/careers`;

  // Fallback to high-intent Google Careers portal query
  const cleanLoc = cleanLocationForSearch(location);
  return `https://www.google.com/search?q=${encodeURIComponent(`${cleanCompanyName(company)} careers ${cleanTitle} ${cleanLoc} apply`)}`;
}

/**
 * Normalizes location specifically for Indeed South Africa (za.indeed.com).
 * Indeed SA fails if ", South Africa" is appended to the location query, and requires
 * exact metro names (e.g. "Johannesburg", "Cape Town", "Durban", "Pretoria").
 */
export function cleanLocationForIndeed(location?: string): string {
  if (!location) return '';
  const lower = location.toLowerCase();
  if (
    lower.includes('johannesburg') || 
    lower.includes('sandton') || 
    lower.includes('rosebank') || 
    lower.includes('midrand') || 
    lower.includes('randburg') || 
    lower.includes('bryanston') || 
    lower.includes('braamfontein') ||
    lower.includes('bedfordview') ||
    lower.includes('fourways') ||
    lower.includes('woodmead')
  ) {
    return 'Johannesburg';
  }
  if (
    lower.includes('cape town') || 
    lower.includes('stellenbosch') || 
    lower.includes('bellville') || 
    lower.includes('pinelands') || 
    lower.includes('claremont') || 
    lower.includes('century city')
  ) {
    return 'Cape Town';
  }
  if (
    lower.includes('pretoria') || 
    lower.includes('centurion') || 
    lower.includes('tshwane') || 
    lower.includes('hatfield') || 
    lower.includes('menlyn')
  ) {
    return 'Pretoria';
  }
  if (
    lower.includes('durban') || 
    lower.includes('umhlanga') || 
    lower.includes('pinetown') || 
    lower.includes('westville')
  ) {
    return 'Durban';
  }
  if (lower.includes('gauteng')) return 'Gauteng';
  if (lower.includes('western cape')) return 'Western Cape';
  if (lower.includes('kwazulu') || lower.includes('kzn')) return 'KwaZulu-Natal';
  return '';
}

/**
 * Generates an authentic, guaranteed-working Indeed South Africa search URL.
 * Uses clean job title and normalized city, avoiding broken hallucinated job keys or over-constrained queries.
 */
export function getIndeedSearchUrl(jobTitle: string, location?: string): string {
  const cleanTitle = cleanJobTitle(jobTitle) || 'Specialist';
  const encTitle = encodeURIComponent(cleanTitle.trim());
  const indeedLoc = cleanLocationForIndeed(location);

  if (indeedLoc) {
    return `https://za.indeed.com/jobs?q=${encTitle}&l=${encodeURIComponent(indeedLoc)}`;
  }
  return `https://za.indeed.com/jobs?q=${encTitle}`;
}

/**
 * Returns diversified application links across PNet, Indeed, Google Jobs,
 * Official Company Career sites, Careers24, and LinkedIn.
 */
export function getDiversePlatformJobLink(index: number, jobTitle: string, company: string, location: string): string {
  const cleanTitle = cleanJobTitle(jobTitle) || 'Specialist';
  const cleanComp = cleanCompanyName(company);
  const cleanLoc = cleanLocationForSearch(location);

  const encTitle = encodeURIComponent(cleanTitle);
  const encTitleWithComp = encodeURIComponent(`${cleanTitle} ${cleanComp}`.trim());
  const encLoc = encodeURIComponent(cleanLoc);

  const platformSlot = index % 8;

  switch (platformSlot) {
    case 0:
      // PNet South Africa (Premier professional recruitment platform)
      return `https://www.pnet.co.za/jobs/search?keywords=${encTitle}&location=${encLoc}`;
    case 1:
      // Indeed South Africa (Guaranteed working localized search)
      return getIndeedSearchUrl(cleanTitle, cleanLoc);
    case 2:
      // Google Jobs (Web-wide direct job aggregator with 1-click apply)
      return `https://www.google.com/search?q=${encodeURIComponent(`${cleanTitle} ${cleanComp} jobs ${cleanLoc}`)}&ibp=htl;jobs`;
    case 3:
      // Official Employer Careers Portal
      return getDirectCompanyCareersUrl(cleanComp, cleanTitle, cleanLoc);
    case 4:
      // Careers24 South Africa
      return `https://www.careers24.com/jobs/results/?Keywords=${encTitle}&Location=${encLoc}`;
    case 5:
      // LinkedIn Jobs (With clean title and normalized metropolitan location)
      return `https://www.linkedin.com/jobs/search/?keywords=${encTitleWithComp}&location=${encLoc}`;
    case 6:
      // Indeed South Africa (Core Title search)
      return getIndeedSearchUrl(cleanTitle, cleanLoc);
    case 7:
    default:
      // PNet South Africa
      return `https://www.pnet.co.za/jobs/search?keywords=${encTitle}&location=${encLoc}`;
  }
}

/**
 * Platform label identifier for diverse job boards and portals.
 */
export function getPlatformLabel(url?: string): string {
  if (!url) return 'Job Portal';
  const lower = url.toLowerCase();
  if (lower.includes('pnet.co.za')) return 'PNet SA';
  if (lower.includes('indeed.com')) return 'Indeed SA';
  if (lower.includes('careers24.com')) return 'Careers24';
  if (lower.includes('google.com') && lower.includes('ibp=htl;jobs')) return 'Google Jobs';
  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('offerzen.com')) return 'OfferZen';
  if (
    lower.includes('standardbank') ||
    lower.includes('discovery.co.za') ||
    lower.includes('vodacom') ||
    lower.includes('vodafone') ||
    lower.includes('woolworths') ||
    lower.includes('takealot') ||
    lower.includes('oldmutual') ||
    lower.includes('multichoice') ||
    lower.includes('capitec') ||
    lower.includes('sasol') ||
    lower.includes('nedbank') ||
    lower.includes('sanlam') ||
    lower.includes('bidvest') ||
    lower.includes('firstrand') ||
    lower.includes('fnb') ||
    lower.includes('netcare') ||
    lower.includes('lifehealthcare') ||
    lower.includes('mediclinic') ||
    lower.includes('dischem') ||
    lower.includes('clicks') ||
    lower.includes('shoprite') ||
    lower.includes('pnp.co.za') ||
    lower.includes('mtn.com') ||
    lower.includes('bcx.co.za') ||
    lower.includes('amazon.jobs') ||
    lower.includes('careers') ||
    lower.includes('myworkdayjobs') ||
    lower.includes('zohorecruit')
  ) {
    return 'Official Employer Portal';
  }
  return 'Company Portal';
}

export interface JobUrlIntegrityResult {
  isValid: boolean;
  isUnavailable: boolean;
  isFallback: boolean;
  status: 'valid' | 'fallback' | 'unavailable';
  statusLabel: 'Direct Link' | 'Verified Search' | 'Company Portal' | 'Unavailable';
  url: string;
  originalUrl: string;
  fallbackReason?: string;
  platform: string;
}

export interface ValidateJobUrlOptions {
  /**
   * When true, broken direct URLs will attempt to fallback to a general company
   * careers portal search. Defaults to true.
   */
  allowCompanyFallback?: boolean;
  /**
   * If provided, index used for secondary platform rotations
   */
  index?: number;
}

/**
 * Validates the integrity of job URLs before they are displayed in the UI.
 * If a URL is detected to be a broken 'no job found' pattern (e.g. hallucinated
 * Indeed viewjob keys, LinkedIn currentJobId errors, expired vacancy paths,
 * or 404 tokens), this automatically flags the link as 'Unavailable' or attempts
 * to fallback to a general company portal search instead of a direct link.
 */
export function validateJobUrlIntegrity(
  rawUrl: string | undefined | null,
  jobTitle: string,
  company: string,
  location?: string,
  options?: ValidateJobUrlOptions
): JobUrlIntegrityResult {
  const allowFallback = options?.allowCompanyFallback ?? true;
  const cleanTitle = cleanJobTitle(jobTitle) || 'Specialist';
  const cleanComp = cleanCompanyName(company);
  const cleanLoc = cleanLocationForSearch(location);
  const original = rawUrl ? String(rawUrl).trim() : '';

  // Helper to construct fallback result or flag as unavailable
  const handleBrokenPattern = (reason: string): JobUrlIntegrityResult => {
    // Check if company is specific and identifiable for a company portal fallback
    const isCompanyMeaningful = cleanComp && 
      !['enterprise', 'confidential', 'unknown', 'company', 'n/a', 'various'].includes(cleanComp.toLowerCase());

    if (allowFallback && isCompanyMeaningful) {
      const companyPortalUrl = getDirectCompanyCareersUrl(cleanComp, cleanTitle, cleanLoc);
      return {
        isValid: true,
        isUnavailable: false,
        isFallback: true,
        status: 'fallback',
        statusLabel: 'Company Portal',
        url: companyPortalUrl,
        originalUrl: original,
        fallbackReason: reason,
        platform: 'Company Portal',
      };
    }

    // Automatically flag as Unavailable
    return {
      isValid: false,
      isUnavailable: true,
      isFallback: false,
      status: 'unavailable',
      statusLabel: 'Unavailable',
      url: '',
      originalUrl: original,
      fallbackReason: reason,
      platform: 'Unavailable',
    };
  };

  // 1. Missing or empty URL
  if (!original) {
    return handleBrokenPattern('Missing or empty application link');
  }

  const lower = original.toLowerCase();

  // 2. Local, scripting, or placeholder links
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('mailto:') ||
    lower === '#' ||
    lower === 'about:blank' ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'n/a'
  ) {
    return handleBrokenPattern('Invalid protocol or placeholder link target');
  }

  // 3. Raw PDF bytecode, unparsed angle brackets, or stream filter artifacts
  if (
    original.includes('<<') ||
    original.includes('>>') ||
    original.includes('%3C%3C') ||
    original.includes('FlateDecode') ||
    original.includes('/Length') ||
    original.includes('%2F%2FFilter') ||
    original.includes('stream') ||
    lower.includes('[object object]')
  ) {
    return handleBrokenPattern('Corrupted PDF bytecode or template tokens detected');
  }

  // 4. Must begin with http:// or https:// and parse into valid URL
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    return handleBrokenPattern('Missing or invalid HTTP/HTTPS protocol');
  }

  let parsed: URL;
  try {
    parsed = new URL(original);
  } catch {
    return handleBrokenPattern('Malformed URL structure');
  }

  const host = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();

  // 5. Placeholder or test domains
  if (
    host.includes('example.com') ||
    host.includes('placeholder.com') ||
    host.includes('test.com') ||
    host.includes('localhost')
  ) {
    return handleBrokenPattern('Placeholder or mock domain detected');
  }

  // 6. Explicit 404, expired, or closed vacancy indicators
  if (
    pathname.includes('/404') ||
    pathname.includes('/not-found') ||
    pathname.includes('/job-not-found') ||
    pathname.includes('/no-job-found') ||
    pathname.includes('/expired') ||
    pathname.includes('/job-closed') ||
    pathname.includes('/vacancy-closed') ||
    search.includes('jobnotfound=true') ||
    search.includes('noresults=true') ||
    search.includes('error=404') ||
    search.includes('status=closed') ||
    search.includes('status=expired')
  ) {
    return handleBrokenPattern('Link detected with expired or job-not-found status');
  }

  // 7. Indeed South Africa "Job Not Found" / Broken Deep-Link Patterns
  if (host.includes('indeed.com')) {
    // Hallucinated individual job keys or viewjob/clk links cause "Job not found"
    if (
      pathname.includes('/viewjob') ||
      pathname.includes('/rc/clk') ||
      parsed.searchParams.has('jk') ||
      parsed.searchParams.has('vjk') ||
      !pathname.includes('/jobs')
    ) {
      return handleBrokenPattern('Indeed direct viewjob key detected (causes "Job not found" error)');
    }

    // Search query that is empty or corrupted
    const qParam = parsed.searchParams.get('q');
    if (!qParam || qParam.trim() === '' || qParam.includes('undefined')) {
      return handleBrokenPattern('Indeed search with empty or corrupted query');
    }

    // Corrupted location query that causes 0 results on za.indeed.com
    const lParam = parsed.searchParams.get('l');
    if (lParam && lParam.includes('South Africa')) {
      // Correct it to clean city or handle broken pattern
      const cleanedLoc = cleanLocationForIndeed(lParam);
      if (cleanedLoc) {
        parsed.searchParams.set('l', cleanedLoc);
      } else {
        parsed.searchParams.delete('l');
      }
    }
  }

  // 8. LinkedIn "No Matching Jobs Found" / Hallucinated Parameter Patterns
  if (host.includes('linkedin.com')) {
    // currentJobId forces LinkedIn to look for that specific ID; if nonexistent, returns 0 jobs
    if (parsed.searchParams.has('currentJobId')) {
      return handleBrokenPattern('LinkedIn currentJobId parameter detected (causes "No matching jobs found")');
    }

    // Hallucinated /jobs/view/ links
    if (pathname.includes('/jobs/view/')) {
      const jobId = pathname.replace(/\/jobs\/view\/?/, '').replace(/\/.*$/, '');
      if (!jobId || !/^\d{7,15}$/.test(jobId)) {
        return handleBrokenPattern('LinkedIn invalid or unverified job view ID');
      }
    }

    const kw = parsed.searchParams.get('keywords') || '';
    if (kw.includes('Filter') || kw.includes('<<') || kw.includes('(Open to') || kw.includes('undefined')) {
      return handleBrokenPattern('LinkedIn keywords corrupted with filter artifacts');
    }
  }

  // 9. PNet & Careers24 broken IDs
  if (host.includes('pnet.co.za') || host.includes('careers24.com')) {
    if (pathname.includes('/undefined') || pathname.includes('/null')) {
      return handleBrokenPattern('Job portal link with undefined identifier');
    }
  }

  // Valid and verified URL
  const verifiedUrl = parsed.toString();
  const platform = getPlatformLabel(verifiedUrl);

  return {
    isValid: true,
    isUnavailable: false,
    isFallback: false,
    status: 'valid',
    statusLabel: platform.includes('Portal') ? 'Company Portal' : 'Direct Link',
    url: verifiedUrl,
    originalUrl: original,
    platform,
  };
}

/**
 * Sanitizes an entire candidate profile, ensuring no PDF bytecode or garbage
 * tokens exist in any field.
 */
export function sanitizeCandidateProfile(profile: Partial<CandidateProfile>): CandidateProfile {
  if (!profile) profile = {};

  const cleanText = (val?: string, maxLen = 100) => {
    if (!val) return '';
    const cleaned = stripPdfBytecode(val);
    return cleaned.substring(0, maxLen).trim();
  };

  const name = cleanText(profile.name, 40) || 'Candidate';
  const location = cleanLocationForSearch(cleanText(profile.location, 80)) || 'Johannesburg, South Africa';
  const targetSalary = cleanText(profile.targetSalary, 60) || 'Market Rate (ZAR)';
  const experienceSummary = stripPdfBytecode(profile.experienceSummary).substring(0, 800).trim();

  const cleanRoles: string[] = [];
  const rawRoles = Array.isArray(profile.targetRoles) ? profile.targetRoles : [];
  for (const r of rawRoles) {
    const cleaned = cleanJobTitle(r);
    if (cleaned && cleaned.length >= 3 && !cleanRoles.includes(cleaned)) {
      cleanRoles.push(cleaned);
    }
  }

  const cleanSkills: string[] = [];
  const rawSkills = Array.isArray(profile.keySkills) ? profile.keySkills : [];
  for (const s of rawSkills) {
    const cleaned = cleanJobTitle(s);
    if (cleaned && cleaned.length >= 2 && !cleanSkills.includes(cleaned)) {
      cleanSkills.push(cleaned);
    }
  }

  const cleanCompanies: string[] = [];
  const rawCompanies = Array.isArray(profile.companiesWorkedAt) ? profile.companiesWorkedAt : [];
  for (const c of rawCompanies) {
    const cleaned = cleanCompanyName(c);
    if (cleaned && cleaned.length >= 2 && !cleanCompanies.includes(cleaned)) {
      cleanCompanies.push(cleaned);
    }
  }

  const tempProfile = { targetRoles: cleanRoles, keySkills: cleanSkills, experienceSummary };
  const ind = resolveCandidateIndustry(tempProfile);

  return {
    name,
    location,
    targetSalary,
    targetRoles: cleanRoles.length > 0 ? cleanRoles : ind.roleExamples.slice(0, 3),
    experienceSummary: experienceSummary || `Accomplished specialist in ${ind.name} with demonstrated leadership and operational excellence.`,
    companiesWorkedAt: cleanCompanies.length > 0 ? cleanCompanies : [ind.employers[0].name, ind.employers[1].name],
    keySkills: cleanSkills.length > 0 ? cleanSkills : ind.inDemandSkills.slice(0, 7),
  };
}

export function extractCandidateProfileFromText(cvText: string): CandidateProfile {
  const sanitizedText = stripPdfBytecode(sanitizeCVInputText(cvText));
  const lines = sanitizedText.split("\n").map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "Candidate";
  const name = firstLine.length < 40 && !firstLine.includes("<") && !firstLine.includes("/") ? firstLine.replace(/^#+\s*/, "") : "Candidate";

  // Location detection
  let location = "Johannesburg, South Africa (Open to Remote)";
  const locLine = lines.find(l => /^location:/i.test(l) || /^address:/i.test(l) || /^city:/i.test(l));
  if (locLine) {
    const parsedLoc = cleanLocationForSearch(locLine.replace(/^[^:]+:\s*/i, "").trim());
    if (parsedLoc.length > 2 && !parsedLoc.includes("<") && !parsedLoc.includes("/")) location = parsedLoc;
  }

  // Salary detection
  let targetSalary = "R45,000 - R65,000 per month";
  const salLine = lines.find(l => /salary/i.test(l) || /compensation/i.test(l) || /remuneration/i.test(l));
  if (salLine) {
    const parsedSal = stripPdfBytecode(salLine.replace(/^[^:]+:\s*/i, "").trim());
    if (parsedSal.length > 3 && !parsedSal.includes("<")) targetSalary = parsedSal;
  }

  // Role detection
  let targetRoles: string[] = [];
  const roleLine = lines.find(l => /target roles?:/i.test(l) || /desired roles?:/i.test(l) || /roles?:/i.test(l) || /title:/i.test(l) || /position:/i.test(l));
  if (roleLine) {
    targetRoles = roleLine.replace(/^[^:]+:\s*/i, "").split(/[,|;/]/).map(r => cleanJobTitle(r)).filter(Boolean);
  }
  if (targetRoles.length === 0) {
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const line = lines[i];
      if (
        line.length > 5 && 
        line.length < 55 && 
        !line.includes("@") && 
        !line.includes("http") && 
        !/^\d+/.test(line) && 
        !line.includes(":") &&
        !line.includes("<") &&
        !line.includes(">") &&
        !line.includes("/") &&
        !line.includes("%")
      ) {
        const cleanedRole = cleanJobTitle(line);
        if (cleanedRole) {
          targetRoles = [cleanedRole];
          break;
        }
      }
    }
  }

  // Skills detection
  let keySkills: string[] = [];
  const skillsLine = lines.find(l => /skills?:/i.test(l) || /competencies?:/i.test(l) || /expertise:/i.test(l));
  if (skillsLine) {
    keySkills = skillsLine.replace(/^[^:]+:\s*/i, "").split(/[,|;]/).map(s => cleanJobTitle(s)).filter(Boolean);
  }

  // Summary detection
  const summaryLine = lines.find(l => /summary/i.test(l) || /profile/i.test(l) || /about/i.test(l));
  const expSummary = stripPdfBytecode(summaryLine ? sanitizedText.substring(sanitizedText.indexOf(summaryLine), sanitizedText.indexOf(summaryLine) + 350) + "..." : sanitizedText.substring(0, 350) + "...");

  return sanitizeCandidateProfile({
    name,
    location,
    targetSalary,
    targetRoles,
    experienceSummary: expSummary,
    keySkills,
  });
}

export function getPlatformSearchUrl(jobTitle: string, company: string, location: string, index: number = 0): string {
  return getDiversePlatformJobLink(index, jobTitle, company, location);
}

export function generateFallbackDailyReport(profileInput: CandidateProfile): DailyReport {
  const profile = sanitizeCandidateProfile(profileInput);
  const ind = resolveCandidateIndustry(profile);

  const rawRole1 = profile.targetRoles?.[0] || ind.roleExamples[0] || "Operations Leader";
  const rawRole2 = profile.targetRoles?.[1] || ind.roleExamples[1] || "Senior Specialist";
  const rawRole3 = profile.targetRoles?.[2] || ind.roleExamples[2] || "Department Lead";

  const role1 = cleanJobTitle(rawRole1) || ind.roleExamples[0];
  const role2 = cleanJobTitle(rawRole2) || ind.roleExamples[1];
  const role3 = cleanJobTitle(rawRole3) || ind.roleExamples[2];

  const loc = profile.location || "Johannesburg, South Africa";
  const sal = profile.targetSalary || "R45,000 - R65,000 / month";

  const emp0 = ind.employers[0];
  const emp1 = ind.employers[1];
  const emp2 = ind.employers[2];
  const emp3 = ind.employers[3];
  const emp4 = ind.employers[4];
  const emp5 = ind.employers[5];
  const emp6 = ind.employers[6];
  const emp7 = ind.employers[7];

  const skill1 = profile.keySkills?.[0] || ind.inDemandSkills[0];
  const skill2 = profile.keySkills?.[1] || ind.inDemandSkills[1];
  const cert1 = ind.certifications[0];

  const title1 = role1.toLowerCase().startsWith('senior') ? role1 : `Senior ${role1}`;
  const title2 = role2;
  const title3 = role3 || `${role1} Lead`;
  const title4 = role1;
  const title5 = role2;
  const title6 = `Lead ${role1}`;
  const title7 = `Senior ${role2}`;
  const title8 = role3 || role2;

  const topMatches: JobMatch[] = [
    {
      id: `top-${Date.now()}-1`,
      jobTitle: title1,
      company: emp0.name,
      location: loc,
      salary: sal,
      matchScore: 95,
      probabilityOfSuccess: "HIGH",
      whyMatches: [
        `Direct alignment with ${skill1} and core responsibilities for ${role1}`,
        `Demonstrated background matching ${emp0.name}'s current market expansion and team requirements`,
        `Solid track record in stakeholder communication and operational execution`,
      ],
      keyGaps: [
        `Familiarity with ${emp0.name}'s proprietary internal systems (rapid 1-week onboarding)`,
      ],
      applicationLink: getDiversePlatformJobLink(0, title1, emp0.name, loc),
    },
    {
      id: `top-${Date.now()}-2`,
      jobTitle: title2,
      company: emp1.name,
      location: emp1.location,
      salary: sal,
      matchScore: 92,
      probabilityOfSuccess: "HIGH",
      whyMatches: [
        `Proven capability in ${skill2} and cross-functional project delivery`,
        `Experience driving organizational performance metrics across demanding environments`,
      ],
      keyGaps: [
        `${cert1} or related credential advantageous for accelerated promotion`,
      ],
      applicationLink: getDiversePlatformJobLink(1, title2, emp1.name, emp1.location || loc),
    },
    {
      id: `top-${Date.now()}-3`,
      jobTitle: title3,
      company: emp2.name,
      location: emp2.location,
      salary: sal,
      matchScore: 89,
      probabilityOfSuccess: "HIGH",
      whyMatches: [
        `Extensive practical experience in ${ind.name} leadership`,
        `Track record of sustaining high quality standards and meeting key KPI targets`,
      ],
      keyGaps: [
        `Advanced enterprise workflow reporting experience`,
      ],
      applicationLink: getDiversePlatformJobLink(2, title3, emp2.name, emp2.location || loc),
    },
    {
      id: `top-${Date.now()}-4`,
      jobTitle: title4,
      company: emp3.name,
      location: emp3.location,
      salary: sal,
      matchScore: 87,
      probabilityOfSuccess: "HIGH",
      whyMatches: [
        `Direct match for ${role1} requiring both strategic oversight and hands-on execution`,
        `Demonstrated ability to mentor peers and optimize department workflows`,
      ],
      keyGaps: [
        `Exposure to multi-national matrix governance structures`,
      ],
      applicationLink: getDiversePlatformJobLink(3, title4, emp3.name, emp3.location || loc),
    },
    {
      id: `top-${Date.now()}-5`,
      jobTitle: title5,
      company: emp4.name,
      location: emp4.location,
      salary: sal,
      matchScore: 85,
      probabilityOfSuccess: "HIGH",
      whyMatches: [
        `Deep understanding of industry compliance and high-impact operational delivery`,
        `Excellent reputation for cross-departmental collaboration and accountability`,
      ],
      keyGaps: [
        `Specific regional market licensing or compliance overview`,
      ],
      applicationLink: getDiversePlatformJobLink(4, title5, emp4.name, emp4.location || loc),
    },
  ];

  const secondaryMatches: JobMatch[] = [
    {
      id: `sec-${Date.now()}-6`,
      jobTitle: title6,
      company: emp5.name,
      location: emp5.location,
      salary: sal,
      matchScore: 79,
      probabilityOfSuccess: "MEDIUM",
      whyMatches: [
        `High operational alignment with ${skill1} and performance governance`,
        `Strong client/stakeholder relationship management track record`,
      ],
      keyGaps: [
        `Previous exposure to fast-scaling regional distribution workflows`,
      ],
      applicationLink: getDiversePlatformJobLink(5, title6, emp5.name, emp5.location || loc),
    },
    {
      id: `sec-${Date.now()}-7`,
      jobTitle: title7,
      company: emp6.name,
      location: emp6.location,
      salary: sal,
      matchScore: 78,
      probabilityOfSuccess: "MEDIUM",
      whyMatches: [
        `Comprehensive industry experience matching ${ind.name} operational benchmarks`,
      ],
      keyGaps: [
        `Enterprise automated analytics platform onboarding`,
      ],
      applicationLink: getDiversePlatformJobLink(6, title7, emp6.name, emp6.location || loc),
    },
    {
      id: `sec-${Date.now()}-8`,
      jobTitle: title8,
      company: emp7.name,
      location: emp7.location,
      salary: sal,
      matchScore: 76,
      probabilityOfSuccess: "MEDIUM",
      whyMatches: [
        `Strong team coaching, workflow governance, and strategic execution skills`,
      ],
      keyGaps: [
        `Specific legacy ERP platform transition knowledge`,
      ],
      applicationLink: getDiversePlatformJobLink(7, title8, emp7.name, emp7.location || loc),
    },
  ];

  return {
    summary: {
      totalJobsFound: 8,
      highMatches: 5,
      mediumMatches: 3,
    },
    topMatches,
    secondaryMatches,
    recommendedActions: {
      immediateApplications: [
        `Submit application for Senior ${role1} at ${emp0.name} using your tailored ATS executive summary.`,
        `Apply directly to ${emp1.name} highlighting your quantifiable achievements in ${skill1}.`,
        `Connect with talent recruitment partners at ${emp2.name} via LinkedIn with your portfolio highlights.`,
      ],
      cvTweaks: [
        `Lead your executive summary with your target role '${role1}' and top competencies (${ind.inDemandSkills.slice(0, 3).join(", ")}).`,
        `Add quantifiable metrics to previous roles (e.g. '${ind.metrics[0]}').`,
      ],
    },
  };
}

export function generateFallbackATS(profile: CandidateProfile): ATSAnalysis {
  const ind = resolveCandidateIndustry(profile);
  const primaryRole = profile.targetRoles?.[0] || ind.roleExamples[0] || "Operations Leader";

  const matchedKeywords = profile.keySkills?.length
    ? profile.keySkills.slice(0, 8)
    : ind.inDemandSkills.slice(0, 8);

  const missingKeywords = ind.inDemandSkills
    .filter(skill => !matchedKeywords.some(m => m.toLowerCase().includes(skill.toLowerCase())))
    .slice(0, 5);

  if (missingKeywords.length < 3 && ind.certifications.length > 0) {
    missingKeywords.push(...ind.certifications.slice(0, 3));
  }

  return {
    overallAtsScore: 89,
    keywordMatchRate: 86,
    formattingScore: 93,
    impactScore: 88,
    matchedKeywords,
    missingKeywords,
    formattingSuggestions: [
      "Format previous employment bullet points with active verbs and measurable outcomes (%, Currency, Time saved).",
      "Include a dedicated 'Core Competencies' section right below your executive summary for automated ATS parser scanning.",
      "Ensure all employment dates use standard Month/Year format (e.g. 'Jan 2021 – Present') for seamless ATS date interpretation.",
    ],
    executivePitch: `${profile.name} is a results-driven professional in ${ind.name} with proven expertise in ${matchedKeywords.slice(0, 3).join(", ")}. Known for driving operational excellence, stakeholder alignment, and measurable business growth.`,
    optimizedSummaries: [
      {
        style: "Executive & Strategic Leadership",
        summaryText: `Accomplished ${primaryRole} with over 8 years driving strategic growth, process efficiency, and team performance across ${ind.name}. Expert at translating complex organizational goals into high-performing operations.`,
      },
      {
        style: "Metric & Performance-Driven",
        summaryText: `High-impact ${primaryRole} with a proven track record of ${ind.metrics[0]?.toLowerCase() || "optimizing operational efficiency by 30%+"}. Skilled in ${matchedKeywords.slice(0, 4).join(", ")}, with strong focus on continuous improvement.`,
      },
      {
        style: "Comprehensive Operational Mastery",
        summaryText: `Dedicated ${primaryRole} specializing in ${ind.name} operations, cross-functional collaboration, and KPI governance. Committed to sustaining the highest standards of professional execution and team mentorship.`,
      },
    ],
    recommendedBulletPoints: [
      {
        originalConcept: "Managed daily operational duties and team workflows.",
        enhancedBullet: `Spearheaded daily operations and workflow management for cross-functional teams, ${ind.metrics[0]?.toLowerCase() || "increasing overall operational throughput by 32%"}.`,
        targetRole: primaryRole,
        addedKeywords: [matchedKeywords[0] || "Operations", "Cross-Functional Leadership", "Process Optimization"],
      },
      {
        originalConcept: "Handled key stakeholder and client communications.",
        enhancedBullet: `Chaired key stakeholder alignment forums and strategic reviews, ${ind.metrics[1]?.toLowerCase() || "securing 98% stakeholder satisfaction and SLA compliance"}.`,
        targetRole: primaryRole,
        addedKeywords: ["Stakeholder Relations", "Executive Communication", "Governance"],
      },
      {
        originalConcept: "Worked on updating internal processes.",
        enhancedBullet: `Formulated and deployed standardized operational playbooks, accelerating team onboarding and reducing operational turnaround times by 40%.`,
        targetRole: primaryRole,
        addedKeywords: ["Operational Playbooks", "Standard Operating Procedures", "Continuous Improvement"],
      },
    ],
    suggestedSkillsToAdd: [
      ...ind.inDemandSkills.slice(0, 4),
      ...ind.certifications.slice(0, 2),
    ],
  };
}

export function generateFallbackCoverLetter(
  profile: CandidateProfile,
  targetJobTitle?: string,
  company?: string
): CoverLetter {
  const ind = resolveCandidateIndustry(profile);
  const role = targetJobTitle || profile.targetRoles?.[0] || ind.roleExamples[0] || "Operations Leader";
  const comp = company || ind.employers[0]?.name || "Enterprise Organization";
  const skill1 = profile.keySkills?.[0] || ind.inDemandSkills[0] || "Strategic Planning";
  const skill2 = profile.keySkills?.[1] || ind.inDemandSkills[1] || "Process Optimization";

  return {
    jobTitle: role,
    company: comp,
    letterText: `Dear Hiring Team at ${comp},\n\nI am writing to express my strong enthusiasm for the ${role} position at ${comp}. With extensive hands-on experience in ${ind.name}, proven leadership in ${skill1}, and a track record of driving operational excellence across demanding environments, I am confident in my ability to deliver immediate value to your organization.\n\nThroughout my career at organizations including ${profile.companiesWorkedAt?.join(", ") || "leading enterprise institutions"}, I have spearheaded strategic initiatives, enhanced team performance, and consistently exceeded key performance indicators. My background in ${skill2}, stakeholder collaboration, and rigorous execution enables me to streamline workflows, eliminate bottlenecks, and ensure outstanding results.\n\nI greatly admire ${comp}'s ongoing market impact and strategic vision, and I would welcome the opportunity to discuss how my experience, leadership, and proactive problem-solving can support your strategic growth goals.\n\nSincerely,\n${profile.name}`,
    keyHighlightsUsed: [
      `Demonstrated leadership in ${ind.name}`,
      `Expertise in ${skill1} and ${skill2}`,
      `Proven track record with ${profile.companiesWorkedAt?.[0] || "leading organizations"}`,
    ],
  };
}

export function generateFallbackInterviewPrep(
  profile: CandidateProfile,
  targetRole?: string
): InterviewPrep {
  const ind = resolveCandidateIndustry(profile);
  const roleToPrep = targetRole || profile.targetRoles?.[0] || ind.roleExamples[0] || "Operations Leader";
  const skill = profile.keySkills?.[0] || ind.inDemandSkills[0] || "Strategic Execution";

  return {
    targetRole: roleToPrep,
    questions: [
      {
        question: `How do you prioritize competing deadlines and manage urgent operational demands while keeping executive stakeholders informed?`,
        category: "Scenario",
        modelAnswerStar: `Situation: During a critical corporate quarter-end review with multiple overlapping deliverables.\nTask: I was accountable for maintaining operational throughput while coordinating cross-functional team priorities and meeting stringent deadlines.\nAction: I implemented a structured triage system, established daily 15-minute alignment briefings, and provided transparent executive status dashboards highlighting progress against milestones.\nResult: Delivered 100% of required milestones on schedule with zero compliance breaches, receiving commendation from department leadership.`,
        keyTip: `Focus on composure, structured prioritization methodology, and stakeholder transparency rather than micro-tactics.`,
      },
      {
        question: `Can you describe a time when you inherited an underperforming team or workflow and turned performance around?`,
        category: "Leadership",
        modelAnswerStar: `Situation: Inherited a department workflow facing falling satisfaction metrics and high turnaround times.\nTask: Restore operational efficiency above target benchmarks and rebuild team morale within 90 days.\nAction: Conducted 1-on-1 discovery sessions, identified operational bottlenecks in handoffs, introduced weekly recognition benchmarks, and standardized core operating procedures.\nResult: Boosted performance metrics to 98.4% within two months and reduced unplanned turnover to zero.`,
        keyTip: `Highlight active listening, root-cause process fixes, and metric-based coaching.`,
      },
      {
        question: `How do you approach modernizing processes when legacy habits conflict with new organizational standards?`,
        category: "Technical",
        modelAnswerStar: `Situation: The organization needed to upgrade legacy manual processes to modern digital workflows, which met initial hesitation from team members.\nTask: Drive seamless adoption without disrupting daily operational commitments.\nAction: Spearheaded phased rollouts, conducted hands-on training bootcamps, and demonstrated measurable time-savings to key influencers within the team.\nResult: Achieved 100% team adoption within 6 weeks, cutting processing cycle times by 45%.`,
        keyTip: `Demonstrate change management empathy, continuous training, and quantifiable proof of value.`,
      },
      {
        question: `How do you manage relationships and performance expectations with key external partners and vendors?`,
        category: "Behavioral",
        modelAnswerStar: `Situation: A critical external service partner repeatedly missed delivery commitments, threatening project timelines.\nTask: Enforce contractual agreements and restore service reliability.\nAction: Compiled comprehensive performance audit reports, convened executive partner reviews, and established clear bi-weekly operational review checkpoints.\nResult: The partner assigned dedicated senior support resources and eliminated repeat violations within 3 weeks.`,
        keyTip: `Emphasize data-driven firmness backed by clear standards paired with collaborative problem-solving.`,
      },
      {
        question: `What is your strategic vision for the evolution of ${roleToPrep} over the next 3 to 5 years?`,
        category: "Leadership",
        modelAnswerStar: `Situation: Rapid digital modernization and data-driven automation are reshaping ${ind.name}.\nTask: Position our team to leverage intelligent automation while elevating human strategic decision-making.\nAction: Champion data analytics adoption, automate repetitive manual handoffs, and upskill team members toward high-value consultative problem-solving.\nResult: Shifts team focus from routine administrative maintenance to proactive strategic value creation for the entire organization.`,
        keyTip: `Show strategic foresight, adaptability, and enthusiasm for continuous learning and technological leverage.`,
      },
    ],
  };
}

export function generateFallbackCVDraft(
  profile: CandidateProfile,
  targetRole?: string
): FullCVDraft {
  const ind = resolveCandidateIndustry(profile);
  const roleToDraft = targetRole || profile.targetRoles?.[0] || ind.roleExamples[0] || "Operations Leader";
  const comp1 = profile.companiesWorkedAt?.[0] || ind.employers[0].name;
  const comp2 = profile.companiesWorkedAt?.[1] || ind.employers[1].name;
  const skill1 = profile.keySkills?.[0] || ind.inDemandSkills[0];
  const skill2 = profile.keySkills?.[1] || ind.inDemandSkills[1];

  return {
    fullName: profile.name || "Candidate",
    headline: `Senior ${roleToDraft} | ${ind.name} Specialist`,
    executiveSummary: `Accomplished ${roleToDraft} with extensive experience driving strategic execution, process efficiency, and team performance across ${ind.name}. Proven track record in ${skill1}, stakeholder governance, and consistently exceeding key organizational deliverables across South African and global operating environments.`,
    coreCompetencies: [
      ...ind.inDemandSkills.slice(0, 6),
      "Cross-Functional Team Leadership",
      "Executive Stakeholder Governance",
    ],
    impactBullets: [
      `Spearheaded operational excellence initiatives across cross-functional departments, ${ind.metrics[0]?.toLowerCase() || "optimizing throughput by 32%"}.`,
      `Managed high-priority deliverables and stakeholder commitments, achieving 99%+ SLA and quality compliance.`,
      `Governed annual departmental budgets and vendor relationships, optimizing resource allocation by 18%.`,
      `Led and mentored teams of specialists, designing standardized operating playbooks that elevated productivity by 40%.`,
      `Delivered major business modernization milestones on schedule with zero regulatory or compliance infractions.`,
      `Introduced data-driven performance analytics and dashboards to guide proactive executive decision-making.`,
    ],
    suggestedCertifications: [
      ...ind.certifications,
      "Project Management Professional (PMP)",
      "Agile & Scrum Master",
    ],
    fullMarkdownCV: `# ${profile.name || "Candidate"}
**${roleToDraft}** | ${profile.location || "Johannesburg, South Africa"}

---

### Executive Summary
Accomplished ${roleToDraft} with extensive experience driving strategic execution, process efficiency, and team performance across ${ind.name}. Proven track record in ${skill1}, stakeholder governance, and consistently exceeding key organizational deliverables across South African and global operating environments.

---

### Core Competencies
* **Domain Expertise:** ${ind.inDemandSkills.slice(0, 4).join(", ")}
* **Execution & Quality:** Process Optimization, SLA Governance, Continuous Improvement
* **Leadership & Strategy:** Team Coaching, Stakeholder Relations, Resource Allocation

---

### Professional Experience

#### Senior ${roleToDraft} | ${comp1}
*${profile.location || "South Africa"} | 2021 – Present*
* Spearheaded core departmental operations and workflow governance across ${ind.name}.
* Delivered key organizational initiatives, ${ind.metrics[0]?.toLowerCase() || "increasing performance metrics by 34%"}.
* Managed team performance and stakeholder reviews, ensuring 100% adherence to compliance standards.
* Formulated and institutionalized standardized operational playbooks, shortening onboarding times by 40%.

#### Department Specialist | ${comp2}
*${profile.location || "South Africa"} | 2018 – 2021*
* Supervised day-to-day project deliverables and operational escalations.
* Implemented proactive analytics dashboards to track key performance indicators.
* Mentored colleagues and coordinated cross-functional priorities.

---

### Key Skills & Tooling
${(profile.keySkills || ind.inDemandSkills).slice(0, 8).map((s: string) => `* ${s}`).join("\n")}
`,
  };
}
