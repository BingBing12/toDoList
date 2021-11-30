const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))



var doList = [];
var workList = [];

app.set('view engine', 'ejs')

app.get("/", function(req, res){
    var today = date.getDate();
    res.render('list', {listType: today, newItem: doList})
})


app.get("/work", function(req, res){
    res.render('list', {listType: "Work", newItem: workList})
})

app.post("/", function(req, res){
    if(req.body.type === "Work"){
        workList.push(req.body.listItem)
        res.redirect("/work")
    }else{
        doList.push(req.body.listItem)
        res.redirect("/");
    }
    
})



app.listen(3000, function(){
    console.log("server started on port 3000");
})