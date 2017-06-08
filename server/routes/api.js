const express = require('express');
const router = express.Router();

const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

//MONGODB
const mongojs = require('mongojs');

//mongodb://<dbuser>:<dbpassword>@ds157500.mlab.com:57500/eventify  //colecciones
const db = mongojs('mongodb://ennaxor:r2904994@ds157500.mlab.com:57500/eventify', ['events']);

/* GET API */
router.get('/', (req, res) => {
  res.send('api works');
});

/* EJEMPLO SACANDO DATOS DE UNA API COMO AXIOS */
router.get('/posts', (req, res) => { 
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

/* EJEMPLO SACANDO DATOS DE MONGOFB */
// Lista de eventos
router.get('/events', (req, res) => {
    db.events.find(function(err, docs){
        if(err){
          res.status(500).send(err);
        }
        res.status(200).json(docs);
    });

});

// Evento en concreto según una ID
router.get('/event/:id', (req, res) => {
    db.events.findOne({ id: mongojs.ObjectId(req.params.id)}, function(err, doc){
        if(err){
          res.status(500).send(err);
        }
        res.status(200).json(doc);
    });
});

module.exports = router;