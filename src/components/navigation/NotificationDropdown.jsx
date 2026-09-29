import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, ArrowRight } from 'lucide-react'
import { notifications } from '../../data'
import { SeverityBadge } from '../ui/SeverityBadge'

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const menuRef = useRef(null)
  const navigate = useNavigate()
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

  const handleSelect = (item) => {
    setOpen(false)
    if (item.link) {
      navigate(item.link)
    }
  }

  const markAllRead = () => {
    setItems([])
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="View notifications"
        className={`relative p-2 rounded-lg border transition-colors focus-visible:ring-2 ${
          isNetwork
            ? 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus-visible:ring-blue-400'
            : 'border-line bg-panel text-slate-300 hover:text-white hover:bg-white/5 focus-visible:ring-accent'
        }`}
      >
        <Bell size={17} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center animate-pulse">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl shadow-2xl z-50 p-2 text-xs divide-y animate-in fade-in zoom-in-95 duration-100 ${
          isNetwork
            ? 'bg-white border border-slate-200 divide-slate-100 text-slate-800'
            : 'bg-panel border border-line divide-line/40 text-slate-100'
        }`}>
          <div className="p-2.5 flex items-center justify-between">
            <div>
              <span className={`font-semibold ${isNetwork ? 'text-slate-900' : 'text-white'}`}>Live SOC Alerts</span>
              <span className={`text-[11px] ml-2 ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>({items.length} unread)</span>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className={`text-[11px] hover:underline ${isNetwork ? 'text-blue-600' : 'text-accent'}`}
              >
                Clear all
              </button>
            )}
          </div>

          <div className={`max-h-72 overflow-y-auto divide-y ${isNetwork ? 'divide-slate-100' : 'divide-line/30'}`}>
            {items.length === 0 ? (
              <div className={`py-8 text-center ${isNetwork ? 'text-slate-400' : 'text-muted'}`}>
                No new unread alert notifications
              </div>
            ) : (
              items.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleSelect(n)}
                  className={`w-full text-left p-3 transition-colors flex items-start justify-between gap-3 group ${
                    isNetwork ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge size="xs">{n.sev}</SeverityBadge>
                      <span className={`text-[10px] font-mono ${isNetwork ? 'text-slate-400' : 'text-muted'}`}>{n.time} ago</span>
                    </div>
                    <div className={`text-xs font-medium leading-snug transition-colors ${
                      isNetwork ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {n.t}
                    </div>
                  </div>
                  <ArrowRight size={14} className={`shrink-0 mt-1 transition-colors ${
                    isNetwork ? 'text-slate-400 group-hover:text-blue-600' : 'text-muted/50 group-hover:text-accent'
                  }`} />
                </button>
              ))
            )}
          </div>

          <div className="p-2 text-center">
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/threats'); }}
              className={`text-xs font-medium hover:underline inline-flex items-center gap-1 ${
                isNetwork ? 'text-blue-600' : 'text-accent'
              }`}
            >
              <span>View full Alert Triage Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
