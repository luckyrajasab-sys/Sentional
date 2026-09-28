import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Smile, TrendingUp, Share2, UserSearch, ShieldAlert, BadgeCheck, Link2, Globe, FileText, Settings, HelpCircle, Search, Bell, Menu, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { notifications } from '../data'
const nav=[['/dashboard','Overview',LayoutDashboard],['/sentiment','Sentiment',Smile],['/trends','Trends',TrendingUp],['/network','Network',Share2],['/accounts','Accounts',UserSearch],['/threats','Threats',ShieldAlert],['/verification','Verification',BadgeCheck],['/blockchain','Blockchain',Link2],['/map','Geo Intelligence',Globe],['/reports','Reports',FileText]]
export default function AppLayout(){
  const [open,setOpen]=useState(false),[cmd,setCmd]=useState(false),[bell,setBell]=useState(false),[q,setQ]=useState('')
  const go=useNavigate(),loc=useLocation()
  useEffect(()=>{const h=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setCmd(c=>!c)}if(e.key==='Escape')setCmd(false)};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)},[])
  const results=nav.filter(n=>n[1].toLowerCase().includes(q.toLowerCase()))
  const link=({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive?'bg-accent/10 text-accent':'text-muted hover:text-white hover:bg-white/5'}`
  return(<div className="min-h-screen flex">
    <aside className={`fixed lg:sticky top-0 z-30 h-screen w-60 shrink-0 bg-panel border-r border-line flex flex-col p-4 transition-transform ${open?'':'-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center gap-2 mb-8 px-2"><Shield className="text-accent"/><div><div className="font-semibold leading-none">Sentinel</div><div className="label mt-1">Social Intelligence</div></div></div>
      <nav className="flex-1 space-y-1">{nav.map(([to,l,I])=><NavLink key={to} to={to} className={link} onClick={()=>setOpen(false)}><I size={16}/>{l}</NavLink>)}</nav>
      <div className="space-y-1 border-t border-line pt-3"><a className={link({})}><Settings size={16}/>Settings</a><a className={link({})}><HelpCircle size={16}/>Help</a>
      <div className="flex items-center gap-2 px-3 pt-2"><div className="w-7 h-7 rounded-full bg-accent/20 grid place-items-center text-xs">A</div><div className="text-xs">Analyst<div className="text-muted">Demo user</div></div></div></div>
    </aside>
    <div className="flex-1 min-w-0">
      <header className="sticky top-0 z-20 h-14 bg-bg/90 backdrop-blur border-b border-line flex items-center gap-3 px-4">
        <button className="lg:hidden" onClick={()=>setOpen(!open)}><Menu size={20}/></button>
        <button onClick={()=>setCmd(true)} className="flex-1 max-w-md flex items-center gap-2 bg-panel border border-line rounded-lg px-3 py-1.5 text-sm text-muted"><Search size={14}/>Search accounts, posts, threats...<kbd className="ml-auto text-[10px] border border-line rounded px-1">Ctrl K</kbd></button>
        <span className="hidden sm:flex items-center gap-2 text-xs text-muted ml-auto"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>All systems operational</span>
        <div className="relative"><button onClick={()=>setBell(!bell)} className="p-2"><Bell size={18}/></button>
          {bell&&<motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="absolute right-0 top-10 w-72 card p-2">{notifications.map(n=><div key={n.t} className="p-2 text-sm hover:bg-white/5 rounded">{n.t}<div className="text-xs text-muted">{n.time} ago</div></div>)}</motion.div>}</div>
      </header>
      <main className="p-4 sm:p-6 max-w-[1800px] mx-auto"><motion.div key={loc.pathname} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><Outlet/></motion.div></main>
    </div>
    {cmd&&<div className="fixed inset-0 z-50 bg-black/60 pt-24 px-4" onClick={()=>setCmd(false)}><div className="card w-full max-w-lg mx-auto p-2" onClick={e=>e.stopPropagation()}>
      <input autoFocus className="input mb-2" placeholder="Type to search pages..." value={q} onChange={e=>setQ(e.target.value)}/>
      {results.map(([to,l,I])=><button key={to} onClick={()=>{go(to);setCmd(false);setQ('')}} className="w-full flex items-center gap-3 p-2 text-sm rounded hover:bg-white/5"><I size={15}/>{l}</button>)}
      <div className="label p-2">Ctrl K toggle - Esc close</div></div></div>}
  </div>)
}
