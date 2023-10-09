const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "iammaking@notes";
const fetchuser = require("../middleware/fetchuser");
// Create a user using POST "/api/auth/createuser", doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt =await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user : {
            id : user.id,
        }
      }
      const authtoken =  jwt.sign(data , JWT_SECRET)
      res.json(authtoken);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
       res.status(500).json({ error: "internal Server error" });
    }
  }
);
// login  using POST "/api/auth/login", doesn't require authentication

router.post(
  "/login",
  [
   
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password can not be blank").exists(),
   
  ],
  
  //if there are errors ruturn bad request and errors
  async (req, res) => {
    //if there are errors ruturn bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
     let user = await User.findOne({email});

     if (!user){
return res.status(400).json({ errors: "Please enter valid email or password" });
     }

     const passwordCompare = await bcrypt.compare(password, user.password);
     if(!passwordCompare){
        return res
          .status(400)
          .json({ errors: "Please enter valid email or password" });
     }


      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json(authtoken);
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ error: "internal Server error" });
    }
  }
);

//route 3 get logged user details  "/api/auth/getuser",  require authentication
router.post(
  "/getuser",
  fetchuser,
  

  //if there are errors ruturn bad request and errors
  async (req, res) => {
  
    try {
    let  userId = req.user.id;
     const user = await User.findById(userId).select("-password");


      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "internal Server error" });
    }
  }
);
module.exports = router;
