
var express = require('express');

var app = express();

var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restful_task');
// Model
var Schema = mongoose.Schema;
var TaskSchema = new mongoose.Schema({
  title: String,
  description: "",
  completed: false,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }

});
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// Routes
app.get('/tasks', function(req, res) {  

  Task.find({}, function(err, tasks) {
  if(err){
    console.log("No tasks to display. Please create a new task.");
  }
  else {
    res.json({allTasks: tasks});
  }
  })    
}); 

app.post('/tasks', function(req, res) {  
  console.log("@@@@ body", req.body);
  var newTask = new Task({title: req.body.title, description: req.body.description, completed: req.body.completed});
  console.log("@@@@ newTask", newTask);
    newTask.save(function(err, task) {
      if(err) {
          console.log('Error: task not added');
      } 
      else {
          console.log('New task has been added');
          console.log("@@@@ newTask after save", task);
        res.redirect('/');
      }
    })   
}); 

app.get('/tasks/:id', function(req, res) {  

  Task.find({_id: req.params.id}, function(err, task) {
  if(err){
    console.log("Cannot find this task. Please re-enter the title.");
  }
  else {
    console.log("Task found")
    res.json({task: task});
  }
  })    
});

app.put('/tasks/:id', function(req, res) {  
  Task.update({_id: req.params.id}, {title: req.body.name, description: req.body.description, completed: req.body.completed}, function(err){
      if(err){
        console.log("Task not found. Please re-enter the title.");
      }
      else {
        console.log("Task successfully updated")
        res.redirect('/');
      }     
    })
})

app.delete('/tasks/:id', function(req, res) {  
  Task.remove({_id: req.params.id}, function(err){
      if(err){
        console.log("Task not found. Please re-enter the title.");
      }
      else {
        console.log("Task deleted")
        res.redirect('/');
      }     
    })
})



app.listen(5000, function() {
    console.log("listening on port 5000");
})

