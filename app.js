const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistdb", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
	name: String
};

const Item = mongoose.model('Items', itemSchema);

const item1 = new Item({
	name: "Welcome to your todo list."
});

const item2 = new Item({
	name: "Ht the + button to add a new item."
});

const item3 = new Item({
	name: "<--- Hit the check box to delete an item."
});

let defaultItems = [item1, item2, item3];

const listSchema = {
	name: String,
	items: [itemSchema]
}

const List = mongoose.model("list", listSchema);

app.get('/', (req, res) => {
	Item.find({}, (err, foundItems) => {

		if(foundItems.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if(err) {
					console.log(err);
				} else {
					console.log("Success! Default items saved to the database.");
				}
			});
			res.redirect('/');
		}
		else {
			if(err) {
				console.log(err);
			} else {
				res.render("list", {listTitle: "Today", newListItems: foundItems});
			}
		}
	});
});

app.get('/:customListName', (req, res) => {
	const customListName = req.params.customListName;
		List.findOne({name: customListName}, (err, foundList) => {
		if(!err) {
			if(!foundList) {
				const list = new List({
					name: customListName,
					items: defaultItems
				});
			
				list.save();
				res.redirect('/' + customListName);
			} else {
				res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
			}			
		}
		else {			
			console.log(err);
		}
	});
});

app.post('/', (req, res) => {	
	console.log(req.body);	
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName
	});

	if(listName === "Today")
	{
		//Mongoo shortcut
		item.save();
		res.redirect('/');
	} else {
		List.findOne({name: listName}, (err, foundList) =>{
			foundList.items.push(item);
			foundList.save();
			res.redirect('/' + listName);
		});		
	}
});

app.post('/delete', (req, res) => {
	const checkedItemId = req.body.checkbox;

	Item.findByIdAndRemove(checkedItemId, (err) => {
		if(err) {
			console.log(err);
		} else {
			console.log("Sucessfully deleted item.");
		}
	});

	res.redirect('/');
})

app.get('/work', (req, res) => {
	res.render("list", {listTitle: "Work", newListItems: workItmes});
});

app.get('/about', (req, res) => {
	res.render("about");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});