const {pool} = require("../../config/db.config");




exports.createLenght = async (req, res) => {
    const client = await pool.connect();
    try {
        const name = req.body.name;
        let length = req.body.length;
        console.log(length)


        if (!name || !length) {
            return (
                res.json({
                    message: "name and length must be provided",
                    status: false
                })
            )

        }

        const found_length_query = 'SELECT * FROM lengths WHERE name = $1'
        const foundResult = await pool.query(found_length_query , [name])
        


        if (foundResult.rowCount>0) {
            return (
                res.status(400).json({
                    message: "length with this email already exists",
                    status: false
                })
            )
        }


        let matchedArray = name.match('^(Number [0-9]*)$');
        console.log(matchedArray)
        if (!matchedArray) {
            return (
                res.json({
                    message: "name must follow the following format  , Number 1 , Number 2 , Number 3 ....",
                    status: false,
                })
            )
        }


        if (parseInt(length) > 8) {
            return (
                res.json({
                    message: "Length should not exceed from 8",
                    status: false,
                })
            )
        }


       
        const query = 'INSERT INTO lengths (name , length) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query , [name , length]);

        console.log(result)

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
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.get_all_lengths = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM lengths'
        const result = await pool.query(query);
        console.log(result)

        if (result) {
            res.json({
                message: "All Lenghts fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "Could not fetch",
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

exports.get_length = async (req, res) => {
    const client = await pool.connect();
    try {
        const length_id = req.query.length_id;

        if (!length_id) {
            return (
                res.json({
                    message: "Please provide lenght id",
                    status: false
                })
            )
        }


         const found_length_query = 'SELECT * FROM lengths WHERE id = $1'
        const result = await pool.query(found_length_query , [length_id])
        
        console.log(result)

        if (result.rowCount>0) {
            res.json({
                message: "Length Fetched with this Id",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not fetch",
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

exports.update_lenght = async (req, res) => {
    const client = await pool.connect();
    try {
        const length_id = req.body.length_id;
        const length = req.body.length;
        const name = req.body.name;

        console.log( "ksghjbs")
        if (!length_id) {
            return (
                res.json({
                    message: "Please provide lenght id",
                    status: false
                })
            )
        }

        if (name) {
            const found_length_query = 'SELECT * FROM lengths WHERE id = $1'
            const foundResult = await pool.query(found_length_query , [length_id])           
             if (foundResult.rowCount>0) {
                if(foundResult.rows[0].id != length_id){
                    return (
                        res.json({
                            message: "Some other length with this name already exists",
                            status: false,
                        })
                    )
                }
                
            }

            let matchedArray = name.match('^(Number [0-9]*)$');
            console.log(matchedArray)
            if (!matchedArray) {
                return (
                    res.json({
                        message: "name must follow the following format  , Number 1 , Number 2 , Number 3 ....",
                        status: false,
                    })
                )
            }
        }


        if(length){
            if (parseInt(length) > 8) {
                return (
                    res.json({
                        message: "Length should not exceed from 8",
                        status: false,
                    })
                )
            }
        }
        

        let query = 'UPDATE lengths SET name = $1 , length= $2  WHERE id = $3 RETURNING*'
        let values =[
           name ? name : null,
           length ? length : null,
           length_id ? length_id : null
       ]
       const result = await pool.query(query , values)

        console.log(result)

        if(result.rows[0]){
            res.json({
                message : "Record Updated",
                status : true,
                result:result.rows[0]
            })
        }
        else{
            res.json({
                message: "Record could not be updated",
                status :false,
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


exports.deleteLength = async (req , res)=>{
    const client = await pool.connect();
    try{
        const length_id = req.query.length_id;
        if (!length_id) {
            return (
                res.json({
                    message: "Please provide length_id",
                    status: false
                })
            )
        }

        const query = 'DELETE from lengths WHERE id = $1 RETURNING *';
        const result = await pool.query(query , [length_id]);
        console.log(result)
        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deleted_record : result.rows[0]
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