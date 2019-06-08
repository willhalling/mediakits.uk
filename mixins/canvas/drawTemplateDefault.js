import { getPosition } from '~/utils/position'
import { urlNoProtocol } from '~/utils/text'

const firstRowTopTitle = 1700
const firstRowTopDescription = 1950

const secondRowTopTitle = 2450
const secondRowTopDescription = 2700

export const drawTemplateDefault = {
  methods: {
    renderTemplateDefaultHeader() {
      const headerBar = new fabric.Rect({
        left: 0,
        top: 0,
        width: this.image.width,
        height: 25,
        fill: 'rgba(0,0,0,1)'
      })
      const headerBackground = new fabric.Rect({
        left: this.image.width / 4,
        top: 0,
        width: this.image.width / 2,
        height: 300,
        fill: 'rgba(255,255,255,0.5)',
        stroke: 'rgba(34,177,76,1)',
        strokeWidth: 0
      })

      const headerText = new fabric.Text(this.website.data.title.value, {
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
      this.canvas.add(headerBar)
    },
    renderTemplateDefaultSocialBackground() {
      const socialHeight = 300
      // const socialRadius = 20
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
      socialBackground.set('selectable', false)
      this.canvas.add(socialBackground)
    },
    renderTemplateDefaultSocial(
      icon = 'facebook',
      leftOffset = 200,
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
            //logoGroup.set('top', 1320)
            logoGroup.set('left', leftOffset)
            // this.canvas.add(logoGroup)
            resolve(logoGroup)
          }
        )
        resolve()
      })
    },
    renderTemplateDefaultAbout() {
      const aboutText = new fabric.Text(this.website.data.aboutTitle.value, {
        id: 'aboutText',
        fontFamily: this.canvasData.style.font,
        fontSize: 128,
        textAlign: 'left',
        left: 100,
        top: firstRowTopTitle,
        fill: '#000',
        stroke: '',
        charSpacing: 50
      })
      const aboutDescription = new fabric.Textbox(
        this.website.data.aboutDescription.value,
        {
          id: 'aboutDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 50,
          textAlign: 'left',
          left: 100,
          top: firstRowTopDescription,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 1200
        }
      )
      let aboutGroup = new fabric.Group([aboutText, aboutDescription], {})
      aboutGroup.set('selectable', false)
      this.canvas.add(aboutGroup)
    },
    renderTemplateDefaultTheBlog() {
      const theBlogText = new fabric.Text(
        this.website.data.theBlogTitle.value,
        {
          id: 'theBlogText',
          fontFamily: this.canvasData.style.font,
          fontSize: 128,
          textAlign: 'left',
          left: 100,
          top: secondRowTopTitle,
          fill: '#000',
          stroke: '',
          charSpacing: 50
        }
      )
      const theBlogDescription = new fabric.Textbox(
        this.website.data.theBlogDescription.value,
        {
          id: 'theBlogDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 50,
          textAlign: 'left',
          left: 100,
          top: secondRowTopDescription,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 1200
        }
      )
      let theBlogGroup = new fabric.Group([theBlogText, theBlogDescription], {})
      theBlogGroup.set('selectable', false)
      this.canvas.add(theBlogGroup)
    },
    renderTemplateDefaultMyVisitors() {
      const myVisitorsText = new fabric.Text(
        this.website.data.myVisitorsTitle.value,
        {
          id: 'myVisitorsText',
          fontFamily: this.canvasData.style.font,
          fontSize: 128,
          textAlign: 'left',
          left: 1500,
          top: firstRowTopTitle,
          fill: '#000',
          stroke: '',
          charSpacing: 50
        }
      )
      const myVisitorsDescription = new fabric.Textbox(
        this.website.data.myVisitorsDescription.value,
        {
          id: 'myVisitorsDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 60,
          textAlign: 'left',
          left: 1500,
          top: firstRowTopDescription,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 900
        }
      )
      //myVisitorsDescription.scaleToWidth(550)
      //myVisitorsDescription.scaleToHeight(470)
      let myVisitorsGroup = new fabric.Group(
        [myVisitorsText, myVisitorsDescription],
        {}
      )
      myVisitorsGroup.set('selectable', false)
      this.canvas.add(myVisitorsGroup)
    },
    renderTemplateDefaultMyStats() {
      const myStatsText = new fabric.Text(
        this.website.data.myStatsTitle.value,
        {
          id: 'myStatsText',
          fontFamily: this.canvasData.style.font,
          fontSize: 128,
          textAlign: 'left',
          left: 1500,
          top: secondRowTopTitle,
          fill: '#000',
          stroke: '',
          charSpacing: 50
        }
      )
      const myStatsDescription = new fabric.Textbox(
        this.website.data.myStatsDescription.value,
        {
          id: 'myStatsDescription',
          fontFamily: 'gill-sans-medium',
          fontSize: 60,
          textAlign: 'left',
          left: 1500,
          top: secondRowTopDescription,
          fill: '#000',
          stroke: '',
          charSpacing: 50,
          width: 900
        }
      )
      //myStatsDescription.scaleToWidth(550)
      //myStatsDescription.scaleToHeight(470)
      let myStatsGroup = new fabric.Group([myStatsText, myStatsDescription], {})
      myStatsGroup.set('selectable', false)
      this.canvas.add(myStatsGroup)
    },
    renderTemplateDefaultFooter() {
      const footerHeight = 270
      const footerBackground = new fabric.Rect({
        left: 0,
        top: 0,
        width: this.image.width,
        height: footerHeight,
        fill: 'rgba(0,0,0,1)'
      })
      const addressText = new fabric.Text(
        urlNoProtocol(this.website.data.url.value),
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
      const emailText = new fabric.Text(this.website.data.email.value, {
        id: 'footerText',
        fontFamily: 'gill-sans-medium',
        fontSize: 50,
        textAlign: 'center',
        left: 0,
        top: 140,
        fill: '#FFF',
        stroke: '',
        charSpacing: 100,
        width: footerBackground.width
      })

      // footerText.scaleToWidth(footerBackground.width / 2, true)

      let positionAddressObject = getPosition(
        this.image.width,
        footerBackground.height,
        'bottomLeft',
        100,
        'x',
        'y'
      )

      let positionEmailObject = getPosition(
        this.image.width,
        footerBackground.height,
        'bottomRight',
        100,
        'x',
        'y'
      )

      addressText.setPositionByOrigin(
        positionAddressObject.coordinates,
        positionAddressObject.originX,
        positionAddressObject.originY
      )

      emailText.setPositionByOrigin(
        positionEmailObject.coordinates,
        positionEmailObject.originX,
        positionEmailObject.originY
      )

      //emailText.set

      let footerGroup = new fabric.Group(
        [footerBackground, addressText, emailText],
        {}
      )
      footerGroup.set('top', this.image.height - footerHeight)
      footerGroup.set('selectable', false)

      this.canvas.add(footerGroup)
    }
  }
}
