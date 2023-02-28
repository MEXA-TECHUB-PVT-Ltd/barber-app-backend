
const  mongoose = require('mongoose');
const  e_walletModel = require('../models/e-walletModel');

exports.getUserEwallet = async (req,res)=>{
    try{
        const user_id = req.query.user_id;
        if(!user_id){
            res.json({
                message: "Please Provide user id",
                status:false,
            })
        }
        const result = await e_walletModel.findOne({user_id : user_id});
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

