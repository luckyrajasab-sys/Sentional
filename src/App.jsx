import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import { Login, Register } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { Sentiment, Trends, Network, Accounts, Threats, Verification, Blockchain, GeoMap, Reports, About } from './pages/Modules'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<AppLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/sentiment" element={<Sentiment/>}/>
        <Route path="/trends" element={<Trends/>}/>
        <Route path="/network" element={<Network/>}/>
        <Route path="/accounts" element={<Accounts/>}/>
        <Route path="/threats" element={<Threats/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/blockchain" element={<Blockchain/>}/>
        <Route path="/map" element={<GeoMap/>}/>
        <Route path="/reports" element={<Reports/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/"/>}/>
    </Routes>
  )
}
