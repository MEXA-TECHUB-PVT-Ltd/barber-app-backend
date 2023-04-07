const { query } = require("express");
const {pool} = require("../../config/db.config");

exports.createHairStyle = async (req, res) => {
    const client = await pool.connect();

    try {
        const title = req.body.title;
        const image = req.body.image;
        const created_by = req.body.created_by;
        const created_by_id = req.body.created_by_id;

        if(created_by == 'admin' || created_by == 'barber'){}else{return(res.json({message: "created by must be admin or barber" , status : false}))}

        const query = 'INSERT INTO hairstyles (title , image , created_by , created_by_id) VALUES ($1 , $2 , $3 , $4) RETURNING*'
        const result = await pool.query(query , 
            [
                title?title : null , image ? image : null, created_by ? created_by : null , created_by_id?created_by_id : null
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
        res.json({
            message: "Error",
            error: err.message
        })
    }
    finally {
        client.release();
      }
}


exports.getAllHairStyles = async (req, res) => {
    const client = await pool.connect();
    try {
        const allQuery = 'SELECT * FROM hairstyles INNER JOIN admins ON hairstyles.created_by_id = admins.id WHERE created_by = $1 AND trash= $2';

        let result = await pool.query(allQuery , ['admin' , false]);
        result = result.rows
        console.log(result)
        
        console.log("This is first array " + result)
 
        const barber_id = req.query.barber_id; // optional;


        let array;
        if (barber_id) {
            const barberQuery = 'SELECT * FROM hairstyles INNER JOIN barbers ON hairstyles.created_by_id = barbers.id WHERE created_by = $1 AND trash= $2 AND created_by_id = $3';
            array =await pool.query(barberQuery , ['barber' , false , barber_id]);
            array = array.rows
            console.log(array)
            console.log(result)
            result = result.concat(array);
            
        }

        if (result) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                count : result.length,
                result: result
            })
        }
        else {
            res.status(400).json({
                message: "Could not Fetche data",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.getHairStyle = async (req, res) => {
    const client = await pool.connect();
    try {

        const hair_style_id = req.query.hair_style_id;
        let result;



        if (!hair_style_id) {
            return (
                res.json({
                    message: "Provide hair_style_id ",
                    status: false,

                })
            )
        }

        let type;
        const findOneQuery= 'SELECT * FROM hairstyles WHERE hairStyle_id = $1 AND trash= $2';
        let foundResult = await pool.query(findOneQuery , [hair_style_id , false]);
        if (foundResult.rowCount>0) {
            type = foundResult.rows[0].created_by;
        }

        console.log(type)

        if (type == 'admin') {
            let query = "SELECT * FROM hairstyles INNER JOIN admins ON hairstyles.created_by_id = admins.id WHERE hairStyle_id = $1 AND trash= $2"
            result =  await pool.query(query , [hair_style_id , false]);
            result = result.rows[0]

        }

        if (type == 'barber') {
            let query = "SELECT * FROM hairstyles INNER JOIN barbers ON hairstyles.created_by_id = barbers.id WHERE hairStyle_id = $1 AND trash= $2"
            result =  await pool.query(query , [hair_style_id , false]);
            result = result.rows[0]

        }
        console.log(result)

        if (result) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result
            })
        }
        else {
            res.status(400).json({
                message: "Could not Fetch data",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error",
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

exports.updateHairStyle = async (req, res) => {
    const client = await pool.connect();
    try {
        const hair_style_id = req.body.hair_style_id;
        const title = req.body.title;
        const image = req.body.image;

        if (!hair_style_id) {
            return (
                res.json({
                    message: "Provide hair_style_id ",
                    status: false,

                })
            )
        }

        let query = 'UPDATE hairstyles SET title = $1 , image= $2  WHERE hairstyle_id = $3 RETURNING*'
        let values =[
           title ? title : null,
           image ? image : null,
           hair_style_id ? hair_style_id : null
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
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.deleteHairStyle= async (req , res)=>{
    const client = await pool.connect();
    try{
        const hair_style_id = req.query.hair_style_id;
        if (!hair_style_id) {
            return (
                res.json({
                    message: "Please provide hair_style_id",
                    status: false
                })
            )
        }

        
        const query = 'DELETE from hairstyles WHERE hairStyle_id = $1 RETURNING *';
        const result = await pool.query(query , [hair_style_id]);

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
        res.status(500).json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}