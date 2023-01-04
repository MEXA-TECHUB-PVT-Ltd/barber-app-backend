const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")
const fs= require("fs");

exports.register= async (req,res)=>{

    try{
        const user_type= req.body.user_type;
        let location = req.body.location;
        location =JSON.parse(location);
        const experience = req.body.experience;
        const payment_info = req.body.payment_info;
        
        console.log(user_type)


        if(user_type == "barber"){
            if(!payment_info){
                return (
                    res.json({
                        message: " If user_type = barber , then must give payment_info",
                        status:false
                    })
                )
            }
        }


        if(experience){
            if(user_type!== "barber"){
                return (
                    res.json({
                        message: "experience can only be add if user_type is barber",
                        status:false
                    })
                )
            }
        }


        if(user_type === "barber" || user_type === "customer"){
        }else{
            return (
                res.json({
                    message: "user_type can only be barber or customer",
                    status:false
                })
            )
        }

       


        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({
            message: error.details[0].message,
            status:false
        });
        //Check if the user is already in the db
        const emailExists = await userModel.findOne({ email: req.body.email });
  
        if (emailExists) return res.status(400).json({
            message: "Email already exists",
            status:false
        })
  
        //hash passwords
       
            var salt = await bcrypt.genSalt(10);
            var hashPassword = await bcrypt.hash(req.body.password, salt);

        if(req.file){
            var photo = req.file.path;
        }
        
    
        const userRegister = new userModel({
        _id:mongoose.Types.ObjectId(),
        email:req.body.email,
        password:hashPassword,
        user_name:req.body.user_name,
        user_type:user_type,
        age:req.body.age,
        device_token:req.body.device_token,
        payment_info:req.body.payment_info,
        photo:photo,
        location:location,
        gender:req.body.gender

        })

        const registeredUser = await userRegister.save();
       
        if(registeredUser){
            const token = jwt.sign({ _id: registeredUser._id }, process.env.TOKEN)
            res.json({
                message: "User has been Registered" ,
                result:registeredUser,
                statusCode:201,
                token:token
            })
        }
        else{
            res.json({
                message:"User could not be registered",
                result: result,
                statusCode:400
            })
        }

    }
    catch(e){
        console.log(e)
        res.json({
            message : "Error occurred while registering User",
            error: e.message,
            statusCode:404

        })
    }
}


exports.login = async (req,res)=>{
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const user = await userModel.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });
  
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });;

    const token = jwt.sign({ _id: user._id}, process.env.TOKEN);
    res.json({
        message: "Logged in successfully", 
        result:user,
        token: token,
        status:"success",
    })


}

exports.checkLogin=(req,res)=>{
    
}


exports.getAllUsers = async (req,res)=>{

    try{
        const users = await userModel.find({});
        if(users){
            res.json({
                message: "All users fetched successfully",
                result: users,
                status:"success",
                statusCode:200
            })
        }
        else{
            res.json({
                message: "users could not be fetched",
                result:result,
                statusCode:404
            })
        }
    }
    catch(error){
        res.json({
            message: "error occurred while fetching users" ,
            error:error.message
        })
    }
}

exports.getSpecificUser = async(req, res)=>{
    try{
        const result = await userModel.findOne({_id:req.params.user_id})
        if(result){
            res.json({
                message: "User has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "error occurred while getting user",
            error:err.message,
            statusCode:500
        })
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const user_id = req.params.user_id;

        const foundResult = await userModel.findOne({_id:user_id});
            if(foundResult){
                if(foundResult.photo){
                    fs.unlink(foundResult.photo , (err)=>{
                        if(!err){
                            console.log("success")
                        }                    })
                }
            }


        const result = await userModel.deleteOne({_id: user_id})
        if(result.deletedCount>0){
            res.json({
                message: "user deleted successfully",
                result:result
            })
        }
        else{
            res.json({
                message: "could not delete user , user with this id may not exist",
                result:result
            })
        }
        
     }
     catch(err){
        res.json({
            message: "Error occurred while deleting user",
            error:err.message,
            statusCode:500
        })
     }
}


exports.updateUser= async (req,res)=>{
    try{
        const user_id = req.body.user_id
        const email = req.body.email
        const user_name = req.body.user_name;
        const device_token = req.body.device_token;
        const gender = req.body.gender;
        const age= req.body.age;
        const experience = req.body.experience;


        const foundResult = await userModel.findOne({_id:user_id});
        
        if(experience){
            if(foundResult.user_type !== "barber"){
                return(
                    res.json({
                        message: "experience can only be added if user_type is barber",
                        status:false,
                    })
                )
            }
        }

        if(req.file){
            const foundResult = await userModel.findOne({_id:user_id});
            if(foundResult){
                if(foundResult.photo){
                    fs.unlink(foundResult.photo , (err)=>{
                        if(!err){
                            console.log("success")
                        }                    })
                }
            }
        }

        if(req.file){
           var result=await userModel.findOneAndUpdate({_id:user_id},
                {
                   email:email,
                   user_name:user_name,
                   device_token:device_token,
                   photo:req.file.path,
                   experience:experience,
                   age:age,
                   gender:gender

                },
                {
                    new:true
                })
        }
        else{
            var result=await userModel.findOneAndUpdate({_id:user_id},
                {
                   email:email,
                   user_name:user_name,
                   device_token:device_token,
                   experience:experience,
                   age:age,
                   gender:gender
                },
                {
                    new:true
                })
        }

    
                if(result){
                    res.json({
                        message: "updated successfully",
                        result: result,
                        statusCode:200
                    })
                }
                else{
                    res.json({
                        message: "failed to update successfully",
                        result: result
                    })
                }
        
    }
    catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}

exports.updatePayment_info = async(req,res)=>{
    try{
        const user_id = req.body.user_id;
        const payment_info = req.body.payment_info;
        
        const result = await userModel.findOneAndUpdate({_id:user_id} , {payment_info:payment_info} , {new:true});
        if(result){
            res.json({
                message: "updated successfully",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "failed to update successfully",
                result: result
            })
        }
    }
     catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}


exports.updatePassword =async (req,res)=>{
    try{
        const email = req.body.email;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await userModel.findOneAndUpdate({email: email} ,
            {
                password:hashPassword
            },
            {
                new:true
            }) 

            if(result){
                res.json({
                    message: "Password has been updated",
                    result:result
            })
            }
            else{
                res.json({
                    message: "Password could not be updated successfully",
                    result:null
                })
            }
    }
    catch(err){
        res.json({
            message: "Error occurred while updating passwords",
            error:err.message
        })
    }
}


exports.getAllDeviceTokens = async (req,res)=>{
    try{
        let array =[]
        const result = await userModel.find({});
        result.forEach(element => {
            if(element){
                if(element.device_token){
                    if(element.device_token!=="0"){
                        array.push(element.device_token);

                    }
                }
            }
        });

        if(array){
            res.json({
                message: "All device_tokens",
                result:array,
                status: true,

            })
        }
        else{
            res.json({
                message: "Could not get all device_tokens",
                status: false,
            })
        }
        
    }
    catch(e){
        res.json({
            message: "Error Occurred",
            error:e.message,
            status:false,
        })
    }
}

exports.change_blockStatus = async (req,res)=>{
    try{
        const user_id = req.body.user_id;
        const blockStatus = req.body.blockStatus;
        console.log(blockStatus, user_id)
        if(!user_id || !typeof(blockStatus)=="boolean"){
            return(
                res.json({
                    message: "Please provide user_id & blockStatus both.",
                    status: blockStatus,
                })
            )
        }

        const result = await userModel.findOneAndUpdate({_id:user_id},
            {
                blockStatus:blockStatus
            },
            {
                new:true    
            }
        )

        if(result){
            res.json({
                message: "Block status has been updated",
                result:result,
                status:true,
            })

        }
        else{
            res.json({
                message: "Block status could not be updated successfully",
                status:false,
            })}
}
catch(err){
    res.json({
        message: "Error Occurred",
        error:err.message,
        status:false,
    })

}
}


exports.updateUserLocation = async(req,res)=>{
    try{
        const user_id = req.body.user_id;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        if(!user_id || !latitude || !longitude){
            return(
                res.json({
                    message: "Please provide user_id & latitude & longitude all.",
                    status: false,
                })
            )

        }

        const result = await userModel.findOneAndUpdate({_id:user_id} , 
            {
                $set: {
                    "location.coordinates": [longitude,latitude],
                  },
            },
            {
                new:true
            },
        )

        if(result){
            res.json({
                message: "Location updated successfully",
                result:result,
                status:true,
            })

        }
        else{
            res.json({
                message: "Could not update",
                status:false,
            })}
}
catch(err){
    res.json({
        message: "Error Occurred",
        error:err.message,
        status:false,
    })

}
    
}


exports.getBarbersInRadius = async (req , res)=>{
try{
    let long = req.query.long;
    let lat = req.query.lat;  
    let radius = req.query.radius;

    if(!long || !lat || !radius){
        return (
            res.json({
                message: "Please provide lat, long and radius.",
                status: false,
            })
        )
    }
    radius = parseFloat(radius);
    long = parseFloat(long);
    lat = parseFloat(lat);





    const result = await userModel.aggregate([
        {
            $geoNear: {
               near: { type: "Point", coordinates: [ long, lat ] },
               distanceField: "dist.distance_km",
               maxDistance:radius*1000 ,
               distanceMultiplier :0.001,
               includeLocs: "dist.location",
               spherical: true
        }
        },
       
    ]);

    
    if(result){
        res.json({
            message: "Barbers with in this radius found",
            result:result,
            status:true,
        })

    }
    else{
        res.json({
            message: "Could not fetch results",
            status:false,
        })}
    
    
}
catch(err){
    res.json({
        message: "Error Occurred",
        error:err.message,
        status:false,
    })

}
}
const registerSchema = Joi.object({
  user_name: Joi.string(),
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
  blockStatus: Joi.boolean(),
  device_token:Joi.string(),
  user_type: Joi.string(),
  payment_info: Joi.string(),
  experience: Joi.string(),
  age: Joi.string(),
  gender:Joi.string(),
  location: Joi.string(),
})


const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});
