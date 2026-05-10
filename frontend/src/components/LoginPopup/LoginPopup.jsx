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
        password: ""
    })

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
            <div className="login-popup-card">
                <div className="login-popup-left">
                    <img src={assets.login_bg} alt="Delicious Food" />
                    <div className="img-overlay">
                        <h3>Join the Food Revolution</h3>
                        <p>Order your favorite meals and track them in real-time.</p>
                    </div>
                </div>
                <form onSubmit={onLogin} className="login-popup-right">
                    <div className="login-popup-title">
                        <img className="close-icon" onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                        <img className="main-logo" src={assets.logo} alt="KHAANPAAN" />
                        <h2>{currState === "Login" ? "Welcome Back" : "Create Account"}</h2>
                        <p>Unlock personalized food recommendations and faster checkout.</p>
                    </div>

                    <div className="login-popup-inputs">
                        {currState === "Sign Up" && (
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Full Name' required />
                        )}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' required />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                    </div>

                    <button type='submit' className="main-btn">
                        {currState === "Sign Up" ? "Get Started" : "Login to KhaanPaan"}
                    </button>

                    <div className="separator">OR</div>
                    <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        Continue with Google
                    </button>

                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>I agree to the <span>Terms & Privacy Policy</span></p>
                    </div>

                    <div className="login-popup-footer">
                        {currState === "Login"
                            ? <p>New to KhaanPaan? <span onClick={() => setCurrState("Sign Up")}>Create account</span></p>
                            : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPopup