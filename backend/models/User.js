import mongoose from "mongoose";
const schema=new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:80},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true},
  role:{type:String,enum:["user","admin"],default:"user"},
  savedEpisodes:[{type:mongoose.Schema.Types.ObjectId,ref:"Episode"}],
  subscription:{planId:String,planName:String,status:{type:String,default:"inactive"},startedAt:Date,expiresAt:Date,paymentId:String,orderId:String}
},{timestamps:true});
export default mongoose.models.User||mongoose.model("User",schema);
