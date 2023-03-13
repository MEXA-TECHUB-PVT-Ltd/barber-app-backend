const db = require('../databaseConnection/sequelizeModel');
const HairCutPriceModel = db.HairCutPrice;


exports.setPrice = async (req, res)=>{
    try{
        const price = req.body.price;

        const foundResult = await HairCutPriceModel.findOne({where: {id : 1}});
        if(foundResult){
            return(
                res.json({
                    message: "price is already set , you can update it with another api",
                    status : false
                })
            )
        }

        const result = await HairCutPriceModel.create({
             id: 1,
             price : price
        });

        
        
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
    catch(err){
        res.status(500).json({
            message: "Error",
            status: false,
            error : err.message
        })
    }
}

exports.updatePrice = async(req,res)=>{
    try{
        const price = req.body.price;

        const result = await HairCutPriceModel.update({price : price} , {where : {id : 1} , returning:true , raw:true});

        if (result[0]==1) {
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
    catch(err){
        res.status(500).json({
            message: "Error",
            status: false,
            error : err.message
        })
    }
}