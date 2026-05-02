import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { auth, googleProvider, signInWithPopup } from '../../config/firebase'

const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        otp: ""
    })

    const [otpSent, setOtpSent] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            const response = await axios.post(url + "/api/user/google-login", {
                email: user.email,
                name: user.displayName,
                photo: user.photoURL
            });

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            alert("Google Sign-In failed. Please try again.");
        }
    };

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
        if (currState === "Login") {
            newUrl += "/api/user/login"
        }
        else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token)
            setShowLogin(false)
        }
        else {
            alert(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={currState === "Email OTP" ? (otpSent ? onVerifyOtp : onSendOtp) : onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <img className="close-icon" onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    <img className="main-logo" src={assets.logo} alt="KHAANPAAN" />
                    <h2>Welcome to KHAANPAAN</h2>
                    <p>Login to continue accessing personalized food insights.</p>
                </div>

                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required />
                    )}

                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required disabled={otpSent} />

                    {currState === "Email OTP" ? (
                        otpSent && (
                            <input name='otp' onChange={onChangeHandler} value={data.otp} type="text" placeholder='6-digit OTP' required />
                        )
                    ) : (
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                    )}
                </div>

                <button type='submit' className="main-btn">
                    {currState === "Email OTP" ? (otpSent ? "Verify OTP" : "Send OTP") : (currState === "Sign Up" ? "Create account" : "Login")}
                </button>

                {currState !== "Email OTP" && (
                    <>
                        <div className="separator">OR</div>
                        <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                            Continue with Google
                        </button>
                    </>
                )}

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>

                <div className="login-popup-footer">
                    {currState === "Email OTP" ? (
                        <p><span onClick={() => { setCurrState("Login"); setOtpSent(false); }}>Use Password?</span></p>
                    ) : (
                        <div className="footer-links">
                            <span onClick={() => alert("Password reset link sent (Demo)")}>Forgot Password?</span>
                            <span onClick={() => setCurrState("Email OTP")}>Login with OTP</span>
                            {currState === "Login"
                                ? <span onClick={() => setCurrState("Sign Up")}>Create account</span>
                                : <span onClick={() => setCurrState("Login")}>Login here</span>
                            }
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPopup