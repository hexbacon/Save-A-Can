import React, {useState,useEffect} from 'react'
import axios from "axios"


//Set up state to hold the user's sign-up information:
const SignUpPage = (props) => {
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onSubmit = async (event) => {
        console.log("EVENT", event.target)
        event.preventDefault()
     // prevent the default form submission behavior

     // make a POST request to backend API with the sign-up data
       await axios.post("http://localhost:8080/api/users", {
            FirstName, 
            LastName, 
            Email, 
            Password
        }).then(res => { // handle the response
            if (!res.data.error) {
                localStorage.setItem("userId", res.data.user.id)
                window.location.href = "/"
            }
            console.log(res.data)
        }).catch(err=> { // handle any errors
            console.log('====================================')
            console.log(err.toString())
            console.log('====================================')
        })
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
                   <h1>Create Account</h1>
               </div>
               <form onSubmit={onSubmit}>
                   <input onChange={handleOnchnage} type="text" id="FirstName" name="signUpFirstName" placeholder='First Name'/>
                   <input onChange={handleOnchnage} type="text" id="LastName" name="signUpLastName" placeholder='Last Name'/>
                   <input onChange={handleOnchnage} type="email" id="Email" name="signUpEmail" placeholder='Email'/>
                   <input onChange={handleOnchnage} type="password" id="Password" name="signUpPassword" placeholder='Password'/>
                   <a href='/login' style={{textAlign: "end", width: "100%", paddingRight: 30}}>Login</a>

                   <button>Sign Up</button>
                </form>
            </div>
        </div>
    );
}
  
export default SignUpPage;