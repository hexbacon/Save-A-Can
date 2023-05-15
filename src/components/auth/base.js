import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcGrRUCkZCmcX3pBiWUISZq1mRVI-_3C4",
  authDomain: "save-a-can.firebaseapp.com",
  projectId: "save-a-can",
  storageBucket: "save-a-can.appspot.com",
  messagingSenderId: "1015971610708",
  appId: "1:1015971610708:web:66ab57fde341f945f7adc1",
  measurementId: "G-TMFNT7T58V"
};
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export default app