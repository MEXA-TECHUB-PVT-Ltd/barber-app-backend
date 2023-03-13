

const db = require("../databaseConnection/sequelizeModel");
const otpStoredModel = db.otpStored;
const adminModel = db.Admin;
const BarberModel = db.Barber;
const emailOTPBody = require("../utils/emailOTPBody")

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.EMAIL_USERNAME,
       pass: process.env.EMAIL_PASSWORD,
    },
});



exports.sendEmail =async (req,res)=>{
    try{
        const email = req.body.email;
        
        const foundEmail = await adminModel.findOne({where: {email : email}});
        if(foundEmail){
            sendOTPVerificationEmail(foundEmail.email , res)
        }
        else{
            const foundEmail = await BarberModel.findOne({where: {email : email}});
            if(foundEmail){
                sendOTPVerificationEmail(foundEmail.email , res)
            }
            else{
                res.json({
                    message : "This email is not Registered with this app , please add valid email",
                    status : false
                })
            }

        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}

exports.verifyOTP = async (req,res)=>{
    try{
        const email = req.body.email;
        const otp = req.body.otp;

        const result =await otpStoredModel.findOne({where: {email :email , otp:otp}});

        if(result){
            res.json({
                message: "OTP verified",
                status: true,
                result: result
            })
        }
        else{
            res.json({
                message : "Verification Rejected",
                status:false
            })
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({
          message: `Internal server error occurred`,
          success:false,
        });
      }
}


const sendOTPVerificationEmail = async (email , res)=>{
    try{
        let result;
        const otp= `${Math.floor(1000+Math.random()*9000)}`
        console.log(otp)


        const foundStoredOtp = await otpStoredModel.findOne({where: {email : email}});

        if(!foundStoredOtp){
             result = await otpStoredModel.create({
                email : email ,
                otp : otp 
            });
        }

        if(foundStoredOtp){
            result= await otpStoredModel.update({otp : otp} , {where: {email :email} , returning:true});
            result = result[1];
        }

        let sendEmailResponse = await transporter.sendMail({
            from:process.env.EMAIL_USERNAME,
             to: email,
             subject: 'Verify Account',
             html: emailOTPBody(otp , "Barber App" , "#746C70")
             
           });

           console.log(sendEmailResponse);

           if(sendEmailResponse.accepted.length>0){
            res.status(200).json({
                message: `Sent a verification email to ${email}`,
                success:true,
                data:result
              });
           }
           else{
            res.status(404).json({
                message: `Could not send email`,
                success:false,
              });
           }

           
        
    }
    catch(err){
      console.log(err)
      res.status(500).json({
        message: `Internal server error occurred`,
        success:false,
      });
    }
}