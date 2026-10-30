export default function Ticker({episodes}){
  if(!episodes||!episodes.length) return <div className="bg-navy h-12"/>;
  const items=[...episodes,...episodes];
  return(<div className="bg-navy text-white overflow-hidden py-3 border-y border-white/10" aria-hidden="true">
    <div className="tick flex w-max gap-12 ui font-bold">
      {items.map((e,i)=><span key={i} className="flex gap-2 items-baseline whitespace-nowrap">
        <span className="text-saffron">{e.ticker}</span><span className="text-gain">▲ {e.duration} min</span><span className="text-white/50">Ep {e.no}</span></span>)}
    </div></div>);
}
