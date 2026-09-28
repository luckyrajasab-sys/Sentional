import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { technicalGlossary } from '../../data'

export function Tooltip({ text, termKey, children, className = '' }) {
  const [visible, setVisible] = useState(false)
  const termInfo = termKey ? technicalGlossary[termKey] : null
  const content = text || termInfo?.definition || ''
  const title = termInfo?.term || null

  return (
    <span
      className={`relative inline-flex items-center gap-1 group ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {!children && (
        <button
          type="button"
          aria-label={title || 'Technical definition'}
          className="text-muted/70 hover:text-accent transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <HelpCircle size={13} />
        </button>
      )}

      {visible && content && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 text-xs rounded-lg bg-panel border border-line-light shadow-xl text-slate-200 pointer-events-none animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {title && (
            <span className="block font-semibold text-accent mb-1 border-b border-line pb-1">
              {title}
            </span>
          )}
          <span className="block leading-relaxed">{content}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-line-light" />
        </span>
      )}
    </span>
  )
}
