const {pool} = require("../../config/db.config");


exports.createTimeSlots = async (req, res) => {
    const client = await pool.connect();
    try {

        let start_time = req.body.start_time;
        let end_time = req.body.end_time;
        const barber_id = req.body.barber_id;
        const day_id = req.body.day_id;

    
        if (!start_time || !end_time || !barber_id || !day_id) {
            return (
                res.status(400).json({
                    message: "start_time , end_time , day_id and barber_id , must be provided",
                    status: false
                })
            )
        }


       const query = 'INSERT INTO slot_days_timmings (start_time , end_time , barber_id , day_id) VALUES ($1 , $2 ,$3 ,$4) RETURNING *'
       const result = await pool.query(query , [
            start_time ? start_time : null ,
            end_time ? end_time : null ,
            barber_id ? barber_id  : null ,
            day_id ? day_id : null
       ])

       console.log(result)
        if (result.rows[0]) {
            res.status(200).json({
                message: "Time slot added for barber",
                status: true,
                result: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message : "Could not add time slot",
                status : false
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}

exports.getBarberSlot = async (req,res)=>{
    const client = await pool.connect();
    try{
        const barber_id = req.query.barber_id;
        const day_name = req.query.day_name ;
        if(!barber_id || !day_name){
            return (
                res.json({
                    message: "Please provide barber_id and name",
                    status : false
                })
            )
        }
        const query = 'SELECT * FROM slot_days_timmings INNER JOIN slot_days ON slot_days.slot_day_id = slot_days_timmings.day_id WHERE slot_days_timmings.barber_id = $1';
        let result = await pool.query(query , [
            barber_id
        ]);

        result = result.rows;

        const array = result.filter((element =>{
            if(element.name== day_name){
                return element;
            }
        }))


        if(array){
            res.json({
                message: "ALl  time_slots of barber for this day fetched",
                result : array,
                status: true
            })
        }
        else{
            res.json({
                message: "Could not fetch",
                status :false
            })
        }
    }
     catch (err) {
        res.status(500).json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}


exports.deleteTimeSlots = async(req,res)=>{
    const client = await pool.connect();
    try{
        const time_slot_id = req.query.time_slot_id;
        if(!time_slot_id){
            return (
                res.json({
                    message: "Please provide time_slot_id",
                    status : false
                })
            )
        }


        const query = 'DELETE FROM slot_days_timmings WHERE slot_day_timmings_id = $1 RETURNING *';
        const result = await pool.query(query , [time_slot_id]);

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
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }
}