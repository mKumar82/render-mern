// this file is the starting point of application
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// URI and PORT are assigned in config.env file for security purpose
// just use .env as file name toggle auto-cloaking will work
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const connectDB = require("./db/conn");

//middleware
//the data we get from request is not understable by express so we need to convert it into json
app.use(express.json());


app.use(cors());


app.use(cookieParser());
// app.use('/', routes);



//middleware
//to link the router file
app.use(require("./router/auth"));

// getting port from config.env file
const PORT = process.env.PORT  || 5000;

// when routes is not used app.get is used to service request
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, 'path_to_your_login_html_file'));
// });

//sattic files
app.use(express.static(path.join(__dirname,"./client/build")));

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
})

// here we are creating a async start fn which will call connectDB fn which is defined in db/conn.js
const start = async () => {
  try {
    // connectDB will get backend and database connection
    await connectDB(process.env.DATABASE);

    // server listen on the defined port i.e. 3000
    app.listen(PORT, () => {
      console.log(`${PORT} connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
