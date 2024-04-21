import { useRouter } from 'next/router';
import { useDarkMode } from '../../utils/darkModeContext';
import style from '../../styles/flashcardtestmode.module.css';
import Confetti from '../../assets/images/confetti.jpeg';
import Image from 'next/image';

export const TestResults = ({ score, flashcards, handleRestartTest }) => {
    const { isDarkMode } = useDarkMode();
    const router = useRouter() 
    const cardsetId = router.query.id;

    return (
        <div className='row justify-content-center pb-5' id={style.testResultContainer}>
            <div class="card" id={isDarkMode ? style.resultCardDark : style.resultCard}>
                <div className="text-center" id={isDarkMode ? style.testResultDataDark : style.testResultDataLight}>
                    <h2 className={isDarkMode ? 'card-title text-light' : 'card-title text-dark'}>Quiz compeleted!</h2>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ height: "200px", width: "200px", fontSize: "26px", borderRadius: '50%', position: 'relative', backgroundColor: '#8b83ea', color: 'white', marginBottom: '24px', boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.5)' }}>
                            <p style={{ fontSize: '48px', position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}>{score}</p>
                            <span style={{ position: 'absolute', left: '50%', bottom: '20%', transform: 'translate(-50%, 0)', fontWeight: 'normal' }}>Out of {flashcards.length}</span>
                        </div>
                    </div>
                </div>

                <div class="card-body text-center">                       
                        <div class="container">
                            <div class="row py-4">
                                <div class="col">
                                    <div class="d-flex flex-row justify-content-center py-2" id={style.testResultItem}>
                                        <span id={style.testCompletion}>{(score/flashcards.length).toFixed(2) * 100}%</span>
                                        <div>Completion</div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="d-flex flex-row justify-content-center py-2" id={style.testResultItem}>
                                        <span id={style.testQuestions}>{flashcards.length}</span>
                                        <div>Total Questions</div>
                                    </div>
                                </div>
                                <div class="w-100"></div>
                                <div class="col">
                                    <div class="d-flex flex-row justify-content-center py-2" id={style.testResultItem}>
                                        <span id={style.testCorrect}>{score}</span>
                                        <div>Correct</div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="d-flex flex-row justify-content-center py-2" id={style.testResultItem}>
                                        <span id={style.testWrong}>{flashcards.length - score}</span>
                                        <div>Wrong</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex flex-column py-4">
                            <button className={'btn btn-primary'} id={style.testTryButton}
                                onClick={handleRestartTest}
                            >
                                Try Again
                            </button>

                            <button className={'btn btn-outline-primary'} id={style.testFinishButton}
                                onClick={() => router.push(`/cardsets/${cardsetId}`)}
                            >
                                Finish Quiz
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}
