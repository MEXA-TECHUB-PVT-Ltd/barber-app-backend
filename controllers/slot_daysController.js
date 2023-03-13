const db = require("../databaseConnection/sequelizeModel");
const BarberModel = db.Barber
const slot_daysModel = db.slot_days;
const time_slotsModel = db.time_slots;


exports.create_slot_day = async (req, res) => {
    try {
        const name = req.body.name;
        const barber_id = req.body.barber_id;

        const foundResult = await slot_daysModel.findOne({ where: { barber_id: barber_id, name: name } });
        if (foundResult) {
            return (
                res.json({
                    message: "This Barber already created this day",
                    status: false,
                })
            )

        }

        const result = await slot_daysModel.create({
            barber_id: barber_id,
            name: name

        });
        console.log(result)

        if (result) {
            res.json({
                message: "Slot day created",
                status: true,
                result: result
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
}

exports.getBarberDaysAndtimeSlots = async (req, res) => {
    try {
        const barebr_id = req.query.barber_id;
        const result = await BarberModel.findOne({
            where: { id: barebr_id },
            include: [{
                model: slot_daysModel,
                as: 'days', // specify the alias here
                include: [{
                  model: time_slotsModel,
                  as: "time_slots"
                  // include any other associations as needed
                }]
              }]
        });

        if (result) {
            res.json({
                message: "Fetched",
                status: true,
                result: result
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
}