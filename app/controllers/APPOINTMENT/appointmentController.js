const { query } = require("express");
const { pool } = require("../../config/db.config");


exports.createAppointment = async (req, res) => {
    try {
        const length_id = req.body.length_id;
        const style_id = req.body.style_id;
        const time_slot = req.body.time_slot;
        const day = req.body.day;
        const long = req.body.long;
        const lat = req.body.lat;
        let user_id = req.body.user_id;
        user_id = parseInt(user_id)



        if (!length_id || !style_id || !time_slot) {
            return (
                res.status(400).json({
                    message: "time_slot , length_id , style_id must be provided",
                    status: false
                })
            )
        }

        if (day == 'monday' || day == 'tuesday' || day == 'wednesday' || day == 'thursday' || day == 'friday' || day == 'saturday' || day == 'sunday') {
        } else {
            return (
                res.status(400).json({
                    message: "Invalide name of day , name of day must be like monday , tuesday .....",
                    status: false

                })
            )
        }

        let appointment_number = await getRandomInt(999999);
        const insert_query = 'INSERT INTO appointments (appointment_number , length_id , style_id , time_slot , day) VALUES ($1 , $2 , $3 , $4 ,$5 ) RETURNING*'
        const result = await pool.query(insert_query,
            [

                appointment_number ? appointment_number : null,
                length_id ? length_id : null,
                style_id ? style_id : null,
                time_slot ? time_slot : null,
                day ? day : null,
            ]);



        // getting radius from table
        const radius_query= 'SELECT * FROM radius WHERE radius_id= 1';
        let radius = await pool.query(radius_query);
        console.log(radius)
        if(!radius.rows[0]){
            return (
                res.status(400).json({
                    message: "radius is not set for this query by admin , please add radius in radius table to proceed",
                    status: false
                })
            )
        }
        radius = radius.rows[0].radiusinkm;
        radius = parseInt(radius)
     


        let barbers;
        if (result) {
            barbers = await getBarbersWithinRadius(lat, long, radius, pool , user_id)
            console.log("Barbers", barbers)
        }


        if (result.rows[0]) {
            res.status(200).json({
                message: "Appointment Created",
                status: true,
                resutl: result.rows[0],
                barbers_in_radius: barbers

            })
        }
        else {
            res.status(404).json({
                message: "Could not Create appointment",
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
}

async function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


async function getBarbersWithinRadius(centerLat, centerLng, radius, pool , user_id) {
    const query = `
    SELECT *, 
      acos(sin(radians($1)) * sin(radians(saloon_latitude)) 
        + cos(radians($1)) * cos(radians(saloon_latitude)) 
        * cos(radians($2) - radians(saloon_longitude))) * 6371 as distance
    FROM barbers
    WHERE acos(sin(radians($1)) * sin(radians(saloon_latitude)) 
        + cos(radians($1)) * cos(radians(saloon_latitude)) 
        * cos(radians($2) - radians(saloon_longitude))) * 6371 <= $3`;
    let values = [centerLat, centerLng, radius];
    try {
        let array;
        let res = await pool.query(query, values);
        console.log(res)
        array= res.rows;
        array= array.filter((element)=>{
            if(element.id != user_id ){
                return element
            }
        });
        if(array.length<5){
            console.log("After added 10km more as babers are less than 5")
            radius= radius+10;
            console.log(radius)
             values = [centerLat, centerLng, radius];
             res = await pool.query(query , values);
             array = res.rows;
             array= array.filter((element)=>{
                if(element.id != user_id ){
                    return element
                }
            });
        }
        return array;
    } catch (err) {
        console.log(err)
    }
}