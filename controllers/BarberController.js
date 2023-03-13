
const db = require('../databaseConnection/sequelizeModel');
const BarberModel = db.Barber;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


exports.registerBarber=async (req,res,next)=>{

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

    const emailExists = await BarberModel.findOne({where : {email : email}});
    console.log(emailExists)
    if(emailExists){
        return (
            res.status(400).json({
                message: "Barber with this email already exists",
                status:false
            })
        )
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const result = await BarberModel.create({
        email: email,
        password: hashPassword,
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
        console.log(err)
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

        const foundResult = await BarberModel.findOne({where: {email : email}});
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

exports.updateProfile = async (req,res)=>{
    try{
        const barber_id = req.body.barber_id;
        const user_name = req.body.user_name;
        const device_token = req.body.device_token;
        const profile_image = req.body.profile_image;
        const gender = req.body.gender;
        const age = req.body.age;
        const experience = req.body.experience;
        let saloon_long = req.body.saloon_long;
        let saloon_lat = req.body.saloon_lat;
        const block = req.body.block;

        const saloon_location_address= req.body.saloon_location_address;

        if(saloon_lat && !saloon_long || saloon_long && !saloon_lat){
            return(
                res.json({
                    message: "Must provide saloon_lat and saloon_long both",
                    status:false
                })
            )
        }
        
        saloon_lat = parseInt(saloon_lat);
        saloon_long= parseInt(saloon_long)
        let point = { type: 'Point', coordinates: [saloon_long,saloon_lat]}; // GeoJson format: [lng, lat]

        if(!saloon_lat && !saloon_lat){
            point = { type: 'Point', coordinates: [0,0]};
        }

        const result = await BarberModel.update(
            {
                user_name: user_name,
                device_token: device_token,
                profile_image: profile_image,
                gender : gender,
                age: age,
                experience: experience,
                saloon_location: point ,
                saloon_location_address: saloon_location_address,
                block: block
            },
            {
                where: {id : barber_id},
                returning:true,
                raw:true
            }
        );

        if (result[0]==1) {
            res.status(201).json({
                message: "Profile Updated",
                status: true,
                result: result[1]
            })
        }
        else {
            res.status(500).json({
                message: "Could not Update profile",
                status: false,
            })
        }


    }
    catch(err){
        console.log(err)
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
  