const {pool} = require("../../config/db.config");


exports.addReason = async (req, res) => {
    const client = await pool.connect();
    try {
        const reason_title = req.body.reason_title;
        const percentage_deduction = req.body.percentage_deduction;

        if (!reason_title || !percentage_deduction) {
            return (
                res.json({
                    message: "Please provide reason_title and deduction",
                    status: false
                })
            )
        }

        if (percentage_deduction > 100 || percentage_deduction < 0) {
            return (
                res.json({
                    message: "percentage_deduction value must be in between 0 and 100",
                    status: false
                })
            )
        }
        
        const query = 'INSERT INTO cancellation_reasons (reason_title , percentage_deduction) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query , 
            [
                reason_title ? reason_title : null ,
                percentage_deduction ? percentage_deduction : null
            ]);

            
        if (result.rows[0]) {
            res.status(201).json({
                message: "Reason saved in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

exports.updateReason = async (req, res) => {
    const client = await pool.connect();
    try {
        const reason_id = req.body.reason_id;
        const percentage_deduction = req.body.percentage_deduction;

        if (!reason_id || !percentage_deduction) {
            return (
                res.json({
                    message: "Please provide reason_id and deduction",
                    status: false
                })
            )
        }

        if (percentage_deduction > 100 || percentage_deduction < 0) {
            return (
                res.json({
                    message: "percentage_deduction value must be in between 0 and 100",
                    status: false
                })
            )
        }
       

        let query = 'UPDATE cancellation_reasons SET percentage_deduction= $1 WHERE cancellation_reason_id = $2 RETURNING*'
        let values =[
           percentage_deduction ? percentage_deduction : null,
           reason_id ? reason_id : null
       ]
       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "Updated",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not update . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.deleteReason = async (req, res) => {
    const client = await pool.connect();
    try {
        const reason_id = req.query.reason_id;
        if (!reason_id) {
            return (
                res.json({
                    message: "Please Provide reason_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM cancellation_reasons WHERE cancellation_reason_id = $1 RETURNING *';
        const result = await pool.query(query , [reason_id]);

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
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.getAllReasons = async (req, res) => {
    const client = await pool.connect();
    try {

        const query = 'SELECT * FROM cancellation_reasons'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows
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
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

exports.getReasonById = async (req, res) => {
    const client = await pool.connect();
    try {
        const reason_id = req.query.reason_id;

        if (!reason_id) {
            return (
                res.status(400).json({
                    message: "Please Provide reason_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM cancellation_reasons WHERE cancellation_reason_id = $1'
        const result = await pool.query(query , [reason_id]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
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
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}