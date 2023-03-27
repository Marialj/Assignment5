var fs = require('fs');

class Data {
    constructor(students,courses){
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

function initialize() {

    return new Promise( (resolve, reject) => {
        fs.readFile('./data/students.json','utf8', (err, studentFile) => {
            if (err) {
                reject("unable to read student file"); return;
            }

            fs.readFile('./data/courses.json','utf8', (err, courseFile) => {
                if (err) {
                    reject("unable to read course file"); return;
                }
                dataCollection = new Data(JSON.parse(studentFile), JSON.parse(courseFile));
                resolve()
            });
        });
    });
}


function getAllStudents() {

    return new Promise((resolve,reject) => {

        var studentData = dataCollection.students

        if(studentData.length == 0){
            reject('no results returned')
        }
        else {
            resolve(studentData)
        }
                
    })

}

function getCourses() {

    return new Promise((resolve,reject) =>{
        var courseData = dataCollection.courses

        if (courseData.length == 0){
            reject('no results returned')
        }
        else {
            resolve(courseData)
        }

    })

}

function getStudentsByCourse(course) {

    return new Promise((resolve,reject) =>{

        var stuList = []
        var studentData = dataCollection.students

        for(let i =0; i < studentData.length; i++ ){
            if(studentData[i].course == course){
                stuList.push(studentData[i])
            }

        }
        
        if (stuList.length == 0){
            reject('no results returned')
        }
        else {
            resolve(stuList)
        }

    })
}

function getStudentByNum(num) {

    return new Promise((resolve,reject) =>{

        var stu = null
        var studentData = dataCollection.students

        for(let i =0; i < studentData.length; i++ ){
            if(studentData[i].studentNum == num){
                stu = studentData[i]   
            }

        }
         
        if (stu == null){
            reject('no results returned')
        }
        else {
            resolve(stu)
        }

    })
}

function addStudent(studentData){
    return new Promise((resolve,reject) =>{
        var studentDataFile = dataCollection.students;
        let newStudent;
        if (studentData.TA) {
            newStudent={
            ...studentData,
            TA: true,
            studentNum: studentDataFile.length + 1,
        };
    }else{
        newStudent={
            ...studentData,
            TA: false,
            studentNum: studentDataFile.length + 1,
    };
}
dataCollection.students.push(newStudent);

if (studentDataFile.length != 0){
    resolve(newStudent);

}else{
    reject("no results returned");
}

    });
}

function getCourseById(id){
    return new Promise((resolve,reject) =>{
        var courseList = dataCollection.courses
        course = null
        for(let i=0;i < courseList.length;i++)
        {
            if(courseList[i].courseId == id)
            {
                course = courseList[i];
            }
        }
        if(course.length == 0){
            reject("no result");
        }
        else{
            resolve(course);
        }
     });
  }
  
function updatestudent(studentData){
    return new Promise((resolve, reject) =>{
        var studentsDataFromFile = dataCollection.students;
        var newStudentsData = studentsDataFromFile.map((sdata) => {
          if (sdata.studentNum == studentData.studentNum) {
            return studentData;
          } else {
            return sdata;
          }
        });
        dataCollection.students = newStudentsData;
        resolve();
    });
  };

module.exports = {initialize,getAllStudents,getCourses,getStudentsByCourse,getStudentByNum,addStudent,getCourseById,updatestudent}