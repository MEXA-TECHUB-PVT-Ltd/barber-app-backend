const db = require('../databaseConnection/sequelizeModel');
const AdminModel = db.Admin;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
exports.registerAdmin =async (req,res,next)=>{

    try{
        const { error } = registerSchema.validate(req.body);
    
    if(error){
        return (
            res.status(400).json({
                message: "Error occurred",
                error: error.details[0].message,
                status:false
            })
        )
    }
    const email = req.body.email;
    const password = req.body.password;

    const emailExists = await AdminModel.findOne({where : {email : email}});
    console.log(emailExists)
    if(emailExists){
        return (
            res.status(400).json({
                message: "Admin with this email already exists",
                status:false
            })
        )
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const result = await AdminModel.create({
        email: email,
        password: hashPassword
    })

   if(result){
    res.status(201).json({
        message: "Record has entered",
        status: true,
        result:result.dataValues
    })
   }
   else{
    res.status(400).json({
        message : "Could not save data",
        status:false
    })
   }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status : false,
            error: err.message
        })
    }
    
}


exports.login = async (req,res)=>{
    try{
        const email = req.body.email;
        let password = req.body.password;

        if(!email || !password){
            return (
                res.status(400).json({
                    message: "email and password must be provided",
                    status:false
                })
            )
        }

        const foundResult = await AdminModel.findOne({where: {email : email}});
        if(!foundResult){
            return (
                res.status(400).json({
                    message: "Wrong email or password",
                    status:false
                })
            )
        }
        
        const vaildPass = await bcrypt.compare(password , foundResult.password);

        if(!vaildPass){
            return (
                res.status(401).json({
                    message: "Wrong email or password",
                    status:false
                })
            )
        }

        const token = jwt.sign({ id: foundResult.id }, process.env.TOKEN , {expiresIn: '30d'});

        
        
            res.json({
                message: "Logged in Successfully",
                status:true,
                result: foundResult,
                jwt_token : token
            })
      

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status : false,
            error: err.message
        })
    }
}
const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  