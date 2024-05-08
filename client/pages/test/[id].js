import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CardViewTestMode } from '@/components/Test Mode/CardViewTestMode';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { auth } from '@/utils/firebase';
import styles from '../../styles/testmode.module.css';
import { useDarkMode } from '@/utils/darkModeContext';
import { AuthContext } from  "../../utils/authcontext"
import React, { useContext } from 'react';
const TestPage = () => {
    const {isDarkMode} = useDarkMode(); 
    console.log(isDarkMode);
    const router = useRouter();
    const { id } = router.query; // This is the ID of the cardset
    const user = useContext(AuthContext).user;
    const [userData, setUserData] = useState(null);
    const [cardsetData, setCardsetData] = useState(null);

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        }
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
            <h1 className="text-center mt-5">Test Mode</h1>
            <button className={styles.exitButton} style={{color: isDarkMode? 'white': 'black'}} onClick={() => router.back()}>
                &times;
            </button>
            {cardsetData && <CardViewTestMode userId={userData?.id} cardset={cardsetData} />}

        </div>
    );
};

export default TestPage;
