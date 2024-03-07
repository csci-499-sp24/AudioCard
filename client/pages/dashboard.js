import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import styles from '../styles/dashboard.module.css';
import { CreateCardset } from '@/components/CreateCardset';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cardsets', path: '/' },
    { name: 'Search', path: '/' },
    { name: 'Settings', path: '/' },
];

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

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
                    <div className={styles.cardset}>CARDSET TITLE</div>
                    <div className={styles.cardset}>CARDSET TITLE</div>
                    <div className={styles.cardset}>CARDSET TITLE</div>
                </div>
                <CreateCardset userId={user?.uid}/>

            </div>
        </div>
    );
};
export default Dashboard;
