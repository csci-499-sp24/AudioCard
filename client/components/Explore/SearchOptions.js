import React from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

export const SearchOptions = ({ changeSearchTopic, changeSearchBy, searchTopic, searchBy, onSortChange, sortingBy }) => {
    const {isDarkMode} = useDarkMode();

    const onClickTopic = (e, topic) => {
        e.preventDefault();
        changeSearchTopic(topic);
    }
    
  return (
    <div className='container'>
        <div className='row d-flex align-items-center'>
            <div className="col-sm-6 col-md-4 col-lg-10 mb-2">
                <div className='d-flex mb-4'>
                    <div className='d-flex form-inline col-lg-2'>
                        {searchTopic ===  'card sets' ? <button type="button" className="btn btn-primary me-2" onClick={(e) => onClickTopic(e, 'users')}>Card Sets</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={(e) => onClickTopic(e, 'card sets')}>Card Sets</button>}
                        {searchTopic ===  'users' ? <button type="button" className="btn btn-primary me-2" onClick={(e) => onClickTopic(e, 'card sets')}>Users</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={(e) => onClickTopic(e, 'users')}>Users</button>}
                    </div>
                    <div className="vertical-line mx-2 me-4" />
                    {searchTopic === 'card sets' && 
                    <div className='d-flex form-inline col-lg-4'>
                        {searchBy ===  'title' ? <button type="button" className="btn btn-primary me-2" onClick={() => changeSearchBy('title')}>Title</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={() => changeSearchBy('title')}>Title</button>}
                        {searchBy ===  'creator' ? <button type="button" className="btn btn-primary me-2" onClick={() => changeSearchBy('title')}>Creator</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={() => changeSearchBy('creator')}>Creator</button>}
                    </div>
                    }
                    {searchTopic === 'users' && 
                    <div className='d-flex form-inline col-lg-4'>
                        {searchBy ===  'username' ? <button type="button" className="btn btn-primary me-2" onClick={() => changeSearchBy('email')}>Username</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={() => changeSearchBy('username')}>Username</button>}
                        {searchBy ===  'email' ? <button type="button" className="btn btn-primary me-2" onClick={() => changeSearchBy('username')}>Email</button>
                        : <button type="button" className="btn btn-secondary me-2" onClick={() => changeSearchBy('email')}>Email</button>}
                    </div>
                    }
                </div>
            </div>
            <div className="col d-flex justify-content-end align-self-begin">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {sortingBy.length > 0 ? sortingBy : "Sort By..."}
                </button>
                <ul className="dropdown-menu">
                    {searchTopic === 'card sets' && <div>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'flashcardCount')}>Flashcard count</a></li>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'creationNewest')}>Newest first</a></li>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'creationOldest')}>Oldest first</a></li>
                    </div> }
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'alphabeticalOrder')}>Alphabetical order</a></li>
                </ul>
            </div>
        </div>
        <style jsx>
            {`
            .vertical-line {
                border-left: 1px solid black;
            }`}
        </style>
    </div>
    )
}