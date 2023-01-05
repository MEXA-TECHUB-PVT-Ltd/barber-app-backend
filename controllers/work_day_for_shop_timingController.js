const mongoose = require("mongoose");
const moment = require("moment");
const work_day_for_shop_timingModel = require('../models/work_day_for_shop_timmingModel')
exports.createWorkDayForShopTiming = async (req,res)=>{
    try{
        const workDay_id= req.body.workDay_id;
        let start_time = req.body.start_time;
        let end_time = req.body.end_time;

        let moment_start_time = moment(start_time,'hh:mm:ss a')
        let moment_end_time = moment(end_time , 'hh:mm:ss a')
        console.log(moment_start_time)
        var bool=false;


        const foundResult = await work_day_for_shop_timingModel.find({workDay_id:workDay_id});


        for (let element of foundResult) {
            let start= moment(element.start_time, 'hh:mm:ss a')
            let end= moment(element.end_time, 'hh:mm:ss a')

            if((moment_start_time.isBetween(start , end) || moment_end_time.isBetween(start,end) || moment_start_time.isSame(start)) || moment_end_time.isSame(end) ||(moment_start_time.isBefore(start) && moment_end_time.isAfter(end))){
                bool=true;
                break; 
                
            }
            else{
                console.log("not in between")
            }
        };

        console.log(bool)
        if(bool===false){
            const newWorkDayShopTiming = new work_day_for_shop_timingModel({
                _id:mongoose.Types.ObjectId(),
                workDay_id:workDay_id,
                start_time:start_time,
                end_time:end_time,
            }) 

            const result = await newWorkDayShopTiming.save();
            if(result){
            res.json({
                message: "Timing for work day has been created successfully",
                status:true,
                result: result
                

            })
            }else{
            res.json({
                message: "Error in creating timing",
                status:false,
                result: result
            })

       }

       
       }
       else{
        res.json({
            message: "Time slot conflict . Please ensure that time range you selected is not in between of some other slot Or some other slot is not in between your selected range , ",
            status:false,

        })
       }

    
    }
    catch(err){
        res.json({
            message: "Error in creating timing",
            status:false,
            error:err.message
        })
    }
}


exports.getAllShopsTimings = async (req,res)=>{
    try{
        const result=await work_day_for_shop_timingModel.find({}).populate({path : 'workDay_id',
        populate : {
          path : 'barber_id'
        }});
        if(result){
         res.json({
             message: "Result Fetched",
             result:result,
             statusCode:200
         })
        }
        else{
         res.json({
             message: "Could not find result",
             result:null,
             statusCode:404
         })
        }
        
     }
     catch(err){
         res.json({
             message: "Error Occurred",
             error:err.message,
             statusCode:500
         })
     }
}
exports.getAllShopsTimingsById = async (req,res)=>{
    try{
        const work_day_shopTimingId= req.query.work_day_shopTimingId;
        const result=await work_day_for_shop_timingModel.findOne({_id:work_day_shopTimingId}).populate({path : 'workDay_id',
        populate : {
          path : 'barber_id'
        }});
        if(result){
         res.json({
             message: "Result Fetched",
             result:result,
             statusCode:200
         })
        }
        else{
         res.json({
             message: "Could not find result",
             result:null,
             statusCode:404
         })
        }
        
     }
     catch(err){
         res.json({
             message: "Error Occurred",
             error:err.message,
             statusCode:500
         })
     }
}


// exports.updateWorkDayForShopTiming = async (req,res)=>{
//     try{
//         const workDayShopTimingId = req.body.workDayShopTimingId;
//         const workDay_id = req.body.workDay_id;
//         let start_time = req.body.start_time;
//         let end_time = req.body.end_time;


//         const result = await work_day_for_shop_timingModel.findOneAndUpdate({_id:workDayShopTimingId},
//             {
//                 workDay_id:workDay_id,
//                 start_time:start_time,
//                 end_time:end_time
//             },
//             {
//                 new : true
//             });

//             if(result){
//                 res.json({
//                     message: "Work day timing has been updated successfully",
//                     status:true,
//                     result: result
//                 })
//             }
//             else{
//                 res.json({
//                     message: "Error in updating timing",
//                     status:false,
//                     result: result
//                 })

//             }
//     }
//     catch(err){
//         res.json({
//                     message: "Error in updating timing",
//                     status:false,
//                     error: err.message
//                 })
        
//     }
// }

exports.deleteWorkDayForShopTiming = async(req,res)=>{
    try{
        const workDayShopTimingId = req.query.workDayShopTimingId;
        const result= await work_day_for_shop_timingModel.deleteOne({_id:workDayShopTimingId})
        if(result.deletedCount>0){
            res.json({
                message: "workDayForShop timing deleted successfully",
                result:result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "work day for shop timing could not be deleted",
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

