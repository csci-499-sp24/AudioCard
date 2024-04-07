import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

const TimerComponent = React.memo(({ timeLimit, showTestResult, isFlipped, handleSubmitAnswer, isSpeakMode, attempts, setAttempts, restartFlag, isPaused }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        let countDown;
        let timer;

        const startTimer = () => {
            if (!isPaused && timeLimit !== Infinity && !showTestResult && !isFlipped) {
                setTimeLeft(timeLimit);
                countDown = setInterval(() => {
                    setTimeLeft(prevTimeLeft => {
                        const updatedTimeLeft = prevTimeLeft - 1;
                        if (updatedTimeLeft < 0) {
                            setTimeLeft(timeLimit);
                            if (!isSpeakMode) {
                                setAttempts(prevAttempts => prevAttempts - 1);
                                handleSubmitAnswer({ preventDefault: () => {} });
                            }
                        }
                        return updatedTimeLeft;
                    });
                }, 1000);

                timer = setTimeout(() => {
                    if (!isSpeakMode) {
                        handleSubmitAnswer({ preventDefault: () => {} });
                    }
                }, timeLeft * 1000);
            }
        };

        const pauseTimer = () => {
            clearInterval(countDown);
            clearTimeout(timer);
        };

        if (!isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }

        return () => {
            clearInterval(countDown);
            clearTimeout(timer);
        };
    }, [isFlipped, timeLimit, showTestResult, isSpeakMode, handleSubmitAnswer, attempts, restartFlag, isPaused]);

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
                    border: 2px solid ${(timeLeft === 0) ? 'red' : '#FF00FF'};
                }
                .timerCircle h5 {
                    margin: 0;
                }
            `}</style>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.timeLimit === nextProps.timeLimit &&
        prevProps.showTestResult === nextProps.showTestResult &&
        prevProps.isFlipped === nextProps.isFlipped &&
        prevProps.isSpeakMode === nextProps.isSpeakMode &&
        prevProps.attempts === nextProps.attempts &&
        prevProps.restartFlag === nextProps.restartFlag &&
        prevProps.isPaused === nextProps.isPaused
    );
});

TimerComponent.displayName = 'TimerComponent';

export default TimerComponent;
