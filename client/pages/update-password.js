import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { getAuth, updatePassword } from "firebase/auth";
import Navbar from '@/components/Navbar/Navbar';
import { useDarkMode } from '../utils/darkModeContext';
import styles from '../styles/settings.module.css';

const UpdatePassword = () => {
    const [username, setUsername] = useState('');
    const [currentPassword, setcurrentPassword] = useState('');
    const [updatedPassword, setupdatedPassword] = useState('');
    const [updatedPasswordRef, setPasswordRef] = useState('');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const { isDarkMode } = useDarkMode();

    const closeModal = () => {
        setEditorOpen(false);
        setSelectedFile(null);
        setScaleValue(1);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            await updatePassword(user, currentPassword, updatedPassword, updatedPasswordRef).then(() => {
                axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/changePassword`, { currentPassword, updatedPassword, updatedPasswordRef })
            });

            console.log('Password updated successfully');
        } catch (error) {

        }
    };

    return (
        <div>

        </div>
    );
};

export default UpdatePassword;