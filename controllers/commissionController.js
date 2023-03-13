const db = require('../databaseConnection/sequelizeModel');
const commissionModel = db.commission

exports.addCommission = async (req, res) => {
    try {
        const percentage = req.body.percentage;
        const name = req.body.name;

        if (percentage > 100) {
            return (
                res.json({
                    message: "percentage cannot be greater than 100",
                    status: false
                })
            )
        }

        const result = await commissionModel.create({
            percentage: percentage,
            name: name,
            trash : false
        });

        if (result) {
            res.json({
                message: "New commission is saved successfully",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "COuld not save successfully",
                result: result
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
}

exports.updateStatus = async (req, res) => {
    try {
        const commission_id = req.body.commission_id;
        if (!commission_id) {
            return (
                res.json({
                    message: "Commission Id is required",
                    status: false
                })
            )
        }
        const inactiveAllCommissions = await commissionModel.update(
            {
                status: 'inactive'
            },
            {
                where: { status: 'active' },
            }
        );

        console.log(inactiveAllCommissions);

        const result = await commissionModel.update(
            {
                status: 'active'
            },
            {
                where: {
                    id : commission_id
                },
                returning: true
            }
        );

        if(result[0]==1){
            res.status(200).json({
                message: "Commission Got active",
                status: true,
                result: result[1]
            })
        }
        else{
            res.status(404).json({
                message: "could not update",
                status: false,
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
}

exports.getAllCommissions = async (req, res) => {
    try {
        const result = await commissionModel.findAll({where: {trash : false}});
        let length = result.length;

        if (result) {
            res.json({
                message: "Success",
                status: true,
                length: length,
                result: result,

            })

        }
        else {
            res.json({
                message: "Error Occurred",
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
}

exports.getCommissionById = async (req, res) => {
    try {
        const commission_id = req.query.commission_id;

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const result = await commissionModel.findOne({ where: { id: commission_id  , trash: false} });

        if (result) {
            res.json({
                message: "Success",
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
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.updateCommission = async (req , res)=>{
    try{
        const commission_id= req.body.commission_id;
        const name = req.body.name;
        const percentage = req.body.percentage;

        if(percentage){
            if (parseInt(percentage) > 100) {
                return (
                    res.json({
                        message: "percentage cannot be greater than 100",
                        status: false
                    })
                )
            }
    
        }

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const obj = {
            name : name ,
            percentage : percentage
        };

        const result = await commissionModel.update(obj , {where : {id : commission_id} , returning:true});

        if(result[0]==1){
            res.json({
                message: "Commission updated",
                status : true , 
                result: result[1]
            })
        }else{
            res.json({
                message: "Could not update it.",
                status:false
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
}

exports.deleteCommission = async(req,res)=>{
    try{
        const commission_id = req.query.commission_id;

        if(!commission_id){
            return(
                res.json({
                    message: "please provide commission id",
                    status:false
                })
            )
        }

        const result = await commissionModel.destroy({
            where : {id : commission_id}
        });


        if(result == 1){
            res.status(200).json({
                message: "Deleted",
                status:true,
            })
        }
        else{
            res.json({
                message: "could not Delete",
                status:false
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
}