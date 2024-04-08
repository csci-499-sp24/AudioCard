import React from 'react';
import { useEffect, useState} from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from '../../styles/navbar.module.css';
import Link from 'next/link';
import axios from 'axios';

export const UserCard = ({ user}) => {
    const {isDarkMode} = useDarkMode();
    const { bgColor, txtColor } = 'red';
    const [userAvatar, setUserAvatar] = useState(''); 
    
    useEffect(() => {
        fetchuserAvatar(user.username); 
    }
    , []);

    const fetchuserAvatar = async (username) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setUserAvatar(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar:', error);
        }
    };

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };

  return (
    <Link className="text-decoration-none col-sm-6 col-md-4 col-lg-3 mb-4" href={`/profile/${user.id}`}>
            <div className="card h-100" style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white', color: isDarkMode ? 'white' : 'black'}}>
                <div className="card-body">
                    <div className='d-flex flex-column align-items-center'>
                                        <img src={userAvatar} onError={setDefaultAvatar} alt="User Avatar" className={styles.navUserAvatar} style={{borderColor: isDarkMode ? 'white': 'black'}} />
                        <h5 className="px-3">{user.username}</h5>
                        <div className='mt-2 mb-3'>
                    <span className="mb-5" style={{ backgroundColor: `${bgColor}`, color: `${txtColor}` }}> {user.email} </span>
                    </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .card:hover {
                    transform: scale(1.03); 
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    transition: transform 0.3s ease, box-shadow 0.3s ease; 
                }
            `}</style>
    </Link>
    
    )
}
