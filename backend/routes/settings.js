import {Router} from "express";
import PaymentSettings from "../models/PaymentSettings.js";
import {requireAdmin} from "../middleware/auth.js";
const r=Router();
const defaults={enabledMethods:["UPI","Card","Net Banking"],currency:"INR",price:199,description:"Support Stock Simplified and unlock premium learning content.",paymentNote:"Payments are not processed on this demo website. Configure a payment gateway before accepting real payments.",paymentLink:"",upiId:""};
r.get("/payment",async(req,res)=>{let s=await PaymentSettings.findOne({key:"main"});if(!s)s=await PaymentSettings.create({key:"main",...defaults});res.json(s);});
r.put("/payment",requireAdmin,async(req,res)=>{
 const allowed=["UPI","Card","Net Banking","Wallet","Bank Transfer"];
 const enabledMethods=Array.isArray(req.body.enabledMethods)?[...new Set(req.body.enabledMethods.filter(x=>allowed.includes(x)))]:defaults.enabledMethods;
 const price=Number(req.body.price);if(!Number.isFinite(price)||price<0||price>1000000)return res.status(400).json({message:"Enter a valid price between 0 and 1,000,000."});
 const paymentLink=String(req.body.paymentLink||"").trim();
 if(paymentLink && !/^https:\/\//i.test(paymentLink)) return res.status(400).json({message:"Payment link must start with https://"});
 const data={enabledMethods,currency:"INR",price,description:String(req.body.description||defaults.description).slice(0,300),paymentNote:String(req.body.paymentNote||defaults.paymentNote).slice(0,500),paymentLink:paymentLink.slice(0,1000),upiId:String(req.body.upiId||"").trim().slice(0,120)};
 const s=await PaymentSettings.findOneAndUpdate({key:"main"},{$set:data,$setOnInsert:{key:"main"}},{new:true,upsert:true,runValidators:true});res.json(s);
});
export default r;
