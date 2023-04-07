const {pool} = require("../../config/db.config");

exports.setPrice = async (req, res)=>{
    const client = await pool.connect();
    try{
        const price = req.body.price;

        const findOneQuery= 'SELECT * FROM hairCutPrices WHERE hair_cut_price_id = $1';       
        const foundResult = await pool.query(findOneQuery , [1]) 
        if(foundResult.rowCount>0){
            return(
                res.json({
                    message: "price is already set , you can update it with another api",
                    status : false
                })
            )
        }

      const query = 'INSERT INTO hairCutPrices (hair_cut_price_id , price ) values ($1 , $2) RETURNING *';
      const result = await pool.query (query , [1 , price])
        
        
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
    catch(err){
        res.status(500).json({
            message: "Error",
            status: false,
            error : err.message
        })
    }
    finally {
        client.release();
      }
}

exports.updatePrice = async(req,res)=>{
    const client = await pool.connect();
    try{
        const price = req.body.price;

        const query = 'UPDATE hairCutPrices set price = $1 WHERE hair_cut_price_id = $2 RETURNING *'
        const result = await pool.query(query , [price,1])

        if (result.rowCount>0) {
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
    catch(err){
        res.status(500).json({
            message: "Error",
            status: false,
            error : err.message
        })
    }
    finally {
        client.release();
      }
}