
const express = require('express');
const app = express();
const dbConfig = require('./app/config/db.config')

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
require('dotenv').config()
const auth = require('./app/middlewares/auth')


// app.use("/barber_profile_images" , express.static("barber_profile_images"))
// app.use("/hairStyles" , express.static("hairStyles"))
// app.use("/admin_profile_images" , express.static("admin_profile_images"))

const cors = require("cors");

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));



app.use("/admin", require("./app/routes/Users/adminRouts"))
app.use("/Barber", require("./app/routes/Users/barberRoute"))
 app.use("/customer" , require("./app/routes/Users/customerRoute"))



 app.use(auth)
app.use("/imageUpload", require("./app/routes/IMAGE_UPLOAD/imageUploadRoute"))
app.use("/lenght", require("./app/routes/HAIR/lengthRoute"))
app.use("/hairStyle", require("./app/routes/HAIR/hairstyleRoute"))
app.use("/hairCutPprice", require("./app/routes/HAIR/hairCutPriceRoute"))
app.use("/reasonOfCancellation", require("./app/routes/HAIR/cancellation_reasonRoute"))
app.use("/commission", require("./app/routes/HAIR/commissionRoute"))
app.use("/emailVerification", require("./app/routes/EMAIL_VERIFICATION/EmailVerificationRoute"))
app.use("/time_slot", require("./app/routes/TIME_SLOTS/slot_timmingsRoute"))
 app.use("/slot_day" , require("./app/routes/TIME_SLOTS/slot_daysRouts"))
app.use("/appointment" , require("./app/routes/APPOINTMENT/appointmentRoute"))
//  app.use("/appointment" , require("./routes/appointmentRoute"))
app.use("/reasonOfComplain", require("./app/routes/HAIR/complain_reasonRoute"))
app.use("/appointment_request" , require("./app/routes/APPOINTMENT/appointment_requestRoute"))
app.use("/radius" , require("./app/routes/HAIR/radiusRoute"))



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


