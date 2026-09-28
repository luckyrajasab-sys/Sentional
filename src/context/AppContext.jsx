import { createContext, useContext, useState, useEffect } from 'react'
import {
  initialThreats,
  initialAccounts,
  initialCases,
  initialAuditTrail,
  chain as initialChain,
  tourSteps
} from '../data'

const AppContext = createContext(null)

// Utility to generate simulated SHA-256 hash in browser
export async function computeSHA256(text) {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text + Date.now())
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return '0x' + Math.random().toString(16).substring(2) + 'a184e92b874c'
  }
}

export function AppProvider({ children }) {
  // Role-based view state: 'Analyst' | 'Admin' | 'Viewer'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('sentinel_role') || 'Analyst'
  })

  // Data states with persistence/in-memory mutations for triage demo
  const [threats, setThreats] = useState(initialThreats)
  const [accounts, setAccounts] = useState(initialAccounts)
  const [cases, setCases] = useState(initialCases)
  const [auditTrail, setAuditTrail] = useState(initialAuditTrail)
  const [chainLedger, setChainLedger] = useState(initialChain)

  // 5-Step Guided Tour State
  const [tourOpen, setTourOpen] = useState(() => {
    return !localStorage.getItem('sentinel_tour_completed')
  })
  const [tourStep, setTourStep] = useState(1)

  useEffect(() => {
    localStorage.setItem('sentinel_role', role)
  }, [role])

  // Audit Log Appender
  const addAuditLog = async (action, target, customHash = null) => {
    const generatedHash = customHash || (await computeSHA256(action + target))
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      user: role === 'Admin' ? 'Marcus Cole' : role === 'Analyst' ? 'Sarah Chen' : 'Auditor (Viewer)',
      role,
      action,
      target,
      ip: '10.240.14.' + Math.floor(Math.random() * 80 + 10),
      hash: generatedHash
    }
    setAuditTrail(prev => [newEntry, ...prev])
    return newEntry
  }

  // Triage Actions
  const updateThreatStatus = async (threatId, newStatus) => {
    if (role === 'Viewer') return alert('Viewer role is read-only. Switch role in user menu to perform triage.')
    setThreats(prev => prev.map(t => t.id === threatId ? { ...t, status: newStatus } : t))
    await addAuditLog(`STATUS_CHANGE_${newStatus.toUpperCase()}`, `Threat ${threatId}`)
  }

  const escalateThreat = async (threatId) => {
    if (role === 'Viewer') return alert('Viewer role is read-only.')
    setThreats(prev => prev.map(t => t.id === threatId ? { ...t, escalated: true, status: 'Investigating', sev: 'Critical' } : t))
    await addAuditLog('ESCALATE_THREAT', `Escalated threat ${threatId} to Critical priority`)
  }

  const dismissThreat = async (threatId) => {
    if (role === 'Viewer') return alert('Viewer role is read-only.')
    setThreats(prev => prev.map(t => t.id === threatId ? { ...t, status: 'Resolved' } : t))
    await addAuditLog('DISMISS_THREAT', `Dismissed/Resolved threat ${threatId}`)
  }

  const assignThreat = async (threatId, assignee) => {
    if (role === 'Viewer') return alert('Viewer role is read-only.')
    setThreats(prev => prev.map(t => t.id === threatId ? { ...t, assignee } : t))
    await addAuditLog('ASSIGN_THREAT', `Assigned threat ${threatId} to ${assignee}`)
  }

  // Case Management Actions
  const addNoteToCase = async (caseId, text) => {
    if (role === 'Viewer') return alert('Viewer role is read-only.')
    const note = {
      id: `N-${Date.now()}`,
      author: role === 'Admin' ? 'Marcus Cole (Admin)' : 'Sarah Chen (Analyst)',
      time: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      text
    }
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, notes: [...c.notes, note] } : c))
    await addAuditLog('ADD_CASE_NOTE', `Added analyst note to ${caseId}`)
  }

  const addItemToCase = async (caseId, itemType, itemId, itemHash) => {
    if (role === 'Viewer') return alert('Viewer role is read-only.')
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c
      const threatIds = itemType === 'threat' && !c.threatIds.includes(itemId) ? [...c.threatIds, itemId] : c.threatIds
      const accountHandles = itemType === 'account' && !c.accountHandles.includes(itemId) ? [...c.accountHandles, itemId] : c.accountHandles
      const evidenceHashes = itemHash && !c.evidenceHashes.includes(itemHash) ? [...c.evidenceHashes, itemHash] : c.evidenceHashes
      return { ...c, threatIds, accountHandles, evidenceHashes }
    }))
    await addAuditLog('LINK_CASE_ITEM', `Linked ${itemType} ${itemId} to Case ${caseId}`, itemHash)
  }

  // Blockchain Anchoring Action
  const anchorEvidenceOnChain = async (title, metadata) => {
    const rawContent = title + JSON.stringify(metadata) + Date.now()
    const hash = await computeSHA256(rawContent)
    const blockNum = 1928374 + chainLedger.length + 1
    const newRecord = {
      hash,
      event: `Evidence Sealed: ${title}`,
      ts: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
      block: blockNum,
      status: 'Valid',
      gasUsed: `${Math.floor(Math.random() * 20000 + 32000)} Gwei`,
      contract: '0x71b4892e3892019ffea829103847192837461928 (SentinelStore.sol)',
      merkleRoot: '0x' + hash.slice(2, 10) + '...merkle',
      verified: true,
      item: title
    }
    setChainLedger(prev => [newRecord, ...prev])
    await addAuditLog('ANCHOR_EVIDENCE_BLOCKCHAIN', `Anchored ${title} on Block #${blockNum}`, hash)
    return newRecord
  }

  // Verification Search
  const verifyHashOnChain = (searchHash) => {
    const clean = searchHash.trim().toLowerCase()
    if (!clean) return null

    // Search in chain ledger
    const foundLedger = chainLedger.find(c => c.hash.toLowerCase() === clean || clean.includes(c.hash.toLowerCase().slice(0, 10)))
    if (foundLedger) {
      return { match: true, record: foundLedger, type: 'Ledger Evidence' }
    }

    // Search in threats
    const foundThreat = threats.find(t => t.hash.toLowerCase() === clean)
    if (foundThreat) {
      return {
        match: true,
        record: {
          hash: foundThreat.hash,
          event: `Threat Alert Sealed: ${foundThreat.id} (${foundThreat.type})`,
          ts: foundThreat.timestamp,
          block: foundThreat.block || 1928374,
          status: 'Valid',
          contract: '0x71b...882e (SentinelEvidenceStore.sol)'
        },
        type: 'Flagged Threat'
      }
    }

    // Search in accounts
    const foundAccount = accounts.find(a => a.hash.toLowerCase() === clean)
    if (foundAccount) {
      return {
        match: true,
        record: {
          hash: foundAccount.hash,
          event: `Account Risk Profile Quarantined: ${foundAccount.handle}`,
          ts: '2026-09-28 07:12 UTC',
          block: 1928320,
          status: 'Valid',
          contract: '0x71b...882e (SentinelEvidenceStore.sol)'
        },
        type: 'Account Profile'
      }
    }

    return { match: false, hash: searchHash }
  }

  // Tour controls
  const nextTourStep = () => {
    if (tourStep < tourSteps.length) setTourStep(s => s + 1)
    else closeTour()
  }
  const prevTourStep = () => {
    if (tourStep > 1) setTourStep(s => s - 1)
  }
  const closeTour = () => {
    setTourOpen(false)
    localStorage.setItem('sentinel_tour_completed', 'true')
  }
  const startTour = () => {
    setTourStep(1)
    setTourOpen(true)
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        threats,
        accounts,
        cases,
        auditTrail,
        chainLedger,
        updateThreatStatus,
        escalateThreat,
        dismissThreat,
        assignThreat,
        addNoteToCase,
        addItemToCase,
        anchorEvidenceOnChain,
        verifyHashOnChain,
        addAuditLog,
        // Tour
        tourOpen,
        tourStep,
        tourSteps,
        nextTourStep,
        prevTourStep,
        closeTour,
        startTour
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
