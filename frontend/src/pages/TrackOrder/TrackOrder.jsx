import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackOrder.css';

// Fix for default marker icons in react-leaflet in Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Delivery Icon (simulating a live driver dot)
const deliveryIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:tomato; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);'></div>",
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5]
});

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    // Restaurant Coordinates (Simulated: New Delhi)
    const restaurantPos = [28.6139, 77.2090]; 
    
    // User Delivery Coordinates (Simulated: Noida)
    const userPos = [28.5355, 77.3910]; 
    
    const [driverPos, setDriverPos] = useState(restaurantPos);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Simulate driver moving from restaurant to user over time
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 1) {
                    clearInterval(interval);
                    return 1;
                }
                return prev + 0.005; // Adjust speed of movement
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Interpolate live position based on progress
        const lat = restaurantPos[0] + (userPos[0] - restaurantPos[0]) * progress;
        const lng = restaurantPos[1] + (userPos[1] - restaurantPos[1]) * progress;
        setDriverPos([lat, lng]);
    }, [progress]);

    return (
        <div className='track-order'>
            <h2>Live Order Tracking</h2>
            <div className='map-container'>
                <MapContainer center={[28.57, 77.3]} zoom={11} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Restaurant Marker */}
                    <Marker position={restaurantPos}>
                        <Popup>KHAANPAAN Kitchen</Popup>
                    </Marker>
                    
                    {/* Delivery Destination Marker */}
                    <Marker position={userPos}>
                        <Popup>Your Delivery Address</Popup>
                    </Marker>
                    
                    {/* Simulated Path Line */}
                    <Polyline positions={[restaurantPos, userPos]} color="grey" dashArray="5, 10" />
                    
                    {/* Live Driver Dot */}
                    <Marker position={driverPos} icon={deliveryIcon}>
                        <Popup>Delivery Agent is on the way!</Popup>
                    </Marker>
                </MapContainer>
            </div>
            
            <div className='delivery-info'>
                <h3>Order #{orderId?.slice(-6) || "123456"}</h3>
                <p>{progress >= 1 ? "Order Delivered! Enjoy your meal." : "Your food is on the way! Watch the map for live updates."}</p>
                <button onClick={() => navigate('/myorders')} style={{marginTop: '15px', padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Back to Orders</button>
            </div>
        </div>
    );
};

export default TrackOrder;
