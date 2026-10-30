import jwt from "jsonwebtoken";
export function requireAuth(req,res,next){
  const t=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  try{req.user=jwt.verify(t,process.env.JWT_SECRET||"dev-secret");}
  catch{return res.status(401).json({message:"Please log in to continue"});}
  return next();
}
export function requireAdmin(req,res,next){
  return requireAuth(req,res,()=>{
    if(req.user.role!=="admin") return res.status(403).json({message:"Admin access required"});
    return next();
  });
}
