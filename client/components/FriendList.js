import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

const FriendList = ({userId}) => {
    const [friends, setFriends] = useState([]);
    const router = useRouter();
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        fetchFriends();
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends`);
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const navigateToUserProfile = (friendId) => {
        router.push(`/profile/${friendId}`);
    };

    return (
        <div className={styles.friendList}>
        <h2>Friends</h2>
        <ul className={styles.friendListUl}>
            {friends.map((friend) => (
                <li key={friend.id} className={isDarkMode ? styles.darkFriendListItem : styles.friendListItem } onClick={() => navigateToUserProfile(friend.id)}>
                    <div className={styles.friendAvatar}>
                        <img src="/userAvatar.jpg" alt="User Avatar"/>
                    </div>
                    <span className={styles.friendName} style={{}}>{friend.username}</span>
                </li>
            ))}
        </ul>
    </div>
    );
}

export default FriendList;