
const db = require('../databaseConnection/sequelizeModel');
const ReasonCancellationModel = db.ReasonCancellation;


exports.addReason = async (req, res) => {
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

        const result = await ReasonCancellationModel.create({
            reason_title: reason_title,
            percentage_deduction: percentage_deduction,

        });

        if (result) {
            res.status(201).json({
                message: "Reason saved in database",
                status: true,
                result: result
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
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }

}

exports.updateReason = async (req, res) => {
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
        const obj = {
            percentage_deduction: percentage_deduction
        }

        const result = await ReasonCancellationModel.update(obj, { where: { id: reason_id }, returning: true, raw: true });

        if (result[0] == 1) {
            res.status(201).json({
                message: "updated successfully",
                status: true,
                result: result[1]
            })
        }
        else {
            res.status(400).json({
                message: "Could not update",
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

exports.deleteReason = async (req, res) => {
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

        const result = await ReasonCancellationModel.destroy({
            where: { id: reason_id} ,
        });
        console.log(result)

        if (result == 1) {
            res.status(200).json({
                message: "deleted successfully",
                status: true,
                result: result
            })
        }
        else {
            res.status(400).json({
                message: "Could not delete , reason with this id may not exist",
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

exports.getAllReasons = async (req, res) => {
    try {
        const result = await ReasonCancellationModel.findAll({ trash: false });

        if (result) {
            res.json({
                message: "Fetched",
                status: true,
                result: result
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

}

exports.getReasonById = async (req, res) => {
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
        const result = await ReasonCancellationModel.findOne({ where: { id: reason_id }, trash: false });

        if (result) {
            res.json({
                message: "Fetched",
                status: true,
                result: result
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

}