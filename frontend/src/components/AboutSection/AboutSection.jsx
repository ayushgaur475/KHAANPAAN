import React, { useEffect, useRef, useState } from 'react'
import './AboutSection.css'
import { assets } from '../../assets/assets'

const Counter = ({ target, duration, isVisible, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = parseInt(target.replace(/,/g, ''));
        if (start === end) return;

        let totalMilisecondsChildTen = duration / end;
        let timer = setInterval(() => {
            start += Math.ceil(end / 100);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [isVisible, target, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

const AboutSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section className={`about-section ${isVisible ? 'visible' : ''}`} ref={sectionRef}>
            <div className="about-floating-elements">
                <svg className="twisted-thread" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <path 
                        d="M0,200 C200,100 300,500 500,400 C700,300 800,700 1000,600 M1000,100 C800,200 700,-100 500,100 C300,300 200,0 0,150" 
                        className="thread-path"
                    />
                </svg>
            </div>

            <div className="about-content">
                <h2 className="about-title">Swaad Jo Dil Jeet Le, <br /><span>Khaanpaan Sabke Liye!</span></h2>
                <p className="about-description">
                    Humara mission hai lazeez aur fresh khaana har kisi tak pahunchana. 
                    Pichle ek dashak se humne lakhon logon ko naye swaad se rubaru karvaya hai, 
                    wo bhi seedha unke ghar ke darwaze tak. 
                </p>
                <div className="about-description-sub">
                    Behtareen taste, fast delivery aur aapka bharosa - yahi hai Khaanpaan ki pehchan.
                </div>
            </div>

            <div className="stats-container">
                <div className="stat-item">
                    <div className="stat-icon">🏪</div>
                    <div className="stat-info">
                        <h3><Counter target="150" duration={2000} isVisible={isVisible} suffix="+" /></h3>
                        <p>Restaurants</p>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-icon">📍</div>
                    <div className="stat-info">
                        <h3><Counter target="10" duration={2000} isVisible={isVisible} suffix="+" /></h3>
                        <p>Cities</p>
                    </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3><Counter target="5000" duration={2000} isVisible={isVisible} suffix="+" /></h3>
                        <p>Orders Delivered</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
