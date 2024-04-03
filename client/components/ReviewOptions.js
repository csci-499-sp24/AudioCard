import React from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { getLanguage } from '@/utils/languageCodes';

export const ReviewOptions = ({voiceGender, setVoiceGender, language, setLanguage}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className='container'>
      <h2>Options</h2>
      <div className='row flex d-flex align-items-center'>
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
      <div className='row flex d-flex align-items-center mt-3'>
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
            <li>
              <a className='dropdown-item' onClick={() => setLanguage('en-US')}>
                English (US)
              </a>
            </li>
            <li>
              <a className='dropdown-item' onClick={() => setLanguage('en-GB')}>
                English (UK)
              </a>
            </li>
            <li>
              <a className='dropdown-item' onClick={() => setLanguage('fr-FR')}>
                French
              </a>
            </li>
            <li>
              <a className='dropdown-item' onClick={() => setLanguage('es-ES')}>
                Spanish
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
