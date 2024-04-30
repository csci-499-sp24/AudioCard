import axios from 'axios';
import { useEffect,useState } from 'react';
import { auth } from '@/utils/firebase';

const useAuth = ()=>{
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid;
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }


    useEffect(()=>{
        fetchUserData()
    },[])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if (!userData) {
            fetchUserData();
        }
        return () => unsubscribe();
    }, [user, userData]);

    return {
        userData
    }
}

export default useAuth