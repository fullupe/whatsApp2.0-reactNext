import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBz_x_VTMPkXEPxam6F4kskaT6nPnsL4Rk",
    authDomain: "whatsapp-2-d4770.firebaseapp.com",
    projectId: "whatsapp-2-d4770",
    storageBucket: "whatsapp-2-d4770.appspot.com",
    messagingSenderId: "240556417395",
    appId: "1:240556417395:web:f1707d997d83c46dd76506"
  };

  const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };