import React from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

export const SearchLimiters = ({ changeSearchBy, searchTopic, searchBy }) => {
    const {isDarkMode} = useDarkMode();

    const RadioDiv = (label) => {
        const labelLower = label.toLowerCase();
        return (
        <div className='d-flex form-inline form-check mx-2 fs-5'>
            <input className="form-check-input" type="radio" onClick={() => changeSearchBy(labelLower)} checked={searchBy === labelLower}/>
            <label className="form-check-label mx-2" onClick={() => changeSearchBy(labelLower)}>
                {label}
            </label>
            <style jsx>{`
                .form-check-input:checked {
                    background-color: #007bff;
                    border-color: #007bff;
                }
            `}</style>
        </div>
        )
    }
    
  return (
        <div className='d-flex align-items-center'>
            <div className='d-flex'>
            {searchTopic === 'users' && 
                <div className='d-flex'>
                    {RadioDiv("Username")}
                    {RadioDiv("Email")}
                </div>
            }
            </div>
            <div className='d-flex'>
            {searchTopic === 'card sets' && 
                <div className='d-flex'>
                    {RadioDiv("Title")}
                    {RadioDiv("Creator")}
                </div>
            }
            </div>


    </div>
    
    )
}