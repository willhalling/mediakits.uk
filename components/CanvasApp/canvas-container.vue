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
import { drawTemplateDefault } from '~/mixins/canvas/drawTemplateDefault'
import { urlNoProtocol } from '~/utils/text'

import { FONTS } from '../../constants/fonts'

import { setImageRatio } from '../../utils/image'

import { getPosition } from '../../utils/position'

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

  mixins: [
    customControls,
    ageMixin,
    drawText,
    drawImageMixin,
    drawTemplateDefault
  ],
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
    website: {
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
      maxCanvasWidth: 800
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
        [`maxWidth`]: `1080px`,
        //[`maxHeight`]: `1528px`
      }
    },
    fileName() {
      return `${urlNoProtocol(
        this.website.data.url.value
      )} Media Kit ${dateFormat()}`
    },
    imageWidth() {
      return this.theme.width
    },
    imageHeight() {
      return this.theme.height
    },
    minGridSize() {
      //return Math.min(this.theme.width, this.theme.height)
      return 1080
    },
    maxCanvasHeight() {
      return 1132
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
    website: {
      handler() {
        this.updateCanvas()
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
      this.canvas.clear()
      this.canvas.backgroundColor = CANVAS_BACKGROUND_COLOUR
      this.renderTemplate().then(() => {
        console.log('render template finished')
        this.bindEvents()
        this.resizeCanvas()
      })
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
                        this.theme.width,
                        this.theme.height,
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
          this.theme.width,
          this.theme.height,
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

      console.log('resize canvas')

      let width = this.imageWidth
      let height = this.imageHeight

      // https://stackoverflow.com/questions/22387627/how-to-save-an-image-in-its-original-size-in-a-canvas-after-scaled-the-canvas
      const canvasContainer = document.getElementById(this.canvasId)

      // Set size that the Canvas will download at
      this.canvas.setHeight(height)
      this.canvas.setWidth(width)

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
        // this.$router.push({ query: { step: this.step, name: this.fileName } })
        this.$router.push({ path: 'download', query: { name: this.fileName } })
        this.$scrollTo('#__nuxt', 0, { force: true })
      })
    },
    generateImage() {
      /*
      if (!this.isGridLayout) {
        // Ratio is different for Landscape & Portrait images
        const downloadRatio =
          this.image.originalWidth > this.image.originalHeight
            ? this.image.originalWidth / this.theme.width
            : this.image.originalHeight / this.theme.height

        this.canvas.setZoom(downloadRatio)
        this.canvas.setHeight(this.image.originalHeight)
        this.canvas.setWidth(this.image.originalWidth)
        if (this.canvas.backgroundImage) {
          this.canvas.backgroundImage.scaleToWidth(this.image.originalWidth)
          this.canvas.backgroundImage.scaleToHeight(this.image.originalHeight)
        }
      }  */
      this.deactivateAll().then(() => {
        // Need to add watermark before download
        this.addWatermaker()
        this.saveImage()
        this.$emit('onSubmitForm')
      })
    },
    addWatermaker() {},
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
    max-width: 800px;
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
