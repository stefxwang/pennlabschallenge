const express = require('express');
const router = new express.Router();
const club_list = require('./club_list.json');
const bodyParser = require('body-parser');
const fs = require('fs');
const Cryptr = require('cryptr');

const cryptr = new Cryptr('SECRET_KEY');

router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.send('Welcome to the PennClubReview API!');
});
  
router.post('/', (req, res) => {
  res.send('The request body is: ' + req.body);
});

router.post('/user/addUser', (req, res) => {
	let user = {
		username: req.body.username,
		userInfo: {
			firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: cryptr.encrypt(req.body.password)
		}
	};

	fs.readFile('./users.json', function callback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var obj = JSON.parse(data);
			obj.users.push(user);
			var json = JSON.stringify(obj, null, 1);
			fs.writeFileSync('./users.json', json, callback);
			res.send('Successfully created new user: ' + req.body.username + "\n.");
		}
	});
});

router.post('/user/:id/clubRankings', (req, res) => {
	var userId = req.params.id;
	var data = req.body;

	fs.writeFileSync("club_rankings_" + userId, JSON.stringify(data, null, 1));
	res.send("Successfully set " + userId + "'s club rankings.\n");
});

router.get('/clubs', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(club_list, null, 1));
});

router.post('/clubs', (req, res) => {
	let club = {
		name: req.body.name,
		size: req.body.size
	};
	fs.readFile('./club_list.json', function callback(err, data){
		if (err) {
			console.log(err);
		} else {
			var obj = JSON.parse(data);
			obj.push(club);
			var json = JSON.stringify(obj, null, 1);
			fs.writeFileSync('./club_list.json', json, callback);
			res.send('Successfully created new club called ' + req.body.name + ' of size ' + req.body.size + ".\n");
		}
	});
});

//TODO: implement
router.post('/rankings', (req, res) => {
	res.send('Will change ranking of club');
});

router.get('/rankings/:id', (req, res) => {
	var fileName = './club_rankings_' + req.params.id;
	fs.readFile('./club_rankings_' + req.params.id, function callback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var obj = JSON.parse(data);
			res.send(JSON.stringify(obj, null, 2));
		}
	});
});

router.get('/user/:id', (req, res) => {
	var userId = req.params.id;
	var result = {
		username: "",
		name: "",
	};
	fs.readFile('./users.json', function callback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var obj = JSON.parse(data);
			obj.users.map(function(user) {
				if (user.username == userId) {
					result.username = userId;
					result.name = user.userInfo.firstName + " " + user.userInfo.lastName;
					res.send(JSON.stringify(result, null, 2));
				}
			});
		}
	});
});


module.exports = router;