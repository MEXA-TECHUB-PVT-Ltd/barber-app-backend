 const mongoose = require('mongoose');
const lengthModel = require('../models/lengthModel');


 exports.add_length = async (req,res)=>{
    try{
        const name = req.body.name;
        let length = req.body.length;

        if(!length || ! name){
            return (
                res.json({
                    message:"name and length must be provided",
                    status : true,
                    result : result
                })
            )
        }

        const foundResult = await lengthModel.findOne({name : name});
        if(foundResult){
            return (
                res.json({
                    message:"lenght with this name already exist",
                    status : false,
                })
            )
        }



        let matchedArray = name.match('^(Number [1-9]|[1-9])$');
        console.log(matchedArray)
        if(!matchedArray){
            return (
                res.json({
                    message:"name must follow the following format  , Number 1 , Number 2 , Number 3 ....",
                    status : false,
                })
            )
        }


        if(parseInt(length) > 8){
            return (
                res.json({
                    message:"Length should not exceed from 8",
                    status : false,
                })
            )
        }


        const new_lenght = new lengthModel({
            _id: mongoose.Types.ObjectId(),
            name :name,
            length:length
        })


        const result = await new_lenght.save();

        if(result){
            res.json({
                message: "Lenght successfully added",
                status: true, 
                result: result
            })
        }
        else{
            res.json({
                message: "Length could not be added",
                status: false
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status: false,
            error:err.message
        })
    }
 }


 exports.getLength = async (req,res)=>{
    try{
        const  length_id = req.query.length_id;
        
        const result = await lengthModel.findOne({_id : length_id});


        if(result){
            res.json({
                message: "Fetched..",
                status: true, 
                result: result
            })
        }
        else{
            res.json({
                message: "could not fetched",
                status: false
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status: false,
            error:err.message
        })
    }
 }

 exports.getAllLength = async (req,res)=>{
    try{
    
        const result = await lengthModel.find({});

        if(result){
            res.json({
                message: "Fetched..",
                status: true, 
                result: result
            })
        }
        else{
            res.json({
                message: "could not fetch",
                status: false
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status: false,
            error:err.message
        })
    }
 }

 exports.deleteLength = async (req,res)=>{
    try{
        const length_id = req.query.length_id;

        const result  = await lengthModel.deleteOne({_id:length_id});

        if(result.deletedCount>0){
            res.json({
                message: "deleted",
                status: true, 
                result: result
            })
        }
        else{
            res.json({
                message: "could not delete",
                status: false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status: false,
            error:err.message
        })
    }
 }

 exports.updateLength = async (req,res)=>{
    try{
        const length_id = req.body.length_id ;
        let length = req.body.length; 

        if(!length || !length_id){
            return (
                res.json({
                    message:"length_id and length must be provided",
                    status : true,
                    result : result
                })
            )
        }

        

        if(parseInt(length) > 8){
            return (
                res.json({
                    message:"Length should not exceed from 8",
                    status : false,
                })
            )
        }


        const result = await lengthModel.findOneAndUpdate({_id :length_id} , {length : length} , {new: true});


        if(result){
            res.json({
                message: "Updated",
                status: true, 
                result: result
            })
        }
        else{
            res.json({
                message: "could not update",
                status: false
            })
        }
    
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status: false,
            error:err.message
        })
    }
 }