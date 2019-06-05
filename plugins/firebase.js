import Vue from 'vue'

import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

Vue.use(firebase)

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDSi-o6KZtFoWsYNGmAP2OGmxQHshlLSQM",
    authDomain: "media-kits.firebaseapp.com",
    databaseURL: "https://media-kits.firebaseio.com",
    projectId: "media-kits",
    storageBucket: "media-kits.appspot.com",
    messagingSenderId: "1032592903166",
    appId: "1:1032592903166:web:f236762631dd534a"
  })
}
const storage = firebase.storage()
const auth = firebase.auth()
const database = firebase.firestore()

export { firebase, storage, auth, database }