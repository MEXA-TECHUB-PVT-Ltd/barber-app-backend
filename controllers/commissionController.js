
const mongoose= require('mongoose');
const commissionModel = require("../models/commissionModel");

exports.addCommission = async (req,res)=>{
    try{
        const commission_in_percentage = req.body.commission_in_percentage;
        const active = req.body.active;

        if(commission_in_percentage >100){
            return (
                res.json({
                    message: "Commission cannot be greater than 100",
                    status: false
                })
            )
        }

        if(active == true){
            console.log("inside")
            const foundResult = await commissionModel.findOne({active:true});
            if (foundResult){
                return(
                    res.json(
                        {
                            message: "Active commission already exists , only one commission can be active=true at one time",
                            status: false
                        }
                    )
                )
        }

        const newCommission = new commissionModel({
            _id:mongoose.Types.ObjectId(),
            active:active,
            commission_in_percentage:commission_in_percentage
        });

        
        const result = await newCommission.save();
        if(result){
            res.json({
                message: "New commission is saved successfully",
                status: true,
                result:result
            })
        }
        else{
            res.json({
                message: "COuld not save successfully",
                result:result
            })
        }


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


exports.updateStatus = async (req,res)=>{
    try{
        const commission_id = req.body.commission_id;
        const active = req.body.active;


        if(!commission_id){
            return (
                res.json({
                    message: "Commission Id is required",
                    status: false
                })
            )
        }
        if(typeof(active)=="undefined" || typeof(active)=="null"){
            return (
                res.json({
                    message: "active is required",
                    status: false
                })
            )
        }



    
        if(active==true){
            const foundResult = await commissionModel.findOne({active:true});
            if (foundResult){
                return(
                    {
                        message: "Active commission already exists, only one commission can be active=true at one time",
                        status: false
                    }
                )
        }      
        
      }

      const result = await commissionModel.findOneAndUpdate({_id:commission_id} , {active:active} , {new:true});
        if(result){
            res.json({
                message: "Updated",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message: "could not update",
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



exports.getAllCommissions = async (req,res)=>{
    try{
        const result = await commissionModel.find({});
        if(result){
            res.json({
                message: "Success",
                status:true,
                result:result
            })

        }
        else{
            res.json({
                message: "Error Occurred",
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


exports.getCommissionById = async (req,res)=>{
    try{
        const result = await commissionModel.findOne({_id:req.query.commission_id});
        if(result){
            res.json({
                message: "Success",
                status:true,
                result:result
            })
    }
    else{
        res.json({
            message: "could not fetch",
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

exports.getActiveCommission = async (req,res)=>{
    try{
        const result = await commissionModel.findOne({active:true});
        if(result){
            res.json({
                message: "Success",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message: "could not fetch",
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