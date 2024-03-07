import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'; // Import Axios for making HTTP requests

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user account with Firebase Authentication
            await createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
                const firebaseId = userCred.user.uid;
                axios.post(process.env.NEXT_PUBLIC_SERVER_URL+'/api/signup', { firebaseId, username, email });
            });

            // Send user data to the server to add to the database
            //await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+'/api/signup', { , username, email });

            console.log('User signed up successfully');
            // Redirect to the index page after successful signup
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;