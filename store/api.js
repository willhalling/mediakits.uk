import { firebase, storage, auth, database } from '../plugins/firebase.js'

import * as utils from '../utils/firebase'

const FOLDER_NAME = 'svgs'
import { FILTERS } from '../constants/filters'

import { uuidv4 } from '../utils/image'

export default {
  /**
   *  AUTH
   */
  logIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  },

  logOut() {
    return auth.signOut()
  },

  signUp(email) {
    const userData = {
      newsletter: true,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }
    const tempPassword = uuidv4()
    return auth
      .createUserWithEmailAndPassword(email, tempPassword)
      .then(response => {
        return database
          .collection('users')
          .doc(response.user.uid)
          .set(userData)
          .then(() => {
            return response
          })
      })
  },

  /**
   *  STORAGE
   */

  uploadToStorage(data) {
    const storageRef = storage.ref()
    const uploadRef = storageRef.child(`${FOLDER_NAME}/${data.meta.name}`)
    return uploadRef.put(data.file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(downloadURL => {
        // console.log('snapshot', snapshot)
        const downloadData = {
          name: data.meta.name,
          url: downloadURL
        }
        return downloadData
      })
    })
  },

  /**
   *  DATABASE
   */

  /**
   * @desc adds a file reference to the file we have just uploaded. And then adds filters (if there is any filters).
   * @param Object data
   * @returns {Promise}
   */
  addFileReference(referenceData) {
    const data = {
      ...referenceData.file,
      last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }
    const ref = database.collection(FOLDER_NAME).doc()
    if (!referenceData.filters) {
      this.addSearch(ref.id, data.description)
      return ref.set(data)
    }

    const id = ref.id

    // There are filters so lets add them to the DB
    return ref.set(data).then(() => {
      // console.log('referenceData.filters', referenceData.filters)
      referenceData.filters.forEach(filter => {
        this.addSearch(id, data.description)
        return this.addFilter(filter, id)
      })
    })
  },

  addSearch(id, description) {
    // Add to search collection so we can search via keywords.
    const searchRef = database.collection('search')
    return searchRef.add({
      id,
      terms: utils.createSearchTerms(description)
    })
  },

  addFilter(filter, id) {
    const ref = database.collection('filters').doc(filter.value)
    // Add Id reference to overlay inside filters
    const refSvgs = ref.collection(FOLDER_NAME)
    refSvgs.add({
      id,
      last_updated: firebase.firestore.FieldValue.serverTimestamp()
    })
    return ref.set({
      ...filter,
      featured: false,
      premium: false
    })
  },

  /**
   * @desc gets all filter names as an array of objects, containing name, value & featured boolean.
   * @returns {Array}
   */
  getAllFilterNames() {
    const ref = database.collection('filters')
    const filterPromises = []
    return ref
      .get()
      .then(doc => {
        if (!doc.empty) {
          let filters = []
          doc.docs.forEach(filter => {
            filterPromises.push(
              database
                .collection('filters')
                .doc(filter.id)
                .collection('svgs')
                .get()
                .then(snap => {
                  filters.push({ name: filter.id, length: snap.size })
                })
            )
          })
          return Promise.all(filterPromises).then(() => {
            return filters
          })
        }
        return []
      })
      .catch(error => {
        return `Error getting document: ${error}`
      })
  },

  /**
   * @desc gets a list of SVGs by passing a filter object with name prop.
   * Calls getSvgReferences fn util to get list of files from IDs.
   * @param Object data
   * @returns {Promise}
   */
  getSvgsByFilter(filter) {
    // console.log('filter', filter)
    let lastVisible = null
    const startAt = filter.startAfter ? null : Date.now()
    const startAfter = filter.startAfter ? filter.startAfter : null
    // console.log('startAfter', startAfter)
    const ref = database
      .collection('filters')
      .doc(filter.name)
      .collection('svgs')
      .orderBy('last_updated', 'asc')
      .limit(filter.limit)
      .startAt(startAt)
      .startAfter(startAfter)
    let svgIds = []
    const docPromises = []
    docPromises.push(
      ref
        .get()
        .then(doc => {
          doc.docs.forEach(item => {
            svgIds.push(item.data().id)
          })
          lastVisible = doc.docs[doc.docs.length - 1]
          // console.log('lastVisible', lastVisible)
        })
        .catch(error => {
          return `Error getting SVGs: ${error}`
        })
    )
    return Promise.all(docPromises).then(() => {
      return utils.getSvgReferences(svgIds).then(svgs => {
        return { svgs, lastVisible }
      })
    })
  },

  // https://stackoverflow.com/a/46570555/1657678
  getSvgsBySearch(search) {
    const searchArray = search.name.split(' ')
    let ref = database.collection('search')
    searchArray.forEach(term => {
      ref = ref.where(`terms.${term}`, '==', true)
    })
    let svgIds = []
    const docPromises = []
    docPromises.push(
      ref
        .get()
        .then(doc => {
          doc.docs.forEach(item => {
            svgIds.push(item.data().id)
          })
        })
        .catch(error => {
          return `Error getting SVGs: ${error}`
        })
    )
    return Promise.all(docPromises).then(() => {
      return utils.getSvgReferences(svgIds).then(svgs => {
        return { svgs }
      })
    })
  },

  removeSvgReferences(svg) {
    const svgsRef = database.collection(FOLDER_NAME).doc(svg.id)
    const searchRef = database.collection('search').where(`id`, '==', svg.id)
    const filterRefArray = []
    FILTERS.forEach(filter => {
      filterRefArray.push(
        database
          .collection('filters')
          .doc(filter.value)
          .collection('svgs')
          .where(`id`, '==', svg.id)
      )
    })

    const removePromises = []

    // 0. delete from Firebase storage
    const storageRef = storage.ref()
    const fileRef = storageRef.child(`${FOLDER_NAME}/${svg.name}`)
    removePromises.push(
      fileRef.delete().then(() => {
        return 'File deleted.'
      })
    )

    // 1. delete from /svgs
    removePromises.push(
      svgsRef
        .delete()
        .then(() => {
          return `Document svgsRef successfully deleted!`
        })
        .catch(error => {
          return `Error removing svgsRef document: ${error}`
        })
    )
    // 2. delete from /search
    removePromises.push(
      searchRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          return doc.ref.delete()
        })
      })
    )
    // 3. delete from /filters
    removePromises.push(
      filterRefArray.forEach(filterRef => {
        return filterRef.get().then(querySnapshot => {
          // console.log('querySnapshot', querySnapshot)
          querySnapshot.forEach(doc => {
            return doc.ref.delete()
          })
        })
      })
    )
    return Promise.all(removePromises).then(() => {
      return { id: svg.id, info: `${svg.id} SVG successfully deleted.` }
    })
  }
}
