import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
// import ReactCrop from 'react-image-crop'
// import './custom-image-crop.css'
import {
  base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64
} from '../utils/imageConverter'
import axios from 'axios'
import {SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION} from 'constants'
import {number} from 'prop-types'

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim()
})

class ImgDropAndDL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSrc: null,
      imgSrcExt: null,
      total: 'Drop An Image'
    }
    this.handleCalculateClick = this.handleCalculateClick.bind(this)
    this.handleClearToDefault = this.handleClearToDefault.bind(this)
  }

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0]
      const currentFileType = currentFile.type
      const currentFileSize = currentFile.size
      if (currentFileSize > imageMaxSize) {
        alert(
          'This file is not allowed. ' + currentFileSize + ' bytes is too large'
        )
        return false
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert('This file is not allowed. Only images are allowed.')
        return false
      }
      return true
    }
  }

  handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles)
    }
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files)
      if (isVerified) {
        //if the files are fine run code
        // imageBase64Data
        const currentFile = files[0]
        const myFileItemReader = new FileReader()
        myFileItemReader.addEventListener(
          'load',
          () => {
            // console.log('setting state,', myFileItemReader.result)
            const myResult = myFileItemReader.result
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult),
              total: 'Drop An Image'
            })
          },
          false
        )

        myFileItemReader.readAsDataURL(currentFile)
      }
    }
  }

  async handleCalculateClick(event) {
    event.preventDefault()
    const {imgSrc} = this.state
    const {imgSrcExt} = this.state

    if (imgSrc) {
      // const numberToSliceOff = 19 + imgSrcExt.length

      const {data} = await axios.post('/api/image', {
        data: imgSrc.slice(23)
      })
      console.log('did i get here???', data.entries[0])
      this.setState({
        imgSrc: imgSrc,
        imgSrcExt: imgSrcExt,
        total: data.entries[0]
      })
    }
  }

  handleClearToDefault(event) {
    if (event) event.preventDefault()
    this.setState({
      imgSrc: null,
      imgSrcExt: null,
      total: 'Drop An Image'
    })
  }

  render() {
    const {imgSrc} = this.state

    return (
      <div>
        <h1>Wolfram Beta</h1>
        <hr />

        <button onClick={this.handleCalculateClick}>Calculate!</button>
        <button onClick={this.handleClearToDefault}>Clear</button>
        <div>
          {imgSrc !== null ? (
            <img src={imgSrc} />
          ) : (
            <Dropzone
              onDrop={this.handleOnDrop}
              accept={acceptedFileTypes}
              multiple={false}
              maxSize={imageMaxSize}
            >
              Drop image here
            </Dropzone>
          )}
          <div>The Answer is : {this.state.total}</div>
        </div>
      </div>
    )
  }
}

export default ImgDropAndDL
