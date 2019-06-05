//import { firebaseDb } from '../helpers/firebaseConfig'
// const functions = require('firebase-functions')
// const MAX_LOG_COUNT = 1

import { database } from '../plugins/firebase.js'

/**
 * Check if username already exists. Used on registration page.
 * @returns {String}
 */
/*
export function checkIfUserExists(userId) {
  console.log('firebaseDb reffy', firebaseDb)
  const error = { message: 'Username already exists. Choose another one.' }
  return firebaseDb
    .collection('usernames')
    .doc(userId)
    .get()
    .then(
      snapshot => {
        if (snapshot.exists) {
          throw error
        }
        return snapshot.exists
      },
      error => {
        return error
      }
    )
}
*/

/**
 * Get Firebase UID Key from Username
 * @returns { String, Boolean }
 */
/*
export function getUidFromUsername(username) {
  const usersRef = firebaseDb.ref('/usernames/' + username)
  if (!username) {
    return false
  }
  return usersRef.once('value').then(
    snapshot => {
      return snapshot.val()
    },
    error => {
      return error.message
    }
  )
}
*/

/**
 * Updates username / id mapping
 * @returns { Boolean }
 */
/*
export function updateUsernameMapping(username, id) {
  const docRef = firebaseDb.collection('usernames').doc(id)
  return docRef
    .set({
      username: username
    })
    .then(response => {
      console.log('username Document successfully written!')
      return response
    })
    .catch(error => {
      console.error('Error writing username document:', error)
      return error
    })
}
*/

/**
 * get username from id
 * @returns { String }
 */
/*
export function getUsernameFromId(id) {
  const docRef = firebaseDb.collection('usernames').doc(id)
  return docRef
    .get()
    .then(doc => {
      return doc.data().username
    })
    .catch(error => {
      return Error(error.code + error.message)
    })
}
*/

/**
 * Moves Firebase node to new location
 * Thanks to: https://gist.github.com/katowulf/6099042
 * @returns { Boolean }
 */
/*
export function moveFbRecord(oldRef, newRef) {
  return oldRef.once('value', snap => {
    console.log('snap.val()', snap.val())
    newRef.set(snap.val(), error => {
      if (!error) {
        return oldRef.remove()
      } else if (typeof console !== 'undefined' && console.error) {
        console.error(error)
      }
    })
  })
}
*/

/**
 * Retreives a list of files names by passing array of ids.
 * @params Array
 * @returns Array
 */
export function getSvgReferences(svgIds) {
  let svgs = []
  const svgPromises = []
  svgIds.forEach(svg => {
    const svgRef = database.collection('svgs').doc(svg)
    svgPromises.push(
      svgRef
        .get()
        .then(doc => {
          if (doc.exists) {
            svgs.push({
              ...doc.data(),
              id: doc.id
            })
          } else {
            // console.log('No such document!')
          }
        })
        .catch(error => {
          //console.log('Error getting document:', error)
        })
    )
  })
  return Promise.all(svgPromises).then(() => {
    return svgs
  })
}

/**
 * Creates a set-like Object structure from a string. Inspired by this Stack Overflow answer: https://stackoverflow.com/a/46570555/1657678
 * @params String
 * @returns Object
 */
export function createSearchTerms(description) {
  const searchArray = description.split(/\s*\-\s*/g)
  let searchObject = {}
  searchArray.forEach(item => {
    searchObject[item] = true
  })
  return searchObject
}

/*
export const monthNames = () => [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
*/
