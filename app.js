const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/todoItemsDB')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Item = mongoose.model("Item", itemsSchema);
const Job = mongoose.model("Job", itemsSchema);
app.set('view engine', 'ejs')

app.get("/", function(req, res){
    var today = date.getDate();
    
    
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        }else{
            console.log("search successful");
        }
        res.render('list', {listType: today, newItem: items})
    })
   
    
})


app.get("/work", function(req, res){
    Job.find({}, function(err, items){
        if(err){
            console.log(err);
        }else{
            console.log("search successful");
        }
        res.render('list', {listType: "Work", newItem: items})
    })
    
})

app.post("/", function(req, res){
    if(req.body.type === "Work"){
        var newJob = new Job({
            name: req.body.listItem
        })
        newJob.save();
        res.redirect("/work")
    }else{
        var newItem = new Item({
            name: req.body.listItem
        })
        newItem.save();
        
        res.redirect("/");
    }
    
})



app.listen(3000, function(){
    console.log("server started on port 3000");
})