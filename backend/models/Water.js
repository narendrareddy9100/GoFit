const mongoose=require('mongoose');
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},amount:{type:Number,required:true,min:1},date:{type:Date,default:Date.now}},{timestamps:true});
schema.index({userId:1,date:1});
module.exports=mongoose.model('Water',schema);
