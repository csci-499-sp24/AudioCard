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
    const [shouldShowFriendRequestButton, setShouldShowFriendRequestButton] = useState(false); 

    useEffect(() => {
        if (id) {
            fetchUserProfile(id);
            fetchPublicCardsets(id);
        }
    }, [id]);

    useEffect(() => {
        if (profileUser && currentUser){
            const shouldShow = currentUser && profileUser && currentUser.id !== Number(profileUser.id);
            setShouldShowFriendRequestButton(shouldShow);
        }
    }, [currentUser, profileUser])

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchCurrentUserData(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);


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

    
    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={currentUser?.id} />
            <div className="mt-4">
                <div className={styles.profileContainer}>
                    <div className={styles.profileSidebar}>
                        <div className={styles.userAvatar}>
                            <img src="/userAvatar.jpg" alt="User Avatar" className={styles.avatarImage} />
                        </div>
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
