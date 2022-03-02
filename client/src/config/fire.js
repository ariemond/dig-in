import fire from 'firebase';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyA2plNPY-gbGcVN7cvOxDM1Rw14RiRazJc",
  authDomain: "dig-in-9981c.firebaseapp.com",
  databaseURL: "https://dig-in-9981c-default-rtdb.firebaseio.com",
  projectId: "dig-in-9981c",
  storageBucket: "dig-in-9981c.appspot.com",
  messagingSenderId: "442441693550",
  appId: "1:442441693550:web:955913d25e5365c78ae97f",
  measurementId: "G-FSC5E4VPX0"
};

// Initialize Firebase
fire.initializeApp(firebaseConfig);
fire.analytics();

const storage = fire.storage();


export {
  storage, fire as default
}