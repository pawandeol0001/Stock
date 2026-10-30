import mongoose from "mongoose";
const schema=new mongoose.Schema({
  key:{type:String,default:"main",unique:true},
  enabledMethods:{type:[String],default:["UPI","Card","Net Banking"]},
  currency:{type:String,default:"INR"},
  price:{type:Number,default:199},
  description:{type:String,default:"Support Stock Simplified and unlock premium learning content."},
  paymentNote:{type:String,default:"Payments are not processed on this demo website. Configure a payment gateway before accepting real payments."},
  paymentLink:{type:String,default:""},
  upiId:{type:String,default:""}
},{timestamps:true});
export default mongoose.model("PaymentSettings",schema);
