const express = require('express');
const router = express.Router();

const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

//MONGODB
const mongojs = require('mongojs');
//mongodb://<dbuser>:<dbpassword>@ds157500.mlab.com:57500/eventify  //colecciones
const db = mongojs('mongodb://ennaxor:r2904994@ds157500.mlab.com:57500/eventify', ['events']);

//FACEBOOK
const eventFacebook = require('facebook-events-by-location-core'); 
//const localstorage = require('localStorage');


var myevents = new eventFacebook({
    "lat": 40.710803,
    "lng": -73.964040
});

/*router.get('/logged', function (req, res) {
   var data = req.params.data; // it contains the value foo
})*/

/*myevents.search().then(function (events){
    console.log(JSON.stringify(events));
}).catch(function (error){
    console.error(JSON.stringify(error));
});*/

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});


router.get('/login', function(req, res) {
  if (!req.body.aux) {
    return res.status(400).send("You must send the ID");
  }  
  res.status(201).send(req.body.aux);
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

//get all events FROM MONGODB
router.get('/events', (req, res) => {
    db.events.find(function(err, docs){
        if(err){
          res.status(500).send(err);
        }
        res.status(200).json(docs);
    });

});

//get single event
router.get('/event/:id', (req, res) => {
    db.events.findOne({ id: mongojs.ObjectId(req.params.id)}, function(err, doc){
        if(err){
          res.status(500).send(err);
        }
        res.status(200).json(doc);
    });
});



module.exports = router;