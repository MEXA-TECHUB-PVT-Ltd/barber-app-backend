
const db = require("../databaseConnection/sequelizeModel");

const time_slotsModel = db.time_slots;
const moment = require('moment');
const BarberModel = db.Barber;


exports.createTimeSlots = async (req, res) => {
    try {

        let start_time = req.body.start_time;
        let end_time = req.body.end_time;
        const barber_id = req.body.barber_id;
        const day_id = req.body.day_id;

    
        console.log(day_id)
        if (!start_time || !end_time || !barber_id || !day_id) {
            return (
                res.json({
                    message: "start_time , end_time , day_id and barber_id , must be provided",
                    status: false
                })
            )
        }

        // const response = await handleConflict(start_time, end_time, barber_id, res);
        // console.log(response)

        // if (response == 'start_time_inBetween') {
        //     return (res.status(400).json({ message: "Start time you provide is in between of some other slot", status: false }))
        // }

        // if (response == 'end_time_inBetween') {
        //     return (res.status(400).json({ message: "End time you provide is in between of some other slot", status: false }))
        // }
        // if (response == 'same_slot_timing') {
        //     return (res.status(400).json({ message: "With the same timming slot already exists", status: false }))
        // }

        const result = await time_slotsModel.create({
            start_time: start_time,
            end_time: end_time,
            barber_id: barber_id,
            day_id : day_id
        });

        if (result) {
            res.json({
                message: "Time slot added for barber",
                status: true,
                result: result
            })
        }
        else{
            res.json({
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
}

exports.getBarberSlot = async (req,res)=>{
    try{
        const barber_id = req.query.barber_id;

        const result = await BarberModel.findByPk(barber_id , {include: ['time_slots']});
        console.log(result)
        res.json(result)
    }
     catch (err) {
        res.status(500).json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}


// const handleConflict = async (start_time, end_time, barber_id, res) => {
//     try {
//         let format = 'hh:mm:ss'

//         console.log(start_time, end_time, barber_id)
//         const foundBarberSlots = await time_slotsModel.findAll({ where: { barber_id: barber_id } });
//         console.log(foundBarberSlots)

//         for (let i = 0; i < foundBarberSlots.length; i++) {

//             let Bodystart_time = moment(start_time, format);
//             let Bodyend_time = moment(end_time, format);

//             let getStart_time = foundBarberSlots[i].start_time;
//             let getEnd_time = foundBarberSlots[i].end_time;

//             getStart_time = moment(getStart_time, format);
//             getEnd_time = moment(getEnd_time, format);


//             if (Bodystart_time.isBetween(getStart_time, getEnd_time)) {
//                 console.log("is between")
//                 return 'start_time_inBetween'
//             }
//             else if (Bodyend_time.isBetween(getStart_time, getEnd_time)) {
//                 console.log("end time is not between")
//                 return 'end_time_inBetween'

//             }
//             else if(Bodystart_time.isSame(getStart_time) && Bodyend_time.isSame(getEnd_time)){
//                 return 'same_slot_timing'
//             }
//             else {
//                 return false
//             }
//         }
//     }
//     catch (err) {
//         res.status(500).json({
//             message: "Error Occurred",
//             status: false,
//             error: err.message
//         })
//     }

// }