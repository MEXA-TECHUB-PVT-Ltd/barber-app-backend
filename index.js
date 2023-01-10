const express = require("express")

const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app= express();
const PORT = 3000;

// const userLogsModel= require('./models/userLogsModels')


const cors = require('cors');
mongoose.set('strictQuery', false);


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

require('dotenv').config()



//connect to db
mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);

//middleware
app.use(express.json());


app.use("/admin" , require("./routes/adminRoute"))
app.use("/forgetPassword" , require("./routes/userForgetRoute"))
app.use("/hairStyle" , require("./routes/hairStyleRoute"))
app.use("/user" , require("./routes/userRoute"))
app.use("/barber_rating" , require("./routes/barberRatingRoute"))
app.use("/work_day_for_shop" , require("./routes/work_day_for_shopRoute"))
app.use("/work_day_for_shop_timings" , require("./routes/work_day_for_shopTimingRoute"))
app.use("/privacyPolicy" , require("./routes/privacyPolicyRoute"))
app.use("/terms_conditions" , require("./routes/term&conditionRoute"))
app.use("/appointment" , require("./routes/appointment_route"))
app.use("/appointmentHistory" , require("./routes/appointmentHistoryRoute"))
app.use("/commission" , require("./routes/commissionRoute"))
app.use("/hairStyle_price" , require("./routes/hairStylePriceRoute"))













const server= app.listen(3000, function () {
    console.log("server started on port 3000")
})


