import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from "next/image"; 
import logo from '../assets/images/logo.png';

const UpdateUsername = () => {
    const [updatedUsername, setupdatedUsername] = useState('');
    const [error, setError] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const router = useRouter(); // Initialize useRouter hook

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        
        if (updatedUsername.length === 0) {
            setError('Username cannot be empty');
            return;
        }

        if (!(/^[a-zA-Z0-9_\-.]+$/.test(updatedUsername))) {
            setError('Username can only contain alphanumeric characters, underscores, dots and hyphens');
            return;
        }

        const usernameExistsResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/usernameCheck?username=${updatedUsername}`);
        const { exists } = usernameExistsResponse.data;

        if (exists) {
            setError('Username already exists');
            return;
        }

        setError(null);

        // add username to DB
        const result = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/changeUsername`, { updatedUsername });
        console.log(result);
    };

    return (
        <div className="container">
            <div className="row mt-5 justify-content-md-center">
                <div className="col col-md-4 col-sm-12">
                    <div className="d-flex justify-content-center">
                        <Image src={logo} alt="logo"/>
                    </div>

                    <h2 className="m-4 text-center">Update Username</h2>

                    { error && 
                        <p className='text-center text-danger'>{error}</p>
                    }

                    { isAlertVisible &&  
                        <div className="alert alert-success text-center" role="alert">
                           { alert }
                        </div>
                    }
                    
                    <form onSubmit={handleUpdateUsername}>
                        <div className="form-group mb-3">
                            <label className="mb-1" htmlFor="exampleInputEmail1">New Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={updatedUsername}
                                className="form-control"
                                onChange={(e) => setupdatedUsername(e.target.value)}
                            />                        
                        </div>

                        <div className='text-center mt-4'>
                            <button type="submit" className="btn btn-secondary">Update Username</button>
                        </div>
                    </form>
                    
                    <div className='text-center mt-4'>
                        <Link href="/settings" className="link-dark link-offset-2">Back to Settings</Link> 
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default UpdateUsername;