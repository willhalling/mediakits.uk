<template>
  <div
    v-click-outside="discardActiveObject"
    :id="canvasId"
    :style="styles"
    :class="{ 'canvasContainer__wrap--slider' : slider }"
    class="canvasContainer__wrap"
  >
    <slot name="canvasNavTop"/>
    <canvas
      :id="`canvas__${canvasId}`"
      :width="imageWidth"
      :height="imageHeight"
      class=""
    />
    <slot name="canvasNavBottom"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { fabric } from 'fabric'

if (process.browser) {
  require('fabric-customise-controls')
}

import { customControls } from '~/mixins/canvas/customControls'
import { drawText } from '~/mixins/canvas/drawText'
import { ageMixin } from '~/mixins/ageMixin'
import { drawImageMixin } from '~/mixins/canvas/drawImage'
import { addDisableBodyScroll, removeDisableBodyScroll } from '~/utils/scroll'

import { FONTS } from '../../constants/fonts'
import { DATE_FORMATS } from '../../constants/dates'

import { setImageRatio } from '../../utils/image'

import { getPosition, setPosition } from '../../utils/position'
// import { formattedDate } from '../../utils/date'

const dateFormat = require('dateformat')

// Local constants
const CANVAS_PADDING = 40
const CANVAS_BACKGROUND_COLOUR = '#EDEDED'
const CANVAS_FILL_COLOUR = '#F3D549'
const CANVAS_CONTROLS_VISIBILITY = {
  mt: true,
  mb: true,
  ml: true,
  mr: true,
  tr: true,
  tl: true,
  br: true,
  bl: false,
  mtr: false
}

export default {
  name: 'CanvasContainer',

  mixins: [customControls, ageMixin, drawText, drawImageMixin],

  props: {
    canvasId: {
      type: String,
      default: 'canvasContainer'
    },
    canvasData: {
      type: Object,
      required: true
    },
    image: {
      type: Object,
      required: true
    },
    images: {
      type: Array,
      required: false
    },
    websiteData: {
      type: Object,
      required: false
    },
    theme: {
      type: Object,
      required: true
    },
    clearObjects: {
      type: Boolean,
      default: false
    },
    slider: {
      type: Boolean,
      default: false
    },
    isThumb: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canvas: null,
      maxWidth: null,
      CONTROL_ICON_SIZE: 128,
      CONTROL_ROTATE_OFFSET: 150,
      savedBackgroundImage: '',
      target: '',
      maxCanvasWidth: 1080
      //maxCanvasHeight: 1080,
    }
  },
  computed: {
    ...mapGetters({
      age: 'user/age',
      step: 'global/step',
      isTouchDevice: 'user/isTouchDevice'
    }),
    styles() {
      return {
        [`maxWidth`]: `${this.maxCanvasWidth}px`,
        [`maxHeight`]: `${this.maxCanvasHeight}px`
      }
    },
    fileName() {
      return `BabyByMonth.com Photo ${dateFormat()}`
    },
    onlyOneImage() {
      return this.images && this.images.length === 1
    },
    onlyTwoImages() {
      return this.images && this.images.length === 2
    },
    onlyThreeImages() {
      return this.images && this.images.length === 3
    },
    onlyFiveImages() {
      return this.images && this.images.length === 5
    },
    imageWidth() {
      if (this.isThumb) {
        return 1080
      }
      return this.image.width
    },
    imageHeight() {
      if (this.isThumb) {
        return 1080
      }
      return this.image.height
    },
    isGridLayout() {
      // Switch to grid layout when more than 1 image
      return this.images && this.images.length > 1
    },
    minGridSize() {
      //return Math.min(this.image.width, this.image.height)
      return 1080
    },
    maxCanvasHeight() {
      let height = this.minGridSize
      if (this.images && this.images.length > 4) {
        height = 1080 + 540
      }
      if (this.onlyOneImage) {
        console.log('maxCanvasHeight this.onlyOneImage', this.onlyOneImage)
        return 'none'
      }
      if (this.isGridLayout) {
        return height
      }
      return 'none'
    }
  },
  watch: {
    theme: {
      handler() {
        this.updateCanvas()
      }
    },
    // Triggered when user uploads new image
    image: {
      handler() {
        this.updateCanvas()
      },
      deep: true
    },
    images: {
      handler() {
        // Disabled otherwise there are multiple images
        // this.updateCanvas()
      },
      deep: true
    },
    // Triggered when colours etc change
    canvasData: {
      handler() {
        this.updateCanvas()
      },
      deep: true
    }
  },
  mounted() {
    this.initFabric()
    window.addEventListener('resize', this.resizeCanvas)
    this.renderCanvas()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas)
  },
  methods: {
    ...mapActions({
      nextStepAction: 'global/nextStepAction',
      deleteImage: 'user/deleteImageAction'
    }),
    disableScroll() {
      this.canvas.allowTouchScrolling = false
    },
    enableScroll() {
      this.canvas.allowTouchScrolling = true
    },
    initFabric() {
      fabric.Object.prototype.setControlsVisibility(CANVAS_CONTROLS_VISIBILITY)
      // @todo: hidden remove/tl for now. need to add back in
      // when find a fix for removing object
      this.canvas = new fabric.Canvas(`canvas__${this.canvasId}`, {
        allowTouchScrolling: true,
        preserveObjectStacking: true, // IMPORTANT for when using clipTo images
        enableRetinaScaling: false // IMPORTANT for when saving images on retina devices
      })
    },
    renderCanvas() {
      const fontPromises = []
      FONTS.forEach(font => {
        // 40pt is irrelevant here - just saying :-)
        fontPromises.push(
          Promise.resolve(document.fonts.load(`40pt "${font.value}"`))
        )
      })
      // Add local fonts here...
      fontPromises.push(
        Promise.resolve(document.fonts.load(`40pt "DigitalReadoutUpright"`))
      )
      fontPromises.push(
        Promise.resolve(document.fonts.load(`40pt "VivaBeautiful"`))
      )
      // We need to load all fonts before rendering the canvas
      Promise.all(fontPromises).then(() => {
        this.updateCanvas()
      })
    },
    imageRotate(image) {
      if (image) {
        return (image.orientation && image.orientation.rotate) || 0
      }
    },
    updateCanvas() {
      console.log('update canvas', this.images)
      //this.canvas.clear()
      this.canvas.backgroundColor = CANVAS_BACKGROUND_COLOUR
      this.resizeCanvas()

      //if (this.images && this.images.length === 0) {
      this.renderTemplate()
      //this.addCanvasObjects()
      //}

      /*
      if (this.isThumb) {
        // Delete all objects (needed to delete instructions when changing font)
        this.canvas.remove(...this.canvas.getObjects())
        return this.drawDateObject()
      } */

      this.canvas.off('mouse:down')

      if (this.images && this.images.length > 0) {
        //this.canvas.clear()
        this.canvas.backgroundColor = CANVAS_BACKGROUND_COLOUR
        const imagePromises = []

        // Sort by date
        this.images = this.images.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })

        this.images.forEach((image, index) => {
          const drawImageSwitch = this.isGridLayout
            ? 'drawImageGrid'
            : 'drawImageSingle'
          imagePromises.push(
            Promise.resolve(
              this[drawImageSwitch](image, index).then(imageObject => {
                imageObject.background.set('id', 'background')

                let imageHeight = imageObject.height
                let imageWidth = imageObject.width

                // Create date shape
                const theme = {
                  id: this.theme.id,
                  font: this.theme.date.font,
                  size: this.theme.date.size,
                  width: imageWidth,
                  height: imageHeight,
                  top: imageObject.top,
                  left: imageObject.left
                }

                let imageGroup = new fabric.Group([imageObject.background], {
                  id: imageObject.id,
                  isImage: true,
                  width: this.imageWidth,
                  height: this.imageHeight,
                  left: imageObject.left,
                  top: imageObject.top,
                  originX: 'center',
                  originY: 'center',
                  selectable: false
                })

                let imageGroupWidth = this.minGridSize / 2
                let imageGroupClipWidth = this.minGridSize / 2
                let imageGroupHeight = this.minGridSize / 2
                let imageGroupLeft = imageObject.left / 2

                // display images side by side, e.g. before/after style
                if (this.onlyTwoImages) {
                  imageGroupWidth = this.minGridSize
                  imageGroupHeight = this.minGridSize

                  // center left image
                  if (index === 0) {
                    // imageGroupClipWidth = imageGroupClipWidth
                    imageGroupLeft = -(this.imageWidth / 4)
                  }

                  // center right image
                  if (index === 1) {
                    imageGroupLeft = this.imageWidth / 4
                  }
                }

                // display one large (left) and two small on right hand side
                if (this.onlyThreeImages) {
                  imageGroupHeight = this.minGridSize

                  // center left image
                  if (index === 0) {
                    imageGroupWidth = this.minGridSize
                    imageGroupLeft = -(this.imageWidth / 4)
                  }

                  // center right image
                  if (index === 1) {
                    imageGroupWidth = this.minGridSize / 2
                  }
                }

                if (this.isGridLayout) {
                  imageGroup = new fabric.Group([imageObject.background], {
                    id: imageObject.id,
                    isImage: true,
                    width: this.minGridSize,
                    height: this.minGridSize,
                    left: imageGroupLeft,
                    top: imageObject.top,
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
                      imageGroupHeight - offsetPadding
                    )
                    ctx.closePath()
                    ctx.restore()
                  }
                }

                this.canvas.add(imageGroup)

                /*
                              const square = new fabric.Rect({

                                width: this.minGridSize / 2,
                                height: this.minGridSize / 2,
                                left: imageObject.left,
                                top: imageObject.top,
                                fill: 'red',
                                opacity: 0.5

                              });


                              this.canvas.add(square);

                               */

                // We don't need to add Age Shape if we don't have any data/photo exif date
                // Or if there is an image error, e.g user trying to upload photo that was
                // ...taken before baby's birthday
                if (!image.age || image.error) {
                  return
                }
                const ageObject = {
                  ...image.age,
                  number: image.age.number,
                  text: image.age.text
                }

                this.drawDateShape(theme, ageObject).then(shape => {
                  const ageShapeOffset = 20

                  const newIndex = index + 1

                  if (newIndex == 1) {
                    shape.set('left', ageShapeOffset)
                    shape.set(
                      'top',
                      this.onlyTwoImages || this.onlyThreeImages
                        ? imageHeight +
                          imageHeight -
                          shape.height -
                          ageShapeOffset
                        : imageHeight - shape.height - ageShapeOffset
                    )
                  }

                  if (newIndex == 2) {
                    shape.set(
                      'left',
                      imageWidth + imageWidth - shape.width - ageShapeOffset
                    )
                    // if x2 images display 2nd image in bottom right corner
                    shape.set(
                      'top',
                      this.onlyTwoImages
                        ? imageHeight +
                          imageHeight -
                          shape.height -
                          ageShapeOffset
                        : imageHeight - shape.height - ageShapeOffset
                    )
                  }

                  if (newIndex == 3) {
                    shape.set(
                      'left',
                      this.onlyThreeImages
                        ? imageWidth + imageWidth - shape.width - ageShapeOffset
                        : ageShapeOffset
                    )
                    shape.set(
                      'top',
                      imageHeight + imageHeight - shape.height - ageShapeOffset
                    )
                  }

                  if (newIndex == 4) {
                    shape.set(
                      'left',
                      imageWidth + imageWidth - shape.width - ageShapeOffset
                    )
                    shape.set(
                      'top',
                      imageHeight + imageHeight - shape.height - ageShapeOffset
                    )
                  }

                  if (newIndex == 5) {
                    shape.set(
                      'left',
                      this.onlyFiveImages
                        ? imageWidth / 2 + ageShapeOffset
                        : ageShapeOffset
                    )
                    shape.set(
                      'top',
                      imageHeight +
                        imageHeight +
                        imageHeight -
                        shape.height -
                        ageShapeOffset
                    )
                  }

                  if (newIndex == 6) {
                    shape.set(
                      'left',
                      imageWidth + imageWidth - shape.width - ageShapeOffset
                    )
                    shape.set(
                      'top',
                      imageHeight +
                        imageHeight +
                        imageHeight -
                        shape.height -
                        ageShapeOffset
                    )
                  }

                  this.canvas.add(shape).renderAll()
                })
              })
            )
          )
        })
        Promise.all(imagePromises).then(() => {
          this.addText()
          this.resizeCanvas()
          // this.addCanvasObjects()
        })
      }

      //this.addText()
      this.bindEvents()
    },

    disableSelection() {
      if (this.canvas.getObjects()) {
        this.canvas.getObjects().forEach(object => {
          object.set('selectable', false)
        })
      }
    },
    addCanvasObjects() {
      if (this.theme.date && this.clearObjects) {
        return this.drawDateObject()
      }
      if (this.clearObjects) {
        this.theme.objects = {}
        return
      }
      if (this.theme.objects) {
        this.drawTextObjects()
      }

      this.drawDateObject()
    },
    drawTextObjects() {
      const textObjects = Object.keys(this.theme.objects).filter(
        item => this.theme.objects[item].type === 'text'
      )
      textObjects.forEach(item => {
        this.drawTextBackground(item)
      })
    },
    drawDateObject(width = this.imageWidth, height = this.imageHeight) {
      // const theme = this.theme

      const theme = {
        id: this.theme.id,
        font: this.theme.date.font,
        size: this.theme.date.size,
        width: width,
        height: height
      }

      const ageObject = {
        ...this.age,
        number: this.age.number || 1,
        text: this.age.text || 'day'
      }

      // Switch statement in case we want to use specific fns
      if (theme.id) {
        switch (theme.id) {
          case 'default':
            this.drawDefaultDate(theme, ageObject)
            break
          default:
            this.drawDefaultDate(theme, ageObject)
        }
      }
    },
    /*
            drawSvgObjects() {
              this.themeSvgs.forEach(svg => {
                this.addSvg(
                  svg,
                  this.theme.objects[svg].size,
                  this.theme.objects[svg].position,
                  this.theme.objects[svg].colour,
                  this.theme.objects[svg].opacity
                )
              })
            },
            updateSvg(obj) {
              const childObjects = obj._objects
              const svgId = obj.id
              obj.scale(parseInt(this.theme.objects[svgId].size))
              obj.set('fill', this.theme.objects[svgId].colour)
              obj.set('opacity', this.theme.objects[svgId].opacity)
              childObjects.forEach(obj => {
                obj.set('fill', this.theme.objects[svgId].colour)
              })
            },
             */
    updateTheme(currentObject) {},
    /*
            updateTheme(currentObjId) {
              if (currentObjId === 'date') {
                this.deleteObject(currentObjId)
                return this.drawDateObject()
              }
              const type = this.theme.objects[currentObjId].type || null
              const position = this.theme.objects[currentObjId].position || null
              const positionChanged =
                this.theme.objects[currentObjId].positionChanged || null
              this.canvas.forEachObject(obj => {
                if (obj.id === currentObjId) {
                  const id = obj.id
                  switch (type) {
                    case 'svg':
                      this.updateSvg(obj)
                      const svgObjectPosition = positionChanged
                        ? position
                        : {
                            left: obj.left,
                            top: obj.top
                          }
                      const newPosition = getPosition(
                        this.image.width,
                        this.image.height,
                        svgObjectPosition,
                        40,
                        'x',
                        'y'
                      )
                      setPosition(obj, newPosition)
                      break
                    case 'quote':
                      this.deleteObject(id)
                      this.drawQuoteText()
                      break
                    default:
                      this.deleteObject(id)
                      const textObjectPosition = positionChanged
                        ? null
                        : {
                            left: obj.left,
                            top: obj.top
                          }
                      this.drawTextBackground(id, null, null, textObjectPosition)
                  }
                  this.canvas.renderAll()
                }
              })
            }, */
    addText() {
      if (this.isThumb) {
        return
      }

      if (!this.isGridLayout) {
        const textId = 'newText_' + new Date().getUTCMilliseconds()
        const textObject = {
          type: 'text',
          font: 'BrochaAltW05-Book',
          size: 62,
          colour: '#000000',
          backgroundColour: 'transparent',
          position: 'topLeft'
        }
        this.drawTextBackground(textId, null, textObject)
      }

      if (this.isGridLayout) {
        let positionObject = getPosition(
          this.minGridSize,
          this.minGridSize,
          'middle',
          0,
          'x',
          'y'
        )

        this.addShape(positionObject).then((shape, topOffset = 0) => {
          const scaledWidth = shape.width * shape.scaleX
          const circleText = new fabric.Text(this.canvasData.style.text, {
            id: 'text',
            fontFamily: 'BrochaAltW05-Book',
            fontSize: 62,
            textAlign: 'center',
            left: 0,
            top: 0,
            fill: '#FFF' || 'red',
            stroke: '',
            charSpacing: 50,
            width: scaledWidth
          })
          circleText.scaleToWidth(scaledWidth / 2, true)
          let newCoordinates = positionObject.coordinates
          if (shape.topOffset) {
            newCoordinates = {
              ...positionObject.coordinates,
              y: positionObject.coordinates.y - shape.topOffset
            }
          }
          circleText.setPositionByOrigin(
            newCoordinates,
            positionObject.originX,
            positionObject.originY
          )
          this.canvas.add(circleText).renderAll()
        })
      }
    },
    addShape(positionObject) {
      return new Promise(resolve => {
        let shapeSize = this.minGridSize / 8
        let shape = null
        console.log('addShape theme', this.theme)

        if (this.theme.id === 'heart_v1') {
          fabric.loadSVGFromURL(
            `./svgs/shapes/heart.svg`,
            (objects, options) => {
              shapeSize = this.minGridSize / 3
              const fillColour = this.canvasData.style.colour
              shape = fabric.util.groupSVGElements(objects, options)
              shape.set('fill', fillColour)
              shape.scaleToWidth(shapeSize, true)
              shape.setPositionByOrigin(
                positionObject.coordinates,
                positionObject.originX,
                positionObject.originY
              )
              // need to manuallly vertically align text inside heart
              shape.set('topOffset', 20)
              resolve(shape)
              this.canvas.add(shape).renderAll()
            }
          )
        } else if (this.theme.id === 'balloon_v1') {
          fabric.loadSVGFromURL(
            `./svgs/shapes/star.svg`,
            (objects, options) => {
              shapeSize = this.minGridSize / 3
              const fillColour = this.canvasData.style.colour
              shape = fabric.util.groupSVGElements(objects, options)
              shape.set('fill', fillColour)
              shape.scaleToWidth(shapeSize, true)
              shape.setPositionByOrigin(
                positionObject.coordinates,
                positionObject.originX,
                positionObject.originY
              )
              // need to manuallly vertically align text inside heart
              shape.set('topOffset', -20)
              resolve(shape)
              this.canvas.add(shape).renderAll()
            }
          )
        } else if (this.theme.id === 'flower_v1') {
          fabric.loadSVGFromURL(
            `./svgs/shapes/flower.svg`,
            (objects, options) => {
              shapeSize = this.minGridSize / 3
              const fillColour = this.canvasData.style.colour
              shape = fabric.util.groupSVGElements(objects, options)
              shape.set('fill', fillColour)
              shape.scaleToWidth(shapeSize, true)
              shape.setPositionByOrigin(
                positionObject.coordinates,
                positionObject.originX,
                positionObject.originY
              )
              // need to manuallly vertically align text inside heart
              shape.set('topOffset', 0)

              //debugger
              // Added shape for background text
              const shapeCircleSize = shape.width / 3.25
              const shapeCircle = new fabric.Circle({
                top: 0,
                left: 0,
                radius: shapeCircleSize,
                fill: this.canvasData.style.colour,
                centeredScaling: true,
                padding: 10,
                hasRotatingPoint: false
              })
              shapeCircle.setPositionByOrigin(
                positionObject.coordinates,
                positionObject.originX,
                positionObject.originY
              )
              const shapeGroup = new fabric.Group([shapeCircle, shape])
              this.canvas.add(shapeGroup).renderAll()
              resolve(shapeGroup)
            }
          )
        } else {
          shape = new fabric.Circle({
            top: 0,
            left: 0,
            radius: shapeSize,
            fill: this.canvasData.style.colour,
            centeredScaling: true,
            padding: 10,
            hasRotatingPoint: false
          })
          shape.setPositionByOrigin(
            positionObject.coordinates,
            positionObject.originX,
            positionObject.originY
          )
          resolve(shape)
          this.canvas.add(shape).renderAll()
        }
      })
    },
    addInlineSvg(svg) {
      const svgElement = document.getElementById(svg.id)
      const svgString = svgElement.innerHTML
      fabric.loadSVGFromString(svgString, (objects, options) => {
        const loadedObject = fabric.util.groupSVGElements(objects, options)
        loadedObject.set('sourcePath', svgElement.getAttribute('data-url'))
        const scaledWidth = this.image.width / 2
        // const scaledHeight = this.image.height / 2
        this.canvas.add(loadedObject)

        /* const positionPadding =
                        this.isTouchDevice && this.image.url
                            ? CANVAS_PADDING / 2
                            : CANVAS_PADDING  */

        const positionPadding = CANVAS_PADDING

        let positionObject = getPosition(
          this.image.width,
          this.image.height,
          svg.position,
          positionPadding,
          'x',
          'y'
        )
        loadedObject.scaleToWidth(scaledWidth, true)

        loadedObject.setPositionByOrigin(
          positionObject.coordinates,
          positionObject.originX,
          positionObject.originY
        )

        loadedObject.set({
          id: svg.id,
          angle: svg.angle
        })

        loadedObject.setCoords() // Important: needed so you can select object
        this.canvas.renderAll()
      })
    },

    addSvg(svg) {
      svg = {
        fill: '#000',
        ...svg
      }
      fabric.loadSVGFromURL(svg.url, (objects, options) => {
        const loadedObject = fabric.util.groupSVGElements(objects, options)
        // loadedObject.set('id', svg)
        // loadedObject.set({ opacity: initialValues.opacity })
        loadedObject.set({ fill: svg.fill })
        const childObjects = loadedObject._objects
        if (childObjects) {
          childObjects.forEach(obj => {
            obj.set('fill', svg.fill)
          })
        }
        /*
            loadedObject.scale(initialValues.size)
             */
        this.canvas.add(loadedObject)
        const positionObject = getPosition(
          this.image.width,
          this.image.height,
          svg.position,
          0,
          'x',
          'y'
        )

        loadedObject.setPositionByOrigin(
          positionObject.coordinates,
          positionObject.originX,
          positionObject.originY
        )
        loadedObject.setCoords() // Important: needed so you can select object
        this.canvas.renderAll()
      })
    },
    resizeCanvas() {
      let width = this.imageWidth
      let height = this.imageHeight

      if (this.isGridLayout) {
        // Set max canvas width to 1080 for grid layout
        // Need a fix value for landscape layout
        width = this.maxCanvasWidth
        height = this.maxCanvasHeight
        console.log('resizeCanvas', width, height)
      }

      // https://stackoverflow.com/questions/22387627/how-to-save-an-image-in-its-original-size-in-a-canvas-after-scaled-the-canvas
      const canvasContainer = document.getElementById(this.canvasId)

      // Set size that the Canvas will download at
      this.canvas.setHeight(height)
      this.canvas.setWidth(width)

      if (this.isGridLayout) {
        this.canvas.setHeight(height)
      }

      const maxWidth = canvasContainer.offsetWidth
      const maxHeight = canvasContainer.offsetHeight

      const ratio = setImageRatio(width, height, maxWidth, maxHeight)
      this.canvas.setDimensions(
        {
          width: '100%',
          height: `${height * ratio}px`
        },
        { cssOnly: true }
      )

      this.canvas.renderAll()
    },
    renderTemplate() {
      // Start Media Kit Template 01

      this.renderMediaImage()
    },
    renderTemplateHeader() {
      const headerBackground = new fabric.Rect({
        left: this.image.width / 4,
        top: 0,
        width: this.image.width / 2,
        height: 300,
        fill: 'rgba(255,255,255,0.5)',
        stroke: 'rgba(34,177,76,1)',
        strokeWidth: 0
      })

      const headerText = new fabric.Text(this.websiteData.title, {
        id: 'headerText',
        fontFamily: this.canvasData.style.font,
        fontSize: 128,
        textAlign: 'center',
        left: 0,
        top: 0,
        fill: '#000',
        stroke: '',
        charSpacing: 50,
        width: headerBackground.width
      })
      headerText.scaleToWidth(headerBackground.width / 1.5, true)

      let positionObject = getPosition(
        this.image.width,
        headerBackground.height,
        'middle',
        0,
        'x',
        'y'
      )
      headerText.setPositionByOrigin(
        positionObject.coordinates,
        positionObject.originX,
        positionObject.originY
      )

      let headerGroup = new fabric.Group([headerBackground, headerText], {})
      headerGroup.set('top', 100)

      this.canvas.add(headerGroup)
    },
    renderTemplateSocialBackground() {
      const socialHeight = 300
      const socialRadius = 20
      const socialBackground = new fabric.Rect({
        left: 0,
        top: 0,
        width: this.image.width,
        height: socialHeight,
        fill: 'rgba(255,255,255,0.6)',
        stroke: 'rgba(34,177,76,1)',
        strokeWidth: 0
        //rx: socialRadius,
        //ry: socialRadius
      })
      socialBackground.set('top', 1400 - socialHeight / 2)
      socialBackground.set('left', 0)
      this.canvas.add(socialBackground)
    },
    renderTemplateSocial(
      icon = 'facebook',
      leftOffset = 100,
      username = '@joebloggs',
      text = '5,8k'
    ) {
      return new Promise(resolve => {
        const logoSize = 110
        return fabric.loadSVGFromURL(
          `./media/social/${icon}.svg`,
          (objects, options) => {
            // const fillColour = this.canvasData.style.colour
            let logo = fabric.util.groupSVGElements(objects, options)
            const textLeftOffset = 150
            logo.set('fill', '#000')
            logo.scaleToWidth(logoSize, true)
            const logoUsername = new fabric.Text(username, {
              id: `${icon}Text`,
              fontFamily: 'gill-sans-medium',
              fontSize: 50,
              textAlign: 'left',
              left: textLeftOffset,
              top: 75,
              fill: '#000',
              stroke: '',
              charSpacing: 50
            })

            const logoText = new fabric.Text(text, {
              id: `${icon}Text`,
              fontFamily: 'gill-sans-bold',
              fontSize: 72,
              textAlign: 'center',
              left: textLeftOffset,
              top: -20,
              fill: '#000',
              stroke: '',
              charSpacing: 0
            })

            let logoGroup = new fabric.Group([logo, logoUsername, logoText], {})
            logoGroup.set('top', 1320)
            logoGroup.set('left', leftOffset)
            this.canvas.add(logoGroup)
            resolve(logoGroup)
          }
        )
        resolve()
      })
    },
    renderTemplateAbout() {
      const aboutText = new fabric.Text(`About ${this.websiteData.title}`, {
        id: 'aboutText',
        fontFamily: this.canvasData.style.font,
        fontSize: 128,
        textAlign: 'left',
        left: 100,
        top: 1650,
        fill: '#000',
        stroke: '',
        charSpacing: 50
      })
      const aboutDescription = new fabric.Textbox(
        `About ${this.websiteData.description}`,
        {
          id: 'aboutDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 50,
          textAlign: 'left',
          left: 100,
          top: 1900,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 1200
        }
      )
      let aboutGroup = new fabric.Group([aboutText, aboutDescription], {})
      this.canvas.add(aboutGroup)
    },
    renderTemplateMyVisitors() {
      const myVisitorsText = new fabric.Text(`My Visitors`, {
        id: 'myVisitorsText',
        fontFamily: this.canvasData.style.font,
        fontSize: 128,
        textAlign: 'left',
        left: 1500,
        top: 1650,
        fill: '#000',
        stroke: '',
        charSpacing: 50
      })
      const myVisitorsDescription = new fabric.Textbox(
        `About ${this.websiteData.description}`,
        {
          id: 'myVisitorsDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 50,
          textAlign: 'left',
          left: 1500,
          top: 1900,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 850
        }
      )
      let myVisitorsGroup = new fabric.Group(
        [myVisitorsText, myVisitorsDescription],
        {}
      )
      this.canvas.add(myVisitorsGroup)
    },
    renderTemplateFooter() {
      const footerHeight = 150
      const footerBackground = new fabric.Rect({
        left: 0,
        top: 0,
        width: this.image.width,
        height: footerHeight,
        fill: 'rgba(0,0,0,1)'
      })
      const urlNoProtocol = this.websiteData.url.replace(/^https?\:\/\//i, '')
      const footerText = new fabric.Text(
        `${urlNoProtocol} | ${this.websiteData.email}`,
        {
          id: 'footerText',
          fontFamily: 'gill-sans-medium',
          fontSize: 50,
          textAlign: 'center',
          left: 0,
          top: 0,
          fill: '#FFF',
          stroke: '',
          charSpacing: 100,
          width: footerBackground.width
        }
      )
      footerText.scaleToWidth(footerBackground.width / 2, true)

      let positionObject = getPosition(
        this.image.width,
        footerBackground.height,
        'middle',
        0,
        'x',
        'y'
      )
      footerText.setPositionByOrigin(
        positionObject.coordinates,
        positionObject.originX,
        positionObject.originY
      )

      let footerGroup = new fabric.Group([footerBackground, footerText], {})
      footerGroup.set('top', this.image.height - footerHeight)

      this.canvas.add(footerGroup)
    },
    deactivateAll() {
      return new Promise(resolve => {
        // this.canvas.discardActiveObject()
        // this.canvas.requestRenderAll()
        resolve()
      })
    },
    saveImage() {
      console.log('saveImage')
      //this.updateCanvas() // adding here as temp measure as blank when no images uplaoded
      const canvasBase64 = this.canvas.toDataURL({
        format: 'jpeg',
        // default value of `quality` is 1 and varies from 0.1
        quality: this.isGridLayout ? 1.0 : 0.9
      })
      console.log('canvasBase64', canvasBase64)
      sessionStorage.setItem('gt_canvas_img', canvasBase64)
      // Go to step 3 (final step & download page)
      this.nextStepAction().then(() => {
        this.$router.push({ query: { step: this.step, name: this.fileName } })
        this.$scrollTo('#__nuxt', 0, { force: true })
      })
    },
    generateImage() {
      /*
      if (!this.isGridLayout) {
        // Ratio is different for Landscape & Portrait images
        const downloadRatio =
          this.image.originalWidth > this.image.originalHeight
            ? this.image.originalWidth / this.image.width
            : this.image.originalHeight / this.image.height

        this.canvas.setZoom(downloadRatio)
        this.canvas.setHeight(this.image.originalHeight)
        this.canvas.setWidth(this.image.originalWidth)
        if (this.canvas.backgroundImage) {
          this.canvas.backgroundImage.scaleToWidth(this.image.originalWidth)
          this.canvas.backgroundImage.scaleToHeight(this.image.originalHeight)
        }
      }  */
      this.deactivateAll().then(() => {
        this.saveImage()
        this.$emit('onSubmitForm')
      })
    },
    bindEvents() {
      this.canvas.on('object:selected', options => {
        this.updateObjectControlIcons(options)
      })
      this.canvas.on('selection:updated', options => {
        this.updateObjectControlIcons(options)
      })
      this.canvas.on('selection:created', () => {
        this.disableScroll()
      })
      this.canvas.on('selection:cleared', () => {
        console.log('sa5454sa')
        this.enableScroll()
      })
    },
    updateObjectControlIcons(options) {
      const isText = options.target.id && options.target.id.includes('newText')
      if (typeof isText !== 'undefined') {
        return options.target.setControlsVisibility({
          ...CANVAS_CONTROLS_VISIBILITY,
          bl: true
        })
      }
      options.target.setControlsVisibility(CANVAS_CONTROLS_VISIBILITY)
    },
    discardActiveObject() {
      this.canvas.discardActiveObject().renderAll()
    },
    getObjectFromCanvasById(id) {
      const canvasObject = this.canvas.getObjects().filter(item => {
        return item.id === id
      })
      return canvasObject[0]
    },
    deleteObject(object) {
      const activeObject = this.canvas.getActiveObject()
      if (object.isImage) {
        this.$store.commit('global/updateLoading', true)
        return this.deleteActiveObject(activeObject, object.id)
      }
      this.canvas.remove(activeObject)
    },
    deleteImageById(id) {
      this.deleteImage(id).then(() => {
        this.updateCanvas()
      })
    },
    deleteActiveObject(activeObject, id) {
      // Animate the opacity of the rectangle from 0 - 1 and back
      activeObject.animate('opacity', 0, {
        duration: 500,
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: () => {
          // Once the animation is complete, remove the object
          if (activeObject.opacity === 0) {
            this.canvas.remove(activeObject)
            setTimeout(() => {
              this.deleteImageById(id)
              this.$store.commit('global/updateLoading', false)
            }, 500)
          }
        },
        easing: fabric.util.ease['easeInQuad']
      })
    },
    handleOpenEdit() {
      // doesn't scroll unless timeout included
      setTimeout(() => {
        this.$scrollTo('#__nuxt', 0, { force: true })
        this.$store.commit('global/canvasNavOpen', 'text')
      }, 0)
    },
    handleOpenCanvasMenu(e) {
      const object = this.canvas.findTarget(e)
      if (object) {
        const id = object.svg_id || object.id
        if (id) {
          this.$emit('triggerTrayToggle', id)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/variables';
@import '../../scss/layout';
@import '../../scss/_mixins.scss';

.canvasContainer {
  &__wrap:not(.canvasContainer__wrap--slider) {
    border: 1px solid #000;
    max-width: $siteWidth;
    position: relative;
    margin: 0 auto;
    overflow: hidden; // Important: fixes scroll jumping on mobile
    @include media-query('medium') {
      // padding: 0 $padding;
      // padding-bottom: 0;
    }
  }

  &__content {
    width: $siteWidth;
    margin: 0 auto;
    width: calc(100% - 2px);
    @include media-query('medium') {
      border: 1px solid $white;
      border-top-width: 0;
    }
  }
}

// Examples page overrides
/*
    .canvasContainer__wrap--examplesPage,
    .CanvasSlider {
      cursor: pointer;
      .CanvasSlider__item div {
        pointer-events: none;
      }
      // margin-bottom: $padding * 3;
      .canvasContainer__content {
        @include media-query('medium') {
          border-top-width: 1px;
        }
      }
    }
    */

.CanvasSlider {
  .canvasContainer__content {
    @include media-query('medium') {
      border-top-width: 1px;
    }
  }
}
</style>
