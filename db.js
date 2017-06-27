const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/ajax-demo');

const Owner = db.define('owner', {
  name: Sequelize.STRING,
});

const Pet = db.define('pet', {
  name: Sequelize.STRING,
});

Owner.hasMany(Pet);

module.exports = { db, Owner, Pet };
