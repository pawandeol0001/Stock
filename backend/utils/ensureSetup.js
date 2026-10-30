import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Episode from "../models/Episode.js";
import episodes from "../data/episodes.js";
export async function ensureSetup(){
  const email=(process.env.ADMIN_EMAIL||"admin@stocksimplified.com").toLowerCase().trim();
  if(!(await User.exists({email}))){
    const password=await bcrypt.hash(process.env.ADMIN_PASSWORD||"ChangeMe@123",10);
    await User.create({name:"Admin",email,password,role:"admin"});
  }
  if((await Episode.countDocuments())===0) await Episode.insertMany(episodes);
}
