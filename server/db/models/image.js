const Sequelize = require('sequelize')
const db = require('../db')

const Image = db.define('image', {
  data: {
    type: Sequelize.TEXT
  }
})

module.exports = Image
