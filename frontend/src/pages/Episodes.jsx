import {useEffect,useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useGet} from "../hooks.js";
import EpisodeCard,{CardSkeleton} from "../components/EpisodeCard.jsx";
const topics=["All","Basics","Markets","Investing"];
export default function Episodes(){
  const [sp,setSp]=useSearchParams();
  const topic=sp.get("topic")||"All";
  const [q,setQ]=useState("");const [dq,setDq]=useState("");
  useEffect(()=>{const t=setTimeout(()=>setDq(q),250);return()=>clearTimeout(t);},[q]);
  const {data,loading,err}=useGet("/episodes",{q:dq||undefined,topic:topic==="All"?undefined:topic});
  const pick=t=>setSp(t==="All"?{}:{topic:t});
  return(<section className="max-w-6xl mx-auto px-5 py-10">
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">All episodes</h1>
    <p className="mt-3 text-xl text-ink/75 max-w-xl">Pick a topic or search for a word you keep hearing and never quite understood.</p>
    <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center">
      <label htmlFor="q" className="sr-only">Search episodes</label>
      <input id="q" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search IPO, mutual funds, demat..." className="flex-1 px-5 py-3 rounded-full border-2 border-ink bg-white"/>
      <div className="flex gap-2 flex-wrap">{topics.map(t=><button key={t} onClick={()=>pick(t)} aria-pressed={topic===t} className={`px-5 py-2 rounded-full border-2 border-ink font-semibold ${topic===t?"bg-ink text-white":"bg-white hover:bg-mist"}`}>{t}</button>)}</div>
    </div>
    {err&&<p className="mt-8 text-loss" role="alert">{err}</p>}
    {!err&&!loading&&data&&<p className="mt-8 ui font-semibold text-ink/70">{data.length} {data.length===1?"episode":"episodes"}</p>}
    {!err&&!loading&&data&&data.length===0&&<p className="mt-4">No episodes match that search. Try a different word or choose All.</p>}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">{loading&&!data?<CardSkeleton n={6}/>:(data||[]).map(e=><EpisodeCard key={e._id} e={e}/>)}</div>
  </section>);
}
