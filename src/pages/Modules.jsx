import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar as RBar
} from 'recharts'
import {
  Smile,
  TrendingUp,
  Globe,
  FileText,
  ArrowRight,
  Filter,
  Sparkles,
  ShieldAlert,
  Download,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react'
import {
  PageHead,
  ChartCard,
  DataTable,
  SeverityBadge,
  Drawer,
  FilterBar,
  Bar,
  Tooltip,
  StatCard
} from '../components/ui'
import {
  sentiment,
  emotions,
  posts,
  timeline,
  trends,
  keywords,
  regions
} from '../data'

// Re-export dedicated upgraded pages for backward compatibility
export { default as Threats } from './Threats'
export { default as Accounts } from './Accounts'
export { default as Network } from './Network'
export { Verification } from './Verification'
export { default as Blockchain } from './Blockchain'
export { Cases } from './Cases'
export { default as AuditTrail } from './AuditTrail'

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#0f1218',
    borderColor: '#1e2430',
    borderRadius: '8px',
    fontSize: '12px'
  }
}
const axisStyle = { stroke: '#64748b', fontSize: 11, tickLine: false }

// 1. SENTIMENT INTELLIGENCE PAGE
export function Sentiment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const filterPlatform = searchParams.get('platform') || ''
  const searchQ = searchParams.get('q') || ''

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filterPlatform && filterPlatform !== 'All Platforms' && p.platform !== filterPlatform) return false
      if (searchQ && !p.text.toLowerCase().includes(searchQ.toLowerCase()) && !p.user.toLowerCase().includes(searchQ.toLowerCase())) return false
      return true
    })
  }, [filterPlatform, searchQ])

  return (
    <div className="space-y-6">
      <PageHead
        title="Sentiment & Discourse Intelligence"
        sub="Perception Analytics"
        subtitle="Analyze public opinion polarity, emotion valence distribution, and polarized discourse signals across digital channels (Problem ID: SIH26152)."
        badge={<Tooltip termKey="riskScore" />}
      >
        <button
          type="button"
          onClick={() => navigate('/trends')}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>Narrative Trends</span>
          <ArrowRight size={13} />
        </button>
      </PageHead>

      <FilterBar
        searchPlaceholder="Filter posts by keyword or author..."
        filters={[
          {
            key: 'platform',
            label: 'Platform',
            options: ['All Platforms', 'X', 'Reddit', 'YouTube', 'Telegram']
          },
          {
            key: 'range',
            label: 'Time Range',
            options: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Overall Sentiment Distribution"
          subtitle="Aggregated multi-platform NLP classifier output"
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={sentiment} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {sentiment.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <RechartsTooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs mt-2">
              {sentiment.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-300">{s.name}</span>
                  <span className="font-mono text-muted">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Sentiment Velocity Timeline"
          subtitle="Net positive vs negative opinion divergence across 24h"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="t" {...axisStyle} />
              <YAxis {...axisStyle} />
              <RechartsTooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="pos" name="Positive" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="neg" name="Negative" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Emotion Valence Breakdown */}
        <div className="card p-5 space-y-3">
          <div className="label text-muted">Emotion Valence Spectrum</div>
          <p className="text-xs text-muted">
            Secondary psychological emotion tags derived from transformer embeddings.
          </p>
          <div className="space-y-3 pt-2">
            {emotions.map((e) => (
              <div key={e.e} className="text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-200">{e.e}</span>
                  <span className="font-mono text-muted">{e.v}%</span>
                </div>
                <Bar v={e.v} color={e.v > 50 ? 'bg-accent' : 'bg-line-light'} />
              </div>
            ))}
          </div>
        </div>

        {/* Sample Monitored Posts */}
        <div className="card p-5 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="label text-muted">Representative Monitored Discourse</div>
            <span className="text-xs text-muted">({filteredPosts.length} posts)</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {filteredPosts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg border border-line bg-panel-light/30 text-xs space-y-1.5 hover:border-line-light transition-colors"
              >
                <div className="flex items-center justify-between text-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white font-mono">{p.user}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-line">{p.platform}</span>
                    <span className="text-[10px] text-muted">{p.t}</span>
                  </div>
                  <SeverityBadge size="xs">
                    {p.risk === 'Critical' ? 'Critical' : p.s === 'Positive' ? 'Valid' : p.risk}
                  </SeverityBadge>
                </div>
                <p className="text-slate-200 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. EMERGING TRENDS & VELOCITY PAGE
export function Trends() {
  const navigate = useNavigate()
  const topTrend = trends[0]

  const cols = [
    {
      k: 'topic',
      h: 'Trending Narrative / Topic',
      r: (r) => (
        <div>
          <div className="font-semibold text-white">{r.topic}</div>
          <div className="text-[10px] text-muted">Platform: {r.platform}</div>
        </div>
      )
    },
    {
      k: 'mentions',
      h: '24h Mentions',
      r: (r) => <span className="font-mono text-white font-bold">{r.mentions.toLocaleString()}</span>
    },
    {
      k: 'velocity',
      h: 'Hourly Velocity',
      r: (r) => <span className="font-mono text-accent font-semibold">+{r.velocity}%</span>
    },
    {
      k: 'acc',
      h: 'Acceleration Risk',
      r: (r) => <SeverityBadge size="xs">{r.acc === 'High' ? 'High' : r.acc === 'Medium' ? 'Medium' : 'Low'}</SeverityBadge>
    },
    {
      k: 'action',
      h: 'Investigation',
      sortable: false,
      r: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/threats?q=${encodeURIComponent(r.topic)}`)
          }}
          className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
        >
          <span>Find Threats</span>
          <ArrowRight size={11} />
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHead
        title="Emerging Trends & Narrative Acceleration"
        sub="Early Warning Disinformation Radar"
        subtitle="Monitor narrative velocity, sudden volume spikes, and hashtag acceleration before coordinated campaigns turn viral (Problem ID: SIH26152)."
      >
        <button
          type="button"
          onClick={() => navigate('/network')}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>Inspect Network Clusters</span>
          <ArrowRight size={13} />
        </button>
      </PageHead>

      {/* Top Emerging Narrative Hero Banner */}
      <div className="card p-6 border-accent/40 bg-gradient-to-r from-panel via-panel-light to-panel">
        <div className="label text-accent flex items-center gap-1.5">
          <Sparkles size={13} />
          <span>Primary Narrative on Watch</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          {topTrend.topic}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-line">
          <div>
            <div className="text-xs text-muted">Viral Velocity</div>
            <div className="text-2xl font-mono font-bold text-accent mt-0.5">+{topTrend.velocity}%</div>
          </div>
          <div>
            <div className="text-xs text-muted">Discourse Mentions</div>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">{topTrend.mentions.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted">Acceleration Threat</div>
            <div className="mt-1">
              <SeverityBadge size="sm">{topTrend.acc}</SeverityBadge>
            </div>
          </div>
        </div>

        {/* Associated keywords */}
        <div className="mt-4 pt-3 border-t border-line/60">
          <span className="text-xs text-muted block mb-2 font-medium">Correlated NLP Keywords:</span>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map(k => (
              <span key={k} className="px-2.5 py-1 text-xs rounded-md bg-bg border border-line text-slate-300 font-mono">
                #{k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Velocity Chart & Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Narrative Hourly Velocity Comparison (%)"
          subtitle="Rate of mention growth compared to previous 4-hour baseline"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="topic" {...axisStyle} />
              <YAxis {...axisStyle} />
              <RechartsTooltip {...chartTooltipStyle} />
              <RBar dataKey="velocity" name="Velocity %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <DataTable
          cols={cols}
          rows={trends}
          onRow={(r) => navigate(`/threats?q=${encodeURIComponent(r.topic)}`)}
          emptyTitle="No trends found"
        />
      </div>
    </div>
  )
}

// 3. GEO INTELLIGENCE ACTIVITY MAP PAGE
export function GeoMap() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHead
        title="Geographic Intelligence & Regional Threat Dispersion"
        sub="Spatial Telemetry"
        subtitle="Track localized bot clusters, regional phishing dispersion, and civic sentiment anomalies across major Indian urban and state zones (Problem ID: SIH26152)."
      >
        <button
          type="button"
          onClick={() => navigate('/threats')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <ShieldAlert size={14} className="text-red-400" />
          <span>Active Threat Queue</span>
        </button>
      </PageHead>

      <div className="card p-5 relative min-h-[480px] bg-panel-light/20 cyber-grid overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between z-10">
          <div className="label text-muted">Geographic Threat Nodes (Interactive - Click point)</div>
          <span className="text-[11px] font-mono text-cyan-400">Regional Coverage: India Sovereign SOC</span>
        </div>

        {/* Schematic Interactive Map Canvas */}
        <div className="relative w-full h-[380px] my-4">
          {regions.map((r) => (
            <div
              key={r.n}
              onClick={() => setSelectedRegion(r)}
              className="absolute group cursor-pointer"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            >
              {/* Radar pulse */}
              <span
                className="block rounded-full bg-accent/25 border border-accent animate-ping absolute -inset-2"
              />
              <span
                className="block rounded-full bg-accent border-2 border-white shadow-glow-cyan relative z-10"
                style={{ width: 14, height: 14 }}
              />

              {/* Label card */}
              <div className="absolute left-4 -top-2 bg-panel/90 border border-line rounded px-2.5 py-1 text-xs whitespace-nowrap shadow-xl z-20 group-hover:border-accent group-hover:scale-105 transition-all">
                <div className="font-semibold text-white">{r.n}</div>
                <div className="text-[10px] text-muted flex items-center gap-1.5">
                  <span className="text-red-400 font-mono">{r.threats} threats</span>
                  <span>• {r.s}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-line z-10">
          <span>Schematic cyber operations view • Connects to Leaflet/MapLibre tiles in production</span>
          <span className="font-mono text-emerald-400">All 6 Regional Sensors Active</span>
        </div>
      </div>

      {/* Region Drawer */}
      <Drawer
        open={!!selectedRegion}
        onClose={() => setSelectedRegion(null)}
        title={selectedRegion ? `${selectedRegion.n} Region` : ''}
        subtitle="Regional Threat & Sentiment Telemetry"
      >
        {selectedRegion && (
          <div className="space-y-4 text-xs">
            <div className="card p-4 space-y-2 bg-panel-light/30">
              <div className="flex justify-between items-center">
                <span className="label text-muted">Regional Threat Level</span>
                <SeverityBadge size="xs">
                  {selectedRegion.threats > 10 ? 'High' : 'Medium'}
                </SeverityBadge>
              </div>
              <div className="text-base font-bold text-white mt-1">{selectedRegion.s}</div>
              <div className="text-muted">Detected Threat Signals: <span className="font-mono text-white font-bold">{selectedRegion.threats}</span></div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/threats?q=${encodeURIComponent(selectedRegion.n)}`)}
              className="btn text-xs w-full py-2.5"
            >
              Filter Threats in {selectedRegion.n}
            </button>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// 4. REPORT GENERATOR PAGE
export function Reports() {
  const [generating, setGenerating] = useState(false)
  const [generatedDoc, setGeneratedDoc] = useState(false)
  const navigate = useNavigate()

  const sections = [
    { title: 'Executive Summary & Threat Landscape', desc: 'High-level synthesis of 24h social media manipulation and attack vectors' },
    { title: 'Sentiment Polarity & Public Reaction', desc: 'Aggregated sentiment shifts, emotion valence, and public trust indicators' },
    { title: 'Coordinated Campaign & Bot Swarm Detection', desc: 'Identified clusters exhibiting synchronized inauthentic amplification' },
    { title: 'High-Risk Account Profiles & Explainable AI', desc: 'Individual bot profiles, velocity anomalies, and weighted score breakdowns' },
    { title: 'Blockchain Evidence Proofs & SHA-256 Digest Ledger', desc: 'Cryptographic hash seals, Polygon block numbers, and tamper-proof verification' }
  ]

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGeneratedDoc(true)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <PageHead
        title="Intelligence Report Generator & Evidence Briefings"
        sub="Reporting & CERT Synthesis"
        subtitle="Assemble comprehensive intelligence briefings, executive threat summaries, and law enforcement court-ready packages (Problem ID: SIH26152)."
      >
        <button
          type="button"
          onClick={() => navigate('/cases')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <FileText size={14} />
          <span>Case Files</span>
        </button>
      </PageHead>

      <div className="card p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-white">Assemble SOC Report Package</h2>
          <p className="text-xs text-muted mt-0.5">
            Select intelligence modules to compile into the signed report package.
          </p>
        </div>

        <div className="space-y-2.5">
          {sections.map((s, i) => (
            <label
              key={s.title}
              className="p-3.5 rounded-lg border border-line bg-panel-light/30 flex items-start gap-3 text-xs cursor-pointer hover:border-line-light transition-colors"
            >
              <input type="checkbox" defaultChecked className="mt-1 accent-accent" />
              <div>
                <div className="font-semibold text-white">
                  Section {i + 1}: {s.title}
                </div>
                <div className="text-muted text-[11px] mt-0.5">{s.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted font-mono">
            Output Format: Signed SOC PDF with Polygon SHA-256 Proofs
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn text-xs py-2.5 px-6 flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>Generating Intelligence Report...</span>
              </>
            ) : (
              <>
                <FileText size={14} />
                <span>Compile & Seal Intelligence Report</span>
              </>
            )}
          </button>
        </div>

        {generatedDoc && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Report compiled and sealed with SHA-256 hash: <code>0x8f3a92...c91e</code></span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="text-white underline font-semibold hover:text-accent"
            >
              View in Case Dossiers &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 5. ABOUT SENTINEL PAGE
export function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Link to="/" className="text-accent text-sm flex items-center gap-1 hover:underline">
        &larr; Return to Home
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">About Project Sentinel</h1>
        <p className="text-muted text-sm mt-1">
          Smart India Hackathon • Problem ID: SIH26152 • Blockchain & Cybersecurity, Social Media Analytics
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ['Problem Statement', 'Public social discourse is vast and manipulated; analysts cannot manually correlate synchronized bot swarms or establish evidentiary legal chain-of-custody.'],
          ['Why It Matters', 'Disinformation campaigns disrupt civic stability, banking trust, and citizen identity frameworks. Real-time intelligence is vital for public safety.'],
          ['AI / Machine Learning Role', 'Supervised and unsupervised models analyze sentiment polarization, posting velocity anomalies, account age ratios, and text cosine similarity.'],
          ['Blockchain Proof of Existence', 'Flagged threats, account forensic dossiers, and reports are sealed with SHA-256 hashes and anchored to Polygon testnet for court-admissible provenance.'],
          ['Coordinated Campaign Engine', 'Identifies synchronized clusters sharing similar content within sub-second deltas, isolating seed accounts from amplification networks.'],
          ['Explainable Risk Scoring', 'Transparent, weighted mathematical factor contributions (35% velocity, 25% synchronicity, 20% age ratio, 20% repetition) demystify AI classifications.'],
          ['Role-Based Access Control', 'Multi-tier authorization (Analyst, Admin, Viewer/Auditor) ensures segregation of duty and prevents unauthorized forensic modifications.'],
          ['Future Production Scope', 'Live ingestion connectors (X Firehose, Telegram MTProto, Reddit Streaming API), zero-knowledge proofs on Polygon zkEVM, and multilingual Indic NLP.']
        ].map(([title, desc]) => (
          <div key={title} className="card p-5 space-y-2 bg-panel-light/30">
            <div className="label text-accent">{title}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
