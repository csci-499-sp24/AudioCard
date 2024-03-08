import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'; // Import Axios for making HTTP requests
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // first checks if user password field matches the confirm password field
            if (password === confirmPassword) {
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
            }
            else {
                // in case password field doesn't match the confirm password field it will show an error message
                alert("Passwords don't match");
            }
        } catch (error) {
            // Custom error messagses that users will see based the type of error firebase returns
            let userErrorMessage = ''; 

            if (error.code === 'auth/invalid-email') {
                userErrorMessage = 'Invalid Email';
            }
            else if (error.code === 'auth/missing-password') {
                userErrorMessage = 'Missing Password';
            }
            else if (error.code === 'auth/weak-password') {
                userErrorMessage = 'Password should be at least 6 characters';
            }
            else {
                userErrorMessage = 'Wrong User Credentials';
            }

            setError(userErrorMessage);
        }
    };

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
                    <div className="d-flex justify-content-center">
                        <Image src={logo} alt="logo"/>
                    </div>

                    <h2 className="m-4 text-center">Sign Up</h2>
                    { error && 
                        <p className='text-center text-danger'>{error}</p>
                    }
                
                    <form onSubmit={handleSignUp}>
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputEmail1">Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                className="form-control"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputPassword1">Email address</label>
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

                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputPassword1">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                className="form-control"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />                    
                        </div>

                        <div className='text-center mt-4'>
                            <button type="submit" className="btn btn-secondary">Sign Up</button>
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/login" className="link-dark link-offset-2">Login</Link> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
