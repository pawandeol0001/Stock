import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import episodeRoutes from "./routes/episodes.js";
import settingsRoutes from "./routes/settings.js";
import Subscriber from "./models/Subscriber.js";
import {ensureSetup} from "./utils/ensureSetup.js";
dotenv.config();
const app=express();
const allowed=(process.env.CLIENT_URL||"http://localhost:5173").split(",").map(x=>x.trim()).filter(Boolean);
const previewRe=/^https:\/\/[a-z0-9-]+\.vercel\.app$/;
app.use(cors({origin:(o,cb)=>(!o||allowed.includes(o)||previewRe.test(o))?cb(null,true):cb(new Error("CORS blocked for "+o))}));
app.use(express.json({limit:"1mb"}));
app.get("/api/health",(req,res)=>res.json({ok:true,service:"Stock Simplified API"}));

let ready;
const init=()=>ready||(ready=connectDB().then(ensureSetup));
app.use(async(req,res,next)=>{ try{ await init(); next(); }catch(e){ ready=null; console.error(e); res.status(500).json({message:"DB connection failed",error:e.message}); } });

app.use("/api/auth",authRoutes);
app.use("/api/episodes",episodeRoutes);
app.use("/api/settings",settingsRoutes);
app.post("/api/subscribe",async(req,res)=>{
  const email=String(req.body.email||"").toLowerCase().trim();
  if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({message:"Enter a valid email address"});
  await Subscriber.updateOne({email},{email},{upsert:true});
  res.json({ok:true});
});
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:"Server error",error:err.message})});

if(!process.env.VERCEL){
  const port=process.env.PORT||5000;
  init().then(()=>app.listen(port,()=>console.log(`Stock Simplified API on ${port}`))).catch(e=>{console.error(e);process.exit(1)});
}
export default app;
