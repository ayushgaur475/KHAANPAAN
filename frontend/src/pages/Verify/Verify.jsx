import React, { useEffect, useContext } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

function Verify() {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async ()=> {
        try {
            const response = await axios.post(url + "/api/order/verify", {success, orderId})
            if(response.data.success){
                // Redirect directly to the live tracking page for this order
                navigate(`/track/${orderId}`);
            }
            else{
                // If payment cancelled, go back to checkout page
                navigate("/order")
            }
        } catch (error) {
            console.error("Verification error:", error);
            navigate("/");
        }
    }

    useEffect(() => {
       verifyPayment();
    },[])

    return (
        <div className='verify'>
            <div className='spinner'></div>
            <p>Verifying your payment, please wait...</p>
        </div>
    )
}

export default Verify
