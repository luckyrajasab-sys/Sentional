import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2 } from 'lucide-react'
const pts=[[80,90],[200,60],[320,120],[140,220],[280,260],[220,340],[70,320]]
const Shell=({title,reg})=>{const go=useNavigate(),[l,setL]=useState(false)
const sub=e=>{e.preventDefault();setL(true);setTimeout(()=>go('/dashboard'),700)}
return(<div className="min-h-screen grid lg:grid-cols-2"><form onSubmit={sub} className="flex flex-col justify-center max-w-sm w-full mx-auto p-6 gap-4">
<Shield className="text-accent"/><h1 className="text-2xl font-semibold">{title}</h1>
{reg&&<input className="input" placeholder="Full name" required/>}<input className="input" type="email" placeholder="Email" required/><input className="input" type="password" placeholder="Password" required/>
{!reg&&<div className="flex justify-between text-xs text-muted"><label><input type="checkbox" className="mr-2"/>Remember me</label><a href="#" className="text-accent">Forgot password?</a></div>}
<button className="btn justify-center">{l&&<Loader2 size={14} className="animate-spin"/>}{reg?'Create account':'Sign in'}</button>
<p className="text-xs text-muted">{reg?<>Have an account? <Link className="text-accent" to="/login">Sign in</Link></>:<>New here? <Link className="text-accent" to="/register">Register</Link></>} Demo only, no real auth.</p></form>
<div className="hidden lg:block bg-panel border-l border-line"><svg className="w-full h-full" viewBox="0 0 400 400">{pts.map(([x,y],i)=><g key={i}><line x1={x} y1={y} x2={pts[(i+2)%7][0]} y2={pts[(i+2)%7][1]} stroke="#22d3ee" strokeOpacity=".25"/><circle cx={x} cy={y} r="6" fill="#22d3ee"><animate attributeName="r" values="5;9;5" dur={(2+i*.3)+'s'} repeatCount="indefinite"/></circle></g>)}</svg></div></div>)}
export const Login=()=><Shell title="Sign in to Sentinel"/>
export const Register=()=><Shell title="Create your account" reg/>
