const Water=require('../models/Water');
exports.create=async(req,res)=>{try{const w=await Water.create({userId:req.userId,amount:req.body.amount,date:req.body.date||new Date()});res.status(201).json(w);}catch(e){res.status(400).json({message:'Could not add water entry',error:e.message});}};
exports.list=async(req,res)=>{try{res.json(await Water.find({userId:req.userId}).sort({date:-1}));}catch(e){res.status(500).json({message:e.message});}};
exports.remove=async(req,res)=>{try{const r=await Water.findOneAndDelete({_id:req.params.id,userId:req.userId});if(!r)return res.status(404).json({message:'Water entry not found'});res.json({message:'Water entry deleted'});}catch(e){res.status(500).json({message:e.message});}};
