// this file contain code for Model of database ie. SCHEMA

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
  },
  address: {
    type: String,
    require: true,
  },
  projects: {
    type: String,
  },
  links: [String],
  skills: [String],
  graduations: [
    {
      year: String,
      degree: String,
    },
  ],
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  work: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  // image: {
  //   filename: {
  //     type: String,
  //   },
  //   filepath: {
  //     type: String,
  //   },
  // },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        require: true,
      },
      phone: {
        type: Number,
        require: true,
      },
      message: {
        type: String,
        require: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

//creating hash value for password
// we are using normal function because fat arrow fn don't work with this keyword
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//creating token with jwt
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

//adding contact form data to main data
userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    console.log("in add");
    this.messages = this.messages.concat({
      name: name,
      email: email,
      phone: phone,
      message: message,
    });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

// here model is created using schema defined above
// first argument must be singular ie. 'User'
const User = mongoose.model("User", userSchema);

module.exports = User;
