const { request } = require("express");
const mongoose = require("mongoose");
const hairStyleModel = require("../models/hairStylesModel");

exports.addHairStyle = async (req,res)=>{
    try{
        const name  = req.body.name;
        const price = req.body.price;

        console.log(price)
        console.log(name)
        let image ;
        if(!price){
            return (
                res.json({
                    message: "Please Provide price for the hair cut",
                    status:false,
                })
            )
        }else if (!name){
            return (
                res.json({
                    message: "Please provide name for the hair cut",
                    status:false,
                })
            )
        }

        if(name==""){
            return(
                res.json({
                    message: "name could not be empty",
                    status:false
                })
            )
        }


        const foundName = await hairStyleModel.findOne({name:  { 
            "$regex": "^" + name + "\\b", "$options": "i"
        }});


        if(foundName){
            return(
                res.json({
                    message: "Hair style with this same name already exists",
                    status:false
                })
            )
        }

        if(req.file){
            image= req.file.path
        }

        
        const newHairStyle = new hairStyleModel({
            _id:mongoose.Types.ObjectId(),
            name:name,
            price:price,
            image:image,
            
        })


        const result  =await newHairStyle.save();
        if(result){
            res.json({
                message:"Hair style has been saved successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"Could not create Hair Style",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message,
        })
    }
}

exports.getAllHairStyles = async (req,res)=>{
    try{
        const result = await hairStyleModel.find({});
        if(result){
            res.json({
                message:"Hair style successfully fetched",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"Could not fetches",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message,
        })
    }
}

exports.getHairStyleById = async (req,res)=>{
    try{
        const hairStyleId = req.query.hairStyleId;
        if(!hairStyleId){
            return(
                res.json({
                    message: "Please provide hairStyleId",
                    status:false
                })
            )
        }
        const result = await hairStyleModel.findOne({_id:hairStyleId});
        if(result){
            res.json({
                message:"Hair style successfully fetched",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"Could not fetch",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message,
        })
    }
}

exports.deleteHairStyle = async (req,res)=>{
    try{
        const hairStyleId = req.query.hairStyleId;

        if(!hairStyleId){
            return(
                res.json({
                    message: "Please provide hairStyleId",
                    status:false
                })
            )
        }

        const result = await hairStyleModel.deleteOne({_id:hairStyleId});
        if(result.deletedCount>0){
            res.json({
                message: "Hair style deleted successfully",
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not delete",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message,
        })
    }
}