import { useState, useRef, useEffect } from 'react'
import { Shield, ChevronDown, Check, UserCheck, ShieldAlert, Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const { role, setRole } = useApp()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const roles = [
    {
      id: 'Analyst',
      title: 'SOC Analyst',
      user: 'Sarah Chen',
      desc: 'Can triage threats, flag bots, manage cases & anchor evidence',
      icon: UserCheck,
      color: 'text-cyan-400'
    },
    {
      id: 'Admin',
      title: 'SOC Administrator',
      user: 'Marcus Cole',
      desc: 'Full system privileges, policy configuration & compliance audit',
      icon: ShieldAlert,
      color: 'text-amber-400'
    },
    {
      id: 'Viewer',
      title: 'Auditor / Viewer',
      user: 'Gov Oversight (Observer)',
      desc: 'Read-only access for compliance review; triage actions locked',
      icon: Eye,
      color: 'text-slate-400'
    }
  ]

  const currentRole = roles.find(r => r.id === role) || roles[0]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="User profile and role switcher"
        className="flex items-center gap-2 p-1.5 rounded-lg border border-line bg-panel hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 grid place-items-center text-xs font-bold text-accent">
          {currentRole.user.charAt(0)}
        </div>
        <div className="text-left hidden xl:block pr-1">
          <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 leading-none">
            {currentRole.user}
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-line text-accent">
              {role}
            </span>
          </div>
          <div className="text-[10px] text-muted leading-tight mt-0.5">{currentRole.title}</div>
        </div>
        <ChevronDown size={14} className="text-muted ml-0.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-panel border border-line rounded-xl shadow-2xl z-50 p-2 text-xs divide-y divide-line/40 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 pb-2.5">
            <div className="label text-muted mb-1">Active Session</div>
            <div className="font-semibold text-white text-sm">{currentRole.user}</div>
            <div className="text-muted text-[11px] mt-0.5">Problem ID: SIH26152 • Cyber & Blockchain</div>
          </div>

          <div className="py-2 space-y-1">
            <div className="label px-2 mb-1.5 text-muted">Switch Role (Mock Authorization)</div>
            {roles.map(r => {
              const Icon = r.icon
              const isActive = r.id === role
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                    isActive ? 'bg-accent/15 border border-accent/30 text-white' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded bg-line/50 mt-0.5 ${r.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold flex items-center justify-between">
                      <span>{r.title}</span>
                      {isActive && <Check size={13} className="text-accent" />}
                    </div>
                    <div className="text-[10px] text-muted leading-snug mt-0.5">{r.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="p-2 text-[10px] text-muted flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-accent" />
              Role RBAC Active
            </span>
            <span className="font-mono text-emerald-400">Authenticated</span>
          </div>
        </div>
      )}
    </div>
  )
}
