import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebase';
import Link from 'next/link';
import Image from "next/image";
import styles from '../../styles/navbar.module.css';
import { useDarkMode } from '../../utils/darkModeContext';
import userDark from '../../assets/images/user-dark-24.png';
import userLight from '../../assets/images/user-light-24.png';
import axios from 'axios';

const LandingPageNavbar = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
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
                
                <a class="navbar-brand" href="#" className={`navbar-brand text-dark font-weight-bold ${isDarkMode && 'text-white'}`} id={styles.navLinkLogoLanding}>AudioCard</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarScroll">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className="nav-item">
                            <button className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink} onClick={toggleDarkMode}>
                                {isDarkMode ? <i className="bi bi-sun" id={styles.navIconModeLanding}></i> : <i className="bi bi-moon" id={styles.navIconModeLanding}></i>}
                            </button>
                        </li>

                        <li className="nav-item">
                            <Link href="/login" className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink}>
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default LandingPageNavbar;
