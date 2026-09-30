import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBnq_293PX85DyyR-v3DRODev4ELmOJX54",
  authDomain: "ch-intalaciones.firebaseapp.com",
  projectId: "ch-intalaciones",
  storageBucket: "ch-intalaciones.firebasestorage.app",
  messagingSenderId: "23098712267",
  appId: "1:23098712267:web:70d3e6419cb0328493fb4e",
  measurementId: "G-21GFZBDJJ9",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

isSupported().then((yes) => yes && getAnalytics(app))
