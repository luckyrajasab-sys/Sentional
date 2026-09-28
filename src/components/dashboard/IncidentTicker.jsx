import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, ArrowRight, ShieldAlert, ExternalLink } from 'lucide-react'
import { liveIncidents } from '../../data'
import { SeverityBadge } from '../ui/SeverityBadge'

export function IncidentTicker() {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)

  const handleIncidentClick = (inc) => {
    // Drilldown to threat triage with category
    navigate(`/threats?q=${encodeURIComponent(inc.type)}`)
  }

  return (
    <div
      className="card p-3 mb-6 bg-panel-light/40 border-line overflow-hidden relative flex flex-col md:flex-row items-stretch md:items-center gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      id="incident-ticker"
    >
      {/* Label Badge */}
      <div className="flex items-center gap-2 shrink-0 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
        <Radio size={13} className="animate-pulse" />
        <span>LIVE INCIDENTS</span>
      </div>

      {/* Scrolling / Interactive Alert Stream */}
      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-4 py-1">
        {liveIncidents.map((inc) => (
          <div
            key={inc.id}
            onClick={() => handleIncidentClick(inc)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleIncidentClick(inc)
            }}
            tabIndex={0}
            role="button"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-bg/80 border border-line hover:border-accent/40 text-xs shrink-0 cursor-pointer group transition-all"
          >
            <SeverityBadge size="xs">{inc.sev}</SeverityBadge>
            <span className="font-semibold text-slate-200 group-hover:text-accent transition-colors">
              {inc.type}
            </span>
            <span className="text-[11px] text-muted">on {inc.platform}</span>
            <span className="text-[10px] text-muted/70 font-mono">({inc.time})</span>
            <ExternalLink size={11} className="text-muted group-hover:text-accent ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Fast Action Link */}
      <button
        type="button"
        onClick={() => navigate('/threats')}
        className="shrink-0 text-xs text-accent hover:underline flex items-center justify-center gap-1 px-2 py-1 font-medium"
      >
        <span>Full Triage</span>
        <ArrowRight size={13} />
      </button>
    </div>
  )
}
