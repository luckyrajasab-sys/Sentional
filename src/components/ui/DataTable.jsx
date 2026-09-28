import { useState, useMemo } from 'react'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { SkeletonTable } from './SkeletonLoader'

export function DataTable({
  cols,
  rows,
  onRow,
  loading = false,
  emptyTitle = 'No records found',
  emptyDesc = 'Try adjusting your search query or filter options.',
  onEmptyReset = null,
  keyField = 'id',
  hoverable = true,
  className = ''
}) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (k) => {
    if (sortCol === k) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(k)
      setSortDir('asc')
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortCol) return rows
    return [...rows].sort((a, b) => {
      let aVal = a[sortCol]
      let bVal = b[sortCol]

      // numeric check
      if (typeof aVal === 'string' && !isNaN(Number(aVal))) aVal = Number(aVal)
      if (typeof bVal === 'string' && !isNaN(Number(bVal))) bVal = Number(bVal)

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [rows, sortCol, sortDir])

  if (loading) {
    return <SkeletonTable rows={5} cols={cols.length} />
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDesc}
        onReset={onEmptyReset}
      />
    )
  }

  return (
    <div className={`card overflow-hidden border border-line ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-line bg-panel/70 select-none">
              {cols.map((c) => (
                <th
                  key={c.k}
                  scope="col"
                  onClick={() => c.sortable !== false && handleSort(c.k)}
                  className={`label px-4 py-3.5 text-xs text-muted ${
                    c.sortable !== false ? 'cursor-pointer hover:text-white transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{c.h}</span>
                    {c.sortable !== false && (
                      <span className="text-muted/60">
                        {sortCol === c.k ? (
                          sortDir === 'asc' ? <ChevronUp size={12} className="text-accent" /> : <ChevronDown size={12} className="text-accent" />
                        ) : (
                          <ArrowUpDown size={11} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40 font-normal">
            {sortedRows.map((r, i) => {
              const rowKey = r[keyField] || r.hash || r.handle || i
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRow && onRow(r)}
                  onKeyDown={(e) => {
                    if (onRow && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onRow(r)
                    }
                  }}
                  tabIndex={onRow ? 0 : undefined}
                  role={onRow ? 'button' : undefined}
                  className={`transition-colors duration-150 ${
                    hoverable ? 'hover:bg-white/[0.04]' : ''
                  } ${onRow ? 'cursor-pointer focus-visible:bg-white/[0.06] focus-visible:outline-none' : ''}`}
                >
                  {cols.map((c) => (
                    <td key={c.k} className="px-4 py-3 text-slate-200 whitespace-nowrap text-xs">
                      {c.r ? c.r(r) : r[c.k] ?? '—'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 bg-panel/30 border-t border-line text-[11px] text-muted flex items-center justify-between">
        <span>Showing {sortedRows.length} total records</span>
        <span className="text-accent/80 font-mono">SOC Real-time View</span>
      </div>
    </div>
  )
}
