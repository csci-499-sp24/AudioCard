import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CardViewTestMode } from '@/components/Test Mode/CardViewTestMode';
import axios from 'axios';
import { auth } from '@/utils/firebase';
import styles from '../../styles/testmode.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

const TestPage = () => {
    const {isDarkMode} = useDarkMode;
    const router = useRouter();
    const { id } = router.query; // This is the ID of the cardset
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [cardsetData, setCardsetData] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if (!userData) {
            fetchUserData();
        }
        return () => unsubscribe();
    }, [user, userData]);

    useEffect(() => {
        if (id) {
            fetchCardset(id);
        }
    }, [id]);

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user: ', error);
        }
    }

    const fetchCardset = async (cardsetId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cardsets/${cardsetId}`);
            setCardsetData(response.data); 
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
    };

    return (
        <div>
            <h1 className={styles.testModeHeading}>Test Mode</h1>
            <button className={styles.exitButton} onClick={() => router.back()}>
                X
            </button>
            {cardsetData && <CardViewTestMode userId={userData?.id} cardset={cardsetData} />}

        </div>
    );
};

export default TestPage;
