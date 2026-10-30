import {useEffect,useState} from "react";
import {useParams,Link} from "react-router-dom";
import {useGet} from "../hooks.js";
import {ts} from "../utils.js";
import api,{errMsg} from "../api.js";
export default function Episode(){
  const {slug}=useParams();
  const {data:e,loading,err}=useGet(`/episodes/${slug}`);
  const {data:all}=useGet("/episodes");
  const [pct,setPct]=useState(0);const [copied,setCopied]=useState(false);const [saved,setSaved]=useState(false);const [saveMsg,setSaveMsg]=useState("");const [saving,setSaving]=useState(false);
  useEffect(()=>{if(!e?._id||!localStorage.getItem("ss_token")){setSaved(false);return;}api.get("/auth/me").then(r=>setSaved((r.data.user.savedEpisodes||[]).some(id=>(id._id||id).toString()===e._id))).catch(()=>setSaved(false));},[e?._id]);
  const toggleSave=async()=>{if(!localStorage.getItem("ss_token")){window.location.href="/login";return;}setSaving(true);setSaveMsg("");try{const r=await api.post(`/auth/saved/${e._id}`);setSaved(r.data.saved);setSaveMsg(r.data.message);}catch(err){setSaveMsg(errMsg(err));}finally{setSaving(false);}};
  useEffect(()=>{
    const on=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;setPct(max>0?(h.scrollTop/max)*100:0);};
    on();window.addEventListener("scroll",on,{passive:true});
    return()=>window.removeEventListener("scroll",on);
  },[]);
  const share=async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{window.prompt("Copy this link",window.location.href);}};
  if(err) return <div className="max-w-2xl mx-auto px-5 py-16"><p className="text-loss" role="alert">{err}</p><Link to="/episodes" className="underline">Back to all episodes</Link></div>;
  if(loading||!e) return <div className="max-w-2xl mx-auto px-5 py-16"><div className="h-10 w-2/3 bg-mist rounded animate-pulse"/><div className="h-64 mt-6 bg-mist rounded-2xl animate-pulse"/></div>;
  const s=ts(e.topic);
  const idx=all?all.findIndex(x=>x.slug===e.slug):-1;
  const prev=idx>0?all[idx-1]:null;const next=idx>=0&&idx<all.length-1?all[idx+1]:null;
  const paras=e.story.split("\n\n");
  return(<article>
    <div className="fixed top-0 left-0 h-1 bg-saffron z-50" style={{width:`${pct}%`}} aria-hidden="true"/>
    <header className={`${s.band}`}><div className="max-w-2xl mx-auto px-5 py-12">
      <Link to="/episodes" className="underline ui font-semibold">All episodes</Link>
      <div className="mt-6 flex flex-wrap gap-3 items-center ui font-semibold text-sm">
        <span className={`${s.chip} font-bold px-2.5 py-1 rounded-md`}>{e.ticker}</span><span>Episode {e.no}</span><span>{e.duration} min</span><span>{e.plays} plays</span></div>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4 tracking-tight">{e.title}</h1>
      <p className="mt-4 text-xl text-ink/80 leading-relaxed">{e.summary}</p></div></header>
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="bg-white border border-mist rounded-2xl p-4 shadow-lift">
        {e.audioUrl?<audio controls preload="none" src={e.audioUrl} className="w-full"/>:<p className="ui font-semibold">Audio for this episode is coming soon. Read the story below in the meantime.</p>}
        <div className="mt-3 flex flex-wrap items-center gap-4"><button onClick={share} className="underline ui font-semibold text-sm">{copied?"Link copied":"Copy link to share"}</button><button onClick={toggleSave} disabled={saving} className="bg-saffron border-2 border-ink rounded-full px-4 py-2 ui font-bold text-sm disabled:opacity-60">{saving?"Saving…":saved?"♥ Saved — remove":"♡ Save episode"}</button>{saveMsg&&<span role="status" className="text-sm ui">{saveMsg}</span>}</div></div>
      <div className="mt-10 space-y-6 leading-8 text-[1.15rem]">{paras.map((p,i)=>
        i===paras.length-1&&paras.length>1
          ?<p key={i} className="border-l-4 border-saffron pl-5 text-xl font-semibold leading-8">{p}</p>
          :<p key={i} className={i===0?"first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-extrabold first-letter:font-display first-letter:leading-[0.9]":""}>{p}</p>)}</div>
      <nav className="mt-14 grid sm:grid-cols-2 gap-4">
        {prev?<Link to={`/episodes/${prev.slug}`} className="border-2 border-ink rounded-xl p-4 hover:bg-mist"><span className="ui text-sm font-semibold text-ink/60">Previous</span><span className="block ui font-bold leading-snug">{prev.title}</span></Link>:<span/>}
        {next&&<Link to={`/episodes/${next.slug}`} className="border-2 border-ink bg-saffron rounded-xl p-4 hover:bg-white sm:text-right"><span className="ui text-sm font-semibold">Next episode</span><span className="block ui font-bold leading-snug">{next.title}</span></Link>}
      </nav></div></article>);
}
