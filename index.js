const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
const { collection, Appointments } = require("./config");
const PORT = 5001;


//middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("home");
});


app.get("/signup", (req, res) => {
    res.render("signup");
});


app.get("/login",(req,res) => {
    res.render("login");
});


app.get("/appointment", (req, res) => {
    res.render('appointment');
})


app.get("/admin", async (req, res) => {
    try {
        const appts = await Appointments.find({}).sort({ createdAt: -1 });
        res.render('admin', { appts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //check if the user already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists. please choose a different username.");
    } else {
        //hash the password using bcrypt
        const saltRounds = 10; // Number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; //replace the hash password with original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});

//Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("user name cannot found");
        }

        //compare the hash password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            req.send("wrong password");
        }
    } catch {
        res.send("wrong Details");
    }
});

app.post("/appointment", async (req, res) => {
    const newAppointment = {
        name: req.body.name,
        email: req.body.email,
        date: req.body.date,
        time: req.body.time,
        service: req.body.service
    }

    await Appointments.insertMany([newAppointment]);
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})