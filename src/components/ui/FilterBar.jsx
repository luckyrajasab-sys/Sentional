import { useSearchParams } from 'react-router-dom'
import { Search, X, Filter } from 'lucide-react'

export function FilterBar({
  showSearch = true,
  searchPlaceholder = 'Filter by keyword...',
  filters = [
    {
      key: 'platform',
      label: 'Platform',
      options: ['All Platforms', 'X', 'Reddit', 'YouTube', 'Telegram']
    },
    {
      key: 'risk',
      label: 'Risk Level',
      options: ['All Severities', 'Critical', 'High', 'Medium', 'Low']
    },
    {
      key: 'range',
      label: 'Time Range',
      options: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days']
    }
  ],
  customControls = null
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSearch = searchParams.get('q') || ''

  const handleSelectChange = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (!val || val.startsWith('All')) {
      next.delete(key)
    } else {
      next.set(key, val)
    }
    setSearchParams(next, { replace: true })
  }

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams)
    if (!val) {
      next.delete('q')
    } else {
      next.set('q', val)
    }
    setSearchParams(next, { replace: true })
  }

  const handleReset = () => {
    const next = new URLSearchParams()
    // preserve id or tab if present, otherwise clear
    if (searchParams.get('tab')) next.set('tab', searchParams.get('tab'))
    setSearchParams(next, { replace: true })
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some(k => k !== 'tab')

  return (
    <div className="card p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 bg-panel/60 border-line">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider mr-1">
          <Filter size={13} className="text-accent" />
          <span>Filters</span>
        </div>

        {showSearch && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              className="input pl-8.5 py-1.5 text-xs rounded-lg"
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Filter keyword"
            />
            {currentSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                aria-label="Clear keyword search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {filters.map((f) => {
          const activeVal = searchParams.get(f.key) || f.options[0]
          return (
            <select
              key={f.key}
              value={activeVal}
              onChange={(e) => handleSelectChange(f.key, e.target.value)}
              aria-label={f.label}
              className="bg-bg border border-line rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-accent hover:border-line-light cursor-pointer"
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt} className="bg-panel text-slate-200">
                  {opt}
                </option>
              ))}
            </select>
          )
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-accent hover:underline flex items-center gap-1 px-2 py-1 rounded"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {customControls && (
        <div className="flex items-center gap-2">
          {customControls}
        </div>
      )}
    </div>
  )
}
