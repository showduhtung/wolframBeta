// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision').v1p3beta1
const fs = require('fs')
const router = require('express').Router()
const Image = require('../db/models/image')
const {textRecognition} = require('./mathFunctions')

module.exports = router

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'Wolfram-Beta.json'
})

// console.log('client', client)
const rawData = fs.readFileSync('./moreMath.jpg')

// console.log('fs.readFileSync', rawData)

router.post('/', (req, res, next) => {
  try {
    const request = {
      image: {
        content: req.body.data
      },
      feature: {
        languageHints: ['en-t-i0-handwrit']
      }
    }
    client
      .documentTextDetection(request)
      .then(results => {
        const fullTextAnnotation = results[0].fullTextAnnotation
        console.log(`Full text: ${fullTextAnnotation.text}`)
        Image.create({
          data: fullTextAnnotation.text
        })
        res.send(fullTextAnnotation.text)
        textRecognition(fullTextAnnotation.text)
      })
      .catch(err => {
        console.error('ERROR:', err)
      })

    res.status(201)
  } catch (err) {
    console.error(err)
  }
})
