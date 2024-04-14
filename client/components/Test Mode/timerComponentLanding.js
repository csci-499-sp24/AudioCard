import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from '../../styles/timerComponentLanding.module.css';

const TimerComponentLanding = React.memo(({ timeLimit, showTestResult, isFlipped, handleSubmitAnswer, isSpeakMode, attempts, setAttempts, restartFlag, isPaused }) => {
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
            {
                !showTestResult ?
                <div className='timerCircle' id={styles.countDown}>
                    <h5 id={styles.countDownNumber}>{timeLeft}</h5>
                </div> :
                <div></div>
            }
            
            <style jsx>{`
                .timerCircle {
                    color: ${(timeLeft <= 3) ? 'rgb(218 12 12 / 13%)' : 'rgb(149 149 149 / 13%)'};
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

TimerComponentLanding.displayName = 'TimerComponentLanding';

export default TimerComponentLanding;
