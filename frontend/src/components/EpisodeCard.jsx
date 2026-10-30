import {Link} from "react-router-dom";
import {ts} from "../utils.js";
export function CardSkeleton({n=3}){return Array.from({length:n}).map((_,i)=><div key={i} className="h-64 rounded-2xl bg-mist animate-pulse"/>);}
export default function EpisodeCard({e}){
  const s=ts(e.topic);
  return(<Link to={`/episodes/${e.slug}`} className="group flex flex-col bg-white rounded-2xl border border-mist overflow-hidden transition hover:shadow-lift hover:-translate-y-0.5">
    <div className={`${s.band} px-5 py-4 flex items-center justify-between`}>
      <span className={`${s.chip} ui font-bold text-sm px-2.5 py-1 rounded-md`}>{e.ticker}</span>
      <span className="ui font-semibold text-sm">{e.duration} min</span></div>
    <div className="p-5 flex-1 flex flex-col">
      <p className="ui text-sm text-ink/60 font-semibold">Episode {e.no}</p>
      <h3 className="text-xl font-bold leading-snug mt-1 underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-saffron">{e.title}</h3>
      <p className="mt-2 text-ink/75 leading-relaxed flex-1">{e.summary}</p>
      <span className="mt-4 ui font-bold text-sm">Listen or read</span></div>
  </Link>);
}
