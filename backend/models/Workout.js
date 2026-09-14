const mongoose=require('mongoose');
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},workoutName:{type:String,required:true,trim:true},workoutType:{type:String,default:'Other',trim:true},duration:{type:Number,required:true,min:1},calories:{type:Number,default:0,min:0},date:{type:Date,default:Date.now}},{timestamps:true});
module.exports=mongoose.model('Workout',schema);
