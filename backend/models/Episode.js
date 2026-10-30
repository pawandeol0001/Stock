import mongoose from "mongoose";
const s=new mongoose.Schema({
  no:{type:Number,unique:true},
  title:{type:String,required:true,trim:true},
  slug:{type:String,unique:true},
  ticker:{type:String,required:true,uppercase:true,trim:true,maxlength:8},
  topic:{type:String,default:"Basics"},
  duration:{type:Number,default:8},
  summary:{type:String,required:true},
  story:{type:String,required:true},
  audioUrl:{type:String,default:""},
  plays:{type:Number,default:0}
},{timestamps:true});
export default mongoose.model("Episode",s);
