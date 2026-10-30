import {Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Episode from "../models/Episode.js";
import {requireAuth} from "../middleware/auth.js";
const r=Router();
const tokenFor=user=>jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET||"dev-secret",{expiresIn:"7d"});
const publicUser=user=>({id:user._id,name:user.name,email:user.email,role:user.role,savedEpisodes:user.savedEpisodes||[],subscription:user.subscription||{status:"inactive"}});
r.post("/register",async(req,res)=>{
  const name=String(req.body.name||"").trim();
  const email=String(req.body.email||"").toLowerCase().trim();
  const password=String(req.body.password||"");
  if(name.length<2) return res.status(400).json({message:"Name must be at least 2 characters"});
  if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({message:"Enter a valid email address"});
  if(password.length<8) return res.status(400).json({message:"Password must be at least 8 characters"});
  if(await User.exists({email})) return res.status(409).json({message:"An account with this email already exists"});
  const user=await User.create({name,email,password:await bcrypt.hash(password,12),role:"user"});
  res.status(201).json({token:tokenFor(user),user:publicUser(user)});
});
r.post("/login",async(req,res)=>{
  const email=String(req.body.email||"").toLowerCase().trim();
  const user=await User.findOne({email});
  if(!user||!(await bcrypt.compare(String(req.body.password||""),user.password))) return res.status(401).json({message:"Wrong email or password"});
  res.json({token:tokenFor(user),user:publicUser(user),name:user.name,role:user.role});
});
r.get("/me",requireAuth,async(req,res)=>{
  const user=await User.findById(req.user.id).select("-password");
  if(!user)return res.status(401).json({message:"Account not found"});
  res.json({user:publicUser(user)});
});
r.get("/saved",requireAuth,async(req,res)=>{
  const user=await User.findById(req.user.id).populate("savedEpisodes");
  res.json((user?.savedEpisodes||[]).filter(Boolean));
});
r.post("/saved/:episodeId",requireAuth,async(req,res)=>{
  if(!mongoose.isValidObjectId(req.params.episodeId))return res.status(400).json({message:"Invalid episode"});
  const episode=await Episode.findById(req.params.episodeId);
  if(!episode)return res.status(404).json({message:"Episode not found"});
  const user=await User.findById(req.user.id);
  const id=episode._id.toString();
  const exists=user.savedEpisodes.some(x=>x.toString()===id);
  if(exists)user.savedEpisodes=user.savedEpisodes.filter(x=>x.toString()!==id);else user.savedEpisodes.push(episode._id);
  await user.save();
  res.json({saved:!exists,message:exists?"Episode removed from saved list":"Episode saved"});
});
export default r;
