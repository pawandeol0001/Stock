import {Link} from "react-router-dom";
const wob=[0,-7,4,-6,3,-5,2,-4];
export default function StoryChart({episodes}){
  const list=episodes&&episodes.length?episodes:Array.from({length:6});
  const n=list.length;
  const pts=list.map((_,i)=>({x:8+(n>1?i*(84/(n-1)):0),y:78-(n>1?i*(50/(n-1)):0)+wob[i%wob.length]}));
  const line=pts.map(p=>`${p.x*4},${p.y*3}`).join(" ");
  const area=`${pts[0].x*4},300 ${line} ${pts[n-1].x*4},300`;
  return(<div className="relative w-full aspect-[4/3]">
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs><linearGradient id="fillg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB400" stopOpacity=".35"/><stop offset="1" stopColor="#FFB400" stopOpacity="0"/></linearGradient></defs>
      {[75,150,225].map(y=><line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#fff" strokeOpacity=".08"/>)}
      <polygon className="area" points={area} fill="url(#fillg)"/>
      <polyline className="draw" points={line} pathLength="1" fill="none" stroke="#FFB400" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
    {episodes&&episodes.map((e,i)=>(
      <Link key={e._id} to={`/episodes/${e.slug}`} aria-label={`Episode ${e.no}: ${e.title}`} className="pop group absolute -translate-x-1/2 -translate-y-1/2"
        style={{left:`${pts[i].x}%`,top:`${pts[i].y}%`,animationDelay:`${0.4+i*0.25}s`}}>
        <span className="block w-5 h-5 rounded-full bg-paper border-4 border-saffron transition-transform group-hover:scale-125 group-focus-visible:scale-125"/>
        <span className={`pointer-events-none hidden group-hover:block group-focus-visible:block absolute bottom-7 w-48 bg-white text-ink rounded-lg p-3 text-sm shadow-lift ui z-10 ${pts[i].x>55?"right-[-8px]":"left-[-8px]"}`}>
          <b>Ep {e.no}</b> {e.title}</span>
      </Link>))}
  </div>);
}
