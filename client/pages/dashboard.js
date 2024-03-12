import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import styles from '../styles/dashboard.module.css';
import { CreateCardset } from '@/components/CreateCardset';
import axios from 'axios';
import { CardsetView } from '@/components/CardsetView';

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
    const [selectedCardset, setSelectedCardset] = useState(null);

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
        return () => unsubscribe();
    }, [user, userData]);

    useEffect(() => {
        fetchCardsets();
    }, [userData]);
    
    const fetchCardsets = async () => {
        if (!userData || !userData.id) {
            fetchUserData();
            return;
        }
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+`/api/cardsets/${userData.id}`,  {params: { userId: userData.id}});
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
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/users/getuser',  {params: { firebaseId: firebaseId}});
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }

    const handleCreateCardset = () => {
        fetchCardsets();
    }

    const selectCardset = (cardset) => {
        setSelectedCardset(cardset);
    }

    const navigateTo = (path) => {
        setMenuOpen(false);
        router.push(path);
    };

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    const [showCreateCardsetForm, setShowCreateCardsetForm] = useState(false);

    // Function to toggle the visibility of the CreateCardset form
    const toggleCreateCardsetForm = () => {
      setShowCreateCardsetForm(!showCreateCardsetForm);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <button className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} onClick={toggleMenu}>☰</button>
                <h1 className={styles.brandName}>AudioCard</h1>
                <button className="btn btn-secondary btn-large" onClick={() => { auth.signOut(); router.push('/login'); }}>Logout</button>
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
                    <button className="btn btn-secondary btn-large" onClick={toggleCreateCardsetForm}>Make Card Set</button>
                </div>
                <div className={`rounded p-4 ${styles.cardsetsContainer}`}>
                    {cardsets.map((cardset, index) => {
                        return <div key={index} className={styles.cardset} onClick={()=> selectCardset(cardset)}>{cardset.title}</div>
                    })}
                </div>
                {showCreateCardsetForm && <CreateCardset userId={userData?.id} onCreateCardset={handleCreateCardset}/>}
                {selectedCardset && <CardsetView cardset={selectedCardset}/>}
            </div>
        </div>
    );
};
export default Dashboard;
