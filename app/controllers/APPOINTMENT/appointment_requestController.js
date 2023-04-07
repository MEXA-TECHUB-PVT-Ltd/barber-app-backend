const { pool } = require("../../config/db.config");


exports.create_request = async(req , res)=>{
    try{
        const barber_id = req.body.barber_id ;
        const customer_id = req.body.customer_id;
        const appointment_id = req.body.appointment_id;

        if(!barber_id || !customer_id || !appointment_id){
            return(
                res.json({
                    message: "barber_id , customer_id , appointment_id must be provided",
                    status : false
                })
            )
        }


         const insert_query = 'INSERT INTO appointment_requests (appointment_id , barber_id , customer_id ) VALUES ($1 , $2 , $3 ) RETURNING*'
        const result = await pool.query(insert_query,
            [

                appointment_id ? appointment_id : null,
                barber_id ? barber_id : null,
                customer_id ? customer_id : null,
            ]);


        if(result.rows[0]){
            res.json({
                message: "Request created",
                status : true,
                result: result.rows[0],
            })
        }
        else{
            req.json({
                message: "Could not create request",
                status : false
            })
        }
    }
    catch(err){
        console.log(err)
        res.json({
            message : "Error Occurred",
            status : false,
            error :err.message
        })
    }
}

exports.getAppointmentRequestBy_id = async(req,res)=>{
    try{
        const appointment_request_id = req.query.appointment_request_id;

        if(!appointment_request_id){
            return(
                res.json({
                    message: "appointment_request_id must be provided",
                    status : false
                })
            )
        }

        const query = 'SELECT * FROM appointment_requests WHERE appointment_request_id= $1';
        const result = await pool.query(query , [appointment_request_id])
        if(result.rows[0]){
            res.json({
                message: "Appointment request fetcehd",
                status : true,
                result :result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not fetch appointment request",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error :err.message
        })
    }
}

exports.viewAppointment_requestOfBarber = async(req,res)=>{
    try{
        const barber_id = req.query.barber_id;
        if(!barber_id){
            return(
                res.json({
                    message: "barber_id must be provided",
                    status : false
                })
            )
        }
        const query = 'SELECT * FROM appointment_requests WHERE barber_id= $1';
        const result = await pool.query(query , [barber_id]);

        
        if(result.rows){
            res.json({
                message: "Appointment requests of barber fetcehd",
                status : true,
                result :result.rows
            })
        }
        else{
            res.json({
                message: "Could not fetch appointment request",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error :err.message
        })
    }
}

exports.acceptRequestByBarber = async(req,res)=>{
    try{
        const appointment_request_id = req.query.appointment_request_id;

        if(!appointment_request_id){
            return(
                res.json({
                    message: "appointment_request_id must be provided",
                    status : false
                })
            )
        }


        const query = 'UPDATE appointment_requests SET status= $1 WHERE appointment_request_id = $2 RETURNING *';
        const result = await pool.query(query , ["accepted", appointment_request_id])
        if(result.rows[0]){
            res.json({
                message: "APPOINTMENT REQUEST ACCCEPTED",
                status : true,
                result :result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not ACCEPT",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error :err.message
        })
    }
}

exports.rejectRequestByBarber = async(req,res)=>{
    try{
        const appointment_request_id = req.query.appointment_request_id;

        if(!appointment_request_id){
            return(
                res.json({
                    message: "appointment_request_id must be provided",
                    status : false
                })
            )
        }


        const query = 'UPDATE appointment_requests SET status= $1 WHERE appointment_request_id = $2 RETURNING *';
        const result = await pool.query(query , ["rejected", appointment_request_id])
        if(result.rows[0]){
            res.json({
                message: "APPOINTMENT REQUEST REJECTED",
                status : true,
                result :result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not REJECT",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error :err.message
        })
    }
}
