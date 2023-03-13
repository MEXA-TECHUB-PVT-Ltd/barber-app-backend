
const db = require('../databaseConnection/sequelizeModel');
const HairStyleModel = db.HairStyle;
const Admin = db.Admin;
const Barber = db.Barber;

exports.createHairStyle = async (req, res) => {
    try {
        const title = req.body.title;
        const image = req.body.image;
        const created_by = req.body.created_by;
        const created_by_id = req.body.created_by_id;


        const result = await HairStyleModel.create({
            title: title,
            image: image,
            created_by: created_by,
            created_by_id: created_by_id,
            trash : false
            
        })

        if (result) {
            res.status(201).json({
                message: "Record has entered",
                status: true,
                result: result.dataValues
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
}

exports.getAllHairStyles = async (req, res) => {
    try {
        let result = await HairStyleModel.findAll({
            where: { created_by: 'admin' , trash: false },
            include: [{
                model: Admin,
            }]
        })


        const barber_id = req.query.barber_id; // optional;


        let array;
        if (barber_id) {
            array = await HairStyleModel.findAll({
                where: { created_by: 'barber', created_by_id: barber_id , trash : false },
                include: [{
                    model: Barber,
                }]
            });

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
        res.json({
            message: "Error",
            error: err.message
        })
    }


}

exports.getHairStyle = async (req, res) => {
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
        const foundResult = await HairStyleModel.findOne({ where: { id: hair_style_id , trash : false} });
        if (foundResult) {
            type = foundResult.created_by;
        }


        if (type == 'admin') {
            result = await HairStyleModel.findOne({
                where: { id: hair_style_id , trash : false},
                include: [{
                    model: Admin,
                }]
            });

        }

        if (type == 'barber') {
            result = await HairStyleModel.findOne({
                where: { id: hair_style_id , trash : false},
                include: [{
                    model: Barber,
                }]
            });

        }

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

}

exports.updateHairStyle = async (req, res) => {
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

        const obj = {
            title: title,
            image: image,
        }

        const result = await HairStyleModel.update(obj, { where: { id: hair_style_id }, returning: true, raw: true });

        if (result[0] == 1) {
            res.json({
                message: "Updated",
                status: true,
                result: result[1]
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
}


exports.deleteHairStyle= async (req , res)=>{
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

        const result = await HairStyleModel.destroy({
            where : {id : hair_style_id}
        });

        console.log(result)

        if(result==1){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                result: result[1]
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
}