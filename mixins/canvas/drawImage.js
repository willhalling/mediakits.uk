export const drawImageMixin = {
  methods: {
    drawImageGrid(image, index) {
      this.savedBackgroundImage = image.url || ''

      return new Promise(resolve => {
        if (!this.image.url) {
          resolve()
        }
        fabric.Image.fromURL(image.url, background => {
          let topPosition
          let leftPosition

          if (index === 0) {
            leftPosition = 0
            topPosition = 0
          }

          if (index === 1) {
            leftPosition = this.minGridSize
            // if x2 images display 2nd image in bottom right corner
            topPosition = 0
          }

          if (index === 2) {
            // if x3 images display 3rd image in bottom middle
            leftPosition = this.onlyThreeImages ? this.minGridSize : 0
            topPosition = this.minGridSize / 2
          }

          if (index === 3) {
            leftPosition = this.minGridSize
            topPosition = this.minGridSize / 2
          }

          // Start 3rd row (5th image)
          if (index === 4) {
            leftPosition = this.onlyFiveImages ? this.minGridSize / 2 : 0
            topPosition = this.minGridSize
          }

          if (index === 5) {
            leftPosition = this.minGridSize
            topPosition = this.minGridSize
          }

          background.set({
            top: 0,
            left: 0,
            originX: 'center',
            originY: 'center',
            angle: this.imageRotate(image)
          })

          // If image is landscape we need to scale height by maxCanvasWidth/size
          if (image.width > image.height) {
            background.scaleToHeight(this.maxCanvasWidth)
          } else {
            // else portrait, we scale width by maxCanvasWidth/size
            background.scaleToWidth(this.maxCanvasWidth)
          }

          const imageObject = {
            id: image.id,
            background,
            width: this.minGridSize / 2,
            height: this.minGridSize / 2,
            top: topPosition,
            left: leftPosition
          }

          resolve(imageObject)
        })
      })
    },
    drawImageSingle(image, index) {
      const collageSpacing = 1
      this.savedBackgroundImage = image.url || ''
      let width = image.width
      let height = image.height

      console.log('this.images.length', this.images.length)

      // If more that one image let's halve the width * height
      if (this.images.length > 1) {
        width = width / 2 - collageSpacing
        height = height / 2 - collageSpacing
      }

      return new Promise(resolve => {
        if (!this.image.url) {
          resolve()
        }
        fabric.Image.fromURL(image.url, background => {
          let scaleX = width / background.width
          let scaleY = height / background.height
          // If image is portrait we need to switch the width & height values
          if (image.orientation.rotate === 90) {
            scaleX = width / background.height
            scaleY = height / background.width
          } else {
            scaleX = width / background.width
            scaleY = height / background.height
          }
          let topPosition = height / 2
          let leftPosition = width / 2

          if (index === 1) {
            leftPosition = this.images[0].width - width / 2
          }
          if (index === 2) {
            topPosition = this.images[0].height - height / 2
          }
          if (index === 3) {
            leftPosition = this.images[0].width - width / 2
            topPosition = this.images[0].height - height / 2
          }

          console.log('index', index)
          background.set({
            scaleX: scaleX,
            scaleY: scaleY,
            top: 0,
            left: 0,
            originX: 'center',
            originY: 'center',
            angle: this.imageRotate(image),
            selectable: false
          })

          // this.drawDateObject(width, height)

          // this.canvas.add(background);
          const imageObject = {
            background,
            width,
            height,
            top: topPosition,
            left: leftPosition
          }
          resolve(imageObject)
        })
      })
    }
  }
}
