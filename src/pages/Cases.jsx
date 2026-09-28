import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Plus,
  FileDown,
  Printer,
  Shield,
  Link2,
  Clock,
  User,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import {
  PageHead,
  SeverityBadge,
  EvidenceHashBadge,
  Tooltip
} from '../components/ui'
import { useApp } from '../context/AppContext'

export function Cases() {
  const navigate = useNavigate()
  const { cases, role, addNoteToCase } = useApp()
  const [activeCaseId, setActiveCaseId] = useState(cases[0]?.id || '')
  const [noteInput, setNoteInput] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0]

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!noteInput.trim()) return
    addNoteToCase(activeCase.id, noteInput.trim())
    setNoteInput('')
  }

  const handlePrintPdf = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <PageHead
        title="Case Management & Intelligence Dossiers"
        sub="Incident Response & Legal Evidentiary Packaging"
        subtitle="Consolidate flagged social manipulation threats, suspect accounts, and blockchain-anchored evidence hashes into structured SOC case files for law enforcement or regulatory reporting."
        badge={<Tooltip termKey="hashAnchoring" />}
      >
        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <FileDown size={14} />
          <span>Export Case PDF Report</span>
        </button>
      </PageHead>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {cases.map((c) => {
          const isActive = c.id === activeCaseId
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCaseId(c.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 ${
                isActive
                  ? 'bg-accent/15 border border-accent/40 text-white shadow-glow-cyan'
                  : 'text-muted hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Briefcase size={14} className={isActive ? 'text-accent' : 'text-muted'} />
              <span className="font-mono">{c.id}</span>
              <SeverityBadge size="xs">{c.priority}</SeverityBadge>
            </button>
          )
        })}
      </div>

      {activeCase && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Case Details & Linked Artifacts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Overview Card */}
            <div className="card p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-accent font-semibold">{activeCase.id}</span>
                    <SeverityBadge size="xs">{activeCase.priority}</SeverityBadge>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-line text-slate-300">
                      {activeCase.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1.5">{activeCase.title}</h2>
                </div>
                <div className="text-right text-xs text-muted font-mono">
                  <div>Created: {activeCase.createdAt}</div>
                  <div className="text-slate-300 mt-0.5">Lead: {activeCase.owner}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-bg/60 p-3 rounded-lg border border-line">
                {activeCase.summary}
              </p>
            </div>

            {/* Linked Threats & Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Linked Threats */}
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="label text-muted">Linked Threats ({activeCase.threatIds.length})</div>
                  <button
                    type="button"
                    onClick={() => navigate('/threats')}
                    className="text-[11px] text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Browse Threats</span>
                    <ExternalLink size={10} />
                  </button>
                </div>
                <div className="space-y-2">
                  {activeCase.threatIds.map((tid) => (
                    <div
                      key={tid}
                      onClick={() => navigate(`/threats?id=${tid}`)}
                      className="p-2 rounded bg-panel-light/30 border border-line hover:border-accent/40 flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <span className="font-mono font-medium text-white group-hover:text-accent transition-colors">
                        {tid}
                      </span>
                      <span className="text-muted text-[11px] flex items-center gap-1">
                        Inspect <ArrowRight size={11} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Suspect Accounts */}
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="label text-muted">Suspect Accounts ({activeCase.accountHandles.length})</div>
                  <button
                    type="button"
                    onClick={() => navigate('/accounts')}
                    className="text-[11px] text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Browse Accounts</span>
                    <ExternalLink size={10} />
                  </button>
                </div>
                <div className="space-y-2">
                  {activeCase.accountHandles.map((handle) => (
                    <div
                      key={handle}
                      onClick={() => navigate(`/accounts?handle=${handle}`)}
                      className="p-2 rounded bg-panel-light/30 border border-line hover:border-accent/40 flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <span className="font-mono font-medium text-white group-hover:text-accent transition-colors">
                        {handle}
                      </span>
                      <span className="text-muted text-[11px] flex items-center gap-1">
                        Inspect <ArrowRight size={11} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockchain Sealed Evidence Hashes */}
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="label text-cyan-300 flex items-center gap-1.5">
                  <Link2 size={13} />
                  <span>Anchored Case Evidence Hashes ({activeCase.evidenceHashes.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/verification')}
                  className="text-xs text-accent hover:underline"
                >
                  Verify All Hashes On-Chain &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {activeCase.evidenceHashes.map((h, i) => (
                  <div key={h + i} className="p-2.5 rounded bg-bg border border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-cyan-300 break-all">{h}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/verification?hash=${h}`)}
                      className="btn-ghost text-[10px] py-1 px-2 whitespace-nowrap"
                    >
                      Verify Match
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analyst Notes & Activity Timeline */}
          <div className="space-y-4">
            <div className="card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="label text-muted flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-accent" />
                  <span>Analyst Working Notes</span>
                </div>
                <span className="text-[11px] text-muted">{activeCase.notes.length} entries</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  className="input text-xs h-20 resize-none"
                  placeholder="Record an investigation update, CERT referral, or evidence link..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  disabled={role === 'Viewer'}
                />
                <button
                  type="submit"
                  disabled={role === 'Viewer' || !noteInput.trim()}
                  className="btn text-xs w-full py-1.5"
                >
                  Post Note
                </button>
                {role === 'Viewer' && (
                  <div className="text-[10px] text-muted text-center">Viewer role is read-only</div>
                )}
              </form>

              {/* Notes Feed */}
              <div className="space-y-3 pt-2 max-h-96 overflow-y-auto divide-y divide-line/40">
                {activeCase.notes.map((note) => (
                  <div key={note.id} className="pt-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted">
                      <span className="font-medium text-slate-200">{note.author}</span>
                      <span className="font-mono text-[10px]">{note.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF EVIDENCE REPORT PREVIEW MODAL */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto flex justify-center items-start pt-8"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-3xl bg-slate-900 text-slate-100 border border-line-light rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-line pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <span className="font-bold text-sm">Evidence Dossier Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="btn text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Printer size={13} />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  Close
                </button>
              </div>
            </div>

            {/* PRINTABLE DOSSIER CONTENT */}
            <div className="p-6 bg-slate-950 rounded-lg border border-line space-y-6 text-xs text-slate-200 font-sans print:bg-white print:text-black print:border-none">
              {/* Header */}
              <div className="border-b-2 border-accent pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                    SENTINEL CYBER & SOCIAL INTELLIGENCE DOSSIER
                  </h1>
                  <p className="text-[11px] text-muted print:text-gray-600 mt-0.5">
                    Problem ID: SIH26152 • Blockchain & Cybersecurity Evidentiary Record
                  </p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="text-accent font-bold">CLASSIFICATION: LAW ENFORCEMENT ONLY</div>
                  <div className="text-muted print:text-gray-600">Case ID: {activeCase?.id}</div>
                </div>
              </div>

              {/* Case Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-panel p-3 rounded print:bg-gray-100">
                <div>
                  <div className="text-muted text-[10px] uppercase">Incident Lead</div>
                  <div className="font-semibold text-white print:text-black">{activeCase?.owner}</div>
                </div>
                <div>
                  <div className="text-muted text-[10px] uppercase">Priority</div>
                  <div className="font-semibold text-red-400">{activeCase?.priority}</div>
                </div>
                <div>
                  <div className="text-muted text-[10px] uppercase">Creation Time</div>
                  <div className="font-mono text-white print:text-black">{activeCase?.createdAt}</div>
                </div>
                <div>
                  <div className="text-muted text-[10px] uppercase">Chain Anchored</div>
                  <div className="font-mono text-emerald-400">Polygon #1928374</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="font-bold text-sm text-white print:text-black mb-1">
                  1. Executive Briefing & Incident Overview
                </h3>
                <p className="leading-relaxed text-slate-300 print:text-gray-800">
                  {activeCase?.summary}
                </p>
              </div>

              {/* Suspect Accounts */}
              <div>
                <h3 className="font-bold text-sm text-white print:text-black mb-1">
                  2. Suspect Entities & Automated Bot Nodes
                </h3>
                <div className="p-3 bg-panel rounded border border-line print:bg-gray-50 print:border-gray-300 space-y-1">
                  {activeCase?.accountHandles.map((h) => (
                    <div key={h} className="font-mono text-cyan-300 print:text-blue-800">
                      • {h} (Flagged for Coordinated Inauthentic Behavior)
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic SHA-256 Hashes */}
              <div>
                <h3 className="font-bold text-sm text-white print:text-black mb-1">
                  3. Tamper-Proof Cryptographic Blockchain Signatures
                </h3>
                <p className="text-[11px] text-muted print:text-gray-600 mb-2">
                  The following SHA-256 hashes represent the sealed raw JSON tweet/broadcast artifacts. Tampering with any byte will break proof validity.
                </p>
                <div className="space-y-1.5">
                  {activeCase?.evidenceHashes.map((h, i) => (
                    <div key={h + i} className="font-mono text-[10px] break-all bg-bg p-2 rounded border border-line print:bg-gray-100 print:text-black">
                      [EVIDENCE #{i + 1}] SHA-256: {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigator Sign-off */}
              <div className="border-t border-line pt-4 flex justify-between items-end print:border-gray-400">
                <div className="space-y-1 text-[11px] text-muted print:text-gray-600">
                  <div>Digital Hash: 0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73</div>
                  <div>Smart Contract: 0x71b4892e3892019ffea8291038471928 (Polygon Testnet)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-white print:text-black">CERT-In Referral Ready</div>
                  <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">STATUS: SEALED & ADMISSIBLE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
