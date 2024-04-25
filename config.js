const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/MedLife");

connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});


const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});
const collection = new mongoose.model("users", LoginSchema);


const AppointmentSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    }
})

const Appointments = mongoose.model("Appointments", AppointmentSchema);

module.exports= {collection, Appointments};