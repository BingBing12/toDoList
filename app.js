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

const item1 = new Item({
    name: "Welcome to your personal To-Do-List"
})
const item2 = new Item({
    name: "Press + to add new item"
})
const item3 = new Item({
    name: "<--- press to delete"
})

app.get("/", function(req, res){
    var today = date.getDate();
    
    
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        }else{
            if(items.length === 0){
                Item.insertMany([item1, item2, item3])
            }
        }
        res.render('list', {listType: today, newItem: items, collection: "Item"})
    })
})


app.get("/work", function(req, res){
    Job.find({}, function(err, items){
        if(err){
            console.log(err);
        }else{
            console.log("search successful");
        }
        res.render('list', {listType: "Work", newItem: items, collection: "Job"})
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

app.post("/delete", function(req, res){
    var data = req.body.delete.split("+")
    if(data[1]=="Job"){
        Job.deleteOne({_id: data[0]}, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/work")
            }
        })
    }else{
        Item.deleteOne({_id: data[0]}, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/")
            }
        })
    }
    
})

app.listen(3000, function(){
    console.log("server started on port 3000");
})