import { getPosition } from '~/utils/position'
import { insertLines } from '~/utils/text'

export const drawText = {
  methods: {
    drawDateShape(theme, age, topTextPadding = 5) {
        return new Promise(resolve => {
            console.log('age ssasasa', age)
            fabric.loadSVGFromURL(
                `./svgs/numbers/${this.theme.slug}/${age.path}/${
                    age.number
                    }.svg`,
                (objects, options) => {
                    const newObjects = objects
                    const fillColour = this.canvasData.style.colour

                    if (newObjects) {
                        newObjects.forEach(obj => {
                            obj.set('fill', fillColour)
                        })
                    }
                    const groupObjects = new fabric.Group(newObjects, options)
                    const percentageWidth = 0.2 * theme.width

                    // @todo: need to change padding to percentage so works better on mobile & desktop versions.
                    let topPadding = topTextPadding

                    groupObjects.scaleToWidth(percentageWidth)
                    

                    if (age.text) {
                        let textObject = new fabric.Text(age.text, {
                            id: 'dateText',
                            fontFamily: theme.font,
                            fontSize: theme.size,
                            textBaseline: 'bottom',
                            textAlign: 'center', // newPosition.textAlign,
                            left: 0,
                            top: percentageWidth + topPadding,
                            opacity: this.canvasData.style.opacity,
                            textBackgroundColor: 'transparent',
                            fill: fillColour,
                            width: groupObjects.width
                        })

                        textObject.scaleToWidth(percentageWidth)

                        groupObjects.addWithUpdate(textObject)
                    }


                    // test shape used for demo purposes
                    const test = new fabric.Rect({
                        top: 0,
                        left: 0,
                        width: groupObjects.width,
                        height: groupObjects.height,
                        opacity: 0,
                        fill: 'blue',
                    })

                    const group = new fabric.Group([groupObjects, test], {
                        width: 0,
                        height: 0,
                    })

                    group.addWithUpdate()

                    resolve(group)

                }
            )
        })
    },
    drawDefaultDate(theme, age, topTextPadding = 5) {
      fabric.loadSVGFromURL(
        `./svgs/numbers/${this.theme.slug}/months/${
          age.number
        }.svg`,
        (objects, options) => {
          const newObjects = objects
          const fillColour = this.canvasData.style.colour

          if (newObjects) {
            newObjects.forEach(obj => {
              obj.set('fill', fillColour)
            })
          }
          const groupObjects = new fabric.Group(newObjects, options)
          //console.log('groupObjects', objects)
          //console.log('this.image.width 02', this.image.width)
          const percentageWidth = 0.25 * theme.width

          // @todo: need to change padding to percentage so works better on mobile & desktop versions.
          let topPadding = topTextPadding

          groupObjects.scaleToWidth(percentageWidth)

          //console.log('this.canvasData.date.style.position', this.theme.date.style.position)

          const newPosition = getPosition(
            theme.width,
            theme.height,
            this.theme.date.style.position,
            40
          )

          if (age.text) {
            let textObject = new fabric.Text(age.text, {
              id: 'dateText',
              fontFamily: theme.font,
              fontSize: theme.size,
              textBaseline: 'bottom',
              textAlign: 'center', // newPosition.textAlign,
              left: 0,
              top: percentageWidth + topPadding,
              opacity: this.canvasData.style.opacity,
              textBackgroundColor: 'transparent',
              fill: fillColour,
              width: groupObjects.width
            })

            textObject.scaleToWidth(percentageWidth)

            groupObjects.addWithUpdate(textObject)
          }

          groupObjects.set({
            id: `date_${this.theme.slug}_${age.number}`,
            originX: newPosition.originX,
            originY: newPosition.originY,
            ...newPosition.coordinates
          })

          groupObjects.addWithUpdate()

          this.canvas.add(groupObjects)
          this.canvas.renderAll()

          // Add Counter timeline
          /*
          this.addInlineSvg({
            id: this.theme.objects.Counter.id,
            position: this.theme.objects.Counter.position,
            angle: this.theme.objects.Counter.angle
          })
           */

          // Disable object selection if on instruction page
          if (!this.image.url) {
            this.disableSelection()
          }
        }
      )
    },
      drawTextBackground(
          id,
          blendMode = null,
          newTextObject = null,
          objectPosition = null
      ) {
          const textSrc = this.canvasData.style.text
          const hasBackgroundColour = newTextObject.backgroundColour
          const boundingBoxPadding = 0
          const angle = 0

          let pos = {
              padding: {
                  left: 10,
                  top: 5,
                  bottom: 5,
                  right: 10
              },
              margin: {
                  left: 0,
                  top: 5,
                  bottom: 5,
                  right: 0
              },
              angle: angle
          }

          // Fixes alignment if no background colour
          // If there is no background colour we remove padding as not needed
          if (hasBackgroundColour === 'transparent') {
              pos = {
                  padding: {
                      left: 0,
                      top: 0,
                      bottom: 5,
                      right: 0
                  },
                  margin: {
                      left: 0,
                      top: 5,
                      bottom: 5,
                      right: 0
                  },
                  angle: angle
              }
          }

          // Create the text measuring node - not added to the canvas !
          let textMeasure = new fabric.Text(textSrc, {
              fontFamily: newTextObject.font,
              fontSize: newTextObject.size,
              textBaseline: 'bottom',
              // textAlign: this.theme.objects[id].textAlign,
              left: 0,
              top: 0,
              fill: this.canvasData.style.colour || newTextObject.colour,
              charSpacing: 50,
              stroke: '',
              ...newTextObject
          })

          let shapes = []

          const drawTextLines = (groupWidth, alignment) => {
              // loop round the lines in the text creating a margin/pad scenario for each line
              let theText = null
              let text = null
              let textHeight = null
              let rectPadding = null
              let rectMargin = null
              let top = 0
              shapes = []
              // objectPosition = null

              for (let i = 0; i < textMeasure._textLines.length; i = i + 1) {
                  theText = textMeasure._textLines[i].join('')
                  textHeight = Math.floor(textMeasure.lineHeight * textMeasure.fontSize) //textMeasure.getHeightOfLine(i)

                  // Make the text node for line i
                  text = new fabric.Text(theText, {
                      id: 'textChild',
                      fontFamily: newTextObject.font,
                      fontSize: newTextObject.size,
                      // textAlign: this.theme.objects[id].textAlign,
                      left: 0,
                      top: top,
                      fill: this.canvasData.style.colour || newTextObject.colour,
                      stroke: '',
                      charSpacing: 50
                  })

                  // create the outer 'margin' rect, note the position is negatively offset for padding & margin
                  // and the width is sized from the dimensions of the text node plus 2 x (padding + margin).
                  rectMargin = new fabric.Rect({
                      left: -1 * (pos.padding.left + pos.margin.left),
                      top: top - (pos.padding.top + pos.margin.top),
                      width:
                          text.width +
                          (pos.padding.left +
                              pos.padding.right +
                              (pos.margin.left + pos.margin.right)),
                      height:
                          textHeight +
                          (pos.padding.top +
                              pos.padding.bottom +
                              (pos.margin.top + pos.margin.bottom)),
                      fill: 'transparent'
                      // fill: '#FC0000'
                  })
                  shapes.push(rectMargin)

                  // Start right or center alignment
                  // This is set after left alignment is init
                  // So needs a current object to calculate group/currentObject width
                  let rectPaddingLeft
                  let offsetPadding =
                      pos.padding.left +
                      pos.padding.right -
                      (pos.margin.left + pos.margin.right) / 2

                  if (groupWidth && alignment === 'right') {
                      rectPaddingLeft = groupWidth - rectMargin.width - offsetPadding
                      rectMargin.left = rectPaddingLeft
                      text.left = rectPaddingLeft + pos.padding.right
                  } else if (groupWidth && alignment === 'center') {
                      rectPaddingLeft = (groupWidth - rectMargin.width) / 2
                      rectMargin.left = rectPaddingLeft
                      text.left = rectPaddingLeft + pos.padding.right
                  } else {
                      rectPaddingLeft = -1 * pos.padding.left
                  }

                  // create the inner 'padding' rect, note the position is offset for padding only
                  // and the width is sized from the dimensions of the text node plus 2 x padding.
                  rectPadding = new fabric.Rect({
                      id: 'textRectangle',
                      width: text.width + (pos.padding.left + pos.padding.right),
                      height: textHeight + (pos.padding.top + pos.padding.bottom),
                      left: rectPaddingLeft,
                      top: top - pos.padding.top,
                      fill: newTextObject.backgroundColour,
                      opacity: 0.5
                  })
                  shapes.push(rectPadding)
                  shapes.push(text)

                  // move the insert point down by the height of the line
                  // const gap = 0; // text.lineHeight - textHeight;
                  top =
                      top -
                      1 +
                      textHeight +
                      pos.padding.top +
                      pos.margin.top +
                      pos.padding.bottom +
                      pos.margin.bottom
              }
          }

          drawTextLines()

          // At this point we have a list of shapes to output in the shapes[] array.
          // Create group and add the shapes to group.
          // note that group is positioned so that the topleft of the first text line is where
          // it would fall if it were a standard text node.
          let group = new fabric.Group(shapes, {
              id: id,
              left: 0 - (pos.padding.left - pos.margin.left),
              top: 100 - (pos.padding.top - pos.margin.top),
              angle: pos.angle
          })

          // Default position set by theme constant,
          // Otherwise objectPosition has priority (if set as an argument)
          let newPosition = getPosition(
              this.image.width,
              this.image.height,
              newTextObject.position,
              40
          )

          // newPosition = objectPosition || newPosition
          const textAlign = newPosition.textAlign

          // Default to coordinates set by user, or use theme coordinates
          let coordinates = objectPosition || newPosition.coordinates

          // If text Align is set, we need to draw text lines again with correct alignment
          if (textAlign) {
              drawTextLines(group.width, textAlign)
              group = new fabric.Group(shapes, { id: id, angle: pos.angle })
          }

          // console.log('coordinates', coordinates)
          // console.log('objectPosition', objectPosition)
          group.set({
              globalCompositeOperation: blendMode,
              originX: newPosition.originX,
              originY: newPosition.originY,
              ...coordinates
          })
          group.set({
              // We need to increase the selection / bounding box padding by 8px
              // This is to accommodate unpredictable fonts such as Viva-Beautiful
              _getNonTransformedDimensions() {
                  // Object dimensions
                  return new fabric.Point(this.width, this.height).scalarAdd(
                      this.padding + boundingBoxPadding
                  )
              }
          })

          group.setCoords()
          this.canvas.add(group)
      }
  }
}
