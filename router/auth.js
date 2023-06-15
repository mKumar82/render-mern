const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../models/userSchema");

// ---------------using async / await---------------Preffered
router.post("/register", async (req, res) => {
  //destructuring data
  const { name, email, phone, work, password, cpassword } = req.body;

  //   ---------validation--------------
  if (!email || !password) {
    return res.status(442).json({ error: "plz fill field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(442).json({ error: "Email already exists" });
    }

    // creating new user
    const user = new User({ name, email, phone, work, password, cpassword });

    // middleware for hashing in definrd in userSchema.js

    //save after hashing
    await user.save();

    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error);
  }

  // console.log(req.body);
  // res.json({message:req.body});
});

router.post("/login", async (req, res) => {
  try {
    // console.log("in login")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(442).json({ error: "plz fill field properly" });
    }

    //checking if email exists in database
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      // console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      if (!isMatch) {
        return res.status(442).json({ error: "password not matched" });
      } else {
        res.status(201).json({ message: "user signin successfully" });
      }
    } else {
      res.status(201).json({ message: "user error" });
    }
  } catch (error) {
    console.log(error);
  }
});

// authenticate is the middleware which will check if user is logged in or not
// if logged in then send rootUser ,rootusercontains all the user details
router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//contact fields auto filled data
router.get("/getData", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//contact form data
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      // console.log("error in contact form");
      return res.json({ error: "plz fill the contact form" });
    }

    // req.userID should not be undefined or null , if any erroe check first
    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();

      res.status(201).json({ message: "user contact info saved" });
    } else {
      console.log("error in adding data");
    }
  } catch (e) {
    console.log(e);
  }
});

//edit profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const updatedData = req.body;
    console.log("in profile backend");

    const user = await User.findOne({ _id: req.userID });

    if (!user) {
      return res.status(404).json({ error: "Profile not found" });
    }

    user.name = updatedData.name;
    user.work = updatedData.work;
    user.experience = updatedData.experience;
    user.address = updatedData.address;
    user.projects = updatedData.projects;
    user.links = [...updatedData.links];
    user.skills = [...updatedData.skills];
    // user.image = [...updatedData.image];
    user.graduations = [...updatedData.graduations];

    await user.save();

    res.status(201).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
});

// const multer = require("multer");

// // Configure Multer for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// Define the API route for image upload
// router.post("/upload", upload.single("image"), (req, res) => {
//   const { filename, path } = req.file;

//   const image = new Image({
//     filename,
//     filepath: path,
//   });

//   image
//     .save()
//     .then(() => {
//       res.status(200).json({ message: "Image saved successfully!" });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "Failed to save image." });
//     });
// });

//logout page
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", {
    sameSite: "None",
    secure: true,
  });
  res.status(200).send("user logout");
});
module.exports = router;
