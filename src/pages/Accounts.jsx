import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  UserSearch,
  Bot,
  UserCheck,
  ShieldAlert,
  ArrowUpRight,
  Link2,
  Calendar,
  Layers,
  Activity,
  Briefcase
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts'
import {
  PageHead,
  SeverityBadge,
  DataTable,
  FilterBar,
  Drawer,
  Bar,
  Tooltip,
  EvidenceHashBadge
} from '../components/ui'
import { timeline } from '../data'
import { useApp } from '../context/AppContext'

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#0f1218',
    borderColor: '#1e2430',
    borderRadius: '8px',
    fontSize: '12px'
  }
}

export default function Accounts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { accounts, cases, addItemToCase, anchorEvidenceOnChain, role } = useApp()

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '')
  const [anchoring, setAnchoring] = useState(false)

  const filterPlatform = searchParams.get('platform') || ''
  const filterRisk = searchParams.get('risk') || ''
  const searchQuery = searchParams.get('q') || ''
  const directHandle = searchParams.get('handle')

  useEffect(() => {
    if (directHandle) {
      const found = accounts.find(a => a.handle.toLowerCase() === directHandle.toLowerCase())
      if (found) setSelectedAccount(found)
    }
  }, [directHandle, accounts])

  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      if (filterPlatform && filterPlatform !== 'All Platforms' && a.platform !== filterPlatform) return false
      if (filterRisk && filterRisk !== 'All Severities' && a.risk !== filterRisk) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchHandle = a.handle.toLowerCase().includes(q)
        const matchName = a.name.toLowerCase().includes(q)
        const matchPlatform = a.platform.toLowerCase().includes(q)
        if (!matchHandle && !matchName && !matchPlatform) return false
      }
      return true
    })
  }, [accounts, filterPlatform, filterRisk, searchQuery])

  const handleAttachCase = () => {
    if (!selectedAccount || !selectedCaseId) return
    addItemToCase(selectedCaseId, 'account', selectedAccount.handle, selectedAccount.hash)
    alert(`Attached ${selectedAccount.handle} to Case ${selectedCaseId}`)
  }

  const handleAnchorOnChain = async () => {
    if (!selectedAccount) return
    setAnchoring(true)
    await anchorEvidenceOnChain(
      `Quarantined Account: ${selectedAccount.handle}`,
      { handle: selectedAccount.handle, botScore: selectedAccount.bot, risk: selectedAccount.risk }
    )
    setAnchoring(false)
    alert(`Account profile ${selectedAccount.handle} sealed to blockchain ledger!`)
  }

  const cols = [
    {
      k: 'handle',
      h: 'Account Profile',
      r: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-line border border-line-light grid place-items-center text-xs font-bold text-accent">
            {r.avatar || r.handle[1]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span>{r.handle}</span>
              {r.verified && <span className="text-emerald-400 text-xs" title="Platform verified">✓</span>}
            </div>
            <div className="text-[11px] text-muted truncate max-w-xs">{r.name}</div>
          </div>
        </div>
      )
    },
    {
      k: 'platform',
      h: 'Platform',
      r: (r) => (
        <span className="text-xs px-2 py-0.5 rounded bg-line text-slate-300">
          {r.platform}
        </span>
      )
    },
    {
      k: 'followers',
      h: 'Followers / Following',
      r: (r) => (
        <div className="text-xs font-mono">
          <span className="text-white">{r.followers.toLocaleString()}</span>
          <span className="text-muted/60"> / </span>
          <span className="text-muted">{r.following.toLocaleString()}</span>
        </div>
      )
    },
    {
      k: 'age',
      h: 'Account Age',
      r: (r) => <span className="text-xs text-slate-300 font-mono">{r.age}</span>
    },
    {
      k: 'freq',
      h: 'Posting Freq.',
      r: (r) => (
        <span className="text-xs font-mono text-cyan-300">
          {r.freq}
        </span>
      )
    },
    {
      k: 'bot',
      h: 'Bot Probability',
      r: (r) => (
        <div className="w-28">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-mono font-bold text-slate-100">{r.bot}%</span>
            <span className="text-muted text-[10px]">{r.bot > 70 ? 'High' : 'Normal'}</span>
          </div>
          <Bar v={r.bot} color={r.bot > 75 ? 'bg-red-500' : r.bot > 40 ? 'bg-amber-500' : 'bg-emerald-500'} />
        </div>
      )
    },
    {
      k: 'risk',
      h: 'Risk Level',
      r: (r) => <SeverityBadge>{r.risk}</SeverityBadge>
    },
    {
      k: 'status',
      h: 'Status',
      r: (r) => (
        <span className={`text-[11px] px-2 py-0.5 rounded border ${
          r.status === 'Flagged' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-line border-line-light text-slate-300'
        }`}>
          {r.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHead
        title="Account & Bot Intelligence"
        sub="Behavioral Machine Learning"
        subtitle="Uncover automated bot profiles, sockpuppet rings, and explainable AI risk scoring with weighted telemetry features (Problem ID: SIH26152)."
        badge={<Tooltip termKey="botProbability" />}
      >
        <button
          type="button"
          onClick={() => navigate('/network')}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <span>View Coordinated Graph</span>
          <ArrowUpRight size={13} />
        </button>
      </PageHead>

      {/* Shareable Filter Bar */}
      <FilterBar
        searchPlaceholder="Filter accounts by @handle or name..."
        filters={[
          {
            key: 'platform',
            label: 'Platform',
            options: ['All Platforms', 'X', 'Reddit', 'YouTube', 'Telegram']
          },
          {
            key: 'risk',
            label: 'Risk Level',
            options: ['All Severities', 'Critical', 'High', 'Medium', 'Low']
          }
        ]}
      />

      {/* Accounts Data Table */}
      <DataTable
        cols={cols}
        rows={filteredAccounts}
        onRow={(r) => setSelectedAccount(r)}
        emptyTitle="No accounts matching filter criteria"
      />

      {/* Detailed Inspection Drawer with Explainable Risk Score */}
      <Drawer
        open={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        title={selectedAccount?.handle || 'Account Details'}
        subtitle={selectedAccount?.name}
        width="max-w-xl"
      >
        {selectedAccount && (
          <div className="space-y-6 text-sm">
            {/* Account High-Level Card */}
            <div className="card p-4 bg-panel-light/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 grid place-items-center font-bold text-accent text-sm">
                    {selectedAccount.avatar || 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base leading-none">
                      {selectedAccount.handle}
                    </div>
                    <div className="text-xs text-muted mt-0.5">{selectedAccount.name}</div>
                  </div>
                </div>
                <SeverityBadge size="sm">{selectedAccount.risk}</SeverityBadge>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line text-xs">
                <div>
                  <div className="text-muted">Platform</div>
                  <div className="font-semibold text-white mt-0.5">{selectedAccount.platform}</div>
                </div>
                <div>
                  <div className="text-muted">Account Age</div>
                  <div className="font-mono text-white mt-0.5">{selectedAccount.age}</div>
                </div>
                <div>
                  <div className="text-muted">Posting Velocity</div>
                  <div className="font-mono text-cyan-400 mt-0.5">{selectedAccount.freq}</div>
                </div>
              </div>
            </div>

            {/* EXPLAINABLE RISK SCORE BREAKDOWN */}
            <div className="card p-5 border-accent/40 bg-accent/[0.03] space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <div className="label text-accent flex items-center gap-1.5">
                    <span>Explainable Risk Score</span>
                    <Tooltip termKey="riskScore" />
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Multi-factor weighted algorithmic breakdown
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-mono font-bold text-white">
                    {selectedAccount.bot}
                  </span>
                  <span className="text-xs text-muted">/100</span>
                </div>
              </div>

              {/* Breakdown Factors List */}
              <div className="space-y-3">
                {selectedAccount.riskBreakdown ? (
                  selectedAccount.riskBreakdown.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-bg/80 border border-line text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">{item.factor}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-muted">Weight: {(item.weight * 100).toFixed(0)}%</span>
                          <span className="text-accent font-bold">+{item.contribution} pts</span>
                        </div>
                      </div>
                      <Bar v={item.score} color={item.score > 80 ? 'bg-red-500' : 'bg-accent'} h="h-1.5" />
                      <p className="text-[11px] text-muted/90 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted">No factor breakdown available for this record.</div>
                )}
              </div>
            </div>

            {/* AI Behavioral Signals List */}
            <div className="space-y-2">
              <div className="label text-muted">Detected Behavioral Signals</div>
              <div className="space-y-1.5">
                {selectedAccount.signals.map((sig, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-line bg-panel-light/30 text-xs flex items-start gap-2">
                    <span className="text-accent font-mono shrink-0">•</span>
                    <span className="text-slate-200">{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 24-Hour Activity Epoch Cadence */}
            <div>
              <div className="label text-muted mb-2">24h Machine Activity Cadence</div>
              <div className="h-28 card p-2 bg-panel-light/20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline}>
                    <XAxis dataKey="t" stroke="#64748b" fontSize={10} tickLine={false} />
                    <RechartsTooltip {...chartTooltipStyle} />
                    <Line type="stepAfter" dataKey="vol" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Blockchain Anchoring & Case Actions */}
            <div className="space-y-3 pt-3 border-t border-line">
              <div className="label text-muted">Investigation Actions</div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={role === 'Viewer' || anchoring}
                  onClick={handleAnchorOnChain}
                  className="btn text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Link2 size={13} />
                  <span>{anchoring ? 'Anchoring...' : 'Seal to Blockchain'}</span>
                </button>

                <button
                  type="button"
                  disabled={role === 'Viewer'}
                  onClick={() => alert(`Account ${selectedAccount.handle} marked as quarantined.`)}
                  className="btn-danger text-xs py-2"
                >
                  Quarantine Account
                </button>
              </div>

              {/* Case attach */}
              <div className="flex gap-2 pt-2">
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="input text-xs py-1.5 flex-1"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}: {c.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={role === 'Viewer'}
                  onClick={handleAttachCase}
                  className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
                >
                  Attach to Case
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
