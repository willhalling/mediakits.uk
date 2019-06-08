import ls from 'local-storage'

const state = {
  // Cache version
  version: '',
  website: {
    data: {
      title: {
        name: 'Name',
        value: 'Joanna Bloggs',
        type: 'text'
      },
      url: {
        name: 'url',
        value: 'http://www.joannabloggs.com',
        type: 'text'
      },
      email: {
        name: 'email',
        value: 'hello@joannabloggs.com',
        type: 'email'
      },
      aboutTitle: {
        name: 'About Title',
        value: 'About Joanna Bloggs',
        type: 'text'
      },
      aboutDescription: {
        name: 'About text',
        value:
          "I'm Katy, 30. I am married to Thomas and we " +
          'have one daughter, Daisy Blue. I love to share ' +
          'my views on parenting, products, family life, ' +
          'personal finance & more. I enjoy helping people ' +
          'make money, save money and change their lives ' +
          "for the better.'",
        type: 'textarea'
      },
      myVisitorsTitle: {
        name: 'My Visitors Title',
        value: 'My Visitors',
        type: 'text'
      },
      myVisitorsDescription: {
        name: 'My Visitors text',
        value: '72% female \n' + '49% aged 25-44',
        type: 'textarea'
      },
      theBlogTitle: {
        name: 'The Blog Title',
        value: 'The Blog',
        type: 'text'
      },
      theBlogDescription: {
        name: 'The Blog Description',
        value: 'I started the blog twos years ago and in this time ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
        type: 'textarea'
      },
      myStatsTitle: {
        name: 'My Stats Title',
        value: 'My Stats',
        type: 'text'
      },
      myStatsDescription: {
        name: 'My Visitors text',
        value:
          '25k+ social media followers \n' +
          '25k+ monthly visitors \n' +
          '35k+ monthly page views \n',
        type: 'textarea'
      }
    },
    stats: {
      social_media: {
        facebook: {
          username: '',
          total_followers: 5800
        },
        instagram: {
          username: '',
          total_followers: 5000
        },
        twitter: {
          username: '',
          total_followers: 2000
        },
        pinterest: {
          username: '',
          total_followers: 3000
        },
        total_followers: 25000
      },
      monthly_visitors: 25000,
      monthly_page_views: 35000,
      my_visitors: {
        males: '0%',
        females: '0%'
      }
    }
  },
  image: {
    width: 2480,
    height: 3508,
    url: ''
  },
  images: [],
  config: {
    styles: {},
    date: {
      age: {
        days: '',
        months: '',
        years: '',
        text: ''
      },
      raw: {
        birthday: null,
        photoDate: null
      }
    },
    existingUser: false,
    isTouchDevice: false
  },
  theme: {
    id: 'default_v1'
  }
}

const actions = {
  deleteImageAction: ({ commit }, id) => {
    commit('deleteImage', id)
  }
}

const mutations = {
  initialiseStore(state) {
    // Check if the store exists
    let store = ls.get('bbm_store')
    if (store) {
      // https://stackoverflow.com/a/13470899
      let isTouchDevice = null
      if (process.browser) {
        isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints
      }
      state.config = {
        ...store.config,
        isTouchDevice: isTouchDevice
      }
    }
  },
  updateRawBirthday(state, date) {
    state.config.date.raw.birthday = date
  },
  updateAge(state, age) {
    console.log('updateAGe', age)
    state.config.date.age = age
  },
  updatePhotoDate(state, date) {
    state.config.date.raw.photoDate = date
  },
  updateTheme(state, theme) {
    state.theme = theme
  },
  updateImage(state, image) {
    state.image = image
  },
  updateExistingUser(state, existingUser) {
    state.config.existingUser = existingUser
  },
  deleteImage(state, id) {
    const newImages = state.images.filter(item => {
      return item.id != id
    })
    state.images = newImages
  },
  addImage(state, image) {
    state.images.push(image)
  },
  resetImage(state) {
    state.image = {
      width: 1080,
      height: 1080,
      url: ''
    }
  },
  resetImages(state) {
    state.images = []
  },
  resetTheme(state) {
    state.theme = null
  }
}

const getters = {
  age: state => {
    return state.config.date.age
  },
  rawBirthday: state => {
    return state.config.date.raw.birthday
  },
  photoDate: state => {
    return state.config.date.raw.photoDate
  },
  isTouchDevice: state => {
    return state.config.isTouchDevice
  },
  theme: state => {
    return state.theme
  },
  datePreference: state => {
    return state.datePreference
  },
  image: state => {
    return state.image
  },
  images: state => {
    return state.images
  },
  existingUser: state => {
    return state.config.existingUser
  },
  website: state => {
    return state.website
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
