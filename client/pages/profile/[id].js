import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { CardProfile } from '@/components/Cards/CardProfile';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [publicCardsets, setPublicCardsets] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                fetchUserData(user.uid);
            } else {
                setUser(null);
            }
        });
    }, []);


    const fetchUserData = async (firebaseId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getuser`, { params: { firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
            fetchPublicCardsets(userData.id);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const fetchPublicCardsets = async (userId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets`);
            const cardsets = response.data.cardsets.filter(cardset => cardset.isPublic);
            setPublicCardsets(cardsets);
        } catch (error) {
            console.error('Error fetching public cardsets:', error);
        }
    }

    return (
        <div className='wrapper'>
            <Navbar userId={userData?.id} />
            <div className="mt-4">
                <div className={styles.profileContainer}>
                    <div className={styles.profileSidebar}>
                        <div className={styles.userAvatar}>
                            <img src="/userAvatar.jpg" alt="User Avatar" className={styles.avatarImage} />
                        </div>
                        <button className={styles.addButton}>Add Friend</button>
                        <div className={styles.friendList}>
                            <h2>Friends</h2>
                            <ul>
                                <li>Friend 1</li>
                                <li>Friend 2</li>
                                <li>Friend 3</li>
                            </ul>
                        </div>
                    </div>
                    <div className="container">
                        <h1 className={styles.cardSetTitle}>{`${userData?.username}'s Card Sets`}</h1>
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

}

export default Profile;
