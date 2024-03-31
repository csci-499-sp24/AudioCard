import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import next from 'next';

const TimerComponent = React.memo(({ timeLimit, showTestResult, isFlipped, handleSubmitAnswer, isSpeakMode, attempts, setAttempts}) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        let countDown;
        let timer;

        if (timeLimit !== Infinity && !showTestResult && !isFlipped) {
            setTimeLeft(timeLimit);
            countDown = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    const updatedTimeLeft = prevTimeLeft - 1;
                    if (updatedTimeLeft < 0) {
                        setTimeLeft(timeLimit);
                        if (!isSpeakMode){
                            setAttempts(prevAttempts => prevAttempts - 1);
                            handleSubmitAnswer({ preventDefault: () => { } });
                        } 
                    }
                    return updatedTimeLeft;
                });
            }, 1000);

            timer = setTimeout(() => {
                if (!isSpeakMode) {
                    handleSubmitAnswer({ preventDefault: () => { } });
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
    }, [isFlipped, timeLimit, showTestResult, isSpeakMode, handleSubmitAnswer, attempts]);

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
                border: 2px solid ${(timeLeft == 0) ? 'red' : '#FF00FF'}; 
              }
              .timerCircle h5 {
                margin: 0;
            }`}</style>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.timeLimit === nextProps.timeLimit &&
        prevProps.showTestResult === nextProps.showTestResult &&
        prevProps.isFlipped === nextProps.isFlipped &&
        prevProps.isSpeakMode === nextProps.isSpeakMode && 
        prevProps.attempts == nextProps.attempts
    );
});

TimerComponent.displayName = 'TimerComponent';

export default TimerComponent;
