import React from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { getLanguage } from '@/utils/languageCodes';
import { Tooltip } from 'react-tooltip'

export const ReviewOptions = ({voiceGender, setVoiceGender, language, setLanguage, delay, setDelay, willLoop, setWillLoop, speakingRate, setSpeakingRate, isVoiceCommandsEnabled, setIsVoiceCommandsEnabled}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className='container'>
      <h2>Options</h2>
      <div className ="row flex d-flex align-items-center">
        <div className='col d-flex justify-content-end'>
          <div>Loop?</div>
        </div>
        <div className='col d-flex justify-content-begin'>
          <div className={`form-check form-switch d-flex align-items-center justify-content-center`} onClick={() => setWillLoop(!willLoop)}>
              <input className="form-check-input" type="checkbox" id="toggleWillLoop" checked={willLoop} onChange={() => {}} />
          </div>
      </div>
      </div>
      <div className='row flex d-flex align-items-center mt-2'>
        <div className='col d-flex justify-content-end'>
          <div>Voice Gender:</div>
        </div>
        <div className='col d-flex justify-content-begin dropdown'>
          <button
            className='btn dropdown-toggle'
            style={{ backgroundColor: 'white', color: 'black' }}
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            {voiceGender.charAt(0).toUpperCase() + voiceGender.slice(1).toLowerCase()}
          </button>
          <ul className='dropdown-menu'>
            <li>
              <a className='dropdown-item' onClick={() => setVoiceGender('NEUTRAL')}>
                Neutral
              </a>
            </li>
            <li>
              <a className='dropdown-item' onClick={() => setVoiceGender('MALE')}>
                Male
              </a>
            </li>
            <li>
              <a className='dropdown-item' onClick={() => setVoiceGender('FEMALE')}>
                Female
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='row flex d-flex align-items-center mt-2'>
        <div className='col d-flex justify-content-end'>
          <div>Language:</div>
        </div>
        <div className='col d-flex justify-content-begin dropdown'>
          <button
            className='btn dropdown-toggle'
            style={{ backgroundColor: 'white', color: 'black' }}
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            {getLanguage(language)}
          </button>
          <ul className='dropdown-menu'>
          <li><a className="dropdown-item" onClick={() => setLanguage('en-US')}>English (US)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('en-GB')}>English (UK)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('bn-IN')}>Bengali</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('cmn-CN')}>Chinese (Mandarin)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('fr-FR')}>French</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('ru-RU')}>Russian</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('es-ES')}>Spanish</a></li>
          </ul>
        </div>
      </div>
    <div className='row flex d-flex align-items-center mt-2'>
      <div className='col d-flex justify-content-end'>
        <div>Speaking speed: </div>
      </div>
      <div className='col d-flex justify-content-begin'>
            <input
            className='me-2'
              type="range"
              id="timeLimit"
              name="timeLimit"
              min="0.25"
              max="4.0"
              step="0.25"
              value={speakingRate}
              onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
            />
            <span>{speakingRate}</span>
  </div>
    </div>
     <div className='row flex d-flex align-items-center mt-2'>
      <div className='col d-flex justify-content-end'>
        <div>Delay in seconds:</div>
      </div>
      <div className='col d-flex justify-content-begin dropdown'>
                        <button className="btn dropdown-toggle" style={{ backgroundColor: 'transparent', color: isDarkMode ? 'white' : 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {delay}
                            </button>
                            <ul className="dropdown-menu">
                                {[...Array(10)].map((_, index) => (
                                    <li key={index}><a className="dropdown-item" onClick={(e) => setDelay(index + 1)}>{index + 1}</a></li>
                                ))}
                            </ul>
      </div>
     </div>
     <div className='row flex d-flex align-items-center mt-2'>
        <div className='col-6 d-flex justify-content-end'>
          <div>Voice Commands:</div>
        </div>
        <div className='col d-flex justify-content-begin'>
          <div className={`form-check form-switch d-flex align-items-center justify-content-center`} onClick={() => setIsVoiceCommandsEnabled(!isVoiceCommandsEnabled)}>
                    <input className="form-check-input" type="checkbox" id="toggleTimeLimit" checked={isVoiceCommandsEnabled} onChange={() => {}} />
          </div>
        </div>
        <div className='col d-flex justify-content-begin'>
                    <div>
                    <i className="bi bi-question-circle-fill" 
                    data-tooltip-id="voiceCommandTip"
                    data-tooltip-content="Say &quot;shuffle&quot;, &quot;restart&quot;, or &quot;exit&quot;"
                    data-tooltip-place='bottom'></i>
                    <Tooltip id = "voiceCommandTip" /> 
                    </div>
                </div> 
     </div>
    </div>
  );
};
