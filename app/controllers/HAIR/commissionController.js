const { query } = require("express");
const {pool} = require("../../config/db.config");



exports.addCommission = async (req, res) => {
    const client = await pool.connect();
    try {
        const percentage = req.body.percentage;
        const name = req.body.name;

        if (percentage > 100) {
            return (
                res.json({
                    message: "percentage cannot be greater than 100",
                    status: false
                })
            )
        }

        const query = 'INSERT INTO commissions (percentage , name) VALUES ($1 ,$2) RETURNING*'
        const result = await pool.query(query , 
            [
                percentage?percentage : null,
                name ? name : null
            ]);

        if (result.rows[0]) {
            res.status(201).json({
                message: "Record has entered",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save data",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}


exports.updateStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        const commission_id = req.body.commission_id;

        if (!commission_id) {
            return (
                res.json({
                    message: "Commission Id is required",
                    status: false
                })
            )
        }


            const updateQuery = 'UPDATE commissions set status= $1'
            const inactiveAllCommissions = await pool.query(updateQuery , ['inactive'])
            console.log(inactiveAllCommissions);
       

       
         const  query = 'UPDATE commissions set status= $1 WHERE commission_id = $2 RETURNING *'
         const result = await pool.query(query , ['active' , commission_id])

       

        if(result.rowCount>0){
            res.status(200).json({
                message: "Commission Got active and all other commission are inactive now",
                status: true,
                result: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "could not update",
                status: false,
            })
        }
    
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.getAllCommissions = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT * from commissions'
        let result = await pool.query(query)
        result = result.rows;

        let length = result.length;
        if (result) {
            res.json({
                message: "Success",
                status: true,
                length: length,
                result: result,

            })

        }
        else {
            res.json({
                message: "Error Occurred",
                status: false
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.getCommissionById = async (req, res) => {
    const client = await pool.connect();
    try {
        const commission_id = req.query.commission_id;

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const query = 'SELECT * FROM commissions WHERE commission_id = $1'
        const result = await pool.query(query , [commission_id])

        if (result.rowCount>0) {
            res.json({
                message: "Success",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}


exports.updateCommission = async (req , res)=>{
    const client = await pool.connect();
    try{
        const commission_id= req.body.commission_id;
        const name = req.body.name;
        const percentage = req.body.percentage;

        if(percentage){
            if (parseInt(percentage) > 100) {
                return (
                    res.json({
                        message: "percentage cannot be greater than 100",
                        status: false
                    })
                )
            }
    
        }

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const  query = 'UPDATE commissions set percentage= $1 ,name = $2  WHERE commission_id = $3 RETURNING *'
        const result = await pool.query(query , [percentage?percentage : null , name ? name : null , commission_id ? commission_id : null])


        if(result.rows[0]){
            res.json({
                message: "Commission updated",
                status : true , 
                result: result.rows[0]
            })
        }else{
            res.json({
                message: "Could not update it.",
                status:false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}


exports.deleteCommission = async(req,res)=>{
    const client = await pool.connect();
    try{
        const commission_id = req.query.commission_id;

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const query = 'DELETE from commissions WHERE commission_id = $1 RETURNING *';
        const result = await pool.query(query , [commission_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not delete . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }
        

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}