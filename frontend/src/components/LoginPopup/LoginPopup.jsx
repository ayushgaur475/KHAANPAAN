import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

  const {url,setToken} = useContext(StoreContext)


  const [currState,setCurrState] = useState("Login")
  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    otp:""
  })

  const [otpSent, setOtpSent] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }


  const onSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!data.email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      const response = await axios.post(url + "/api/user/send-otp", { email: data.email });
      if (response.data.success) {
        setOtpSent(true);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error sending OTP.");
    }
  }

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/user/verify-otp", {
        email: data.email,
        otp: data.otp
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Invalid OTP. Please try again.");
    }
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currState==="Login"){
      newUrl += "/api/user/login"
    }
    else{
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl,data);

    if (response.data.success){
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token)
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }

  }

  return (
    <div className='login-popup'>
        <form onSubmit={currState === "Email OTP" ? (otpSent ? onVerifyOtp : onSendOtp) : onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
          </div>
          <div className="login-popup-inputs">
            {currState==="Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required/>}
            
            {currState === "Email OTP" ? (
              <>
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required disabled={otpSent} />
                {otpSent && (
                  <input name='otp' onChange={onChangeHandler} value={data.otp} type="text" placeholder='6-digit OTP' required />
                )}
              </>
            ) : (
              <>
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required/>
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required/>
              </>
            )}
          </div>
          <button type='submit'>
            {currState === "Email OTP" ? (otpSent ? "Verify OTP" : "Send OTP") : (currState === "Sign Up" ? "Create account" : "Login")}
          </button>
          <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p className='continuee'>By continuing, i agree to the terms of use & privacy policy</p>
          </div>
          {currState === "Email OTP" ? (
            <p>Use Password? <span onClick={() => {setCurrState("Login"); setOtpSent(false);}}>Click here</span></p>
          ) : (
            <>
              <p>Login with OTP? <span onClick={() => setCurrState("Email OTP")}>Click here</span></p>
              {currState==="Login"
              ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
              :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
              }
            </>
          )}
        </form>
    </div>
  )
}

export default LoginPopup