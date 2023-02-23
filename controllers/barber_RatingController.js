
const mongoose= require("mongoose");

const barberRatingModel= require("../models/barber_ratingModel")
const userModel = require("../models/userModel")

exports.rateBarber= async (req,res)=>{
    try{
        const customer_id=req.body.customer_id;
        const barber_id=req.body.barber_id;
        const review = req.body.review;
        let stars_rate = req.body.stars_rate;
        stars_rate = parseInt(stars_rate);


        if(!customer_id || !barber_id){
            return(
                res.json({
                    message: "Please Provide Customer id and barber id",
                    status:false
                })
            )
        } 

        if(customer_id){
            const foundCustomer = await userModel.findOne({_id:customer_id , user_type:'customer'});
            if(!foundCustomer){
                return(
                    res.json({
                        message: "customer with this id not exist . with this id , please provide user id which user_type = customer",
                        status:false
                    })
                )
           } 
        }
        if(barber_id){
            const foundCustomer = await userModel.findOne({_id:barber_id , user_type:'barber'});
            if(!foundCustomer){
                return(
                    res.json({
                        message: "barber with this id not exist . with this id , please provide user id which user_type = barber",
                        status:false
                    })
                )
           } 
        }

        const foundResult= await barberRatingModel.findOne({customer_id: customer_id , barber_id:barber_id});
        

        if(stars_rate<=5){
            if(!foundResult){
                var rating = new barberRatingModel({
                    _id:mongoose.Types.ObjectId(),
                    barber_id:barber_id,
                    customer_id: customer_id,
                    review:review,
                    stars_rate:stars_rate
                })
                var result= await rating.save();
    
            }
    
            if(foundResult){
                var result = await barberRatingModel.findOneAndUpdate({barber_id:barber_id, customer_id:customer_id}
                    ,
                    {
                      review:review,
                      stars_rate:stars_rate,
                      barber_id:barber_id,
                    },
                    {
                        new:true
                    }
                    )
            }
    
            if(result){
                res.json({
                    message: "Your rating has been recorded",
                    result:result,
                    statusCode:200
                })
            }
            else{
                res.json({
                    message: "Could not update or add your rating",
                    result:null
                })
            }
    
        }
        else{
            res.json({
                message: "Stars rate can not exceed 5",
                success:false,
            })
        }
        

    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message,
            statusCode:500
        })
    }

}

exports.getBarberRating = (req,res) =>{
    barberRatingModel.find({}, (err , result)=>{ 
        try{
            res.json({
                message: "All fetch barber Ratings are :",
                data: result
            })
        }
        catch(err){
            res.json({
                message: "Error in fetching barber Ratings",
                Error: err.message,
                error: err
            })
        }

    })
}

exports.getBarberRatingById = async (req,res) =>{

    try{
        const barberId = req.query.barberId;
        const result = await barberRatingModel.find({barber_id:barberId}).populate("barber_id");

    if(result){
        res.json({
            message: "fetched",
            status:true,
            result:result
        })
    }
    else{
        res.json({
            message: "Could not fetch",
            status:false,
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
exports.getTotalBarberRating= (req,res) =>{
    const barber_id = req.params.barber_id;
    let totalRating=0
    barberRatingModel.find({barber_id:barber_id}, (err , result)=>{ 

        if(result.length > 0){
            const count=result.length;
        if(count>0){
            result.forEach(element => {
                totalRating=(element.stars_rate+totalRating);
                
            });
            
            let rating=totalRating/count;
             console.log(rating);
             try{
                if(result){
                    res.json({
                        message:"Total rating of This barber Id:"+ barber_id,
                        totalRating:rating,
                        totalRatingCount:count
                    })
                }
                else{
                    res.json({
                        message: "Not found",
                        status:false,
                    })
                }
                
             }
             catch(err){
                res.json(err)
             }
        }
        
        }
        else{
            res.json({
                message: "Not found",
                status:false
            })
        }
        
    })
}

exports.deleteBarberRating = async (req,res)=>{
    try{
        const barberRatingId = req.params.barberRatingId;

        const result= await barberRatingModel.deleteOne({_id:barberRatingId});
        if(result.deletedCount>0){
            res.json({
                message: "barber rating deleted successfully",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "barber rating not deleted , rating with this id may not exist",
                result:null,
            })
        }
    }
    catch(err){
        res.json({
            message:"Error ",
            error:err.message,
        })
    }
}