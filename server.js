var express = require("express");
var app = express();
var path = require("path");

// var app = express()
// var blog = express()
// var blogAdmin = express()

// app.use('/blog', blog)
// blog.use('/admin', blogAdmin)

// console.dir(app.path()) // ''
// console.dir(blog.path()) // '/blog'
// console.dir(blogAdmin.path()) // '/blog/admin'

// app.set('title' , 'hello');
// console.log(app.get('title'));

const multer = require("multer");
//multer support bellow line as well.
//app.use(express.urlencoded({extended}))

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    //cb= callBack
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//set the public file to static
app.use(express.static("./public/"));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.send(`<h2>Week 5 Demo </h2>
  <div style="background-color: aquamarine;">
    <ul>
          <li> <a href='/my-form'>Go to the my form</a> </li>
          <li> <a href='/register-user'>Go to the Register Form</a> </li>
      </ul>
      </div>
    `);
});

// setup another route to listen on /about
app.get("/my-form", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/MyForm.html"));
});

app.post("/my-form", function (req, res) {
  res.send("<h2>Your form is successfully submitted!</h2>");
});

app.get("/register-user", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/registerUser.html"));
});

app.post("/register-user", upload.single("photo"), function (req, res) {
  const formData = req.body; //parsed by multer
  const formFile = req.file; //

  const dataReceived =
    "Your submission was received:<br/><br/>" +
    "Your form data was:<br/>" +
    JSON.stringify(formData) +
    "<br/><br/>" +
    "Your File data was:<br/>" +
    JSON.stringify(formFile) +
    "<br/><p>This is the image you sent:<br><img src='/photos/" +
    formFile.filename +
    "'/>";
  res.send(dataReceived);
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
