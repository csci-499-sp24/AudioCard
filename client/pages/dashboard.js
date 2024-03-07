import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import styles from '../styles/dashboard.module.css';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cardsets', path: '/' },
    { name: 'Settings', path: '/' },
];

const Dashboard = () => {
    const [user, setUser] = useState(null);
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
        router.push(path);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.menu}>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} onClick={() => navigateTo(item.path)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default Dashboard;
