// FriendRequestButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/profile.module.css';

const FriendRequestButton = ({ currentUserId, profileUserId }) => {
    const [requestStatus, setRequestStatus] = useState('not_friends'); 
    
    useEffect(() => {
        checkFriendship();
    }, [currentUserId, profileUserId]);

    const checkFriendship = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends/${profileUserId}`);
            setRequestStatus(response.data.status); 
        } catch (error) {
            console.error('Error checking friendship status:', error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                friendId: profileUserId
            });
            setRequestStatus('pending');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    
    const cancelFriendRequest = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                data: { friendId: profileUserId }
            });
            setRequestStatus('not_friends');
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    const handleFriendRequest = async () => {
        if (requestStatus === 'pending' || requestStatus === 'not_friends') {
            sendFriendRequest();
        } else if (requestStatus === 'accepted') {
            deleteFriend();
        }
    };

    const deleteFriend = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                data: { friendId: profileUserId }
            });
            setRequestStatus('not_friends');
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };

    const renderButtonContent = () => {
        switch (requestStatus) {
            case 'not_friends':
                return 'Add Friend';
            case 'pending':
                return 'Cancel Friend Request';
            case 'accepted':
                return 'Delete Friend';
            default:
                return 'Add Friend';
        }
    };

    const getButtonStyle = () => {
        let buttonClass = styles.addButton;
        if (requestStatus === 'accepted') {
            buttonClass = `${styles.deleteButton}`; 
        }
        return buttonClass;
    };

    return (
        <button className={getButtonStyle()} onClick={handleFriendRequest}>
            {renderButtonContent()}
        </button>
    );
};

export default FriendRequestButton;
