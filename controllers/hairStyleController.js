const { request } = require("express");
const mongoose = require("mongoose");
const hairStyleModel = require("../models/hairStylesModel");
const fs = require('fs')

const notificationToAll = require("../utils/pushNotification");
const createNotification = require("../utils/create_notification_of_user")

exports.addHairStyle = async (req,res)=>{
    try{
        const name  = req.body.name;
        const price = req.body.price;
        const addedBy = req.body.addedBy;
        const barber_id = req.body.barber_id;


        if(addedBy== 'admin'){
            if(barber_id){
                return (
                    res.json({
                        message: "when addedBy is admin then please do not give barber_id",
                        status:false,
                    })
                )
            }
        }
        if(addedBy == 'barber'){
            if(!barber_id){
                return (
                    res.json({
                        message: "Please provide barber_id when barber is adding haristyle",
                        status:false,
                    })
                )
            }
        }

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
            addedBy:addedBy,
            barber_id:barber_id
            
        })


        const result  =await newHairStyle.save();

        
        if(result){
           let storeNotificationForAll = await createNotification('all' , "New Hair Style has been added by admin" , "new_hairStyle_added"  , "system" );
           if(storeNotificationForAll){
                console.log("Notification for all created")
           }

           let sendPushNotificationToAll = await notificationToAll("Hey Guys , New Hair Style has been added by admin");
           if(sendPushNotificationToAll){
            console.log("Push notification of hair style adding is send to all users")
           }
           else{
            console.log("could not send notifications of hair style to users")
           }
        }

        
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
                result:result
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

exports.updateHairStylePrice = async (req,res)=>{
    try{
            const hairStyleId = req.body.hairStyleId;
            const price = req.body.price;
    
            if(!hairStyleId || !price){
                return(
                    res.json({
                        message: "Please provide hairStyleId Or price",
                        status:false
                    })
                    )
            }

            const result = await hairStyleModel.findOneAndUpdate({_id:hairStyleId}, {price: price} , {new: true});

            if(result){
                res.json({
                    message:"Hair style price updated successfully",
                    status:true,
                    result:result
                })
            }
            else{
                res.json({
                    message:"Could not update",
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


exports.search_hair_styles = async (req,res)=>{
    try{
        const text = req.query.text;

        if(!text){
            return (
                res.json({
                    message: "Please Provide text to search for hair styles",
                    status: false
                })
            )
        }

        const result  = await hairStyleModel.find({name: {$regex : text}});

        if(result){
            res.json({
                message: "Fetched",
                status:true,
                resutl:result
            })
        }
        else{
            res.json({
                message: "Could not fetch",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status: false,
            error:err.message
        })
    }
}

exports.updateHairStyle = async(req,res)=>{
    try{
        const hair_style_id = req.body.hair_style_id;
        const name = req.body.name;
        

        let image;
        if(req.file){
            const foundResult = await hairStyleModel.findOne({_id:hair_style_id});
            if(foundResult){
                if(foundResult.image){
                    fs.unlink(foundResult.image , (err, data)=>{
                        if(!err){
                            console.log("previous file deleted")
                        }else{console.log("could not delete previos file")}
                    })
                }
            }
        }
    
        
        if(req.file){
            image= req.file.path;
        }

        const result = await hairStyleModel.findOneAndUpdate({_id:hair_style_id} , {image : image , name:name} , {new:true})
    
        if(result){
            res.json({
                message: "Update successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message: "Could not update",
                status: false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status: false,
            error:err.message
        })
    }
}