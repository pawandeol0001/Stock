import {useState} from "react";
import {Link} from "react-router-dom";
import api,{errMsg} from "../api.js";
import {useGet} from "../hooks.js";
import {ts} from "../utils.js";
import Ticker from "../components/Ticker.jsx";
import StoryChart from "../components/StoryChart.jsx";
import EpisodeCard,{CardSkeleton} from "../components/EpisodeCard.jsx";
const steps=[
  ["Meet someone with a problem","A chai seller, a baker, a group of friends ordering lunch. Real situations, not charts."],
  ["Watch the concept appear","The idea turns up as the answer to their problem, so it makes sense before it gets a name."],
  ["Leave with one clear idea","Each episode ends on a single takeaway you can explain to a friend."]];
const topics=[["Basics","Shares, demat accounts and the words everyone throws around."],["Markets","IPOs, exchanges and indexes: where and how trading happens."],["Investing","Mutual funds, SIPs and ways to grow money slowly."]];
export default function Home(){
  const {data:eps,err}=useGet("/episodes");
  const [email,setEmail]=useState("");const [msg,setMsg]=useState({ok:false,text:""});
  const first=eps&&eps[0];
  const subscribe=async ev=>{ev.preventDefault();try{await api.post("/subscribe",{email});setMsg({ok:true,text:"You're subscribed. New episodes will land in your inbox."});setEmail("");}catch(e){setMsg({ok:false,text:errMsg(e)});}};
  return(<>
    <section className="bg-ink text-white"><div className="max-w-6xl mx-auto px-5 pt-8 pb-16 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.04] tracking-tight">The stock market, told as stories you'll actually remember.</h1>
        <p className="mt-6 text-xl text-white/80 max-w-lg leading-relaxed">Short episodes on shares, IPOs, NSE and BSE, mutual funds and more. Each one runs under 12 minutes and needs no finance background.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={first?`/episodes/${first.slug}`:"/episodes"} className="bg-saffron text-ink ui font-bold px-6 py-3 rounded-full hover:bg-white">Start with episode 1</Link>
          <Link to="/episodes" className="border-2 border-white/40 ui font-bold px-6 py-3 rounded-full hover:bg-white/10">Browse all episodes</Link></div>
      </div>
      <div className="bg-navy rounded-3xl p-5 md:p-7 border border-white/10">
        <StoryChart episodes={eps}/>
        <p className="mt-3 ui text-sm text-white/70">Every point on the line is an episode. Tap one to open it.</p></div>
    </div></section>
    <Ticker episodes={eps}/>
    <section className="max-w-6xl mx-auto px-5 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How every episode works</h2>
      <ol className="mt-8 grid md:grid-cols-3 gap-8">{steps.map(([t,d],i)=>(
        <li key={t} className="border-t-4 border-ink pt-4"><span className="ui font-extrabold text-4xl text-saffron">{i+1}</span>
          <h3 className="text-xl font-bold mt-2">{t}</h3><p className="mt-2 text-ink/75 leading-relaxed">{d}</p></li>))}</ol>
    </section>
    <section className="max-w-6xl mx-auto px-5 pb-16">
      <div className="flex items-end justify-between gap-4"><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Latest episodes</h2>
        <Link to="/episodes" className="underline ui font-semibold">See all</Link></div>
      {err&&<p className="mt-4 text-loss" role="alert">{err}</p>}
      <div className="grid md:grid-cols-3 gap-6 mt-8">{!eps&&!err?<CardSkeleton/>:(eps||[]).slice(-3).reverse().map(e=><EpisodeCard key={e._id} e={e}/>)}</div>
    </section>
    <section className="max-w-6xl mx-auto px-5 pb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pick a topic</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-8">{topics.map(([t,d])=>{const s=ts(t);const c=(eps||[]).filter(e=>e.topic===t).length;
        return(<Link key={t} to={`/episodes?topic=${t}`} className={`${s.band} rounded-2xl p-6 border border-mist hover:shadow-lift transition`}>
          <span className={`${s.chip} ui font-bold text-sm px-2.5 py-1 rounded-md`}>{t}</span>
          <p className="mt-4 text-lg leading-snug">{d}</p><p className="mt-3 ui font-bold text-sm">{c} {c===1?"episode":"episodes"}</p></Link>);})}</div>
    </section>
    <section className="bg-saffron"><div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-8 items-center">
      <div><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Get new episodes in your inbox</h2><p className="mt-3">One short email when a new story is out. No spam.</p></div>
      <form onSubmit={subscribe}><div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="email" className="sr-only">Email address</label>
        <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 px-4 py-3 rounded-full border-2 border-ink bg-white"/>
        <button className="bg-ink text-white px-7 py-3 rounded-full font-bold">Subscribe</button></div>
        {msg.text&&<p role="status" className={`mt-3 ui font-semibold ${msg.ok?"text-ink":"text-loss"}`}>{msg.text}</p>}</form>
    </div></section></>);
}
