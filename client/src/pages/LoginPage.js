import React, {useState,useEffect} from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);
let user;

const LoginPage = () => {
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")


    const onSubmit = async (event) => {
        console.log("EVENT", event.target)
        event.preventDefault()

        signInWithEmailAndPassword(auth, Email, Password)
        .then((userCredential) => {
          // Signed in 
          user = userCredential.user;
            auth.onAuthStateChanged(() => {
            if (user.emailVerified) {
                console.log('User is logged in!');
            } else {
              auth.signOut().then(() => console.log('User signed out!'));
            }
          })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
    }

    const handleOnchnage = (e) => {
        switch (e.target.id) {
            case "FirstName":
                setFirstName(e.target.value)
                break;
            case "LastName":
                setLastName(e.target.value)
                break;
            case "Email":
                setEmail(e.target.value)
                break;
            default:
                setPassword(e.target.value)
                break;
        }
    }

    useEffect(() => {
        if (localStorage.getItem("userId")) {
            window.location.href = "/"
        }
    },[])

    return (
        <div className='SignUpPage container'>
            <div className="redSide">
                <div id="signUpDiv1">
                   <h1>Login</h1>
               </div>
               <form onSubmit={onSubmit}>
                   {/* <input onChange={handleOnchnage} type="text" id="FirstName" name="signUpFirstName" placeholder='First Name'/> */}
                   {/* <input onChange={handleOnchnage} type="text" id="LastName" name="signUpLastName" placeholder='Last Name'/> */}
                   <input onChange={handleOnchnage} type="email" id="Email" name="signUpEmail" placeholder='Email'/>
                   <input onChange={handleOnchnage} type="password" id="Password" name="signUpPassword" placeholder='Password'/>
                   <a href='/sign-up' style={{textAlign: "end", width: "100%", paddingRight: 30}}>Sign Up</a>
                   <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    );
}
  
export default LoginPage;