const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {pool} = require("../../config/db.config");




exports.registerAdmin =async (req,res,next)=>{
    const client = await pool.connect();

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

    const found_email_query = 'SELECT * FROM admins WHERE email = $1'
    const emailExists = await pool.query(found_email_query , [email])

    if (emailExists.rowCount>0) {
        return (
            res.status(400).json({
                message: "admin with this email already exists",
                status: false
            })
        )
    }



    const query = 'INSERT INTO admins (email , password) VALUES ($1 , $2) RETURNING*'
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    const result = await pool.query(query , [email , hashPassword]);
    console.log(result.rows[0])

    if(result.rows[0]){
        res.json({
            message: "admin Has been registered successfully",
            status : true,
            result:result.rows[0]
        })
    }
    else{
        res.json({
            message: "Could not Register user",
            status :false,
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
    finally {
        client.release();
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
        const query = 'SELECT * FROM admins WHERE email = $1';
        const foundResult = await pool.query(query  , [email]);

        console.log(foundResult)


        if (foundResult.rowCount == 0) {
            return (
                res.status(400).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }
        const vaildPass = await bcrypt.compare(password, foundResult.rows[0].password);
        if (!vaildPass) {
            return (
                res.status(401).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }

        const token = jwt.sign({ id: foundResult.id }, process.env.TOKEN, { expiresIn: '30d' });
        res.json({
            message: "Logged in Successfully",
            status: true,
            result: foundResult.rows[0],
            jwt_token: token
        });

        
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