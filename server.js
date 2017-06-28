const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const { db, Owner, Pet } = require('./db.js');

// logging and parsing middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.get('/client.js', (req, res) => {
  res.sendFile(path.join(__dirname, './client.js'));
});

// home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

// API ROUTES
app.param('ownerid', (req, res, next, ownerid) => {
  Owner.findById(ownerid)
    .then((owner) => {
      if (!owner) return next(new Error('not found'));
      req.owner = owner;
      next();
    })
    .catch(next);
});

app.get('/owners', (req, res, next) => {
  Owner.findAll()
    .then(owners => res.send(owners))
    .catch(next);
});

app.get('/owners/:ownerid/pets', (req, res, next) => {
  req.owner.getPets()
    .then(pets => res.send(pets))
    .catch(next);
});

app.post('/owners/:ownerid/pets', (req, res, next) => {
  Pet.create({ name: req.body.name })
    .then(pet => Promise.all([req.owner.addPet(pet), pet]))
    .then(([owner, pet]) => {
      res.status(201).send(pet);
    })
    .catch(next);
});

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

db.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('port 3000');
    });
  });
