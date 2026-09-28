import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import { Login, Register } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Threats from './pages/Threats'
import Accounts from './pages/Accounts'
import Network from './pages/Network'
import { Cases } from './pages/Cases'
import { Verification } from './pages/Verification'
import Blockchain from './pages/Blockchain'
import AuditTrail from './pages/AuditTrail'
import { Sentiment, Trends, GeoMap, Reports, About } from './pages/Modules'

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* SOC Authenticated Operations Layout */}
      <Route element={<AppLayout />}>
        {/* Overview */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Analyze */}
        <Route path="/sentiment" element={<Sentiment />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/network" element={<Network />} />
        <Route path="/map" element={<GeoMap />} />

        {/* Investigate */}
        <Route path="/threats" element={<Threats />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/verification" element={<Verification />} />

        {/* Trust & Audit */}
        <Route path="/blockchain" element={<Blockchain />} />
        <Route path="/audit" element={<AuditTrail />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
