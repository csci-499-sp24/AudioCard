import React, {useState} from 'react';
import axios from 'axios';
import styles from '../styles/CardSet.module.css';
import {useDarkMode} from '../utils/darkModeContext'

export const CreateCardset = ({userId, onCreateCardset, onClickToggle}) => {
    const {isDarkMode} = useDarkMode();
    const [isPublicChecked, setIsPublicChecked] = useState(true);
    const [isFriendsOnly, setIsFriendsOnly] = useState(false);
    const onSubmit = async (event) =>{
        event.preventDefault();
        if (userId){
            const newSetData = {
                title: event.target.title.value,
                subject: event.target.subject.value,
                language: event.target.language.value,
                isPublic: event.target.isPublic.checked,
                isFriendsOnly: isFriendsOnly
            }
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets`, { newSetData });
            onCreateCardset();
            onClickToggle();
        }
    }

    return (
        <div className="mb-5 p-4" style={{ borderRadius: '10px', backgroundColor: isDarkMode ? '#252526':'white', color: isDarkMode? 'white':'black' }}>
            <div className="d-flex justify-content-end">
                <button className="btn" style={{color: isDarkMode ? 'white' : 'gray' }} onClick={onClickToggle}>X</button>
            </div>
            <h5 className="text-center">Create a new card set</h5>

            <form className="row row-cols-lg-auto g-3 mt-2 mb-2 justify-content-center" onSubmit={(e) => onSubmit(e)}>
                <div className="col-12">
                    <label className="visually-hidden" htmlFor="title">Title</label>
                    <div className="input-group">
                        <input type="text" id="title" name="title" className="form-control" placeholder="Title"/>
                    </div>
                </div>

                <div className="col-12">
                    <label className="visually-hidden" htmlFor="subject">Subject</label>
                    <select class="form-select" aria-label="Default select example"id="subject">
                        <option selected>Subject</option>
                        <option value="History">History</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Programming">Programming</option>
                        <option value="Fine Arts">Fine Arts</option>
                        <option value="Foreign Languages">Foreign Languages</option>
                        <option value="Nature">Nature</option>
                        <option value="Humanities">Humanities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="col-12">
                    <label className="visually-hidden" htmlFor="language">Language</label>
                    <select class="form-select" aria-label="Default select example"id="language">
                        <option value="English (US)" selected>English (US)</option>
                        <option value="English (UK)">English (UK)</option>
                        <option value = "Arabic (Standard)">Arabic (Standard)</option>
                        <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
                        <option value="Bengali">Bengali</option>
                        <option value="French">French</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Russian">Russian</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>

                <div className="col-12 d-flex align-items-center">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isPublic" checked={isPublicChecked} onChange={() => setIsPublicChecked(!isPublicChecked)}/>
                        <label className="form-check-label" htmlFor="isPublic">
                            Make publicly viewable?
                        </label>
                    </div>
                </div>

                {isPublicChecked ? (
                    null
            ) : (
                <div className="col-12">
                    <div className='flex flex-row mt-2 mb-2 d-flex align-items-center'>
                        <div className='me-2'><i className="bi bi-lock-fill"></i>:</div>
                        <div className='me-2'>
                            <button
                                className="btn"
                                style={{ backgroundColor: 'white', color: 'black'}}
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {isFriendsOnly ? 'Friends Only' : 'Only Me'} <i className="fas fa-caret-down"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" onClick={() => setIsFriendsOnly(false)}>Only Me</a></li>
                                <li><a className="dropdown-item" onClick={() => setIsFriendsOnly(true)}>Friends Only</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
                <div className="col-12" id={styles.creatBtn}>
                    <button type="submit" className="btn btn-secondary">
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}
