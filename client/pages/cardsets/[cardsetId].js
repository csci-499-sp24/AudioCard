import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Flashcard } from '../../components/Flashcard';
import { CardsetView } from '../../components/CardsetView';
import { auth } from '../../utils/firebase';

export default function CardsetPage () {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [showCreateFlashcardForm, setShowCreateFlashcardForm] = useState(false);

    const cardsetId = router.query.cardsetId; // get current cardset Id from route
    const cardsetTitle = router.query.cardsetTitle; // get current cardset title from route's query prop
    const cardsetSubject = router.query.cardsetSubject; // get current cardset subject route's query prop

    useEffect(() => {
        fetchFlashCards();
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
    };

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/flashcards/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    // Render flashcard data
    return (
        <div className='wrapper'>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col mt-5 mb-2">
                        <h1 className="text-center">{cardsetTitle}</h1>
                    </div>
                </div>       
            </div>

            <CardsetView cardset={currentCardsetData} userId={userData?.id} cardsetId={cardsetId} />
        </div>
    );
}
