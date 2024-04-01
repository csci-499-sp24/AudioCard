import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebase';
import Link from 'next/link';
import Image from "next/image"; 
import styles from '../../styles/navbar.module.css';
import { useDarkMode } from '../../utils/darkModeContext';
import Notification from '../Notification'
import userDark from '../../assets/images/user-dark-24.png';
import userLight from '../../assets/images/user-light-24.png';

const Navbar = ({ userId }) => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'bg-dark' : 'bg-body-tertiary'}`} id={styles.navbar}>
            <div className="container">
                <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/explore" className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink}>
                                Explore
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="mx-auto order-0">
                    <Link href="/dashboard" className={`navbar-brand text-white font-weight-bold ${isDarkMode && 'text-light'}`} id={styles.navLinkLogo}>
                        AudioCard
                    </Link>
                    <button className={`navbar-toggler ${isDarkMode && 'navbar-dark'}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarScroll">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className={isDarkMode ? 'text-white' : 'text-dark'} id={styles.mobileExploreLink}>
                            <Link href="/explore" className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'}>
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Notification userId={userId} />
                        </li>

                        <li className="nav-item">
                            <button className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink} onClick={toggleDarkMode}>
                                {isDarkMode ? <i className="bi bi-sun" id={styles.navIconMode}></i> : <i className="bi bi-moon" id={styles.navIconMode}></i>}
                            </button>
                        </li>

                        <li className="nav-item">
                            <button className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink}  onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {isDarkMode ? <i className="fa-solid fa-circle-user" id={styles.navIconUser}></i> : <i className="fa-solid fa-circle-user"  id={styles.navIconUser}></i>}
                            </button>

                            <div ref={dropdownRef}>
                                {isDropdownOpen && (
                                    <div className={styles.dropdownMenu} style={{ backgroundColor: isDarkMode ? '#252526' : 'white' }}>
                                        <Link href={`/profile/${userId}`} className={isDarkMode ? styles.darkDropdownItem : styles.dropdownItem}>
                                            Profile
                                        </Link>
                                        <Link href="/settings" className={isDarkMode ? styles.darkDropdownItem : styles.dropdownItem}>
                                            Settings
                                        </Link>
                                        <Link href="/login" className={isDarkMode ? styles.darkDropdownItem : styles.dropdownItem}
                                            onClick={() => { auth.signOut(); router.push('/login'); }}
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
