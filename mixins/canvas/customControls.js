import rotateImage from '~/assets/custom-control/rotate.svg'
import trashImage from '~/assets/custom-control/trash.svg'
import editImage from '~/assets/custom-control/edit.svg'
import resizeImage from '~/assets/custom-control/resize.svg'
// import resizeImageAlt from '~/assets/custom-control/resize-alt.svg'

import { isMobile } from '~/utils/media-queries'

export const customControls = {
  computed: {
    isMobile() {
      return isMobile()
    }
  },
  mounted() {
    const iconSize = this.isMobile ? 96 : 102

    fabric.Object.prototype.set({
      rotatingPointOffset: 75
    })

    if (!this.isThumb) {
      fabric.Canvas.prototype.customiseControls(
        {
          tl: {
            action: (e, target) => {
              console.log('all objects', this.canvas.getObjects())
              this.deleteObject(target)
            },
            cursor: 'pointer'
          },
          tr: {
            action: 'rotate',
            cursor: 'crosshair'
          },
          br: {
            action: 'scale'
          },
          bl: {
            action: () => {
              this.handleOpenEdit()
            },
            cursor: 'pointer'
          },
          mb: {
            action: () => {
              return
            },
            cursor: 'none'
          },
          mt: {
            action: () => {
              return
            },
            cursor: 'none'
          },
          mr: {
            action: () => {
              return
            },
            cursor: 'none'
          },
          mtr: {
            action: e => {
              this.handleOpenCanvasMenu(e)
            },
            cursor: 'pointer'
          }
        },
        () => {
          this.canvas.renderAll()
        }
      )
      fabric.Object.prototype.customiseCornerIcons(
        {
          settings: {
            borderColor: 'white',
            cornerSize: iconSize,
            cornerShape: 'rect',
            cornerBackgroundColor: 'transparent',
            cornerPadding: this.isMobile ? 20 : 0
          },
          mtr: {
            icon: editImage
          },
          tl: {
            icon: trashImage
          },
          tr: {
            icon: rotateImage
          },
          bl: {
            icon: editImage
          },
          br: {
            icon: resizeImage
          }
        },
        () => {
          this.canvas.renderAll()
        }
      )
    }
  }
}
