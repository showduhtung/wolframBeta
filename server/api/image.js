// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision').v1p3beta1
const fs = require('fs')
const express = require('express')
const router = express().router

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'Wolfram-Beta.json'
})
console.log('client', client)
const rawData = fs.readFileSync('./moreMath.jpg')

console.log('fs.readFileSync', rawData)
const request = {
  image: {
    content: rawData
  },
  feature: {
    languageHints: ['en-t-i0-handwrit']
  }
}

router.get('/', req, res, next => {
  client
    .documentTextDetection(request)
    .then(results => {
      const fullTextAnnotation = results[0].fullTextAnnotation
      console.log(`Full text: ${fullTextAnnotation.text}`)
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
})

// app.get('/recognize', function(req, res) {
//   console.log('Recognize')
//   //var data = "test";
//   data1 = ''
//   console.log(data1 + '\n')

//   // Instantiates a client
//   const vision = Vision()
//   // The path to the local image file, e.g. "/path/to/image.png"
//   const fileName = __dirname + '/2.jpg'
//   console.log(filename)

//   // Performs label detection on the local file
//   vision
//     .labelDetection({source: {filename: fileName}})
//     .then(results => {
//       const labels = results[0].labelAnnotations
//       console.log('Labels:')
//       labels.forEach(
//         label => (data1 += JSON.stringify(label.description) + '\n')
//       )
//       //console.log(data);
//     })
//     .catch(err => {
//       console.error('ERROR:', err)
//     })
// })
