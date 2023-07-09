const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers");
const bcrypt = require("bcryptjs/dist/bcrypt");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
  });

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        password:password,
        confirmpassword:cpassword,
      })

      //password hashing

      const registered=await registerEmployee.save();       //stores data at database
      res.status(201).render("index");
    } else {
      res.send("password are not matching");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});


// Login check
app.post("/login", async(req, res) => {
    try{
        const email=req.body.email;
        const password=req.body.password;
        const useremail=await Register.findOne({email});

        const isMatch=await bcrypt.compare(password,useremail.password);      //it compare bcryted password for login

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("password is not matching");
        }
    }catch(e){
        res.status(400).send("invalid email");
    }
  });

app.listen(port, () => {
  console.log("server is listening to %s", port);
});
