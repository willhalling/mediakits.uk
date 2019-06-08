export const drawImageMixin = {
  methods: {
    renderTemplate() {
      return new Promise(resolve => {
        const image = {
          url: this.images[0] ? this.images[0].url : './media/photography.jpg'
        }
        this.renderTemplateDefaultImage(image).then(imageObject => {
          imageObject.background.set('id', 'background')

          let imageGroupWidth = this.theme.width
          let imageGroupClipWidth = this.theme.width
          //let imageGroupHeight = this.minGridSize
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
          //this.renderTemplateDefaultTagline()
          this.renderTemplateDefaultSocialBackground()

          const social_networks = ['facebook', 'twitter', 'youtube', 'pinterest', 'instagram']
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
              const offset = this.theme.width - socialMediaGroup.width
              socialMediaGroup.set('left', offset / 2)
            }
            if (social_networks.length > 3) {
              socialMediaGroup.scaleToWidth(this.theme.width - 200)
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

          resolve()
        })
      })
    },
    renderTemplateDefaultImage(image) {
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

          const maxImageWidth = 1080
          // If image is landscape we need to scale height by maxCanvasWidth/size
          if (image.width > image.height) {
            background.scaleToHeight(maxImageWidth)
          } else {
            // else portrait, we scale width by maxCanvasWidth/size
            background.scaleToWidth(maxImageWidth)
          }

          const imageObject = {
            id: image.id,
            background,
            width: this.theme.width,
            height: this.theme.height,
            top: topPosition,
            left: leftPosition
          }

          resolve(imageObject)
        })
      })
    }
  }
}
