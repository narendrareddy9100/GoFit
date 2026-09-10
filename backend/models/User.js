const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true},
  mobile:{type:String,trim:true},
  gender:{type:String,enum:['Male','Female','Other','Prefer not to say'],default:'Prefer not to say'},
  age:{type:Number,min:1,max:120},
  height:{type:Number,min:30,max:300},
  weight:{type:Number,min:1,max:500},
  fitnessGoal:{type:String,trim:true,default:'General fitness'}
},{timestamps:true});
module.exports = mongoose.model('User',userSchema);
