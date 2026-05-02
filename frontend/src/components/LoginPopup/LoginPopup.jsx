import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { auth, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from '../../config/firebase'

const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "", // Added phone
        otp: ""
    })

    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null); // Firebase confirmation object

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onCaptchaVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    onSendOtp();
                }
            });
        }
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
        if (!data.phone) {
            alert("Please enter your phone number first.");
            return;
        }

        // Ensure number has country code (Default to +91 for India if not present)
        let formattedPhone = data.phone;
        if (!formattedPhone.startsWith("+")) {
            formattedPhone = "+91" + formattedPhone;
        }

        try {
            onCaptchaVerify();
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            alert("OTP sent successfully!");
        } catch (error) {
            console.error("Phone OTP Error:", error);
            alert("Failed to send OTP. " + error.message);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    }

    const onVerifyOtp = async (e) => {
        e.preventDefault();
        if (!data.otp || !confirmationResult) {
            alert("Please enter the OTP.");
            return;
        }

        try {
            const result = await confirmationResult.confirm(data.otp);
            const user = result.user;

            // Send phone info to backend to get JWT token
            const response = await axios.post(url + "/api/user/phone-login", {
                phone: user.phoneNumber,
                uid: user.uid
            });

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Verification Error:", error);
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
            <form onSubmit={currState === "Phone OTP" ? (otpSent ? onVerifyOtp : onSendOtp) : onLogin} className="login-popup-container">
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

                    {currState === "Phone OTP" ? (
                        <>
                            <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number (e.g. 9876543210)' required disabled={otpSent} />
                            {otpSent && (
                                <input name='otp' onChange={onChangeHandler} value={data.otp} type="text" placeholder='6-digit OTP' required />
                            )}
                            <div id="recaptcha-container"></div>
                        </>
                    ) : (
                        <>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                        </>
                    )}
                </div>

                <button type='submit' className="main-btn">
                    {currState === "Phone OTP" ? (otpSent ? "Verify OTP" : "Send OTP") : (currState === "Sign Up" ? "Create account" : "Login")}
                </button>

                {currState !== "Phone OTP" && (
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
                    {currState === "Phone OTP" ? (
                        <p><span onClick={() => { setCurrState("Login"); setOtpSent(false); }}>Use Password?</span></p>
                    ) : (
                        <div className="footer-links">
                            <span onClick={() => alert("Password reset link sent (Demo)")}>Forgot Password?</span>
                            <span onClick={() => setCurrState("Phone OTP")}>Login with OTP</span>
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