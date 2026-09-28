import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Link2,
  Briefcase,
  XCircle,
  Eye,
  Check
} from 'lucide-react'
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
import { useApp } from '../context/AppContext'

export default function Threats() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    threats,
    role,
    updateThreatStatus,
    escalateThreat,
    dismissThreat,
    assignThreat,
    addItemToCase,
    cases
  } = useApp()

  const [selectedThreat, setSelectedThreat] = useState(null)
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '')
  const [assigneeInput, setAssigneeInput] = useState('')

  // Read URL query params
  const activeTab = searchParams.get('tab') || 'all'
  const filterPlatform = searchParams.get('platform') || ''
  const filterSev = searchParams.get('risk') || ''
  const searchQuery = searchParams.get('q') || ''
  const directId = searchParams.get('id')

  // Auto-open drawer if `?id=THR-...` is in URL
  useEffect(() => {
    if (directId) {
      const found = threats.find(t => t.id === directId)
      if (found) setSelectedThreat(found)
    }
  }, [directId, threats])

  // Filtered threats based on tabs, dropdowns, and search text
  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      // Tab filter
      if (activeTab === 'new' && t.status !== 'New') return false
      if (activeTab === 'investigating' && t.status !== 'Investigating') return false
      if (activeTab === 'resolved' && t.status !== 'Resolved') return false
      if (activeTab === 'escalated' && !t.escalated) return false

      // Platform filter
      if (filterPlatform && filterPlatform !== 'All Platforms' && t.platform !== filterPlatform) return false

      // Severity filter
      if (filterSev && filterSev !== 'All Severities' && t.sev !== filterSev) return false

      // Keyword search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchId = t.id.toLowerCase().includes(q)
        const matchType = t.type.toLowerCase().includes(q)
        const matchSummary = t.summary?.toLowerCase().includes(q)
        const matchPlatform = t.platform.toLowerCase().includes(q)
        if (!matchId && !matchType && !matchSummary && !matchPlatform) return false
      }

      return true
    })
  }, [threats, activeTab, filterPlatform, filterSev, searchQuery])

  // Status counts for tabs
  const counts = useMemo(() => ({
    all: threats.length,
    new: threats.filter(t => t.status === 'New').length,
    investigating: threats.filter(t => t.status === 'Investigating').length,
    resolved: threats.filter(t => t.status === 'Resolved').length,
    escalated: threats.filter(t => t.escalated).length
  }), [threats])

  const setTab = (tab) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'all') next.delete('tab')
    else next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }

  const handleLinkToCase = (threat) => {
    if (!selectedCaseId) return
    addItemToCase(selectedCaseId, 'threat', threat.id, threat.hash)
    alert(`Linked ${threat.id} to Case ${selectedCaseId}`)
  }

  const tableCols = [
    {
      k: 'id',
      h: 'Alert ID',
      r: (r) => (
        <span className="font-mono font-semibold text-accent flex items-center gap-1.5">
          {r.id}
          {r.escalated && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" title="Escalated to Critical" />
          )}
        </span>
      )
    },
    {
      k: 'type',
      h: 'Threat Category',
      r: (r) => (
        <div>
          <div className="font-medium text-slate-100">{r.type}</div>
          <div className="text-[11px] text-muted truncate max-w-xs">{r.summary}</div>
        </div>
      )
    },
    {
      k: 'sev',
      h: 'Severity',
      r: (r) => <SeverityBadge>{r.sev}</SeverityBadge>
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
      k: 'conf',
      h: 'Confidence',
      r: (r) => (
        <div className="w-24">
          <div className="flex justify-between text-[11px] mb-1">
            <span>{r.conf}%</span>
            <span className="text-muted">AI</span>
          </div>
          <Bar v={r.conf} color={r.conf > 85 ? 'bg-red-500' : 'bg-accent'} />
        </div>
      )
    },
    {
      k: 'status',
      h: 'Triage Status',
      r: (r) => (
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
          r.status === 'New'
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            : r.status === 'Investigating'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          {r.status}
        </span>
      )
    },
    {
      k: 'assignee',
      h: 'Assigned To',
      r: (r) => (
        <div className="text-xs flex items-center gap-1.5 text-slate-300">
          <User size={12} className="text-muted" />
          <span className="truncate max-w-[120px]">{r.assignee || 'Unassigned'}</span>
        </div>
      )
    },
    {
      k: 'actions',
      h: 'Quick Actions',
      sortable: false,
      r: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Inspect Threat Details"
            onClick={() => setSelectedThreat(r)}
            className="p-1.5 rounded hover:bg-white/10 text-muted hover:text-white transition-colors"
          >
            <Eye size={14} />
          </button>
          {!r.escalated && r.status !== 'Resolved' && (
            <button
              type="button"
              title="Escalate Alert Priority"
              onClick={() => escalateThreat(r.id)}
              disabled={role === 'Viewer'}
              className="text-[11px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
            >
              Escalate
            </button>
          )}
          {r.status !== 'Resolved' && (
            <button
              type="button"
              title="Dismiss / Resolve Alert"
              onClick={() => dismissThreat(r.id)}
              disabled={role === 'Viewer'}
              className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
            >
              Resolve
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHead
        title="Threat Intelligence & Alert Triage Queue"
        sub="Investigation Operations"
        subtitle="Prioritize incoming threat alerts, assign SOC analysts, escalate active bot manipulation, and anchor tamper-proof evidence to the blockchain ledger."
        badge={<Tooltip termKey="riskScore" />}
      >
        <button
          type="button"
          onClick={() => navigate('/cases')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <Briefcase size={14} />
          <span>Case Files ({cases.length})</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/blockchain')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <Link2 size={14} className="text-cyan-400" />
          <span>Evidence Ledger</span>
        </button>
      </PageHead>

      {/* Triage Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'all', label: 'All Alerts', count: counts.all },
          { id: 'new', label: 'New / Unassigned', count: counts.new },
          { id: 'investigating', label: 'Investigating', count: counts.investigating },
          { id: 'escalated', label: 'Escalated Critical', count: counts.escalated },
          { id: 'resolved', label: 'Resolved / Closed', count: counts.resolved }
        ].map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-accent/15 border border-accent/40 text-white shadow-glow-cyan'
                  : 'text-muted hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-accent text-slate-950 font-bold' : 'bg-line text-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Shareable URL Filter Bar */}
      <FilterBar
        searchPlaceholder="Search alert ID, threat type, platform..."
        filters={[
          {
            key: 'platform',
            label: 'Platform',
            options: ['All Platforms', 'X', 'Reddit', 'YouTube', 'Telegram']
          },
          {
            key: 'risk',
            label: 'Severity',
            options: ['All Severities', 'Critical', 'High', 'Medium', 'Low']
          }
        ]}
      />

      {/* Main Alert Triage Data Table */}
      <DataTable
        cols={tableCols}
        rows={filteredThreats}
        onRow={(r) => setSelectedThreat(r)}
        emptyTitle="No threats found in this queue"
        emptyDesc="Try changing the active status tab or resetting the search and platform filters."
      />

      {/* Detailed Inspection Drawer */}
      <Drawer
        open={!!selectedThreat}
        onClose={() => setSelectedThreat(null)}
        title={selectedThreat ? `${selectedThreat.id}: ${selectedThreat.type}` : 'Threat Inspection'}
        subtitle="Detailed SOC Artifact & Explainable Risk Assessment"
        width="max-w-xl"
      >
        {selectedThreat && (
          <div className="space-y-6 text-sm">
            {/* Top Badge & Metadata */}
            <div className="card p-4 bg-panel-light/40 space-y-3">
              <div className="flex items-center justify-between">
                <SeverityBadge size="sm">{selectedThreat.sev}</SeverityBadge>
                <span className="text-xs text-muted font-mono">{selectedThreat.timestamp}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {selectedThreat.summary}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs">
                <div>
                  <span className="text-muted">Platform:</span>{' '}
                  <span className="text-white font-medium">{selectedThreat.platform}</span>
                </div>
                <div>
                  <span className="text-muted">Accounts Affected:</span>{' '}
                  <span className="text-white font-mono">{selectedThreat.accounts}</span>
                </div>
                <div>
                  <span className="text-muted">Current Status:</span>{' '}
                  <span className="text-cyan-300 font-medium">{selectedThreat.status}</span>
                </div>
                <div>
                  <span className="text-muted">Current Assignee:</span>{' '}
                  <span className="text-white font-medium">{selectedThreat.assignee}</span>
                </div>
              </div>
            </div>

            {/* AI Confidence & Contributing Factors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label text-muted">AI Model Confidence</span>
                <span className="font-mono text-accent font-bold">{selectedThreat.conf}%</span>
              </div>
              <Bar v={selectedThreat.conf} color="bg-accent" h="h-2.5" />
            </div>

            {selectedThreat.riskFactors && (
              <div>
                <div className="label text-muted mb-2">Explainable Risk Factors</div>
                <div className="space-y-2">
                  {selectedThreat.riskFactors.map((rf) => (
                    <div key={rf.name} className="p-2.5 rounded-lg border border-line bg-bg/60 text-xs">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-slate-200">{rf.name}</span>
                        <span className="text-muted font-mono">Weight: {rf.weight}</span>
                      </div>
                      <Bar v={rf.score} color="bg-cyan-400" h="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blockchain Anchored Evidence Hash */}
            <div className="card p-4 space-y-2 border-accent/30 bg-accent/5">
              <div className="flex items-center justify-between">
                <div className="label text-cyan-300 flex items-center gap-1.5">
                  <Link2 size={13} />
                  <span>Blockchain Sealed Evidence</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Block #{selectedThreat.block}</span>
              </div>
              <div className="text-xs font-mono break-all text-slate-300 bg-bg p-2 rounded border border-line">
                {selectedThreat.hash}
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted">Anchor Status: Verified Tamper-proof</span>
                <button
                  type="button"
                  onClick={() => navigate(`/verification?hash=${selectedThreat.hash}`)}
                  className="text-accent hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Verify on Ledger</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>

            {/* Triage Actions */}
            <div className="space-y-3 pt-2 border-t border-line">
              <div className="label text-muted">Triage Operations</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={role === 'Viewer'}
                  onClick={() => updateThreatStatus(selectedThreat.id, 'Investigating')}
                  className="btn-secondary text-xs py-2"
                >
                  Mark Investigating
                </button>
                <button
                  type="button"
                  disabled={role === 'Viewer'}
                  onClick={() => updateThreatStatus(selectedThreat.id, 'Resolved')}
                  className="btn-ghost text-xs py-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  Mark Resolved
                </button>
              </div>

              {/* Add to Case */}
              <div className="pt-2">
                <div className="text-xs text-muted mb-1.5">Attach to Active Case Dossier:</div>
                <div className="flex gap-2">
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
                    onClick={() => handleLinkToCase(selectedThreat)}
                    className="btn text-xs py-1.5 px-3 whitespace-nowrap"
                  >
                    Attach
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
