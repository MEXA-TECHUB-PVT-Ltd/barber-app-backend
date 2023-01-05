const mongoose= require('mongoose');
const work_day_for_shopModel = require("../models/work_day_for_shopModel")
const userModel = require("../models/userModel")
const ObjectId = require("mongodb").ObjectId;

exports.createWorkDayForShop = async (req,res)=>{
    try{
        const barber_id = req.body.barber_id;
        const day = req.body.day;

        if(!barber_id || !day){
            return(
                res.json({
                    message: "Must provide barber_id and day both.",
                    status: false
                })
            )
        }
        const foundBarber = await userModel.findOne({_id: barber_id , user_type:"barber"});
        if(!foundBarber){
            return(
                res.json({
                    message: "The barber_id you provided is not registered as barber.",
                    status: false
                })
            )
        }

        const foundResult = await work_day_for_shopModel.findOne({barber_id:barber_id , day:day});
        if(foundResult){
            return(
                res.json({
                    message: "This Barber already created this day",
                    status: false
                })
            )
        }
        else{
            const newWorkDay = new work_day_for_shopModel({
                _id:mongoose.Types.ObjectId(),
                barber_id:barber_id,
                day:day
            })

            const result = await newWorkDay.save();
            
            if(result){
                res.json({
                    message: "Work Day Created Successfully",
                    status: true,
                    result: result
                })
            }
            else{
                res.json({
                    message: "Couldn't create work day",
                    status: false
                })
            }
        }
    
    }
    catch(err){
        res.json({
            message: "Error Occurred while creating work_day",
            status: false,
            error:err.message
        })
    }
}

exports.getAllWorkDays = async (req,res)=>{
    try{
        const result = await work_day_for_shopModel.find({}).populate("barber_id");
        
        if(result){
            res.json({
                message: "Result fetched",
                status:true, 
                result: result
            })
        }
        else{
            res.json({
                message: "Could not find Result",
                status: false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred while fetching work_days",
            status: false,
            error:err.message
        })
    }
}

exports.getWorkDayById = async (req,res)=>{
    try{
        const workDayId = req.query.workDayId;
        if(!workDayId){
            return(
                res.json({
                    message: "Must provide workDayId",
                    status: false
                })
            )

        }


        const result = await work_day_for_shopModel.findOne({_id:workDayId}).populate("barber_id");
        if(result){
            res.json({
                message: "Result fetched",
                status:true, 
                result: result
            })
        }
        else{
            res.json({
                message: "Could not find Result",
                status: false,
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

exports.deleteWorkDay = async (req,res)=>{
    try{
        const workDayId = req.query.workDayId;
        if(!workDayId){
            return(
                res.json({
                    message: "Must provide workDayId",
                    status: false
                })
            )

        }

        const result = await work_day_for_shopModel.deleteOne({_id:workDayId});
        if(result.deletedCount>0){
            res.json({
                message: "workDay deleted successfully",
                result:result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "work day could not be deleted",
                result:result,
                statusCode:404
            })
        }
    }
    catch(err){
        res.json({
            message: "Error occurred while deleting",
            error:err.message,
            statusCode:200
        })
    }
}

exports.updateWorkDay = async (req,res)=>{
    try{
        const workDayId = req.body.workDayId;
        const barber_id = req.body.barber_id;
        const day = req.body.day;


        if(!workDayId){
            return(
                res.json({
                    message: "Must provide workDayId",
                    status: false
                })
            )

        }

        const foundBarber = await userModel.findOne({_id: barber_id , user_type:"barber"});
        if(!foundBarber){
            return(
                res.json({
                    message: "The barber_id you provided is not registered as barber.",
                    status: false
                })
            )
        }

        const foundResult = await work_day_for_shopModel.findOne({barber_id:barber_id , day:day});
        if(foundResult){
            return(
                res.json({
                    message: "This Barber already created this day",
                    status: false
                })
            )
        }
        

        const result = await work_day_for_shopModel.findOneAndUpdate({_id:workDayId} 
            ,
            {
                barber_id:barber_id,
                day:day
            },
            {
                new:true,
            });

            if(result){
                res.json({
                    message: "Record updated",
                    status:true, 
                    result: result
                })

            }
            else{
                res.json({
                    message: "Could not update it",
                    status: false,
                })

            }
    }
    catch(err){
        res.json({
            message: "Error occurred while deleting",
            error:err.message,
            statusCode:200
        })
    }
}

exports.getWorkDaysByBarber_id = async(req,res)=>{
    try{
        const barber_id = req.query.barber_id;
        if(!barber_id){
            return(
                res.json({
                    message: "Must provide barber_id",
                    status: false
                })
            )
    }

     const result = await work_day_for_shopModel.find({barber_id:barber_id}).populate("barber_id");
     if(result){
        res.json({
            message: "WorkDays for barber fetched successfully",
            status:true,
            result:result
        })
     }
     else{
        res.json({
            message: "could not fetch",
            result:result,
            status:false
        })
     }
}
catch(err){
    res.json({
        message: "Error occurred while deleting",
        error:err.message,
        statusCode:200
    })
}
}


exports.getWorkDaysWithTiming=async (req,res)=>{
    try{
        let barber_id= req.query.barber_id;   
        barber_id= new ObjectId(barber_id);     
        const day = req.query.day;

        

       if(!barber_id){
        return (
            res.json({
                message: "Must provide barber_id",
                status: false
            })
        )
       }

        const array = [];
        
        if(barber_id){
            array.push(
                {
                    $match:{barber_id:barber_id}
                },
                {
                    $lookup:{ 
                        from:"work_day_for_shop_timings",
                        localField:"_id",
                        foreignField:"workDay_id",
                        as:"day_timings"
                    }
                }
            )
        }

        if(barber_id && day){
            if(day=="monday" || day=="tuesday" || day=="wednesday" || day=="thursday" || day=="saturday" || day=="friday" || day=="sunday"){

            }
            else{
                return (
                    res.json({
                        message: "day can only be monday , tuesday , wednesday , thursday , friday,saturday and sunday",
                        status: false
                    })
                )
            }
            array.push(
                {
                    $match:{barber_id:barber_id ,day:day}
                },
                {
                    $lookup:{ 
                        from:"work_day_for_shop_timings",
                        localField:"_id",
                        foreignField:"workDay_id",
                        as:"day_timings"
                    }
                }
            )
        }

        const result = await work_day_for_shopModel.aggregate(array)

        if(result){
            res.json({
                message: "Result fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "could not fetched",
                result: null
            })
        }



    }
    catch(err)
    {
        res.json({
            message: "error occurred while processing",
            error:err.message,
        })
    }
}