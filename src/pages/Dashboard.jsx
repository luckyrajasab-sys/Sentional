import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar as RBar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ShieldAlert,
  UserSearch,
  BadgeCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  Link2,
  Share2
} from 'lucide-react'
import {
  PageHead,
  StatCard,
  ChartCard,
  SeverityBadge,
  Tooltip
} from '../components/ui'
import { IncidentTicker } from '../components/dashboard/IncidentTicker'
import { topKpis, timeline, platforms } from '../data'
import { useApp } from '../context/AppContext'

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#0f1218',
    borderColor: '#1e2430',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
    fontSize: '12px',
    color: '#e2e8f0'
  }
}

const axisStyle = {
  stroke: '#64748b',
  fontSize: 11,
  tickLine: false
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { threats, role, escalateThreat } = useApp()
  const [activePlatformFilter, setActivePlatformFilter] = useState(null)

  // Map icon to top KPIs
  const kpiIcons = [ShieldAlert, UserSearch, Activity, BadgeCheck]

  return (
    <div className="space-y-6">
      {/* Page Header with Purpose Subtitle & Term Tooltips */}
      <PageHead
        title="SOC Overview & Threat Operations"
        sub="Social Intelligence & Cyber Command"
        subtitle="Unified social media intelligence and threat operations center for real-time manipulation detection and blockchain evidence anchoring (Problem ID: SIH26152)."
        badge={
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-line text-cyan-300 border border-line-light">
              Polygon Testnet #1928374
            </span>
            <Tooltip termKey="hashAnchoring" />
          </div>
        }
      >
        <button
          type="button"
          onClick={() => navigate('/cases')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>Active Cases</span>
          <ArrowUpRight size={13} />
        </button>
        <button
          type="button"
          onClick={() => navigate('/threats')}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <ShieldAlert size={14} />
          <span>Threat Triage Queue</span>
        </button>
      </PageHead>

      {/* 1. TOP 4 KPI CARDS FIRST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="top-kpis">
        {topKpis.map((kpi, idx) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            d={kpi.d}
            severity={kpi.severity}
            drilldown={kpi.drilldown}
            subtext={kpi.subtext}
            icon={kpiIcons[idx]}
          />
        ))}
      </div>

      {/* 2. LIVE INCIDENT TICKER */}
      <IncidentTicker />

      {/* 3. CLICKABLE INTERACTIVE CHARTS & METRIC PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sentiment Over Time (Clickable drilldown to /sentiment) */}
        <ChartCard
          title="Sentiment Trajectory (24h)"
          subtitle="Click chart to inspect multi-platform sentiment breakdown and language sentiment"
          className="lg:col-span-2 group cursor-pointer hover:border-accent/40"
          action={
            <button
              onClick={() => navigate('/sentiment')}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <span>Drill down</span>
              <ArrowUpRight size={13} />
            </button>
          }
        >
          <div
            className="w-full h-full"
            onClick={() => navigate('/sentiment')}
            title="Click to drill down to Sentiment Analysis"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" {...axisStyle} />
                <YAxis {...axisStyle} />
                <RechartsTooltip {...chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="pos"
                  name="Positive %"
                  stackId="1"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="neu"
                  name="Neutral %"
                  stackId="1"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="neg"
                  name="Negative / Toxic %"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Platform Distribution (Click slices to drill down to /threats?platform=...) */}
        <ChartCard
          title="Threat Platform Distribution"
          subtitle="Click platform segment to filter threats"
          action={
            <span className="text-[11px] font-mono text-muted">Click segment</span>
          }
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={platforms}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  onClick={(entry) => {
                    navigate(`/threats?platform=${encodeURIComponent(entry.name)}`)
                  }}
                  className="cursor-pointer"
                >
                  {platforms.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
                <RechartsTooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
              {platforms.map(p => (
                <button
                  key={p.name}
                  onClick={() => navigate(`/threats?platform=${encodeURIComponent(p.name)}`)}
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300">{p.name}</span>
                  <span className="text-muted font-mono">{p.value}%</span>
                </button>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Activity Volume (Clickable to /trends) */}
        <ChartCard
          title="Cross-Network Narrative Volume"
          subtitle="Post volume per 2-hour epoch across monitored platforms"
          className="group cursor-pointer hover:border-accent/40"
          action={
            <button
              onClick={() => navigate('/trends')}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <span>Trends</span>
              <ArrowUpRight size={13} />
            </button>
          }
        >
          <div
            className="w-full h-full"
            onClick={() => navigate('/trends')}
            title="Click to drill down to Trends & Velocity"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" {...axisStyle} />
                <YAxis {...axisStyle} />
                <RechartsTooltip {...chartTooltipStyle} />
                <RBar dataKey="vol" name="Posts / Epoch" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Threat Events Over Time (Clickable to /threats) */}
        <ChartCard
          title="Flagged Threat Events"
          subtitle="Hourly threat detection spikes flagged by NLP & ML classifiers"
          className="group cursor-pointer hover:border-accent/40"
          action={
            <button
              onClick={() => navigate('/threats')}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <span>Threats</span>
              <ArrowUpRight size={13} />
            </button>
          }
        >
          <div
            className="w-full h-full"
            onClick={() => navigate('/threats')}
            title="Click to drill down to Threat Operations"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" {...axisStyle} />
                <YAxis {...axisStyle} />
                <RechartsTooltip {...chartTooltipStyle} />
                <RBar dataKey="threats" name="Threat Signals" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Rapid Alert Triage Queue Widget */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="label text-muted">Alert Triage Queue</span>
                <Tooltip termKey="riskScore" />
              </div>
              <button
                type="button"
                onClick={() => navigate('/threats')}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Queue ({threats.length})</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {threats.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/threats?id=${t.id}`)}
                  className="p-2.5 rounded-lg border border-line bg-panel-light/30 hover:border-accent/30 hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-accent">{t.id}</span>
                      <SeverityBadge size="xs">{t.sev}</SeverityBadge>
                    </div>
                    <div className="text-xs font-medium text-slate-200 mt-1 truncate group-hover:text-white">
                      {t.type}
                    </div>
                    <div className="text-[10px] text-muted truncate">
                      {t.platform} • {t.accounts} accounts • {t.status}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-muted font-mono">{t.time}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        escalateThreat(t.id)
                      }}
                      className="text-[10px] text-amber-400 hover:underline px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1">
              <Link2 size={12} className="text-accent" />
              SHA-256 Hash Sealed
            </span>
            <button
              onClick={() => navigate('/verification')}
              className="text-accent hover:underline"
            >
              Verify on Polygon
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Callouts for Judges */}
      <div className="card p-5 bg-gradient-to-r from-panel via-panel-light to-panel border-accent/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 grid place-items-center text-accent shrink-0">
            <Share2 size={20} />
          </div>
          <div>
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              Coordinated Campaign Detection & Inauthentic Networks
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                SIH26152 Special
              </span>
            </div>
            <div className="text-xs text-muted mt-0.5">
              Inspect synchronized bot swarms posting identical disinformation within 8.4-second intervals.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/network')}
            className="btn text-xs py-2 px-3.5"
          >
            <span>Open Network Graph</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
