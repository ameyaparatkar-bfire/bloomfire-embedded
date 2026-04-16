/**
 * Bloomfire Search Web Component — POC
 * Supports: Search (semantic) + Synapse (conversational) modes
 */

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BF = {
  teal:        '#3ba8c4',
  tealLight:   '#eaf6fa',
  tealMid:     '#c5e8f2',
  navy:        '#0d1b35',
  orange:      '#e8671e',
  orangeHover: '#cf5a18',
  white:       '#ffffff',
  bgPage:      '#f5f7f9',
  border:      '#e0e6ea',
  borderLight: '#edf1f4',
  textPrimary: '#1a2b3c',
  textSecond:  '#5a6e7f',
  textMeta:    '#8fa3b1',
};

// ─── Mock search results ───────────────────────────────────────────────────────
const SEARCH_RESULTS = {
  'how do I process a homeowner claim': [
    { title: 'Homeowner Claims Processing Guide', type: 'Series', snippet: 'Step-by-step guide covering intake, initial assessment, adjuster assignment, documentation requirements, and state-mandated resolution timelines.', author: 'Claims Team', date: 'Jan 15, 2026', id: 'hc-001' },
    { title: 'Adjuster Assignment SOP', type: 'Post', snippet: 'SOP for assigning adjusters based on claim value. Claims above $5,000 require a licensed field adjuster within 24 hours of the initial report.', author: 'Operations', date: 'Feb 3, 2026', id: 'aa-002' },
    { title: 'Required Documentation Checklist', type: 'Post', snippet: 'Complete list of required forms and evidence for homeowner claims, including HO-3, supplemental damage reports, contractor estimates, and photo documentation.', author: 'Compliance', date: 'Dec 10, 2025', id: 'rd-003' },
    { title: 'State Mandated Resolution Timelines', type: 'Post', snippet: 'Ohio: 21 days, Michigan: 60 days, Pennsylvania: 30 days. Non-compliance may result in regulatory penalties.', author: 'Legal', date: 'Nov 22, 2025', id: 'st-004' },
  ],
  'what are the michigan auto insurance requirements': [
    { title: 'State Requirements — Michigan Auto', type: 'Series', snippet: 'Michigan requires PIP, PPI of at least $1M, and Residual Liability Insurance. Since 2020 reform, drivers may elect their PIP level from unlimited down to opt-out.', author: 'Compliance', date: 'Mar 1, 2026', id: 'mi-001' },
    { title: 'Michigan No-Fault Reform Summary', type: 'Post', snippet: 'Overview of the 2020 Michigan No-Fault reform: new PIP election options, mini-tort updates, and the impact on bodily injury liability minimums ($250K/$500K).', author: 'Legal', date: 'Feb 14, 2026', id: 'mi-002' },
    { title: 'Minimum Liability Standards by State', type: 'Post', snippet: 'State-by-state breakdown of minimum auto liability requirements. Includes recent legislative changes for MI, OH, PA, and FL.', author: 'Underwriting', date: 'Jan 30, 2026', id: 'ml-003' },
  ],
  'adjuster assignment guidelines': [
    { title: 'Adjuster Assignment SOP', type: 'Post', snippet: 'SOP for assigning adjusters based on claim value. Claims above $5,000 require a licensed field adjuster within 24 hours of the initial report.', author: 'Operations', date: 'Feb 3, 2026', id: 'aa-002' },
    { title: 'Field vs. Desk Adjuster Decision Tree', type: 'Post', snippet: 'Decision framework for routing claims to field or desk adjusters. Factors include claim type, estimated value, customer tier, and geographic availability.', author: 'Claims Team', date: 'Jan 8, 2026', id: 'adj-005' },
    { title: 'Adjuster Certification Requirements', type: 'Series', snippet: 'State-by-state certification and licensing requirements for field adjusters. Includes renewal timelines, CE credits, and reciprocity agreements.', author: 'HR & Compliance', date: 'Dec 5, 2025', id: 'adj-006' },
  ],
  default: [
    { title: 'Claims Handling — Quick Reference Guide', type: 'Post', snippet: 'Concise reference covering the most common claim scenarios, escalation paths, required documentation, and SLA timelines across all claim types.', author: 'Claims Team', date: 'Feb 20, 2026', id: 'gen-001' },
    { title: 'Policy Administration Guide', type: 'Series', snippet: 'Comprehensive guide to policy lifecycle management — from issuance through renewal, endorsement, cancellation, and reinstatement.', author: 'Policy Admin', date: 'Jan 10, 2026', id: 'gen-002' },
    { title: 'Customer Communication Standards', type: 'Post', snippet: 'Standards for written and verbal communication with policyholders during the claims process, including required disclosures and response SLAs.', author: 'Customer Experience', date: 'Dec 18, 2025', id: 'gen-003' },
  ],
};

// ─── Mock AI answers ───────────────────────────────────────────────────────────
const AI_ANSWERS = {
  askAI: {
    'how do I process a homeowner claim': 'To process a homeowner claim, verify policy details and coverage limits, document all damages with photos, and assign an adjuster within 24 hours. Ensure forms HO-3 and the supplemental damage report are completed before closing.',
    'what are the michigan auto insurance requirements': 'Michigan requires PIP, PPI of at least $1 million, and Residual Liability Insurance. Since 2020, drivers may choose their PIP level. Minimum bodily injury liability is $250,000/$500,000.',
    'adjuster assignment guidelines': 'Assign a licensed field adjuster within 24 hours for claims above $5,000. Desk adjusters handle claims below $5,000 remotely. Use the Field vs. Desk Decision Tree to route edge cases.',
    default: 'Based on the available knowledge base, here is what I found. Please review the source articles below for full context and documentation.',
  },
  synapse: {
    'how do I process a homeowner claim': '## Homeowner Claim Processing\n\n**1. Intake & Verification** — Confirm the policy number, coverage type (HO-3, HO-5), and loss date falls within the active policy period.\n\n**2. Initial Contact** — Reach the claimant within 4 business hours and schedule an inspection or request photo documentation based on claim severity.\n\n**3. Adjuster Assignment** — For claims above $5,000, assign a licensed field adjuster within 24 hours. Below $5,000, a desk adjuster handles remotely.\n\n**4. Documentation** — Collect the HO-3 form, photo evidence, contractor estimates, and proof of ownership for personal property items.\n\n**5. Resolution** — Issue payment or denial within the state-mandated window: Ohio 21 days, Michigan 60 days. Log all actions in Optimus.',
    'what are the michigan auto insurance requirements': '## Michigan Auto Insurance Requirements\n\nSince the 2020 No-Fault Reform, Michigan drivers select their own PIP level at policy issuance.\n\n**Required coverages:**\n- **PIP** — chosen level from unlimited down to opt-out (with qualifying health coverage)\n- **PPI** — minimum $1,000,000 for damage you cause to others\' property\n- **Residual Liability** — minimum $250,000 / $500,000 bodily injury\n\nThe mini-tort cap allows recovery of up to $3,000 for vehicle damage when the other driver is more than 50% at fault.',
    'adjuster assignment guidelines': '## Adjuster Assignment Guidelines\n\nUse the **Field vs. Desk Decision Tree** to route each claim:\n\n**Field adjuster required when:**\n- Estimated damages exceed $5,000\n- Structural damage is suspected\n- Insured specifically requests in-person inspection\n\n**Desk adjuster handles:**\n- Claims below $5,000 via photo documentation\n- Virtual assessments for minor auto or contents claims\n\nAll assignments must be logged in Optimus within 2 hours of claim intake.',
    default: '## Search Results\n\nHere is a synthesized answer based on the most relevant content in your knowledge base.\n\nFor best results, try a specific question such as *"What are the steps to process an auto claim in Ohio?"* or *"What documentation is required for a fire claim?"*',
  },
  thinking: {
    'how do I process a homeowner claim': "The user needs homeowner claim processing steps. I'll structure the answer around the five key phases — intake, contact, adjuster assignment, documentation, and resolution — pulling from the SOP and state timeline docs.",
    'what are the michigan auto insurance requirements': "Michigan no-fault is complex post-2020 reform. I'll focus on the required coverages (PIP, PPI, Residual Liability), the new PIP election options, and the key minimums for bodily injury liability.",
    'adjuster assignment guidelines': "The user wants adjuster routing criteria. Key decision point is the $5,000 threshold. I'll explain field vs. desk adjuster criteria and reference the Decision Tree.",
    default: 'Analyzing the query against the knowledge base. Identifying the most relevant articles and structuring a comprehensive, accurate response based on your community content.',
  },
};

// ─── Mock follow-up responses (Synapse conversation) ──────────────────────────
const FOLLOWUP_RESPONSES = {
  michigan: {
    'opt out':    'If a policyholder opts out of PIP, they must have qualifying health coverage through an employer group plan. The opt-out only applies to medical benefits — PPI and Residual Liability are still required. Verify the qualifying coverage on file before processing any PIP opt-out election.',
    'mini-tort':  "Michigan's mini-tort allows recovery of up to $3,000 for vehicle damage when the other driver is more than 50% at fault. This applies even under no-fault, specifically for uninsured out-of-pocket repair costs. File the mini-tort claim separately from the PIP claim.",
    'pip':        'PIP (Personal Injury Protection) covers the insured\'s own medical bills and lost wages regardless of fault. Under the 2020 reform, Michigan policyholders choose their PIP level at renewal: Unlimited, $500K, $250K, $50K (Medicaid eligible), or Opt-Out (with qualifying health coverage).',
    'uninsured':  'Uninsured Motorist coverage is not required in Michigan but is strongly recommended. Without it, recovery for injuries caused by an uninsured driver is limited. The mini-tort cap of $3,000 only covers vehicle damage — it does not cover medical or lost wages beyond PIP.',
    default:      "Under Michigan's 2020 reform, each policyholder's elected PIP level is listed on the declarations page in Optimus under Coverage Summary. If you're handling a claim and the PIP election is unclear, pull the declarations page before assessing coverage. I can walk you through specific PIP scenarios if helpful.",
  },
  homeowner: {
    'adjuster':   'If a field adjuster cannot be assigned within 24 hours for a claim over $5,000, escalate immediately to the Regional Claims Supervisor. Document the escalation in Optimus and send the insured a written notice of the revised inspection timeline to remain compliant.',
    'timeline':   'Michigan allows up to 60 days, Ohio 21 days, and Pennsylvania 30 days. For complex claims with hidden structural damage or disputed contractor estimates, you can file a formal extension before the deadline — this must include written justification and must be communicated to the insured.',
    'document':   'Required documentation includes: completed HO-3 form, signed property access authorization, photo evidence of all damage, at least two independent contractor estimates, and proof of ownership for personal property items over $500. Missing documentation is the most common cause of claim delays.',
    'supplement': 'Any supplemental damage found after initial assessment must be re-authorized before additional payments are issued. Do not close the claim if the insured reports new damage — reopen it, assign a follow-up inspection, and document the supplement separately in Optimus.',
    default:      'For complex homeowner claims, the most important thing is documentation completeness before closure. Coordinate with the adjuster and insured before issuing partial payments. If there are disputes over contractor estimates, engage the internal appraisal team — they can provide an independent valuation.',
  },
  adjuster: {
    'certif':     'Field adjusters need a valid state license for each jurisdiction they handle claims in. Most states require 15–20 continuing education credits annually for renewal. Michigan, Ohio, and Pennsylvania have active reciprocity agreements — check the Adjuster Certification database to confirm which states a given adjuster is licensed for.',
    'field':      'A field adjuster is required when estimated damages exceed $5,000, structural damage is suspected, or the insured specifically requests an in-person inspection. Desk adjusters handle all other claims remotely via photo documentation and virtual assessments submitted through the claimant portal.',
    'workload':   'Adjuster workload is monitored in Optimus under Team → Workload View. If an adjuster has more than 40 active claims, the system will flag an overload and recommend an alternative. Always check current workload before making a manual assignment.',
    'reassign':   "To reassign a claim, use the Reassign function under the claim detail in Optimus — don't manually change the field and save, as that doesn't preserve the full assignment history. The Reassign function creates an audit trail, which is required for any claims that later go to appraisal or litigation.",
    default:      'Adjuster assignments are logged automatically in Optimus once confirmed. If you encounter a conflict of interest or capacity issue that requires reassignment, document the reason in the claim notes before reassigning. This creates a clean audit trail for compliance review.',
  },
  general: {
    default:      "Based on the knowledge base, I'd recommend reviewing the source articles linked above for full context. For policy-specific questions, check the declarations page in Optimus. For process questions, the Claims Handling Quick Reference Guide covers most common scenarios. What specific aspect can I help you dig into?",
  },
};

// ─── Semantic search data (search mode) ───────────────────────────────────────
const SEMANTIC_RESULTS = {
  'homeowner': [
    { title: 'Homeowner Claims Processing Guide', type: 'Series', score: 97, snippet: 'Step-by-step guide covering intake, initial assessment, adjuster assignment, documentation requirements, and state-mandated resolution timelines for <mark>homeowner</mark> policies.', author: 'Claims Team', date: 'Jan 15, 2026', id: 'hc-001', views: 1842, tags: ['claims', 'homeowner', 'SOP'] },
    { title: 'HO-3 vs HO-5 Policy Coverage Comparison', type: 'Post', score: 91, snippet: 'Detailed comparison of <mark>homeowner</mark> policy forms HO-3 and HO-5 — open perils vs. named perils, personal property coverage differences, and when to recommend each form.', author: 'Underwriting', date: 'Feb 10, 2026', id: 'ho-007', views: 934, tags: ['policy', 'underwriting'] },
    { title: 'Required Documentation Checklist', type: 'Post', score: 86, snippet: 'Complete list of required forms and evidence for <mark>homeowner</mark> claims, including HO-3, supplemental damage reports, contractor estimates, and photo documentation.', author: 'Compliance', date: 'Dec 10, 2025', id: 'rd-003', views: 712, tags: ['documentation', 'compliance'] },
    { title: 'State Mandated Resolution Timelines', type: 'Post', score: 79, snippet: 'Ohio: 21 days, Michigan: 60 days, Pennsylvania: 30 days. Non-compliance with <mark>homeowner</mark> claim timelines may result in regulatory penalties and bad-faith exposure.', author: 'Legal', date: 'Nov 22, 2025', id: 'st-004', views: 589, tags: ['legal', 'compliance', 'timelines'] },
    { title: 'Adjuster Assignment SOP', type: 'Post', score: 71, snippet: 'SOP for assigning adjusters based on claim value. Claims above $5,000 require a licensed field adjuster within 24 hours of the initial report. Applies to all <mark>homeowner</mark> and auto claims.', author: 'Operations', date: 'Feb 3, 2026', id: 'aa-002', views: 1201, tags: ['adjuster', 'SOP'] },
  ],
  'michigan': [
    { title: 'State Requirements — Michigan Auto', type: 'Series', score: 99, snippet: '<mark>Michigan</mark> requires PIP, PPI of at least $1M, and Residual Liability Insurance. Since 2020 reform, drivers may elect their PIP level from unlimited down to opt-out.', author: 'Compliance', date: 'Mar 1, 2026', id: 'mi-001', views: 2103, tags: ['michigan', 'auto', 'PIP'] },
    { title: 'Michigan No-Fault Reform Summary', type: 'Post', score: 95, snippet: 'Overview of the 2020 <mark>Michigan</mark> No-Fault reform: new PIP election options, mini-tort updates, and the impact on bodily injury liability minimums ($250K/$500K).', author: 'Legal', date: 'Feb 14, 2026', id: 'mi-002', views: 1678, tags: ['michigan', 'no-fault', 'reform'] },
    { title: 'PIP Election Options by State', type: 'Post', score: 83, snippet: 'Following the 2020 <mark>Michigan</mark> reform, policyholders choose PIP level at renewal: Unlimited, $500K, $250K, $50K (Medicaid eligible), or Opt-Out with qualifying health coverage.', author: 'Underwriting', date: 'Jan 20, 2026', id: 'pip-010', views: 891, tags: ['PIP', 'michigan', 'election'] },
    { title: 'Minimum Liability Standards by State', type: 'Post', score: 76, snippet: 'State-by-state breakdown of minimum auto liability requirements. Includes recent legislative changes for <mark>MI</mark>, OH, PA, and FL effective 2025–2026.', author: 'Underwriting', date: 'Jan 30, 2026', id: 'ml-003', views: 644, tags: ['liability', 'state-requirements'] },
    { title: 'Mini-Tort Recovery Guide', type: 'Q&A', score: 68, snippet: '<mark>Michigan</mark>\'s mini-tort allows recovery of up to $3,000 for vehicle damage when the other driver is more than 50% at fault. File separately from the PIP claim.', author: 'Legal', date: 'Dec 5, 2025', id: 'mt-011', views: 412, tags: ['mini-tort', 'michigan'] },
  ],
  'adjuster': [
    { title: 'Adjuster Assignment SOP', type: 'Post', score: 98, snippet: 'SOP for assigning <mark>adjusters</mark> based on claim value. Claims above $5,000 require a licensed field <mark>adjuster</mark> within 24 hours of the initial report.', author: 'Operations', date: 'Feb 3, 2026', id: 'aa-002', views: 1201, tags: ['adjuster', 'SOP'] },
    { title: 'Field vs. Desk Adjuster Decision Tree', type: 'Post', score: 94, snippet: 'Decision framework for routing claims to field or desk <mark>adjusters</mark>. Factors include claim type, estimated value, customer tier, and geographic availability.', author: 'Claims Team', date: 'Jan 8, 2026', id: 'adj-005', views: 876, tags: ['adjuster', 'decision-tree'] },
    { title: 'Adjuster Certification Requirements', type: 'Series', score: 87, snippet: 'State-by-state certification and licensing requirements for field <mark>adjusters</mark>. Includes renewal timelines, CE credits, and reciprocity agreements across MI, OH, PA.', author: 'HR & Compliance', date: 'Dec 5, 2025', id: 'adj-006', views: 543, tags: ['adjuster', 'certification', 'licensing'] },
    { title: 'Adjuster Workload Monitoring in Optimus', type: 'Post', score: 79, snippet: '<mark>Adjuster</mark> workload is monitored in Optimus under Team → Workload View. If an <mark>adjuster</mark> has more than 40 active claims, the system will flag an overload.', author: 'Operations', date: 'Nov 18, 2025', id: 'adj-012', views: 398, tags: ['adjuster', 'optimus', 'workload'] },
    { title: 'Claims Handling — Quick Reference Guide', type: 'Post', score: 65, snippet: 'Concise reference covering the most common claim scenarios, escalation paths, and <mark>adjuster</mark> SLA timelines across all claim types.', author: 'Claims Team', date: 'Feb 20, 2026', id: 'gen-001', views: 2341, tags: ['claims', 'reference'] },
  ],
  default: [
    { title: 'Claims Handling — Quick Reference Guide', type: 'Post', score: 88, snippet: 'Concise reference covering the most common claim scenarios, escalation paths, required documentation, and SLA timelines across all claim types.', author: 'Claims Team', date: 'Feb 20, 2026', id: 'gen-001', views: 2341, tags: ['claims', 'reference'] },
    { title: 'Policy Administration Guide', type: 'Series', score: 81, snippet: 'Comprehensive guide to policy lifecycle management — from issuance through renewal, endorsement, cancellation, and reinstatement.', author: 'Policy Admin', date: 'Jan 10, 2026', id: 'gen-002', views: 1102, tags: ['policy', 'admin'] },
    { title: 'Customer Communication Standards', type: 'Post', score: 74, snippet: 'Standards for written and verbal communication with policyholders during the claims process, including required disclosures and response SLAs.', author: 'Customer Experience', date: 'Dec 18, 2025', id: 'gen-003', views: 788, tags: ['communication', 'CX'] },
    { title: 'State Mandated Resolution Timelines', type: 'Post', score: 67, snippet: 'Ohio: 21 days, Michigan: 60 days, Pennsylvania: 30 days. Non-compliance may result in regulatory penalties and bad-faith exposure.', author: 'Legal', date: 'Nov 22, 2025', id: 'st-004', views: 589, tags: ['legal', 'timelines'] },
  ],
};

const RELATED_SEARCHES = {
  'homeowner':  ['homeowner claim documentation', 'HO-3 policy coverage', 'adjuster assignment for homeowner', 'state resolution timelines'],
  'michigan':   ['michigan PIP election options', 'michigan no-fault reform 2020', 'mini-tort michigan', 'michigan minimum liability'],
  'adjuster':   ['adjuster certification by state', 'field vs desk adjuster', 'adjuster workload in Optimus', 'adjuster reassignment process'],
  default:      ['claims escalation process', 'policy endorsement guide', 'customer communication SLAs', 'Optimus quick start'],
};

function getSemanticResults(query) {
  const q = (query || '').toLowerCase().trim();
  for (const key of Object.keys(SEMANTIC_RESULTS)) {
    if (key === 'default') continue;
    if (q.includes(key)) return SEMANTIC_RESULTS[key];
  }
  return SEMANTIC_RESULTS.default;
}

function getRelatedSearches(query) {
  const q = (query || '').toLowerCase().trim();
  for (const key of Object.keys(RELATED_SEARCHES)) {
    if (key === 'default') continue;
    if (q.includes(key)) return RELATED_SEARCHES[key];
  }
  return RELATED_SEARCHES.default;
}

function getFollowUpResponse(originalQuery, followUpQuery) {
  const oq = (originalQuery || '').toLowerCase();
  const fq = (followUpQuery || '').toLowerCase();

  let topicMap = FOLLOWUP_RESPONSES.general;
  if (oq.includes('michigan') || oq.includes('auto insur')) topicMap = FOLLOWUP_RESPONSES.michigan;
  else if (oq.includes('homeowner') || oq.includes('home')) topicMap = FOLLOWUP_RESPONSES.homeowner;
  else if (oq.includes('adjuster')) topicMap = FOLLOWUP_RESPONSES.adjuster;

  for (const key of Object.keys(topicMap)) {
    if (key === 'default') continue;
    if (fq.includes(key)) return topicMap[key];
  }
  return topicMap.default || FOLLOWUP_RESPONSES.general.default;
}

function getSearchResults(query) {
  const q = (query || '').toLowerCase().trim();
  for (const key of Object.keys(SEARCH_RESULTS)) {
    if (key === 'default') continue;
    if (q.includes(key.split(' ').slice(0, 4).join(' '))) return SEARCH_RESULTS[key];
  }
  return SEARCH_RESULTS.default;
}

function getAIAnswer(query, mode) {
  const q = (query || '').toLowerCase().trim();
  const ds = AI_ANSWERS[mode];
  for (const key of Object.keys(ds)) {
    if (key === 'default') continue;
    if (q.includes(key.split(' ').slice(0, 4).join(' '))) return ds[key];
  }
  return ds.default;
}

function getThinking(query) {
  const q = (query || '').toLowerCase().trim();
  const ds = AI_ANSWERS.thinking;
  for (const key of Object.keys(ds)) {
    if (key === 'default') continue;
    if (q.includes(key.split(' ').slice(0, 4).join(' '))) return ds[key];
  }
  return ds.default;
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
const LOGO_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <line x1="12" y1="2" x2="12" y2="22" stroke="#3ba8c4" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="2" y1="12" x2="22" y2="12" stroke="#3ba8c4" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#3ba8c4" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="#3ba8c4" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="12" cy="2" r="1.3" fill="#3ba8c4"/><circle cx="12" cy="22" r="1.3" fill="#3ba8c4"/>
  <circle cx="2" cy="12" r="1.3" fill="#3ba8c4"/><circle cx="22" cy="12" r="1.3" fill="#3ba8c4"/>
  <circle cx="4.93" cy="4.93" r="1.3" fill="#3ba8c4"/><circle cx="19.07" cy="19.07" r="1.3" fill="#3ba8c4"/>
  <circle cx="19.07" cy="4.93" r="1.3" fill="#3ba8c4"/><circle cx="4.93" cy="19.07" r="1.3" fill="#3ba8c4"/>
</svg>`;

const iconSearch = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="7" stroke="white" stroke-width="2.2"/>
  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const iconSend = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <path d="M22 2L11 13" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const iconSparkle = (c = '#3ba8c4') => `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
    stroke="${c}" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const iconLightning = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#3ba8c4" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

const iconDoc = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#3ba8c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="14,2 14,8 20,8" stroke="#3ba8c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="8" y1="13" x2="16" y2="13" stroke="#3ba8c4" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="8" y1="17" x2="12" y2="17" stroke="#3ba8c4" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const iconSeries = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="7" height="7" rx="1" stroke="#3ba8c4" stroke-width="1.8"/>
  <rect x="14" y="3" width="7" height="7" rx="1" stroke="#3ba8c4" stroke-width="1.8"/>
  <rect x="3" y="14" width="7" height="7" rx="1" stroke="#3ba8c4" stroke-width="1.8"/>
  <rect x="14" y="14" width="7" height="7" rx="1" stroke="#3ba8c4" stroke-width="1.8"/>
</svg>`;

const iconQA = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#3ba8c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const iconExternal = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#8fa3b1" stroke-width="2" stroke-linecap="round"/>
  <polyline points="15,3 21,3 21,9" stroke="#8fa3b1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="14" x2="21" y2="3" stroke="#8fa3b1" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const iconChevron = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
  <path d="M6 9l6 6 6-6" stroke="#8fa3b1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const iconUser = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="8" r="4" stroke="#8fa3b1" stroke-width="1.8"/>
  <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#8fa3b1" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const iconCalendar = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#8fa3b1" stroke-width="1.8"/>
  <line x1="3" y1="9" x2="21" y2="9" stroke="#8fa3b1" stroke-width="1.8"/>
  <line x1="8" y1="2" x2="8" y2="6" stroke="#8fa3b1" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="16" y1="2" x2="16" y2="6" stroke="#8fa3b1" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const iconPlus = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
  <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

function getTypeIcon(type) {
  if (type === 'Series') return iconSeries;
  if (type === 'Q&A')    return iconQA;
  return iconDoc;
}

// ─── Web Component ────────────────────────────────────────────────────────────
class BloomfireSearch extends HTMLElement {
  static get observedAttributes() { return ['mode', 'community-id', 'token']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._mode          = 'search';
    this._loading       = false;
    this._results       = null;
    this._aiAnswer      = null;
    this._thinking      = null;
    this._showThinking  = false;
    this._thinkingOpen  = false;
    this._lastQuery     = '';
    this._conversation  = [];   // [{role:'user'|'synapse', text, results?, thinking?}]
    this._searchFilter  = 'all'; // 'all' | 'Post' | 'Series' | 'Q&A'
    this._searchResults = null;  // enriched semantic results for search mode
  }

  connectedCallback() {
    this._mode = this.getAttribute('mode') || 'search';
    this.render();
    this._bind();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'mode') {
      this._mode = newVal;
      this._results = null; this._aiAnswer = null;
      this._loading = false; this._conversation = [];
      this._searchResults = null; this._searchFilter = 'all';
      this.render(); this._bind();
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  get css() {
    return `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        color: ${BF.textPrimary};
        background: ${BF.white};
        border: 1px solid ${BF.border};
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(13,27,53,0.1);
        max-width: 680px;
        width: 100%;
      }

      /* ── Header ── */
      .header {
        background: ${BF.navy};
        padding: 12px 16px;
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 3px solid ${BF.teal};
      }
      .logo {
        display: flex; align-items: center; gap: 7px;
        color: ${BF.white}; font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
      }
      .tabs { display: flex; gap: 2px; }
      .tab {
        padding: 5px 13px; border: none; border-radius: 4px;
        font-size: 12px; font-weight: 600; cursor: pointer;
        color: rgba(255,255,255,0.55); background: transparent;
        transition: all 0.15s; font-family: inherit;
      }
      .tab.active { background: ${BF.teal}; color: ${BF.white}; }
      .tab:hover:not(.active) { color: ${BF.white}; background: rgba(255,255,255,0.1); }

      /* ── Search bar ── */
      .search-wrap {
        padding: 12px 16px;
        background: ${BF.bgPage};
        border-bottom: 1px solid ${BF.border};
      }
      .search-row { display: flex; gap: 0; align-items: stretch; }
      .search-input {
        flex: 1; padding: 10px 14px;
        border: 1.5px solid ${BF.border}; border-right: none;
        border-radius: 6px 0 0 6px;
        font-size: 13.5px; color: ${BF.textPrimary};
        background: ${BF.white}; outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
        font-family: inherit;
      }
      .search-input:focus {
        border-color: ${BF.teal};
        box-shadow: 0 0 0 3px rgba(59,168,196,0.15);
        z-index: 1; position: relative;
      }
      .search-input::placeholder { color: ${BF.textMeta}; }
      .search-btn {
        display: flex; align-items: center; gap: 6px;
        padding: 10px 18px;
        background: ${BF.orange}; color: ${BF.white};
        border: none; border-radius: 0 6px 6px 0;
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: background 0.15s; white-space: nowrap;
        font-family: inherit;
      }
      .search-btn:hover { background: ${BF.orangeHover}; }

      /* Synapse pills */
      .synapse-pills { display: flex; gap: 6px; margin-top: 9px; align-items: center; }
      .pill {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 4px 10px; border-radius: 20px;
        font-size: 11px; font-weight: 600; cursor: pointer;
        border: 1.5px solid ${BF.border}; background: ${BF.white};
        color: ${BF.textSecond}; transition: all 0.15s;
        user-select: none; font-family: inherit;
      }
      .pill.active { border-color: ${BF.teal}; background: ${BF.tealLight}; color: ${BF.teal}; }
      .pill:hover:not(.active) { border-color: #b0c8d4; color: ${BF.textPrimary}; }

      /* ── Results (one-shot mode) ── */
      .results {
        min-height: 140px; background: ${BF.white};
        overflow-y: auto; max-height: 520px;
      }

      /* ── Conversation mode results container ── */
      .results.conv-mode {
        display: flex; flex-direction: column;
        overflow: hidden;
      }

      /* ── Conversation thread ── */
      .conv-thread {
        overflow-y: auto;
        padding: 14px 16px 8px;
        display: flex; flex-direction: column;
        gap: 0;
        scroll-behavior: smooth;
        min-height: 180px;
        max-height: 360px;
      }
      /* Custom scrollbar */
      .conv-thread::-webkit-scrollbar { width: 4px; }
      .conv-thread::-webkit-scrollbar-track { background: transparent; }
      .conv-thread::-webkit-scrollbar-thumb { background: ${BF.tealMid}; border-radius: 4px; }

      /* User message bubble */
      .conv-user-wrap {
        display: flex; justify-content: flex-end; margin-bottom: 12px;
      }
      .conv-user-bubble {
        background: #e8f2f7;
        border: 1px solid ${BF.tealMid};
        border-radius: 14px 14px 4px 14px;
        padding: 9px 13px;
        max-width: 84%;
        font-size: 13px; color: ${BF.textPrimary}; line-height: 1.55;
      }

      /* Synapse response */
      .conv-synapse-wrap { margin-bottom: 16px; }
      .conv-synapse-label {
        display: flex; align-items: center; gap: 5px;
        font-size: 10px; font-weight: 700;
        color: ${BF.teal}; text-transform: uppercase; letter-spacing: 0.8px;
        margin-bottom: 6px;
      }
      .conv-synapse-body {
        background: ${BF.tealLight};
        border-left: 3px solid ${BF.teal};
        border-radius: 0 6px 6px 0;
        padding: 11px 14px;
        font-size: 13px; line-height: 1.7; color: ${BF.textPrimary};
      }
      .conv-synapse-body h2 { font-size: 13.5px; font-weight: 700; color: ${BF.navy}; margin: 0 0 8px; }
      .conv-synapse-body p  { margin-bottom: 7px; }
      .conv-synapse-body p:last-child { margin-bottom: 0; }
      .conv-synapse-body strong { font-weight: 600; color: ${BF.navy}; }
      .conv-synapse-body em { color: ${BF.teal}; font-style: italic; }

      /* Source pills below response */
      .conv-sources {
        display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;
      }
      .conv-source-pill {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 3px 9px;
        background: ${BF.white}; border: 1px solid ${BF.border};
        border-radius: 20px;
        font-size: 11px; color: ${BF.textSecond};
        cursor: pointer; text-decoration: none;
        transition: all 0.15s;
      }
      .conv-source-pill:hover { border-color: ${BF.teal}; color: ${BF.teal}; }

      /* Thinking block (in conversation) */
      .conv-thinking {
        margin-bottom: 6px;
        border: 1px solid ${BF.border}; border-radius: 6px; overflow: hidden;
      }
      .conv-thinking-toggle {
        width: 100%; display: flex; align-items: center; gap: 6px;
        padding: 6px 12px; background: ${BF.bgPage}; border: none;
        font-size: 11px; font-weight: 600; color: ${BF.textSecond};
        cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s;
      }
      .conv-thinking-toggle:hover { background: ${BF.tealLight}; }
      .conv-thinking-toggle .chev { margin-left: auto; transition: transform 0.2s; }
      .conv-thinking-toggle.open .chev { transform: rotate(180deg); }
      .conv-thinking-body {
        display: none; padding: 9px 12px;
        font-size: 11.5px; line-height: 1.6; color: ${BF.textSecond};
        border-top: 1px solid ${BF.borderLight}; font-style: italic;
      }
      .conv-thinking-body.visible { display: block; }

      /* Typing indicator */
      .conv-typing {
        display: flex; align-items: center; gap: 5px; padding: 4px 0 10px;
      }
      .conv-typing-label { font-size: 11px; color: ${BF.textMeta}; margin-right: 2px; }
      .typing-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: ${BF.tealMid}; animation: bounce 1.2s infinite;
      }
      .typing-dot:nth-child(3) { animation-delay: 0.2s; }
      .typing-dot:nth-child(4) { animation-delay: 0.4s; }
      @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

      /* Turn divider */
      .conv-turn-divider {
        height: 1px; background: ${BF.borderLight}; margin: 4px 0 14px;
      }

      /* ── Conversation header bar ── */
      .conv-header-bar {
        padding: 8px 14px;
        background: ${BF.bgPage};
        border-bottom: 1px solid ${BF.border};
        display: flex; align-items: center; gap: 10px;
      }
      .conv-header-query {
        flex: 1; font-size: 12px; color: ${BF.textSecond};
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .conv-header-query strong { color: ${BF.textPrimary}; font-weight: 600; }
      .conv-new-btn {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; color: ${BF.teal}; cursor: pointer;
        background: none; border: 1px solid ${BF.tealMid};
        border-radius: 4px; padding: 3px 10px;
        font-family: inherit; font-weight: 600;
        transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
      }
      .conv-new-btn:hover { background: ${BF.tealLight}; }

      /* ── Follow-up input bar ── */
      .followup-bar {
        padding: 10px 14px;
        background: ${BF.bgPage};
        border-top: 1px solid ${BF.border};
        display: flex; gap: 0; align-items: stretch;
      }
      .followup-input {
        flex: 1; padding: 9px 14px;
        border: 1.5px solid ${BF.border}; border-right: none;
        border-radius: 20px 0 0 20px;
        font-size: 13px; color: ${BF.textPrimary};
        background: ${BF.white}; outline: none;
        font-family: inherit; transition: border-color 0.15s;
      }
      .followup-input:focus { border-color: ${BF.teal}; }
      .followup-input::placeholder { color: ${BF.textMeta}; }
      .followup-input:disabled { background: ${BF.bgPage}; }
      .followup-send {
        padding: 9px 16px;
        background: ${BF.orange}; color: ${BF.white};
        border: none; border-radius: 0 20px 20px 0;
        cursor: pointer; font-size: 13px; font-weight: 600;
        display: flex; align-items: center; gap: 5px;
        transition: background 0.15s; font-family: inherit;
        white-space: nowrap;
      }
      .followup-send:hover:not(:disabled) { background: ${BF.orangeHover}; }
      .followup-send:disabled { opacity: 0.45; cursor: default; }

      /* ── Empty state ── */
      .empty {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 10px;
        padding: 40px 16px; text-align: center; color: ${BF.textMeta};
      }
      .empty-icon {
        width: 46px; height: 46px; background: ${BF.tealLight};
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
      }
      .empty p { font-size: 13px; line-height: 1.5; max-width: 260px; }
      .empty-hint { font-size: 11px; color: #b0c8d4; }

      /* ── Loading skeleton (one-shot) ── */
      .skel-wrap { display: flex; flex-direction: column; gap: 0; }
      .skel-card {
        padding: 14px 16px;
        border-bottom: 1px solid ${BF.borderLight};
        display: flex; flex-direction: column; gap: 7px;
      }
      .skel {
        height: 11px; border-radius: 4px;
        background: linear-gradient(90deg, #edf1f4 25%, #dde5ea 50%, #edf1f4 75%);
        background-size: 200% 100%;
        animation: shimmer 1.3s infinite;
      }
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

      /* ── AI Answer block (one-shot) ── */
      .ai-block {
        border-left: 3px solid ${BF.teal}; background: ${BF.tealLight};
        margin: 14px 16px 0; border-radius: 0 6px 6px 0; padding: 12px 14px;
      }
      .ai-label {
        display: flex; align-items: center; gap: 5px;
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.8px; color: ${BF.teal}; margin-bottom: 7px;
      }
      .ai-text { font-size: 13px; line-height: 1.7; color: ${BF.textPrimary}; }
      .synapse-answer h2 { font-size: 13.5px; font-weight: 700; color: ${BF.navy}; margin: 0 0 8px; }
      .synapse-answer p  { font-size: 13px; line-height: 1.7; color: ${BF.textPrimary}; margin-bottom: 8px; }
      .synapse-answer strong { font-weight: 600; color: ${BF.navy}; }
      .synapse-answer em { color: ${BF.teal}; font-style: italic; }

      /* Thinking block (one-shot) */
      .thinking-block {
        margin: 10px 16px 0; border: 1px solid ${BF.border}; border-radius: 6px; overflow: hidden;
      }
      .thinking-toggle {
        width: 100%; display: flex; align-items: center; gap: 6px;
        padding: 7px 12px; background: ${BF.bgPage}; border: none;
        font-size: 12px; font-weight: 600; color: ${BF.textSecond};
        cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s;
      }
      .thinking-toggle:hover { background: ${BF.tealLight}; }
      .thinking-toggle .chev { margin-left: auto; transition: transform 0.2s; }
      .thinking-toggle.open .chev { transform: rotate(180deg); }
      .thinking-body {
        display: none; padding: 10px 12px;
        font-size: 12px; line-height: 1.6; color: ${BF.textSecond};
        border-top: 1px solid ${BF.borderLight}; font-style: italic;
      }
      .thinking-body.visible { display: block; }

      /* ── Search results section (one-shot) ── */
      .results-section { padding: 12px 16px 4px; }
      .results-header {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
      }
      .results-label {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.8px; color: ${BF.textMeta};
        display: flex; align-items: center; gap: 6px;
      }
      .results-count { font-size: 11px; color: ${BF.textMeta}; font-weight: 500; }

      /* Result card */
      .result-card {
        display: flex; gap: 12px; align-items: flex-start;
        padding: 11px 12px; border: 1px solid ${BF.border}; border-radius: 7px;
        margin-bottom: 7px; background: ${BF.white};
        text-decoration: none; transition: all 0.15s; cursor: pointer;
      }
      .result-card:hover {
        border-color: ${BF.tealMid}; background: ${BF.tealLight};
        box-shadow: 0 2px 8px rgba(59,168,196,0.1); transform: translateY(-1px);
      }
      .result-icon {
        width: 36px; height: 36px; flex-shrink: 0;
        background: ${BF.tealLight}; border-radius: 7px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid ${BF.tealMid}; margin-top: 1px;
      }
      .result-body { flex: 1; min-width: 0; }
      .result-top { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
      .result-type {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.4px; padding: 2px 7px; border-radius: 3px; flex-shrink: 0;
      }
      .type-post   { background: #e8f4fd; color: #1a6fa8; }
      .type-series { background: #f0edfb; color: #6941c6; }
      .type-qa     { background: #fef3e2; color: #b45309; }
      .result-title {
        font-size: 13px; font-weight: 600; color: ${BF.teal};
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
      }
      .result-card:hover .result-title { color: #2a8fab; }
      .result-snippet {
        font-size: 12px; color: ${BF.textSecond}; line-height: 1.55; margin-bottom: 6px;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .result-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: ${BF.textMeta}; }
      .result-meta-item { display: flex; align-items: center; gap: 4px; }
      .result-ext { flex-shrink: 0; opacity: 0.4; margin-left: auto; align-self: center; }

      /* ── Footer ── */
      .footer {
        padding: 7px 16px; border-top: 1px solid ${BF.borderLight};
        background: ${BF.bgPage};
        display: flex; align-items: center; justify-content: space-between;
      }
      .footer-brand { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; color: ${BF.textMeta}; }
      .footer-right  { display: flex; align-items: center; gap: 5px; font-size: 10px; color: ${BF.textMeta}; }
      .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf8a; }

      /* ── Search mode ── */
      .search-filter-bar {
        padding: 8px 16px; background: ${BF.bgPage};
        border-bottom: 1px solid ${BF.border};
        display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      }
      .filter-label { font-size: 10px; font-weight: 700; color: ${BF.textMeta}; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 2px; }
      .filter-chip {
        padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 600;
        border: 1.5px solid ${BF.border}; background: ${BF.white}; color: ${BF.textSecond};
        cursor: pointer; transition: all 0.15s; font-family: inherit;
      }
      .filter-chip.active { border-color: ${BF.teal}; background: ${BF.tealLight}; color: ${BF.teal}; }
      .filter-chip:hover:not(.active) { border-color: #b0c8d4; color: ${BF.textPrimary}; }

      .search-results-header {
        padding: 10px 16px 0; display: flex; align-items: center; justify-content: space-between;
      }
      .sr-count { font-size: 11px; color: ${BF.textMeta}; }
      .sr-count strong { color: ${BF.textPrimary}; font-weight: 700; }
      .semantic-badge {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 10px; font-weight: 600; color: ${BF.teal};
        background: ${BF.tealLight}; border: 1px solid ${BF.tealMid};
        padding: 2px 8px; border-radius: 20px;
      }

      /* Relevance bar on result card */
      .result-score-wrap { display: flex; align-items: center; gap: 5px; margin-top: 5px; }
      .result-score-bar-bg {
        flex: 1; height: 3px; background: ${BF.borderLight}; border-radius: 2px; max-width: 80px;
      }
      .result-score-bar { height: 3px; border-radius: 2px; background: ${BF.teal}; }
      .result-score-label { font-size: 10px; color: ${BF.textMeta}; font-weight: 600; white-space: nowrap; }
      .result-score-high .result-score-bar { background: #4caf8a; }
      .result-score-high .result-score-label { color: #4caf8a; }
      .result-score-mid  .result-score-bar { background: ${BF.teal}; }
      .result-score-mid  .result-score-label { color: ${BF.teal}; }
      .result-score-low  .result-score-bar { background: ${BF.textMeta}; }
      .result-score-low  .result-score-label { color: ${BF.textMeta}; }

      /* Tag pills on result */
      .result-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }
      .result-tag {
        font-size: 10px; color: ${BF.textMeta}; background: ${BF.bgPage};
        border: 1px solid ${BF.borderLight}; border-radius: 3px; padding: 1px 6px;
      }

      /* Highlighted match term */
      mark {
        background: #fff3b0; color: ${BF.navy}; border-radius: 2px;
        padding: 0 1px; font-style: normal;
      }

      /* Related searches */
      .related-wrap {
        padding: 12px 16px; border-top: 1px solid ${BF.borderLight};
        background: ${BF.bgPage};
      }
      .related-label {
        font-size: 10px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.5px; color: ${BF.textMeta}; margin-bottom: 7px;
      }
      .related-chips { display: flex; flex-wrap: wrap; gap: 5px; }
      .related-chip {
        padding: 4px 10px; background: ${BF.white}; border: 1px solid ${BF.border};
        border-radius: 20px; font-size: 11px; color: ${BF.teal}; cursor: pointer;
        transition: all 0.15s; font-weight: 500;
      }
      .related-chip:hover { background: ${BF.tealLight}; border-color: ${BF.teal}; }
    `;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  render() {
    const isSynapse  = this._mode === 'synapse';
    const isSearch   = this._mode === 'search';
    const isConvMode = isSynapse && this._conversation.length > 0;
    const community  = this.getAttribute('community-id') || 'Community';
    const placeholder = isSynapse
      ? 'Ask Synapse a question...'
      : isSearch
        ? 'Search Bloomfire knowledge base...'
        : 'Ask a question about your knowledge base...';

    let bodyHtml;
    if (isConvMode) {
      bodyHtml = this._renderSynapseConversation();
    } else if (isSearch && this._searchResults) {
      bodyHtml = this._renderSearchMode();
    } else {
      bodyHtml = `
        <div class="search-wrap">
          <div class="search-row">
            <input class="search-input" id="q" type="text"
              placeholder="${placeholder}" autocomplete="off"/>
            <button class="search-btn" id="btn">
              ${isSynapse ? 'Enter' : `${iconSearch} Search`}
            </button>
          </div>
          ${isSynapse ? `
          <div class="synapse-pills">
            <div class="pill ${!this._showThinking ? 'active' : ''}" id="ip">
              ${iconLightning} Instant mode
            </div>
            <div class="pill ${this._showThinking ? 'active' : ''}" id="tp">
              ${iconSparkle(this._showThinking ? BF.teal : BF.textMeta)} Thinking mode
            </div>
          </div>` : ''}
        </div>
        <div class="results" id="res">
          ${this._loading
            ? this._renderLoading()
            : (this._results || this._aiAnswer)
              ? this._renderResults()
              : this._renderEmpty()}
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <div class="header">
        <div class="logo">${LOGO_SVG} Bloomfire</div>
        <div class="tabs">
          <button class="tab ${this._mode === 'search' ? 'active' : ''}" data-mode="search">Search</button>
          <button class="tab ${isSynapse ? 'active' : ''}" data-mode="synapse">Synapse</button>
        </div>
      </div>
      ${bodyHtml}
      <div class="footer">
        <div class="footer-brand">
          ${LOGO_SVG.replace('width="20" height="20"', 'width="13" height="13"')}
          Powered by Bloomfire
        </div>
        <div class="footer-right">
          <span class="status-dot"></span>
          ${community}
        </div>
      </div>
    `;
  }

  // ── Synapse conversation layout ───────────────────────────────────────────────
  _renderSynapseConversation() {
    const firstUserMsg = this._conversation.find(m => m.role === 'user')?.text || '';

    let threadHtml = '';
    this._conversation.forEach((msg, idx) => {
      if (msg.role === 'user') {
        threadHtml += `
          <div class="conv-user-wrap">
            <div class="conv-user-bubble">${msg.text}</div>
          </div>`;
      } else {
        // Format markdown-ish answer
        const answerHtml = (msg.text || '')
          .replace(/^## (.+)$/m, '<h2>$1</h2>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .split('\n\n').map(p => p.startsWith('<') ? p : `<p>${p}</p>`).join('');

        // Thinking block (only first synapse message, if thinking enabled)
        let thinkingHtml = '';
        if (idx === 1 && this._showThinking && msg.thinking) {
          thinkingHtml = `
            <div class="conv-thinking">
              <button class="conv-thinking-toggle ${this._thinkingOpen ? 'open' : ''}" id="te">
                ${iconSparkle(BF.textSecond)} Thinking process
                <span class="chev">${iconChevron}</span>
              </button>
              <div class="conv-thinking-body ${this._thinkingOpen ? 'visible' : ''}" id="tb">
                ${msg.thinking}
              </div>
            </div>`;
        }

        // Source pills (up to 3)
        const sources = msg.results || [];
        const sourcePills = sources.slice(0, 3).map(r =>
          `<a class="conv-source-pill" href="https://app.bloomfire.com/posts/${r.id}" target="_blank">
            ${getTypeIcon(r.type).replace(/width="15" height="15"/g, 'width="11" height="11"')}
            ${r.title}
          </a>`
        ).join('');

        threadHtml += `
          <div class="conv-synapse-wrap">
            ${thinkingHtml}
            <div class="conv-synapse-label">${iconLightning} Synapse</div>
            <div class="conv-synapse-body">${answerHtml}</div>
            ${sourcePills ? `<div class="conv-sources">${sourcePills}</div>` : ''}
          </div>`;

        // Divider between turns (not after last message)
        if (idx < this._conversation.length - 1) {
          threadHtml += `<div class="conv-turn-divider"></div>`;
        }
      }
    });

    // Typing indicator
    if (this._loading) {
      threadHtml += `
        <div class="conv-typing">
          <span class="conv-typing-label">Synapse is thinking</span>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>`;
    }

    const inputDisabled = this._loading ? 'disabled' : '';
    const sendDisabled  = this._loading ? 'disabled' : '';

    return `
      <div class="conv-header-bar">
        <span class="conv-header-query">
          <strong>Synapse</strong> &nbsp;·&nbsp; ${firstUserMsg}
        </span>
        <button class="conv-new-btn" id="conv-new">
          ${iconPlus} New conversation
        </button>
      </div>
      <div class="results conv-mode">
        <div class="conv-thread" id="conv-thread">
          ${threadHtml}
        </div>
        <div class="followup-bar">
          <input class="followup-input" id="fq" type="text"
            placeholder="${this._loading ? 'Synapse is responding…' : 'Ask a follow-up question…'}"
            autocomplete="off" ${inputDisabled}/>
          <button class="followup-send" id="fs" ${sendDisabled}>
            ${iconSend} Send
          </button>
        </div>
      </div>
    `;
  }

  _renderEmpty() {
    const isSearch = this._mode === 'search';
    return `
      <div class="empty">
        <div class="empty-icon">${isSearch
          ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#3ba8c4" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#3ba8c4" stroke-width="2" stroke-linecap="round"/></svg>`
          : LOGO_SVG}</div>
        <p>${isSearch
          ? 'Search across all content in your Bloomfire knowledge base. Results are ranked by semantic relevance.'
          : 'Search your Bloomfire knowledge base or ask an AI-powered question using the tabs above.'}</p>
        <span class="empty-hint">${isSearch
          ? 'Try: "homeowner claim process" or "Michigan auto requirements"'
          : 'Results are sourced from your community content only'}</span>
      </div>`;
  }

  _renderLoading() {
    return `
      <div class="skel-wrap">
        ${[1,2,3].map(() => `
          <div class="skel-card">
            <div style="display:flex;gap:10px;align-items:flex-start">
              <div class="skel" style="width:36px;height:36px;border-radius:7px;flex-shrink:0"></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:7px">
                <div style="display:flex;gap:7px">
                  <div class="skel" style="width:48px;height:18px;border-radius:3px"></div>
                  <div class="skel" style="width:55%;height:18px"></div>
                </div>
                <div class="skel" style="width:95%"></div>
                <div class="skel" style="width:80%"></div>
                <div class="skel" style="width:40%;height:10px"></div>
              </div>
            </div>
          </div>`).join('')}
      </div>`;
  }

  _renderResults() {
    const isSynapse = this._mode === 'synapse';
    let html = '';

    if (this._aiAnswer) {
      if (isSynapse && this._showThinking && this._thinking) {
        html += `
          <div class="thinking-block">
            <button class="thinking-toggle ${this._thinkingOpen ? 'open' : ''}" id="te">
              ${iconSparkle(BF.textSecond)} Thinking process
              <span class="chev">${iconChevron}</span>
            </button>
            <div class="thinking-body ${this._thinkingOpen ? 'visible' : ''}" id="tb">
              ${this._thinking}
            </div>
          </div>`;
      }

      let answerHtml = this._aiAnswer;
      if (isSynapse) {
        answerHtml = this._aiAnswer
          .replace(/^## (.+)$/m, '<h2>$1</h2>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .split('\n\n').map(p => p.startsWith('<') ? p : `<p>${p}</p>`).join('');
      }

      html += `
        <div class="ai-block">
          <div class="ai-label">
            ${isSynapse ? iconLightning : iconSparkle()}
            ${isSynapse ? 'Synapse Response' : 'AI Answer'}
          </div>
          <div class="ai-text ${isSynapse ? 'synapse-answer' : ''}">${answerHtml}</div>
        </div>`;
    }

    if (this._results && this._results.length > 0) {
      const typeClass = { Series: 'type-series', Post: 'type-post', 'Q&A': 'type-qa' };
      html += `
        <div class="results-section">
          <div class="results-header">
            <div class="results-label">
              ${iconSearch.replace('stroke="white"', 'stroke="#8fa3b1"').replace(/stroke-width="2\.2"/g, 'stroke-width="2"')}
              Search Results
            </div>
            <span class="results-count">${this._results.length} articles found</span>
          </div>
          ${this._results.map(r => `
            <a class="result-card" href="https://app.bloomfire.com/posts/${r.id}" target="_blank">
              <div class="result-icon">${getTypeIcon(r.type)}</div>
              <div class="result-body">
                <div class="result-top">
                  <span class="result-type ${typeClass[r.type] || 'type-post'}">${r.type}</span>
                  <span class="result-title">${r.title}</span>
                </div>
                <div class="result-snippet">${r.snippet}</div>
                <div class="result-meta">
                  <span class="result-meta-item">${iconUser} ${r.author}</span>
                  <span class="result-meta-item">${iconCalendar} ${r.date}</span>
                </div>
              </div>
              <div class="result-ext">${iconExternal}</div>
            </a>`).join('')}
        </div>`;
    }

    return html || this._renderEmpty();
  }

  // ── Search mode layout ────────────────────────────────────────────────────────
  _renderSearchMode() {
    const allResults  = this._searchResults || [];
    const filter      = this._searchFilter;
    const filtered    = filter === 'all' ? allResults : allResults.filter(r => r.type === filter);
    const related     = getRelatedSearches(this._lastQuery);
    const typeClass   = { Series: 'type-series', Post: 'type-post', 'Q&A': 'type-qa' };

    const counts = { all: allResults.length };
    allResults.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
    const filters = ['all', 'Post', 'Series', 'Q&A'];

    const filterBar = `
      <div class="search-filter-bar">
        <span class="filter-label">Filter</span>
        ${filters.map(f => {
          const label = f === 'all' ? `All (${counts.all || 0})` : `${f}${counts[f] ? ` (${counts[f]})` : ''}`;
          const disabled = f !== 'all' && !counts[f];
          return `<button class="filter-chip ${filter === f ? 'active' : ''} ${disabled ? '' : ''}"
            data-filter="${f}" ${disabled ? 'disabled style="opacity:0.4;cursor:default"' : ''}>${label}</button>`;
        }).join('')}
      </div>`;

    const resultsHeader = `
      <div class="search-results-header">
        <span class="sr-count"><strong>${filtered.length}</strong> results for "${this._lastQuery}"</span>
        <span class="semantic-badge">
          ${iconSparkle()} Semantic search
        </span>
      </div>`;

    const resultCards = filtered.map(r => {
      const scoreClass = r.score >= 90 ? 'result-score-high' : r.score >= 75 ? 'result-score-mid' : 'result-score-low';
      const tagPills = (r.tags || []).slice(0, 3).map(t => `<span class="result-tag">${t}</span>`).join('');
      return `
        <a class="result-card" href="https://app.bloomfire.com/posts/${r.id}" target="_blank">
          <div class="result-icon">${getTypeIcon(r.type)}</div>
          <div class="result-body">
            <div class="result-top">
              <span class="result-type ${typeClass[r.type] || 'type-post'}">${r.type}</span>
              <span class="result-title">${r.title}</span>
            </div>
            <div class="result-snippet">${r.snippet}</div>
            <div class="${scoreClass} result-score-wrap">
              <div class="result-score-bar-bg"><div class="result-score-bar" style="width:${r.score}%"></div></div>
              <span class="result-score-label">${r.score}% match</span>
            </div>
            <div class="result-tags">${tagPills}</div>
            <div class="result-meta" style="margin-top:5px">
              <span class="result-meta-item">${iconUser} ${r.author}</span>
              <span class="result-meta-item">${iconCalendar} ${r.date}</span>
              <span class="result-meta-item" style="margin-left:auto">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#8fa3b1" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="#8fa3b1" stroke-width="1.8"/></svg>
                ${r.views.toLocaleString()}
              </span>
            </div>
          </div>
          <div class="result-ext">${iconExternal}</div>
        </a>`;
    }).join('');

    const relatedSection = `
      <div class="related-wrap">
        <div class="related-label">Related searches</div>
        <div class="related-chips">
          ${related.map(q => `<span class="related-chip" data-related="${q}">${q}</span>`).join('')}
        </div>
      </div>`;

    return `
      <div class="search-wrap">
        <div class="search-row">
          <input class="search-input" id="q" type="text"
            value="${this._lastQuery}" placeholder="Search Bloomfire knowledge base..." autocomplete="off"/>
          <button class="search-btn" id="btn">${iconSearch} Search</button>
        </div>
      </div>
      ${filterBar}
      <div class="results" id="res" style="overflow-y:auto;max-height:480px;">
        ${resultsHeader}
        <div class="results-section" style="padding-top:10px;">
          ${filtered.length ? resultCards : `<div class="empty" style="padding:24px"><p>No ${filter} results for this query.</p></div>`}
        </div>
        ${relatedSection}
      </div>
    `;
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  _bind() {
    const sr = this.shadowRoot;

    // Tab switching
    sr.querySelectorAll('.tab').forEach(t =>
      t.addEventListener('click', () => {
        this._results = null; this._aiAnswer = null;
        this._loading = false; this._conversation = [];
        this._searchResults = null; this._searchFilter = 'all';
        this.setAttribute('mode', t.dataset.mode);
      })
    );

    // Initial search
    const btn = sr.getElementById('btn');
    const inp = sr.getElementById('q');
    if (btn && inp) {
      btn.addEventListener('click', () => this._search(inp.value));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._search(inp.value); });
    }

    // Mode pills — mutually exclusive
    const ip = sr.getElementById('ip');
    if (ip) {
      ip.addEventListener('click', () => {
        if (this._showThinking) {
          this._showThinking = false;
          const q = this._lastQuery;
          this.render(); this._bind();
          const i = this.shadowRoot.getElementById('q');
          if (i && q) i.value = q;
        }
      });
    }
    const tp = sr.getElementById('tp');
    if (tp) {
      tp.addEventListener('click', () => {
        if (!this._showThinking) {
          this._showThinking = true;
          const q = this._lastQuery;
          this.render(); this._bind();
          const i = this.shadowRoot.getElementById('q');
          if (i && q) i.value = q;
        }
      });
    }

    // Thinking expand/collapse (one-shot mode)
    const te = sr.getElementById('te');
    if (te) {
      te.addEventListener('click', () => {
        this._thinkingOpen = !this._thinkingOpen;
        te.classList.toggle('open', this._thinkingOpen);
        sr.getElementById('tb')?.classList.toggle('visible', this._thinkingOpen);
      });
    }

    // New conversation
    const convNew = sr.getElementById('conv-new');
    if (convNew) {
      convNew.addEventListener('click', () => {
        this._conversation = [];
        this._results = null; this._aiAnswer = null;
        this._loading = false; this._lastQuery = '';
        this.render(); this._bind();
      });
    }

    // Follow-up input
    const fq = sr.getElementById('fq');
    const fs = sr.getElementById('fs');
    if (fq && fs) {
      fs.addEventListener('click', () => { if (!this._loading) this._followUp(fq.value); });
      fq.addEventListener('keydown', e => { if (e.key === 'Enter' && !this._loading) this._followUp(fq.value); });
    }

    // Search mode: filter chips
    sr.querySelectorAll('.filter-chip:not([disabled])').forEach(chip =>
      chip.addEventListener('click', () => {
        this._searchFilter = chip.dataset.filter;
        this.render(); this._bind();
      })
    );

    // Search mode: related search chips
    sr.querySelectorAll('.related-chip').forEach(chip =>
      chip.addEventListener('click', () => {
        this._search(chip.dataset.related);
      })
    );

    // Auto-scroll thread to bottom after paint
    const thread = sr.getElementById('conv-thread');
    if (thread) {
      requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
    }
  }

  // ── Initial search ────────────────────────────────────────────────────────────
  _search(query) {
    if (!query?.trim()) return;
    this._lastQuery   = query.trim();
    this._loading     = true;
    this._thinkingOpen = false;

    if (this._mode === 'search') {
      this._searchResults = null;
      this._searchFilter  = 'all';
      this.render(); this._bind();
      const i = this.shadowRoot.getElementById('q');
      if (i) i.value = query;

      setTimeout(() => {
        this._searchResults = getSemanticResults(query);
        this._loading = false;
        this.render(); this._bind();
        this.dispatchEvent(new CustomEvent('bloomfire-search', {
          bubbles: true, composed: true,
          detail: { query, mode: 'search', resultCount: this._searchResults.length }
        }));
      }, 900);
      return;
    }

    if (this._mode === 'synapse') {
      // Start a fresh conversation
      this._conversation = [{ role: 'user', text: query.trim() }];
      this._results = null; this._aiAnswer = null;
      this.render(); this._bind();
    } else {
      this._results = null; this._aiAnswer = null;
      this.render(); this._bind();
      const i = this.shadowRoot.getElementById('q');
      if (i) i.value = query;
    }

    const delay = this._mode === 'synapse' ? 2000 : 1300;
    setTimeout(() => {
      const results  = getSearchResults(query);
      const aiAnswer = getAIAnswer(query, 'synapse');
      const thinking = getThinking(query);

      this._loading = false;

      if (this._mode === 'synapse') {
        this._results = results;
        this._conversation.push({
          role: 'synapse', text: aiAnswer,
          results: results.slice(0, 3), thinking
        });
        this.render(); this._bind();
      } else {
        this._results = results; this._aiAnswer = aiAnswer; this._thinking = thinking;
        this.render(); this._bind();
        const inp = this.shadowRoot.getElementById('q');
        if (inp) inp.value = query;
      }

      this.dispatchEvent(new CustomEvent('bloomfire-search', {
        bubbles: true, composed: true,
        detail: { query, mode: this._mode, resultCount: results.length }
      }));
    }, delay);
  }

  // ── Follow-up (Synapse conversation) ─────────────────────────────────────────
  _followUp(query) {
    if (!query?.trim() || this._loading) return;

    // Append user message and enter loading state
    this._conversation.push({ role: 'user', text: query.trim() });
    this._loading = true;
    this.render(); this._bind();

    setTimeout(() => {
      const responseText = getFollowUpResponse(this._lastQuery, query);
      const sources = this._results || getSearchResults(this._lastQuery);

      this._conversation.push({
        role: 'synapse', text: responseText,
        results: sources.slice(0, 3)
      });
      this._loading = false;
      this.render(); this._bind();

      this.dispatchEvent(new CustomEvent('bloomfire-search', {
        bubbles: true, composed: true,
        detail: { query, mode: this._mode, resultCount: sources.length }
      }));
    }, 1400);
  }
}

customElements.define('bloomfire-search', BloomfireSearch);
