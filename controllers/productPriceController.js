
const mongoose = require("mongoose")
const hairStylePriceModel = require("../models/hairStylePriceModel")


exports.createHairStylePrice = async (req,res)=>{

    try{
        const price = req.body.price;
        const unique_id = req.body.unique_id;


        if(unique_id=="HS_unique"){
            const foundResult = await hairStylePriceModel.findOne({unique_id:unique_id});

            if(!foundResult){
                const newHairStylePrice = await hairStylePriceModel({
                    _id:mongoose.Types.ObjectId(),
                    price: price,
                    unique_id:unique_id
                })
                const result = await newHairStylePrice.save();
    
                if(result){
                    res.json({
                        message: "New hairStyle Price has been created successfully",
                        result: result,
                        status: 'success',
                    })
                }
                else{
                    res.json({
                        message: "Could not create new hairStyle Price",
                        status: "failed"
                    })
                }
            }
            else{
                res.json({
                    message: "hairStyle price for this unique_id is already created",
                    status:false
                })
            }
        }
        else{
            res.json({
                message: "unique_id must be HS_UNIQUE",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error creating hairStyle Price",
            error:err.message
        })
    }
}



exports.getHairStylePrice = async(req,res)=>{
    try{
        const result = await hairStylePriceModel.findOne({unique_id:"HS_unique"})
        if(result){
            res.json({
                message: "hairStyle price updated successfully",
                result:result,
                status: 'success'
            })
        }
        else{
            res.json({
                message: "could not updated",
                result:null,
                status:"false"
            })
        }
    }
    catch(err){
        res.json({
            message: "error",
            error:err.message
        })
    }
}


exports.updateHairStylePriceByUnique_id= async (req,res)=>{
    try{
        const price = req.body.price;
        const unique_id = req.body.unique_id;

        const foundResult = await hairStylePriceModel.findOne({unique_id: unique_id});
        if(!foundResult){
            return (
                res.json({
                    message: "hairStyle price with this unique Does not exist",
                    status:false
                })
            )
        }
        else{
        const result = await hairStylePriceModel.findOneAndUpdate({unique_id: unique_id} , {price:price} , {new:true});
        if(result){
            res.json({
                message: "hairStyle price updated successfully",
                result:result,
                status: 'success'
            })
        }
        else{
            res.json({
                message: "could not updated",
                result:null,
                status:"false"
            })
        }
        }

        
    }
    catch(err){
        res.json({
            message: "error",
            error:err.message
        })
    }
}