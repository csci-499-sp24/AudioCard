import React, { useState } from 'react';
import styles from '../../styles/navbar.module.css';
import Link from 'next/link';
import LightDarkMode from '../Cards/LightDarkMode'; // Assuming LightDarkMode toggles dark mode

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);

    const navbarStyles = darkMode ? styles.navbarDark : styles.navbarLight;

    return (
        <nav className={`navbar navbar-expand-lg ${navbarStyles}`} id={styles.navbar}>
            <div className="container">
                <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/explore" className='nav-link text-dark' id={styles.navLink}>
                                Explore
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="mx-auto order-0">
                    <Link href="/dashboard" className='navbar-brand font-weight-bold' id={styles.navLinkLogo}>
                        AudioCard
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarScroll">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item text-center" id={styles.mobileExploreLink}>
                            <Link href="/explore" className='nav-link text-dark' id={styles.navLink}>
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item text-center">
                            <LightDarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
                        </li>
                        <li className="nav-item text-center">
                            <a className="nav-link text-dark" id={styles.navLink} href="#">Settings</a>
                        </li>
                        <li className="nav-item text-center">
                            <button className="btn" id={styles.navLink} onClick={() => { auth.signOut(); router.push('/login'); }}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
