import {useEffect,useState} from "react";
import api,{errMsg} from "./api.js";
export function useGet(url,params){
  const [s,setS]=useState({data:null,loading:true,err:""});
  const key=JSON.stringify(params||{});
  useEffect(()=>{
    let on=true;
    setS(p=>({...p,loading:true,err:""}));
    api.get(url,{params}).then(r=>{if(on)setS({data:r.data,loading:false,err:""});}).catch(e=>{if(on)setS({data:null,loading:false,err:errMsg(e)});});
    return()=>{on=false;};
  },[url,key]);
  return s;
}
