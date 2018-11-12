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
        const mathAnswer = textRecognition(fullTextAnnotation.text)
        res.send(mathAnswer)
        Image.create({
          data: fullTextAnnotation.text,
          answer: mathAnswer.toString()
        })
      })
      .catch(err => {
        console.error('ERROR:', err)
      })
    res.status(201)
  } catch (err) {
    console.error(err)
  }
})
