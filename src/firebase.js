import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD2whdIYR0QlMrYS4ASEyRCZXPHLfSFQCc",
  authDomain: "miaumass.firebaseapp.com",
  projectId: "miaumass",
  storageBucket: "miaumass.firebasestorage.app",
  messagingSenderId: "987929718658",
  appId: "1:987929718658:web:274ac9bc8bf2f911bf299b"
}


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)