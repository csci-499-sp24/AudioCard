import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { CardProfile } from '@/components/Cards/CardProfile';
import FriendRequestButton from '@/components/FriendRequestButton';
import FriendList from '@/components/FriendList';
import { useDarkMode } from '../../utils/darkModeContext';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isDarkMode } = useDarkMode();
    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [publicCardsets, setPublicCardsets] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchCurrentUserData(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (id) {
                await fetchUserProfile(id);
                await fetchPublicCardsets(id);
            }
        };

        fetchInitialData();
    }, [id]);

    const fetchCurrentUserData = async (firebaseId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getuser`, {
                params: { firebaseId }
            });
            if (response.data && response.data.user) {
                setCurrentUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching current user data:', error);
        }
    };

    const fetchUserProfile = async (profileUserId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${profileUserId}`);
            const profileData = response.data.user;
            setProfileUser(profileData);
            await fetchAvatarUrl(profileData.username);
        } catch (error) {
            console.error('Error fetching profile user data:', error);
        }
    };

    const fetchPublicCardsets = async (userId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets`);
            const cardsets = response.data.cardsets.filter(cardset => cardset.isPublic);
            setPublicCardsets(cardsets);
        } catch (error) {
            console.error('Error fetching public cardsets:', error);
        }
    };

    const fetchAvatarUrl = async (username) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setAvatarUrl(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar URL:', error);
            setAvatarUrl('/userAvatar.jpg');
        }
    };

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };

    const shouldShowFriendRequestButton = currentUser && profileUser && currentUser.id !== Number(profileUser.id);

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={currentUser?.id} />
            <div className="mt-4">
                <div className={styles.profileContainer}>
                    <div className={styles.profileSidebar}>
                    <img src={avatarUrl} onError={setDefaultAvatar} alt="User Avatar" className={styles.avatarImage} />
                        {shouldShowFriendRequestButton && (
                            <FriendRequestButton
                                currentUserId={currentUser.id}
                                profileUserId={profileUser.id}
                            />
                        )}
                        <div className={styles.friendList}>
                            <FriendList userId={profileUser?.id} />
                        </div>
                    </div>
                    <div className="container">
                        <h1 className={styles.cardSetTitle}>{`${profileUser?.username}'s Public Card Sets`}</h1>
                        <div className="row">
                            {publicCardsets.map(cardset => (
                                <CardProfile key={cardset.id} cardset={cardset} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
