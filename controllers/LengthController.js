
const db = require('../databaseConnection/sequelizeModel');

const LengthModel = db.Lenght;


exports.createLenght = async (req, res) => {
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

        const foundResult = await LengthModel.findOne({ where: { name: name } });

        if (foundResult) {
            return (
                res.json({
                    message: "length with this name already exists",
                    status: false,
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


        const result = await LengthModel.create({
            name: name,
            length: length

        });

        console.log(result)

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
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.get_all_lengths = async (req, res) => {
    try {
        const result = await LengthModel.findAll({});
        console.log(result)

        if (result) {
            res.json({
                message: "All Lenghts fetched",
                status: true,
                result: result
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
}

exports.get_length = async (req, res) => {
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
        const result = await LengthModel.findOne({ where: { id: length_id } });
        console.log(result)

        if (result) {
            res.json({
                message: "Length Fetched with this Id",
                status: true,
                result: result
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
}

exports.update_lenght = async (req, res) => {
    try {
        const length_id = req.body.length_id;
        const length = req.body.length;
        const name = req.body.name;




        if (!length_id) {
            return (
                res.json({
                    message: "Please provide lenght id",
                    status: false
                })
            )
        }

        if (name) {
            const foundResult = await LengthModel.findOne({ where: { name: name } });
            if (foundResult) {
                if(foundResult.id != length_id){
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
        

        const result = await LengthModel.update(
            {
                name: name,
                length:length
            },
            {
                where: {id : length_id},
                returning:true,
                raw:true
            }
        );


        console.log(result)

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
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
}

exports.deleteLength = async (req , res)=>{
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

        const result = await LengthModel.destroy({
            where : {id : length_id}
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