import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import AvatarChangeModal from '../components/AvatarChangeModal';

const Settings = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [editorOpen, setEditorOpen] = useState(false); 
    const [scaleValue, setScaleValue] = useState(1); 

    const avatarEditorRef = useRef(null);

    const closeModal = () => {
        setEditorOpen(false);
        setSelectedFile(null); 
        setScaleValue(1); 
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

    const handleSaveAvatar  = async () => {
        if (avatarEditorRef.current) {
            const canvasScaled = avatarEditorRef.current.getImageScaledToCanvas();

            canvasScaled.toBlob(async blob => {
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
                    fetchAvatarUrl(); 
                } catch (error) {
                    console.error('Avatar upload failed:', error);
                }
            }, 'image/jpeg');
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            <input
                type="file"
                onChange={(event) => {
                    setSelectedFile(event.target.files[0]);
                    setEditorOpen(true);
                }}
                onClick={(event) => { event.target.value = null; }}
            />
            <AvatarChangeModal
                isOpen={editorOpen}
                onClose={closeModal}
                imageSrc={selectedFile ? URL.createObjectURL(selectedFile) : null}
                onSave={handleSaveAvatar}
                username={username}
            />
            {avatarUrl && (
                <img src={avatarUrl} alt="User Avatar" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
            )}
        </div>
    );
};

export default Settings;