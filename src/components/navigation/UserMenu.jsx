import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Shield, ChevronDown, Check, UserCheck, ShieldAlert, Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const { role, setRole } = useApp()
  const location = useLocation()
  const isNetwork = location.pathname === '/network'

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
      color: isNetwork ? 'text-blue-600' : 'text-cyan-400'
    },
    {
      id: 'Admin',
      title: 'SOC Administrator',
      user: 'Marcus Cole',
      desc: 'Full system privileges, policy configuration & compliance audit',
      icon: ShieldAlert,
      color: 'text-amber-500'
    },
    {
      id: 'Viewer',
      title: 'Auditor / Viewer',
      user: 'Gov Oversight (Observer)',
      desc: 'Read-only access for compliance review; triage actions locked',
      icon: Eye,
      color: isNetwork ? 'text-slate-500' : 'text-slate-400'
    }
  ]

  const currentRole = roles.find(r => r.id === role) || roles[0]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="User profile and role switcher"
        className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors focus-visible:ring-2 ${
          isNetwork
            ? 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-blue-400'
            : 'border-line bg-panel text-slate-100 hover:bg-white/5 focus-visible:ring-accent'
        }`}
      >
        <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold border ${
          isNetwork
            ? 'bg-blue-50 border-blue-200 text-blue-600'
            : 'bg-accent/20 border-accent/40 text-accent'
        }`}>
          {currentRole.user.charAt(0)}
        </div>
        <div className="text-left hidden xl:block pr-1">
          <div className={`text-xs font-semibold flex items-center gap-1.5 leading-none ${isNetwork ? 'text-slate-900' : 'text-slate-100'}`}>
            {currentRole.user}
            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
              isNetwork
                ? 'bg-slate-100 border-slate-200 text-blue-700'
                : 'bg-line border-transparent text-accent'
            }`}>
              {role}
            </span>
          </div>
          <div className={`text-[10px] leading-tight mt-0.5 ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>{currentRole.title}</div>
        </div>
        <ChevronDown size={14} className={`ml-0.5 ${isNetwork ? 'text-slate-400' : 'text-muted'}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl z-50 p-2 text-xs divide-y animate-in fade-in zoom-in-95 duration-100 ${
          isNetwork
            ? 'bg-white border border-slate-200 divide-slate-100 text-slate-800'
            : 'bg-panel border border-line divide-line/40 text-slate-100'
        }`}>
          <div className="p-2 pb-2.5">
            <div className={`label mb-1 ${isNetwork ? 'text-slate-400' : 'text-muted'}`}>Active Session</div>
            <div className={`font-semibold text-sm ${isNetwork ? 'text-slate-900' : 'text-white'}`}>{currentRole.user}</div>
            <div className={`text-[11px] mt-0.5 ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>Problem ID: SIH26152 • Cyber & Blockchain</div>
          </div>

          <div className="py-2 space-y-1">
            <div className={`label px-2 mb-1.5 ${isNetwork ? 'text-slate-400' : 'text-muted'}`}>Switch Role (Mock Authorization)</div>
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
                    isActive
                      ? isNetwork
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'bg-accent/15 border border-accent/30 text-white'
                      : isNetwork
                        ? 'hover:bg-slate-50 text-slate-700'
                        : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded mt-0.5 ${isNetwork ? 'bg-slate-100' : 'bg-line/50'} ${r.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold flex items-center justify-between">
                      <span>{r.title}</span>
                      {isActive && <Check size={13} className={isNetwork ? 'text-blue-600' : 'text-accent'} />}
                    </div>
                    <div className={`text-[10px] leading-snug mt-0.5 ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>{r.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className={`p-2 text-[10px] flex items-center justify-between ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>
            <span className="flex items-center gap-1">
              <Shield size={11} className={isNetwork ? 'text-blue-600' : 'text-accent'} />
              Role RBAC Active
            </span>
            <span className={`font-mono ${isNetwork ? 'text-emerald-600' : 'text-emerald-400'}`}>Authenticated</span>
          </div>
        </div>
      )}
    </div>
  )
}
