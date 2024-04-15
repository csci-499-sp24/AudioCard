import style from '../../styles/flashcardtestmode.module.css';
import Confetti from '../../assets/images/confetti.jpeg';
import Image from 'next/image';
export const TestResults = ({ score, flashcards, handleRestartTest }) => {
    return (
        <div>

            <div className="max-w-sm rounded overflow-hidden shadow-lg" style={{
                backgroundImage: `url(${Confetti.src})`,
                maxWidth: '600px',
                width: '60%',
                margin: '0 auto',
                backgroundSize: 'cover'
                

            }}>
                <div style={{
                    padding: '40px 40px 40px 40px'
                }}>


                    <p className="text-center" style={{ margin: '16px 0 24px 0', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>Congratulations! You have scored</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ height: "200px", width: "200px", fontSize: "26px", borderRadius: '50%', position: 'relative', backgroundColor: '#8b83ea', color: 'white', marginBottom: '24px', boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.5)' }}>

                            <p style={{ fontSize: '48px', position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}>{score}</p>
                            <span style={{ position: 'absolute', left: '50%', bottom: '20%', transform: 'translate(-50%, 0)', fontWeight: 'normal' }}>Out of {flashcards.length}</span>


                        </div>

                    </div>

                    <button className={'btn btn-primary'} style={{ display: 'block', margin: '18px auto 24px auto', color: "white", backgroundColor: '#8b83ea', padding: '8px 16px', width: '250px', fontSize: '24px' }} onClick={handleRestartTest}>Try Again</button>
                </div>
                {/* <div style={{ backgroundColor: '#b1d0fc', color: '#69a1fb', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <p style={{ margin: '0' }}>You took 11 min 59 sec to complete the quiz</p>
                </div> */}

            </div>
        </div>

    )
}