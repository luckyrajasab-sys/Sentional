import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowRight } from 'lucide-react'
import { notifications } from '../../data'
import { SeverityBadge } from '../ui/SeverityBadge'

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const menuRef = useRef(null)
  const navigate = useNavigate()

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
        className="relative p-2 rounded-lg border border-line bg-panel hover:bg-white/5 text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell size={17} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center animate-pulse">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-panel border border-line rounded-xl shadow-2xl z-50 p-2 text-xs divide-y divide-line/40 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">Live SOC Alerts</span>
              <span className="text-[11px] text-muted ml-2">({items.length} unread)</span>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] text-accent hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-line/30">
            {items.length === 0 ? (
              <div className="py-8 text-center text-muted">
                No new unread alert notifications
              </div>
            ) : (
              items.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleSelect(n)}
                  className="w-full text-left p-3 hover:bg-white/5 transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge size="xs">{n.sev}</SeverityBadge>
                      <span className="text-[10px] text-muted font-mono">{n.time} ago</span>
                    </div>
                    <div className="text-slate-200 text-xs font-medium leading-snug group-hover:text-white transition-colors">
                      {n.t}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-muted/50 group-hover:text-accent transition-colors shrink-0 mt-1" />
                </button>
              ))
            )}
          </div>

          <div className="p-2 text-center">
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/threats'); }}
              className="text-xs text-accent font-medium hover:underline inline-flex items-center gap-1"
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
