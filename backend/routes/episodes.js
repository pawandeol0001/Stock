import {Router} from "express";
import Episode from "../models/Episode.js";
import {requireAdmin} from "../middleware/auth.js";
const r=Router();
const slugify=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
r.get("/",async(req,res)=>{
  const f={};
  if(req.query.topic) f.topic=String(req.query.topic);
  if(req.query.q){ const rx=new RegExp(esc(String(req.query.q)),"i"); f.$or=[{title:rx},{summary:rx},{ticker:rx}]; }
  res.json(await Episode.find(f).select("-story").sort({no:1}));
});
r.get("/admin/:id",requireAdmin,async(req,res)=>{
  const e=await Episode.findById(req.params.id);if(!e)return res.status(404).json({message:"Episode not found"});res.json(e);
});
r.get("/:slug",async(req,res)=>{
  const e=await Episode.findOneAndUpdate({slug:req.params.slug},{$inc:{plays:1}},{new:true});
  if(!e) return res.status(404).json({message:"Episode not found"});
  res.json(e);
});
r.post("/",requireAdmin,async(req,res)=>{
  const last=await Episode.findOne().sort({no:-1});
  const e=await Episode.create({...req.body,no:(last?.no||0)+1,slug:slugify(req.body.title||"")});
  res.status(201).json(e);
});
r.put("/:id",requireAdmin,async(req,res)=>{
  const {no,plays,...rest}=req.body;
  if(rest.title) rest.slug=slugify(rest.title);
  const updated=await Episode.findByIdAndUpdate(req.params.id,rest,{new:true,runValidators:true});
  if(!updated)return res.status(404).json({message:"Episode not found"});
  res.json(updated);
});
r.delete("/:id",requireAdmin,async(req,res)=>{ await Episode.findByIdAndDelete(req.params.id); res.json({ok:true}); });
export default r;
