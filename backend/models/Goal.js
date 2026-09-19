const mongoose=require('mongoose');
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},type:{type:String,required:true,trim:true},target:{type:Number,required:true,min:0},progress:{type:Number,default:0,min:0},createdAt:{type:Date,default:Date.now}},{timestamps:true});
module.exports=mongoose.model('Goal',schema);
