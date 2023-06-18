const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');

const app = express()
const cors = require("cors")
app.use(cors())

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

const collection=require('./models/SignupSchema')
app.use(express.json())

require('dotenv').config()

const PORT = process.env.port || 5000

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("Connected to mongodb.."))
.catch((err) => console.log(err))

// app.use(routes)
app.listen(PORT,() => console.log(`listening on : ${PORT}`))


//verifying password
function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
}

//Uploading signup data
app.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password, repassword } = req.body;
  
    const data = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      repassword: repassword
    };
  
    if (validatePassword(data.password) === false) {
      res.json("invalidpassword");
      return;
    }
  
    try {
      const emailToCheck = data.email;
      const user = await collection.findOne({ email: emailToCheck }).exec();
      if (user) {
        res.json("exist");
        return;
      }
  
      if (data.password === data.repassword) {
        try {
          await collection.insertMany([data]);
          res.json("ok");
        } catch (e) {
          console.log(e);
        }
      } else {
        res.json("unmatch");
      }
    } catch (err) {
      console.error(err);
    }
  });
  

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await collection.findOne({ email: email }).exec();
      if (!user) {
        res.json("userNotFound");
        return;
      }
  
      if (user.password === password) {
        res.json({
          status: "loginSuccess",
          firstname: user.firstname // Pass the firstname as response data
        });
      } else {
        res.json("invalidPassword");
      }
    } catch (err) {
      console.error(err);
      res.json("loginError");
    }
  });
  