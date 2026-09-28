import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  Smile,
  TrendingUp,
  Share2,
  Globe,
  ShieldAlert,
  UserSearch,
  Briefcase,
  BadgeCheck,
  Link2,
  FileText,
  History,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SeverityBadge } from '../ui/SeverityBadge'

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { threats, accounts, startTour, setRole } = useApp()

  // Static Pages
  const pages = [
    { type: 'page', title: 'Dashboard', desc: 'Top KPIs, incident ticker, sentiment breakdown', path: '/dashboard', icon: LayoutDashboard },
    { type: 'page', title: 'Threat Intelligence', desc: 'Alert triage queue & escalated threats', path: '/threats', icon: ShieldAlert },
    { type: 'page', title: 'Accounts & Bot Analysis', desc: 'Explainable AI risk scoring & bot probabilities', path: '/accounts', icon: UserSearch },
    { type: 'page', title: 'Coordinated Campaign Graph', desc: 'Interactive network graph of synchronized nodes', path: '/network', icon: Share2 },
    { type: 'page', title: 'Case Management', desc: 'Incident cases, evidence bundles & PDF reports', path: '/cases', icon: Briefcase },
    { type: 'page', title: 'Content Verification', desc: 'Public hash verification & tampering detection', path: '/verification', icon: BadgeCheck },
    { type: 'page', title: 'Blockchain Ledger', desc: 'Immutable Polygon block records & SHA-256 proofs', path: '/blockchain', icon: Link2 },
    { type: 'page', title: 'Immutable Audit Trail', desc: 'Cryptographically hashed SOC operator logs', path: '/audit', icon: History },
    { type: 'page', title: 'Sentiment Analytics', desc: 'Cross-platform public confidence indicators', path: '/sentiment', icon: Smile },
    { type: 'page', title: 'Emerging Trends', desc: 'Narrative velocity & hashtag acceleration', path: '/trends', icon: TrendingUp },
    { type: 'page', title: 'Geo Intelligence Map', desc: 'Regional threat dispersion across states', path: '/map', icon: Globe },
    { type: 'page', title: 'Report Generator', desc: 'Multi-section SOC intelligence synthesis', path: '/reports', icon: FileText }
  ]

  // Filtered threats
  const matchingThreats = threats
    .filter(t => t.id.toLowerCase().includes(query.toLowerCase()) || t.type.toLowerCase().includes(query.toLowerCase()) || t.platform.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map(t => ({
      type: 'threat',
      title: `${t.id}: ${t.type}`,
      desc: `${t.platform} • ${t.status} • Conf: ${t.conf}%`,
      path: `/threats?id=${t.id}`,
      badge: t.sev,
      icon: ShieldAlert
    }))

  // Filtered accounts
  const matchingAccounts = accounts
    .filter(a => a.handle.toLowerCase().includes(query.toLowerCase()) || a.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map(a => ({
      type: 'account',
      title: `${a.handle} (${a.name})`,
      desc: `${a.platform} • Bot Prob: ${a.bot}% • ${a.status}`,
      path: `/accounts?handle=${a.handle}`,
      badge: a.risk,
      icon: UserSearch
    }))

  // Quick Actions
  const actions = [
    {
      type: 'action',
      title: 'Start 5-Step Guided Tour',
      desc: 'Interactive walk-through of Sentinel SOC capabilities',
      action: () => { startTour(); onClose(); },
      icon: Sparkles
    },
    {
      type: 'action',
      title: 'Switch Role to Admin',
      desc: 'Unlock full administrative and audit capabilities',
      action: () => { setRole('Admin'); onClose(); },
      icon: ShieldAlert
    },
    {
      type: 'action',
      title: 'Switch Role to Analyst',
      desc: 'Standard SOC investigator workflow',
      action: () => { setRole('Analyst'); onClose(); },
      icon: UserSearch
    }
  ].filter(a => a.title.toLowerCase().includes(query.toLowerCase()))

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase())
  )

  const allItems = [...filteredPages, ...matchingThreats, ...matchingAccounts, ...actions]

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % (allItems.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + (allItems.length || 1)) % (allItems.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = allItems[selectedIndex]
        if (selected) {
          if (selected.action) selected.action()
          else if (selected.path) {
            navigate(selected.path)
            onClose()
          }
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, allItems, navigate, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 pt-16 sm:pt-24 flex justify-center items-start animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-panel border border-line-light rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-panel-light/50">
          <Search size={18} className="text-accent shrink-0" />
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent text-sm text-white placeholder-muted outline-none"
            placeholder="Type a page, account (@handle), threat (THR-...), or action..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-line text-muted bg-bg">
            Esc to exit
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-line/30 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">
              No matching pages, accounts, or threats for &ldquo;{query}&rdquo;
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.title + idx}
                  type="button"
                  onClick={() => {
                    if (item.action) item.action()
                    else if (item.path) {
                      navigate(item.path)
                      onClose()
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-accent/15 text-white border border-accent/30'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-accent/20 text-accent' : 'bg-line/40 text-muted'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-100 truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.type && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 text-muted border border-line rounded">
                            {item.type}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted truncate">{item.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && <SeverityBadge size="xs">{item.badge}</SeverityBadge>}
                    <ArrowRight size={13} className={isSelected ? 'text-accent' : 'text-muted/40'} />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-panel-light/30 border-t border-line text-[11px] text-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-bg border border-line">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-bg border border-line">↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-bg border border-line">↵</kbd> Select</span>
          </div>
          <span className="text-accent/90">Sentinel Command Center</span>
        </div>
      </div>
    </div>
  )
}
