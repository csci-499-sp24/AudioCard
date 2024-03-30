import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
export const TimerComponent = ({ timeLimit, showTestResult, isFlipped, handleSubmitAnswer, isSpeakMode }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const {isDarkMode} = useDarkMode();

    useEffect(() => {
        let countDown;
        let timer;

        if (timeLimit !== Infinity && !showTestResult && !isFlipped) {
            setTimeLeft(timeLimit); 
            countDown = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    const updatedTimeLeft = prevTimeLeft - 1;
                    return updatedTimeLeft;
                });
            }, 1000);

            timer = setTimeout(() => {
                if (!isSpeakMode){
                handleSubmitAnswer({ preventDefault: () => {} });
                }
            }, timeLimit * 1000);

            return () => {
                clearInterval(countDown);
                clearTimeout(timer);
            };
        } else {
            clearInterval(countDown);
            clearTimeout(timer);
        }
    }, [isFlipped, timeLimit, showTestResult]);

    return (
        <div className='clockContainer d-flex justify-content-center'>
            <div className='timerCircle'>
                <h5>{timeLeft}</h5>
            </div>
            <style jsx>{`
            .timerCircle {
                width: 75px; 
                height: 75px;
                border-radius: 50%; 
                background-color: ${isDarkMode ? '#2e3956' : '#e2e2e2'}; 
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                border: 2px solid ${(timeLeft==0)? 'red': '#FF00FF'}; 
              }
              .timerCircle h5 {
                margin: 0;
            }`}</style>
        </div>
    );
};
