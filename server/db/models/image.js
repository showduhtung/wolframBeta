const Sequelize = require('sequelize')
const db = require('../db')

const Image = db.define('image', {
  fileName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
})
