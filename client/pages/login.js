import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



const Login = () => {
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
            // Redirect to the dashboard page after successful login
            router.push('/dashboard');
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
                        <button onClick={handleGoogleLogin} className="btn btn-secondary">Log in with Google</button>
                    </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/signup" className="link-dark link-offset-2">Sign Up</Link> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
