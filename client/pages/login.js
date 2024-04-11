import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'; // Import Axios for making HTTP requests
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDarkMode } from '@/utils/darkModeContext';



const Login = () => {
    const {isDarkMode} = useDarkMode();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize useRouter hook

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in successfully');
            // Redirect to the index page after successful login
            router.push('/dashboard');
        } catch (error) {
            // Custom error messagse that users will see based the type of error firebase returns
            let userErrorMessage = ''; 

            if(error.code === 'auth/invalid-email') {
                userErrorMessage = 'Wrong Email';
            }
            else if (error.code === 'auth/missing-password') {
                userErrorMessage = 'Missing Password';
            }
            else if(error.code === 'auth/wrong-password') {
                userErrorMessage = 'Wrong Password';
            }
            else {
                userErrorMessage = 'Wrong User Credentials';
            }

            setError(userErrorMessage);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // The signed-in user info.
            const user = result.user;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getuserbyemail`, {params:{email: user.email}});
            if (!response.data.user){
                const createNewUser = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`, {
                    username: user.displayName,
                    email: user.email,
                    firebaseId: user.uid
                });
                if (createNewUser){
                    console.log("User entry created in DB");
                } else {
                    console.log("Error creating user DB entry");
                }
            }
            // Redirect to the dashboard page after successful login
            if (user) {
            router.push('/dashboard');
            }
        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // Set the error message
            setError(errorMessage);
        }
    };

    const clearFields = () => {
        setEmail('');
        setPassword('');
    };

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
                    <div className="d-flex justify-content-center">
                        <Image src={logo} alt="logo"/>
                    </div>

                    <h2 className="m-4 text-center">Login</h2>
                    { error && 
                        <p className='text-center text-danger'>{error}</p>
                    }
                   
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputEmail1">Email address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                            />                        
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputPassword1">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                            />                        
                        </div>

                        <div className='text-end mt-3'>
                            <Link href="/forgot-password" className='link-secondary link-underline-opacity-0'>
                                Forgot Password?
                            </Link>
                        </div>

                        <div className='text-center mt-4'>
                            <button type="submit" className="btn btn-secondary">Login</button>
                        </div>

                        {/* Google Log in */}
                        <div className='text-center mt-4'>
                    <button onClick={() => { clearFields(); handleGoogleLogin(); }}  className="gsi-material-button">
                    <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                            <div className="gsi-material-button-icon">
                             <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: "block"}}>
                             <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                             <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                             <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                                 </svg>
                                </div>
                                <span className="gsi-material-button-contents">Log in with Google</span>
                             </div>
                            </button>
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <div className='col d-flex justify-content-center'>
                            <div className='me-2'>Don&apos;t have an account? </div>
                            <Link href="/signup" className={`${isDarkMode ? 'link-light' : 'link-dark'} link-offset-2`}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;