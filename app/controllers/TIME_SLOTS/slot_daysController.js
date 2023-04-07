const {pool} = require("../../config/db.config");


exports.create_slot_day = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const name = req.body.name;
        const barber_id = req.body.barber_id;

        if(!name || !barber_id){
            return(
                res.json({
                    message : "name and barber id must be provided",
                    status  : false
                })
            )
        }

        if(name == 'monday' || name == 'tuesday' ||name=='wednesday' || name == 'thursday' || name == 'friday' || name =='saturday' || name == 'sunday'){
        }else{
            return(
                res.status(400).json({
                    message : "Invalide name of day , name of day must be like monday , tuesday .....",
                    status : false

                })
            )
        }

        const query = 'SELECT * FROM slot_days WHERE barber_id = $1 AND name =$2'
        const foundResult = await pool.query(query , [barber_id , name]);

        if (foundResult.rowCount>0) {
            return (
                res.json({
                    message: "This Barber already created this day",
                    status: false,
                })
            )

        }
        const insert_query = 'INSERT INTO slot_days (barber_id , name) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(insert_query , 
            [
                barber_id ? barber_id : null ,
                name ? name : null
            ]);


        if (result.rows[0]) {
            res.json({
                message: "Slot day created",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not create time slot",
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

exports.getBarberDaysAndtimeSlots = async (req, res) => {
    const client = await pool.connect();
    try {
        const barber_id = req.query.barber_id;

        if(!barber_id){
            return(
                res.json({
                    message : "barber id must be provided",
                    status  : false
                })
            )
        }
        
        const barber_query= 'SELECT * FROM barbers WHERE id=$1'
        let barber_details = await pool.query(barber_query , [
            barber_id?barber_id : null
        ]);
        console.log(barber_details)
        barber_details = barber_details.rows[0];
        

        const days_query = 'SELECT * FROM slot_days WHERE barber_id = $1'
        let days_array =await pool.query(days_query , [barber_id]);
        days_array = days_array.rows
        console.log(days_array)

        const slots_timmings_query ='SELECT * FROM slot_days_timmings WHERE barber_id = $1';
        let slot_timmings = await pool.query(slots_timmings_query , [barber_id]);
        slot_timmings = slot_timmings.rows


        for (let day of days_array) {
            day.slot_timmings = [];
            for (let slot of slot_timmings) {
              if (slot.day_id === day.slot_day_id) {
                day.slot_timmings.push(slot);
              }
            }
          }
        
     

        if (days_array) {
            res.json({
                message: "Fetched",
                status: true,
                barber_details : barber_details ,
                days_array : days_array ,
            })
        }
        else {
            res.json({
                message: "Ccould not fetch",
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
