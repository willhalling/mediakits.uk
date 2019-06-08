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
    },
    renderMediaImage() {
      const image = {
        url: './media/photography.jpg'
      }
      this.drawHeaderImage(image).then(imageObject => {
        imageObject.background.set('id', 'background')

        let imageHeight = imageObject.height
        let imageWidth = imageObject.width

        console.log('imageWidth, imageHeight', imageWidth, imageHeight)
        console.log('this.image.width', this.image.width)

        let imageGroupWidth = this.image.width
        let imageGroupClipWidth = this.image.width
        let imageGroupHeight = this.minGridSize
        let imageClipHeight = 1400
        let imageGroupLeft = imageObject.left

        let imageGroup = new fabric.Group([imageObject.background], {
          id: imageObject.id,
          width: this.minGridSize,
          // height: 0,
          left: imageGroupLeft,
          top: 0,
          originX: 'left',
          originY: 'top',
          selectable: true,
          objectCaching: false
        })

        imageGroup.scaleToWidth(imageGroupWidth)

        imageGroup.clipTo = ctx => {
          const offsetPadding = 0

          // mobile fix: https://stackoverflow.com/a/42155047
          // disabling as distorting image on mobile
          //const retina = this.canvas.getRetinaScaling()
          ctx.save()
          ctx.beginPath()
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          //ctx.setTransform(retina, 0, 0, retina, 0, 0)
          ctx.rect(
            imageObject.left / 2,
            imageObject.top,
            imageGroupClipWidth - offsetPadding,
            imageClipHeight - offsetPadding
          )
          ctx.closePath()
          ctx.restore()
        }

        // const fontPromises = []
        this.canvas.add(imageGroup)
        this.renderTemplateDefaultHeader()
        this.renderTemplateDefaultSocialBackground()

        const social_networks = ['facebook', 'twitter', 'youtube']
        const socialPromises = []
        let socialMediaGroup = new fabric.Group()
        let networkNameWidth = 0
        social_networks.forEach((networkName, index) => {
          socialPromises.push(
            Promise.resolve(
              this.renderTemplateDefaultSocial(networkName, 550 * index).then(
                social => {
                  networkNameWidth += social.width
                  console.log('networkNameWidth', networkNameWidth)
                  socialMediaGroup.addWithUpdate(social)
                }
              )
            )
          )
        })

        Promise.all(socialPromises).then(() => {
          let socialMediaGroupTop = 1320
          switch (social_networks.length) {
            case 4:
              socialMediaGroupTop = 1310
              break
            case 5:
              socialMediaGroupTop = 1330
              break
            default:
              socialMediaGroupTop = 1320
          }
          socialMediaGroup.set('left', 100)
          socialMediaGroup.set('top', socialMediaGroupTop)
          if (social_networks.length < 4) {
            // offset used to center social items
            const offset = this.image.width - socialMediaGroup.width
            socialMediaGroup.set('left', offset / 2)
          }
          if (social_networks.length > 3) {
            socialMediaGroup.scaleToWidth(this.image.width - 200)
          }
          socialMediaGroup.set('selectable', false)
          this.canvas.add(socialMediaGroup)
        })
        this.renderTemplateDefaultMyVisitors()
        this.renderTemplateDefaultMyStats()
        this.renderTemplateDefaultFooter()
        this.renderTemplateDefaultAbout()
        this.renderTemplateDefaultTheBlog()

        this.$store.commit('global/updateLoading', false)
      })
    },
    drawHeaderImage(image) {
      // this.savedBackgroundImage = image.url || ''

      return new Promise(resolve => {
        fabric.Image.fromURL(image.url, background => {
          let topPosition = 0
          let leftPosition = 0

          background.set({
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
            width: this.image.width,
            height: this.image.height,
            top: topPosition,
            left: leftPosition
          }

          resolve(imageObject)
        })
      })
    }
  }
}
