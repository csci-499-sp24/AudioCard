import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const {isDarkMode} = useDarkMode(); 

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsVisible(false); 
    };

    return (
        <div className='container'>
        <button
            className={`back-to-top-btn ${isVisible ? '' : 'hide'}`}
            onClick={handleBackToTop}
        >
            <i className="bi bi-arrow-90deg-up"></i> Back to top
        </button>
        <style jsx>{`
        .back-to-top-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background-color: transparent;
            color: ${isDarkMode? 'white': 'black'}; 
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
        }
        
        .back-to-top-btn:hover {
            color: #0056b3;
        }

        .back-to-top-btn.hide {
            display: none;
        }       
        
        `}</style>
        </div> 
    );
};

export default BackToTopButton;
