const Weight=require('../models/Weight');
exports.create=async(req,res)=>{try{const w=await Weight.create({userId:req.userId,weight:req.body.weight,date:req.body.date||new Date()});res.status(201).json(w);}catch(e){res.status(400).json({message:'Could not add weight entry',error:e.message});}};
exports.list=async(req,res)=>{try{res.json(await Weight.find({userId:req.userId}).sort({date:1}));}catch(e){res.status(500).json({message:e.message});}};
exports.remove=async(req,res)=>{try{const r=await Weight.findOneAndDelete({_id:req.params.id,userId:req.userId});if(!r)return res.status(404).json({message:'Weight entry not found'});res.json({message:'Weight entry deleted'});}catch(e){res.status(500).json({message:e.message});}};
