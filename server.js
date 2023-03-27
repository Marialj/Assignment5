/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Maria Joy Student ID: 176251213 Date: 26 Mar 2023
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 

var express = require("express");
var bodyParser = require('body-parser');
//var path = require("path");
const f = require('./modules/collegeData.js')
const exphbs = require("express-handlebars");
var app = express();

var HTTP_PORT = process.env.PORT || 8081;

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
  });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs',exphbs.engine({ extname: '.hbs',
helpers:{ navLink:  function(url, options){ return '<li' + ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                     '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
                },
  
  equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
  }
  }
  } 
));

app.set('view engine', '.hbs');

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    f.getAllStudents().then((data) => {
        res.render("students",{student: data });

    }).catch((err) => {
        res.render("students",{message: "no results" });
    });
   
});

app.get("/course/:id", (req, res) => {
    f.getStudentsByCourse(req.params.id).then((data) => {
        res.render("course",{course: data });
    }).catch((err) => {
        res.render("course",{message: "no results" });
    });
});

app.get("/courses", (req, res) => {
    f.getCourses().then((data) => {
        res.render("courses",{course: data });
    }).catch((err) => {
        res.render("courses",{message: "no results" });
    });
});

app.get("/student/:value", (req, res) => {
    f.getStudentByNum(req.params.value).then((data) => {
        res.render("student",{student: data });
    }).catch((err) => {
        res.render("student",{message: "no results"});
    });
});

app.get("/course/:id", (req, res) => {
    f.getCourseById(req.params.id).then((data) => {
        res.render("course",{course: data });
    }).catch((err) => {
        res.render("course",{message: "no results"});
    });
});

app.get('/students/course=:value',(req,res)=>{
    f.getStudentsByCourse(req.params.value).then((data)=>{
    res.render('students',{student: data })   
   })
   
     .catch((error)=>res.send({message:"no results"}))
 })

app.get("/", (req, res) => {
    res.render("home");
  });
  
app.get("/about", (req, res) => {
    res.render("about");
  });
  
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
  });
  
app.get("/students/add", (req, res) => {
    res.render("addStudent");
  });

app.post("/students/add", (req, res) => {
    f.addStudent(req.body).then(() => {
        res.redirect('/students');
      })
      .catch((err) => {
        res.send({ message: "no results" });
      });
  });

app.post("/student/update", (req, res) => {
    f.updatestudent(req.body).then(() => {
        res.redirect("/students");
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

// setup http server to listen on HTTP_PORT

f.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port: " + HTTP_PORT)
    });
}).catch((err) => {
    console.log(err);
});






/*
const f = require('./modules/collegeData.js')

f.initialize().then((data) => {
    f.getCourseById(1).then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    })
});
*/