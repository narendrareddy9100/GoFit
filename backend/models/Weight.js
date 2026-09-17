const mongoose=require('mongoose');
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},weight:{type:Number,required:true,min:1,max:500},date:{type:Date,default:Date.now}},{timestamps:true});
module.exports=mongoose.model('Weight',schema);
