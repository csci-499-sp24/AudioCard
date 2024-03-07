import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import styles from '../styles/dashboard.module.css';
import { CreateCardset } from '@/components/CreateCardset';
import axios from 'axios';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cardsets', path: '/' },
    { name: 'Search', path: '/' },
    { name: 'Settings', path: '/' },
];

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [cardsets, setCardsets] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if(!userData){
            fetchUserData();
        }
        fetchCardsets();
        return () => unsubscribe();
    }, [user, userData]);

    const fetchCardsets = async () => {
        if (!userData || !userData.id) {
            return;
        }
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/getcardsets',  {params: { userId: userData.id}});
            const cardsetsData = response.data.cardsets;
            setCardsets(cardsetsData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try{
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/getuser',  {params: { firebaseId: firebaseId}});
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }

    const handleCreateCardset = () => {
        fetchCardsets(userData);
    }

    const navigateTo = (path) => {
        setMenuOpen(false);
        router.push(path);
    };

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <button className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} onClick={toggleMenu}>☰</button>
                <h1 className={styles.brandName}>Audiocard</h1>
                <button className={styles.logoutButton} onClick={() => { auth.signOut(); router.push('/login'); }}>Logout</button>
            </div>
            <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} onClick={() => navigateTo(item.path)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                <h1 className={styles.welcome}>Welcome, {user?.email}</h1>
                <div className={styles.cardsetHeader}>
                    <h2 className={styles.cardsetTitle}>Your Cardsets</h2>
                    <button className={styles.createCardsetButton}>Make Card Set</button>
                </div>
                <div className={styles.cardsetsContainer}>
                    {cardsets && 
                    cardsets.map((cardset, index) => {
                        return <div key={index} className={styles.cardset}>{cardset.title} </div>
                    })}
                </div>
                <CreateCardset userId={user?.uid} onCreateCardset={handleCreateCardset}/>

            </div>
        </div>
    );
};
export default Dashboard;
