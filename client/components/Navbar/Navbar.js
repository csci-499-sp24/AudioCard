import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebase';
import Link from 'next/link';
import styles from '../../styles/navbar.module.css';

const Navbar = ({ userId }) => {

    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" id={styles.navbar}>
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
                    <Link href="/dashboard" className='navbar-brand text-white font-weight-bold' id={styles.navLinkLogo}>
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
                            <a className="nav-link text-dark" id={styles.navLink} href="#">Dark</a>
                        </li>
                        <li className="nav-item text-center">
                            <a className="nav-link text-dark" id={styles.navLink} href="#">Settings</a>
                        </li>
                        <button className="btn" id={styles.navLink}
                            onClick={() => { auth.signOut(); router.push('/login'); }}
                        >
                            Logout
                        </button>
                        <li className="nav-item">
                            <div className={styles.navUserAvatar} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <img src="/userAvatarSmall.jpg" alt="User Avatar" className={styles.avatarImage} />
                            </div>
                            {isDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <Link href={`/profile/${userId}`} className={styles.dropdownItem}>
                                        Profile
                                    </Link>
                                    <Link href="/settings" className={styles.dropdownItem}>
                                        Settings
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
