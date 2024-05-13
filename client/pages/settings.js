import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import AvatarChangeModal from '../components/AvatarChangeModal';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { useDarkMode } from '../utils/darkModeContext';
import styles from '../styles/settings.module.css';
import { AuthContext } from  "../utils/authcontext"
import  { useContext } from 'react';

const Settings = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [username, setUsername] = useState('');
    const user = useContext(AuthContext).user;
    const [userData, setUserData] = useState(null);
    const [userAvatar, setUserAvatar] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [scaleValue, setScaleValue] = useState(1);
    const { isDarkMode } = useDarkMode();
    const [prefLanguage, setPrefLanguage] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(prefLanguage);
    const languages = [
        { name: 'English (US)' },
        { name: 'English (UK)' },
        { name: 'French' },
        { name: 'Spanish' },
        { name: 'Bengali' },
        { name: 'Chinese (Mandarin)' },
        { name: 'Russian' },
        { name: 'Hindi', },
        { name: 'Arabic (Standard)' },
        { name: 'Portuguese' }
    ];


    const closeModal = () => {
        setEditorOpen(false);
        setSelectedFile(null);
        setScaleValue(1);
    };


    const handleAvatarChangeClick = () => {
        const fileInput = document.getElementById('avatarUploadInput');
        fileInput.value = '';
        fileInput.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setEditorOpen(true);
    };


    useEffect(() => {
        if (user && !userData) {
            fetchUserData();
        }
        if (username) {
            fetchUserAvatar();
        }
    }, [user, userData, username]);


    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
            setUsername(userData.username);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const fetchUserAvatar = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setUserAvatar(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar URL:', error);
        }
    };

    useEffect(() => {
        const fetchPreferredLanguage = async () => {
            if (userData) {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userData.id}/prefLanguage`);
                const prefLanguage = response.data.prefLanguage;
                setPrefLanguage(prefLanguage || "No preferred language");
                setSelectedLanguage(prefLanguage || ''); 
            }
        };
    
        fetchPreferredLanguage();
    }, [userData]);

    //API call to PUT the avatar image in S3
    const handleSaveAvatar = async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'avatar.jpg');
        formData.append('username', username);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('Avatar uploaded successfully:', response.data);
            closeModal();
            fetchUserAvatar(); //fetch user avatar after uploading
        } catch (error) {
            console.error('Avatar upload failed:', error);
        }
    };

    const updatePreferredLanguage = async () => {
        const newPreferredLanguage = selectedLanguage || null;  
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userData.id}/prefLanguage`, {
                prefLanguage: newPreferredLanguage
            });
            setPrefLanguage(newPreferredLanguage || "No preferred language");
        } catch (error) {
            console.error('Error updating preferred language:', error);
        }
    };

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };

    const handleLanguageSelection = (event) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={userData?.id} />

            <div class="container min-vh-100 d-flex flex-column">
                <div class="row flex-grow-1 px-2 mb-5 mt-5">
                    <div class="col mb-5">
                        <div className="row flex-column mb-5 h-100" id={`${isDarkMode ? styles.settingsInfoColDark : styles.settingsInfoColLight}`}>
                            <div id={styles.profileInfoContainer}>
                                <div className="text-center">
                                    <h4 className='mt-4 mb-3'>Account Settings</h4>
                                </div>

                                <div className='form-group row mt-5' >
                                    <label class="col-sm-2 col-form-label">Profile Picture</label>
                                    <div class="col-sm-10">
                                        <AvatarChangeModal
                                            isOpen={editorOpen}
                                            onClose={closeModal}
                                            imageSrc={selectedFile ? URL.createObjectURL(selectedFile) : null}
                                            onSave={handleSaveAvatar}
                                            username={username}
                                            isDarkMode={isDarkMode}
                                        />
                                        <div>
                                            <img src={userAvatar} alt="User Avatar" onError={setDefaultAvatar} className={styles.avatarImage} />
                                            <input
                                                id="avatarUploadInput"
                                                type="file"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                            <button onClick={handleAvatarChangeClick} className={`${isDarkMode ? "btn btn-outline-light" : "btn btn-outline-dark"}`}
                                            id={styles.buttonRightAction}>
                                                Change Profile Picture
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <hr/>

                                <div class="form-group row mt-3" >
                                    <label class="col-sm-2 col-form-label">Username</label>
                                    <div class="col-sm-10">
                                        <div>
                                            <button className={`${isDarkMode ? "btn btn-outline-light" : "btn btn-outline-dark"}`}>   
                                                <Link href="/update-username" id={`${isDarkMode ? styles.linkBtnDark : styles.linkBtnLight}`}>
                                                    Change Username
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <hr/>

                                <div class="form-group row mt-3" >
                                    <label class="col-sm-2 col-form-label">Password</label>
                                    <div class="col-sm-10">
                                        <div>
                                            <button className={`${isDarkMode ? "btn btn-outline-light" : "btn btn-outline-dark"}`}>
                                                <Link href="/update-password" id={`${isDarkMode ? styles.linkBtnDark : styles.linkBtnLight}`}>
                                                    Change Password
                                                </Link>    
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <hr/>

                                <div class="form-group row mt-3" >
                                    <label class="col-sm-2 col-form-label">Language</label>
                                    <div class="col-sm-10">
                                        <select value={selectedLanguage} onChange={handleLanguageSelection} className={styles.selectDropdown}>
                                            <option value="">No preferred language</option>
                                            {languages.map(lang => (
                                                <option key={lang.code} value={lang.name}>{lang.name}</option>
                                            ))}
                                        </select>

                                        <button className={`${isDarkMode ? "btn btn-outline-light" : "btn btn-outline-dark"}`} id={styles.buttonRightAction} onClick={updatePreferredLanguage}>
                                            Change Language
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
