import { useState, useMemo } from 'react'
import {
  History,
  Shield,
  Search,
  Filter,
  Download,
  Lock,
  User,
  ArrowRight
} from 'lucide-react'
import {
  PageHead,
  DataTable,
  EvidenceHashBadge,
  Tooltip
} from '../components/ui'
import { useApp } from '../context/AppContext'

export default function AuditTrail() {
  const { auditTrail } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  const filteredLogs = useMemo(() => {
    return auditTrail.filter((item) => {
      if (actionFilter !== 'ALL' && !item.action.includes(actionFilter)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchUser = item.user.toLowerCase().includes(q)
        const matchAction = item.action.toLowerCase().includes(q)
        const matchTarget = item.target.toLowerCase().includes(q)
        const matchHash = item.hash.toLowerCase().includes(q)
        if (!matchUser && !matchAction && !matchTarget && !matchHash) return false
      }
      return true
    })
  }, [auditTrail, actionFilter, searchQuery])

  const handleExportAudit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditTrail, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `sentinel_audit_log_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const cols = [
    {
      k: 'id',
      h: 'Log ID',
      r: (r) => <span className="font-mono font-semibold text-accent text-xs">{r.id}</span>
    },
    {
      k: 'timestamp',
      h: 'Timestamp (UTC)',
      r: (r) => <span className="font-mono text-xs text-slate-300">{r.timestamp}</span>
    },
    {
      k: 'user',
      h: 'Operator / Role',
      r: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-line border border-line-light grid place-items-center text-[10px] font-bold text-accent">
            {r.user.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white text-xs">{r.user}</div>
            <div className="text-[10px] text-muted font-mono">{r.role}</div>
          </div>
        </div>
      )
    },
    {
      k: 'action',
      h: 'Action Performed',
      r: (r) => {
        const isEscalate = r.action.includes('ESCALATE')
        const isAnchor = r.action.includes('ANCHOR')
        return (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
            isEscalate
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : isAnchor
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              : 'bg-line text-slate-300 border-line-light'
          }`}>
            {r.action}
          </span>
        )
      }
    },
    {
      k: 'target',
      h: 'Target Object / Resource',
      r: (r) => (
        <span className="text-xs text-slate-200 font-medium truncate max-w-xs block">
          {r.target}
        </span>
      )
    },
    {
      k: 'ip',
      h: 'Client IP',
      r: (r) => <span className="font-mono text-xs text-muted">{r.ip}</span>
    },
    {
      k: 'hash',
      h: 'Tamper-Proof Digest',
      r: (r) => <EvidenceHashBadge hash={r.hash} label="SIG:" />
    }
  ]

  return (
    <div className="space-y-6">
      <PageHead
        title="Immutable SOC Audit Trail"
        sub="Compliance & Forensic Accountability"
        subtitle="Cryptographically sealed log of every operator action, threat escalation, case assignment, and blockchain anchor event for complete regulatory transparency."
        badge={
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Lock size={12} />
            <span>Append-Only Ledger Active</span>
          </div>
        }
      >
        <button
          type="button"
          onClick={handleExportAudit}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <Download size={14} />
          <span>Export Audit Log (JSON)</span>
        </button>
      </PageHead>

      {/* Filter and Action bar */}
      <div className="card p-3.5 flex flex-wrap items-center justify-between gap-3 bg-panel-light/30 border-line">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              className="input pl-8.5 py-1.5 text-xs rounded-lg"
              placeholder="Search by operator, action, or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input text-xs py-1.5 !w-auto"
            >
              <option value="ALL">All Actions</option>
              <option value="ESCALATE">Escalate Threat</option>
              <option value="CASE">Case Operations</option>
              <option value="ANCHOR">Blockchain Anchors</option>
              <option value="STATUS">Status Updates</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-muted font-mono">
          {filteredLogs.length} events logged
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        cols={cols}
        rows={filteredLogs}
        emptyTitle="No audit log entries matching filters"
        hoverable={false}
      />
    </div>
  )
}
