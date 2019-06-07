<template>
  <div
    :class="{ 'CanvasApp--active': show.canvasApp }"
    class="CanvasApp">
    <canvas-top
      v-if="canvasData && userTheme"
      id="top"
      :canvas-data="canvasData"
      :number-of-images="userImages.length"
      :nav="canvasNavText"
      :font="userTheme.date.font"
      @on-background-click="triggerBackgroundClick"
    />
    <!-- START Netlify form -->
    <form
      v-show="false"
      ref="submitNetlify"
      action="/"
      name="CanvasImage"
      method="POST"
      netlify-honeypot="bot-field2"
      @submit.prevent="submitImage"
    >
      <input
        type="hidden"
        name="form-name"
        value="CanvasImage">
      <label>Don’t fill this out if you're human: <input name="bot-field2"></label>
      <input
        value="Image submission at BabyByMonth.com"
        name="subject"
      >
      <input
        value=""
        name="themeName"
      >
      <input
        value=""
        name="imageText"
      >
      <button
        ref="submitNetlifyButton"
        type="submit"
        name="subject"
      >Submit
      </button>
    </form>
    <!-- END Netlify form -->
    <input
      ref="fileInput"
      aria-label="Change Background"
      type="file"
      multiple
      accept="image/x-png,image/gif,image/jpeg"
      class="canvasApp__inputfile gt-hidden"
      @change="changeBackground">
    <div v-if="canvasData">
      <div
        v-show="userTheme.id"
        class="CanvasApp__container">
        <canvas-container
          v-if="fontsReady"
          ref="canvasContainer"
          :canvas-data="canvasData"
          :theme="userTheme"
          :image="userImage"
          :images="userImages"
          :clear-objects="clearObjects"
          @triggerTrayToggle="toggleTray('edit', $event)"
          @onSubmitForm="triggerSubmitForm"
        />
      </div>
      <!--
      <canvas-slider
        :current-theme="userTheme.id"
        :canvas-data="canvasData"
        :themes="formattedThemes"
        @on-change-theme="changeTheme"/>
        -->

      <counter-base
        id="counter"
        :colours="userTheme.objects.Counter.colours"
        :active-colour="canvasData && canvasData.style.colour"
        :age="age"
        class="gt-hidden"
      />

    </div>
  </div>
</template>

<script>
const dateFormat = require('dateformat')
import { firebase, storage, auth } from '~/plugins/firebase.js'
import findOrientation from 'exif-orientation'
import { DATE_FORMATS } from '~/constants/dates'
import { uuidv4 } from '~/utils/image'

const EXIF = require('exif-js')

import { searchMixin } from '../../mixins/searchMixin'
import { ageMixin } from '../../mixins/ageMixin'
import { trayMixin } from '../../mixins/trayMixin'
import { localStorageMixin } from '../../mixins/localStorageMixin'
import { THEMES } from '../../constants/themes'
import { setImageRatio } from '../../utils/image'
import { parseDate, getAge, ageText } from '~/utils/date'
// import { encode } from '~/utils/netlify'

import { mapGetters } from 'vuex'

const LOCAL_STORAGE_KEY = 'gt_img_upload_url'

export default {
  name: 'CanvasApp',
  mixins: [trayMixin, ageMixin, searchMixin, localStorageMixin],
  props: {
    fontsReady: {
      type: Boolean,
      default: false
    },
    userImage: {
      type: Object,
      required: false
    },
    userImages: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      progress: null,
      maxWidth: 1440,
      maxHeight: 1440,
      maxMobileWidth: 320,
      maxMobileHeight: 320,
      canvasData: null,
      textButtonAdded: false,
      theme: null,
      clearObjects: false,
      template: {
        current: 'default_v1'
      },
      show: {
        canvasApp: false
      },
      formattedThemes: []
    }
  },
  computed: {
    ...mapGetters({
      userTheme: 'user/theme',
      age: 'user/age',
      isTouchDevice: 'user/isTouchDevice',
      rawBirthday: 'user/rawBirthday',
      canvasNavText: 'global/canvasNav'
    })
  },
  scrollToTop: true,
  mounted() {
    this.formattedThemes = this.getFormattedThemes()
    if (this.formattedThemes) {
      const defaultTheme = this.formattedThemes.find(
        item => item.id === this.template.current
      )
      this.$store.commit('user/updateTheme', defaultTheme)
      this.canvasData = this.updateCanvasData(defaultTheme)
      setTimeout(() => {
        this.show.canvasApp = true
      }, 0)
    }

    // const themeQuery = this.$route.query.theme || this.userTheme.id
    /*
            // If coming back from /download page
            if (this.userTheme) {
              return (this.theme = this.userTheme)
            } */
    // this.renderTheme(defaultTheme)
  },
  methods: {
    /*
            This theme creates variations of the THEMES.js so we don't have to manually add them to the JSON file.
             */
    getFormattedThemes() {
      let newThemesObject = {}
      let newThemesArray = []
      let counter = 0

      function compare(a, b) {
        if (a.slug < b.slug) {
          return -1
        }
        if (a.slug > b.slug) {
          return 1
        }
        return 0
      }

      if (THEMES) {
        // const positions = ['topLeft', 'topMiddle', 'middleLeft', 'middleRight']
        const positions = ['middle']
        positions.forEach(position => {
          let copiedThemes = THEMES.slice(0)
          counter = counter + 1
          copiedThemes = copiedThemes.map((theme, index) => {
            return {
              ...theme,
              id: `${theme.id}_v${counter}`,
              title: theme.title,
              date: {
                ...theme.date,
                style: {
                  ...theme.date.style,
                  position: position
                }
              }
            }
          })
          newThemesArray = newThemesArray.concat(copiedThemes)
        })
        // Push Instruction theme to start of array
        // newThemesArray.unshift(THEMES[0])
        newThemesArray.sort(compare)
        return newThemesArray
      }
    },
    updateCanvasData(theme) {
      // updateImage fn triggers update in canvas-container component via props
      if (!theme.date) {
        return
      }
      const defaultStyle = {
        size: theme.date.size,
        opacity: 1,
        colour: theme.date.style.colour || '#252944',
        text: 'Baby\nName'
      }
      return {
        style:
          this.canvasData && this.canvasData.style
            ? this.canvasData.style
            : defaultStyle
      }
    },
    triggerBackgroundClick() {
      this.$refs.fileInput.click()
    },
    triggerSubmitForm() {
      this.$refs.submitNetlifyButton.click()
    },
    submitImage() {
      // @todo: use uploadToFirebase() fn when I find a way to remove user's images for privacy
      // this.uploadToFirebase()
      this.postImageToNetlify()
    },
    uploadToFirebase() {
      // sign in anonymously to Firebase to be able to use security rules
      firebase
        .auth()
        .signInAnonymously()
        .catch(error => {
          // Handle Errors here.
        })
      auth.onAuthStateChanged(user => {
        const imageString = sessionStorage.getItem('gt_canvas_img')
        const storageRef = storage.ref()
        const date = new Date()
        const y = date.getFullYear()
        const m = date.getMonth() + 1

        const prodImgPath = `${y}/${m}/${uuidv4()}`
        const devImgPath = 'development'
        const imgPath =
          process.env.NODE_ENV !== 'production' ? devImgPath : prodImgPath

        const uploadTask = storageRef
          .child(`${imgPath}/${this.fileName}`)
          .putString(imageString, 'data_url')
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          snapshot => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            this.progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                break
              case firebase.storage.TaskState.RUNNING: // or 'running'
                break
            }
          },
          error => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break
              case 'storage/canceled':
                // User canceled the upload
                break
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(imageUrl => {
              this.postImageToNetlify(imageUrl)
            })
          }
        )
      })
    },
    encode(data) {
      return Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join('&')
    },
    postImageToNetlify(imageUrl) {
      const action = this.$refs.submitNetlify.action
      const formData = new FormData(this.$refs.submitNetlify) // reference to form element
      const data = {} // need to convert it before using not with XMLHttpRequest
      for (let [key, val] of formData.entries()) {
        if (key === 'themeName') {
          Object.assign(data, { themeName: this.userTheme.title })
        } else if (key === 'subject') {
          Object.assign(data, {
            subject: `New Image (${
              this.userTheme.id
            }) submission at BabyByMonth.com`
          })
        } else if (key === 'imageText') {
          Object.assign(data, { imageText: this.canvasData.style.text })
        } else {
          Object.assign(data, { [key]: val })
        }
      }
      this.$axios
        .post(action, this.encode(data), {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          this.$store.commit('user/updateTheme', this.theme)
          this.$emit('parent-next-step')
        })
    },
    reLocalStorage() {
      sessionStorage.removeItem(LOCAL_STORAGE_KEY)
      //sessionStorage.removeItem('gt_canvas_img')
    },
    changeBackground(event) {
      const imageUploadPromises = []

      this.$store.commit('global/updateLoading', true)

      const files = event.currentTarget.files

      if (files) {
        this.reLocalStorage()

        Array.from(files).forEach(file => {
          imageUploadPromises.push(
            new Promise((resolve, reject) => {
              const FR = new FileReader()

              FR.onload = () => {
                const getExif = () => {
                  return new Promise(resolve => {
                    return EXIF.getData(file, function() {
                      return findOrientation(file, (error, orientation) => {
                        if (!error) {
                          const exifDateTime = file.exifdata.DateTime
                          resolve({
                            date:
                              exifDateTime &&
                              parseDate(exifDateTime).toString(),
                            orientation: orientation
                          })
                        }
                      })
                    })
                  })
                }

                const getImageSpec = rotate => {
                  return new Promise(resolve => {
                    let image = new Image()
                    image.onload = () => {
                      // If image needs rotating, we need to switch width & height values.
                      if (rotate === 90) {
                        image = {
                          width: image.height,
                          height: image.width,
                          originalWidth: image.originalHeight,
                          originalHeight: image.originalWidth
                        }
                      }

                      // const maxWidth = this.isTouchDevice ? this.maxMobileWidth : this.maxWidth
                      //const maxHeight = this.isTouchDevice ? this.maxMobileHeight : this.maxHeight

                      const maxWidth = this.maxWidth
                      const maxHeight = this.maxHeight

                      const ratio = setImageRatio(
                        image.width,
                        image.height,
                        maxWidth,
                        maxHeight
                      )

                      //debugger

                      resolve({
                        originalWidth: image.width,
                        originalHeight: image.height,
                        width: Math.round(image.width * ratio),
                        height: Math.round(image.height * ratio),
                        url: objectURL
                      })
                    }
                    const objectURL =
                      typeof file === 'string'
                        ? file
                        : window.URL.createObjectURL(file)
                    image.src = objectURL
                  })
                }

                getExif().then(exifImage => {
                  let image = {}
                  const rotate = exifImage.orientation.rotate
                  getImageSpec(rotate).then(imageWithSpecs => {
                    image = {
                      id: uuidv4(),
                      ...imageWithSpecs,
                      date: exifImage.date,
                      orientation: {
                        rotate: rotate
                      },
                      // Error because photo was taken after baby's birthday.
                      error:
                        new Date(exifImage.date) < new Date(this.rawBirthday)
                    }

                    resolve(image)

                    this.$store.commit('user/updateImage', image)

                    this.$store.commit('user/addImage', image)

                    if (image.date) {
                      this.$store.commit('user/updatePhotoDate', image.date)
                    }
                  })
                })
              }
              FR.readAsDataURL(file)
            })
          )
        })

        // Once all image promises have resolved we can remove spinner
        Promise.all(imageUploadPromises).then(() => {
          this.$store.commit('global/updateLoading', false)
        })
      }
    },
    getAgeNumber(ageData) {
      if (ageData.years > 0) {
        return {
          number: ageData.years
        }
      }
      if (ageData.months > 0) {
        return {
          number: ageData.months
        }
      }
      if (ageData.days > 6 && ageData.days < 31) {
        return {
          number: ageData.weeks
        }
      }
      if (ageData.days >= 0) {
        let days = ageData.days
        if (days === 0) {
          days = 1
        }
        return {
          number: days
        }
      }
    },
    addSvg(svg) {
      this.$refs.canvasContainer.addSvg(svg)
    },
    addText() {
      this.textButtonAdded = true
      setTimeout(() => {
        this.textButtonAdded = false
      }, 2000)
      this.$refs.canvasContainer.addText()
    },
    parentGenerateImage() {
      this.$refs.canvasContainer.generateImage()
    },
    changeTheme(theme) {
      const newTheme = this.formattedThemes.find(item => item.id === theme)
      this.$store.commit('user/updateTheme', newTheme)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/homepage.scss';

.CanvasApp {
  transform: translate3d(0, 0, 0);
  transition: transform 0.6s ease-in-out;

  &--active {
    transform: translate3d(0, -60px, 0);
  }
}

/*
    // Desktop Styles
    @include media-query('medium') {
        .CanvasApp {
            transition: none;
            margin: $padding 0 $padding * 2;
            &--active {
                transform: translate3d(0, 0, 0);
            }
        }
    } */
</style>
