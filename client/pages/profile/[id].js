import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '@/styles/profile.module.css';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

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

    return (
        <div className='wrapper'>
            <Navbar userId={userData?.id} />
            <h1>Profile</h1>
            <p>Profile ID: {id}</p>
        </div>
    );
}

export default Profile;