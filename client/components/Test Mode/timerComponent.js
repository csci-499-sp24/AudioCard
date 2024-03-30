import React, { useState, useEffect } from 'react';

export const TimerComponent = ({ timeLimit, showTestResult, isFlipped, handleSubmitAnswer, isSpeakMode }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        let countDown;
        let timer;

        if (timeLimit !== Infinity && !showTestResult && !isFlipped) {
            setTimeLeft(timeLimit); 
            countDown = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    const updatedTimeLeft = prevTimeLeft - 1;
                    console.log('Countdown: ', updatedTimeLeft);
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
    }, [isFlipped, timeLimit, showTestResult, handleSubmitAnswer]);

    return (
        <div className='clockContainer d-flex justify-content-center'>
            <div className='row'>
                <h5>{timeLeft}</h5>
            </div>
        </div>
    );
};
