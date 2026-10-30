import {Routes,Route,Link,NavLink,useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Home from "./pages/Home.jsx";
import Episodes from "./pages/Episodes.jsx";
import Episode from "./pages/Episode.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Payment from "./pages/Payment.jsx";
export default function App(){
  const {pathname}=useLocation();
  const [user,setUser]=useState(()=>{if(!localStorage.getItem("ss_token"))return null;try{return JSON.parse(localStorage.getItem("ss_user")||"null");}catch{return null;}});
  const [hasToken,setHasToken]=useState(()=>!!localStorage.getItem("ss_token"));
  useEffect(()=>{window.scrollTo(0,0);},[pathname]);
  useEffect(()=>{
    const syncUser=()=>{const token=!!localStorage.getItem("ss_token");setHasToken(token);if(!token){setUser(null);return;}try{setUser(JSON.parse(localStorage.getItem("ss_user")||"null"));}catch{setUser(null);}};
    window.addEventListener("ss-auth-change",syncUser);
    window.addEventListener("storage",syncUser);
    return()=>{window.removeEventListener("ss-auth-change",syncUser);window.removeEventListener("storage",syncUser);};
  },[]);
  const logout=()=>{localStorage.removeItem("ss_token");localStorage.removeItem("ss_user");setHasToken(false);setUser(null);window.dispatchEvent(new Event("ss-auth-change"));};
  const dark=pathname==="/";
  const nav=({isActive})=>`px-4 py-2 rounded-full ui font-semibold ${isActive?"bg-saffron text-ink":dark?"hover:bg-white/10":"hover:bg-mist"}`;
  return(<div className="min-h-screen flex flex-col">
    <header className={dark?"bg-ink text-white":"bg-paper"}>
      <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 ui font-extrabold text-xl tracking-tight">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill={dark?"#13214A":"#0B1530"}/><path d="M5 23l7-8 5 4 10-12" stroke="#FFB400" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Stock Simplified</Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-1 mt-3 md:mt-0">
          <NavLink to="/" end className={nav}>Home</NavLink>
          <NavLink to="/episodes" className={nav}>Episodes</NavLink>
          <NavLink to="/payment" className={nav}>Premium</NavLink>
          {!hasToken&&!user&&<NavLink to="/login" className={nav}>Sign up / Log in</NavLink>}
          {(hasToken||user)&&user?.role!=="admin"&&<NavLink to="/account" className={nav}>My account</NavLink>}
          {user?.role==="admin"&&<NavLink to="/admin" className={nav}>Admin dashboard</NavLink>}
          {(hasToken||user)&&<button type="button" onClick={logout} className={`px-4 py-2 rounded-full ui font-semibold ${dark?"border border-white/30 hover:bg-white/10":"border border-mist hover:bg-mist"}`}>Log out</button>}
        </nav>
      </div></header>
    <main className="flex-1"><Routes>
      <Route path="/" element={<Home/>}/><Route path="/episodes" element={<Episodes/>}/>
      <Route path="/episodes/:slug" element={<Episode/>}/><Route path="/payment" element={<Payment/>}/><Route path="/login" element={<Login/>}/><Route path="/account" element={<Account/>}/><Route path="/admin" element={<Admin/>}/>
      <Route path="*" element={<div className="max-w-6xl mx-auto px-5 py-20"><h1 className="text-4xl font-bold">Page not found</h1><Link className="underline mt-4 inline-block" to="/episodes">Browse all episodes</Link></div>}/>
    </Routes></main>
    <footer className="bg-ink text-white/80 text-base"><div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <p className="max-w-xl">Stock Simplified is for learning, not financial advice. Do your own research before you invest.</p>
      <div className="flex flex-wrap gap-x-5 gap-y-3 ui font-semibold">
        <Link to="/episodes" className="hover:text-saffron">Episodes</Link>
        <Link to="/payment" className="hover:text-saffron">Premium</Link>
        {!hasToken&&!user&&<Link to="/login" className="hover:text-saffron">Sign up / Log in</Link>}
        {(hasToken||user)&&user?.role!=="admin"&&<Link to="/account" className="hover:text-saffron">My account</Link>}
        {user?.role==="admin"&&<Link to="/admin" className="hover:text-saffron">Admin dashboard</Link>}
      </div></div></footer>
  </div>);
}
