
const {pool} = require("../../config/db.config");


exports.createRadius = async(req,res)=>{
    const client = await pool.connect();
    try{
        const radiusInKm = req.body.radiusInKm;
        if(!radiusInKm){
            return(
                res.json({
                    message: "Please provide radiusInKm",
                    status: false,
                })
            )
        }


        const query = "SELECT * FROM radius"
        const foundResult = await pool.query(query);
        if(foundResult.rows[0]){
            return(
                res.json({
                    message: "Radius is already added , you can update it",
                    status :false,
                })
            )
        }


        const insertQuery = 'INSERT INTO radius (radius_id , radiusInKm) VALUES ($1 , $2) RETURNING *';
        const result = await pool.query(insertQuery , [1 , radiusInKm]);


        if(result.rowCount>0){
            res.json({
                messasge: "Radius Inserted",
                status :true,
                result : result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not inserted radius",
                status :false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status :false,
            error:err.message
        })
    }
    finally {
        client.release();
      }
    
}

exports.updateRadius = async(req,res)=>{
    const client = await pool.connect();
    try{
        const radiusInKm = req.body.radiusInKm;
        if(!radiusInKm){
            return(
                res.json({
                    message: "Please provide radiusInKm",
                    status: false,
                })
            )
        }
        const query = 'UPDATE radius SET radiusInKm=$1 WHERE radius_id = $2 RETURNING *';
        const result = await pool.query(query , [radiusInKm , 1]);


        if(result.rowCount>0){
            res.json({
                messasge: "Radius Updated",
                status :true,
                result : result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not update radius",
                status :false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status :false,
            error:err.message
        })
    }
    finally {
        client.release();
      }
}