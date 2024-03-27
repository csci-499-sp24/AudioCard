import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { auth } from '../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        let userErrorMessage;

        try {
            if (email) {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getuserbyemail`, {
                    params: { email }
                });

                if (response.data && response.data.user) {
                    await sendPasswordResetEmail(auth, email);
                    console.log('Email was sent');
                    setError('');
                }
            }
        } catch (error) {
            userErrorMessage = "Couldn't send reset email"; 
            setError(userErrorMessage);
        }
    }

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
                    <div className="d-flex justify-content-center">
                        <Image src={logo} alt="logo"/>
                    </div>

                    <h2 className="m-4 text-center">Forgot Password</h2>

                    { error && 
                        <p className='text-center text-danger'>{error}</p>
                    }
                   
                    <form onSubmit={handleReset}>
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
                        
                        <div className='text-center mt-4'>
                            <button type="submit" className="btn btn-secondary">Send Reset Link</button>
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/login" className="link-dark link-offset-2">Back to Login</Link> 
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default ForgotPassword;
