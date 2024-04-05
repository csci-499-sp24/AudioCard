import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';

const Settings = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if (user && !userData) {
            fetchUserData();
        }
        if (username) {
            fetchAvatarUrl();
        }
        return () => unsubscribe();
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

    const fetchAvatarUrl = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setAvatarUrl(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar URL:', error);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('image', selectedFile);
        formData.append('username', username);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('File uploaded successfully:', response.data);
            fetchAvatarUrl();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload Avatar</button>
            </form>
            <div>
                <h2>{username} Avatar</h2>
                {avatarUrl && <img src={avatarUrl} alt="User Avatar" />}
            </div>
        </div>
    );
};

export default Settings;
