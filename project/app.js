const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todo.db');

// app.use(express.static(''));
app.use(express.static(__dirname + '/static_files'));
app.use(bodyParser.urlencoded({extended: true})); //connect to the app

//localhost:3000
app.listen(3000, ()=>{
  console.log("server started at localhost:3000");
});


//fetch data from tthe db 0 is false, 1 is true
app.get('/todoItems', (req, res)=>{
	db.all("SELECT * from toDoList WHERE completed = 0", (err, row)=>{
		if(err){
			console.error(err.message);
		}
		else{
			// console.log(row);
			res.send(row);
		}
	})
})

//add new a item to the list
app.post('/addItem', (req,res)=>{
	db.all("INSERT into toDoList(todoItem, completed) values($todoItem, $completed)",
	{
		$todoItem: req.body.todoItem,
		$completed: 0
	},
	(err,row)=>
	{
		if(err){
			// console.log(err.message);
			res.send({});
		}
		else{
			res.send(row[0]);
		}
	});
});

//update completed column when delete button is clicked
app.post('/deleteItem', (req, res)=>{
	console.log(req.body);

	db.all("UPDATE toDoList SET completed = $completed where todo_id = $key_id",{
		$completed:req.body.completed,
		$key_id: req.body.key_id
	},
	(err, row)=>{
		if(err){
			console.log(err.message);
			res.send({});
		} else{
			res.send(row[0]);
		}
	});
});


//search call for the db 
// get to do items matching search key
app.get('/search/:searchKey',(req,res) => {
  const key = '%' + req.params.searchKey + '%';
  console.log(req.params.searchKey);
  db.all("SELECT * FROM toDoList WHERE todoItem LIKE $key", {
  	$key: key
  }, (err,row)=>{
    if(err){
      console.error(err.message);
    } else{
      // console.log("SEARCH: ");
      // console.log(row);
      res.send(row);
    }
  });
});