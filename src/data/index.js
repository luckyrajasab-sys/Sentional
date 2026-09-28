// Sentinel SOC & Social Intelligence Data Layer
// Problem ID: SIH26152 - Blockchain & Cybersecurity, Social Media Analytics
// Structured mock data designed for immediate presentation and 1:1 API replacement.

export const technicalGlossary = {
  riskScore: {
    term: 'Explainable Risk Score',
    definition: 'A composite 0-100 metric calculated using weighted features: posting frequency anomaly (35%), network synchronization (25%), account age vs. activity (20%), and semantic repetition (20%).'
  },
  coordinatedBehavior: {
    term: 'Coordinated Inauthentic Behavior (CIB)',
    definition: 'A cluster of accounts synchronized to amplify specific narratives or attacks within sub-second or tight time windows, exhibiting high semantic repetition and mutual engagement.'
  },
  hashAnchoring: {
    term: 'Blockchain Hash Anchoring',
    definition: 'Cryptographic sealing of threat artifacts and intelligence reports via SHA-256 digests anchored on an immutable distributed ledger (Polygon testnet simulation) to ensure tamper-proof court/regulatory admissibility.'
  },
  botProbability: {
    term: 'Bot Probability Index',
    definition: 'Supervised ML model confidence that an account is non-human, derived from timing cadence regularity, automation signatures, follower ratio skew, and rapid retweet behavior.'
  },
  merkleProof: {
    term: 'Cryptographic Proof (SHA-256)',
    definition: 'One-way mathematical fingerprint ensuring that even a 1-character modification in raw tweet/post text or metadata renders the proof invalid.'
  }
}

// 5-Step Guided Tour Configuration
export const tourSteps = [
  {
    step: 1,
    title: 'Welcome to Sentinel SOC',
    target: 'top-kpis',
    desc: 'Sentinel detects social manipulation, bot swarms, and cyber threats in real-time. Notice the top 4 KPI cards showing instant operational metrics.',
    badge: 'Overview'
  },
  {
    step: 2,
    title: 'Live Incident Ticker',
    target: 'incident-ticker',
    desc: 'The real-time ticker streams live threats from X, Telegram, Reddit, and YouTube. Click any alert to instantly inspect the threat.',
    badge: 'Threat Triage'
  },
  {
    step: 3,
    title: 'Deep Analytics & Network Graph',
    target: 'sidebar-analyze',
    desc: 'Explore Sentiment, Trends, and the interactive Network Graph to uncover coordinated disinformation campaigns and bot amplification clusters.',
    badge: 'Analysis'
  },
  {
    step: 4,
    title: 'Investigate & Explainable AI',
    target: 'sidebar-investigate',
    desc: 'Drill into suspicious accounts to view explainable risk breakdowns with mathematical weights and manage the Alert Triage Queue.',
    badge: 'Investigation'
  },
  {
    step: 5,
    title: 'Blockchain Evidence & Audit Trail',
    target: 'sidebar-trust',
    desc: 'Every flagged threat and exported PDF report is anchored on-chain with a SHA-256 hash. Test our public hash verification tool for instant cryptographic proof.',
    badge: 'Blockchain Trust'
  }
]

// Top 4 Primary KPIs for Dashboard
export const topKpis = [
  {
    id: 'active-threats',
    label: 'Active Threats',
    value: 26,
    d: '+3 in last 2h',
    severity: 'Critical',
    drilldown: '/threats?status=Investigating',
    subtext: '4 require immediate triage'
  },
  {
    id: 'high-risk-accounts',
    label: 'High-Risk Accounts',
    value: 142,
    d: '+9 today',
    severity: 'High',
    drilldown: '/accounts?risk=High',
    subtext: '94% automated bot signal'
  },
  {
    id: 'sentiment-index',
    label: 'Sentiment Index',
    value: 68,
    unit: '% Pos',
    d: '+4.2% shift',
    severity: 'Medium',
    drilldown: '/sentiment',
    subtext: 'Net positive public confidence'
  },
  {
    id: 'verified-evidence',
    label: 'Verified Evidence',
    value: 9214,
    d: '100% on-chain',
    severity: 'Valid',
    drilldown: '/blockchain',
    subtext: 'Anchored on Polygon #1928374'
  }
]

// Live Incident Ticker Items
export const liveIncidents = [
  { id: 'INC-901', time: '1m ago', type: 'Coordinated Narrative Swarm', platform: 'X', sev: 'Critical', desc: '140+ synchronized accounts amplifying fake advisory' },
  { id: 'INC-902', time: '4m ago', type: 'Credential Phishing Wave', platform: 'Telegram', sev: 'High', desc: 'Fraudulent KYC update links targeting mobile users' },
  { id: 'INC-903', time: '8m ago', type: 'Deepfake Audio Clip', platform: 'YouTube', sev: 'High', desc: 'Synthesized voice impersonating public banking official' },
  { id: 'INC-904', time: '14m ago', type: 'Bot Astroturfing', platform: 'Reddit', sev: 'Medium', desc: 'Automated comment sentiment manipulation on r/tech_india' },
  { id: 'INC-905', time: '22m ago', type: 'Suspicious Domain Spreading', platform: 'X', sev: 'Medium', desc: 'Unregistered domain masked via URL shorteners' },
  { id: 'INC-906', time: '35m ago', type: 'Impersonation Profile', platform: 'X', sev: 'Low', desc: 'Cloned avatar imitating government press release handle' }
]

// Comprehensive Threats Dataset with Full Triage Workflow
export const initialThreats = [
  {
    id: 'THR-2041',
    type: 'Coordinated Campaign',
    sev: 'Critical',
    platform: 'X',
    conf: 94,
    accounts: 214,
    status: 'Investigating',
    assignee: 'Sarah Chen (Senior Analyst)',
    time: '12m ago',
    timestamp: '2026-09-28 09:41 UTC',
    hash: '0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73bcde912448371239aa804c1e',
    block: 1928374,
    caseId: 'CASE-2026-09',
    summary: 'Synchronized astroturfing network spreading fabricated digital identity outage panic.',
    evidenceCount: 142,
    escalated: true,
    riskFactors: [
      { name: 'Posting Velocity', score: 98, weight: '35%' },
      { name: 'Content Similarity', score: 95, weight: '30%' },
      { name: 'Timing Synchrony', score: 92, weight: '20%' },
      { name: 'Cluster Centrality', score: 89, weight: '15%' }
    ]
  },
  {
    id: 'THR-2040',
    type: 'Phishing Campaign',
    sev: 'High',
    platform: 'Telegram',
    conf: 88,
    accounts: 37,
    status: 'New',
    assignee: 'Unassigned',
    time: '34m ago',
    timestamp: '2026-09-28 09:12 UTC',
    hash: '0x41bd8821907aacd441098492019ffea829103847192837461928374619283746',
    block: 1928361,
    caseId: 'CASE-2026-09',
    summary: 'Automated Telegram broadcast bot distributing fraudulent instant KYC verification APK links.',
    evidenceCount: 48,
    escalated: false,
    riskFactors: [
      { name: 'Domain Reputation', score: 92, weight: '40%' },
      { name: 'Broadcast Rate', score: 86, weight: '30%' },
      { name: 'Account Freshness', score: 85, weight: '30%' }
    ]
  },
  {
    id: 'THR-2038',
    type: 'Misinformation Swarm',
    sev: 'High',
    platform: 'X',
    conf: 81,
    accounts: 96,
    status: 'Investigating',
    assignee: 'Alex Varma (Threat Intel)',
    time: '1h ago',
    timestamp: '2026-09-28 08:40 UTC',
    hash: '0xc2e901455d10feab781928374619283746192837461928374619283746192837',
    block: 1928340,
    caseId: 'CASE-2026-04',
    summary: 'Amplification of doctored video snippet claiming security flaw in national payments gateway.',
    evidenceCount: 96,
    escalated: false,
    riskFactors: [
      { name: 'Media Manipulation Index', score: 88, weight: '40%' },
      { name: 'Coordinated Retweet Spike', score: 79, weight: '35%' },
      { name: 'Sentiment Polarization', score: 76, weight: '25%' }
    ]
  },
  {
    id: 'THR-2035',
    type: 'Bot Network',
    sev: 'Medium',
    platform: 'Reddit',
    conf: 74,
    accounts: 58,
    status: 'New',
    assignee: 'Unassigned',
    time: '2h ago',
    timestamp: '2026-09-28 07:55 UTC',
    hash: '0x77f0ab3219082341908234190823419082341908234190823419082341908234',
    block: 1928322,
    caseId: null,
    summary: 'Network of sleeping dormant accounts activated within 10 minutes to downvote official releases.',
    evidenceCount: 29,
    escalated: false,
    riskFactors: [
      { name: 'Dormancy Awakening', score: 82, weight: '50%' },
      { name: 'Co-voting Graph Weight', score: 71, weight: '50%' }
    ]
  },
  {
    id: 'THR-2031',
    type: 'Malicious URL Ring',
    sev: 'Medium',
    platform: 'YouTube',
    conf: 69,
    accounts: 12,
    status: 'Resolved',
    assignee: 'Marcus Cole (SOC Lead)',
    time: '4h ago',
    timestamp: '2026-09-28 06:20 UTC',
    hash: '0x19c4e8f619283746192837461928374619283746192837461928374619283746',
    block: 1928290,
    caseId: 'CASE-2026-01',
    summary: 'Comment spam redirecting users to scam subscription landing page. Reported to registrar.',
    evidenceCount: 18,
    escalated: false,
    riskFactors: [
      { name: 'Blacklisted IP Host', score: 75, weight: '60%' },
      { name: 'Repetitive Text Hashes', score: 62, weight: '40%' }
    ]
  },
  {
    id: 'THR-2029',
    type: 'Impersonation Profile',
    sev: 'Low',
    platform: 'X',
    conf: 62,
    accounts: 4,
    status: 'Resolved',
    assignee: 'Sarah Chen (Senior Analyst)',
    time: '6h ago',
    timestamp: '2026-09-28 05:03 UTC',
    hash: '0x99281aef19283746192837461928374619283746192837461928374619283746',
    block: 1928260,
    caseId: null,
    summary: 'Handles mimicking public customer support. User flagged and quarantined.',
    evidenceCount: 4,
    escalated: false,
    riskFactors: [
      { name: 'Levenshtein Name Distance', score: 91, weight: '70%' },
      { name: 'Bio Keyword Copying', score: 55, weight: '30%' }
    ]
  }
]

// Accounts with Explainable Risk Breakdown
export const initialAccounts = [
  {
    handle: '@newsflash_0912',
    name: 'Flash Bharat News (Unverified)',
    platform: 'X',
    followers: 412,
    following: 3890,
    age: '12 days',
    freq: '184 posts/day',
    bot: 94,
    risk: 'High',
    status: 'Flagged',
    verified: false,
    created: 'Sep 16, 2026',
    avatar: 'N',
    hash: '0x39a01f82c91a084bc912384a8bc9812903481239847129837419283741928374',
    caseId: 'CASE-2026-09',
    signals: [
      'Extremely high posting frequency (184/day vs human median 4.2/day)',
      'Machine-cadenced timing: 98.4% posts released on exactly :00 or :30 second ticks',
      'Follows 3,890 handles with only 412 followers (follow-churn anomaly)',
      'Synchronized with seed cluster #4 within a 6-second window'
    ],
    riskBreakdown: [
      { factor: 'Posting Velocity Anomaly', weight: 0.35, score: 96, contribution: 33.6, desc: 'Burst volume of 184 posts/24h exceeds 99.8th percentile of human distribution.' },
      { factor: 'Network Synchronization', weight: 0.25, score: 94, contribution: 23.5, desc: '98% text overlap and mutual retweet within 8s of cluster origin node.' },
      { factor: 'Account Age vs Volume', weight: 0.20, score: 92, contribution: 18.4, desc: '12-day-old account with 3,890 follows and immediate politicized narrative focus.' },
      { factor: 'Semantic Repetition Index', weight: 0.20, score: 91, contribution: 18.2, desc: 'Cosine similarity of 0.89 across 48 distinct messages (templated copy-paste).' }
    ]
  },
  {
    handle: '@promo_deals_hub',
    name: 'Instant Deals & Cashback',
    platform: 'Telegram',
    followers: 1290,
    following: 2210,
    age: '41 days',
    freq: '96 posts/day',
    bot: 82,
    risk: 'High',
    status: 'Under review',
    verified: false,
    created: 'Aug 18, 2026',
    avatar: 'P',
    hash: '0x99a01f82c91a084bc912384a8bc9812903481239847129837419283741928374',
    caseId: 'CASE-2026-09',
    signals: [
      'Link-heavy posts: 94% of messages contain shortener URLs',
      'Rapid mass broadcasting across 18 public Telegram groups simultaneously',
      'Automated Telegram UserBot client signature detected'
    ],
    riskBreakdown: [
      { factor: 'URL Dispersion Risk', weight: 0.35, score: 89, contribution: 31.15, desc: '94% of broadcasts contain unindexed URL shortener redirects.' },
      { factor: 'Channel Broadcast Density', weight: 0.25, score: 84, contribution: 21.0, desc: 'Simultaneous multi-group message dispatch within 200ms.' },
      { factor: 'Account Age vs Volume', weight: 0.20, score: 78, contribution: 15.6, desc: '41-day account operating at enterprise marketing broadcast rates.' },
      { factor: 'Semantic Repetition Index', weight: 0.20, score: 74, contribution: 14.8, desc: 'Same promotional voucher template with only link parameters altered.' }
    ]
  },
  {
    handle: '@trend_pusher_77',
    name: 'India Trends Official',
    platform: 'X',
    followers: 95,
    following: 1804,
    age: '27 days',
    freq: '132 posts/day',
    bot: 88,
    risk: 'High',
    status: 'Flagged',
    verified: false,
    created: 'Sep 01, 2026',
    avatar: 'T',
    hash: '0x71a01f82c91a084bc912384a8bc9812903481239847129837419283741928374',
    caseId: 'CASE-2026-04',
    signals: [
      'Amplifies same hashtag cluster (#DigitalIdScam) over 80 times/hour',
      'Follows 1.8K accounts with only 95 followers',
      'Zero original text; 100% quoted retweets with predetermined slogans'
    ],
    riskBreakdown: [
      { factor: 'Hashtag Flood Velocity', weight: 0.35, score: 92, contribution: 32.2, desc: 'Repeatedly appends target hashtag cluster in 82 consecutive tweets.' },
      { factor: 'Original vs Echo Ratio', weight: 0.25, score: 95, contribution: 23.75, desc: 'Zero original posts; 100% pure amplification script.' },
      { factor: 'Account Age vs Volume', weight: 0.20, score: 85, contribution: 17.0, desc: '27 days old account generated over 3,200 tweets.' },
      { factor: 'Network Synchronization', weight: 0.20, score: 79, contribution: 15.8, desc: 'Re-shares posts from @newsflash_0912 within 4.1 seconds median.' }
    ]
  },
  {
    handle: '@city_updates',
    name: 'Metro Pulse Media',
    platform: 'YouTube',
    followers: 15400,
    following: 210,
    age: '2.8 yrs',
    freq: '6 posts/day',
    bot: 24,
    risk: 'Medium',
    status: 'Monitoring',
    verified: true,
    created: 'Dec 11, 2023',
    avatar: 'M',
    hash: '0x44a01f82c91a084bc912384a8bc9812903481239847129837419283741928374',
    caseId: null,
    signals: [
      'Automated RSS-to-video caption pipeline',
      'Legitimate historical tenure (2.8 years active)',
      'Mixed organic audience interaction and comment discussions'
    ],
    riskBreakdown: [
      { factor: 'Automated Posting Pipeline', weight: 0.35, score: 35, contribution: 12.25, desc: 'Uses standard scheduling tools (Hootsuite/Buffer) for news summaries.' },
      { factor: 'Audience Engagement Realism', weight: 0.25, score: 18, contribution: 4.5, desc: 'High variance in comment replies, human engagement confirmed.' },
      { factor: 'Account Age Credibility', weight: 0.20, score: 10, contribution: 2.0, desc: 'Multi-year track record without severe policy violations.' },
      { factor: 'Content Diversity', weight: 0.20, score: 26, contribution: 5.2, desc: 'Covers diverse municipal, transit, and weather updates.' }
    ]
  },
  {
    handle: '@rahul.m',
    name: 'Rahul Mishra',
    platform: 'Reddit',
    followers: 820,
    following: 190,
    age: '4.2 yrs',
    freq: '3 posts/day',
    bot: 8,
    risk: 'Low',
    status: 'Normal',
    verified: true,
    created: 'Jul 04, 2022',
    avatar: 'R',
    hash: '0x12a01f82c91a084bc912384a8bc9812903481239847129837419283741928374',
    caseId: null,
    signals: [
      'Organic interaction pattern across varied subreddits',
      'Normal human typing cadences with varied post lengths',
      'Verified email and verified account credentials'
    ],
    riskBreakdown: [
      { factor: 'Posting Variance', weight: 0.35, score: 8, contribution: 2.8, desc: 'Natural Poisson distribution of post timing reflecting day/night human sleep.' },
      { factor: 'Network Diversity', weight: 0.25, score: 6, contribution: 1.5, desc: 'Interacts across gaming, sports, civic, and technology subreddits.' },
      { factor: 'Account Longevity', weight: 0.20, score: 5, contribution: 1.0, desc: '4.2 years continuous organic karma history.' },
      { factor: 'Text Uniqueness', weight: 0.20, score: 12, contribution: 2.4, desc: 'High linguistic variety with nuanced personal perspectives.' }
    ]
  }
]

// Coordinated Campaigns Dataset (For Coordinated Campaign Detection view)
export const coordinatedCampaigns = [
  {
    id: 'CAMP-2026-ALPHA',
    name: 'Operation Disinfo Flood (Digital Identity)',
    targetNarrative: '#DigitalIdScam & Fabricated System Outage',
    severity: 'Critical',
    accountCount: 142,
    similarityScore: 94.6,
    timeDeltaSeconds: 8.4,
    status: 'Active',
    seedAccount: '@newsflash_0912',
    firstDetected: '2026-09-28 07:15 UTC',
    burstTimeline: [
      { time: '07:15', syncPosts: 4, organic: 12 },
      { time: '07:30', syncPosts: 28, organic: 16 },
      { time: '07:45', syncPosts: 84, organic: 21 },
      { time: '08:00', syncPosts: 142, organic: 29 },
      { time: '08:15', syncPosts: 110, organic: 24 },
      { time: '08:30', syncPosts: 65, organic: 18 }
    ],
    topAccounts: [
      { handle: '@newsflash_0912', role: 'Seed Injector', delay: '0.0s', sim: '100%' },
      { handle: '@trend_pusher_77', role: 'Amplifier Node', delay: '+3.8s', sim: '96.2%' },
      { handle: '@alert_india_bot3', role: 'Echo Node', delay: '+6.1s', sim: '94.8%' },
      { handle: '@fast_news_relay', role: 'Echo Node', delay: '+7.4s', sim: '93.5%' },
      { handle: '@daily_wire_in', role: 'Retweet Swarm', delay: '+8.9s', sim: '91.2%' }
    ],
    samplePayload: '"URGENT: All digital identity verification services have experienced a silent nationwide breach. Revoke access immediately via link..."'
  },
  {
    id: 'CAMP-2026-BETA',
    name: 'UPI KYC Phishing Swarm',
    targetNarrative: 'Expiring KYC Warning with Malicious Domain',
    severity: 'High',
    accountCount: 37,
    similarityScore: 91.2,
    timeDeltaSeconds: 12.0,
    status: 'Under Triage',
    seedAccount: '@promo_deals_hub',
    firstDetected: '2026-09-28 08:30 UTC',
    burstTimeline: [
      { time: '08:30', syncPosts: 6, organic: 8 },
      { time: '08:45', syncPosts: 22, organic: 10 },
      { time: '09:00', syncPosts: 37, organic: 14 },
      { time: '09:15', syncPosts: 31, organic: 11 }
    ],
    topAccounts: [
      { handle: '@promo_deals_hub', role: 'Channel Broadcaster', delay: '0.0s', sim: '100%' },
      { handle: '@deals_bot_99', role: 'Forwarder', delay: '+5.2s', sim: '95.1%' },
      { handle: '@instant_kyc_help', role: 'Impersonator', delay: '+11.8s', sim: '89.4%' }
    ],
    samplePayload: '"Attention: Your banking UPI wallet will be blocked within 24 hours due to pending KYC regulation. Complete re-verification here: bit.ly/kyc-portal-sec"'
  }
]

// Case Management Dataset
export const initialCases = [
  {
    id: 'CASE-2026-09',
    title: 'Operation BioPhish: Coordinated Disinformation & Fraud Wave',
    priority: 'Critical',
    status: 'Active',
    owner: 'Sarah Chen (Senior Analyst)',
    createdAt: '2026-09-28 07:30 UTC',
    summary: 'Multi-platform coordinated disinformation push utilizing bot swarms on X and phishing links on Telegram to deceive citizens regarding digital authentication protocols.',
    threatIds: ['THR-2041', 'THR-2040'],
    accountHandles: ['@newsflash_0912', '@promo_deals_hub', '@trend_pusher_77'],
    evidenceHashes: [
      '0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73bcde912448371239aa804c1e',
      '0x41bd8821907aacd441098492019ffea829103847192837461928374619283746'
    ],
    notes: [
      { id: 'N-1', author: 'Sarah Chen', time: '2026-09-28 07:45 UTC', text: 'Identified seed post from @newsflash_0912. Cosine similarity with 42 replies is above 94%.' },
      { id: 'N-2', author: 'Alex Varma', time: '2026-09-28 08:15 UTC', text: 'Anchored 142 tweet payload hashes to Polygon Block #1928374. Initiated takedown report for CERT-In.' },
      { id: 'N-3', author: 'Marcus Cole', time: '2026-09-28 09:20 UTC', text: 'Telegram phishing channel reported to platform trust and safety team.' }
    ]
  },
  {
    id: 'CASE-2026-04',
    title: 'Swarm Alpha: State Elections Deepfake & Audio Synthesis',
    priority: 'High',
    status: 'In Review',
    owner: 'Alex Varma (Threat Intel)',
    createdAt: '2026-09-27 14:10 UTC',
    summary: 'Doctored audio snippets of election commission press briefings disseminated across Reddit and X.',
    threatIds: ['THR-2038'],
    accountHandles: ['@trend_pusher_77'],
    evidenceHashes: [
      '0xc2e901455d10feab781928374619283746192837461928374619283746192837'
    ],
    notes: [
      { id: 'N-4', author: 'Alex Varma', time: '2026-09-27 15:30 UTC', text: 'Spectral acoustic analysis confirms synthetic voice cloning artifacts.' }
    ]
  }
]

// Immutable Audit Trail Dataset
export const initialAuditTrail = [
  {
    id: 'AUD-1049',
    timestamp: '2026-09-28 09:42:15 UTC',
    user: 'Sarah Chen',
    role: 'Analyst',
    action: 'ESCALATE_THREAT',
    target: 'Threat THR-2041 (Coordinated Campaign)',
    ip: '10.240.14.82',
    hash: '0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73bcde912448371239aa804c1e'
  },
  {
    id: 'AUD-1048',
    timestamp: '2026-09-28 09:31:04 UTC',
    user: 'Alex Varma',
    role: 'Analyst',
    action: 'ANCHOR_EVIDENCE',
    target: 'Polygon Block #1928374 Sealed',
    ip: '10.240.14.89',
    hash: '0x41bd8821907aacd441098492019ffea829103847192837461928374619283746'
  },
  {
    id: 'AUD-1047',
    timestamp: '2026-09-28 09:15:40 UTC',
    user: 'Sarah Chen',
    role: 'Analyst',
    action: 'ADD_TO_CASE',
    target: 'Attached @newsflash_0912 to CASE-2026-09',
    ip: '10.240.14.82',
    hash: '0x39a01f82c91a084bc912384a8bc9812903481239847129837419283741928374'
  },
  {
    id: 'AUD-1046',
    timestamp: '2026-09-28 08:50:12 UTC',
    user: 'Marcus Cole',
    role: 'Admin',
    action: 'EXPORT_REPORT',
    target: 'Case Evidence Brief CASE-2026-09.pdf',
    ip: '10.240.10.04',
    hash: '0xc2e901455d10feab781928374619283746192837461928374619283746192837'
  },
  {
    id: 'AUD-1045',
    timestamp: '2026-09-28 08:12:33 UTC',
    user: 'System Bot Sentinel-01',
    role: 'System',
    action: 'AUTO_DETECT_CLUSTER',
    target: 'Identified 142 coordinated nodes (CAMP-2026-ALPHA)',
    ip: '127.0.0.1 (Internal Agent)',
    hash: '0x77f0ab3219082341908234190823419082341908234190823419082341908234'
  }
]

// Blockchain Ledger Dataset
export const chain = [
  {
    hash: '0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73bcde912448371239aa804c1e',
    event: 'Evidence Batch Sealed',
    ts: '2026-09-28 09:42 UTC',
    block: 1928374,
    status: 'Valid',
    gasUsed: '42,109 Gwei',
    contract: '0x71b...882e (SentinelEvidenceStore.sol)',
    merkleRoot: '0xd3f89a...2041',
    verified: true,
    item: 'THR-2041 Coordinated Campaign (142 Items)'
  },
  {
    hash: '0x41bd8821907aacd441098492019ffea829103847192837461928374619283746',
    event: 'Phishing Signature Anchored',
    ts: '2026-09-28 09:31 UTC',
    block: 1928361,
    status: 'Valid',
    gasUsed: '38,400 Gwei',
    contract: '0x71b...882e (SentinelEvidenceStore.sol)',
    merkleRoot: '0xa144bb...2040',
    verified: true,
    item: 'THR-2040 Telegram Malicious Domain'
  },
  {
    hash: '0xc2e901455d10feab781928374619283746192837461928374619283746192837',
    event: 'Threat Report Sealed',
    ts: '2026-09-28 09:05 UTC',
    block: 1928340,
    status: 'Valid',
    gasUsed: '51,200 Gwei',
    contract: '0x71b...882e (SentinelEvidenceStore.sol)',
    merkleRoot: '0x88fe11...2038',
    verified: true,
    item: 'Case CASE-2026-04 Audit Signature'
  },
  {
    hash: '0x77f0ab3219082341908234190823419082341908234190823419082341908234',
    event: 'Account Cluster Quarantined',
    ts: '2026-09-28 08:48 UTC',
    block: 1928322,
    status: 'Pending',
    gasUsed: 'Pending Confirmation',
    contract: '0x71b...882e (SentinelEvidenceStore.sol)',
    merkleRoot: '0xpending...322',
    verified: false,
    item: 'Cluster Alpha 58 Account Profiles'
  },
  {
    hash: '0x19c4e8f619283746192837461928374619283746192837461928374619283746',
    event: 'SOC Audit Event Anchored',
    ts: '2026-09-28 08:10 UTC',
    block: 1928290,
    status: 'Valid',
    gasUsed: '29,800 Gwei',
    contract: '0x71b...882e (SentinelEvidenceStore.sol)',
    merkleRoot: '0x55aa33...290',
    verified: true,
    item: 'Audit Log Checkpoint #1040-1044'
  }
]

// Timeline & Analytics Data
export const timeline = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((t, i) => ({
  t,
  pos: 54 + ((i * 7) % 18),
  neu: 28 + ((i * 5) % 10),
  neg: 14 + ((i * 4) % 12),
  vol: 1100 + ((i * 410) % 950),
  threats: [1, 0, 2, 5, 8, 4, 3, 6, 7, 2, 1, 0][i]
}))

export const platforms = [
  { name: 'X', value: 44, color: '#06b6d4' },
  { name: 'Reddit', value: 22, color: '#3b82f6' },
  { name: 'YouTube', value: 16, color: '#f59e0b' },
  { name: 'Telegram', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 6, color: '#64748b' }
]

export const sentiment = [
  { name: 'Positive', value: 64, color: '#06b6d4' },
  { name: 'Neutral', value: 24, color: '#64748b' },
  { name: 'Negative', value: 12, color: '#ef4444' }
]

export const emotions = [
  { e: 'Public Trust', v: 76, color: '#06b6d4' },
  { e: 'Curiosity / Interest', v: 62, color: '#3b82f6' },
  { e: 'Security Concern', v: 38, color: '#f59e0b' },
  { e: 'Frustration / Anger', v: 22, color: '#ef4444' },
  { e: 'Confusion', v: 19, color: '#a855f7' }
]

export const posts = [
  { id: 1, user: '@civic_analyst', platform: 'X', text: 'New digital identity verification gateway enrollment took under 90 seconds. Biometric deduplication works reliably.', s: 'Positive', t: '4m ago', reach: '14.2K', risk: 'Low' },
  { id: 2, user: '@dataprivacy_now', platform: 'Reddit', text: 'Concerned about how biometric salt hashes are distributed across edge nodes under the updated framework.', s: 'Negative', t: '11m ago', reach: '8.4K', risk: 'Medium' },
  { id: 3, user: '@techwatch_in', platform: 'YouTube', text: 'Explainer: How decentralized zero-knowledge verification eliminates document forgery without exposing raw Aadhaar numbers.', s: 'Positive', t: '19m ago', reach: '42.1K', risk: 'Low' },
  { id: 4, user: '@newsflash_0912', platform: 'X', text: 'EMERGENCY ALERT: Major server compromise in identity portal. All citizen profiles leaking. Transfer funds now bit.ly/urgent-portal', s: 'Negative', t: '22m ago', reach: '29.8K', risk: 'Critical' },
  { id: 5, user: '@cyber_sentinel_in', platform: 'X', text: 'Warning: Fake alert circulating regarding identity breach is false. Authentic CERT advisory confirms zero unauthorized access.', s: 'Positive', t: '28m ago', reach: '18.9K', risk: 'Low' }
]

export const trends = [
  { topic: 'Digital Identity Framework', mentions: 34210, velocity: 184, acc: 'High', sentiment: 'Positive', platform: 'X' },
  { topic: '#CyberSafeIndia', mentions: 24870, velocity: 112, acc: 'High', sentiment: 'Positive', platform: 'X' },
  { topic: 'UPI KYC Fraud Alert', mentions: 18402, velocity: 88, acc: 'Medium', sentiment: 'Negative', platform: 'Telegram' },
  { topic: 'Zero Knowledge Proofs', mentions: 14120, velocity: 64, acc: 'Medium', sentiment: 'Positive', platform: 'Reddit' },
  { topic: 'Deepfake Voice Cloning', mentions: 13944, velocity: 143, acc: 'High', sentiment: 'Negative', platform: 'YouTube' },
  { topic: 'Smart City Sensor Grid', mentions: 9120, velocity: 26, acc: 'Low', sentiment: 'Neutral', platform: 'X' }
]

export const keywords = ['aadhaar', 'consent', 'biometric', 'wallet', 'verification', 'privacy', 'KYC', 'zero-knowledge', 'phishing', 'bot-swarm']

// Graph Nodes & Edges (Interactive Coordinated Network)
export const nodes = [
  { id: 'a', label: '@newsflash_0912', type: 'user', x: 210, y: 130, risk: 'Critical', c: 214, cluster: 'Campaign Alpha', bot: 94 },
  { id: 'b', label: '@trend_pusher_77', type: 'user', x: 340, y: 90, risk: 'High', c: 180, cluster: 'Campaign Alpha', bot: 88 },
  { id: 'c', label: '#DigitalIdScam', type: 'topic', x: 310, y: 220, risk: 'High', c: 420, cluster: 'Campaign Alpha', bot: 0 },
  { id: 'd', label: 'Media Watchdesk', type: 'organization', x: 480, y: 160, risk: 'Low', c: 310, cluster: 'Organic', bot: 4 },
  { id: 'e', label: '@civic_analyst', type: 'user', x: 570, y: 90, risk: 'Low', c: 95, cluster: 'Organic', bot: 6 },
  { id: 'f', label: 'Post #88213 (Disinfo)', type: 'post', x: 420, y: 310, risk: 'Critical', c: 160, cluster: 'Campaign Alpha', bot: 0 },
  { id: 'g', label: '@rahul.m', type: 'user', x: 130, y: 270, risk: 'Low', c: 40, cluster: 'Organic', bot: 8 },
  { id: 'h', label: '@alert_india_bot3', type: 'user', x: 190, y: 60, risk: 'High', c: 145, cluster: 'Campaign Alpha', bot: 91 },
  { id: 'i', label: '@fast_news_relay', type: 'user', x: 380, y: 40, risk: 'High', c: 120, cluster: 'Campaign Alpha', bot: 89 }
]

export const edges = [
  ['a', 'b', 'coordinates with', 0.94],
  ['a', 'c', 'injects hashtag', 0.98],
  ['b', 'c', 'amplifies', 0.96],
  ['h', 'a', 'retweets seed', 0.95],
  ['i', 'b', 'mirrors text', 0.92],
  ['c', 'd', 'monitored by', 0.40],
  ['d', 'e', 'verifies', 0.20],
  ['c', 'f', 'links artifact', 0.85],
  ['f', 'a', 'authored by', 0.99],
  ['g', 'c', 'debunks', 0.15]
]

export const regions = [
  { n: 'Delhi NCR', x: 38, y: 30, d: 95, s: 'High Alert', threats: 14, sentiment: 'Neutral' },
  { n: 'Mumbai', x: 24, y: 55, d: 105, s: 'Active Phish', threats: 18, sentiment: 'Positive' },
  { n: 'Bengaluru', x: 36, y: 78, d: 90, s: 'Normal', threats: 4, sentiment: 'Positive' },
  { n: 'Chennai', x: 48, y: 80, d: 75, s: 'Normal', threats: 2, sentiment: 'Positive' },
  { n: 'Kolkata', x: 64, y: 46, d: 80, s: 'Bot Swarm', threats: 8, sentiment: 'Negative' },
  { n: 'Hyderabad', x: 42, y: 66, d: 65, s: 'Normal', threats: 3, sentiment: 'Neutral' }
]

export const notifications = [
  { id: 1, t: 'Coordinated campaign detected on X (#DigitalIdScam)', time: '2m', sev: 'Critical', link: '/threats?id=THR-2041' },
  { id: 2, t: '142 Evidence items anchored on Polygon Block #1928374', time: '14m', sev: 'Valid', link: '/blockchain' },
  { id: 3, t: 'Bot cluster probability reached 94% (@newsflash_0912)', time: '27m', sev: 'High', link: '/accounts?handle=@newsflash_0912' },
  { id: 4, t: 'New high-priority Case opened: Operation BioPhish', time: '1h', sev: 'High', link: '/cases' }
]

// Backwards-compatibility aliases
export const threats = initialThreats
export const accounts = initialAccounts
export const kpis = topKpis

